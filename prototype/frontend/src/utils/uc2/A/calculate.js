import { getVariantInfo, getOperationalCosts_forVariant, getMaterialCosts_forVariant, getReplacementCosts_forVariant, getEPDRelatedQuantityAndEPDValue } from "./data";
import { calcGWP, calcProcessCosts, calcTotalGWP } from "./indicators";
import {formatCell, formatEuro} from "../../operations"
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
 * [
 *   {
 *     title: "Materialkosten [EUR]",
 *     data: [
 *       ["Activity", "Variant 1", "Variant 2"],
 *       ["Einbau", "1560000", "1050000"]
 *     ]
 *   },
 *   {
 *     title: "Prozessbezogene Kosten [EUR]",
 *     data: [
 *       ["Activity", "Cost Type", "Variant 1", "Variant 2"],
 *       ["Einbau", "Gesamtkosten", "23800", "22742"],
 *       ["Einbau", "Betriebskosten", "18000", "12000"],
 *       ["Einbau", "Austauschkosten", "5800", "10742"]
 *     ]
 *   }
 * ]
 */

export async function buildIndicatorTableResults_2_AT(containerId, projectId, token, massnahmeVariante) {
  const headerRow = ["Aktivität", "Berechnung", ...massnahmeVariante.varianten.map((variant, i) => `Variante ${i + 1} - ${variant.nameMeasureVariant}`)];

  const materialRow = ["Einbau", "Gesamtkosten"];
  const totalProcessRow = ["Einbau", "Gesamtkosten"];
  const operatingRow = ["Einbau", "Betriebskosten"];
  const replacementRow = ["Einbau", "Austauschkosten"];
  const gwpRawCalculations = ["Einbau", "Gesamt"];

  // NEU: IntermediateData als Tabelle im gleichen Format
  const gwpIntermediateData = [headerRow];

  // Parameter, die wir darstellen wollen
  const parameterLabels = ["EPD Ansatzwert", "Lebensdauer Bauwerk", "Lebensdauer Elemente"];
  const parameterKeys = ["GWPtotal_A1_3", "lifespan_bridge", "lifespan_element"];

  for (const [variantIndex, variant] of massnahmeVariante.varianten.entries()) {
    // Materialkosten
    const materialCosts = await getMaterialCosts_forVariant(containerId, projectId, token, variant.urlMeasureVariant);
        materialRow.push((materialCosts) || (0));

    // Betriebskosten + Austauschkosten
    const operating = parseFloat(await getOperationalCosts_forVariant(containerId, projectId, token, variant.urlMeasureVariant) || "0");
    const replacement = parseFloat(await getReplacementCosts_forVariant(containerId, projectId, token, variant.urlMeasureVariant) || "0");
    const total = calcProcessCosts(operating, replacement);
    operatingRow.push(operating);
    replacementRow.push(replacement);
    totalProcessRow.push(total);

    // --- GWP Berechnung ---
    for (const activity of variant.activity) {
      const calc = await getEPDRelatedQuantityAndEPDValue(containerId, projectId, token, variant.urlMeasureVariant, activity.guids);
      console.log("calc: " , calc)
      if(calc!=null){
      const elements = calc
        .flat()
        .filter(el => el.elementGuid)
        .map(el => ({
          epd_quantity: parseFloat(el.valueQuantity),
          GWPtotal_A1_3: parseFloat(el.valueGwp),
          lifespan_bridge: 100,
          lifespan_element: parseFloat(el.valueServiceLife)
        }));

      const totalGWP = calcTotalGWP(elements);
      gwpRawCalculations.push(totalGWP);

      // **Neue Zeile mit GUIDs und Typen**
      const elementInfo = calc
        .map(el => {
          // IFC Sonderzeichen in Typ decodieren (z. B. \X2\00DC\X0\ → Ü)
          const cleanType = el.elementType?.replace(/\\X2\\00DC\\X0\\/g, "Ü") || el.elementType || "-";
          return `${cleanType} (${el.elementGuid})`;
        })
        .join("\n ") ?? "konnte nicht berechnet werden";

      let elementRow = gwpIntermediateData.find(r => r[0] === activity.activityName && r[1] === "Elemente mit ihrer spezifischen Quantität");
      if (!elementRow) {
        elementRow = [activity.activityName, "Elemente mit ihrer spezifischen Quantität"];
        for (let i = 0; i < massnahmeVariante.varianten.length; i++) elementRow.push("");
        gwpIntermediateData.push(elementRow);
      }
      elementRow[2 + variantIndex] = elementInfo;

      // --- Parameterzeilen für jede Aktivität hinzufügen ---
      parameterKeys.forEach((param, idx) => {
        const label = parameterLabels[idx]; // sprechendes Label

        let row = gwpIntermediateData.find(r => r[0] === activity.activityName && r[1] === label);
        if (!row) {
          row = [activity.activityName, label];
          for (let i = 0; i < massnahmeVariante.varianten.length; i++) {
            row.push("");
          }
          gwpIntermediateData.push(row);
        }

        let value;
        if (param === "GWP Berechnung") {
          value = Math.round(totalGWP * 100) / 100;
        } else {
          const avg = elements.reduce((sum, el) => sum + el[param], 0) / elements.length || 0;
          value = Math.round(avg * 100) / 100;
        }

        row[2 + variantIndex] = value;
      });
}
    }
  }

  // Ergebnisse
  const results = [
    {
      title: "GWP [kg CO2-Äquiv.]",
      data: [headerRow, gwpRawCalculations],
      intermediateData: gwpIntermediateData,
            unit: "kg"  
    },
    {
      title: "Materialkosten [€]",
      data: [headerRow, materialRow],
      intermediateData: [],
            unit: "€"   ,
            type: "currency"       
    },
    {
      title: "Prozessbezogene Kosten [€]",
      data: [headerRow, totalProcessRow],
      intermediateData: [headerRow, operatingRow, replacementRow],
            unit: "€",
            type: "currency"
    }
  ];

  return results;
}

