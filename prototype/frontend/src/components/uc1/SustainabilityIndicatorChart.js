import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from "recharts";

export default function SustainabilityIndicatorChart({
  tableJson,
  defaultIndicator = "GWP",
  defaultWeighted = true
}) {
  // 0) sichere Defaults, damit Hooks nie konditional werden
  const safeTable = tableJson?.table ?? { columns: [], title: "" };
  const safeData  = tableJson?.data  ?? { assets: [], totals: { metrics: {} } };

  const [indicatorKey, setIndicatorKey] = React.useState(defaultIndicator);
  const [weighted, setWeighted] = React.useState(defaultWeighted);

  // ganz oben in der Komponente oder in einer separaten Datei
const indicatorColors = {
  GWP: "#4e79a7",   // blau
  EP: "#f28e2b",    // orange
  ODP: "#e15759",   // rot
  AP: "#76b7b2",    // türkis
  POCP: "#59a14f",  // grün
  KEA: "#edc949"    // gelb
};


  // 1) Öko-Spaltengruppe sichern
  const ecoColumns = React.useMemo(() => {
    const group = (safeTable.columns || []).find(c => c.group === "Ökologische Qualität");
    return group?.children || [];
  }, [safeTable.columns]);

  // 2) Optionen für Select
  const indicatorOptions = React.useMemo(() => {
    return ecoColumns.map(c => ({
      key: c.key,
      label: `${c.code ?? ""} ${c.label ?? ""}`.trim(),
      unit: c.unit || ""
    }));
  }, [ecoColumns]);

  // 3) aktuell gewählte Spalte
  const currentCol = React.useMemo(() => {
    return ecoColumns.find(c => c.key === indicatorKey) || ecoColumns[0] || null;
  }, [ecoColumns, indicatorKey]);

  // 4) Daten für Chart
  const chartData = React.useMemo(() => {
    if (!currentCol) return [];
    const rows = (safeData.assets || []).map(a => {
      const base = Number(a?.metrics?.[currentCol.key]);
      const baseVal = Number.isFinite(base) ? base : 0;
      const w = (Number(a?.duration_h) || 0) * (Number(a?.count) || 1);
      return {
        asset: a.name || a.id || "Asset",
        value: weighted ? baseVal * w : baseVal,
        duration_h: a.duration_h ?? null,
        count: a.count ?? 1
      };
    });
    return rows;
  }, [safeData.assets, currentCol, weighted]);

  // 5) Formatter & Achsentext
  const numberFmt = (v) =>
    new Intl.NumberFormat("de-DE", { maximumFractionDigits: 2 }).format(Number(v || 0));

  const yAxisLabel = React.useMemo(() => {
    if (!currentCol) return "";
    const unit = currentCol.unit ? ` [${currentCol.unit}]` : "";
    // Optional: bei gewichteter Anzeige Einheit erweitern (z. B. ·h)
    return weighted
      ? `${currentCol.label}${unit ? unit + "·h" : ""}`
      : `${currentCol.label}${unit}`;
  }, [currentCol, weighted]);

  // 6) Rendering – jetzt erst entscheiden, was gezeigt wird
  const noEco = indicatorOptions.length === 0;
  if (noEco) {
    return <div className="text-muted">Keine Öko-Indikatoren gefunden.</div>;
  }

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <div className="d-flex flex-wrap gap-3 align-items-end mb-3">
          <div>
            <label className="form-label mb-1">Indikator</label>
            <select
              className="form-select form-select-sm"
              value={indicatorKey}
              onChange={(e) => setIndicatorKey(e.target.value)}
            >
              {indicatorOptions.map(opt => (
                <option key={opt.key} value={opt.key}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="form-check form-switch ms-auto">
            <input
              className="form-check-input"
              type="checkbox"
              id="weightedSwitch"
              checked={weighted}
              onChange={(e) => setWeighted(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="weightedSwitch">
              Gewichtung nach Einsatzdauer × Anzahl
            </label>
          </div>
        </div>

        <div style={{ width: "100%", height: 340 }}>
          <ResponsiveContainer>
            <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="asset"
                angle={-20}
                textAnchor="end"
                interval={0}
                height={50}
              />
              <YAxis
                tickFormatter={numberFmt}
                label={{
                  value: yAxisLabel,
                  angle: -90,
                  position: "insideLeft",
                  offset: 10
                }}
              />
              <Tooltip
                formatter={(value) => numberFmt(value)}
                labelFormatter={(label) => `Asset: ${label}`}
              />
              <Legend />
              <Bar dataKey="value" name={currentCol?.label || "Wert"}  fill={indicatorColors[indicatorKey] || "#8884d8"} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="small text-muted mt-2">
          {weighted
            ? "Anzeige: Wert je Asset, gewichtet mit (Einsatzdauer [h] × Anzahl)."
            : "Anzeige: Wert je Asset (ungewichtet)."}
        </div>
      </div>
    </div>
  );
}
