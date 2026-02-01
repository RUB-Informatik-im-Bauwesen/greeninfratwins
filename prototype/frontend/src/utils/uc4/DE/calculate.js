import { 
  getMaterialTable,  
  getMaterialRestValueJson, 
  getHazardous,  
  getDemontagefaehigkeit, 
  getCircularPotential  
} from "./data";
import { 
  calcMaterialMasse, 
  getLatestDateMaterial, 
  calcRestwert 
} from "./indicators";
import { formatEuro } from "../../operations";

/**
 * Builds the indicator table results for the specified measure variant and AWF number.
 * awfNr has four possibilities: 
 * "Auswertung - Überbau", "Auswertung - Unterbau", 
 * "Auswertung - Ausstatung", "Auswertung - Gesamtbauwerk"
 */
export async function buildIndicatorTableResults_4_DE(containerId, projectId, token, awfNr) {
  const awfMap = {
    "Auswertung - Überbau": "OBE",
    "Auswertung - Unterbau": "UNT",
    "Auswertung - Ausstatung": "AUS",
    "Auswertung - Gesamtbauwerk": null   // Gesamtbauwerk → kein Filter
  };


  const headerRowMonetary = ["Element-Code", "Restwert [€]", "Restwert-% der Bauteilgruppe"];
  const monetaryrows = [headerRowMonetary];

  const headerRowHazardous = ["Element-Code", "Bauelement (ifcGuid)", "Kennzeichnung der Schadstoffe [-]", "Masse [t]"];
  let hazardousrows = [headerRowHazardous];

  const headerDisassembly = ["Element-Code",  "Demontagefähigkeit [-]", "Masse [t]"];
  let rowDisassembly = [headerDisassembly];

  const headerCircularPotential = ["Element-Code",  "Materialverwertung - Potentiale Kreislauffähigkeit [-]", "Masse [t]"];
  let rowCircularPotential = [headerCircularPotential];

  console.log("get awfNr", awfNr);
  const code = awfMap[awfNr];

  // --- Material ---
const materialRestValueData = await getMaterialRestValueJson(containerId, projectId, token);
const Material_Kalkulationsblatt = getLatestDateMaterial(materialRestValueData);

const materialData = await getMaterialTable(containerId, projectId, token, code);
const matData = calcMaterialMasse(materialData);

// Reset
var headerRowMaterial = [];
headerRowMaterial.length = 0;
const baustoffeRow = ["Mineralische Baustoffe","t"];
const metalleRow    = ["Metalle","t"];
const kunststoffeRow= ["Kunststoffe","t"];
const bitumenRow    = ["Bituminöse Mischungen","t"];

headerRowMaterial.push("Material");
headerRowMaterial.push("");
// Summenspeicher
let sumBaustoffe = 0;
let sumMetalle = 0;
let sumKunststoffe = 0;
let sumBitumen = 0;

matData?.forEach(item => {
  headerRowMaterial.push(item.Material);

  baustoffeRow.push(item.MineralischeBaustoffe);
  metalleRow.push(item.Metalle);
  kunststoffeRow.push(item.Kunststoffe);
  bitumenRow.push(item.BituminoeseMischungen);

  sumBaustoffe += Number(item.MineralischeBaustoffe) || 0;
  sumMetalle   += Number(item.Metalle) || 0;
  sumKunststoffe += Number(item.Kunststoffe) || 0;
  sumBitumen   += Number(item.BituminoeseMischungen) || 0;
});

// am Ende Gesamt-Spalte anhängen
headerRowMaterial.push("Gesamt");
baustoffeRow.push(sumBaustoffe);
metalleRow.push(sumMetalle);
kunststoffeRow.push(sumKunststoffe);
bitumenRow.push(sumBitumen);

// fertige Tabelle
const materialTable = [
  headerRowMaterial,
  baustoffeRow,
  metalleRow,
  kunststoffeRow,
  bitumenRow
];


// --- Restwert (Codes im Header + Gesamt) ---
const restwert = calcRestwert(matData, Material_Kalkulationsblatt);
const codes = restwert.Restwert.Restwert_Material;

// Header: Codes + Gesamt
monetaryrows.length = 0; // Reset
monetaryrows.push(["Restwert","", ...codes, "Gesamt"]);

// Zeile Restwert in EUR
let eurRow = ["Restwert ","[€]"];
let eurSum = 0;
restwert.Restwert.Restwert_EUR.forEach(v => {
  eurRow.push(v);
  eurSum += Number(v) || 0;
});
eurRow.push(eurSum);
monetaryrows.push(eurRow);

// Zeile Restwert in %
let percRow = ["Restwert"," [%]"];
let percSum = 0;
restwert.Restwert.Restwert_Percent.forEach(v => {
  // v ist evtl. schon mit "%" → Zahl extrahieren
  const num = typeof v === "string" ? parseFloat(v) : v;
  percRow.push((typeof v === "string" ? v : v + "%"));
  percSum += num || 0;
});
// Summe hier ggf. auf 100% normieren
percRow.push(percSum.toFixed(2) + "%");
//monetaryrows.push(percRow);
console.log(percRow);


  // --- Hazardous (Codes im Header + Gesamt) ---
const hazardous = await getHazardous(containerId, projectId, token, code);

// Gruppieren nach Schadstoff
const groupedHazardous = hazardous.reduce((acc, h) => {
  if (!acc[h.schadstoff]) acc[h.schadstoff] = {};
  acc[h.schadstoff][h.code] = (acc[h.schadstoff][h.code] || 0) + (Number(h.mass) || 0);
  return acc;
}, {});

// alle Codes einsammeln → Header
const allHazCodes = Array.from(new Set(hazardous.map(h => h.code)));

// Header: Schadstoff + Einheit + Codes + Gesamt
hazardousrows = [["Schadstoffe", "t", ...allHazCodes, "Gesamt"]];

// Zeilen aufbauen je Schadstoff
Object.entries(groupedHazardous).forEach(([schadstoff, codeMap]) => {
  const row = [schadstoff, "t"];
  let sum = 0;
  allHazCodes.forEach(c => {
    const val = codeMap[c] || 0;
    row.push(val);
    sum += val;
  });
  row.push(sum);
  hazardousrows.push(row);
});

  

// --- Disassembly (Codes im Header + Gesamt) ---
const disassembly = await getDemontagefaehigkeit(containerId, projectId, token, code);

// Gruppieren nach Demontageklasse
const groupedByDemo = disassembly.reduce((acc, d) => {
  if (!acc[d.demontage]) acc[d.demontage] = {};
  acc[d.demontage][d.code] = (acc[d.demontage][d.code] || 0) + (Number(d.mass) || 0);
  return acc;
}, {});

// alle Codes einsammeln → Header
const allCodes = Array.from(new Set(disassembly.map(d => d.code)));
rowDisassembly = [["Demontagefähigkeit","", ...allCodes, "Gesamt"]];

// Zeilen aufbauen je Demontageklasse
Object.entries(groupedByDemo).forEach(([demontage, codeMap]) => {
  const row = [demontage,"t"];
  let sum = 0;
  allCodes.forEach(c => {
    const val = codeMap[c] || 0;
    row.push(val);
    sum += val;
  });
  row.push(sum);
  rowDisassembly.push(row);
});



// --- Circular (Codes im Header + Gesamt) ---
const circular = await getCircularPotential(containerId, projectId, token, code);

// Gruppieren nach CP-Klasse
const groupedByCp = circular.reduce((acc, c) => {
  if (!acc[c.cp]) acc[c.cp] = {};
  acc[c.cp][c.code] = (acc[c.cp][c.code] || 0) + (Number(c.mass) || 0);
  return acc;
}, {});

// alle Codes einsammeln → Header
const allCodesCirc = Array.from(new Set(circular.map(c => c.code)));
rowCircularPotential = [["Kreislauffähigkeit","", ...allCodesCirc, "Gesamt"]];

// Zeilen aufbauen je CP-Klasse
Object.entries(groupedByCp).forEach(([cp, codeMap]) => {
  const row = [cp,"t"];
  let sum = 0;
  allCodesCirc.forEach(c => {
    const val = codeMap[c] || 0;
    row.push(val);
    sum += val;
  });
  row.push(sum);
  rowCircularPotential.push(row);
});



  // Falls leer → null
  if (hazardousrows.length === 1) hazardousrows = null;
  if (rowDisassembly.length === 1) rowDisassembly = null;
  if (rowCircularPotential.length === 1) rowCircularPotential = null;

  // Ergebnisse
  const results = [
    {
      title: "Materialität [t]",
      data: [headerRowMaterial, baustoffeRow, metalleRow, kunststoffeRow, bitumenRow],
      intermediateData: [],
      unit: "t",
      type: "currency"
    },    
    
    {
      title: "Demontagefähigkeit [-] (Demontierbares Material in Tonnen)",
      data: rowDisassembly,
      intermediateData: [],
      unit: "t",
      type: "currency"
    },
    {
      title: "Materialverwertung [-] (Kreislauffähiges Material in Tonnen)",
      data: rowCircularPotential,
      intermediateData: [],
      unit: "t",
      type: "currency"
    },
    {
      title: "Schad- und Risikostoffe [-] (Belastetes Material in Tonnen)",
      data: hazardousrows,
      intermediateData: [],
      unit: "t",
      type: "currency"
    },
    {
      title: "Monetärer Materialwert [EUR]",
      data: monetaryrows,
      intermediateData: [percRow],
      unit: "€",
      type: "currency"
    },
    {
      title: "Flächeninanspruchnahme Bauprozess [m²]",
      data: null,
      intermediateData: [],
      unit: "m²",
      type: "currency"
    }
    ,
    {
      title: "Flächeninanspruchnahme Bauwerk [m²]",
      data: null,
      intermediateData: [],
      unit: "m²",
      type: "currency"
    }
  ];

  return results;
}
