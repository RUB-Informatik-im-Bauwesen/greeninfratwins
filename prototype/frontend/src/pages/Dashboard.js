import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "./Dashboard.css";
import logoGriT from "../images/GreenInfraTwins_Logo_transparent.png";
import rub from "../images/rub.png";
import htv from "../images/htv.png";
import lom from "../images/lom.png";
import boku from "../images/boku.jpg";
import imc from "../images/imc.png";
import ffg from "../images/ffg.png";
import { FaChartBar } from "react-icons/fa";
import { AppContext } from "../AppProvider";

import { Link } from 'react-router-dom';//

const Dashboard = () => {
  const [showProjectsDialog, setShowProjectsDialog] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState(null);
  //const [selectedFile, setSelectedFile] = useState(null);
  const { projectId, isLoggedIn, setIsLoggedIn, data, setData, setTwinConfig, twinConfig, containers, setContainers,
    currentContainer, setCurrentContainer, /* Store container data, 2025-06-23 */
    containerId, setContainerId, setIfcFiles } = useContext(AppContext);

  const [ActiveTab, setActiveTab] = useState('');
  const [measureID, setmesaureID] = useState(null);
  const [description, setDescription] = useState('');
  const [selectedMeasure, setSelectedMeasure] = useState([]); // Beispiel für Maßnahmen
  const measures = [
    { id: 'freischneiden', name: 'Freischneiden' },
    { id: 'spuelung', name: 'Spülung der Entwässerung' },
    { id: 'saeuberung', name: 'Säuberung von Lagern' }
  ];


  function selectMeasureID(measureID) {


    let description = "";
    switch (measureID) {
      case '1':
        description = 'Die Betondeckensanierung umfasst das Entfernen beschädigter Betonschichten durch Fräsen, Schleifen oder Hochdruckwasserstrahlen und das erneute Auftragen von Beton oder Spezialmörtel. Sie dient dazu, Risse, Abplatzungen oder Korrosion der Bewehrung zu beheben und die Tragfähigkeit sowie Langlebigkeit der Betonoberfläche zu sichern.';
        break;
      case '2':
        description = 'Das Erneuern der Deckschicht bei Straßen umfasst das Abfräsen der alten Asphaltschicht und das Aufbringen einer neuen Deckschicht aus Asphalt oder Beton. Diese Maßnahme verbessert die Fahrbahngriffigkeit, Ebenheit und Witterungsbeständigkeit, wodurch die Nutzungsdauer der Straße verlängert wird.';
        break;
      case '3':
        description = 'Lärmmindernder Asphalt ist eine spezielle Fahrbahndecke mit offenporiger oder elastischer Struktur, die Verkehrsgeräusche durch Schallabsorption und reduzierte Reifen-Fahrbahn-Interaktion verringert. Diese Maßnahme wird vor allem in städtischen Gebieten und an Autobahnen eingesetzt, um die Lärmbelastung für Anwohner zu senken.';
        break;
      default:
        description = '';

    }


    localStorage.setItem('selectedMeasure', JSON.stringify({ measureID, description }));
    setmesaureID(measureID);
    setDescription(description);
    console.log(`Maßnahme ${measureID} ausgewählt`);

  };




  // Effekt zum Überprüfen des Login-Status beim Laden der Komponente
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token);
  }, []);

  const handleMeasureSelect = (measure) => {
    setSelectedMeasure(measure);
    setActiveTab(measure); // Setzt den Tab-Namen basierend auf der Auswahl
  };

  //New added, 2025-05-30,basic requirement 1
  useEffect(() => {
    const fetchContainers = async () => {
      if (!projectId) return;

      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`https://icdd.vm.rub.de/dev01/api/v1/projects/${projectId}/containerTypes/0/containers`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) throw new Error('Failed to fetch containers');
        const data = await response.json();
        setContainers(data);
        console.log("View project data: ", data);
      } catch (error) {
        console.error('Error fetching containers:', error);
        setContainers([]);
      }
    };

    fetchContainers();
  }, [projectId]);

  useEffect(() => {
    console.log(twinConfig);
  }, [twinConfig]);


  /*useEffect(() => {
    queryContainer();
  }, [containerId]);*/
  const navigate = useNavigate();

  const queryContainer = async (container) => {

    try {
      const id = container.Id;
      console.log("container: ", container);

      setIfcFiles([]);
      setContainerId(id);
      setCurrentContainer(container);//new added, 2025-06-23

      const token = localStorage.getItem('authToken');
      const query = "SELECT * WHERE{ ?twin a <https://greeninfratwins.com/ns/grit#GreenInfraTwin> . ?twin <http://www.w3.org/2000/01/rdf-schema#label> ?twinLabel.  ?twin <https://greeninfratwins.com/ns/grit#hasAsessment> ?awf . ?awf <http://www.w3.org/2000/01/rdf-schema#label> ?awfLabel. ?awf <https://greeninfratwins.com/ns/grit#hasMeasure> ?measure . ?measure <http://www.w3.org/2000/01/rdf-schema#label> ?measureLabel.}";
      if (containerId) {
        const response = await fetch(`https://icdd.vm.rub.de/dev01/api/v1/projects/${projectId}/containerTypes/0/containers/${id}/query?query=${encodeURIComponent(query)}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const files = await response.json();
        setData(files.results.bindings || []);
        console.log("files: ", files);

        if (!Array.isArray(files)) {
          throw new Error('Received data is not in the expected format');
        }
      };

    } catch (err) {

    } finally {

    }
  };


  const handleDefinitionData = (twin, awf, measure) => {
    setTwinConfig({ twin: twin, awf: awf, measure: measure });
    navigate('/definition');
  };

  // A function to delete ".icdd" (Basic requiremnt 2), 2025-06-10
  const renderContainerName = (containerName) => {
    if (!containerName) return null;

    // Check if the containerName ends with ".icdd"
    if (containerName.endsWith('.icdd')) {
      // Remove the ".icdd" suffix
      return containerName.slice(0, -5); // removes last 5 chars
    } else {
      // Return the original name if no ".icdd"
      return containerName;
    }
  };

  // A function to delete "AWFx:" for conatiner description (Basic requiremnt 2), 2025-06-10
  const renderContainerDes = (containerDes) => {
    if (!containerDes) return null;

    // Check if the containerDes starts with "AWFx-XX:"
    if (containerDes.startsWith('AWF')) {
      // Remove the "AWFx:" suffix

      return containerDes.slice(8,); // removes first 8 chars
    } else {
      // Return the original name if no "AWFx-XX:"
      return containerDes;
    }
  };

  // A function to display the whole container info into case (Basic requirements 2 & 3), 2025-06-10
  const renderContainer = (index, container) => {
    // Check if the containerDes starts with "AWFx:"
    if (container.Description && container.Description.startsWith('AWF')) {
      // Remove the "AWFx:" suffix

      container.AWF = container.Description.slice(0, 4);
      console.log("container.AWF: ", container.AWF);
      if (container.AWF) {
        switch (container.AWF) {
          case 'AWF1':
            container.AwfName = 'Betriebsaufgabe';
            container.Link = '/uc1';
            break;
          case 'AWF2':
            container.AwfName = 'Instandhaltung/-setzung';
            container.Link = '/uc2';
            break;
          case 'AWF3':
            container.AwfName = 'Lebensdauerverlängerung';
            container.Link = '/uc3';
            break;
          case 'AWF4':
            container.AwfName = 'Rückbau';
            container.Link = '/uc4';
            break;
        }
      }

      //New added for country code, 2025-06-23
      container.CountryCode = container.Description.slice(5, 7);
      console.log("container.CountryCode: ", container.CountryCode);
    }

    return (
      <div>
        <div className="card-header alert-success alert"><span className="badge bg-success text-white float-end fw-lighter">{container.AWF}</span><h4>{container.AwfName} </h4></div>
        <div className="card-body">
          <h5 className="card-title">
            Beschreibung
          </h5>
          <p className="text-muted text-break fw-lighter text-justify">{renderContainerDes(container.Description)}</p>
        </div>
      </div>
    );
  };



  // Rendern der Komponente
  return (
    <React.Fragment>
      {isLoggedIn ? (
        <>

          {/*  added start, on 2025-06-10, Update for Basic Requirement 1 & 2 */}
          {containers.length > 0 ? (
            <div className="cards-center-wrapper">
              <div className="row justify-content-center">
                {containers.map((container, index) => (
                  <div key={container.Id || index} className="col-md-3 my-2">
                    <div className="card h-100 shadow-sm">
                      {renderContainer(index, container)}
                      <div className="card-footer text-body-secondary mt-auto">
                        <span className="text-muted">Maßnahmen:</span>
                        <Link to={container.Link}>
                          <button
                            onClick={() => queryContainer(container)}
                            className="btn btn-light toggle mx-0 p-1 px-2 text-muted"
                          >
                            {renderContainerName(container.Name) || `Container ${index + 1}`}
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
            :
            (
              <div className="container-fluid w-100 h-100">
                <div className="alert alert-light">
                  <h2>Bitte wählen Sie ein Projekt aus.</h2>
                  <p>Wählen Sie ein Projekt aus, um die vollständigen Container in diesem Projekt anzuzeigen.</p>
                </div>
                <div className="bg-white p-5 border">
                  {/* Hero / Titel + Logo */}
                  <div className="row justify-content-center align-items-center text-center mb-3 g-1">
                    <div className="col-12 col-lg-10">
                      <h2 className="fw-bold mb-1">Willkommen im Demonstrator im Forschungsprojekt</h2>
                    </div>
                    <div className="col-12 col-lg-10">
                      <h2 className="fw-bold">GreenInfraTwins | Nachhaltigkeitsanalysen mit Digitalem Zwilling im Ingenieurbau</h2>
                    </div>
                    <div className="col-12 col-lg-6">
                      <a href="https://greeninfratwins.blogs.ruhr-uni-bochum.de/" target="_blank" rel="noopener noreferrer">
                        <img src={logoGriT} alt="GriT Logo" className="img-fluid mx-auto d-block" style={{ maxWidth: '480px' }} />
                      </a>
                    </div>
                  </div>

                  {/* Partner-Logos */}
                  <div className="row justify-content-center align-items-center text-center g-3 mb-3">
                    <div className="col-12 col-md-auto fw-bold p-3">Partner</div>
                    <div className="col-4 col-md-1"><img src={rub} alt="RUB Logo" className="img-fluid" /></div>
                    <div className="col-4 col-md-1"><img src={boku} alt="BOKU Logo" className="img-fluid" /></div>
                    <div className="col-4 col-md-1"><img src={imc} alt="IMC Logo" className="img-fluid" /></div>
                    <div className="col-4 col-md-1"><img src={htv} alt="HTV Logo" className="img-fluid" /></div>
                    <div className="col-4 col-md-1"><img src={lom} alt="Lombardi Logo" className="img-fluid" /></div>
                  </div>

                  {/* Förderung */}
                  <div className="row justify-content-center align-items-center g-3">
                    <div className="col-12 col-md-auto fw-bold p-3">Förderung</div>
                    <div className="col-4 col-md-1"><img src={ffg} alt="FFG Logo" className="img-fluid" /></div>
                    <div className="col-12 col-md-6 p-3 text-center text-md-start fw-bold">
                      Die FFG ist die zentrale nationale Förderorganisation und stärkt Österreichs Innovationskraft.
                      Dieses Projekt wird aus Mitteln der FFG gefördert. <a href="https://www.ffg.at" target="_blank">www.ffg.at</a>
                    </div>
                  </div>
                </div>
            </div>
            )
          }
        </>
      )
        :
        (
           <div className="container-fluid w-100 h-100">
                <div className="alert alert-light">
                  <h2>Bitte einloggen</h2>
            <p>Loggen Sie sich ein, um den vollständigen Inhalt zu sehen.</p>
                </div>
                <div className="bg-white p-5 border">
                  {/* Hero / Titel + Logo */}
                  <div className="row justify-content-center align-items-center text-center mb-3 g-1">
                    <div className="col-12 col-lg-10">
                      <h2 className="fw-bold mb-1">Willkommen im Demonstrator im Forschungsprojekt</h2>
                    </div>
                    <div className="col-12 col-lg-10">
                      <h2 className="fw-bold">GreenInfraTwins | Nachhaltigkeitsanalysen mit Digitalem Zwilling im Ingenieurbau</h2>
                    </div>
                    <div className="col-12 col-lg-6">
                      <a href="https://greeninfratwins.blogs.ruhr-uni-bochum.de/" target="_blank" rel="noopener noreferrer">
                        <img src={logoGriT} alt="GriT Logo" className="img-fluid mx-auto d-block" style={{ maxWidth: '480px' }} />
                      </a>
                    </div>
                  </div>

                  {/* Partner-Logos */}
                  <div className="row justify-content-center align-items-center text-center g-3 mb-3">
                    <div className="col-12 col-md-auto fw-bold p-3">Partner</div>
                    <div className="col-4 col-md-1"><img src={rub} alt="RUB Logo" className="img-fluid" /></div>
                    <div className="col-4 col-md-1"><img src={boku} alt="BOKU Logo" className="img-fluid" /></div>
                    <div className="col-4 col-md-1"><img src={imc} alt="IMC Logo" className="img-fluid" /></div>
                    <div className="col-4 col-md-1"><img src={htv} alt="HTV Logo" className="img-fluid" /></div>
                    <div className="col-4 col-md-1"><img src={lom} alt="Lombardi Logo" className="img-fluid" /></div>
                  </div>

                  {/* Förderung */}
                  <div className="row justify-content-center align-items-center g-3">
                    <div className="col-12 col-md-auto fw-bold p-3">Förderung</div>
                    <div className="col-4 col-md-1"><img src={ffg} alt="FFG Logo" className="img-fluid" /></div>
                    <div className="col-12 col-md-6 p-3 text-center text-md-start fw-bold">
                      Die FFG ist die zentrale nationale Förderorganisation und stärkt Österreichs Innovationskraft.
                      Dieses Projekt wird aus Mitteln der FFG gefördert. <a href="https://www.ffg.at" target="_blank">www.ffg.at</a>
                    </div>
                  </div>
                </div>
            </div>
        )}
    </React.Fragment>
  );
};

export default Dashboard;