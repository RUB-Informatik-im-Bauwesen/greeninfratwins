// new created on 2024-11-15, changed based on the multple models selection
import React, { useEffect, useRef, useState, useContext } from "react";
import { AppContext } from "../AppProvider";
import * as WEBIFC from "web-ifc";
import * as OBC from "@thatopen/components";
import * as OBF from "@thatopen/components-front";
import * as BUI from "@thatopen/ui";
import * as CUI from "@thatopen/ui-obc";
import * as THREE from "three";
import './IfcViewer.css';

const IfcViewerX = ({ }) => {
  //
  const fragmentsRef = useRef(null);
  const { containerId, projectId, isLoggedIn, setIsLoggedIn,
    ifcFiles, //The values of ifcFiles should not be modified in the file!!!!  2025-03-19
    //ifcViewerFiles, setifcViewerFiles, 
    loadedModels, setLoadedModels, selectedModels, setSelectedModels,  
    highlightedElements,setHighlightedElements,
    fragments, setFragments,
    indexer, setIndexer, highlighter, setHighlighter }
    = useContext(AppContext);//, selectedFiles, setSelectedFiles (2025-01-22,  delete selectedFiles)

  const containerRef = useRef(null);
  const components = useRef(new OBC.Components()).current; // Ensure Components instance remains constant
  const worlds = useRef(components.get(OBC.Worlds)).current;
  const world = useRef(worlds.create()).current;

  //const fragments = useRef(components.get(OBC.FragmentsManager)).current;
  const fragmentIfcLoader = useRef(components.get(OBC.IfcLoader)).current;

  const viewerGrids = components.get(OBC.Grids);

  //const highlighter = components.get(OBF.Highlighter);

  //BUI.Manager.init();//new added 2024-11-22

  //Here, I don't modify the global ifcFiles, but put the values into ifcViewerFiles,  2025-03-19
  const [isIfcViewerFilesHandled, setIsIfcViewerFilesHandled] = useState(false); //Handle IfcViewerFiles here,  2025-03-11,19
  const [ifcViewerFiles, setIfcViewerFiles] = useState([]); //Only call ifcViewerFiles locally,  2025-03-11

  const [isInitialized, setIsInitialized] = useState(false);
  const [isModelsloaded, setIsModelsloaded] = useState(false);
  //const [loadedModels, setLoadedModels] = useState([]); // Track all loaded models
  //const [highlightedElements, setHighlightedElements] = useState([]); // Track all higlighted elements
  const [displayElements, setDisplayElements] = useState([]);// Display highlighted elements,  2025-03-03
  const [displayModels, setDisplayModels] = useState([]);// Display loaded models,  2025-03-03


  //  added on 2025-06-10, to display loading log for user
  const [loadingLog, setLoadingLog] = useState("No IFC Files available yet.");
  const [displayLoadingLog, setDisplayLoadingLog] = useState("");

  useEffect(() => {

    //AppContext
    setLoadedModels([]);
    setHighlightedElements([]);
    fragmentsRef.current = components.get(OBC.FragmentsManager);
    setFragments(fragmentsRef.current);// 2025-04-28
    setIndexer(null);
    setHighlighter(components.get(OBF.Highlighter));// 2025-04-28

    //Local
    setIsIfcViewerFilesHandled(false);
    setIfcViewerFiles([]);
    setIsInitialized(false);
    setIsModelsloaded(false);

  }, []);

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


  useEffect(() => {
    if (ifcFiles && ifcFiles.length > 0 && !isIfcViewerFilesHandled && !isModelsloaded) {
      console.log("Activating IFC Viewer logic...", ifcFiles);
      setLoadingLog("Activating IFC Viewer logic...");

      handleIfcViewerFiles();

      /*if (isInitialized) {
        loadModels();
        //highlightEvent();
      }*/
    }

  }, [ifcFiles]); //  2025-03-19, Dependency array ensures it runs when `ifcFiles` changes

  /*const activateIFCViewer = () => {
    console.log("IFC Viewer Activated!");
    
    if(ifcFiles.length>0 && !isIfcFilesHandled)
    {
      setLoadedModels([]);
      setHighlightedElements([]);
      console.log("Before handleIfcFiles()", isIfcFilesHandled);
      handleIfcFiles();
      console.log("After handleIfcFiles()", isIfcFilesHandled);
    }

    if (!isInitialized && isIfcFilesHandled) {
      console.log("To activate initializeViewer()");
      initializeViewer();
    }
    if (isInitialized) {
      loadModels();
      //highlightEvent();
    }

  };*/

  async function handleIfcViewerFiles() {
    console.log("handleIfcViewerFiles() ");
    // Check if 'files' is an array; if not, make it one
    const filesArray = Array.isArray(ifcFiles) ? ifcFiles : [ifcFiles];
    let processedFiles = [];
    setIfcViewerFiles([]);
    console.log("Check values filesArray:", filesArray); // Debug log

    console.log("processedFiles before:", processedFiles); // Debug log
    console.log("ifcViewerFiles before:", ifcViewerFiles); // Debug log

    for (const file of filesArray) {//Updated by  2025-06-10, don't use forEach
      //Access file conten,  2025-03-19
      try {
        console.log("In each filesArray:", file); // Debug log
        const token = localStorage.getItem('authToken');
        const response = await fetch(file.url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error('Failed to fetch file content');
        file.content = await response.blob();

        console.log("In each file.Name & file.content:", file.Name, file.content); // Debug log

        processedFiles.push({ name: file.Name, content: file.content })
        console.log("Set processedFiles after:", processedFiles); // Debug log

        setLoadingLog("Loading ifc file " + file.Name + "...");


        console.log("All content in handleIfcViewerFiles():", processedFiles); // Debug log

        //Make sure only pass values when finished
        if (processedFiles.length === filesArray.length) {
          setIfcViewerFiles([...processedFiles]);//update IfcViewerFiles,  2025-03-19
          setIsIfcViewerFilesHandled(true);
          console.log("Check values processedFiles after content:", processedFiles); // Debug log
        }

        //const textContent = await file.content.text();
        //console.log("Content in text form:", textContent); // Debug log
      }
      catch (err) { console.error('Error fetching IFC files:', err); }

      /* if (file instanceof File || file instanceof Blob) {
          console.log("Fetch file content in ifc viewer:",file);
          // If it's a File or Blob object, read it as an ArrayBuffer
          const reader = new FileReader();
          reader.onload = (event) => {
            const arrayBuffer = event.target.result;
            processedFiles.push({ name: file.Name, content: new Uint8Array(arrayBuffer) });

            // Once all files are processed, update state
            if (processedFiles.length === filesArray.length) {
              setIsIfcFilesHandled(true);
            }
          };
          reader.readAsArrayBuffer(file);
        } else if (file instanceof ArrayBuffer) {
          // If it's already an ArrayBuffer, convert to Uint8Array
          processedFiles.push({ name: "ArrayBuffer File", content: new Uint8Array(file) });
        } else if (file instanceof Uint8Array) {
          // If it's already a Uint8Array, add it directly
          processedFiles.push({ name: "Uint8Array File", content: file });
        } else if (typeof file === 'string') {
          // If it's a string (possibly a URL or base64), add it directly
          processedFiles.push({ name: "String File", content: file });
        } else if (file && file.content instanceof Blob) {
          // If it's an object with a content property that is a Blob
          const reader = new FileReader();
          reader.onload = (event) => {
            const arrayBuffer = event.target.result;
            processedFiles.push({ name: file.name || "Blob File", content: new Uint8Array(arrayBuffer) });

            // Once all files are processed, update state
            if (processedFiles.length === filesArray.length) {
              setIfcViewerFiles(processedFiles);
              setIsIfcFilesHandled(true);
            }
          };
          reader.readAsArrayBuffer(file.content);
        } else if (file && typeof file.url === 'string') {
          // If it's an object with a url property, add the URL
          processedFiles.push({ name: file.name || "URL File", content: file.url });
        } else {
          console.error("Unsupported file type:", file);
        }*/
    }
  }

  //new added, handleIfcViewerFiles will correctly trigger initializeViewer() after being updated.
  // 2025-03-19
  useEffect(() => {
    if (isIfcViewerFilesHandled && !isInitialized && !isModelsloaded && ifcViewerFiles) {
      console.log("To initializeViewer()", ifcViewerFiles);
      initializeViewer();
    }
  }, [isIfcViewerFilesHandled]);

  // Initialize the viewer
  //  useEffect(() => {
  async function initializeViewer() {
    console.log("initializeViewer() ");
    console.log("Initializing Viewer, is file handles?", isIfcViewerFilesHandled);
    setLoadingLog("Initializing Viewer...");
    const container = containerRef.current;
    if (!container) return;

    console.log("initializeViewer() ");

    // Setup world and components
    world.scene = new OBC.SimpleScene(components);
    world.renderer = new OBC.SimpleRenderer(components, container);
    world.camera = new OBC.SimpleCamera(components);

    // Add grid to the viewer
    viewerGrids.create(world);

    components.init();

    world.camera.controls.setLookAt(12, 6, 8, 0, 0, -10);
    world.scene.setup();
    world.scene.three.background = null;

    await fragmentIfcLoader.setup();
    fragmentIfcLoader.settings.webIfc.COORDINATE_TO_ORIGIN = true;

    console.log("initializeViewer() ");

    setIndexer(components.get(OBC.IfcRelationsIndexer));


    // Setup highlighter
    highlighter.setup({ world });
    highlighter.zoomToSelection = true;
    // 2025-05-02, new added to handle activity selection highlights
    //Possible to define different colors for different activity types
    await highlighter.add("ActivitySelection", new THREE.Color(0xff5bb3)); //Yellow: 0xFFFF00

    setIsInitialized(true);
    console.log("Complete initializing Viewer");
    setLoadingLog("Complete initializing Viewer");
  }
  // }, [isIfcFilesHandled]);//isInitialized, components, highlighter, fragmentIfcLoader, world

  useEffect(() => {
    console.log("To loading, is initialized?", isInitialized);
    if (isInitialized) {
      console.log("To loadModels()", ifcViewerFiles);
      loadModels();
      //highlightEvent();
    }
  }, [isInitialized]);


  // Handle model loading whenever ifcViewerFiles changes
  //  useEffect(() => {
  async function loadModels() {
    console.log("loadModels() ");
    console.log("Loading model, is initialized?", isInitialized);
    if (isModelsloaded) return;

    try {
      console.log("ifcViewerFiles after content:", ifcViewerFiles); // Debug log

      const newModels = [];
      for (const file of ifcViewerFiles) {
        if (file.content instanceof Blob) {
          console.log("Loading file:", file);
          const arrayBuffer = await file.content.arrayBuffer();
          const buffer = new Uint8Array(arrayBuffer);
          const model = await fragmentIfcLoader.load(buffer);
          model.isLoadedModel = true; // Add a custom tag
          model.name = file.name;
          world.scene.three.add(model);

          console.log("Model loaded:", model);

          await indexer.process(model);
          //console.log("Indexer in viewer:", indexer);

          //const indexer = components.get(OBC.IfcRelationsIndexer);
          //await indexer.process(model);

          //console.log("Print out selection:", highlighter.selection);

          /*highlighter.events.select.onClear.add(() =>{
            console.log("Highlight cleared");
          });*/
          newModels.push(model);

          // Add newly loaded models to the state
          //setLoadedModels(prev => [...prev, newModel]);
          setLoadedModels([...newModels]); //clone or replace the array when modifying

          // Listen for when fragments are fully loaded
          fragments.onFragmentsLoaded.add((model) => {
            console.log("Fragments loaded:", model);
          });
          console.log("fragments:", fragments);


          setIsModelsloaded(true);
          console.log("IsModelsloaded:", isModelsloaded);
        }
        else {
          console.log("file.content is not Blob:", file.content);
        }
      }

    } catch (error) {
      console.error("Error loading IFC files:", error);
    }
  }

  // }, [isInitialized, isModelsloaded]);//, fragmentIfcLoader, fragments, world.scene, highlighter

  useEffect(() => {

    async function highlightElements() {

      highlighter.events.select.onHighlight.add(async (fragmentIdMap) => {
        console.log("Print out fragmentIdMap:", fragmentIdMap);
        //const highlightedIds = Object.keys(fragmentIdMap);
        //const values = Object.values(fragmentIdMap);
        //console.log("Print out highlightedIds and values:", highlightedIds, values);
        const highlightedExpressIds = [];

        try {
          Object.entries(fragmentIdMap).forEach(async ([key, fset], findex) => {
            // Assuming you want the first element in each Set (if it exists)
            //console.log(`fragmentIdMap: Set at index ${findex} and key ${key} is fset ${fset}`);
            if (fset.size > 0) {
              const expressID = [...fset][0];
              //console.log("First Value in Set:", expressID);
              if (!highlightedExpressIds.includes(expressID)) {
                highlightedExpressIds.push(expressID);
              }
            }

          });
          console.log("All highlightedExpressIds:", highlightedExpressIds);
        } catch (error) {
          console.error(`Error processing fragmentIdMap for expressID:`, error);
        }

        setHighlightedElements([]);
        //setgHighlightedElements([]);
        const newElements = [];

        for (const model of loadedModels) {
          try {
            highlightedExpressIds.forEach(async (selectedExpressID, index) => {
              // Assuming you want the first element in each Set (if it exists)
              //if (set.size > 0) {
              //const selectedExpressID = [...set][0]; // Convert Set to array and take the first element
              console.log(`Set at index ${index}: expressID is ${selectedExpressID}`);
              //const property = model._properties[selectedExpressID];
              const property = await model.getProperties(selectedExpressID);
              if (property) {
                console.log("founded model.getProperties for expressID:", selectedExpressID, property);

                newElements.push(property);
                console.log("In the loop newElements:", newElements);
              }

              //
              //const pset = await model.getPropertiesData(property);
              //console.log("founded model.getPropertiesData(property):", pset);
              //setHighlightedElements(newElements);
              //console.log("To be gobally highlighted elements in the loop:", ghighlightedElements);

              //console.log("Indexer in highlight:", indexer);
              const psets = indexer.getEntityRelations(model, selectedExpressID, "IsDefinedBy");
              if (psets) {
                for (const expressID of psets) {
                  // You can get the pset attributes like this
                  const pset = await model.getProperties(expressID);
                  console.log("here comes the pset: ", pset);

                  //Print out quantity set: ( 2025-01-28)
                  if (pset.Quantities) {
                    const psetQuantities = pset.Quantities;
                    console.log("pset.Quantities: ", psetQuantities);
                    psetQuantities.forEach(async (qset, q_index) => {
                      const q_expressID = qset.value;
                      const q_property = await model.getProperties(q_expressID);

                      console.log("each quantity set's quantity:", q_index, q_property);
                      //const updatedText = printedText + "," + q_index;
                      //setPrintedTexts(printedText + "," + q_index);
                    });

                  }
                }
              }
              //} 
            });
          } catch (error) {
            console.error(`Error processing model ${model.name} for expressID:`, error);
          }
        }

        console.log("To be highlighted newElements:", newElements);
        setHighlightedElements(newElements);
        //setgHighlightedElements(newElements);
        //console.log("To be gobally highlighted elements:", ghighlightedElements);

      });
      console.log("Show highlighter:", highlighter);
    }

    if (isModelsloaded) {
      highlightElements();
    }

  }, [isModelsloaded, highlighter]);//, highlightedElements

  // Use useEffect to update displayElements whenever highlightedElements changes
  useEffect(() => {
    setDisplayElements(highlightedElements);
  }, [highlightedElements]);

  // Use useEffect to update displayModels whenever loadedModels changes
  useEffect(() => {
    setDisplayModels(loadedModels);
  }, [loadedModels]);

  // 2025-06-10, Use useEffect to update displayLoadingLog whenever loadingLog changes
  useEffect(() => {
    setDisplayLoadingLog(loadingLog);
    console.log("Loading log for display:", loadingLog);
  }, [loadingLog]);

  //style={{ listStyle: 'none', padding: 0 }}
  return (
    <div style={{ position: "relative"}} className="parentContainer">
      {ifcViewerFiles && ifcViewerFiles.length > 0 ? (
        <>
          <div ref={containerRef} className="viewerWrapper border-0 p-0 m-0"/>
          <div className="position-absolute top-0 end-0 p-2 bg-light bg-opacity-50 text-dark rounded shadow small"
    style={{ margin: "20px", zIndex: 1080, maxWidth: "35%" }}>
           <span className="text-muted fw-bold">Modelle</span>
         
              {displayModels?.map((model, index) => (
                <div key={index} className="form-check form-switch">

  <input
    className="form-check-input"
    type="checkbox"
    id={`switch-${model.id}`}
    checked={isChecked(model)}
    onChange={() => handleToggle(model)}
  />
  <label className="form-check-label font-monospace" htmlFor={`switch-${model.id}`}>
    {model.name || "Unnamed"}
  </label>

                </div>
              ))}


              <div className="d-none">
              {selectedModels?.map((model, index) => (
                <p key={index}>
                  Selected Model: {model.name || "Unnamed"}
                </p>
              ))}
              </div>

              {displayElements?.map((element, index) => (
                <p key={index} className="d-none">
                  Selected element {index + 1}: #{element?.expressID || "NULL expressID"} - {element.GlobalId?.value || "NULL GlobalId"}

                </p>
              ))}
          
          </div>


        </>
      ) : (
        <div className="d-flex flex-column justify-content-center align-items-center w-100 h-100">
          <div className="spinner-border text-secondary mb-3 mt-5" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted fw-light">{displayLoadingLog}</p>
        </div>
      )}
    </div>
  );
};
//Model {index + 1} - {model.name || "Unnamed"}
//Maßnahme, Variant
export default IfcViewerX;

/* <button
      onClick={() => {
        model.visible = !model.visible;
      }}
    >
      Show/Hide
    </button>
    <button
      onClick={() => {
        world.scene.three.remove(model);
        setLoadedModels((prev) => prev.filter((_, i) => i !== index));
      }}
    >
      Remove
    </button>
    */
