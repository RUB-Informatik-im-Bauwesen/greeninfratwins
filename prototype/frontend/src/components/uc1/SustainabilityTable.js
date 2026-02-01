import React from "react";

export default function SustainabilityTable({ tableJson }) {
  if (!tableJson) return null;

  const { table, data } = tableJson;

  // Hilfsfunktion: Format für Zahlen
  const fmt = (val, unit) => {
    if (val == null || val === "") return "–";
    const num = Number(val);
    if (isNaN(num)) return "–";
    return new Intl.NumberFormat("de-DE", { maximumFractionDigits: 2 }).format(num) + (unit ? ` ${unit}` : "");
  };

  // --- Spalten-Header vorbereiten ---
  const flatColumns = [];
  table.columns.forEach(col => {
    if (col.children) {
      col.children.forEach(child => {
        flatColumns.push(child);
      });
    } else {
      flatColumns.push(col);
    }
  });

  return (
      <div className="table-responsive w-100">
        <table className="table-sm align-middle w-100">
          <thead style={{ backgroundColor: "rgb(108, 140, 119)" }} className="text-white">
            {/* Erste Kopfzeile: Gruppierungen */}
            <tr>
              {table.columns.map((col, idx) => {
                if (col.children) {
                  return (
                    <th
                      key={idx}
                      colSpan={col.children.length}
                      className="text-center text-white"
                      style={{ backgroundColor: "rgb(108, 140, 119)" }}
                    >
                      {col.group}
                    </th>
                  );
                }
                return (
                  <th
                    key={idx}
                    rowSpan={2}
                    className="text-white text-center"
                    style={{ backgroundColor: "rgb(108, 140, 119)" }}
                  >
                    
                  </th>
                );
              })}
            </tr>

            {/* Zweite Kopfzeile: Codes */}
            <tr>
              {flatColumns
                .filter(c => c.code) // nur Indikator-Spalten
                .map((c, idx) => (
                  <th
                    key={idx}
                    className="text-center text-white"
                    style={{ backgroundColor: "rgb(108, 140, 119)" }}
                  >
                    {c.code}
                  </th>
                ))}
            </tr>

            {/* Dritte Kopfzeile: Labels */}
            <tr>
  {flatColumns.map((c, idx) => (
    <th
      key={idx}
      className={`text-white ${c.key === "name" ? "text-start" : "text-center"}`}
      style={{ backgroundColor: "rgb(108, 140, 119)" }}
    >
      {c.label}
    </th>
  ))}
</tr>
          </thead>

          <tbody>
            {Array.isArray(data.assets) && data.assets.length > 0 ? (
              data.assets.map((as) => (
                <tr key={as.id}>
                  {flatColumns.map((c, idx) => {
                    if (c.key === "name") return <td key={idx}>{as.name}</td>;
                    if (c.key === "duration_h") return <td key={idx} className="text-center">{fmt(as.duration_h, "h")}</td>;
                    if (c.key === "count") return <td key={idx} className="text-center">{as.count ?? "–"}</td>;
                    // Metrik
                    return <td key={idx} className="text-center">{fmt(as.metrics?.[c.key], c.unit)}</td>;
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={flatColumns.length} className="text-muted">Keine Assets vorhanden</td>
              </tr>
            )}
          </tbody>

          <tfoot>
            <tr className="fw-semibold" style={{ backgroundColor: "rgba(223, 237, 214, 0.5)" }}>
              {flatColumns.map((c, idx) => {
                if (idx === 0) return <td key={idx}>{data.totals.label}</td>;
                return <td key={idx} className="text-center">{fmt(data.totals.metrics[c.key], c.unit)}</td>;
              })}
            </tr>
          </tfoot>
        </table>
      </div>
  );
}


