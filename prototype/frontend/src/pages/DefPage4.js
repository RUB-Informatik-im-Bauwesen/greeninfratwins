import React, { useContext, useState, useEffect, useRef } from "react";
import "./Defpage4.css";

// added start,  2025-06-23
import { Link } from 'react-router-dom'; //  added, for basic requirment 11 UI, 2025-06-23 
import { AppContext } from "../AppProvider";
import IfcViewerX from "../components/IfcViewer";
import CalculationResultTab from "../components/CalculationResultTab";
import VisualizationResultTab from "../components/VisualizationResultTab";
import { getHighlightElements, getHighlightElements_Gesamt, writeMaterialRestValueJson, getMaterialRestValueJson } from "../utils/uc4/DE/data";
// added end,  2025-06-23

/* Change start, 11.06.2025*/
const DefPage4 = () => {//{ selectedFile, setSelectedFile }

  // added start, for AWF 4 basic requirment 9 & 10 UI, 2025-06-23
  const { containerId, projectId, currentContainer, setCurrentContainer, /* Store container data, 2025-06-23 */
    ifcFiles, setIfcFiles,
    fragments, highlighter,
  } = useContext(AppContext);

  //Refs for the different material types, 2025-08-20
  const mineralRef = useRef();
  const metalleRef = useRef();
  const kunststoffeRef = useRef();
  const bituminoeseRef = useRef();
  const stichtagRef = useRef();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  // added end, for AWF 4 basic requirment 9 & 10 UI, 2025-06-23

  /*useEffect(() => {
    console.log("Selected file in DetailPage: ", selectedFile);
  }, [selectedFile]);*/
  const [measure, setMeasure] = useState({});
  const [showMeasure, setshowMeasure] = useState('');
  const [description, setDescription] = useState("");
  const [showVerkehr, setshowVerkehr] = useState("");
  const [measureID, setmesaureID] = useState(null);
  const [selectedButton, setSelectedButton] = useState(null);
  const [tabs, setTabs] = useState([{ id: 0, name: "Rückbaumaßnahme" }]); //Changed, id start from 0, for calculation tab of basic requirement 9 UI, 2025-06-23
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const [newTab, setnewTab] = useState('');
  const [RestwertModal, setRestwertModal] = useState('');
  const openmeasure = (index) => {
    setshowMeasure((prev) => !prev);
    setSelectedButton(index);
  };


  useEffect(() => {
    const retrieveMeasure = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('Authentication token is missing.');
        if (!containerId) throw new Error('Container ID is required.');

        const localMeasure = { name: "", description: "", url: "", activity: [] };

        const queryDes = `
            PREFIX grit: <https://greeninfratwins.com/ns/grit#>
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            SELECT *
            WHERE { 
              ?digitalTwin grit:hasAssessment ?assessment.  
              ?assessment grit:hasMeasure ?measure.
              ?measure rdfs:label ?label.
              OPTIONAL{
                
                ?measure rdfs:comment ?description.
              }
            } 
          `;
        const urlDes = `https://icdd.vm.rub.de/dev01/api/v1/projects/${projectId}/containerTypes/0/containers/${containerId}/query?query=${encodeURIComponent(queryDes)}`;
        const responseDes = await fetch(urlDes, { headers: { Authorization: `Bearer ${token}` } });
        if (!responseDes.ok) throw new Error(`HTTP error! Status: ${responseDes.status}`);
        const resultsJson = await responseDes.json();
        console.warn(resultsJson);
        localMeasure.description = resultsJson.results?.bindings[0]?.description?.value || "";
        localMeasure.name = resultsJson.results?.bindings[0]?.label?.value || "";
        localMeasure.url = resultsJson.results?.bindings[0]?.measure?.value || "";

        const queryActivity = `
            PREFIX grit: <https://greeninfratwins.com/ns/grit#>
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            SELECT ?activity ?label ?date ?model ?asset ?assetLabel ?hours ?set ?setlabel ?indicator ?indicatorlabel
            WHERE { 
              <${localMeasure.url}> grit:involvesActivities ?activity .                    
              ?activity rdfs:label ?label .
              OPTIONAL {
              ?activity grit:hasIcddModelID ?model .
              }
                OPTIONAL {
                ?activity grit:hasIndicatorSet ?set.
                ?set rdfs:label ?setlabel .
                ?set grit:hasIndicator ?indicator.
                ?indicator rdfs:label ?indicatorlabel.              
                }
            }
          `;
        const urlActivity = `https://icdd.vm.rub.de/dev01/api/v1/projects/${projectId}/containerTypes/0/containers/${containerId}/query?query=${encodeURIComponent(queryActivity)}`;
        const responseActivity = await fetch(urlActivity, { headers: { Authorization: `Bearer ${token}` } });
        if (!responseActivity.ok) throw new Error(`HTTP error! Status: ${responseActivity.status}`);
        const activityJson = await responseActivity.json();

        const activityMap = {};

        for (const row of (activityJson.results?.bindings || [])) {
          const aUrl = row.activity?.value || "";
          const aLabel = row.label?.value || "";

          // Activity initialisieren (falls noch nicht vorhanden)
          if (!activityMap[aUrl]) {
            activityMap[aUrl] = {
              url: aUrl,
              label: aLabel,
              indicatorsets: []    // [{ uri, label, indicators: [{ uri, label /*, value, unit*/ }] }]
            };
          }


          // ----- Indicator Sets + Indicators (NEU) -----
          const setUri = row.set?.value;
          const setLabel = row.setlabel?.value;
          const indicatorUri = row.indicator?.value;
          const indicatorLabel = row.indicatorlabel?.value;

          if (setUri) {
            // Set-Objekt für diese Aktivität holen/erzeugen
            let setObj = activityMap[aUrl].indicatorsets.find(s => s.uri === setUri);
            if (!setObj) {
              setObj = { uri: setUri, label: setLabel || "", indicators: [] };
              activityMap[aUrl].indicatorsets.push(setObj);
            }

            // Indicator (falls vorhanden) dedupliziert hinzufügen
            if (indicatorUri && !setObj.indicators.some(i => i.uri === indicatorUri)) {
              setObj.indicators.push({
                uri: indicatorUri,
                label: indicatorLabel || ""
                // value: row.val?.value,   // ← optional, falls du das später in der Query holst
                // unit: row.unit?.value
              });
            }
          }

        }

        // Danach in Array überführen + sortieren
        localMeasure.activity = Object.values(activityMap)
          .sort((a, b) => new Date(b.date) - new Date(a.date));

        setMeasure(localMeasure);
      } catch (err) {
        console.error('Error fetching measure variants:', err.message);
      }
    };
    retrieveMeasure();
    console.log("Fetched Measure from server:", measure)
  }, [containerId, projectId, setMeasure]);

  // added, to handle IFC files, 2025-06-23
  useEffect(() => {
    handleIfcFiles(containerId);
  }, []);

  // added start, 2025-05-25
  const handleIfcFiles = async (containerId) => {
    console.log("Container", containerId);
    if (containerId) {
      // Fetch IFC files      
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(
          `https://icdd.vm.rub.de/dev01/api/v1/projects/${projectId}/containerTypes/0/containers/${containerId}/contents`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const files = await response.json();
        console.log('Fetched files:', files);

        if (!Array.isArray(files)) {
          throw new Error('Received data is not in the expected format');
        }

        const ifcFiles = files
          .filter(
            (file) =>
              file &&
              file.Name &&
              file.Name.endsWith('.ifc') &&
              file.Type === 'application/octet-stream' &&
              file.ContainerInternalId
          )
          .map((file) => ({
            ...file,
            url: `https://icdd.vm.rub.de/dev01/api/v1/projects/${projectId}/containerTypes/0/containers/${containerId}/contents/${file.Id}/attachment`,
          }));


        setIfcFiles(ifcFiles); // Update ifcViewerFiles state //update ifcFiles, 2025-03-11
        console.log('Filtered IFC files:', ifcFiles);

      } catch (err) {
        console.error('Error fetching IFC files:', err);

      } finally {

      }
    }
  };// added end, 2025-05-25

  /*//Commented, not allow to add new tab in this way, 2025-06-23
  const addTab = (event) => {
    const tabName = event.target.id;
    const newTab = tabs.length + 1;
    setTabs([...tabs, { id: newTab, name: tabName }])
    setActiveTab(newTab);
  };*/

  //Added, to add calculation tab for basic requirement 9 UI (AWF4), 2025-06-23
  const addCalculationTab = (name, code) => {
    console.log("tab name: ", name);
    const tabID = 1;

    const existingTab = tabs.find(tab => tab.id === tabID);

    if (existingTab) {
      // Update the tab name if different
      if (existingTab.name !== name) {
        const updatedTabs = tabs.map(tab =>
          tab.id === tabID ? { ...tab, name: name } : tab
        );
        setTabs(updatedTabs);
      }

      // Activate the tab
      setActiveTab(tabID);
    } else {
      // Add the new tab and activate it
      setTabs([...tabs, { id: tabID, name: name }]);
      setActiveTab(tabID);
    }
  };

  //Added, to add result visualization tab for basic requirement 10 UI, 2025-06-15
  const addResultVisualizationTab = () => {
    const tabName = "Results visualization";
    const tabID = 2;

    const existingTab = tabs.find(tab => tab.id === tabID);

    if (existingTab) {
      // If the tab already exists, just activate it
      setActiveTab(tabID);
      //For further development: replace the existing data here
    } else {
      // Add the new tab and activate it
      setTabs([...tabs, { id: tabID, name: tabName }]);
      setActiveTab(tabID);
    }
  };

  const handleRestwertModal = () => {
    setRestwertModal(true);
  };

  const handleRestwertModalClose = () => {
    setRestwertModal(false);
  };

  // added, to save Restwert into JSON, 2025-08-20
  const handleSaveRestwert = async () => {
    const newRestwertObj = {
      Stichtag: stichtagRef.current.value,
      Material: [
        { Name: "Mineralische Baustoffe", Restwert: Number(mineralRef.current.value), Einheit: "EPDQuantity/EUR" },
        { Name: "Metalle", Restwert: Number(metalleRef.current.value), Einheit: "EPDQuantity/EUR" },
        { Name: "Kunststoffe", Restwert: Number(kunststoffeRef.current.value), Einheit: "EPDQuantity/EUR" },
        { Name: "Bituminöse Mischungen", Restwert: Number(bituminoeseRef.current.value), Einheit: "EPDQuantity/EUR" },
        { Name: "undefined", Restwert: 0, Einheit: "EPDQuantity/EUR" }
      ]
    };
    console.log("New Restwert object:", newRestwertObj);
    handleRestwertModalClose();

    // Send the newRestwertObj to icdd, done at 2025-08-21
    const token = localStorage.getItem('authToken');
    let data = await getMaterialRestValueJson(containerId, projectId, token, "MaterialRestValue.json");
    // Ensure data is an array
    if (!Array.isArray(data)) {
      data = [];
    }
    data.push(newRestwertObj);
    await writeMaterialRestValueJson(containerId, projectId, token, "MaterialRestValue.json", data);

    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000); // Hide after 3 seconds
  };

  // added, to limit input to non-numeric content
  const preventNonNumericInput = (e) => {
    if (
      e.key === 'Backspace' ||
      e.key === 'Delete' ||
      e.key === 'Tab' ||
      e.key === 'ArrowLeft' ||
      e.key === 'ArrowRight' ||
      e.key === 'ArrowUp' ||
      e.key === 'ArrowDown' ||
      e.ctrlKey ||
      e.metaKey
    ) {
      return true;
    }

    if (!/^\d$/.test(e.key)) {
      e.preventDefault();
      return false;
    }

    const input = e.target;
    const currentValue = input.value;
    const selectionStart = input.selectionStart;
    const selectionEnd = input.selectionEnd;

    if (currentValue === '0' && selectionStart === 1 && selectionEnd === 1) {
      input.value = e.key;
      e.preventDefault();
      return false;
    }

    if (selectionStart === 0 && selectionEnd === 0 && e.key === '0') {
      if (currentValue.length > 0) {
        e.preventDefault();
        return false;
      }
    }
    return true;
  };

  // added, to validate number input
  const handleInput = (e) => {
    const input = e.target;
    let value = input.value;

    if (value.length > 1 && value.startsWith('0')) {
      const firstNonZeroIndex = value.split('').findIndex(char => char !== '0');
      if (firstNonZeroIndex === -1) {
        value = '0';
      } else {
        value = value.substring(firstNonZeroIndex);
      }
      input.value = value;
    }
  };

  //  added, to handle highlighting of elements, 2025-08-20
  const handleHighlight = async (codeGrITL2) => {
    try {
      const token = localStorage.getItem('authToken');
      let result;
      if (codeGrITL2) {
        // Use getHighlightElements for a specific codeGrITL2
        result = await getHighlightElements(containerId, projectId, token, codeGrITL2);
      } else {
        // Use getHighlightElements_Gesamt for all
        result = await getHighlightElements_Gesamt(containerId, projectId, token);
      }
      // Convert to array of GUIDs
      let guidsArray = [];
      if (
        Array.isArray(result) &&
        result.length > 0 &&
        result[0].ifcGuids &&
        result[0].ifcGuids !== "undefined"
      ) {
        guidsArray = JSON.parse(result[0].ifcGuids);
      }
      console.log("Obtain GUIDs result:", guidsArray);
      // Highlight elements in the viewer
      await highlightElementsByGuids(guidsArray);
      // You can now use 'result' to highlight elements in your viewer
    } catch (err) {
      console.error("Error highlighting elements:", err);
    }
  };

  //Call thatopen library and handle highlight event here, 2025-04-28
  //Copy from VarianteTab.js, 2025-08-20
  async function highlightElementsByGuids(guids) {

    //console.log("Print guids: ", guids);

    //get FragmentIdMap from guids
    const fragmentIdMap = await fragments.guidToFragmentIdMap(guids);
    //console.log("Print fragmentIdMap: ", fragmentIdMap);

    if (Object.keys(fragmentIdMap).length > 0) {
      //console.log("Print highlighter: ", highlighter);
      await highlighter.highlightByID("ActivitySelection", fragmentIdMap, true, true);
    }
    /*else {
      await highlighter.clear("ActivitySelection");
    }*/
  }

  // Rendern der Komponente
  return (
    <React.Fragment>

      <div className="tabs">
        {tabs.map((tab) => (
          <button key={tab.id} className={activeTab === tab.id ? "tab active" : "tab"}
            onClick={() => setActiveTab(tab.id)}>
            {tab.name}
          </button>
        ))}
      </div>
      {/* Tab-Inhalt */}
      <div className="AWF4 w-100" style={{ height: "95%", overflow: "clip" }}>
        {tabs.map((tab, index) => (
          tab.id === activeTab && (
            <div key={tab.id} className="tabContent w-100" style={{ height: "98%" }}>

              {index === 0 && (
                <div className="container4 w-100 h-100">
                  <div className="leftColumn4">

                    <h2>Beschreibung der Maßnahme</h2>
                    <p className="fw-bold mb-2">{measure?.name}</p>
                    <p className="text-muted mb-2">{measure?.description}</p>
                    <h2 className="mt-4 mb-0">Indikatoren</h2>
                    {Array.isArray(measure?.activity) &&
                      measure.activity.length > 0 &&
                      Array.isArray(measure.activity[0].indicatorsets) &&
                      measure.activity[0].indicatorsets.length > 0 && (
                        <>
                          {[...measure?.activity[0].indicatorsets]
                            .sort((a, b) => (a.label || "").localeCompare(b.label || "", "de"))
                            .map((set) => (

                              <div className="p-0" key={set.uri || set.label} >
                                {/* LINKE SPALTE: Indikator-Set */}
                                <div className=" fw-bold  my-1 mt-2">
                                  {set.label || "Indikator-Set"}
                                </div>

                                {/* RECHTE SPALTE: zugehörige Indikatoren */}
                                <div className=" my-1">
                                  {Array.isArray(set.indicators) && set.indicators.length > 0 ? (
                                    <ul className="list-group mb-0">
                                      {[...set.indicators]
                                        .sort((a, b) => (a.label || "").localeCompare(b.label || "", "de"))
                                        // distinct by label
                                        .filter(
                                          (ind, idx, self) =>
                                            ind.label &&
                                            idx === self.findIndex((el) => el.label === ind.label)
                                        )
                                        .map((ind) => (
                                          <li className="list-group-item d-flex justify-content-between align-items-center" key={ind.uri || ind.label}>
                                            <span className="">{ind.label}</span>
                                          </li>
                                        ))}
                                    </ul>
                                  ) : (
                                    <span className="text-muted">–</span>
                                  )}
                                </div>

                              </div>
                            ))}
                        </>
                      )}

                    <h2 className="mt-4">Aktivitäten</h2>
                    <ul className="list-group">
                      {[
                        { label: "Rückbau Überbau", code: "OBE", calc: "Auswertung - Überbau", id: "Überbau Auswertung" },
                        { label: "Rückbau Unterbau", code: "UNT", calc: "Auswertung - Unterbau", id: "Unterbau Auswertung" },
                        { label: "Rückbau Ausstatung", code: "AUS", calc: "Auswertung - Ausstatung", id: "Ausstatung Auswertung" },
                        { label: "Rückbau Gesamtbauwerk", code: null, calc: "Auswertung - Gesamtbauwerk", id: "Gesamtbauwerk Auswertung" },
                      ].map(({ label, code, calc, id }) => (
                        <li key={label} className="list-group-item d-flex align-items-center">
                          <span className="fw-bold">{label}</span>

                          {/* Buttons am rechten Rand */}
                          <div className="ms-auto d-flex gap-1 w-50">
                            <button
                              type="button"
                              className="btn btn-sm btn-light  w-100"
                              onClick={() => (code ? handleHighlight(code) : handleHighlight())}
                            >
                              Highlight im Modell
                            </button>
                            <button
                              type="button"
                              id={id}
                              className="btn btn-sm btn-light w-100"
                              onClick={() => addCalculationTab(calc, code)}
                            >
                              Auswertung
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>


                    <div className="d-inline-flex w-100 gap-2 mt-4">
                      <div className="flex-fill">
                        <button
                          className="btn btn-sm btn-light "
                          onClick={handleRestwertModal}
                        >
                          Materialwerte für Restwertberechnung eingeben
                        </button>
                      </div>
                      <div className="flex-fill">
                        <Link to="/" style={{ whiteSpace: 'nowrap', textDecoration: 'none' }}>
                          <button className="btn btn-sm btn-light w-100" style={{ whiteSpace: 'nowrap', textDecoration: 'none' }}>
                            Zurück zum Hauptmenü
                          </button>
                        </Link>
                      </div>
                    </div>

                  </div>
                  <div className="rightColumn4" style={{ position: "relative" }}>
                    <IfcViewerX />
                  </div>
                </div>
              )}

              {index === 1 && (
                <>
                  {/*  add start, updating for AWF4 basic requirment 9 UI, 2025-06-23 */}
                  <div className="tabContent4 w-100 h-100">
                    {/*  added for visualization tab, 2025-06-15 */}
                    {/*<button className="calculationButton btn btn-sm btn-light"
                      onClick={addResultVisualizationTab}
                      style={{ float: 'left', width: '30%', fontSize: '1.1 rem', fontWeight: 'bold' }} >
                      Ergebnis visualisieren
                    </button>*/}


                    <CalculationResultTab countryCode={currentContainer?.CountryCode} awfNr={tab.name} container={containerId} project={projectId} bearer={localStorage.getItem('authToken')} />

                  </div>
                  {/*  add end, updating for AWF4 basic requirment 9 UI, 2025-06-23 */}
                </>
              )}
              {index === 2 && (
                <div><VisualizationResultTab /></div>
              )}
            </div>
          )))}
      </div>


      {RestwertModal && (
        <div
          className="modal-overlay"
          onClick={handleRestwertModalClose}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}
        >
          <div
            className="form-container"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              maxWidth: '800px',
              width: '100%'
            }}
          >
            <div>
              <h2 style={{ display: 'flex', justifyContent: 'center' }}>Restwert</h2>
              <label></label>
            </div>
            <div>
              <div>
                <label>Mineralische Baustoffe [EUR/Menge]</label>

                <input type="number"
                  className="hide-number-arrows"
                  onKeyDown={preventNonNumericInput}
                  onInput={handleInput}
                  ref={mineralRef}
                />

                <label></label>
              </div>

              <div>
                <label>Metalle [EUR/Menge]</label>

                <input type="number"
                  className="hide-number-arrows"
                  onKeyDown={preventNonNumericInput}
                  onInput={handleInput}
                  ref={metalleRef}
                />

                <label></label>
              </div>

              <div>
                <label>Kunststoffe [EUR/Menge]</label>
                <div className="material-options">

                  <input type="number"
                    className="hide-number-arrows"
                    onKeyDown={preventNonNumericInput}
                    onInput={handleInput}
                    ref={kunststoffeRef}
                  />

                  <label></label>
                </div>
              </div>

              <div>
                <label>Bituminöse Mischungen [EUR/Menge]</label>

                <input type="number"
                  className="hide-number-arrows"
                  onKeyDown={preventNonNumericInput}
                  onInput={handleInput}
                  ref={bituminoeseRef}
                />

                <label htmlFor="input3"></label>
                <label></label>
              </div>

              <div>
                <label> Stichtag </label>
                <input type="date" ref={stichtagRef} />
                <label></label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button className="btn btn-sm btn-light" onClick={handleSaveRestwert}>
                  Speichern und schließen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSuccessMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#d4edda',
          color: '#155724',
          padding: '12px 24px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          zIndex: 2000
        }}>
          Restwert erfolgreich gespeichert!
        </div>
      )}

    </React.Fragment>
  );
};
export default DefPage4;