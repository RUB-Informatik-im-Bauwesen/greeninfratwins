
export async function getInputDataforAssetsGWP(containerId, projectId, token, activity_url) {
  const query = `
PREFIX grit: <https://greeninfratwins.com/ns/grit#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
SELECT ?indicator ?asset ?value
WHERE {
<${activity_url}>  grit:hasIndicatorSet/grit:hasIndicator ?indicator.
?indicator	grit:hasIndicatorType <https://greeninfratwins.com/ns/grit#IndicatorType_1_5_1>.
?indicator grit:hasVariable/grit:mapsToLbdProperty ?property.
OPTIONAL {
?indicator grit:calculatesForAsset ?utilization.
?activity grit:hasAssetUtilization ?utilization.
?utilization grit:hasAsset ?asset.
?utilization ?property ?value.
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

  //console.log("Print result for getMaterialCosts_forVariant: ", resultsJson);
  const resultsArray = [];
  resultsJson.results?.bindings?.forEach(binding => {
    resultsArray.push(binding.variableValue.value);
  });
  return resultsArray;
}


export async function getExternalCostsForActivity(containerId, projectId, token, activity_url) {
  const query = `
PREFIX grit: <https://greeninfratwins.com/ns/grit#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
SELECT  ?value
WHERE { <${activity_url}>  grit:hasIndicatorSet/grit:hasIndicator [grit:hasIndicatorType grit:IndicatorType_2_2_1; grit:hasIndicatorResult ?value;]. }
  `;
  //console.log("Query: ", query);
  const url = `https://icdd.vm.rub.de/dev01/api/v1/projects/${projectId}/containerTypes/0/containers/${containerId}/query?query=${encodeURIComponent(query)}`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const resultsJson = await response.json();

  //console.log("Print result for getExternalCostsForActivity UC1: ", resultsJson);
  const resultsArray = [];
  resultsJson.results?.bindings?.forEach(binding => {
    resultsArray.push(binding.value.value);
  });
  return resultsArray;
}


export async function getProcessCostsForActivity(containerId, projectId, token, activity_url) {
  const query = `
PREFIX grit: <https://greeninfratwins.com/ns/grit#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
SELECT  ?value
WHERE { <${activity_url}>  grit:hasIndicatorSet/grit:hasIndicator [grit:hasIndicatorType grit:IndicatorType_2_1_1_2; grit:hasIndicatorResult ?value;]. }
  `;
  //console.log("Query: ", query);
  const url = `https://icdd.vm.rub.de/dev01/api/v1/projects/${projectId}/containerTypes/0/containers/${containerId}/query?query=${encodeURIComponent(query)}`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const resultsJson = await response.json();

  //console.log("Print result for getProcessCostsForActivity UC1: ", resultsJson);
  const resultsArray = [];
  resultsJson.results?.bindings?.forEach(binding => {
    resultsArray.push(binding.value.value);
  });
  return resultsArray;
}

export async function getEmissionsForActivity(containerId, projectId, token, activity_url) {
  const query = `
PREFIX grit: <https://greeninfratwins.com/ns/grit#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
SELECT  ?value
WHERE { <${activity_url}>  grit:hasIndicatorSet/grit:hasIndicator [grit:hasIndicatorType grit:IndicatorType_3_1_2; grit:hasIndicatorResult ?value;]. }
  `;
  //console.log("Query: ", query);
  const url = `https://icdd.vm.rub.de/dev01/api/v1/projects/${projectId}/containerTypes/0/containers/${containerId}/query?query=${encodeURIComponent(query)}`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const resultsJson = await response.json();

  //console.log("Print result for getEmissionsForActivity UC1: ", resultsJson);
  const resultsArray = [];
  resultsJson.results?.bindings?.forEach(binding => {
    resultsArray.push(binding.value.value);
  });
  return resultsArray;
}

export async function getEPDforAsset(containerId, projectId, token, asset_url) {
  const query = `
PREFIX grit: <https://greeninfratwins.com/ns/grit#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
SELECT  *
WHERE { <${asset_url}>  grit:hasGWP ?gwp; grit:hasEP ?ep; grit:hasODP ?odp; grit:hasAP ?ap; grit:hasPOCP ?pocp; grit:hasKEA ?kea; grit:hasCost ?cost.}
  `;
  //console.log("Query: ", query);
  const url = `https://icdd.vm.rub.de/dev01/api/v1/projects/${projectId}/containerTypes/0/containers/${containerId}/query?query=${encodeURIComponent(query)}`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const json = await response.json();

  const b = json?.results?.bindings?.[0] ?? {};
  const toNum = (x) => {
    const n = Number(x?.value);
    return Number.isFinite(n) ? n : 0;
  };

  return {
    GWP:  toNum(b.gwp),
    EP:   toNum(b.ep),
    ODP:  toNum(b.odp),
    AP:   toNum(b.ap),
    POCP: toNum(b.pocp),
    KEA:  toNum(b.kea),
    COST: toNum(b.cost)
  };
}

/**
 * Liefert eine Map: { assetUri -> { GWP, EP, ODP, AP, POCP, KEA, COST } }
 */
export async function getEPDForAssetsMap(containerId, projectId, token, assetUrls = []) {
  if (!assetUrls.length) return new Map();

  // VALUES-Block zusammenstellen
  const values = assetUrls.map(u => `(<${u}>)`).join(" ");

  const query = `
PREFIX grit: <https://greeninfratwins.com/ns/grit#>
SELECT ?asset ?gwp ?ep ?odp ?ap ?pocp ?kea ?cost
WHERE {
  VALUES (?asset) { ${values} }
  ?asset
    grit:hasGWP  ?gwp ;
    grit:hasEP   ?ep ;
    grit:hasODP  ?odp ;
    grit:hasAP   ?ap ;
    grit:hasPOCP ?pocp ;
    grit:hasKEA  ?kea ;
    grit:hasCost ?cost .
}
  `;

  const url = `https://icdd.vm.rub.de/dev01/api/v1/projects/${projectId}/containerTypes/0/containers/${containerId}/query?query=${encodeURIComponent(query)}`;
  const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  const json = await response.json();

  const map = new Map();
  const toNum = (v) => {
    const n = Number(v?.value);
    return Number.isFinite(n) ? n : 0;
  };

  (json?.results?.bindings || []).forEach(b => {
    const uri = b?.asset?.value;
    if (!uri) return;
    map.set(uri, {
      GWP:  toNum(b.gwp),
      EP:   toNum(b.ep),
      ODP:  toNum(b.odp),
      AP:   toNum(b.ap),
      POCP: toNum(b.pocp),
      KEA:  toNum(b.kea),
      COST: toNum(b.cost)
    });
  });

  // Falls einzelne Assets ohne Treffer waren, mit Nullen ergänzen:
  for (const u of assetUrls) {
    if (!map.has(u)) {
      map.set(u, { GWP:0, EP:0, ODP:0, AP:0, POCP:0, KEA:0, COST:0 });
    }
  }

  return map;
}


export async function getNoiseForActivity(containerId, projectId, token, activity_url) {
  const query = `
PREFIX grit: <https://greeninfratwins.com/ns/grit#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
SELECT  ?value
WHERE { <${activity_url}>  grit:hasIndicatorSet/grit:hasIndicator [grit:hasIndicatorType grit:IndicatorType_3_1_1; grit:hasIndicatorResult ?value;]. }
  `;
  //console.log("Query: ", query);
  const url = `https://icdd.vm.rub.de/dev01/api/v1/projects/${projectId}/containerTypes/0/containers/${containerId}/query?query=${encodeURIComponent(query)}`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const resultsJson = await response.json();

 // console.log("Print result for getNoiseForActivity UC1: ", resultsJson);
  const resultsArray = [];
  resultsJson.results?.bindings?.forEach(binding => {
    resultsArray.push(binding.value.value);
  });
  return resultsArray;
}

