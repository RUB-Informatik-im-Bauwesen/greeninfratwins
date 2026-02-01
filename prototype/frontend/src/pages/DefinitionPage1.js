import React, { useMemo, useState, useEffect, useContext } from "react";
import "./DefinitionPage1.css";
import { useNavigate } from "react-router-dom";
import Measure from "../components/uc1/MeasureTab";
import ActivityTab from "../components/uc1/ActivityTab";
import PopupAddTab from "../components/uc1/popups/PopupAddTab";
import PopupExistingAssets from "../components/uc1/popups/PopupExistingAssets";
import PopupCustomAsset from "../components/uc1/popups/PopupCustomAsset";
import PopupHours from "../components/uc1/popups/PopupHours";
import { FaPlusSquare } from "react-icons/fa";
import { AppContext } from "../AppProvider";
import Results from "../components/uc1/ResultsTab";

const DefinitionPage1 = () => {
  const navigate = useNavigate();
  const {
    containerId,
    projectId,
    measure,
    setMeasure,
    selectedModels,
    indexer
  } = useContext(AppContext);

  const formatDate = (dateString) => {
    if (!dateString) return "Kein Datum";
    const date = new Date(dateString);
    return date.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  /**
   * Sucht zunächst ein Element anhand eines Such-PSet/Property/Wert
   * und liefert daraus das Ziel-Property (Ziel-PSet/Property) zurück.
   * (unverändert übernommen)
   */
  async function retrieveProperty(
    act,
    searchPropertySetName,
    searchPropertyName,
    searchPropertyValue,
    targetPropertySetName,
    targetPropertyName
  ) {
    const model = selectedModels?.find(m => m?.name === act?.model);
    if (!model) {
      console.warn("Kein passendes Modell gefunden für:", act?.model);
      return null;
    }

    const all = Object.entries(model._properties ?? {}); // [ [id, entity], ... ]

    const idOf = (ref) => (ref && typeof ref === "object" && "value" in ref ? ref.value : ref);
    const nameOf = (ent) => ent?.Name?.value ?? ent?.Name ?? null;
    const nominalOf = (prop) =>
      prop?.NominalValue?.value ??
      prop?.NominalValue?.wrappedValue ??
      prop?.NominalValue ??
      null;
    const eq = (a, b) => String(a).trim() === String(b).trim();

    const results = [];

    for (const [, pset] of all) {
      if (!pset?.HasProperties) continue;
      if (nameOf(pset) !== searchPropertySetName) continue;

      const psetId = pset.expressID;

      for (const ref of pset.HasProperties) {
        const propId = idOf(ref);
        const prop = await model.getProperties(propId);
        if (!prop) continue;

        if (nameOf(prop) !== searchPropertyName) continue;

        const val = nominalOf(prop);
        if (!eq(val, searchPropertyValue)) continue;

        const owners = indexer.getEntitiesWithRelation(model, "IsDefinedBy", psetId) || new Set();
        if (!owners.size) continue;

        for (const elementId of owners) {
          const element = await model.getProperties(elementId);
          const elementGuid = element?.GlobalId?.value ?? null;

          let targetHit = null;

          for (const [, pset2] of all) {
            if (!pset2?.HasProperties) continue;
            if (nameOf(pset2) !== targetPropertySetName) continue;

            const pset2Id = pset2.expressID;
            const owners2 = indexer.getEntitiesWithRelation(model, "IsDefinedBy", pset2Id) || new Set();
            if (!owners2.has(elementId)) continue;

            for (const ref2 of pset2.HasProperties) {
              const tPropId = idOf(ref2);
              const tProp = await model.getProperties(tPropId);
              if (!tProp) continue;
              if (nameOf(tProp) !== targetPropertyName) continue;

              targetHit = {
                elementId,
                elementGuid,
                search: { psetId, propertyId: propId, value: val },
                target: { psetId: pset2Id, propertyId: tPropId, value: nominalOf(tProp) }
              };
              break;
            }
            if (targetHit) break;
          }

          results.push(
            targetHit ?? {
              elementId,
              elementGuid,
              search: { psetId, propertyId: propId, value: val },
              target: null
            }
          );
        }
      }
    }

    if (results.length === 0) return null;
    return results.length === 1 ? results[0] : results;
  }

  // -------------------------
  // Tabs aus measure ableiten
  // -------------------------
  const [tabs, setTabs] = useState([{ id: 1, guid: "measure", name: "Maßnahme" }]);
  const [activeTab, setActiveTab] = useState(1);

useEffect(() => {
  const activities = Array.isArray(measure?.activity) ? measure.activity : [];

  const activityTabs = activities.map((act, index) => {
    const guid = act.url || act.uri || `activity-${index}`;
    const name = act.label
      ? `${act.label} am ${formatDate(act.date)}`
      : `Aktivität ${index + 1} am ${formatDate(act.date)}`;
    return { id: index + 2, guid, name }; // IDs > 1 für Aktivitäten
  });

  const measureTab = { id: 1, guid: "measure", name: "Maßnahme" };
  const resultsTab = { id: 999, guid: "results", name: "Gesamtergebnisse" }; 
  // hohe ID, damit keine Kollisionen

  // ⬇️ Wichtig: Ergebnisse wird **als letzter Tab** angehängt
  const newTabs = [measureTab, ...activityTabs, resultsTab];

  setTabs(newTabs);
  setActiveTab(prev => (newTabs.some(t => t.id === prev) ? prev : 1));
}, [measure]);


  const handleTabChange = (value) => {
    const tab = tabs.find(t => t.id === value || t.guid === value);
    if (tab) setActiveTab(tab.id);
  };

  const openTabByGuid = (guid) => {
    const tab = tabs.find(t => t.guid === guid);
    if (tab) setActiveTab(tab.id);
  };

  // -------------------------
  // State PRO Aktivität
  // -------------------------
  const [tabDataByKey, setTabDataByKey] = useState({});                 // { [guid]: {...} }
  const [assetList, setAssetList] = useState([]);                        // globale Liste verfügbarer Assets
  const [selectedAssetByKey, setSelectedAssetByKey] = useState({});      // { [guid]: Asset[] }
  const [totalsByKey, setTotalsByKey] = useState({});                    // { [guid]: Totals }

  const initialTotals = {
    totalGWP: 0,
    totalEP: 0,
    totalAP: 0,
    totalPOCP: 0,
    totalKEA: 0,
    totalCost: 0,
  };

  const recalcTotals = (assets = []) => {
    return assets.reduce((totals, asset) => {
      totals.totalGWP += asset?.GWP || 0;
      totals.totalEP += asset?.EP || 0;
      totals.totalAP += asset?.AP || 0;
      totals.totalPOCP += asset?.POCP || 0;
      totals.totalKEA += asset?.KEA || 0;
      totals.totalCost += asset?.cost || 0;
      return totals;
    }, { ...initialTotals });
  };

  // Bei Änderungen der ausgewählten Assets: Totals je Key neu berechnen
  useEffect(() => {
    const nextTotals = {};
    for (const key of Object.keys(selectedAssetByKey)) {
      nextTotals[key] = recalcTotals(selectedAssetByKey[key] || []);
    }
    setTotalsByKey(nextTotals);
  }, [selectedAssetByKey]);

  const handleTabDataChange = (keyOrId, data) => {
    // id->guid auflösen, falls nötig
    const key = typeof keyOrId === "number"
      ? (tabs.find(t => t.id === keyOrId)?.guid ?? String(keyOrId))
      : keyOrId;

    setTabDataByKey(prev => ({ ...prev, [key]: { ...(prev[key] || {}), ...data } }));
  };

  const setSelectedAssetFor = (key, updater) => {
    setSelectedAssetByKey(prev => {
      const prevArr = prev[key] || [];
      const nextArr = typeof updater === "function" ? updater(prevArr) : updater;
      return { ...prev, [key]: nextArr };
    });
  };

  // -------------------------
  // Popups mit Aktivitätskontext
  // -------------------------
  const [showAddTabPopup, setShowAddTabPopup] = useState(false);
  const [popup, setPopup] = useState({ type: null, activityKey: null }); // {type:'existing'|'custom'|'hours'|null, activityKey:string|null}

  const openExistingAssets = (activityKey) => setPopup({ type: "existing", activityKey });
  const openCustomAsset = (activityKey) => setPopup({ type: "custom", activityKey });
  const openHours = (activityKey) => setPopup({ type: "hours", activityKey });

  // manuellen Tab hinzufügen (optional)
  const createNewTab = (title) => {
    const newId = tabs.length + 1;
    const guid = `custom-${newId}`;
    const newTab = { id: newId, guid, name: title || `Aktivität ${newId - 1}` };
    setTabs(prev => [...prev, newTab]);
    // Initialzustände für neuen Tab
    setTabDataByKey(prev => ({ ...prev, [guid]: {} }));
    setSelectedAssetByKey(prev => ({ ...prev, [guid]: [] }));
    setTotalsByKey(prev => ({ ...prev, [guid]: { ...initialTotals } }));
    setShowAddTabPopup(false);
    setActiveTab(newId);
  };

  // -------------------------
  // Measure + Activities laden (dein Originalcode, unverändert)
  // -------------------------
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
            OPTIONAL{
              ?measure rdfs:label ?label.
              ?measure rdfs:comment ?description.
            }
          } 
        `;
        const urlDes = `https://icdd.vm.rub.de/dev01/api/v1/projects/${projectId}/containerTypes/0/containers/${containerId}/query?query=${encodeURIComponent(queryDes)}`;
        const responseDes = await fetch(urlDes, { headers: { Authorization: `Bearer ${token}` } });
        if (!responseDes.ok) throw new Error(`HTTP error! Status: ${responseDes.status}`);
        const resultsJson = await responseDes.json();
        localMeasure.description = resultsJson.results?.bindings[0]?.description?.value || "";
        localMeasure.name = resultsJson.results?.bindings[0]?.label?.value || "";
        localMeasure.url = resultsJson.results?.bindings[0]?.measure?.value || "";

        const queryActivity = `
          PREFIX grit: <https://greeninfratwins.com/ns/grit#>
          PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
          SELECT ?activity ?label ?date ?model ?asset ?assetLabel ?hours ?set ?setlabel ?indicator ?indicatorlabel
          WHERE { 
            <${localMeasure.url}> grit:involvesActivities ?activity .               
            ?activity grit:executedAtDate ?date .
            
            ?activity rdfs:label ?label .
            OPTIONAL {
            ?activity grit:hasIcddModelID ?model .
              ?activity grit:hasAssetUtilization ?assetUtilization .
              ?assetUtilization grit:hasAsset ?asset .
              ?asset rdfs:label ?assetLabel .
              ?assetUtilization grit:operationTimeInHours ?hours.
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
          const aDate = row.date?.value || "";
          const aModel = row.model?.value || "";

          // Activity initialisieren (falls noch nicht vorhanden)
          if (!activityMap[aUrl]) {
            activityMap[aUrl] = {
              url: aUrl,
              label: aLabel,
              date: aDate,
              model: aModel,
              area: null,          // setzt du unten via retrieveProperty
              assets: [],          // [{ uri, label, hours }]
              indicatorsets: []    // [{ uri, label, indicators: [{ uri, label /*, value, unit*/ }] }]
            };
          }

          // ----- Assets (wie gehabt) -----
          const assetUri = row.asset?.value;
          const assetLabel = row.assetLabel?.value;
          const assetHours = row.hours?.value;
          if (assetUri && assetLabel && !activityMap[aUrl].assets.some(x => x.uri === assetUri)) {
            activityMap[aUrl].assets.push({ uri: assetUri, label: assetLabel, hours: assetHours });
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

          // (Optional) Area nur einmal je Aktivität nachladen
          if (activityMap[aUrl].area == null) {
            const getTargetValue = (res) => {
              if (!res) return null;
              if (Array.isArray(res)) {
                const hit = res.find(r => r?.target?.value != null);
                return hit ? hit.target.value : null;
              }
              return res?.target?.value ?? null;
            };
            activityMap[aUrl].area = getTargetValue(await retrieveProperty(
              { url: aUrl, label: aLabel, date: aDate, model: aModel, assets: [] },
              "PSet_GrIT_Bauwerk", "Projektbezeichnung", "GrIT_ReferenzbrückeDeutschland",
              "PSet_GrIT_Bauwerk", "Flaecheninanspruchnahme"
            ));
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
    console.log(measure);
  }, [containerId, projectId, selectedModels, indexer, setMeasure]);

  const activities = Array.isArray(measure?.activity) ? measure.activity : [];

  const activityByGuid = useMemo(() => {
    const map = {};
    activities.forEach((act, idx) => {
      const guid = act.url || act.uri || `activity-${idx}`;
      map[guid] = act;
    });
    return map;
  }, [activities]);

  // -------------------------
  // Render
  // -------------------------
  // Hilfsfunktionen zur Zugang über aktive Tab-ID
  const activeTabObj = tabs.find(t => t.id === activeTab);
  const activeKey = activeTabObj?.guid || "measure";

  return (
    <div>
      {/* Tab Navigation */}
      <div className="tabs mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={activeTab === tab.id ? "tab active d-inline" : "tab d-inline"}
            onClick={() => handleTabChange(tab.id)}
          >
            {tab.name}
          </button>
        ))}
        <button className="tab d-inline" onClick={() => setShowAddTabPopup(true)}>
          <span className="d-inline"><FaPlusSquare /></span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="contentColumn" style={{ height: "90%" }}>
        {/* Measure-Panel */}
        <div
          role="tabpanel" className="h-100"
          aria-hidden={activeTab !== 1}
          style={{ display: activeTab === 1 ? "block" : "none" }}
        >
          <Measure
            data={tabDataByKey["measure"] || {}}
            onChange={(data) => handleTabDataChange("measure", data)}
          />
        </div>

        <div
          role="tabpanel" className="h-100"
          aria-hidden={activeTab !== 999}
          style={{ display: activeTab === 999 ? "block" : "none" }}
        >
          <Results
            data={tabDataByKey["measure"] || {}}
            onChange={(data) => handleTabDataChange("measure", data)}
          />
        </div>

        {/* Activity-Panels: jede Aktivität = eigene Instanz, dauerhaft gemountet */}
        {tabs.filter(t => t.id > 1 && t.id < 999).map((t) => {
          const key = t.guid; // stabiler Schlüssel
          const selectedAssets = selectedAssetByKey[key] || [];
          const totals = totalsByKey[key] || initialTotals;

          return (
            <div
              key={`panel-${key}`}
              role="tabpanel" 
              aria-hidden={activeTab !== t.id}
              style={{ display: activeTab === t.id ? "block" : "none" }}
            >
              <ActivityTab
                key={`ActivityTab-${key}`}
                data={tabDataByKey[key] || {}}
                activity={activityByGuid[key]}
                onChange={(data) => handleTabDataChange(key, data)}
                assetList={assetList}
                selectedAsset={selectedAssets}
                setSelectedAsset={(updater) => setSelectedAssetFor(key, updater)}
                totals={totals}
                openExistingAssets={() => openExistingAssets(key)}
                openCustomAsset={() => openCustomAsset(key)}
                openHours={() => openHours(key)}
              />
            </div>
          );
        })}
      </div>

      {/* Popups */}
      {showAddTabPopup && (
        <PopupAddTab
          onClose={() => setShowAddTabPopup(false)}
          onCreate={createNewTab}
        />
      )}

      {popup.type === "existing" && popup.activityKey && (
        <PopupExistingAssets
          assetList={assetList}
          onClose={() => setPopup({ type: null, activityKey: null })}
          onAddAsset={(asset) => {
            setSelectedAssetFor(popup.activityKey, prev => [...prev, asset]);
            setPopup({ type: null, activityKey: null });
          }}
        />
      )}

      {popup.type === "custom" && popup.activityKey && (
        <PopupCustomAsset
          onClose={() => setPopup({ type: null, activityKey: null })}
          onSave={(newAsset) => {
            setAssetList((prev) => [...prev, newAsset]);
            localStorage.setItem("assetList", JSON.stringify([...(assetList || []), newAsset]));
          }}
        />
      )}

      {popup.type === "hours" && popup.activityKey && (
        <PopupHours
          selectedAsset={selectedAssetByKey[popup.activityKey] || []}
          setSelectedAsset={(updater) => setSelectedAssetFor(popup.activityKey, updater)}
          onClose={() => setPopup({ type: null, activityKey: null })}
        />
      )}
    </div>
  );
};

export default DefinitionPage1;
