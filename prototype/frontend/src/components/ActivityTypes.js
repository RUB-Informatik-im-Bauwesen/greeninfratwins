//created on 2025-04-28

import React, { useEffect, useState, useContext} from "react";
import axios from "axios";
import { AppContext } from "../AppProvider";


const Activities = () => {
  const { containerId, projectId, isLoggedIn, setIsLoggedIn, ifcFiles,
    ifcViewerFiles, loadedModels, highlightedElements, 
    fragments,
    indexer, highlighter
  } = useContext(AppContext);

  //New added for activity types, 2025-04-28
  const [activityJsonData, setActivityJsonData] = useState(null);
  const [displayActivityJsonData, setDisplayActivityJsonData] = useState(null);// Display ActivityJsonData,  2025-04-28
  const [selectedModels, setSelectedModels] = useState([]); //Handle target models (checklist),  2025-05-05

  //New added for activity ontology, 2025-05-12
  const [actOntologyJsonData, setActOntologyJsonData] = useState(null);
  const [displayActOntologyJsonData, setDisplayActOntologyJsonData] = useState(null);// Display actOntologyJsonData,  2025-05-12

  const activitiesPSetName = "GrIT-Activity-Data"; // 2025-05-05

  //New added for model selection,  2025-05-05
  // Keep selectedItems in sync when loadedModels changes
  useEffect(() => {
    // Optionally preserve selection if items are still valid
    /*setSelectedModels(prev =>
      loadedModels
        .map(model => model.name)
        .filter(name => prev.includes(name))
    );*/
    // Select all models by default when loadedModels changes
    setSelectedModels(loadedModels);
    console.log("Loaded models:", loadedModels)
  }, [loadedModels]);

    //New added for handling model selection checklist,  2025-05-05
  const handleToggle = (model) => {
    const isSelected = selectedModels.some(item => item.id === model.id);
    if (isSelected) {
      // Uncheck: remove from selectedModels
      setSelectedModels(prev => prev.filter(item => item.id !== model.id));
      model.visible = !model.visible;
    } else {
      // Check: add back to selectedModels
      setSelectedModels(prev => [...prev, model]);
      model.visible = !model.visible;
    }
  };

  //New added for model selection checklist,  2025-05-05
  const isChecked = (model) =>
    selectedModels.some(item => item.id === model.id);

  const handleLoadActivitiesJson = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const result = JSON.parse(event.target.result);
        setActivityJsonData(result);
        console.log("Show loaded JSON data: ", result);
      } catch (err) {
        console.error("Error parsing JSON:", err);
      }
    };
    reader.readAsText(file);
  };

  
  const handleGeneratedActivitiesJson = async () => {
    // Define the JSON data 
    const activitiesDataTemp = {
      container: "",
      ifcFiles: [],
      activities: [
        {
          type: "",
          guids: []
        }
      ]
    };
      
    activitiesDataTemp.container = containerId;
    activitiesDataTemp.ifcFiles = selectedModels.map(model => model.name);  
    
    //First, find all the elements with "ActivityType"  
    console.log("Show containerId, selectedModels: ", containerId, selectedModels);

    for (const model of selectedModels) {
      try {
        //Current solution: 1) Get all the properties in models;
        const allProperties =  Object.entries(model._properties);
        console.log("allProperties:", allProperties);

        // 2) Find all the properties with the desired PropertySet called "GrIT-Activity-Data"; 
        allProperties.forEach(async ([key, activityElement], pindex) => {
          if(activityElement?.Name?.value === activitiesPSetName)
          {
            console.log("Matched PropertySet:", activityElement);
            const actElementEid = activityElement?.expressID;
            console.log("activityElement HasProperties:", activityElement?.HasProperties);

            //3) Find all ActivityType inside the PSet
            Object.entries(activityElement?.HasProperties).forEach(async ([key2, actPropertyEach], index2) => 
            {
              const actPropertyID = actPropertyEach.value;
              console.log("actPropertyID:", actPropertyID);
              const actProperty = await model.getProperties(actPropertyID);
              console.log("each actProperty: ", actProperty);
              if(actProperty?.Name?.value === "ActivityType"){
                console.log("Found ActivityType actProperty: ", actProperty);

                //4) Get the value of each ActivityType
                const currentActivityType = actProperty.NominalValue?.value;
                console.log("Found ActivityType: ", currentActivityType);

                //5) Get its parent GUID
                const psetDefinitions = indexer.getEntitiesWithRelation(
                  model,
                  "IsDefinedBy",
                  actElementEid,
                );
                console.log("psetDefinitions: ", psetDefinitions);
                if(psetDefinitions.size>0){
                  const actParentID = [...psetDefinitions][0];
                  //const actParentID = Object.entries(psetDefinitions).at(0);
                  console.log("actParentID: ", actParentID);
                  const actParent = await model.getProperties(actParentID);
                  console.log("actParent: ", actParent);
                  const psGuid = actParent?.GlobalId?.value;
                  console.log("activityElement GUID:", psGuid);

                  //Check if this currentActivityType is already in activitiesDataTemp
                  const existingActivity = activitiesDataTemp.activities.find(
                    act => act.type === currentActivityType
                  );


              
                  if (existingActivity) {
                    // Avoid duplicates
                    if (!existingActivity.guids.includes(psGuid)) {
                      existingActivity.guids.push(psGuid);
                    }
                  } else {
                    activitiesDataTemp.activities.push({
                      type: currentActivityType,
                      guids: [psGuid]
                    });
                  }

                }
              }

            });
               
          }

        });
        
        //allBimResults.push(newBimResult);
        //setBimResults(allBimResults);
        
      } catch (error) {
        console.error(`Error processing model ${model.name} for activities:`, error);
      }
    }


    setActivityJsonData(activitiesDataTemp);
    console.log("Show generated JSON data: ", activitiesDataTemp);
  };

  //Call thatopen library and handle highlight event here,  2025-04-28
  async function highlightElementsByGuids(guids) {

    console.log("Print guids: ", guids);

    //get FragmentIdMap from guids
    const fragmentIdMap = await fragments.guidToFragmentIdMap(guids);
    console.log("Print fragmentIdMap: ", fragmentIdMap);

    if (Object.keys(fragmentIdMap).length > 0) {
      console.log("Print highlighter: ", highlighter);
      await highlighter.highlightByID("ActivitySelection", fragmentIdMap, true, true);
    }
  }

  //Export the generated JSON,  2025-04-28
  const handleExportJson = () => {
    const jsonString = JSON.stringify(displayActivityJsonData, null, 2); // Pretty format with 2-space indentation
  
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
  
    const link = document.createElement("a");
    link.href = url;
    link.download = "generatedActivities.json"; // Default filename
    document.body.appendChild(link);
    link.click();
  
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Use useEffect to update displayActivityJsonData whenever activityJsonData changes
  useEffect(() => {
      setDisplayActivityJsonData(activityJsonData);
    }, [activityJsonData]);

  //Quary Activity Ontology,  added, 2025-05-12
  const queryActivity = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Authentication token is missing.');
      }

      const query = `
        PREFIX grit: <https://greeninfratwins.com/ns/grit#>
        SELECT ?activityName WHERE {  ?pActivity a grit:Activity ; rdfs:label ?activityName } 
      `;

      if (!containerId) {
        throw new Error('Container ID is required.');
      }

      const url = `https://icdd.vm.rub.de/dev01/api/v1/projects/${projectId}/containerTypes/0/containers/${containerId}/query?query=${encodeURIComponent(query)}`;
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const files = await response.json();

      setActOntologyJsonData(files);
      console.log("Print Activity Ontology data: ", files);

    } catch (err) {
      console.error('Error fetching measure variants:', err.message);
    }
  };

  // Use useEffect to update displayActOntologyJsonData whenever actOntologyJsonData changes
  useEffect(() => {
    setDisplayActOntologyJsonData(actOntologyJsonData);
  }, [actOntologyJsonData]);

  // A recursive function to render JSON flexibly,  2025-04-28
  const renderJson = (data) => {
    if (typeof data === 'object' && data !== null) {
      if (Array.isArray(data)) {
        return (
          <ul>
            {data.map((item, index) => (
              <li key={index}>{renderJson(item)}</li>
            ))}
          </ul>
        );
      } else {
        return (
          <ul>
            {Object.entries(data).map(([key, value]) => (
              <li key={key}>
                <strong>{key}:</strong> {renderJson(value)}
              </li>
            ))}
          </ul>
        );
      }
    } else {
      // If it's a simple value (string, number, etc.)
      return <span>{String(data)}</span>;
    }
  };

/*async function setHighlightElement(e) {
    const highlightElemntGuid = e.target.value;
    console.log("Element to highlight: ", highlightElemntGuid);
    

    try {
      //get FragmentIdMap from guids
      const fragmentIdMap = await fragments.guidToFragmentIdMap(highlightElemntGuid);
      console.log("Print fragmentIdMap: ", fragmentIdMap);

      if (Object.keys(fragmentIdMap).length > 0) {
        await highlighter.highlightByID("ActivitySelection", fragmentIdMap, true, true);
      }
    } catch (error) {
      console.error(`Error highlighting element ${highlightElemntGuid}:`, error);
    }
  };*/

  return (
    <div>
        {/*<h3>Look for a BIM element</h3>
         PropertySet Name Input 
        <label>
          GUID:
          <input
            type="text"
            placeholder="Enter GUID for highlighting: "
            onChange={setHighlightElement}
          />
        </label>

        <br></br><br></br>*/}

        <h3>Activities</h3>
        {/* New added for model selection checklist,  2025-05-05 */}
        <h4>Checklist</h4>
        <ul style={{ listStyle: 'none', padding: 0 }}>
        {loadedModels.map((model, index) => (
          <li key={index}>
            <label>
              <input
                type="checkbox"
                checked={isChecked(model)}
                onChange={() => handleToggle(model)}
              />
              {model.name}
            </label>
          </li>
        ))}
      </ul>

      <h5>Selected Models:</h5>
      {selectedModels.length > 0 ? (
        <ul>
          {selectedModels.map((model, index) => (
            <li key={index}>
              <strong>Name:</strong> {model.name}
            </li>
          ))}
        </ul>
      ) : (
        <p>No models selected.</p>
      )}

        {/* Generate Button */}
        <h5>Option 1: </h5>
        <h6>Search and generate activities from the selected IFC model(s)</h6>
        <button onClick={handleGeneratedActivitiesJson}>Generate activities in JSON</button>
        <br></br><br></br>

        <h5>Option 2: </h5>
        <h6>Load activities (in JSON format) for the selected IFC model(s)</h6>
        {/* Load Button */}
        <input type="file" accept=".json" onChange={handleLoadActivitiesJson} />


        <br></br><br></br>
        <h5>-------Display Results------</h5>
        {displayActivityJsonData? (
            <>
                <div style={{ marginTop: "1rem" }}>

                  Container Name: {displayActivityJsonData.container}
                  <br />
                  File Name: {displayActivityJsonData.ifcFiles.map}
                  <ul>
                      {displayActivityJsonData.ifcFiles.map((ifcFile, ifcIndex) => (
                        <li key={ifcIndex}>{ifcFile}</li>
                      ))}
                  </ul>

                  {displayActivityJsonData.activities.map((activity, idx) => (
                    activity.type !== "" && (
                    <div key={idx} style={{ marginBottom: "1rem"}}>
                      <strong>Activity:</strong> {activity.type}
                      
                      {/* Add spacing here */}
                      <span style={{ display: "inline-block", width: "1rem" }}></span>

                      {/* Highlight button for all GUIDs in this activity */}
                      <button 
                      onClick={() => highlightElementsByGuids(activity.guids)}
                      >
                      Highlight these elements
                      </button>

                      <ul>
                      {activity.guids.map((guid, guidIndex) => (
                        <li key={guidIndex}>{guid}</li>
                      ))}
                      </ul>

                    </div>
                    )))}
                </div>

                <button onClick={handleExportJson} style={{ marginBottom: "1rem" }}>
                    Export JSON
                </button>
            </>
        ) : (
            <p>No Activities' JSON generated.</p>
        )}

      <br></br><br></br>
      <h4>Ontology</h4>
      <button onClick={queryActivity} style={{ marginBottom: "1rem" }}>
                    Query Activity
      </button>
      <h5>-------Ontology Query Results------</h5>
      {/* Display Ontology Result */}
      {displayActOntologyJsonData ? renderJson(displayActOntologyJsonData) : <p>No Ontology results found.</p>}
    </div>

  );
};

export default Activities;