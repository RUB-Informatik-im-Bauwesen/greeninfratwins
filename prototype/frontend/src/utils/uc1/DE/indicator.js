/**
 * Berechnet das globale Erwärmungspotential (GWP) für Bauaktivitäten gemäß Modul D1.
 * 
 * Formel:
 * GWP = GWP_Faktor * Aktivität_Dauer * (Betriebsmittel_Verbrauch / EPD_bezogene_Menge) / Zeiteinheit
 * 
 * Parameter:
 * - GWP_Faktor: Emissionsfaktor der Betriebsmittel (z.B. 2.68 kg CO₂-Äquiv./L Diesel)
 * - Aktivität_Dauer: Dauer der Bauaktivität in Stunden (h) oder Tagen (d)
 * - Betriebsmittel_Verbrauch: Gesamtverbrauch an Ressourcen (z.B. Liter Diesel, kWh Strom)
 * - EPD_bezogene_Menge: Bezugsmenge der Bauleistung (z.B. 20 m³ Beton, 50 t Stahl)
 * - Zeiteinheit: Bezugszeiteinheit (1 = pro Stunde, 24 = pro Tag)
 * 
 * Rückgabewert:
 * - GWP pro Einheit der Bauleistung in kg CO₂-Äquivalent (z.B. kg CO₂/m³)
 * 
 * Hinweise:
 * - Diese Formel verteilt die Emissionen von Baustellenaktivitäten (z.B. Baggerbetrieb) auf die ausgeführte Bauleistung.
 * - Die EPD_bezogene_Menge muss mit der funktionalen Einheit der EPD übereinstimmen.
 * 
 * Beispiel:
 * const gwpD1 = calcGWPD1(2.68, 10, 50, 20, 1); // → 67 kg CO₂/m³
 * (Rechnung: 2.68 * 10 * (50/20) / 1 = 67)
 */
export function calcGWP(GWP_Faktor, Aktivität_Dauer, Betriebsmittel_Verbrauch, EPD_bezogene_Menge, Zeiteinheit) {
  return GWP_Faktor * Aktivität_Dauer * (Betriebsmittel_Verbrauch / EPD_bezogene_Menge) / Zeiteinheit;
}

/**
 * Berechnet das Eutrophierungspotential (EP) für Bauaktivitäten (D1).
 * Formel: 
 * EP = EP_Faktor * Dauer * (Ressourcenverbrauch / EPD_Menge) / Zeiteinheit
 * 
 * Parameter:
 * - EP_Faktor: EP-Faktor der Ressource (z.B. 0.0003 kg PO₄³⁻-Äquiv./kWh Strom)
 * - Dauer: Aktivitätsdauer (h oder d)
 * - Ressourcenverbrauch: Verbrauchte Menge (z.B. kWh, L)
 * - EPD_Menge: Bezugsmenge der Bauleistung (z.B. 100 m²)
 * - Zeiteinheit: 1 (h) oder 24 (d)
 * 
 * Rückgabewert: EP in kg PO₄³⁻-Äquiv./Bezugseinheit
 * Beispiel: 
 * const ep = calcEPD1(0.0003, 8, 40, 100, 1); // → 0.00096 kg PO₄³⁻/m²
 */
export function calcEP(EP_Faktor, Dauer, Ressourcenverbrauch, EPD_Menge, Zeiteinheit) {
  return EP_Faktor * Dauer * (Ressourcenverbrauch / EPD_Menge) / Zeiteinheit;
}

/**
 * Berechnet das Ozonschichtabbaupotential (ODP) für Bauaktivitäten (D1).
 * Formel: 
 * ODP = ODP_Faktor * Dauer * (Kältemittelverlust / EPD_Menge) / Zeiteinheit
 * 
 * Parameter:
 * - ODP_Faktor: ODP-Faktor (z.B. 0.02 kg R11-Äquiv./kg Kältemittel)
 * - Dauer: Nutzungsdauer der Anlage (Jahre)
 * - Kältemittelverlust: Jährlicher Leckageverlust (kg/Jahr)
 * - EPD_Menge: Bezugsmenge (z.B. 500 m Gebäudelänge)
 * - Zeiteinheit: 1 (pro Jahr)
 * 
 * Rückgabewert: ODP in kg R11-Äquiv./Bezugseinheit
 * Beispiel: 
 * const odp = calcODPD1(0.02, 1, 0.5, 500, 1); // → 0.00002 kg R11/m
 */
export function calcODP(ODP_Faktor, Dauer, Kältemittelverlust, EPD_Menge, Zeiteinheit) {
  return ODP_Faktor * Dauer * (Kältemittelverlust / EPD_Menge) / Zeiteinheit;
}

/**
 * Berechnet das Versauerungspotential (AP) für Bauaktivitäten (D1).
 * Formel: 
 * AP = AP_Faktor * Dauer * (Schadstoffemission / EPD_Menge) / Zeiteinheit
 * 
 * Parameter:
 * - AP_Faktor: AP-Faktor (z.B. 0.01 kg SO₂-Äquiv./L Diesel)
 * - Dauer: Betriebsstunden (h)
 * - Schadstoffemission: Emission (z.B. Schwefeldioxid in kg)
 * - EPD_Menge: Bezugsmenge (z.B. 50 t verbauter Stahl)
 * - Zeiteinheit: 1 (h)
 * 
 * Rückgabewert: AP in kg SO₂-Äquiv./Bezugseinheit
 * Beispiel: 
 * const ap = calcAPD1(0.01, 100, 5, 50, 1); // → 0.1 kg SO₂/t
 */
export function calcAP(AP_Faktor, Dauer, Schadstoffemission, EPD_Menge, Zeiteinheit) {
  return AP_Faktor * Dauer * (Schadstoffemission / EPD_Menge) / Zeiteinheit;
}

/**
 * Berechnet das photochemische Ozonbildungspotential (POCP) für Bauaktivitäten (D1).
 * Formel: 
 * POCP = POCP_Faktor * Dauer * (Lösemittelemission / EPD_Menge) / Zeiteinheit
 * 
 * Parameter:
 * - POCP_Faktor: POCP-Faktor (z.B. 0.12 kg C₂H₄-Äquiv./kg Lösemittel)
 * - Dauer: Aktivitätsdauer (d)
 * - Lösemittelemission: Tägliche Emission (kg/d)
 * - EPD_Menge: Bezugsmenge (z.B. 200 m² Fassade)
 * - Zeiteinheit: 24 (d)
 * 
 * Rückgabewert: POCP in kg C₂H₄-Äquiv./Bezugseinheit
 * Beispiel: 
 * const pocp = calcPOCPD1(0.12, 5, 2, 200, 24); // → 0.0025 kg C₂H₄/m²
 */
export function calcPOCP(POCP_Faktor, Dauer, Lösemittelemission, EPD_Menge, Zeiteinheit) {
  return POCP_Faktor * Dauer * (Lösemittelemission / EPD_Menge) / Zeiteinheit;
}

/**
 * Berechnet den kumulierten Energieaufwand (KEA) für Bauaktivitäten (D1).
 * Formel: 
 * KEA = (PERT + PENRT) * Dauer * (Energieverbrauch / EPD_Menge) / Zeiteinheit
 * 
 * Parameter:
 * - PERT: Erneuerbare Primärenergie (MJ/Einheit)
 * - PENRT: Nicht-erneuerbare Primärenergie (MJ/Einheit)
 * - Dauer: Betriebsdauer (h)
 * - Energieverbrauch: Gesamtenergie (kWh)
 * - EPD_Menge: Bezugsmenge (z.B. 30 Stück Bauteile)
 * - Zeiteinheit: 1 (h)
 * 
 * Rückgabewert: KEA in MJ/Bezugseinheit
 * Beispiel: 
 * const kea = calcKEAD1(50, 150, 10, 300, 30, 1); // → 666.67 MJ/Stück
 */
export function calcKEA(PERT, PENRT, Dauer, Energieverbrauch, EPD_Menge, Zeiteinheit) {
  return (PERT + PENRT) * Dauer * (Energieverbrauch / EPD_Menge) / Zeiteinheit;
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

