import React, { createContext, useState } from "react";


export const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [projectId, setProjectId] = useState("");
  const [projectName, setProjectName] = useState("");
  const [containerId, setContainerId] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  
  //added start -------------
  const [containers, setContainers] = useState([]); //added, for basic requirements 1, 2025-05-30
  const [currentContainer, setCurrentContainer] = useState(null); /* Store container data, 2025-06-23 */
  //const [ifcViewerFiles, setifcViewerFiles] = useState([]); 
  const [ifcFiles, setIfcFiles] = useState([]); //Directly handle IFC files from ICDD in IfcViewer.js, 2025-03-11
  //const [selectedFiles, setSelectedFiles] = useState([]);
  const [loadedModels, setLoadedModels] = useState([]); // Track all loaded models ghighlightedElements, setgHighlightedElements
  const [highlightedElements, setHighlightedElements] = useState([]); // Track all loaded models
  const [fragments, setFragments] = useState(null); //added, 2025-04-28: as a FragmentManager
  //Indexer is used to access properties of BIM elements
  const [indexer, setIndexer] = useState(null); //added: See if I can set the indexer globally
  const [highlighter, setHighlighter] = useState(null); //added, 2025-04-28: To highlight elements globally
  const [selectedModels, setSelectedModels] = useState([]); //Handle target models (checklist), 2025-05-05
  const [measure, setMeasure] = useState({
          name:"",
          description: "",
          url: "",
          activity: [],
          model: []
        }); 
  
  //Store Massnahme & Variante info of target container from ontology, 2025-06-18
  /*Format of massnahmeVariante: 
  { 
    description:"", 
    varianten: [{
      activity: [{
        activityName:"",
        ifcFile:"",
        indicatorSet:[{ indicatorSetName:"", indicators:[] }],
        guids:[]
      }] 
    }] 
  } */
  const [massnahmeVariante, setMassnahmeVariante]= useState([]);

  const [indicatorTables, setIndicatorTables]= useState([]);//Store indicator tables calculation & visualization results, 2025-06-15
  const [sumIndicatorRadar, setSumIndicatorRadar] = useState([]);//Store all indicator results as a radar, 2025-06-18
  //added end -------------

  const [data, setData] = useState([]); 
  const [twinConfig, setTwinConfig] = useState(null); 


  return (
    <AppContext.Provider value={{ 
      projectId, setProjectId, 
      projectName, setProjectName,
    containers, setContainers,
    currentContainer, setCurrentContainer, /* Store container data, 2025-06-23 */
    containerId, setContainerId, 
    isLoggedIn, setIsLoggedIn, 
    //ifcViewerFiles, setifcViewerFiles, 
    ifcFiles, setIfcFiles,
    /*selectedFiles, setSelectedFiles, // remove selectedFiles by on 2025-01-22*/
    loadedModels, setLoadedModels,
    selectedModels, setSelectedModels, //2025-06-21, for highlight activity
    highlightedElements, setHighlightedElements,
    fragments, setFragments,
    indexer, setIndexer,
    highlighter, setHighlighter,
    indicatorTables, setIndicatorTables,
    massnahmeVariante, setMassnahmeVariante,
    sumIndicatorRadar, setSumIndicatorRadar,
    measure, setMeasure,
    data, setData,
    twinConfig, setTwinConfig
}}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;