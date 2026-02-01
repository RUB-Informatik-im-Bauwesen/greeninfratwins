import { type } from "@testing-library/user-event/dist/cjs/utility/type.js";
import {
  getEPDRelatedQuantity_URL_UUID,
  getEPDRelatedQuantity_Bewehrungstahl,//2025-10-02
  getEPDForElement,
  getGWPtotal_Lifecycle,
  getPENRTtotal_Lifecycle,
  getPERTtotal_Lifecycle,
  getProcessCosts,
  getActivityDuration_forVariant,
  getValueForActivity,
  getDTV_forVariant,
  getWorkingzoneLength_forVariant,
  getBridgeSpeedlimit_forVariant,
  getVerkehrsdatenValues,
  getVerkehrsdatenJson,
  getMaterialPreisE,
  getMaterialPreisA
} from "./data";
import {
  calcGWP,
  calcKEA,
  calcMaterialCost,
  calcConstructionSafety,
  calcTrafficImpact
} from "./indicators";
import { ToastContainer, toast } from "react-toastify";
export async function buildIndicatorTableResults_2_CH(containerId, projectId, token, massnahmeVariante) {
  const headerRow = [
    "Aktivität",
    "Berechnung",
    ...massnahmeVariante.varianten.map((variant, i) => `Variante ${i + 1} - ${variant.nameMeasureVariant}`)
  ];

  // Aggregat-Zeilen (Endausgabe)
  const gwpRawCalculationsE = ["Einbau", "Gesamt"];
  const gwpRawCalculationsA = ["Abbruch", "Gesamt"];
  const keaRawCalculationsE = ["Einbau", "Gesamt"];
  const keaRawCalculationsA = ["Abbruch", "Gesamt"];
  const materialRowE = ["Einbau", "Gesamtkosten"];
  const materialRowA = ["Abbruch", "Gesamtkosten"];
  const totalProcessRowE = ["Einbau", "Teilkosten"];
  const totalProcessRowA = ["Abbruch", "Teilkosten"];
  const accidentNumberE = ["Einbau", "Gesamt"];
  const accidentNumberA = ["Abbruch", "Gesamt"];
  const travelTimeLossE = ["Einbau", "Gesamt"];
  const travelTimeLossA = ["Abbruch", "Gesamt"];

  // Intermediate-Maps (vereinigen Werte je Key in einer 4-Spalten-Zeile)
  const gwpMap = new Map();       // key -> [Aktivität, Beschreibung, Var1, Var2]
  const keaMap = new Map();
  const materialMap = new Map();
  const processMap = new Map();
  const accidentMap = new Map();
  const travelMap = new Map();

  // Hilfsfunktionen
  const num4 = (x) => Number(((x ?? 0)).toFixed(4));
  const setV = (row, variantIndex, value) => { row[variantIndex === 0 ? 2 : 3] = value; };
  const upsertRow = (map, key, activity, desc, variantIndex, value) => {
    if (!map.has(key)) map.set(key, [activity, desc, "", ""]);
    const row = map.get(key);
    setV(row, variantIndex, value);

  };


  const elTypeOf = (el) =>
    el.elementType || el.ifcType || el.materialString || el.elementName || el.productName || "Element";

  // Wertetabelle (Sicherheit/Verkehr)
  const verkehrsdatenJson = await getVerkehrsdatenJson(
    containerId,
    projectId,
    token,
    "Arbeitssicherheit_Wertetabelle.json"
  );

  for (const [variantIndex, variant] of massnahmeVariante.varianten.entries()) {
    const captureForIntermediate = variantIndex < 2;

    for (const activity of variant.activity) {
      const actLabel = activity.activityName;

      // --- EPD/Elemente ---
      const epdQuantityUrlUuid = await getEPDRelatedQuantity_URL_UUID(
        containerId, projectId, token, variant.urlMeasureVariant, activity.guids
      );

      console.log("Check variant and activity:", variantIndex, actLabel);

      //New added for Bewehrungstahl, 2025-10-02
      const epdQuantityUrlUuid_updated = await getEPDRelatedQuantity_Bewehrungstahl(
        variantIndex, actLabel, epdQuantityUrlUuid
      );

      console.log("Get epdQuantityUrlUuid_updated:", epdQuantityUrlUuid_updated);


      let sumGWP = 0.0;
      let sumKEA = 0.0;
      let sumMaterialCostE = 0.0;
      let sumMaterialCostA = 0.0;

      for (const el of epdQuantityUrlUuid_updated) {
        try {
          await getEPDForElement(el);
          console.log("Get after getEPDForElement:", el);
          
          const qty = parseFloat(el.valueQuantity);
          if (!(qty > 0) || el.epdURL == null || el.epdURL === "Null URL") continue;

          // Module je Aktivität
          let modules;
          if (actLabel === "Einbau") modules = ["A1-A3", "A4"];
          else if (actLabel === "Abbruch") modules = ["C1", "C2", "C3", "C4"];
          else modules = [];
          const modulesStr = modules.length ? modules.join("+") : "A*+C*";

          // Faktoren
          const gwpTotal = modules.length ? getGWPtotal_Lifecycle(el, modules) : getGWPtotal_Lifecycle(el);
          const penrtTotal = modules.length ? getPENRTtotal_Lifecycle(el, modules) : getPENRTtotal_Lifecycle(el);
          const pertTotal = modules.length ? getPERTtotal_Lifecycle(el, modules) : getPERTtotal_Lifecycle(el);

          const gwp = calcGWP(qty, gwpTotal);
          const kea = calcKEA(qty, penrtTotal, pertTotal);

          sumGWP += gwp;
          sumKEA += kea;

          const typeKey = elTypeOf(el);

          // GWP – zeilenweise, pro Elementtyp zusammengeführt
          if (captureForIntermediate) {
            const desc = `GWP · ${typeKey} (${el.elementGuid})`;
            const key = `${el.elementGuid}|${actLabel}|GWP|${typeKey}`;
            const val = `${num4(gwp)} kg (Menge=${qty}, Faktor=${gwpTotal}, Module=${modulesStr})`;
            upsertRow(gwpMap, key, actLabel, desc, variantIndex, val);
            console.log("Check intermediate values GWP:", key, variantIndex, desc, val);
          }

          // KEA – zeilenweise, pro Elementtyp zusammengeführt
          if (captureForIntermediate) {
            const desc = `KEA · ${typeKey} (${el.elementGuid})`;
            const key = `${el.elementGuid}|${actLabel}|KEA|${typeKey}`;
            const val = `${num4(kea)} MJ (Menge=${qty}, PENRT=${penrtTotal}, PERT=${pertTotal})`;
            upsertRow(keaMap, key, actLabel, desc, variantIndex, val);
          }

          // Materialkosten
          if (actLabel === "Einbau") {
            const preisInfo = getMaterialPreisE(el.materialString);
            if (preisInfo && preisInfo.Einheitspreis != null && preisInfo.Einheit != null) {
              const mCost = calcMaterialCost(qty, parseFloat(preisInfo.Einheitspreis));
              sumMaterialCostE += mCost;
              if (captureForIntermediate) {
                const desc = `Materialkosten · ${typeKey} (${el.elementGuid})`;
                const key = `${el.elementGuid}|${actLabel}|MAT|${typeKey}`;
                const val = `${mCost.toFixed(2)} CHF (Menge=${qty}, Preis=${preisInfo.Einheitspreis}/${preisInfo.Einheit})`;
                upsertRow(materialMap, key, actLabel, desc, variantIndex, val);
              }
            }
          }else if (actLabel === "Abbruch") {
            const preisInfo = getMaterialPreisA(el.materialString);
            if (preisInfo && preisInfo.Einheitspreis != null && preisInfo.Einheit != null) {
              const mCost = calcMaterialCost(qty, parseFloat(preisInfo.Einheitspreis));
              sumMaterialCostA += mCost;
              if (captureForIntermediate) {
                const desc = `Materialkosten · ${typeKey} (${el.elementGuid})`;
                const key = `${el.elementGuid}|${actLabel}|MAT|${typeKey}`;
                const val = `${mCost.toFixed(2)} CHF (Menge=${qty}, Preis=${preisInfo.Einheitspreis}/${preisInfo.Einheit})`;
                upsertRow(materialMap, key, actLabel, desc, variantIndex, val);
              }
            }
          }

          el.gwp = gwp;
          el.kea = kea;
        } catch {
          continue;
        }
      }

      // --- Prozess-/Verkehrs-Parameter & Teilresultate ---
      const processCosts = await getProcessCosts(containerId, projectId, token, variant.urlMeasureVariant);
      const processCostValue = getValueForActivity(processCosts, actLabel);

      const activityDuration = await getActivityDuration_forVariant(containerId, projectId, token, variant.urlMeasureVariant);
      const activityDurationValue = getValueForActivity(activityDuration, actLabel);

      const dtv = await getDTV_forVariant(containerId, projectId, token, variant.urlMeasureVariant);
      const dtvValue = getValueForActivity(dtv, actLabel);

      const workingzoneLength = await getWorkingzoneLength_forVariant(containerId, projectId, token, variant.urlMeasureVariant);
      const workingzoneLengthValue = getValueForActivity(workingzoneLength, actLabel);

      const bridgeSpeedlimit = await getBridgeSpeedlimit_forVariant(containerId, projectId, token, variant.urlMeasureVariant);
      const bridgeSpeedlimitValue = getValueForActivity(bridgeSpeedlimit, actLabel);

      const anzahlBauphase = activity.AnzahlBauphase;
      const geschwindigkeitZone = activity.zulGeschwindigkeitZone;

      if (!anzahlBauphase || !geschwindigkeitZone) {
        var variantKey = variantIndex + 1;
        var text = "Betrifft Variante " + variantKey + ": ";
        if (!geschwindigkeitZone) {
          text = text + "Zulässige Geschwindigkeit ist nicht ausgewählt für die Aktivität " + actLabel + ".\n\n";
        }
        if (!anzahlBauphase) {
          text = text + "Anzahl der Bauphasen ist nicht ausgewählt für die Aktivität " + actLabel + ".\n\n";
        }

        toast.warning(text, { autoClose: 100000 });
      }




      const { AUmV, AUoV } = getVerkehrsdatenValues(
        `Variante ${variantIndex + 1}`,
        actLabel,
        anzahlBauphase,
        geschwindigkeitZone,
        verkehrsdatenJson
      );

      const accidentImpactSum = calcConstructionSafety(activityDurationValue, dtvValue, AUmV, AUoV);

      const trafficImpactSum = calcTrafficImpact(
        dtvValue,
        activityDurationValue,
        workingzoneLengthValue,
        geschwindigkeitZone,
        bridgeSpeedlimitValue
      );

      // Prozesskosten


      // Unfälle
      if (captureForIntermediate) {
        const desc = `Gesamt - Arbeitssicherheit (Unfälle)`;
        const key = `${actLabel}|ACC`;
        //const val = `${num4(accidentImpactSum)} (-) (Dauer=${activityDurationValue}, DTV=${dtvValue}, AUmV=${AUmV}, AUoV=${AUoV})`;
        const val = `${num4(accidentImpactSum)} (Dauer=${activityDurationValue}, DTV=${dtvValue}, AUmV=${AUmV}, AUoV=${AUoV})`;
        upsertRow(accidentMap, key, actLabel, desc, variantIndex, val);
      }

      // Reisezeitverlust
      if (captureForIntermediate) {
        const desc = `Gesamt - Reisezeitverlust`;
        const key = `${actLabel}|TRVL`;
        const val = `${num4(trafficImpactSum)} h (DTV=${dtvValue}, Dauer=${activityDurationValue}, L=${workingzoneLengthValue}, Vzone=${geschwindigkeitZone}, Vbr=${bridgeSpeedlimitValue})`;
        upsertRow(travelMap, key, actLabel, desc, variantIndex, val);
      }

      // --- Aggregat-Zeilen (Haupttabellen) ---
      if (actLabel === "Einbau") {
        gwpRawCalculationsE.push(num4(sumGWP));
        keaRawCalculationsE.push(num4(sumKEA));
        materialRowE.push(sumMaterialCostE);
        totalProcessRowE.push(processCostValue);
        accidentNumberE.push(num4(accidentImpactSum));
        travelTimeLossE.push(num4(trafficImpactSum));
      } else if (actLabel === "Abbruch") {
        gwpRawCalculationsA.push(num4(sumGWP));
        keaRawCalculationsA.push(num4(sumKEA));
        materialRowA.push(sumMaterialCostA);
        totalProcessRowA.push(processCostValue);
        accidentNumberA.push(num4(accidentImpactSum));
        travelTimeLossA.push(num4(trafficImpactSum));
      }
    }
  }


  // === NEU: Summenzeilen für GWP/KEA/Material/Unfälle/Reisezeitverlust ===
  const makeSumRow = (desc, rowE, rowA, decimals = null) => {
    const out = ["Gesamt", desc];
    for (let i = 0; i < massnahmeVariante.varianten.length; i++) {
      const val = Number(rowE[2 + i] ?? 0) + Number(rowA[2 + i] ?? 0);
      out.push(decimals != null ? Number(val.toFixed(decimals)) : Number(val.toFixed(4)));
    }
    return out;
  };

  const gwpRowGes = makeSumRow("Summe Einbau+Abbruch", gwpRawCalculationsE, gwpRawCalculationsA, 2);
  const keaRowGes = makeSumRow("Summe Einbau+Abbruch", keaRawCalculationsE, keaRawCalculationsA, 2);
  const materialRowGes = makeSumRow("Summe Einbau+Abbruch", materialRowE, materialRowA, 2);
  const processRowGes = makeSumRow("Summe Einbau+Abbruch", totalProcessRowE, totalProcessRowA, 2);
  const accidentRowGes = makeSumRow("Summe Einbau+Abbruch", accidentNumberE, accidentNumberA, 4);
  const travelRowGes = makeSumRow("Summe Einbau+Abbruch", travelTimeLossE, travelTimeLossA, 2);

  // Maps -> Arrays (4 Spalten)
  const gwpIntermediateRows = Array.from(gwpMap.values());
  const keaIntermediateRows = Array.from(keaMap.values());
  const materialIntermediateRows = Array.from(materialMap.values());
  const processIntermediateRows = Array.from(processMap.values());
  const accidentIntermediateRows = Array.from(accidentMap.values());
  const travelIntermediateRows = Array.from(travelMap.values());

  // --- GWP ---
  const gwpAbbruchRows = gwpIntermediateRows.filter(row => row[0] === "Abbruch");
  const gwpEinbauRows = gwpIntermediateRows.filter(row => row[0] === "Einbau");
  const gwpOtherRows = gwpIntermediateRows.filter(row => row[0] !== "Abbruch" && row[0] !== "Einbau");
  gwpIntermediateRows.length = 0;
  gwpIntermediateRows.push(...gwpAbbruchRows);
  gwpIntermediateRows.push(gwpRawCalculationsA); // Abbruch-Gesamt
  gwpIntermediateRows.push(...gwpEinbauRows);
  gwpIntermediateRows.push(gwpRawCalculationsE); // Einbau-Gesamt
  gwpIntermediateRows.push(...gwpOtherRows);

  // --- KEA ---
  const keaAbbruchRows = keaIntermediateRows.filter(row => row[0] === "Abbruch");
  const keaEinbauRows = keaIntermediateRows.filter(row => row[0] === "Einbau");
  const keaOtherRows = keaIntermediateRows.filter(row => row[0] !== "Abbruch" && row[0] !== "Einbau");
  keaIntermediateRows.length = 0;
  keaIntermediateRows.push(...keaAbbruchRows);
  keaIntermediateRows.push(keaRawCalculationsA);
  keaIntermediateRows.push(...keaEinbauRows);
  keaIntermediateRows.push(keaRawCalculationsE);
  keaIntermediateRows.push(...keaOtherRows);

  // --- Material ---
  const matAbbruchRows = materialIntermediateRows.filter(row => row[0] === "Abbruch");
  const matEinbauRows = materialIntermediateRows.filter(row => row[0] === "Einbau");
  const matOtherRows = materialIntermediateRows.filter(row => row[0] !== "Abbruch" && row[0] !== "Einbau");
  materialIntermediateRows.length = 0;
  materialIntermediateRows.push(...matAbbruchRows);
  materialIntermediateRows.push(materialRowA);
  materialIntermediateRows.push(...matEinbauRows);
  materialIntermediateRows.push(materialRowE);
  materialIntermediateRows.push(...matOtherRows);

  // --- Process ---
  const procAbbruchRows = processIntermediateRows.filter(row => row[0] === "Abbruch");
  const procEinbauRows = processIntermediateRows.filter(row => row[0] === "Einbau");
  const procOtherRows = processIntermediateRows.filter(row => row[0] !== "Abbruch" && row[0] !== "Einbau");
  processIntermediateRows.length = 0;
  processIntermediateRows.push(...procAbbruchRows);
  processIntermediateRows.push(totalProcessRowA);
  processIntermediateRows.push(...procEinbauRows);
  processIntermediateRows.push(totalProcessRowE);
  processIntermediateRows.push(...procOtherRows);
  //accidentIntermediateRows.push(accidentNumberA);
  //accidentIntermediateRows.push(accidentNumberE);
  //travelIntermediateRows.push(travelTimeLossA);
  //travelIntermediateRows.push(travelTimeLossE);


  // Ergebnisse
  const results = [
    {
      title: "GWP [kg CO2-Äquiv.]",
      data: [headerRow, gwpRowGes],
      intermediateData: gwpIntermediateRows,
      unit: "kg",
      type: "number"
    },
    {
      title: "KEA [MJ]",
      data: [headerRow, keaRowGes],
      intermediateData: keaIntermediateRows,
      unit: "MJ",
      type: "number"
    },
    {
      title: "Baustoffkosten [CHF]",
      data: [headerRow, materialRowGes],
      intermediateData: materialIntermediateRows,
      unit: "CHF",
      type: "currency"
    },
    {
      title: "Prozessbezogene Kosten [CHF]",
      data: [headerRow, processRowGes],
      intermediateData: processIntermediateRows,
      unit: "CHF",
      type: "currency"
    },
    {
      title: "Anzahl der Unfälle [-]",
      data: [headerRow, accidentRowGes],
      //intermediateData: [accidentIntermediateRows, accidentNumberE, accidentNumberA],
      intermediateData: accidentIntermediateRows,
      unit: "",
      type: "number"
    },
    {
      title: "Reisezeitverlust [h]",
      data: [headerRow, travelRowGes],
      //intermediateData: [travelIntermediateRows, travelTimeLossE, travelTimeLossA],
      intermediateData: travelIntermediateRows,
      unit: "h",
      type: "number"
    }
  ];

  return results;
}
