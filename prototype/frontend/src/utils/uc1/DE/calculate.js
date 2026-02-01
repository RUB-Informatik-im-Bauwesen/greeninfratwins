import { getExternalCostsForActivity, getInputDataforAssetsGWP, getProcessCostsForActivity ,getEmissionsForActivity, getNoiseForActivity, getEPDForAssetsMap } from "./data";
//import { calcEP, calcGWP,  calcODP, calcAP, calcPOCP, calcKEA} from "./indicators";
/**
 * Baut eine Übersichtstabelle mit Kostenindikatoren für mehrere Varianten.
 *
 * Für jede Variante werden die Materialkosten sowie prozessbezogene Kosten (Gesamtkosten,
 * Betriebskosten und Austauschkosten) ermittelt und tabellarisch dargestellt.
 *
 * Aufbau der Rückgabe:
 * - Materialkosten werden in einem einfachen 2-zeiligen Array dargestellt:
 *   Spalten: "Activity", gefolgt von den Varianten
 *   Zeilen: Aktivität ("Einbau") und zugehörige Materialkostenwerte
 *
 * - Prozessbezogene Kosten werden detaillierter ausgegeben mit mehreren Zeilen:
 *   Spalten: "Activity", "Cost Type", gefolgt von den Varianten
 *   Zeilen: Aktivität ("Einbau") und jeweils die Kostenarten
 *     - Gesamtkosten (Summe aus Betriebskosten und Austauschkosten)
 *     - Betriebskosten
 *     - Austauschkosten
 *
 * Parameter:
 * @param {string[]} variants - Array von URLs der Varianten, für die die Kosten abgefragt werden sollen
 * @param {string} containerId - ID des Containers im Projektkontext
 * @param {string} projectId - Projekt-ID für API-Anfragen
 * @param {string} token - Authentifizierungstoken für API-Zugriffe
 *
 * Rückgabe:
 * @returns {Promise<Object[]>} Array von Objekten mit folgenden Eigenschaften:
 *   - title: Titel der Kostenkategorie (z.B. "Materialkosten [EUR]")
 *   - data: Zweidimensionales Array mit den tabellarischen Kostenwerten
 *
 * Beispielhafte Ausgabe:
 * {
  "version": "1.1",
  "table": {
    "id": "sustainability-assessment",
    "title": "Bewertung von Bauprozess-Assets – Grünschnitt",
    "missing_value": "–",
    "weighting": { "formula": "duration_h * count", "fields": ["duration_h", "count"] },
    "columns": [
      { "key": "name", "label": "Asset", "type": "string", "frozen": true },
      { "key": "duration_h", "label": "Einsatzdauer", "unit": "h", "type": "number" },
      { "key": "count", "label": "Anzahl", "type": "integer" },

      {
        "group": "Ökologische Qualität",
        "children": [
          { "code": "1.5.1", "key": "GWP",  "label": "GWP",  "unit": "kg CO2e",  "agg": "sum_weighted", "scope": "both",  "total_source": "computed",
            "uris": ["...GWP_1_Chainsaw_2", "...GWP_1_Generator_2", "...GWP_1_Chipper_2", "...GWP_1_Truck2"] },
          { "code": "1.5.2", "key": "EP",   "label": "EP",   "unit": "kg PO4e",  "agg": "sum_weighted", "scope": "both",  "total_source": "computed",
            "uris": ["...Indicator_Gruenschnitt_EP_2"] },
          { "code": "1.5.3", "key": "ODP",  "label": "ODP",  "unit": "kg CFC11e","agg": "sum_weighted", "scope": "both",  "total_source": "computed",
            "uris": ["...Indicator_Gruenschnitt_ODP_2"] },
          { "code": "1.5.4", "key": "AP",   "label": "AP",   "unit": "kg SO2e",  "agg": "sum_weighted", "scope": "both",  "total_source": "computed",
            "uris": ["...Indicator_Gruenschnitt_AP_2"] },
          { "code": "1.5.5", "key": "POCP", "label": "POCP", "unit": "kg Ethene","agg": "sum_weighted", "scope": "both",  "total_source": "computed",
            "uris": ["...Indicator_Gruenschnitt_POCP_2"] },
          { "code": "1.5.6", "key": "KEA",  "label": "KEA",  "unit": "MJ",       "agg": "sum_weighted", "scope": "both",  "total_source": "computed",
            "uris": ["...Indicator_Gruenschnitt_KEA_2"] }
        ]
      },
      {
        "group": "Ökonomische Qualität",
        "children": [
          { "code": "2.1.1.2", "key": "PROC_COST", "label": "Prozessbezogene Kosten", "unit": "€", "agg": "sum", "scope": "total", "total_source": "input",
            "uris": ["...Indicator_Gruenschnitt_ProcessCosts_2"] },
          { "code": "2.2.1",   "key": "EXT_COST",  "label": "Indirekte Kosten",       "unit": "€", "agg": "sum", "scope": "total", "total_source": "input",
            "uris": ["...Indicator_Gruenschnitt_ExternalCosts_2"] }
        ]
      },
      {
        "group": "Schutzgut Mensch",
        "children": [
          { "code": "3.1.1", "key": "NOISE", "label": "Lärmbeeinträchtigung", "unit": "dB/pax", "agg": "avg_weighted", "scope": "total", "total_source": "input",
            "uris": ["...Indicator_Gruenschnitt_Noise_2"] },
          { "code": "3.1.2", "key": "HEALTH","label": "Emissionsbelastung",   "unit": "ppm",    "agg": "avg_weighted", "scope": "total", "total_source": "input",
            "uris": ["...Indicator_Gruenschnitt_Health_2"] }
        ]
      }
    ]
  },

  "context": {
    "measure": {
      "name": "Grünschnitt",
      "description": "Durchführung von Grünschnittarbeiten an den Widerlagern",
      "uri": "http://greeninfratwins.com/ns/awf1-de#Measure_Gruenschnitt"
    },
    "activity": {
      "uri": "http://greeninfratwins.com/ns/awf1-de#Activity_2",
      "label": "Freischneiden der Widerlager",
      "date": "2025-06-03T12:00:00.000",
      "model": "GIT_Demonstrator_D.ifc"
    }
  },

  "data": {
    "assets": [
      {
        "id": "a_chipper_1",
        "uri": "http://greeninfratwins.com/ns/awf1-de#Asset_Chipper_1",
        "name": "Häcksler",
        "duration_h": 3,
        "count": 1,
        "metrics": { "GWP": null, "EP": null, "ODP": null, "AP": null, "POCP": null, "KEA": null }
      },
      {
        "id": "a_chainsaw_1",
        "uri": "http://greeninfratwins.com/ns/awf1-de#Asset_Chainsaw_1",
        "name": "Kettensäge",
        "duration_h": 4,
        "count": 1,
        "metrics": { "GWP": null, "EP": null, "ODP": null, "AP": null, "POCP": null, "KEA": null }
      },
      {
        "id": "a_truck_1",
        "uri": "http://greeninfratwins.com/ns/awf1-de#Asset_Truck_1",
        "name": "LKW",
        "duration_h": 10,
        "count": 1,
        "metrics": { "GWP": null, "EP": null, "ODP": null, "AP": null, "POCP": null, "KEA": null }
      },
      {
        "id": "a_generator_1",
        "uri": "http://greeninfratwins.com/ns/awf1-de#Asset_Generator_1",
        "name": "Generator",
        "duration_h": 6,
        "count": 1,
        "metrics": { "GWP": null, "EP": null, "ODP": null, "AP": null, "POCP": null, "KEA": null }
      }
    ],

    "totals": {
      "visible": true,
      "label": "Gesamt",
      "aggregation": "per-schema",
      "metrics": {
        "GWP": null,
        "EP": null,
        "ODP": null,
        "AP": null,
        "POCP": null,
        "KEA": null,
        "PROC_COST": null,
        "EXT_COST": null,
        "NOISE": null,
        "HEALTH": null
      }
    }
  }
}

 */


/**
 * Generiert für jede Activity eines Measure-Objekts eine Table-JSON-Struktur.
 * - Dynamische Assets (Name, Einsatzdauer[h], Anzahl=1).
 * - Öko-Indikatoren (scope "both", total = computed).
 * - Ökonomie & Schutzgut Mensch (scope "total", total = input-only).
 * - URIs der Indikatoren werden zur Nachverfolgbarkeit hinterlegt.
 *
 * @param {object} measureJson  Eingangsobjekt (wie von Ihnen bereitgestellt)
 * @returns {Array<object>}     Liste pro Activity mit Table-JSON
 */
export function generateTablesFromMeasure(measureJson) {
  const VERSION = "1.1";
  const MISSING = "–";

  // feste Spalten-/Key-Definition in Zielstruktur (stabile Reihenfolge)
  const ECO_KEYS = [
    { code: "1.5.1", key: "GWP",  label: "GWP",  unit: "kg CO2e"   },
    { code: "1.5.2", key: "EP",   label: "EP",   unit: "kg PO4e"   },
    { code: "1.5.3", key: "ODP",  label: "ODP",  unit: "kg CFC11e" },
    { code: "1.5.4", key: "AP",   label: "AP",   unit: "kg SO2e"   },
    { code: "1.5.5", key: "POCP", label: "POCP", unit: "kg Ethene" },
    { code: "1.5.6", key: "KEA",  label: "KEA",  unit: "MJ"        }
  ];
  const ECON_TOTAL_KEYS = [
    { code: "2.1.1.2", key: "PROC_COST", label: "Prozessbezogene Kosten", unit: "€" },
    { code: "2.2.1",   key: "EXT_COST",  label: "Indirekte Kosten",       unit: "€" }
  ];
  const SOCIAL_TOTAL_KEYS = [
    { code: "3.1.1", key: "NOISE",  label: "Lärmbeeinträchtigung", unit: "dB/pax" },
    { code: "3.1.2", key: "HEALTH", label: "Emissionsbelastung",   unit: "ppm"    }
  ];

  // Hilfsfunktion: URIs aus IndicatorSets nach Code extrahieren
  function collectUrisByCode(activity) {
    const map = {}; // { "1.5.1": [uri, ...], "2.1.1.2": [uri, ...], ... }
    (activity.indicatorsets || []).forEach(set => {
      (set.indicators || []).forEach(ind => {
        // Code ist am Label-Anfang (z. B. "1.5.1 Globales …")
        const m = String(ind.label || "").match(/^(\d+(?:\.\d+)+)/);
        if (m) {
          const code = m[1];
          if (!map[code]) map[code] = [];
          map[code].push(ind.uri);
        }
      });
    });
    return map;
  }

  // Spaltendefinition bauen (inkl. URIs & scope/agg)
  function buildColumns(uriMap) {
    const cols = [
      { key: "name",        label: "Asset",         type: "string",  frozen: true },
      { key: "duration_h",  label: "Einsatzdauer",  unit: "h",       type: "number" },
      { key: "count",       label: "Anzahl",        type: "integer" }
    ];

    cols.push({
      group: "Ökologische Qualität",
      children: ECO_KEYS.map(k => ({
        code: k.code, key: k.key, label: k.label, unit: k.unit,
        agg: "sum_weighted", scope: "both", total_source: "computed",
        uris: uriMap[k.code] || []
      }))
    });

    cols.push({
      group: "Ökonomische Qualität",
      children: ECON_TOTAL_KEYS.map(k => ({
        code: k.code, key: k.key, label: k.label, unit: k.unit,
        agg: "sum", scope: "total", total_source: "input",
        uris: (uriMap[k.code] || [])
      }))
    });

    cols.push({
      group: "Schutzgut Mensch",
      children: SOCIAL_TOTAL_KEYS.map(k => ({
        code: k.code, key: k.key, label: k.label, unit: k.unit,
        agg: "avg_weighted", scope: "total", total_source: "input",
        uris: (uriMap[k.code] || [])
      }))
    });

    return cols;
  }

  // Assets der Activity -> Zielstruktur
  function buildAssets(activity) {
    const as = activity.assets || [];
    return as.map(a => ({
      id: a.uri ? a.uri.split("#").pop() : `asset_${Math.random().toString(36).slice(2, 8)}`,
      uri: a.uri || null,
      name: a.label || null,
      duration_h: toNumberOrNull(a.hours),
      count: 1,
      metrics: ECO_KEYS.reduce((acc, k) => { acc[k.key] = null; return acc; }, {})
    }));
  }

  function toNumberOrNull(x) {
    const n = Number(x);
    return Number.isFinite(n) ? n : null;
    }

  // Totals-Grundgerüst
  function buildTotals() {
    const metrics = {};
    ECO_KEYS.forEach(k => metrics[k.key] = null);
    ECON_TOTAL_KEYS.forEach(k => metrics[k.key] = null);
    SOCIAL_TOTAL_KEYS.forEach(k => metrics[k.key] = null);
    return {
      visible: true,
      label: "Gesamt",
      aggregation: "per-schema",
      metrics
    };
  }

  // Hauptschleife: pro Activity ein Table-JSON
  const tables = (measureJson.activity || []).map(activity => {
    const uriMap = collectUrisByCode(activity);

    return {
      version: VERSION,
      table: {
        id: `sustainability-assessment-${(activity.url || activity.label || "").split("#").pop() || "activity"}`,
        title: `Bewertung von Bauprozess-Assets – ${measureJson.name || "Maßnahme"}`,
        missing_value: MISSING,
        weighting: { formula: "duration_h * count", fields: ["duration_h", "count"] },
        columns: buildColumns(uriMap)
      },
      context: {
        measure: {
          name: measureJson.name || null,
          description: measureJson.description || null,
          uri: measureJson.url || null
        },
        activity: {
          uri: activity.url || null,
          label: activity.label || null,
          date: activity.date || null,
          model: activity.model || null
        }
      },
      data: {
        assets: buildAssets(activity),
        totals: buildTotals()
      }
    };
  });

  return tables;
}

/* ========================
   Beispielaufruf
   ========================
const tables = generateTablesFromMeasure(INPUT_MEASURE_JSON);
console.log(tables);
/*
  -> Array mit einem Eintrag pro Activity:
     tables[0].table.columns   // vollständige Spaltengruppierung
     tables[0].data.assets     // dynamische Asset-Zeilen
     tables[0].data.totals     // Total-only-Werte (noch null)
*/


export async function fillTable(measureJson, containerId, projectId, token) {
  const tables = generateTablesFromMeasure(measureJson);

  for (const table of tables) {
    const activityUrl = table.context.activity.uri;

    // --- 1) Assets vorbereiten (Default-Platzhalter) ---
    for (const asset of table.data.assets) {
      for (const col of table.table.columns) {
        if (!col.children) continue;
        for (const child of col.children) {
          const key = child.key;
          switch (key) {
            // Ökoindikatoren: Platzhalter pro Asset
            case "GWP":
            case "EP":
            case "ODP":
            case "AP":
            case "POCP":
            case "KEA":
              asset.metrics[key] = 0; // wird gleich durch EPD-Werte überschrieben
              break;

            // scope:total-Indikatoren → nicht pro Asset relevant
            case "PROC_COST":
            case "EXT_COST":
            case "NOISE":
            case "HEALTH":
              asset.metrics[key] = null;
              break;

            default:
              asset.metrics[key] = 0;
              break;
          }
        }
      }
    }

    // --- 2) EPD-Daten für ALLE Assets dieser Activity in EINER Query laden ---
    try {
      const assetUrls = (table.data.assets || []).map(a => a.uri).filter(Boolean);
      const epdMap = await getEPDForAssetsMap(containerId, projectId, token, assetUrls);
      // Asset-Metriken mit EPD-Werten befüllen
      for (const asset of table.data.assets) {
        const epd = epdMap.get(asset.uri);
        if (!epd) continue; // bleibt bei 0 (Platzhalter)
        asset.metrics.GWP  = Number(epd.GWP  ?? 0);
        asset.metrics.EP   = Number(epd.EP   ?? 0);
        asset.metrics.ODP  = Number(epd.ODP  ?? 0);
        asset.metrics.AP   = Number(epd.AP   ?? 0);
        asset.metrics.POCP = Number(epd.POCP ?? 0);
        asset.metrics.KEA  = Number(epd.KEA  ?? 0);
        // optional: asset.metrics.COST = Number(epd.COST ?? 0);
      }
    } catch (err) {
      console.error("EPD-Batch fehlgeschlagen:", err);
      // Fallback: Platzhalter (0) bleiben bestehen
    }

    // --- 3) Totals befüllen ---
    for (const col of table.table.columns) {
      if (!col.children) continue;

      for (const child of col.children) {
        const key = child.key;
        try {
          switch (key) {
            // ---- Total-only via SPARQL ----
            case "PROC_COST": {
              const vals = await getProcessCostsForActivity(containerId, projectId, token, activityUrl);
              table.data.totals.metrics[key] = vals.length > 0 ? Number(vals[0]) : 0;
              break;
            }
            case "EXT_COST": {
              const vals = await getExternalCostsForActivity(containerId, projectId, token, activityUrl);
              table.data.totals.metrics[key] = vals.length > 0 ? Number(vals[0]) : 0;
              break;
            }
            case "NOISE": {
              const vals = await getNoiseForActivity(containerId, projectId, token, activityUrl);
              table.data.totals.metrics[key] = vals.length > 0 ? Number(vals[0]) : 0;
              break;
            }
            case "HEALTH": {
              const vals = await getEmissionsForActivity(containerId, projectId, token, activityUrl);
              table.data.totals.metrics[key] = vals.length > 0 ? Number(vals[0]) : 0;
              break;
            }

            // ---- Ökoindikatoren: Aggregation je nach Schema ----
            case "GWP":
            case "EP":
            case "ODP":
            case "AP":
            case "POCP":
            case "KEA": {
              const assets = table.data.assets || [];
              const agg = child.agg || "sum_weighted"; // Fallback
              if (agg === "sum_weighted") {
                const total = assets.reduce((sum, a) => {
                  const w = (Number(a.duration_h) || 0) * (Number(a.count) || 1);
                  const v = Number(a.metrics?.[key]) || 0;
                  return sum + v * w;
                }, 0);
                table.data.totals.metrics[key] = total;
              } else if (agg === "avg_weighted") {
                let num = 0, den = 0;
                assets.forEach(a => {
                  const w = (Number(a.duration_h) || 0) * (Number(a.count) || 1);
                  const v = Number(a.metrics?.[key]) || 0;
                  num += v * w; den += w;
                });
                table.data.totals.metrics[key] = den > 0 ? num / den : 0;
              } else {
                // einfache Summe
                const total = assets.reduce((sum, a) => sum + (Number(a.metrics?.[key]) || 0), 0);
                table.data.totals.metrics[key] = total;
              }
              break;
            }

            default:
              table.data.totals.metrics[key] = 0;
              break;
          }
        } catch (err) {
          console.error(`Fehler bei Kennwert ${key}:`, err);
          table.data.totals.metrics[key] = 0;
        }
      }
    }
  }

  return tables;
}


