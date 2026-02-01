import { useEffect, useState, useContext } from "react";
import { AppContext } from "../AppProvider";
import { FaCaretDown } from "react-icons/fa";
import { toast } from "react-toastify";

const VarianteTab = (props) => {//varID should be 1 or 2
  const {
    massnahmeVariante, setMassnahmeVariante,
    fragments, highlightedElements,
    indexer, highlighter,
    loadedModels, setLoadedModels,
    selectedModels, setSelectedModels
  } = useContext(AppContext);

  const [displayMassnahmeVariante, setDisplayMassnahmeVariante] = useState(null);// Display massnahmeVariante, 2025-06-21

  const vIndex = props.varID;

  // 2025-08-14, Store dropdown selections per activity index
  const [dropdownSelections, setDropdownSelections] = useState({});
  // 2025-08-14, Handler for dropdown changes
  const handleDropdownChange = (aIndex, field, value) => {
    setDropdownSelections(prev => ({
      ...prev,
      [aIndex]: {
        ...prev[aIndex],
        [field]: value
      }
    }));
    // Update massnahmeVariante for the current Variante and activity
    const updated = structuredClone(massnahmeVariante);
    if (
      updated &&
      updated.varianten &&
      updated.varianten[vIndex] &&
      updated.varianten[vIndex].activity &&
      updated.varianten[vIndex].activity[aIndex]
    ) {
      updated.varianten[vIndex].activity[aIndex][field] = value;
      setMassnahmeVariante(updated);
    }
    console.log(`Aktivität ${aIndex}: ${field} selected value:`, value);
    //console.log("Updated massnahmeVariante:", updated);
  };


  useEffect(() => {
    if (
      !massnahmeVariante ||
      !Array.isArray(massnahmeVariante.varianten) ||
      vIndex == null ||
      vIndex >= massnahmeVariante.varianten.length
    ) {
      console.warn("vIndex oder Variantenliste ungültig");
      return;
    }
    
    const activities = massnahmeVariante.varianten[vIndex].activity ?? [];
    const ifcFileNames = activities.map((act) => act.ifcFile).filter(Boolean);

    if (loadedModels && Array.isArray(ifcFileNames)) {
      loadedModels.forEach((model) => {
        const shouldBeVisible = ifcFileNames.includes(model.name);
        model.visible = shouldBeVisible;
      });

      const selected = loadedModels.filter((model) =>
        ifcFileNames.includes(model.name)
      );
      setSelectedModels([...selected]);
      //console.log("Ausgewählte Modelle (selectedModels):", selected.map(m => m.name));
    }

    if (
      !massnahmeVariante ||
      !Array.isArray(massnahmeVariante.varianten) ||
      vIndex == null ||
      vIndex >= massnahmeVariante.varianten.length
    ) {
      return;
    }


    if (activities.length > 0) {
      (async () => {
        for (const act of activities) {

          try {
            await highlightActivity?.(act); // optional chaining falls Funktion fehlt
            await handleActivityClick?.(act);

          } catch (error) {
            console.warn("Fehler bei highlightActivity oder handleActivityClick:", error);
          }
          if (!act.guids || act.guids.length === 0) {
            toast.error("IFC Elemente für Aktivität " + act.activityName + " nicht initialisiert.", { autoClose: 10000 });
          }
        }

      })();
    }





    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const handleActivityClick = async (act, aIndex) => {
    if(!loadedModels){
      toast.error("Bitte warten bis das Modell geladen ist.", { autoClose: 5000 });
    }
    //console.log("Check act.activityName:", act.activityName);
    if (!act.guids || act.guids.length === 0) {
      await highlightActivity(act); // generate guids
    } else {
      await highlightElementsByGuids(act.guids);
    }
  };

  //added on 2025-06-21, to handle highlight for BR 5
  async function highlightActivity(act) {

    //Step 1: Make sure the selected Models are target models
    const matchingModels = selectedModels.filter(model => model.name === act.ifcFile);

    console.log("Check act.activityName:", act.activityName, " Matching models:", matchingModels, "Total:", matchingModels.length);

    if (matchingModels.length === 1) { //&& selectedModels.length === 1
      // Valid: Only one model selected and it's the correct one
      console.log("Proceed with highlighting activity:", act);
      console.log("Matching model:", matchingModels[0], "Total:", matchingModels.length);
      //Step 1: Make sure the selected Models are target models
      try {

        //Current solution: 1) Get all the properties in models;
        const allProperties = Object.entries(matchingModels[0]._properties);
        console.log("allProperties in matchingModels[0]:", allProperties);

        // 2) Find all the properties with the desired PropertySet called as follows; 
        allProperties.forEach(async ([key, activityElement], pindex) => {
          if (activityElement?.Name?.value === "SustainabilityAssessment" || activityElement?.Name?.value === "Nachhaltigkeitsmerkmale")//Fix for AWF 2 & 3, BR 5
          {
            //console.log("Matched PropertySet:", activityElement);
            const actElementEid = activityElement?.expressID;
            //console.log("activityElement HasProperties:", activityElement?.HasProperties);

            //3) Find all ActivityType inside the PSet
            Object.entries(activityElement?.HasProperties).forEach(async ([key2, actPropertyEach], index2) => {
              const actPropertyID = actPropertyEach.value;
              //console.log("actPropertyID:", actPropertyID);
              const actProperty = await matchingModels[0].getProperties(actPropertyID);
             // console.log("each actProperty: ", actProperty);

              //Find all the activityType
              if (actProperty?.Name?.value === "ActivityType") {
              //  console.log("Found ActivityType actProperty: ", actProperty);

                //4) Get the value of each ActivityType
                const currentActivityType = actProperty.NominalValue?.value;
               // console.log("Found ActivityType: ", currentActivityType, act.activityName);

                if (currentActivityType === act.activityName) {
                  //5) Get its parent GUID
                  const psetDefinitions = indexer?.getEntitiesWithRelation?.(
                    matchingModels[0],
                    "IsDefinedBy",
                    actElementEid,
                  );
                 // console.log("psetDefinitions: ", psetDefinitions);
                  if (psetDefinitions?.size > 0) {
                    const actParentID = [...psetDefinitions][0];
                    //const actParentID = Object.entries(psetDefinitions).at(0);
                    //console.log("actParentID: ", actParentID);
                    const actParent = await matchingModels[0].getProperties(actParentID);
                    //console.log("actParent: ", actParent);
                    const psGuid = actParent?.GlobalId?.value;
                    //console.log("activityElement GUID:", psGuid);

                    //Check if this currentActivityType is already in activitiesDataTemp
                    /*const existingActivity = activitiesDataTemp.activities.find(
                      act => act.type === currentActivityType
                    );*/


                    // Ensure guids is an array
                    if (!Array.isArray(act.guids)) {
                      act.guids = [];
                      act.guids.push(psGuid);
                     // console.log("create new guids:", act.guids);
                     // console.log("act:", act);
                    }
                    // Avoid duplicates
                    else if (!act.guids.includes(psGuid)) {
                      act.guids.push(psGuid);

                    }

                    setDisplayMassnahmeVariante(structuredClone(massnahmeVariante));//Make immediately update, 2025-06-21
                    setMassnahmeVariante(structuredClone(massnahmeVariante));
                    return act;
                  }
                }

              }
              //Possible to find EDP Menge
              else if (actProperty?.Name?.value === "EPD-bezogene Menge") {
                console.log("Found EPD-bezogene Menge actProperty: ", actProperty);
              }
              //Possible to find EPD Verbindung (URL)
              else if (actProperty?.Name?.value === "EPD Verbindung") {
                console.log("Found EPD Verbindung actProperty: ", actProperty);
              }
            });
          }

        });

        /*if (Array.isArray(act.guids)) {
          console.log("guids inside:", act.guids);
          setGuidsToHighlight([...act.guids]); // Clone to trigger effect
 
        } else {
          console.warn("Invalid GUIDs:", act.guids);
        }*/


      } catch (error) {
        console.error(`Error processing model ${matchingModels[0].name} for activities:`, error);
      }


    } else {
      // Invalid selection — show an alert or message box
      console.warn(`Bitte wählen Sie genau ein Modell aus, das zu "${act.ifcFile}" gehört.`);
    }

  };


  //Call thatopen library and handle highlight event here, 2025-04-28
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

  // Use useEffect to update displayMassnahmeVariante whenever massnahmeVariante changes
  useEffect(() => {
    setDisplayMassnahmeVariante(massnahmeVariante);
  }, [massnahmeVariante]);

  //Highlight when guidsToHighlight chnages
  /*useEffect(() => {
  if (Array.isArray(guidsToHighlight) && guidsToHighlight.length > 0) {
    highlightElementsByGuids(guidsToHighlight);
  }
}, [guidsToHighlight]);*/

  const [openCards, setOpenCards] = useState({});

  // Beim Laden/Wechseln der Daten: alle Karten öffnen
  useEffect(() => {
    const acts = displayMassnahmeVariante?.varianten?.[vIndex]?.activity ?? [];
    const allOpen = Object.fromEntries(acts.map((_, i) => [i, true]));
    setOpenCards(allOpen);
  }, [vIndex, displayMassnahmeVariante]);

  const toggleCard = (idx) =>
    setOpenCards((prev) => ({ ...prev, [idx]: !prev[idx] }));

  return (
    <div className="variante h-100 p-0">
      <div style={{ overflow: "scroll", height: "90%", overflowX: "clip" }} className="pe-3 m-0">
        {/* Variantenüberschrift */}
        <h3>
          Beschreibung
        </h3>

        {/* IFC Modell Info */}
        <div className="mb-3 text-muted">
          {displayMassnahmeVariante?.varianten[vIndex]?.nameMeasureVariant}
        </div>

        {/* Aktivitätenüberschrift */}
        <h3 className="measure my-3">Aktivitäten</h3>

        {/* Aktivitätenliste, make sure printing Abbruch first, then printing Einbau, change 2025/10/2*/}
        {vIndex >= 0 && (() => {
          const activities = displayMassnahmeVariante?.varianten[vIndex]?.activity || [];
          let abbruch = null, einbau = null, others = [];
          activities.forEach((act, idx) => {
            if (act.activityName === "Abbruch") abbruch = { act, idx };
            else if (act.activityName === "Einbau") einbau = { act, idx };
            else others.push({ act, idx });
          });
          const ordered = [];
          if (abbruch)ordered.push(abbruch);
          if (einbau)ordered.push(einbau);
          ordered.push(...others);
          return ordered.map(({ act, idx }, aIndex) => (
            <div className="card mb-4" key={idx}>
              {/* Aktivitätskopf */}
              <div className="card-header d-flex align-items-center gap-2 py-2">
                {/* Caret als klickbare Fläche mit Hover */}
                <span
                  role="button"
                  tabIndex={0}
                  aria-label={openCards[idx] ? "Einklappen" : "Ausklappen"}
                  aria-expanded={openCards[idx] ? "true" : "false"}
                  onClick={() => toggleCard(idx)}
                  onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && toggleCard(idx)}
                  className={`caret-toggle d-inline-flex align-items-center justify-content-center ${openCards[idx] ? "is-open" : "is-closed"}`}
                >
                  <FaCaretDown className={`transition-transform ${openCards[idx] ? "rotate-0" : "rotate-270"}`} />
                </span>

                {/* Titel inline */}
                <h6 className="mb-0 text-truncate">
                  Aktivität {aIndex + 1}: {act.activityName}
                </h6>

                {/* Selektions-Button rechts */}
                <div className="ms-auto">
                  <button
                    type="button"
                    onClick={() => handleActivityClick(act, idx)}
                    className="btn btn-sm btn-light"
                    style={{ width: "100%" }}
                  >
                    {!act.guids || act.guids.length === 0 ? "Ermittle zugehörige Elemente" : "Selektiere Elemente"}
                  </button>
                </div>
              </div>

              {/* Aktivitätsinhalt nur anzeigen, wenn offen */}
              {openCards[idx] && (
                <div className="card-body">

                  {/* Kopfzeile der Indikatoren */}
                  <div className="row fw-bold border-bottom pb-2">
                    <div className="col-md-4">Indikatorsatz</div>
                    <div className="col-md-4">Zu berechnende Indikatoren</div>
                  </div>

                  {/* Zeilen für Indikatoren */}
                  {act.indicatorSet?.map((set, sIndex) => (
                    <div className="row py-2 border-bottom" key={sIndex}>
                      <div className="col-md-4">{set.indicatorSetName}</div>
                      <div className="col-md-7 border-1 border-start">
                        {set.indicators?.map((ind, i) => (
                          <span key={i} className="badge bg-secondary fw-lighter me-1">
                            {ind}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* IFC-Datei */}
                  <div className="row fw-bold border-bottom py-2 pt-5">
                    <div className="col-md-12">
                      Zugehörige Elemente im IFC-Modell <code>{act.ifcFile}</code>
                    </div>
                  </div>

                  {/* GUIDs */}
                  {act.guids ? (
                    <div className="row py-2 border-bottom mt-2">
                      <div className="col-md-3">Modellelemente</div>
                      <div className="col-md-8">
                        {act.guids?.map((ind, i) => (
                          <span
                            key={i}
                            className="badge bg-secondary fw-lighter me-1 font-monospace"
                          >
                            {ind}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="row py-2 border-bottom mt-2">
                      <div className="col-md-4">Modellelemente</div>
                      <div className="col-md-7">noch nicht ermittelt</div>
                    </div>
                  )}
                  {(act.activityName === "Abbruch" || act.activityName === "Einbau") && props.countryCode === "CH" && props.awfNr === "AWF2" && (
                    <>
                    <div className="row fw-bold border-bottom py-2 pt-5">
                      <div className="col-md-12">
                        Weitere einstellbare Parameter der Variante
                      </div>
                    </div>
                    {/* Dropdowns für Abbruch oder Einbau */}

                    <div className="row py-2">
                      <div className="col-5">
                        <label htmlFor={`bauphase-${idx}`} className="form-label">
                          Anzahl Bauphasen
                        </label>
                        <select
                          id={`bauphase-${idx}`}
                          required
                          className="form-select form-select-sm"
                          value={displayMassnahmeVariante?.varianten[vIndex]?.activity[idx]?.AnzahlBauphase || ""}
                          onChange={(e) =>
                            handleDropdownChange(idx, "AnzahlBauphase", e.target.value)
                          }
                        >
                          <option value="" disabled>Bitte auswählen</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                        </select>
                      </div>
                      <div className="col-5">
                        <label htmlFor={`zone-${idx}`} className="form-label">
                          Maximal zulässige Geschwindigkeit [km/h]
                        </label>
                        <select
                          id={`zone-${idx}`}
                          required
                          className="form-select form-select-sm"
                          value={displayMassnahmeVariante?.varianten[vIndex]?.activity[idx]?.zulGeschwindigkeitZone || ""}
                          onChange={(e) =>
                            handleDropdownChange(idx, "zulGeschwindigkeitZone", e.target.value)
                          }
                        >
                          <option value="" disabled>Bitte auswählen</option>
                          <option value="60">60</option>
                          <option value="80">80</option>
                        </select>
                      </div>
                    </div>
                  </>
                  )}

                </div>
              )}
            </div>
          ));
        })()}
      </div>
    </div>

  );
};

export default VarianteTab;