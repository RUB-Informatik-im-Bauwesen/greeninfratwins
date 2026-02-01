import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./DefinitionPage23.css";

//added start,  2025-05-25
import IfcViewerX from "../components/IfcViewer"; //added, 2024-10-24
import { AppContext } from "../AppProvider";
import { Link } from 'react-router-dom';
import CalculationResultTab from "../components/CalculationResultTab";
import VisualizationResultTab from "../components/VisualizationResultTab";
import MassnahmeTab from "../components/MassnahmeTab";
import VarianteTab from "../components/VarianteTab";
import { FaArrowRight, FaCalculator } from "react-icons/fa";
//added end,  2025-05-25

const DefinitionPage23 = ({ }) => {

  //added start,  2025-05-25
  // Updated on 2024-11-13 to handle multiple files
  const { containerId, projectId, isLoggedIn, setIsLoggedIn,
    //ifcViewerFiles, setifcViewerFiles, 
    currentContainer, setCurrentContainer, /* Store container data, 2025-06-23 */
    ifcFiles, setIfcFiles, //new added, 2025-03-11
    twinConfig, setTwinContext } = useContext(AppContext);
  //selectedFiles, (2025-01-22, replace selectedFiles by ifcViewerFiles)
  //added end,  2025-05-25
    const navigate = useNavigate();
  const [InputValue1, setInputValue1] = useState('');
  const [InputValue2, setInputValue2] = useState('');
  const [InputValue3, setInputValue3] = useState('');
  const [InputValue4, setInputValue4] = useState('');
  const [InputValue5, setInputValue5] = useState('');
  const [InputValue6, setInputValue6] = useState('');
  const [InputValue7, setInputValue7] = useState('');
  const [InputValue8, setInputValue8] = useState('');
  const [showMeasure, setshowMeasure] = useState('');
  const [showvariant, setshowvariant] = useState(true);

  const [showVerkehr, setshowVerkehr] = useState("");
  const [tabs, setTabs] = useState([{ id: 0, name: "Maßnahme" }, { id: 1, name: "Variante 1" }, { id: 2, name: "Variante 2" }]);
  const [measureID, setmesaureID] = useState(null);
  const [description, setDescription] = useState('');
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  //change the Eingabeformular for Variante 1 and 2, 2025-06-13
  const [tabData, setTabData] = useState({
    1: { date: "", inputText: "", InputValue1: "", InputValue2: "", InputValue3: "", InputValue4: "", InputValue5: "", InputValue6: "", InputValue7: "", InputValue8: "", isSavedtabState: true, },
    2: { date: "", inputText: "", InputValue1: "", InputValue2: "", InputValue3: "", InputValue4: "", InputValue5: "", InputValue6: "", InputValue7: "", InputValue8: "", isSavedtabState: true, },
  });

  useEffect(() => {
    handleIfcFiles(containerId);
  }, []);



  function selectMeasureID(measureID) {
    localStorage.setItem('measureID', measureID);
    setmesaureID(measureID);

    setDescription(description);
    console.log(`Maßnahme ${measureID} ausgewählt`);

  };


  //Prüft ob eine measurID im LocalStorage gespeichert ist. 
  useEffect(() => {
    const storedMeasure = localStorage.getItem('selectedMeasure');
    if (storedMeasure) {
      const parsedMeasure = JSON.parse(storedMeasure);
      setmesaureID(parsedMeasure.measureID);
      setDescription(parsedMeasure.description);
    }
  }, []);

  //Änderung im localstorage 
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'measureID') {
        selectMeasureID(e.newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Beim Laden der Seite prüfen, ob eine measureID im localStorage gespeichert ist
  window.onload = function () {
    var storedMeasureID = localStorage.getItem('measureID'); // Abrufen der measureID aus localStorage

    if (storedMeasureID) {
      // Wenn eine measureID gefunden wurde, rufe die Funktion zum Setzen der Beschreibung auf
      selectMeasureID(storedMeasureID);

    }
  };

  window.addEventListener('storage', function (e) {
    if (e.key === 'measureID') {
      var newMeasureID = e.newValue;
      selectMeasureID(newMeasureID);
    }

  });

  const closeMeasure = () => {
    setshowMeasure(false);
    setshowvariant(true);
  };


  /*const openVerkehr = () => {
    setshowVerkehr(true);
    const activeTabData = tabData[activeTab];
    setInputValue1(activeTabData.InputValue1);
    setInputValue2(activeTabData.InputValue2);
    setInputValue3(activeTabData.InputValue3);
    setInputValue4(activeTabData.InputValue4);
    setInputValue5(activeTabData.InputValue5);
    setInputValue6(activeTabData.InputValue6);
    setInputValue7(activeTabData.InputValue7);
    setInputValue8(activeTabData.InputValue8);
  };*/


  //Added, to add calculation tab for basic requirement 9 UI, 2025-06-15
  const addCalculationTab = () => {
    const tabName = "Berechnungsergebnisse";
    const tabID = 3;

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

  //Added, to add result visualization tab for basic requirement 10 UI, 2025-06-15
  const addResultVisualizationTab = () => {
    const tabName = "Ergebnisvisualisierung";
    const tabID = 4;

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

  /*const handleInputChange = (e, fieldName) => {
    const value = e.target.value;
    const updatedData = { ...tabData[activeTab], [fieldName]: value };

    // Aktualisiere den Zustand
    setTabData({
      ...tabData,
      [activeTab]: updatedData,
    });

    // Speichere die aktualisierten Daten im LocalStorage
    const tabName = tabs.find(tab => tab.id === activeTab).name;
    localStorage.setItem(`${tabName}`, JSON.stringify(updatedData));
  };*/

  const handlePopupSaveVerkehr = () => {
    const updatedData = {
      ...tabData[activeTab],
      InputValue1,
      InputValue2,
      InputValue3,
      InputValue4,
      InputValue5,
      InputValue6,
      InputValue7,
      InputValue8,
    };

    setTabData({
      ...tabData,
      [activeTab]: updatedData,
    });

    // Speichere die Daten auch im LocalStorage
    const tabName = tabs.find(tab => tab.id === activeTab).name;
    localStorage.setItem(`${tabName}`, JSON.stringify(updatedData));

    setshowVerkehr(false);
  };

  //added start, 2025-05-25
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
  };//added end, 2025-05-25

  // Rendern der Komponente
  return (
    <React.Fragment>

      {showMeasure && (
        <div className="modal">
          <div className="modal-content">
            <div className="showMeasure">

              <h3>Wählen sie ihre Maßnahme zum Variantenvergleich</h3>

              <div class="measure-container">
                <div class="measure-row">
                  <button
                    onClick={() => selectMeasureID('1')}>Betondeckensanierung</button>

                  <p> Die Betondeckensanierung umfasst das Entfernen beschädigter Betonschichten durch Fräsen, Schleifen oder Hochdruckwasserstrahlen und das erneute Auftragen von Beton oder Spezialmörtel. Sie dient dazu, Risse, Abplatzungen oder Korrosion der Bewehrung zu beheben und die Tragfähigkeit sowie Langlebigkeit der Betonoberfläche zu sichern. </p>

                </div>
                <div class="measure-row">
                  <button onClick={() => selectMeasureID('2')} >Deckschicht erneuern</button>
                  <p>Das Erneuern der Deckschicht bei Straßen umfasst das Abfräsen der alten Asphaltschicht und das Aufbringen einer neuen Deckschicht aus Asphalt oder Beton. Diese Maßnahme verbessert die Fahrbahngriffigkeit, Ebenheit und Witterungsbeständigkeit, wodurch die Nutzungsdauer der Straße verlängert wird.</p>
                </div>
                <div class="measure-row">
                  <button onClick={() => selectMeasureID('3')} >Lärmmindernder Asphalt</button>
                  <p>Lärmmindernder Asphalt ist eine spezielle Fahrbahndecke mit offenporiger oder elastischer Struktur, die Verkehrsgeräusche durch Schallabsorption und reduzierte Reifen-Fahrbahn-Interaktion verringert. Diese Maßnahme wird vor allem in städtischen Gebieten und an Autobahnen eingesetzt, um die Lärmbelastung für Anwohner zu senken.</p>
                </div>

                <button class="close-button" onClick={closeMeasure}> Schließen</button>

              </div>
            </div>
          </div>
        </div>
      )}

      {showvariant && (
        <div className="contentColumn" style={{ height: "90%" }}>
          <div className="tabs">
            {tabs.map((tab) => (
              <button key={tab.id} className={activeTab === tab.id ? "tab active" : "tab"}
                onClick={() => setActiveTab(tab.id)}>
                {tab.name}
              </button>
            ))}
            {/*<button class="tab" onClick={addNewTab}>
              Varainte erstellen
            </button>*/}
          </div>

          {/* Tab-Inhalt */}
          {tabs.map((tab, index) => (
            tab.id === activeTab && (
              <div key={tab.id} className="tabContent" >
                {/* added start, for basic requirment 9 UI, 2025-06-15*/}
                {(index < 3) ? (
                  <>
                    <div className="leftColumn pe-0 ps-3 py-3" style={{position: 'relative'}}>
                      <form className="w-100 h-100">
                      {index === 0 && (
                        <MassnahmeTab />
                      )}

                      {/* commented, here comes the starting of each variante, 2025-06-13*/}
                      {(index === 1 || index === 2) && (
                        <VarianteTab varID={index-1} countryCode={currentContainer?.CountryCode} awfNr={currentContainer?.AWF}/>
                      )}

                      {/*<select onChange={handleSelectChange} id="AssetsSelect" class="form-select form-select-lg" aria-label="Varianten der Maßnahmen " ref ={itemSelect} value={selectedOption}>
                  <option value= ""selected disabled>Wählen sie</option>
                  {assetList.map((asset, index) => (
                  <option key={index} value={asset.name} data-GWP={asset.GWP} data-EP={asset.EP} data-AP={asset.AP} data-POCP={asset.POCP} data-cost={asset.cost}>{asset.name}</option>
                ))}
                <option onClick={handleAddCustomAsset} value="addCustomAsset"> Eigenes Asset hinzufügen</option>
                </select>*/}
                      <div className="d-flex justify-content-between" style={{ position: 'absolute', bottom: '1rem', width: '95%' }}>
                        
                          <button className="btn btn-sm btn-light" style={{ width: '49%', whiteSpace: 'nowrap'}} onClick={() => navigate("/")}>Zurück zum Hauptmenü</button>
                        

                        {(index === 0 ) && (
                          <button className="btn btn-sm btn-light" onClick={() => setActiveTab(1)}
                            style={{ width: '49%' }} >
                            Weiter <FaArrowRight></FaArrowRight>
                          </button>
                        )}
                        {/* added for calculation tab, 2025-06-15 */}
                        {(index === 1) && (
                          <button className="btn btn-sm btn-light" onClick={() => setActiveTab(2)}
                            style={{ width: '49%' }} >
                            Weiter <FaArrowRight></FaArrowRight>
                          </button>
                        )}

                        {(index === 2) && (
                          <button className="btn btn-sm btn-light" onClick={addCalculationTab}
                            style={{ width: '49%' }} >
                            Auswerten <FaCalculator></FaCalculator>
                          </button>
                        )}

                        


                        {/*<Link to="/calculate23">
                        <button className="btn btn-sm btn-light" style={{ float: 'right', width: '49%' }} >Auswerten</button>
                    </Link>*/}
                      </div>
                      </form>
                    </div>

                    <div className="rightColumn" >
                      <div>
                        <IfcViewerX />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* added start, for basic requirment 9 & 10 UI, 2025-06-15*/}
                    {index === 3 && (
                      <div className="w-100">
                        {/* added for visualization tab, 2025-06-15 */}
                        <button className="calculationButton btn btn-sm btn-light"
                          onClick={addResultVisualizationTab}
                          style={{ float: 'left', width: '30%', fontSize: '1.1 rem', fontWeight: 'bold' }} >
                          Ergebnis visualisieren
                        </button>

                        <CalculationResultTab countryCode={currentContainer?.CountryCode} awfNr={currentContainer?.AWF} container={containerId} project={projectId} bearer ={localStorage.getItem('authToken')}/>

                      </div>


                    )}
                    {index === 4 && (
                      <div className="w-100"><VisualizationResultTab /></div>
                    )}
                    {/* added end, for basic requirment 9 & 10 UI, 2025-06-15*/}
                  </>
                )}

              </div>

            )
          ))}
        </div>
      )}

      {showVerkehr && (
        <div className="modal">

          <div className="showVerkehr">
            <div class="form-container">
              <h3>Eingabeformular </h3>
              <div class="form-grid">
                <div class="form-group">
                  <label>Länge der Umleitungsstreck </label>
                  <input type="number" class="form-control" value={InputValue2} id="input2" placeholder="" onChange={(e) => setInputValue2(e.target.value)} required />
                  <label htmlFor="input2"></label>
                </div>

                <div class="form-group">
                  <label> Kostenfaktor der Umleitung</label>
                  <input type="number" class="form-control" value={InputValue4} id="input4" placeholder="" onChange={(e) => setInputValue4(e.target.value)} required />
                  <label htmlFor="input4"></label>
                </div>

                <div class="form-group" rowspan="2">
                  <label>Zu nutzende Materialien</label>
                  <div class="material-options">
                    <select>
                      <option>Material aus Datenbank wählen</option>
                      <option>Beton</option>
                      <option>Stahl</option>
                      <option>Holz</option>
                    </select>
                    <input type="text" placeholder="Benutzerdefiniertes Material eingeben"></input>
                  </div>
                </div>

                <div class="form-group">
                  <label> Durchschn. tägliche Verkehrsmenge</label>
                  <input type="number" class="form-control" value={InputValue3} id="input3" placeholder="" onChange={(e) => setInputValue3(e.target.value)} required />
                  <label htmlFor="input3"></label>
                </div>

                <div class="form-group">
                  <label> CO₂-Emission</label>
                  <input type="number" class="form-control" value={InputValue1} id="input1" placeholder="" onChange={(e) => setInputValue1(e.target.value)} required />
                  <label htmlFor="input4"></label>
                </div>
                {/*} <button onClick={handlePopupSaveVerkehr}>speichern der Verkehrsbedingte eingaben </button>*/}

                <div class="form-group">
                  <label> Dauer der Wartungsarbeiten [h] </label>
                  <input type="number" class="form-control" value={InputValue5} id="input5" placeholder="" onChange={(e) => setInputValue5(e.target.value)} required />
                  <label htmlFor="input5"></label>
                </div>

                <div class="form-group">
                  <lable> Lärmpegel der geräten </lable>
                  <input type="number" class="form-control" value={InputValue6} id="input6" placeholder="" onChange={(e) => setInputValue6(e.target.value)} required />
                  <label htmlFor="input6"></label>
                </div>

                <div class="form-group">
                  <lable> Anzahl der betroffenen Person </lable>
                  <input type="number" class="form-control" value={InputValue7} id="input7" placeholder="" onChange={(e) => setInputValue7(e.target.value)} required />
                  <label htmlFor="input7"></label>
                </div>

                <div class="form-group">
                  <label>Dauer der Sperrung</label>
                  <input type="number" class="form-control" value={InputValue8} id="input8" placeholder="" onChange={(e) => setInputValue8(e.target.value)} required />
                  <label htmlFor="input8"></label>
                </div>

                {/*<button onClick={handlePopupSaveWartung}>speichern und Schließen</button>*/}

                { /* <button >speichern der ausgewählten Materialien</button>*/}

                <div class="form-buttons">
                  <button onClick={handlePopupSaveVerkehr}>Speichern und schließen</button>
                </div>
              </div>
            </div>
          </div>
        </div>

      )}
    </React.Fragment>
  );
};

export default DefinitionPage23;