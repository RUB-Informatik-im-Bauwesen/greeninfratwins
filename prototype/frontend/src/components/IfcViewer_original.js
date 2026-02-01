import React, { useEffect, useRef, useState } from 'react';
import * as WEBIFC from "web-ifc";
import * as OBC from "@thatopen/components";

// IfcViewer Komponente, die eine IFC-Datei als Prop erhält
const IfcViewer = ({ file }) => {
  // Refs für DOM-Container, OBC-Komponenten und World
  const containerRef = useRef(null);
  const componentsRef = useRef(null);
  const worldRef = useRef(null);
  // State für den Ladezustand
  const [isLoaded, setIsLoaded] = useState(false);

  // Effekt zum Einrichten der Szene beim ersten Rendern
  useEffect(() => {
    console.log("IfcViewer received File: ", file);
    
    // Funktion zum Einrichten der Szene
    const setupScene = async () => {
      // Erstellen der OBC-Komponenten
      const components = new OBC.Components();
      componentsRef.current = components;

      // Erstellen einer neuen Welt
      const worlds = components.get(OBC.Worlds);
      worldRef.current = worlds.create();

      // Referenz auf den DOM-Container
      const container = containerRef.current;
      
      // Einrichten von Szene, Renderer und Kamera
      worldRef.current.scene = new OBC.SimpleScene(components);
      worldRef.current.renderer = new OBC.SimpleRenderer(components, container);
      worldRef.current.camera = new OBC.SimpleCamera(components);

      // Initialisieren der Komponenten
      components.init();
      
      // Einstellen der Kameraposition
      worldRef.current.camera.controls.setLookAt(12, 6, 8, 0, 0, -10);
      
      // Einrichten der Szene
      worldRef.current.scene.setup();

      // Erstellen eines Gitters
      const grids = components.get(OBC.Grids);
      grids.create(worldRef.current);

      // Setzen des Hintergrunds auf transparent
      worldRef.current.scene.three.background = null;

      // Einrichten des IFC-Loaders
      const fragments = components.get(OBC.FragmentsManager);
      const fragmentIfcLoader = components.get(OBC.IfcLoader);
      await fragmentIfcLoader.setup();

      // Ausschließen bestimmter IFC-Kategorien
      const excludedCats = [
        WEBIFC.IFCTENDONANCHOR,
        WEBIFC.IFCREINFORCINGBAR,
        WEBIFC.IFCREINFORCINGELEMENT,
      ];
      for (const cat of excludedCats) {
        fragmentIfcLoader.settings.excludedCategories.add(cat);
      }

      // Einstellen der IFC-Loader-Einstellungen
      fragmentIfcLoader.settings.webIfc.COORDINATE_TO_ORIGIN = true;

      // Setzen des Ladezustands auf true
      setIsLoaded(true);
    };

    setupScene();

    // Aufräumfunktion
    return () => {
      if (componentsRef.current) {
        componentsRef.current.dispose();
      }
    };
  }, []);

  // Effekt zum Laden der IFC-Datei, wenn die Szene geladen ist und eine Datei vorhanden ist
  useEffect(() => {
    if (isLoaded && file) {
      loadIfc(file);
    }
  }, [isLoaded, file]);

  // Funktion zum Laden der IFC-Datei
  const loadIfc = async (fileData) => {
    console.log("Loading IFC file:", fileData);
    if (!fileData) return;
  
    try {
      const fragmentIfcLoader = componentsRef.current.get(OBC.IfcLoader);
      let model;
  
      // Laden der Datei je nach Typ (Uint8Array oder URL)
      if (fileData instanceof Uint8Array) {
        model = await fragmentIfcLoader.load(fileData);
      } else if (typeof fileData === 'string') {
        const response = await fetch(fileData);
        const arrayBuffer = await response.arrayBuffer();
        model = await fragmentIfcLoader.load(new Uint8Array(arrayBuffer));
      } else {
        console.error("Unsupported file type:", fileData);
        return;
      }
  
      // Benennen und Hinzufügen des Modells zur Szene
      model.name = 'Loaded Model';
      worldRef.current.scene.three.add(model);
    } catch (error) {
      console.error("Error loading IFC file:", error);
    }
  };

  // Funktion zum Exportieren der Fragmente
  const exportFragments = async () => {
    const fragments = componentsRef.current.get(OBC.FragmentsManager);
    if (!fragments.groups.size) return;

    const group = Array.from(fragments.groups.values())[0];
    const data = fragments.export(group);
    download(new File([new Blob([data])], "exported.frag"));

    const properties = group.getLocalProperties();
    if (properties) {
      download(new File([JSON.stringify(properties)], "properties.json"));
    }
  };

  // Funktion zum Entfernen der Fragmente
  const disposeFragments = () => {
    const fragments = componentsRef.current.get(OBC.FragmentsManager);
    fragments.dispose();
  };

  // Hilfsfunktion zum Herunterladen von Dateien
  const download = (file) => {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(file);
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // Rendern des Viewers und der Steuerelemente // ref={containerRef},
  return (
    <div>
      <div style={{ width: '100%', height: '100%', padding:'0', margin: '0' }}>
      <h4>File Content:</h4>
      <pre>{file}</pre> {/* Example: display text content */}
      </div>

      <button onClick={exportFragments}>Export Fragments</button>
      <button onClick={disposeFragments}>Reset Viewer</button>
    </div>
  );
};

export default IfcViewer;