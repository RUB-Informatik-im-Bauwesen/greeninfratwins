/**
 * Holt Materialtabellen für ein bestimmtes Teilbauwerk (OBE, UNT, AUS)
 * oder für das Gesamtbauwerk (codeGrITL2 = null).
 *
 * @param {string} containerId
 * @param {string} projectId
 * @param {string} token
 * @param {string|null} codeGrITL2  "OBE" | "UNT" | "AUS" | null
 * @returns {Promise<Array>} Array von Material-Datensätzen
 */
export async function getMaterialTable(containerId, projectId, token, codeGrITL2 = null) {
  const filterLine = codeGrITL2
    ? `props:codeGrITL2 "${codeGrITL2}" ;`
    : "";

  const query = `
PREFIX bot: <https://w3id.org/bot#>  
PREFIX props: <https://w3id.org/props#>
PREFIX xsd:  <http://www.w3.org/2001/XMLSchema#>
SELECT
  ?code ?matRaw ?class 
  (ROUND(?tot * 10)   / 10 AS ?mass_t) 
  (ROUND(?steel * 10) / 10 AS ?steel_t) 
  (ROUND(?conc * 10)  / 10 AS ?concrete_t)
WHERE {
  {
    SELECT ?code ?class ?matRaw 
           (SUM(?m_tot)   AS ?tot) 
           (SUM(?m_steel) AS ?steel) 
           (SUM(?m_conc)  AS ?conc)
    WHERE {
      ?s a bot:Element ;
         props:codeGrITL3 ?code ;
         ${filterLine}
         props:materialklasse ?class ;
         props:volumen ?Vraw ;
         props:dichte  ?rhoraw .
      OPTIONAL { ?s props:materialBezeichnung ?matRaw . }
      OPTIONAL { ?s props:bewehrungsgrad     ?bgraw  . }  

      BIND(xsd:decimal(?Vraw)              AS ?V)        
      BIND(xsd:decimal(?rhoraw)            AS ?rho)     
      BIND(xsd:decimal(COALESCE(?bgraw,0)) AS ?rho_s)   
      BIND(LCASE(STR(COALESCE(?matRaw,""))) AS ?mat)
      BIND(?V * ?rho / 1000 AS ?m_tot)
      BIND(
        IF(?mat = "stahl", ?m_tot,
           IF(?mat = "stahlbeton", ?V * ?rho_s / 1000, xsd:decimal(0)))
        AS ?m_steel)
      BIND(
        IF(CONTAINS(?mat,"beton"), (?m_tot - ?m_steel), xsd:decimal(0))
        AS ?m_conc)
    }
    GROUP BY ?class ?code ?matRaw 
  }
}
ORDER BY ?code
  `;

  console.log("Query getMaterialTable:", query);
  const url = `https://icdd.vm.rub.de/dev01/api/v1/projects/${projectId}/containerTypes/0/containers/${containerId}/query?query=${encodeURIComponent(query)}`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const resultsJson = await response.json();

  const data = resultsJson.results?.bindings?.map(binding => ({
    code: binding.code?.value ?? "SPARQL Abfrage gescheitert",
    matRaw: binding.matRaw?.value ?? "SPARQL Abfrage gescheitert",
    mass_t: binding.mass_t?.value ?? 0,
    steel_t: binding.steel_t?.value ?? 0,
    concrete_t: binding.concrete_t?.value ?? 0,
    class: binding.class?.value ?? "SPARQL Abfrage gescheitert"
  })) || [];
  return data;
}



/**
new added, comments to be improved, 2025-08-20
getHazardous
codeGrITL2 should be "OBE", "UNT" or "AUS"
*/
export async function getHazardous(containerId, projectId, token, codeGrITL2 = null) {
  const filter = codeGrITL2
    ? `FILTER(?codeGrITL2 = "${codeGrITL2}")`
    : "";  // wenn null → kein Filter

  const query = `
PREFIX bot:  <https://w3id.org/bot#>
PREFIX grit: <https://greeninfratwins.com/ns/grit#>
PREFIX xsd:  <http://www.w3.org/2001/XMLSchema#>
SELECT
  ?code ?ifcguid ?mass ?schadstoff
WHERE {
  ?subject a bot:Element .
  ?subject <https://w3id.org/props#globalIdIfcRoot> ?ifcguid .
  ?subject <https://w3id.org/props#codeGrITL3> ?code .
  ?subject <https://w3id.org/props#codeGrITL2> ?codeGrITL2 .
  ${filter}
  OPTIONAL {
    ?subject <https://w3id.org/props#volumen> ?volume .
    ?subject <https://w3id.org/props#dichte>  ?dichte .
    BIND( ( xsd:decimal(?volume) * xsd:decimal(?dichte) / 1000 ) AS ?mass )
  }
    ?subject <https://w3id.org/props#schadRisikostoffBezeichung>  ?schadstoff .
    ?subject <https://w3id.org/props#schadRisikostoffvorhanden>   ?schadVorhanden .
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

  console.log("Print result for getHazardous: ", resultsJson);
  const data = resultsJson.results?.bindings?.map(binding => ({
    code: binding.code?.value ?? "SPARQL Abfrage gescheitert",
    ifcguid: binding.ifcguid?.value ?? "SPARQL Abfrage gescheitert",
    mass: binding.mass?.value ?? 0,
    schadstoff: binding.schadstoff?.value ?? "SPARQL Abfrage gescheitert"
  })) || [];
  return data;
}


/**
Hagedorn new added, comments to be improved, 2025-08-20
getDemontagefaehigkeit
codeGrITL2 should be "OBE", "UNT" or "AUS"
*/
export async function getDemontagefaehigkeit(containerId, projectId, token, codeGrITL2 = null) {
const filter = codeGrITL2
    ? `FILTER(?codeGrITL2 = "${codeGrITL2}")`
    : "";  // wenn null → kein Filter

  const query = `
PREFIX bot:  <https://w3id.org/bot#>
PREFIX grit: <https://greeninfratwins.com/ns/grit#>
PREFIX xsd:  <http://www.w3.org/2001/XMLSchema#>
SELECT
  ?code ?ifcguid ?mass ?demontage
WHERE {
  ?subject a bot:Element .
  ?subject <https://w3id.org/props#globalIdIfcRoot> ?ifcguid .
  ?subject <https://w3id.org/props#codeGrITL3> ?code .
  ?subject <https://w3id.org/props#codeGrITL2> ?codeGrITL2 .
  ${filter}
  OPTIONAL {
    ?subject <https://w3id.org/props#volumen> ?volume .
    ?subject <https://w3id.org/props#dichte>  ?dichte .
    BIND( ( xsd:decimal(?volume) * xsd:decimal(?dichte) / 1000 ) AS ?mass )
  }
  ?subject <https://w3id.org/props#demontagefaehigkeitsklasse>  ?demontage .
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

  console.log("Print result for getDemontagefaehigkeit: ", resultsJson);
  const data = resultsJson.results?.bindings?.map(binding => ({
    code: binding.code?.value ?? "SPARQL Abfrage gescheitert",
    ifcguid: binding.ifcguid?.value ?? "SPARQL Abfrage gescheitert",
    mass: binding.mass?.value ?? 0,
    demontage: binding.demontage?.value ?? "SPARQL Abfrage gescheitert"
  })) || [];
  return data;
}

/**
Hagedorn new added, comments to be improved, 2025-08-20
getDemontagefaehigkeit
codeGrITL2 should be "OBE", "UNT" or "AUS"
*/
export async function getCircularPotential(containerId, projectId, token, codeGrITL2 = null) {
const filter = codeGrITL2
    ? `FILTER(?codeGrITL2 = "${codeGrITL2}")`
    : "";  // wenn null → kein Filter

  const query = `
PREFIX bot:  <https://w3id.org/bot#>
PREFIX grit: <https://greeninfratwins.com/ns/grit#>
PREFIX xsd:  <http://www.w3.org/2001/XMLSchema#>
SELECT
  ?code ?ifcguid ?mass ?cp
WHERE {
  ?subject a bot:Element .
  ?subject <https://w3id.org/props#globalIdIfcRoot> ?ifcguid .
  ?subject <https://w3id.org/props#codeGrITL3> ?code .
  ?subject <https://w3id.org/props#codeGrITL2> ?codeGrITL2 .
  ${filter}
  OPTIONAL {
    ?subject <https://w3id.org/props#volumen> ?volume .
    ?subject <https://w3id.org/props#dichte>  ?dichte .
    BIND( ( xsd:decimal(?volume) * xsd:decimal(?dichte) / 1000 ) AS ?mass )
  }
  ?subject <https://w3id.org/props#wiederverwendbarkeitsklasse>  ?cp .
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

  console.log("Print result for getCircularPotential: ", resultsJson);
  const data = resultsJson.results?.bindings?.map(binding => ({
    code: binding.code?.value ?? "SPARQL Abfrage gescheitert",
    ifcguid: binding.ifcguid?.value ?? "SPARQL Abfrage gescheitert",
    mass: binding.mass?.value ?? 0,
    cp: binding.cp?.value ?? "SPARQL Abfrage gescheitert"
  })) || [];
  return data;
}



/**
new added, comments to be improved, 2025-08-20
getHighlightElements_Gesamt
Return all the guids of elements with all codeGrITL2
*/
export async function getHighlightElements_Gesamt(containerId, projectId, token) {
  const query = `
PREFIX xsd:   <http://www.w3.org/2001/XMLSchema#>
PREFIX bot:   <https://w3id.org/bot#>
PREFIX props: <https://w3id.org/props#>

SELECT DISTINCT
  (CONCAT(
     "[",
     GROUP_CONCAT(DISTINCT CONCAT("\\\"", STR(?guid), "\\\""); separator=","),
     "]"
   ) AS ?ifcGuidsJson)
WHERE {
  ?subject a bot:Element ;
           props:globalIdIfcRoot ?guid .
             
   {?subject        props:codeGrITL2 "AUS" .}
  UNION 
        {?subject        props:codeGrITL2 "OBE" .}
  UNION       
   {?subject        props:codeGrITL2 "UNT" .}

}
  `;
  console.log("Query getHighlightElements_Gesamt: ", query);
  const url = `https://icdd.vm.rub.de/dev01/api/v1/projects/${projectId}/containerTypes/0/containers/${containerId}/query?query=${encodeURIComponent(query)}`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const resultsJson = await response.json();

  console.log("Print result for getHighlightElements_Gesamt: ", resultsJson);
  const data = resultsJson.results?.bindings?.map(binding => ({
    ifcGuids: binding.ifcGuidsJson?.value ?? "SPARQL Abfrage gescheitert"
  })) || [];
  console.log("Print return value for getHighlightElements_Gesamt: ", data);

  return data;
}

/**
new added, comments to be improved, 2025-08-20
getHighlightElements
codeGrITL2 should be "OBE", "UNT" or "AUS"
*/
export async function getHighlightElements(containerId, projectId, token, codeGrITL2) {
  const query = `
PREFIX xsd:   <http://www.w3.org/2001/XMLSchema#>
PREFIX bot:   <https://w3id.org/bot#>
PREFIX props: <https://w3id.org/props#>
SELECT DISTINCT
  (CONCAT(
     "[",
     GROUP_CONCAT(DISTINCT CONCAT("\\\"", STR(?guid), "\\\""); separator=","),
     "]"
   ) AS ?ifcGuidsJson)
WHERE {
  ?subject a bot:Element ;
           props:globalIdIfcRoot ?guid .
   {?subject        props:codeGrITL2 "${codeGrITL2}" .}
}
  `;
  console.log("Query getHighlightElements: ", query);
  const url = `https://icdd.vm.rub.de/dev01/api/v1/projects/${projectId}/containerTypes/0/containers/${containerId}/query?query=${encodeURIComponent(query)}`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const resultsJson = await response.json();

  console.log("Print result for getHighlightElements: ", resultsJson);
  const data = resultsJson.results?.bindings?.map(binding => ({
    ifcGuids: binding.ifcGuidsJson?.value ?? "SPARQL Abfrage gescheitert"
  })) || [];
  console.log("Print return value for getHighlightElements: ", data);
  return data;
}

/**
new added, comments to be improved, 2025-08-20
Read file from icdd
default file name is "MaterialRestValue.json"
return a JSON file
*/
export async function getMaterialRestValueJson(containerId, projectId, token, materialRestValueFileName = "MaterialRestValue.json") {

  const url = `https://icdd.vm.rub.de/dev01/api/v1/projects/${projectId}/containerTypes/0/containers/${containerId}/contents/`;//${encodeURIComponent(verkehrsdatenFileName)}
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const resultsJson = await response.json();
  console.log("Print getMaterialRestValueJson resultsJson: ", resultsJson);

  // Find the file with the matching name
  const fileObj = resultsJson.find(file => file.Name === materialRestValueFileName);
  if (!fileObj) {
    throw new Error(`File ${materialRestValueFileName} not found in container contents`);
  }
  console.log("Found getMaterialRestValueJson: ", fileObj);

  let fileJson = {};
  const fileUrl = url + fileObj.Id + "/attachment";
  // Fetch the actual JSON content of the file
  try {
    const response = await fetch(fileUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error('Failed to fetch file content');
    fileJson = await response.json();

    console.log("getMaterialRestValueJson file.Name & file.content:", fileObj.Name, fileJson); // Debug log

  }
  catch (err) { console.error(`Error fetching ${fileObj.Name} file:`, err); }

  console.log("Print getMaterialRestValueJson: ", fileJson);
  return fileJson;
}

/**
new added, comments to be improved, 2025-08-20
Write file to icdd
default file name is "MaterialRestValue.json"
return a JSON file
*/
export async function writeMaterialRestValueJson(containerId, projectId, token, materialRestValueFileName = "MaterialRestValue.json", data) {
  const url = `https://icdd.vm.rub.de/dev01/api/v1/projects/${projectId}/containerTypes/0/containers/${containerId}/contents/`;//${encodeURIComponent(verkehrsdatenFileName)}
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const resultsJson = await response.json();
  console.log("Print writeMaterialRestValueJson resultsJson: ", resultsJson);

  // Find the file with the matching name
  const fileObj = resultsJson.find(file => file.Name === materialRestValueFileName);
  if (!fileObj) {
    throw new Error(`File ${materialRestValueFileName} not found in container contents`);
  }
  console.log("Found writeMaterialRestValueJson: ", fileObj);

  let fileJson = {};
  const fileUrl = url + fileObj.Id + "/attachment";
  // Fetch the actual JSON content of the file
  try {
    /*const response = await fetch(fileUrl, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        Name: materialRestValueFileName,
        Content: data
      })
    });*/
    const response = await fetch(fileUrl, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: (() => {
        const form = new FormData();
        const fileName = `${materialRestValueFileName}.json`;

        // Dein JSON in eine Datei (Blob) verwandeln
        const json = JSON.stringify(data); // 'data' ist dein Objekt
        const blob = new Blob([json], { type: 'application/json' });

        form.append('uploadFile', blob, fileName);

        return form;
      })(),
    });

    if (!response.ok) throw new Error('Failed to fetch file content');
    fileJson = await response.json();

    console.log("writeMaterialRestValueJson file.Name & file.content:", fileObj.Name, fileJson); // Debug log

  }
  catch (err) { console.error(`Error fetching ${fileObj.Name} file:`, err); }

  console.log("Print writeMaterialRestValueJson: ", fileJson);
}


