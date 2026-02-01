//Xuilng created on 2025-02-18

import React, { useEffect, useState, useContext} from "react";
import axios from "axios";
import { AppContext } from "../AppProvider";

const Calculator = () => {
  const { containerId, projectId, isLoggedIn, setIsLoggedIn, ifcViewerFiles, loadedModels, highlightedElements, indexer } = useContext(AppContext);
  const [formula, setFormula] = useState("volume*epd*20");
  const [values, setValues] = useState({ volume: 1.05784, epd: 2.05673 });
  const [calResult, setCalResult] = useState(null);
  const [displayCalResult, setDisplayCalResult] = useState(null);
  const [error, setError] = useState("");
  const [calObjectType, setCalObjectType] = useState("Fahrbahn");
  const [calPSetName, setCalPSetName] = useState("EPD und Materialkosten");
  const [calPropertyName, setCalPropertyName] = useState("Masse");
  const [bimResults, setBimResults] = useState([]); //Store a list of BIM elements as requested in jason array format { guid: "", value: }
  const [displayBimResults, setDisplayBimResults] = useState([]);// Display BimResults,  2025-03-04


  const handleCalculate = async () => {
    try {
      const response = await axios.post(
        "http://localhost:4000/calculate",
        new URLSearchParams({
          formula,
          values: JSON.stringify(values), // Convert values to string
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "*/*",
          },
        }
      );

      setCalResult(response.data);
      console.log("Called handleCalculate: ", response.data);
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to calculate formula.");
    }
  };

  
  const handleBIMCalculate = async () => {
    //First, find the desird BIM elements, return their GUIDs and property values
    console.log("Models loaded in Calculator:", loadedModels);
    //Find by objectType:
    const allBimResults = [];
    //Add all values in bimResults together
    const newValues = { value : 0 };
    for (const model of loadedModels) {
      try {
        //Current stupid solution: 1) Get all the properties in models;
        const allProperties =  Object.entries(model._properties);
        console.log("allProperties:", allProperties);
        console.log(`calObjectType: ${calObjectType}`);
        // 2) Find all the properties with the desired calObjectType; 
        const newBimResult = {guid:"", value:0.0};
        allProperties.forEach(async ([key, calBimElement], pindex) => {
          //console.log("Print each calBimElement:", calBimElement);
          if(calBimElement.ObjectType?.value === calObjectType)
          {
            console.log(`This BIM element for calculation has the calObjectType ${calObjectType}:`,calBimElement);
            newBimResult.guid = calBimElement.GlobalId?.value;
            console.log("current newBimResult:", newBimResult);
            // 3) In each calBimElement, find its propertysets with desired calPSetName;
            const calPSets = indexer.getEntityRelations(model, calBimElement.expressID, "IsDefinedBy");
            if (calPSets) {
              console.log("all calPSets:", calPSets);
              for (const calPSetID of calPSets) {
                const calPSet = await model.getProperties(calPSetID);
                console.log("each calPSet: ", calPSet);
                if(calPSet.Name?.value === calPSetName){
                  console.log(`Found calPSet with calPSetName ${calPSetName}: `, calPSet);
                  // 4) In this property set, find the value of the desired calPropertyName (value found!)
                  //Only one value for each BIM element???
                  console.log("calPSet HasProperties:", calPSet.HasProperties);
                  Object.entries(calPSet.HasProperties).forEach(async ([key2, calPropertyEach], index2) => {
                    const calPropertyID = calPropertyEach.value;
                    console.log("calPropertyID:", calPropertyID);
                    const calProperty = await model.getProperties(calPropertyID);
                    console.log("each calProperty: ", calProperty);
                    if(calProperty.Name?.value === calPropertyName){
                      console.log("Found calProperty: ", calProperty);
                      newBimResult.value = calProperty.NominalValue?.value;
                      console.log("Found value: ", newBimResult.value);
                      newValues.value += newBimResult.value;
                    }
                  });
                }
              }
            }
          }
        });
        
        allBimResults.push(newBimResult);
        setBimResults(allBimResults);
        
      } catch (error) {
        console.error(`Error processing model ${model.name} for calculator:`, error);
      }
    }

    //Second, calculate them via the caculation service
    const newFormula = "value*5";
    setFormula(newFormula);
    setValues(newValues);
    setCalResult(null);
  };

  const handleValuesChange = (e) => {
    try {
      setValues(JSON.parse(e.target.value)); // Ensure it's valid JSON
      setError("");
    } catch {
      setError("Invalid JSON format.");
    }
  };

  // Use useEffect to update displayBimResults whenever bimResults changes
  useEffect(() => {
    setDisplayBimResults(bimResults);
  }, [bimResults]);

  // Use useEffect to update displayCalResult whenever result changes
  useEffect(() => {
    setDisplayCalResult(calResult);
  }, [calResult]);

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


  return (
    <div>
      <h3>Formula Calculator</h3>

      {/* Formula Input */}
      <label>
        Formula:
        <input
          type="text"
          placeholder="Enter formula (e.g., volume * epd * 20)"
          value={formula}
          onChange={(e) => setFormula(e.target.value)}
        />
      </label>

      {/* Dynamic Input for Values */}
      <label>
        Values (JSON format):
        <input
          type="text"
          placeholder='Enter values as JSON (e.g., {"volume":1.05784,"epd":2.05673})'
          value={JSON.stringify(values)}
          onChange={handleValuesChange}
        />
      </label>

      {/* Calculate Button */}
      <button onClick={handleCalculate}>Calculate</button>

      {/* Display Result */}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {displayCalResult && <p>Result: {displayCalResult.result}</p>}  

      <h4>BIM Elements Calculator</h4>
      
      {/* ObjectType Input */}
      <label>
      ObjectType:
        <input
          type="text"
          placeholder="Enter ObjectType for calculation (e.g., Fahrbahn)"
          value={calObjectType}
          onChange={(e) => setCalObjectType(e.target.value)}
        />
      </label>

      {/* PropertySet Name Input */}
      <label>
      PropertySet Name:
        <input
          type="text"
          placeholder="Enter PropertySet Name for calculation (e.g., EPD und Materialkosten)"
          value={calPSetName}
          onChange={(e) => setCalPSetName(e.target.value)}
        />
      </label>

      {/* Property Name Input */}
      <label>
      Property Name:
        <input
          type="text"
          placeholder="Enter Property Name for calculation (e.g., Masse)"
          value={calPropertyName}
          onChange={(e) => setCalPropertyName(e.target.value)}
        />
      </label>

      {/* Calculate Button */}
      <button onClick={handleBIMCalculate}>Find</button>

      {/* Display BIM Result */}
      {/* {displayBimResults && <p>Result: {JSON.stringify(displayBimResults)}</p>}*/}
      {displayBimResults ? renderJson(displayBimResults) : <p>No BIM results found.</p>}

    </div>

    
  );
};

export default Calculator;