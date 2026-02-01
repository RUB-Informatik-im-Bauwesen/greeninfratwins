// created 2024-11-05
import React, { useEffect, useRef, useState } from "react";
import * as WEBIFC from "web-ifc";
import * as OBC from "@thatopen/components";
import * as OBF from "@thatopen/components-front";
import * as CUI from "@thatopen/ui-obc";  // Import CUI components, added by  on 2024-11-10
import * as BUI from "@thatopen/ui";

//selectedFiles
const IfcViewerX = ({receivedFiles}) => {//, fileURL, fileName, fileContent, isCompleteFileSelection
  const containerRef = useRef(null);
  const components = new OBC.Components();
  const worlds = components.get(OBC.Worlds);
  //const world = worlds.create(OBC.SimpleScene, OBC.SimpleCamera, OBC.SimpleRenderer);
  const world = worlds.create(); //Update for loading multi-model,  2024-11-15
  
  const fragments = components.get(OBC.FragmentsManager);
  const fragmentIfcLoader = components.get(OBC.IfcLoader);

  const [isInitialized, setIsInitialized] = useState(false); // state to track initialization
  const filePath = fileURL ? fileURL + '/' + fileName : '';
  

  // Initialize the viewer only when the file path is set
  useEffect(() => {
    //Step 1: initializeViewer in any case
    async function initializeViewer() {

      console.log("Call initializeViewer, should be only once");
      const container = containerRef.current;
      if (!container) return;

      world.scene = new OBC.SimpleScene(components);
      world.renderer = new OBC.SimpleRenderer(components, container);
      world.camera = new OBC.SimpleCamera(components);

      //  new added for Grid view, 2024-11-10
      const viewerGrids = components.get(OBC.Grids);
      viewerGrids.create(world);

      components.init();

      world.camera.controls.setLookAt(12, 6, 8, 0, 0, -10);
      world.scene.setup();
      world.scene.three.background = null;
      
      await fragmentIfcLoader.setup();
      fragmentIfcLoader.settings.webIfc.COORDINATE_TO_ORIGIN = true;

       //  new added to setup highlight, 2024-11-10
      const highlighter = components.get(OBF.Highlighter);
      highlighter.setup({ world });
      highlighter.zoomToSelection = true;

      // Mark initialization as done
      setIsInitialized(true);
    }

    //Step 2: load all models after completing selection
    async function loadModel() 
    {
      try // added on 2024-11-10
      {
        console.log("Loading file from:", filePath);

        // Fetching the file from the given filePath (URL or local path)
        //const file = await fetch(filePath);
        //const file = await fetch("https://thatopen.github.io/engine_components/resources/small.ifc"); //"https://thatopen.github.io/engine_components/resources/small.ifc" 
        /*if (!file.ok) {
          throw new Error('Failed to fetch file: ' + filePath);
        }*/
        //  fileContent

        // Load each selected file into the viewer
        //for (const file of selectedFiles) {
          //console.log("Loading file from:", file.url);
          const data = await fileContent.arrayBuffer();
          const buffer = new Uint8Array(data);

          // Convert the blob to a Uint8Array,  added, 2024-11-10
          /*console.log("Content:", fileBlob);
        
          const arrayBufferData = await fileBlob.arrayBuffer();
          const buffer = new Uint8Array(arrayBufferData);*/

          // Loading the model from the buffer
          const model = await fragmentIfcLoader.load(buffer);

          // Listen for when the fragments are loaded
        fragments.onFragmentsLoaded.add((model) => {
          console.log('Fragments loaded:', model);
        });

          console.log("Model loaded:", model);
          world.scene.three.add(model);
          /*fragments.onFragmentsLoaded.add(async (model) => {
            if (world.scene) world.scene.three.add(model);
          });*/

          //const indexer = components.get(OBC.IfcRelationsIndexer);
          //await indexer.process(model);

          // Listen for when the fragments are loaded, previous version before 2024-11-10
          /*fragments.onFragmentsLoaded.add((model) => {
            console.log('Fragments loaded:', model);
          });*/
          /*fragments.onFragmentsLoaded.add(async (model) => {
            if (model.hasProperties) await indexer.process(model);
          });*/
        //}
        
      }catch (error) {
        console.error('Error loading IFC file:', error);
      }
    }
    if(!isInitialized)
    {
      initializeViewer();
    }
   
    
    //if (!fileName || !filePath || isCompleteFileSelection) return; // Don't initialize if no file or already initialized
    //if (!selectedFiles || selectedFiles.length === 0 || isInitialized) return; //Updated by  on 2024-11-13 for mult-file selection

    // Call the function only when filePath changes and is set
    if (isInitialized && filePath)// && isCompleteFileSelection) 
    {
      loadModel();
    }
    
  }, [fileName, filePath, isInitialized]); // selectedFiles Effect runs when fileName or filePath changes

  /*{fileName && (
    <div>
    <p>
      Selected files: {filePath}
    </p>
  </div>
    )}*/
  return (
    <div ref={containerRef} style={{ height: "600px", width: "100%" }}>
    </div>
  );
};

export default IfcViewerX;
