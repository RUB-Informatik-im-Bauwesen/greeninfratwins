import React, { useContext , useState, useEffect } from 'react';
import './ProjectsDialog.css';
import axios from 'axios';

import { FaBoxArchive } from 'react-icons/fa6';
import { AppContext } from "../AppProvider";
import { FaCaretSquareRight, FaLayerGroup } from 'react-icons/fa';

// ProjectsDialog-Komponenten, die Projekte, Container-Typen und Container aus dem ICDD-Service abruft
const ProjectsDialog = ({ isOpen, onClose, onSelectIfcFiles, setContainerName   }) => 
{
  // ProjectsDialog-Komponenten, die Projekte, Container-Typen und Container aus dem ICDD-Service abruft , /* add, 24-10-24*/onSelectedIfcFile 
  // Zustandsvariablen
  const [projects, setProjects] = useState([]); //All existed projects
  //const [selectedProjectId, setSelectedProjectId] = useState(null);
  //const [selectedProjectName, setSelectedProjectName] = useState(null);

  // commented the conatiner selection function based on basic requirements 1, 2025-05-30
  /*const [containers, setContainers] = useState([]); //xuli
  const [selectedContainer, setSelectedContainer] = useState(null);
  const [selectedContainerName, setSelectedContainerName] = useState(null);*/


  //const [ifcFiles, setIfcFiles] = useState([]); 
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

 
  const { projectId, setProjectId, setProjectName, setIfcFiles, setContainerId } = useContext(AppContext);//, selectedFiles, setSelectedFiles (2025-01-22, replace selectedFiles by ifcViewerFiles)
    
  // Effekt zum Laden der Projekte beim Öffnen des Dialogs
  useEffect(() => {
    if (isOpen) {
      fetchProjects();
      setIfcFiles([]);
      setContainerId("");
    }
  }, [isOpen]);

  // Funktion zum Abrufen der Projekte
  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('https://icdd.vm.rub.de/dev01/api/v1/projects', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }

      const data = await response.json();
      setProjects(data);
      setIfcFiles([]);
      setContainerId("");
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  //New added for project selection, basic requirement 1, 2025-05-30
  const handleProjectSelect = (project) => {
  setProjectId(project.Id);
  setProjectName(project.Name);
  onClose(); // Close dialog after selection
  };
  //New added end
 

  // Funktion zum Abrufen der Container
  /*const fetchContainers = async (projectId, projectName) => {
    setLoading(true);
    setSelectedProjectId(projectId);
    setProjectId(projectId);
    setSelectedProjectName(projectName);
    setProjectName(projectName);
    
    console.log(projectName);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`https://icdd.vm.rub.de/dev01/api/v1/projects/${projectId}/containerTypes/0/containers`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        console.log(response)
        throw new Error('Failed to fetch containers');
      }
  
      const data = await response.json();
      console.log('Fetched containers:', data);
      console.log('Type of fetched data:', typeof data);
      console.log('Is data an array?', Array.isArray(data));
      if (Array.isArray(data)) {
        console.log('Length of data array:', data.length);
        if (data.length > 0) {
          console.log('First item in data:', data[0]);
          console.log("ID: " + data[0].Id);
            console.log("Name: " + data[0].Name);
        }
      }
      
      setContainers(data);
      console.log('State after setting containers:', { containers: data});
    } catch (err) {
      console.error('Error fetching containers:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Funktion zum Behandeln der Auswahl eines Containers
  const handleContainerSelect = async (container, containerName) => {
    setSelectedContainer(container);
    setContainerId(container.Id);
    setSelectedContainerName(containerName);
    setContainerName(containerName);
    onClose();//inserted temporary
    await fetchIfcFiles(container.Id);

  };

  // Funktion zum Abrufen der IFC-Dateien
  const fetchIfcFiles = async (containerId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`https://icdd.vm.rub.de/dev01/api/v1/projects/${selectedProjectId}/containerTypes/0/containers/${containerId}/contents`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const files = await response.json();
      console.log('Fetched files:', files);
  
      if (!Array.isArray(files)) {
        throw new Error('Received data is not in the expected format');
      }
  
      const ifcFilesTemp = files.filter(file => 
        file && file.Name && file.Name.endsWith('.ifc') && 
        file.Type === 'application/octet-stream' &&
        file.ContainerInternalId
      ).map(file => ({
        ...file,
        url: `https://icdd.vm.rub.de/dev01/api/v1/projects/${selectedProjectId}/containerTypes/0/containers/${containerId}/contents/${file.Id}/attachment`
      }));
  
      setFilePath(`https://icdd.vm.rub.de/dev01/api/v1/projects/${selectedProjectId}/containerTypes/0/containers/${containerId}/contents/`);
      setIfcFiles(ifcFilesTemp);//setIfcFiles

      console.log('Filtered IFC files:', ifcFilesTemp);
    } catch (err) {
      console.error('Error fetching IFC files:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };*/

  if (!isOpen) return null;

  // Rendern des Dialogs
  return (
    <div className="projects-dialog-overlay">
      <div className="projects-dialog w-50">
        <h2><FaLayerGroup className='text-success'></FaLayerGroup>&nbsp;Projektauswahl vom ICDD Server</h2>
        <hr></hr>
        <button className="close-btn" onClick={onClose}>&times;</button>
        {loading && <p>Lade Projekte...</p>}
        {error && <p className="error">Die Verbindung wurde getrennt. Bitte erneut einloggen.</p>}
        
        {/* Modified, 2025-05-30 */}
        {!loading && !error && (
          <div>
            <ul className="projects-list">
              {projects.map((project) => (
                <li
      key={project.Id}
      onClick={() => handleProjectSelect(project)}
      className={`list-item d-flex justify-content-between align-items-center p-2 ${projectId === project.Id ? 'selected' : ''}`}
    >
      {/* Linke Seite: Icon + Name */}
      <span>
        <FaCaretSquareRight className='text-success'/>&nbsp;{project.Name}
      </span>

      {/* Rechte Seite: Button */}
      <span className="btn btn-success btn-sm ms-auto">Projekt laden</span>
    </li>
              ))}
            </ul>  
            <hr></hr>
            {/*  commented, for basic rquirement 1, 2025-05-30
            {selectedProjectId !== null && (
              <>
                <h3>Enthaltene Container:</h3>
                {Array.isArray(containers) && containers.length > 0 ? (
                  <ul className="projects-list">
                    {containers.map((container, index) => (
                      <li 
                        key={container.Id || `container-${index}`}
                        onClick={() => handleContainerSelect(container, container.Name)}
                        className={`list-item ${selectedContainer && selectedContainer.Id === container.Id ? 'selected' : ''}`}
                      >
                        {container.Name || `Container ${index + 1}`}
                        {container.Recipients && ` (Recipients: ${container.Recipients.length})`}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No containers found for this type.</p>
                )}
              </>
            )}
  <hr></hr>
            {selectedContainer && ifcFiles.length > 0 && (
              <>

                <h3>Modelldateien [{ifcFiles.length}]</h3>
                <ul className="project-list">

                  {ifcFiles.map((file) => (
                    <li 
                      key={file.ContainerInternalId}
                      
                    >
                      {file.Name}
                    </li>
                  ))}
                </ul>

                
              </>
            )}
              */}
          </div>
        )}
      </div>
    </div>
  );
};
export default ProjectsDialog;