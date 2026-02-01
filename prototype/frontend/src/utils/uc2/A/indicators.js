import {formatEuro} from "../../operations"
/**
 * Berechnet das Global Warming Potential (GWP) für ein einzelnes Bauteil.
 *
 * Formel:
 * GWP = epd_quantity * GWPtotal_A1_3 * lifespan_bridge / lifespan_element
 *
 * Verwendung:
 * - epd_quantity: Materialmenge laut EPD (z. B. kg)
 * - GWPtotal_A1_3: gesamtes Treibhauspotential (z. B. kg CO₂-Äq.) pro Einheit aus der EPD (Module A1-A3)
 * - lifespan_bridge: Lebensdauer des Gesamtbauwerks (z. B. Brücke) in Jahren
 * - lifespan_element: Referenzlebensdauer des Elements laut EPD in Jahren
 *
 * Beispiel: Für eine Brückenvariante berechnet man GWP für jedes Element
 * einzeln mit dieser Funktion und summiert die Einzelwerte anschließend.
 */
export function calcGWP(epd_quantity, GWPtotal_A1_3, lifespan_bridge, lifespan_element ) {
  return epd_quantity * GWPtotal_A1_3 * lifespan_bridge / lifespan_element;
}

/**
 * Berechnet das gesamte Global Warming Potential (GWP) einer Bauteil-Variante.
 *
 * Die Funktion iteriert über alle Elemente einer Variante und summiert das individuelle
 * GWP jedes Elements. Dabei wird die gleiche Berechnungsformel wie in `calcGWP` verwendet:
 *
 * GWP = epd_quantity * GWPtotal_A1_3 * (lifespan / nutzungsdauerElement)
 *
 * Parameter:
 * - elements: Array von Objekten mit den Eigenschaften:
 *   - epd_quantity: Materialmenge laut EPD (z. B. kg)
 *   - GWPtotal_A1_3: GWP-Wert pro Einheit laut EPD
 *   - lifespan: Lebensdauer des Gesamtbauwerks (z. B. in Jahren)
 *   - nutzungsdauerElement: Nutzungsdauer des Bauteils (z. B. laut EPD)
 *
 * Rückgabewert:
 * - Gesamt-GWP-Wert (Summe aller Einzelelemente)
 *
 * Beispielobjekt:
 * const elements = [
 *   { epd_quantity: 100, GWPtotal_A1_3: 1.5, lifespan_bridge: 100, lifespan_element: 50 },
 *   { epd_quantity: 200, GWPtotal_A1_3: 2.0, lifespan_bridge: 100, lifespan_element: 100 }
 * ];
 *
 * const totalGWP = calcTotalGWP(elements);
 */
export function calcTotalGWP(elements) {
  const total = elements.reduce((sum, el) => {
    return sum + calcGWP(el.epd_quantity, el.GWPtotal_A1_3, el.lifespan_bridge, el.lifespan_element);
  }, 0);

  // auf zwei Nachkommastellen runden
  return Math.round(total * 100) / 100;
}


/**
 * Berechnet die prozessbezogenen Lebenszykluskosten (z. B. in Euro) einer Bauteil-Variante.
 *
 * Die Funktion summiert:
 * - die Betriebskosten (z. B. Wartung, Energie, Reinigung über die Lebensdauer)
 * - die Austauschkosten (z. B. Ersatz von Bauteilen bei Erreichen ihrer Nutzungsdauer)
 *
 * Parameter:
 * - operatingCosts: Betriebskosten der Variante über die gesamte Lebensdauer (z. B. in €)
 * - replacementCosts: Austauschkosten der Variante über die gesamte Lebensdauer (z. B. in €)
 *
 * Rückgabewert:
 * - Gesamtprozesskosten der Variante (Betrieb + Austausch) in derselben Einheit wie Eingabe (z. B. Euro)
 *
 * Beispiel:
 * const processCosts = calcProcessCosts(120000, 45000); // → 165000 €
 */
export function calcProcessCosts(operatingCosts, replacementCosts ) {
  return operatingCosts + replacementCosts;
}
