/* For AT-3; Modified based on AT-2, 2025-07-31 */

/**
 * Ruft die Materialkosten (manualVariable) für eine gegebene Variantenressource 
 * aus einem RDF-Container im ICDD-Projekt ab, basierend auf dem GRIT-Vokabular.
 *
 * Die SPARQL-Abfrage extrahiert den Wert der "Materialkosten", sofern diese als manuelle Variable
 * deklariert sind. Es wird gezielt nach einem Indikator mit dem Namen "Materialkosten" gesucht.
 *
 * Parameter:
 * @param {string} containerId - Die ID des Containers im ICDD-Projekt
 * @param {string} projectId - Die ID des ICDD-Projekts
 * @param {string} token - Zugriffstoken für die API-Authentifizierung
 * @param {string} variant_url - URI der Variantenressource, für die Materialkosten abgefragt werden sollen
 *
 * Rückgabewert:
 * @returns {Promise<string>} - Rückgabe des Materialkostenwerts als String
 *
 * Beispiel:
 * const kosten = await getMaterialCosts_forVariant("container123", "project456", "tokenXYZ", "https://.../variantA");
 */

export async function getMaterialCosts_forVariant(containerId, projectId, token, variant_url) {
  const query = `
PREFIX grit: <https://greeninfratwins.com/ns/grit#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
SELECT ?variableValue
WHERE {
<${variant_url}>  grit:involvesActivities/grit:hasIndicatorSet/grit:hasIndicator ?indicator.
?indicator	grit:hasIndicatorType <https://greeninfratwins.com/ns/grit#IndicatorType_2_1_1_1>.
?indicator grit:hasIndicatorResult ?variableValue . }
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

  console.log("Print result for getMaterialCosts_forVariant: ", resultsJson);
  const costs = [];
  resultsJson.results?.bindings?.forEach(binding => {
    costs.push(binding.variableValue.value);
  });
  return costs;
}


export async function getEPDRelatedQuantityAndEPDValue(containerId, projectId, token, variant_url, elementGuidList) {
  if(elementGuidList == null){
    console.error("Guids not initialized for variant: ", variant_url)
    return [{
    elementGuid:  "Die Variante ist nicht initialisiert worden. ",
    elementType:  "Bitte wechseln Sie zum Tab der Variante und warten bis alle zugehörigen Elemente initialisiert wurden.",
    valueGwp:  0,
    valueQuantity:  0
  }]
  };
  const query = `
PREFIX grit: <https://greeninfratwins.com/ns/grit#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
SELECT ?elementGuid ?elementType ?valueGwp ?valueQuantity
WHERE {
<${variant_url}>  grit:involvesActivities/grit:hasIndicatorSet/grit:hasIndicator ?indicator.
?indicator	grit:hasIndicatorType <https://greeninfratwins.com/ns/grit#IndicatorType_1_5_1>.
?indicator grit:hasVariable [ grit:hasKey "GWPtotal_A1_3"; grit:mapsToLbdProperty ?gwpProperty ] . 
?indicator grit:hasVariable [ grit:hasKey "EPDQuantity"; grit:mapsToLbdProperty ?quantityProperty ] .

?entity <https://w3id.org/props#globalIdIfcRoot> ?elementGuid.
?entity <https://w3id.org/props#objectTypeIfcObject> ?elementType.
?entity ?gwpProperty ?valueGwp .
?entity ?quantityProperty ?valueQuantity .

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

  console.log("Print result for getEPDRelatedQuantityAndEPDValue: ", resultsJson);
    const data = resultsJson.results?.bindings?.map(binding => ({
    elementGuid: binding.elementGuid?.value ?? "SPARQL Abfrage gescheitert",
    elementType: binding.elementType?.value ?? "SPARQL Abfrage gescheitert",
    valueGwp: binding.valueGwp?.value ?? 0,
    valueQuantity: binding.valueQuantity?.value ?? 0
  })) || [];
  return data;
}

/**
 * Ruft die Betriebskosten ("Betriebkosten") als manuell definierte Variable
 * einer Variantenressource aus einem ICDD-Container ab.
 *
 * Die Funktion führt eine SPARQL-Abfrage über die ICDD-API aus, um den Wert
 * eines Indikators der Kategorie "Prozessbezogene Kosten" zu extrahieren, 
 * bei dem die Variable als "manualVariable" deklariert ist und den Schlüssel "Betriebkosten" trägt.
 *
 * Voraussetzungen:
 * - Die Variante muss eine `grit:hasIndicatorSet`-Verknüpfung besitzen.
 * - Der relevante Indikator muss `"Prozessbezogene Kosten"` als Bezeichnung haben.
 * - Der Variablenname muss `"manualVariable"` und der Schlüssel `"Betriebkosten"` enthalten.
 *
 * Parameter:
 * @param {string} containerId – Die ID des RDF-Containers im ICDD-System
 * @param {string} projectId – Die ID des ICDD-Projekts
 * @param {string} token – Bearer-Token zur Authentifizierung an der ICDD-API
 * @param {string} variant_url – URI der Variantenressource, für die die Betriebskosten abgefragt werden
 *
 * Rückgabewert:
 * @returns {Promise<string|null>} – Wert der Betriebskosten als String oder `null`, falls kein Eintrag gefunden wurde
 *
 * Beispiel:
 * const opCosts = await getOperationalCosts_forVariant("cont001", "projABC", "abc123token", "https://.../variant1");
 */
export async function getOperationalCosts_forVariant(containerId, projectId, token, variant_url) {
  const query = `
PREFIX grit: <https://greeninfratwins.com/ns/grit#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
SELECT ?variableValue
WHERE {
<${variant_url}>  grit:involvesActivities/grit:hasIndicatorSet/grit:hasIndicator ?indicator.
?indicator	grit:hasIndicatorType <https://greeninfratwins.com/ns/grit#IndicatorType_2_1_1_2>.
?indicator grit:hasVariable [ grit:hasKey "B" ; grit:hasValue ?variableValue;  ]. }
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

  console.log("Print result for getOperationalCosts_forVariant: ", resultsJson);

  const costs = [];
  resultsJson.results?.bindings?.forEach(binding => {
    costs.push(binding.variableValue.value);
  });
  return costs;
}

/**
 * Ruft die Austauschkosten ("Austauschkosten") als manuell definierte Variable
 * einer Variantenressource aus einem ICDD-Container ab.
 *
 * Die Funktion führt eine SPARQL-Abfrage über die ICDD-API aus, um den Wert
 * eines Indikators der Kategorie "Prozessbezogene Kosten" zu extrahieren, 
 * bei dem die Variable als "manualVariable" deklariert ist und den Schlüssel "Austauschkosten" trägt.
 *
 * Voraussetzungen:
 * - Die Variante muss mit einem `grit:hasIndicatorSet` verknüpft sein.
 * - Der relevante Indikator muss `"Prozessbezogene Kosten"` als Bezeichnung tragen.
 * - Die gesuchte Variable muss `"manualVariable"` als Label und `"Austauschkosten"` als Schlüssel enthalten.
 *
 * Parameter:
 * @param {string} containerId – Die ID des RDF-Containers im ICDD-System
 * @param {string} projectId – Die ID des ICDD-Projekts
 * @param {string} token – Bearer-Token zur Authentifizierung an der ICDD-API
 * @param {string} variant_url – URI der Variantenressource, für die die Austauschkosten abgefragt werden sollen
 *
 * Rückgabewert:
 * @returns {Promise<string|null>} – Wert der Austauschkosten als String oder `null`, falls kein passender Eintrag gefunden wurde
 *
 * Beispiel:
 * const replacementCosts = await getReplacementCosts_forVariant("cont001", "projABC", "abc123token", "https://.../variant1");
 */
export async function getReplacementCosts_forVariant(containerId, projectId, token, variant_url) {

  const query = `
PREFIX grit: <https://greeninfratwins.com/ns/grit#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
SELECT ?variableValue
WHERE {
<${variant_url}>  grit:involvesActivities/grit:hasIndicatorSet/grit:hasIndicator ?indicator.
?indicator	grit:hasIndicatorType <https://greeninfratwins.com/ns/grit#IndicatorType_2_1_1_2>.
?indicator grit:hasVariable [ grit:hasKey "A" ; grit:hasValue ?variableValue;  ]. }
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

  console.log("Print result: ", resultsJson);

  const costs = [];
  resultsJson.results?.bindings?.forEach(binding => {
    costs.push(binding.variableValue.value);
  });
  return costs;
}


/**
 * Ruft die URL einer Variante (getVariantInfo) aus einem ICDD-Container ab.
 *
 * Diese Funktion führt eine SPARQL-Abfrage gegen die ICDD-Schnittstelle aus,
 * um die URL einer Variante zu extrahieren, die mit einem bestimmten Container
 * innerhalb eines Projekts verknüpft ist.
 *
 * @param {string} containerId - Die ID des Containers, in dem die Variante gespeichert ist.
 * @param {string} projectId - Die ID des Projekts, zu dem der Container gehört.
 * @param {string} token - Der Authentifizierungstoken für die API-Abfrage.
 *
 * @returns {Promise<string[]>} - Ein Array von URLs (als Strings), die auf Varianten im Container verweisen.
 *
 * Beispiel:
 * const urls = await getVariant_url("1234", "5678", "my-token");
 * console.log(urls); // ["https://example.com/variant/abc", ...]
 *
 * Hinweise:
 * - Die Funktion erwartet, dass die Variante mit einem RDF-Typen `grit:MeasureVariant` versehen ist.
 * - Die Abfrage verwendet die Namespace-Präfixe `rdf` und `grit`.
 */

export async function getVariantInfo(containerId, projectId, token) {
  const query = `
  PREFIX grit: <https://greeninfratwins.com/ns/grit#>
 PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
 PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  SELECT ?awf ?variant ?title
WHERE {
?awf  grit:hasMeasure/grit:hasMeasureVariant ?variant .
?variant rdf:type grit:MeasureVariant .
?variant rdfs:comment ?title.

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

  const variants = [];
  resultsJson.results?.bindings?.forEach(binding => {
    variants.push({ url: binding.variant.value, title: binding.title.value });

  });
  console.log("Varianten gefunden", variants);
  return variants; // → Array mit allen gefundenen Kostenwerten
} 

/**
new added, comments to be improved, 2025-07-31
getInstallationCosts_forVariant
*/
export async function getInstallationCosts_forVariant(containerId, projectId, token, variant_url) {

  const query = `
PREFIX grit: <https://greeninfratwins.com/ns/grit#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
SELECT ?variableValue
WHERE {
<${variant_url}>  grit:involvesActivities/grit:hasIndicatorSet/grit:hasIndicator ?indicator.
?indicator	grit:hasIndicatorType <https://greeninfratwins.com/ns/grit#IndicatorType_2_1_1_2>.
?indicator grit:hasVariable [ grit:hasKey "I" ; grit:hasValue ?variableValue;  ]. }
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

  console.log("Print result: ", resultsJson);

  const costs = [];
  resultsJson.results?.bindings?.forEach(binding => {
    costs.push(binding.variableValue.value);
  });
  return costs;
}

/**
new added, comments to be improved, 2025-07-31
getLaerm_forVariant
*/
export async function getLaerm_forVariant(containerId, projectId, token, variant_url) {
  const query = `
PREFIX grit: <https://greeninfratwins.com/ns/grit#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
SELECT ?variableValue
WHERE {
<${variant_url}> grit:involvesActivities/grit:hasIndicatorSet/grit:hasIndicator ?indicator.
?indicator	grit:hasIndicatorType <https://greeninfratwins.com/ns/grit#IndicatorType_3_1_1>.
?indicator grit:hasVariable [ grit:hasKey "L" ; grit:hasValue ?variableValue;  ]. }
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

  console.log("Print result for getLaerm_forVariant: ", resultsJson);
  const laerm = [];
  resultsJson.results?.bindings?.forEach(binding => {
    laerm.push(binding.variableValue.value);
  });
  return laerm;
}

/**
new added, comments to be improved, 2025-07-31
getPerson_forVariant
*/
export async function getPerson_forVariant(containerId, projectId, token, variant_url) {
  const query = `
PREFIX grit: <https://greeninfratwins.com/ns/grit#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
SELECT ?variableValue
WHERE {
<${variant_url}> grit:involvesActivities/grit:hasIndicatorSet/grit:hasIndicator ?indicator.
?indicator	grit:hasIndicatorType <https://greeninfratwins.com/ns/grit#IndicatorType_3_1_1>.
?indicator grit:hasVariable [ grit:hasKey "P" ; grit:hasValue ?variableValue;  ]. }
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

  console.log("Print result for getPerson_forVariant: ", resultsJson);
  const person = [];
  resultsJson.results?.bindings?.forEach(binding => {
    person.push(binding.variableValue.value);
  });
  return person;
}

/**
new added, comments to be improved, 2025-07-31
getZuverlaessigkeit_forVariant
*/
export async function getZuverlaessigkeit_forVariant(containerId, projectId, token, variant_url) {
  const query = `
PREFIX grit: <https://greeninfratwins.com/ns/grit#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
SELECT ?variableValue
WHERE {
<${variant_url}> grit:involvesActivities/grit:hasIndicatorSet/grit:hasIndicator ?indicator.
?indicator	grit:hasIndicatorType <https://greeninfratwins.com/ns/grit#IndicatorType_4_1_1>.
?indicator grit:hasIndicatorResult ?variableValue. }
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

  console.log("Print result for getZuverlaessigkeit_forVariant: ", resultsJson);
  const zuverlaessigkeit = [];
  resultsJson.results?.bindings?.forEach(binding => {
    zuverlaessigkeit.push(binding.variableValue.value);
  });
  return zuverlaessigkeit;
}