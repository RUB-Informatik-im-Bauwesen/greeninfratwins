/**
 * Berechnet das Global Warming Potential (GWP) eines Bauteils auf Basis eines
 * zusammengefassten Lebenszykluswerts gemäß EPD (Environmental Product Declaration).
 *
 * Formel:
 * GWP = epd_quantity * GWPtotal_Lifecycle
 *
 * Parameter:
 * - epd_quantity: Einsatzmenge des Produkts gemäß EPD (z. B. in kg, m², m³)
 * - GWPtotal_Lifecycle: gesamtes GWP pro Einheit über den betrachteten Lebenszyklus
 *   (z. B. Summe aus Modulen A1–C4) in kg CO₂-Äquivalent pro Einheit
 *
 * Rückgabewert:
 * - Gesamtes GWP des Bauteils über den Lebenszyklus in kg CO₂-Äquivalent
 *
 * Hinweise:
 * - Diese vereinfachte Berechnung basiert auf einem vollständig aggregierten GWP-Wert,
 *   wie er in manchen EPDs als "GWP total lifecycle" oder "GWP total A1–C4" angegeben ist.
 * - Es findet keine Aufteilung oder zeitliche Skalierung (z. B. auf Nutzungsdauer) statt.
 *
 * Beispiel:
 * const gwp = calcGWP(120, 3.5); // → 420 kg CO₂-Äquivalent
 */

export function calcGWP(epd_quantity, GWPtotal_Lifecycle) {
  return epd_quantity * GWPtotal_Lifecycle;
}

/**
 * Berechnet den kumulierten Energieaufwand (KEA) eines Bauteils über den gesamten Lebenszyklus.
 *
 * Formel:
 * KEA = epd_quantity * (PERT_lifecycle + PENRT_lifecycle)
 *
 * Dabei wird der gesamte Primärenergiebedarf – erneuerbar (PERT) und nicht erneuerbar (PENRT) –
 * gemäß EPD-Daten über den betrachteten Lebenszyklus summiert.
 *
 * Parameter:
 * - epd_quantity: Einsatzmenge des Bauteils laut EPD (z. B. in kg, m², m³)
 * - PERT_lifecycle: Erneuerbare Primärenergie, kumuliert über den Lebenszyklus pro Einheit (z. B. MJ)
 * - PENRT_lifecycle: Nicht-erneuerbare Primärenergie, kumuliert über den Lebenszyklus pro Einheit (z. B. MJ)
 *
 * Rückgabewert:
 * - Kumulierte Energieaufwendung (KEA) in Megajoule (MJ) für die gegebene Menge des Bauteils
 *
 * Hinweise:
 * - Die Werte PERT und PENRT umfassen i. d. R. die Module A1–C4 und werden in EPDs als summierte Werte ausgewiesen.
 * - Diese vereinfachte Berechnung dient zur energetischen Bilanzierung von Bauwerksvarianten
 *   im Rahmen von Ökobilanzen oder Nachhaltigkeitsbewertungen.
 *
 * Beispiel:
 * const kea = calcKEA(50, 120, 380); // → 50 * (120 + 380) = 25.000 MJ
 */

export function calcKEA(epd_quantity, PERT_lifecycle, PENRT_lifecycle) {
  return epd_quantity * (PERT_lifecycle + PENRT_lifecycle);
}

/**
 * Berechnet die Materialkosten eines Bauteils oder Materials.
 *
 * Formel:
 * Materialkosten = epd_quantity * unitaryPrice
 *
 * Parameter:
 * - epd_quantity: Menge des Materials oder Bauteils (z. B. in kg, m², m³)
 * - unitaryPrice: Einheitspreis des Materials (z. B. in Euro pro kg, Euro pro m²)
 *
 * Rückgabewert:
 * - Gesamte Materialkosten (in derselben Währung wie der Einheitspreis, z. B. Euro)
 *
 * Beispiel:
 * const kosten = materialCost(500, 2.5); // → 1250 Euro
 */
export function calcMaterialCost(epd_quantity, unitary_price) {
  return epd_quantity * unitary_price;
}

/**
 * Berechnet eine sicherheitsbezogene Kennzahl für eine Bauaktivität.
 *
 * Die Formel berücksichtigt die Dauer der Aktivität sowie verschiedene Risikofaktoren:
 * - DTV: Durchschnittlicher Tagesverkehr (z. B. Fahrzeuge pro Tag)
 * - AUmV: Anzahl der ungeschützten motorisierten Verkehrsteilnehmer (pro 10.000 Fahrzeuge)
 * - AUoV: Anzahl der ungeschützten sonstigen Verkehrsteilnehmer (z. B. Fußgänger)
 *
 * Formel:
 * Sicherheitskennzahl = activity_duration * (DTV * AUmV / 10.000 + AUoV)
 *
 * Parameter:
 * - activity_duration: Dauer der Bauaktivität in Tagen
 * - DTV: Durchschnittlicher Tagesverkehr (Fahrzeuge pro Tag)
 * - AUmV: Anzahl ungeschützter motorisierter Verkehrsteilnehmer pro 10.000 Fahrzeuge
 * - AUoV: Anzahl ungeschützter sonstiger Verkehrsteilnehmer (z. B. Fußgänger) pro Tag
 *
 * Rückgabewert:
 * - Sicherheitskennzahl (dimensionslos oder entsprechend der Einheiten), 
 *   die als Maß für das Risiko oder die Belastung während der Aktivität dient
 *
 * Beispiel:
 * const safetyIndex = calcConstructionSafety(30, 20000, 300, 20);
 * // = 30 * (20000 * 300 / 10000 + 20) = 30 * (600 + 20) = 18600
 */

export function calcConstructionSafety(activity_duration, DTV, AUmV, AUoV) {
  return activity_duration * (DTV * AUmV/10000+AUoV);
}

/**
 * Berechnet den Zeitverlust der Verkehrsbelastung auf die Bauzeit oder Verkehrssicherheit,
 * unter Berücksichtigung der zulässigen Geschwindigkeiten in der Arbeitszone und auf der Brücke.
 *
 * Formel:
 * Ergebnis = DTV * activity_duration * 
 *           (workingzone_length / (1000 * zone_speedlimit) - workingzone_length / (1000 * bridge_speedlimit))
 *
 * Parameter:
 * - DTV: Durchschnittlicher Tagesverkehr (Fahrzeuge pro Tag)
 * - activity_duration: Dauer der Bauaktivität (in Tagen)
 * - workingzone_length: Länge des Arbeitsraums in Metern [m]
 * - zone_speedlimit: Zulässige Geschwindigkeit in der Arbeitszone (in km/h)
 * - bridge_speedlimit: Zulässige Geschwindigkeit auf der Brücke (in km/h)
 *
 * Rückgabewert:
 * - Berechneter Wert (Einheit abhängig von den Eingangsgrößen), der beispielsweise
 *   den Mehraufwand, Verzögerungen oder das Sicherheitsrisiko aufgrund der reduzierten
 *   Geschwindigkeit in der Arbeitszone im Vergleich zur Brücke beschreibt.
 *
 * Beispiel:
 * const result = calcTrafficImpact(20000, 10, 100, 30, 80);
 */

export function calcTrafficImpact(DTV, activity_duration, workingzone_length, zone_speedlimit, bridge_speedlimit) {
  return DTV * activity_duration * 
    (workingzone_length / (1000 * zone_speedlimit) - workingzone_length / (1000 * bridge_speedlimit));
}