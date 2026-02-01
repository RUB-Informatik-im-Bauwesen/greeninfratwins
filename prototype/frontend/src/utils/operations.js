 export function formatEuro(value) {
  // Versuche, den Wert in eine Zahl umzuwandeln
  const number = Number(value);

  // Fallback, falls der Wert nicht formatiert werden kann
  if (isNaN(number)) {
    return "0,00 €";
  }

  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(number);
}


export function formatCell(cell, unit, cellIndex, type) {
  let displayValue;

  // Prüfen ob Zahl oder String-Zahl
  //const parsed = typeof cell === "number" ? cell : parseFloat(cell);
  //const isNumeric = !isNaN(parsed);

  //Update for guid check when start from a number and not identified as number, Xuling, 2025-08-26
  // Only treat as numeric if cell is a number or a string that is a valid number (no letters)
  const isNumeric = typeof cell === "number" || (typeof cell === "string" && /^-?\d+(\.\d+)?$/.test(cell));
  const parsed = (!isNumeric) ? cell : parseFloat(cell);

  if (isNumeric) {
    if (type === "currency") {
      // Deutsche Formatierung, 2 Nachkommastellen
      displayValue = new Intl.NumberFormat("de-DE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(parsed);
    } else {
      // Standard: Punkt als Dezimaltrenner
      //displayValue = parsed.toFixed(4);
      displayValue = new Intl.NumberFormat("de-DE", {
        minimumFractionDigits: 4,
        maximumFractionDigits: 4,
      }).format(parsed);
    }
  } else if (Array.isArray(cell)) {
    displayValue = cell.join(", ");
  } else {
    displayValue = cell;
  }

  // Einheit nur anhängen, wenn vorhanden & nicht die erste Spalte
  if (unit && cellIndex > 1) {
    displayValue += ` ${unit}`;
  }

  return displayValue;
}