import DefinitionPage from "../pages/DefinitionPage";

const getRandomValue = () => Math.floor(Math.random() * 100) + 1; // Zufallszahl zwischen 1 und 10

// Werte für die Berechnungen
const values = {
  a: getRandomValue(),
  b: getRandomValue(),
  c: 0,
  d: 0,
};

export const startCalculation = () => {
  return new Promise((resolve, reject) => {
    // Berechnungen simuliert verzögert durchführen
    setTimeout(() => {
      try {
        let panel1Calculated = false; 
        let panel2Calculated = false;
        let panel3Calculated = false;
        let panel4Calculated = false;

        // Berechnung der Panels aufrufen
        const resultPanel1 = calculatePanel1(values);
        const resultPanel2 = calculatePanel2(values);
        const resultPanel3 = calculatePanel3(values);
        const resultPanel4 = calculatePanel4(values);
 
        console.log('Berechnungen abgeschlossen:', resultPanel1, resultPanel2, resultPanel3, resultPanel4);
        // Prüfen, ob die Panels erfolgreich berechnet wurden
        if (resultPanel1 !== null) {
          panel1Calculated = true;
        }

        if (resultPanel2 !== null) {
          panel2Calculated = true;
        }

        if (resultPanel3 !== null) {
          panel3Calculated = true;
        }

        if (resultPanel4 !== null) {
          panel4Calculated = true;
        }

        // Ergebnis-Objekt zurückgeben
        const result ={
          panel1: resultPanel1, // Berechnungsergebnis von Panel 1
          panel2: resultPanel2, // Berechnungsergebnis von Panel 2
          panel3: resultPanel3, // Berechnungsergebnis von Panel 3
          panel4: resultPanel4  // Berechnungsergebnis von Panel 4
        };
        console.log('Finales Ergebnis:', result);
        resolve(result); 
      } catch (error) {
        console.error('Fehler bei der Berechnung:', error);
        reject(error);
      }
    }, 2000); // Berechnung nach 2 Sekunden simuliert abschließen
  });
};

// Simulierte Berechnung für Panel 1 (z.B. Addition)
const calculatePanel1 = (values) => {
  try {
    return values.a + values.b; // Beispiel: Addition
  } catch (error) {
    console.error('Fehler bei der Berechnung von Panel 1:', error);
    return null; // Falls ein Fehler auftritt, wird null zurückgegeben
  }
};

// Simulierte Berechnung für Panel 2 (z.B. Multiplikation)
const calculatePanel2 = (values) => {
  try {
    return values.a * values.b * values.a; // Beispiel: Multiplikation
  } catch (error) {
    console.error('Fehler bei der Berechnung von Panel 2:', error);
    return null; // Falls ein Fehler auftritt, wird null zurückgegeben
  }
};

/*Simulierte Berechnung für Panel 3 (z.B. Subtraktion)*/
const calculatePanel3 = (values) => {
  try {
    if (values.c !== 0) {
      return values.b - values.c; // Beispiel: Subtraktion
    }
    return null; // Wenn keine gültigen Werte für die Berechnung vorliegen
  } catch (error) {
    console.error('Fehler bei der Berechnung von Panel 3:', error);
    return null;
  }
};

// Simulierte Berechnung für Panel 4 (z.B. Division)
const calculatePanel4 = (values) => {
  try {
    if (values.c !== 0) {
      return values.a / values.c; // Beispiel: Division, c darf nicht 0 sein
    }
    return null; // Wenn keine gültigen Werte für die Berechnung vorliegen
  } catch (error) {
    console.error('Fehler bei der Berechnung von Panel 4:', error);
    return null;
  }
};
