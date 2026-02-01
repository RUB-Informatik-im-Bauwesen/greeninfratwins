//import materialPreisData from './MaterialPreisData.json';
import materialPreisDataE from './MaterialPreisData_Einbau.json';
import materialPreisDataA from './MaterialPreisData_Abbruch.json';
import { ToastContainer, toast } from "react-toastify";
//import verkehrsdatenCombined from './Verkehrsdaten_combined.json';
import materialQuantityReinforcementTotal from './MaterialQuantityReinforcment_total.json';

/*  puts the uuid into the element, so "referenceToFlowDataSetOrTitle" is no longer needed as an input. 
2025-08-06*/
export async function getEPDForElement(element) {
  // ------------------------------------------------------------
  // (NEU) Optionale manuelle Datensätze – nur bei exaktem Schlüssel
  // ------------------------------------------------------------
  const MANUAL_EPD = {
    "UHFB_Umwelt": {
      URI: "",
      Name: "Hochperformanter Faserbeton",
      GWP:  { A: 800,  C: 0 },
      PENRT:{ A: 4100, C: 0 },
      PERT: { A: 1000, C: 0 }
    }
    // Weitere manuelle Sätze können hier ergänzt werden:
    // "ANDERER_SCHLUESSEL": { URI:"", Name:"...", GWP:{A:..,C:..}, PENRT:{...}, PERT:{...} }
  };

  // Extract UUID from element.epdURL
  /*const url = element.epdURL ||
      "https://oekobaudat.de/OEKOBAU.DAT/datasetdetail/process.xhtml?uuid=b29d88ed-8621-4ece-9e2f-78af05cb3f0f&version=20.24.070&stock=OBD_2024_I&lang=en";
  const params = new URL(url).searchParams;
  const uuid = params.get("uuid");*/

  const url = element.epdURL;
  console.log("Check url:", url);

  // (NEU) Falls ein manueller Datensatz-Schlüssel übergeben wurde: Kennwerte setzen und frühzeitig beenden
  if (url && MANUAL_EPD[url]) {
    const m = MANUAL_EPD[url];
    // Einheit bleibt absichtlich null, um bestehendes Verhalten nicht zu verändern
    element.gwpTotal = [
      { module: "A1-A3", scenario: null, value: m.GWP.A,  unit: null },
      { module: "A5", scenario: null, value: 0,  unit: null },
      { module: "C1", scenario: null, value: m.GWP.C,  unit: null }
    ];
    element.pert = [
      { module: "A1-A3", scenario: null, value: m.PERT.A, unit: null },
      { module: "A5", scenario: null, value: 0,  unit: null },
      { module: "C1", scenario: null, value: m.PERT.C, unit: null }
    ];
    element.penrt = [
      { module: "A1-A3", scenario: null, value: m.PENRT.A, unit: null },
      { module: "A5", scenario: null, value: 0,  unit: null },
      { module: "C1", scenario: null, value: m.PENRT.C, unit: null }
    ];

    // Logging konsistent zum bestehenden Schema
    if (!element?.gwpTotal) {
      console.error("❌ element.gwpTotal is null or undefined!");
    } else {
      console.log("element.gwpTotal:", element.gwpTotal);
    }
    if (!element?.pert) {
      console.error("❌ element.pert is null or undefined!");
    } else {
      console.log("element.pert:", element.pert);
    }
    if (!element?.penrt) {
      console.error("❌ element.penrt is null or undefined!");
    } else {
      console.log("element.penrt:", element.penrt);
    }

    return; // Wichtig: nichts anderes verändern
  }

  if (url !== null && url !== "Null URL") {

    // Extract the UUID using regex (unverändert)
    // Improved UUID extraction: matches both "uuid=..." and "uuid..." (no '='), 2025-10-02
    const match = url.match(/uuid=?([0-9a-fA-F\-]{36})/);

    // Check and assign
    const uuid = match ? match[1] : null;
    console.log("Extracted UUID:", uuid);

    //Error message: from origin 'http://localhost:3000' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
    const response = await fetch(`https://icdd.vm.rub.de/gritcalc/api/epd/${uuid}`);
    console.log("Link for data:", response);

    const data = await response.json();
    console.log("EPD Data:", data);

    // Helper to find LCIAResult by indicator name
    function findLciaResult(...indicators) {
      return data?.LCIAResults?.LCIAResult?.find(res =>
        res.referenceToLCIAMethodDataSet?.shortDescription?.some(desc =>
          desc.lang === "en" &&
          indicators.some(ind => desc.value.toLowerCase().includes(ind.toLowerCase()))
        )
      );
    }

    // Helper to extract all A and C modules
    function extractAandCModules(anies) {
      return anies
        .filter(entry =>
          typeof entry.module === "string" &&
          (entry.module.startsWith("A") || entry.module.startsWith("C"))
        )
        .map(entry => ({
          module: entry.module,
          scenario: entry.scenario || null,
          value: entry.value,
          unit: anies.find(a => a.name === "referenceToUnitGroupDataSet")?.value?.shortDescription?.[0]?.value || null
        }));
    }

    // Helper to find exchange by flow name (for PERT, PENRT)
    function findExchangeByFlowName(...names) {
      return data?.exchanges?.exchange?.find(ex =>
        ex.referenceToFlowDataSet?.shortDescription?.some(desc =>
          desc.lang === "en" &&
          names.some(name => desc.value.toLowerCase().includes(name.toLowerCase()))
        )
      );
    }

    // --- GWP-total ---
    const gwpLcia = findLciaResult("gwp-total", "climate change");
    if (gwpLcia) {
      const anies = gwpLcia.other.anies;
      element.gwpTotal = extractAandCModules(anies);
    } else {
      element.gwpTotal = null;
    }

    // --- PERT ---
    const pertExchange = findExchangeByFlowName("total use of renewable primary energy resources", "pert");
    if (pertExchange) {
      const anies = pertExchange.other.anies;
      element.pert = extractAandCModules(anies);
    } else {
      element.pert = null;
    }

    // --- PENRT ---
    const penrtExchange = findExchangeByFlowName("total use of non renewable primary energy resources", "penrt");
    if (penrtExchange) {
      const anies = penrtExchange.other.anies;
      element.penrt = extractAandCModules(anies);
    } else {
      element.penrt = null;
    }

    // GWP Total
    if (!element?.gwpTotal) {
      console.error("❌ element.gwpTotal is null or undefined!");
    } else {
      console.log("element.gwpTotal:", element.gwpTotal);
    }

    // PERT
    if (!element?.pert) {
      console.error("❌ element.pert is null or undefined!");
    } else {
      console.log("element.pert:", element.pert);
    }

    // PENRT
    if (!element?.penrt) {
      console.error("❌ element.penrt is null or undefined!");
    } else {
      console.log("element.penrt:", element.penrt);
    }
  } else{
    console.error("❌ element not found!");
  }
}



/**
 new added, comments to be improved, 2025-08-06
getEPDRelatedQuantity_URL_UUID
*/
export async function getEPDRelatedQuantity_URL_UUID(containerId, projectId, token, variant_url, elementGuidList) {
  if (elementGuidList == null) {
    console.error("Guids not initialized for variant: ", variant_url)
    toast.error("IFC Elemente für Variante nicht initialisiert:" + variant_url, {autoClose: 10000});
    return [{
      elementGuid: "Die Variante ist nicht initialisiert worden. ",
      elementType: "Bitte wechseln Sie zum Tab der Variante und warten bis alle zugehörigen Elemente initialisiert wurden.",
      valueQuantity: 0,
      epdURL: "Null URL", //  added, 2025-08-06, Please don't change it, because it us needed for checking the correctness of URL
      materialString: "Null Material"
    }]
  };
  const query = `
PREFIX grit: <https://greeninfratwins.com/ns/grit#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
SELECT DISTINCT ?elementGuid (COALESCE(?type, ?name) AS ?elementType) ?materialString ?valueQuantity ?valueUrl
WHERE {
?entity <https://w3id.org/props#globalIdIfcRoot> ?elementGuid.

OPTIONAL {?entity <https://w3id.org/props#baumaterialText>  ?materialString .}
OPTIONAL { ?entity <https://w3id.org/props#objectTypeIfcObject> ?type. }
OPTIONAL { ?entity <https://w3id.org/props#name> ?name. }

?entity <https://w3id.org/props#ePDbezogeneMenge> ?valueQuantity .
{?entity <https://w3id.org/props#ePDVerbindung> ?valueUrl .}
UNION
{?entity <https://w3id.org/props#ePDDatenblatt> ?valueUrl .}

VALUES ?elementGuid {
${elementGuidList.map(guid => `"${guid}"`).join("\n")}
  }
}
  `;
  console.log("Query: ", query);
  const url = `https://icdd.vm.rub.de/dev01/api/v1/projects/${projectId}/containerTypes/0/containers/${containerId}/query?query=${encodeURIComponent(query)}`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const resultsJson = await response.json();

  console.log("Print result for getEPDRelatedQuantityAndURL: ", resultsJson);
  const data = resultsJson.results?.bindings?.map(binding => ({
    elementGuid: binding.elementGuid?.value ?? "SPARQL Abfrage gescheitert",
    elementType: binding.elementType?.value ?? "SPARQL Abfrage gescheitert",
    valueQuantity: binding.valueQuantity?.value ?? 0,
    epdURL: binding.valueUrl?.value ?? "SPARQL Abfrage gescheitert",
    materialString: binding.materialString?.value ?? "SPARQL Abfrage gescheitert"
  })) || [];

  return data;
}

/**
 new added, comments to be improved, 2025-10-02
To manually add Bewehrungstahl from MaterialQuantityReinforcment_total.json
getEPDRelatedQuantity_Bewehrungstahl
*/
export async function getEPDRelatedQuantity_Bewehrungstahl(variantIndex, activityType, resultData) {
  // Get variant key (e.g. "Variante 1", "Variante 2")
  const variantKey = `Variante ${variantIndex + 1}`;
  const variantData = materialQuantityReinforcementTotal[variantKey] || [];

  // Filter by activityType if provided
  const filteredData = activityType
    ? variantData.filter(item => item.ActivityType === activityType)
    : variantData;

  // Map to the expected structure
  const extraData = filteredData.map(item => ({
    elementGuid: "-", // No GUID available in this dataset
    elementType: item.ObjectType ?? "Unbekannt",
    valueQuantity: item["EPD-bezogene Menge"] ?? 0,
    epdURL: item["EPD Verbindung"] ?? "Null URL",
    materialString: item.MaterialName ?? "Unbekannt"
  }));

  console.log("Print extraData for Bewehrungstahl: ", extraData);

  // Combine with resultData
  const combinedData = [...resultData, ...extraData];

  return combinedData;
}

/**
 * Sums values from element.gwpTotal, optionally filtered by modules.
 * @param {Object} element
 * @param {string[]|null} modules - Array of module names to include (e.g. ["A1-A3"]). If null, sum all A and C.
 * @returns {number}
 */
export function getGWPtotal_Lifecycle(element, modules = null) {
  if (!element.gwpTotal || !Array.isArray(element.gwpTotal)) return 0;
  return element.gwpTotal.reduce((sum, entry) => {
    if (modules && !modules.includes(entry.module)) return sum;
    const val = parseFloat(entry.value);
    return sum + (isNaN(val) ? 0 : val);
  }, 0);
}

/**
 * Sums values from element.pert, optionally filtered by modules.
 * @param {Object} element
 * @param {string[]|null} modules - Array of module names to include. If null, sum all A and C.
 * @returns {number}
 */
export function getPERTtotal_Lifecycle(element, modules = null) {
  if (!element.pert || !Array.isArray(element.pert)) return 0;
  return element.pert.reduce((sum, entry) => {
    if (modules && !modules.includes(entry.module)) return sum;
    const val = parseFloat(entry.value);
    return sum + (isNaN(val) ? 0 : val);
  }, 0);
}

/**
 * Sums values from element.penrt, optionally filtered by modules.
 * @param {Object} element
 * @param {string[]|null} modules - Array of module names to include. If null, sum all A and C.
 * @returns {number}
 */
export function getPENRTtotal_Lifecycle(element, modules = null) {
  if (!element.penrt || !Array.isArray(element.penrt)) return 0;
  return element.penrt.reduce((sum, entry) => {
    if (modules && !modules.includes(entry.module)) return sum;
    const val = parseFloat(entry.value);
    return sum + (isNaN(val) ? 0 : val);
  }, 0);
}

/**
 new added, comments to be improved, 2025-08-14
For Prozessbezogene
getProcessCosts
return per activityName with variableValue
*/
export async function getProcessCosts(containerId, projectId, token, variant_url) {
  const query = `
PREFIX grit: <https://greeninfratwins.com/ns/grit#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
SELECT ?activityName ?variableValue
WHERE {
<${variant_url}>  grit:involvesActivities ?activity.
  ?activity rdfs:label ?activityName.
  ?activity grit:hasIndicatorSet/grit:hasIndicator ?indicator.
?indicator	grit:hasIndicatorType <https://greeninfratwins.com/ns/grit#IndicatorType_2_1_1_2>.
?indicator grit:hasIndicatorResult ?variableValue. }
  `;
  console.log("Query Prozessbezogene: ", query);
  const url = `https://icdd.vm.rub.de/dev01/api/v1/projects/${projectId}/containerTypes/0/containers/${containerId}/query?query=${encodeURIComponent(query)}`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const resultsJson = await response.json();

  console.log("Print result for getProcessCosts: ", resultsJson);
  const data = resultsJson.results?.bindings?.map(binding => ({
    activityName: binding.activityName?.value ?? "SPARQL Abfrage gescheitert",
    variableValue: binding.variableValue?.value ?? 0
  })) || [];
  return data;
}

/**
 new added, comments to be improved, 2025-08-14
getActivityDuration_forVariant
return per activityName with variableValue
*/
export async function getActivityDuration_forVariant(containerId, projectId, token, variant_url) {
  const query = `
PREFIX grit: <https://greeninfratwins.com/ns/grit#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
SELECT ?activityLabel ?variableValue
WHERE {
  <${variant_url}> grit:involvesActivities ?activity.
  ?activity grit:hasIndicatorSet/grit:hasIndicator ?indicator.
  ?activity rdfs:label ?activityLabel.
  ?indicator grit:hasIndicatorType <https://greeninfratwins.com/ns/grit#IndicatorType_3_1_3>.
  ?indicator grit:hasVariable [ grit:hasKey "time" ; grit:hasValue ?variableValue ] .
}
  `;

  const url = `https://icdd.vm.rub.de/dev01/api/v1/projects/${projectId}/containerTypes/0/containers/${containerId}/query`;
  console.log("Query getActivityDuration_forVariant: ", query);
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "Accept": "application/sparql-results+json"
    },
    body: JSON.stringify( query ) // <— query as JSON string
  });

  if (!resp.ok) {
    throw new Error(`HTTP error! Status: ${resp.status}`);
  }

  const resultsJson = await resp.json();
  const data = resultsJson.results?.bindings?.map(b => ({
    activityName: b.activityLabel?.value ?? "SPARQL Abfrage gescheitert",
    variableValue: b.variableValue?.value ?? 0,
  })) || [];

  return data;
}


/**
 new added, comments to be improved, 2025-08-14
getDTV_forVariant
return per activityName with variableValue
*/
export async function getDTV_forVariant(containerId, projectId, token, variant_url) {
  const query = `
PREFIX grit: <https://greeninfratwins.com/ns/grit#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
SELECT ?activityLabel ?variableValue
WHERE {
<${variant_url}> grit:involvesActivities ?activity. 
?activity grit:hasIndicatorSet/grit:hasIndicator ?indicator.
?activity rdfs:label ?activityLabel.
?indicator	grit:hasIndicatorType <https://greeninfratwins.com/ns/grit#IndicatorType_3_2_1>.
?indicator grit:hasVariable [ grit:hasKey "DTV" ; grit:hasValue ?variableValue;  ]. }
  `;
  console.log("Query getDTV_forVariant: ", query);
  const url = `https://icdd.vm.rub.de/dev01/api/v1/projects/${projectId}/containerTypes/0/containers/${containerId}/query?query=${encodeURIComponent(query)}`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const resultsJson = await response.json();

  console.log("Print result for getDTV_forVariant: ", resultsJson);
  const data = resultsJson.results?.bindings?.map(binding => ({
    activityName: binding.activityLabel?.value ?? "SPARQL Abfrage gescheitert",
    variableValue: binding.variableValue?.value ?? 0
  })) || [];
  return data;
}

/**
 new added, comments to be improved, 2025-08-14
getWorkingzoneLength_forVariant
return per activityName with variableValue
*/
export async function getWorkingzoneLength_forVariant(containerId, projectId, token, variant_url) {
  const query = `
PREFIX grit: <https://greeninfratwins.com/ns/grit#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
SELECT ?activityLabel ?variableValue
WHERE {
<${variant_url}>  grit:involvesActivities ?activity. 
?activity grit:hasIndicatorSet/grit:hasIndicator ?indicator.
?activity rdfs:label ?activityLabel.
?indicator	grit:hasIndicatorType <https://greeninfratwins.com/ns/grit#IndicatorType_3_2_1>.
?indicator grit:hasVariable [ grit:hasKey "length" ; grit:hasValue ?variableValue;  ]. }

  `;
  console.log("Query getWorkingzoneLength_forVariant: ", query);
  const url = `https://icdd.vm.rub.de/dev01/api/v1/projects/${projectId}/containerTypes/0/containers/${containerId}/query?query=${encodeURIComponent(query)}`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const resultsJson = await response.json();

  console.log("Print result for getWorkingzoneLength_forVariant: ", resultsJson);
  const data = resultsJson.results?.bindings?.map(binding => ({
    activityName: binding.activityLabel?.value ?? "SPARQL Abfrage gescheitert",
    variableValue: binding.variableValue?.value ?? 0
  })) || [];
  return data;
}

/**
 new added, comments to be improved, 2025-08-14
getBridgeSpeedlimit_forVariant
return per activityName with variableValue
*/
export async function getBridgeSpeedlimit_forVariant(containerId, projectId, token, variant_url) {
  const query = `
PREFIX grit: <https://greeninfratwins.com/ns/grit#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
SELECT ?activityLabel ?variableValue
WHERE {
<${variant_url}> grit:involvesActivities ?activity. 
?activity grit:hasIndicatorSet/grit:hasIndicator ?indicator.
?activity rdfs:label ?activityLabel.
?indicator	grit:hasIndicatorType <https://greeninfratwins.com/ns/grit#IndicatorType_3_2_1>.
?indicator grit:hasVariable [ grit:hasKey "Vzul" ; grit:hasValue ?variableValue;  ]. }
  `;
  console.log("Query getBridgeSpeedlimit_forVariant: ", query);
  const url = `https://icdd.vm.rub.de/dev01/api/v1/projects/${projectId}/containerTypes/0/containers/${containerId}/query?query=${encodeURIComponent(query)}`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const resultsJson = await response.json();

  console.log("Print result for getBridgeSpeedlimit_forVariant: ", resultsJson);
  const data = resultsJson.results?.bindings?.map(binding => ({
    activityName: binding.activityLabel?.value ?? "SPARQL Abfrage gescheitert",
    variableValue: binding.variableValue?.value ?? 0
  })) || [];
  return data;
}

/**
 new added,  2025-08-14
It is a helper function to get value for a specific activity
 * from an array of objects containing activityName and variableValue.
 * If the activity is not found, returns a default value.
 *
 * @param {Array} array - Array of objects with activityName and variableValue.
 * @param {string} activityName - The name of the activity to search for.
 * @param {string} [defaultValue="0"] - Default value to return if activity is not found.
 * @returns {string} - The variableValue for the specified activity or defaultValue if not found.
*/
export function getValueForActivity(array, activityName, defaultValue = "0") {
  if (!Array.isArray(array)) return defaultValue;
  const found = array.find(item => item.activityName === activityName);
  return (found && found.variableValue !== undefined) ? found.variableValue : defaultValue;
}

// new added,  2025-08-14
// Helper function to get AUmV and AUoV
//verkehrsdatenCombined is obtained from getVerkehrsdatenJson() function
export function getVerkehrsdatenValues(variantID, activityName, anzahlBauphase, geschwindigkeitZone, verkehrsdatenCombined) {
  const variantData = verkehrsdatenCombined[variantID];
  console.log("Print variantData: ", variantID, variantData);
  if (!variantData) return { AUmV: 0, AUoV: 0 };
  const found = variantData.find(item =>
    item.ActivityType === activityName &&
    String(item.AnzahlBauphase) === String(anzahlBauphase) &&
    String(item.zulGeschwindigkeitZone) === String(geschwindigkeitZone)
  );
  if (found) {
    return { AUmV: found.AUmV, AUoV: found.AUoV };
  }
  return { AUmV: 0, AUoV: 0 };
}

/**
 new added, comments to be improved, 2025-08-15
default file name is "Arbeitssicherheit_Wertetabelle.json"
return a JSON file
*/
export async function getVerkehrsdatenJson(containerId, projectId, token, verkehrsdatenFileName = "Arbeitssicherheit_Wertetabelle.json") {
  let resultsJson = {};
  const url = `https://icdd.vm.rub.de/dev01/api/v1/projects/${projectId}/containerTypes/0/containers/${containerId}/contents/`;//${encodeURIComponent(verkehrsdatenFileName)}
  try {
    const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
   resultsJson = await response.json();
  console.log("Print getVerkehrsdatenJson resultsJson: ", resultsJson);
  } catch (error) {
    console.error(error);
    return null;
  }
  

  // Find the file with the matching name
  const fileObj = resultsJson.find(file => file.Name === verkehrsdatenFileName);
  if (!fileObj) {
    throw new Error(`File ${verkehrsdatenFileName} not found in container contents`);
  }
  console.log("Found getVerkehrsdatenJson: ", fileObj);

  let fileJson = {};
  const fileUrl = url + fileObj.Id + "/attachment";
  // Fetch the actual JSON content of the file
  try {
    const response = await fetch(fileUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error('Failed to fetch file content');
    fileJson = await response.json();

    console.log("getVerkehrsdatenJson file.Name & file.content:", fileObj.Name, fileJson); // Debug log

  }
  catch (err) { console.error(`Error fetching ${fileObj.Name} file:`, err); }

  console.log("Print getVerkehrsdatenJson: ", fileJson);
  return fileJson;
}

/**
 new added, comments to be improved, 2025-08-15
getMaterialPreis 
Compare with "MaterialPreisData.json"
return a JSON file
*/
export function getMaterialPreisE(materialString) {
  const found = materialPreisDataE.find(item => item.Name === materialString);
  if (found) {
    return {
      Einheitspreis: found.Einheitspreis,
      Einheit: found.Einheit
    };
  }
  return {
    Einheitspreis: null,
    Einheit: null
  };
}

export function getMaterialPreisA(materialString) {
  const found = materialPreisDataA.find(item => item.Name === materialString);
  if (found) {
    return {
      Einheitspreis: found.Einheitspreis,
      Einheit: found.Einheit
    };
  }
  return {
    Einheitspreis: null,
    Einheit: null
  };
}