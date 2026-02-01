import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

export default function ResultsAllIndicatorsUnifiedChart({
  tables = [],
  indicatorColors = {},    // z.B. { GWP:"#...", EP:"#...", PROC_COST:"#...", ... }
  smoothDefault = true
}) {
  const [smooth, setSmooth] = React.useState(smoothDefault);
  const [selectedKeys, setSelectedKeys] = React.useState(new Set()); // aktive Indikator-Keys

  // ---------- Spaltengruppen/Meta ----------
  const groups = React.useMemo(() => {
    const firstCols = tables?.find(t => t?.table?.columns)?.table?.columns ?? [];
    const findGroup = (g) => (firstCols.find(c => c.group === g)?.children ?? []);
    return {
      eco:   findGroup("Ökologische Qualität"),
      econ:  findGroup("Ökonomische Qualität"),
      social:findGroup("Schutzgut Mensch"),
    };
  }, [tables]);

  const seriesMeta = React.useMemo(() => {
    const map = new Map(); // key -> { key, code, label, unit, group }
    const add = (arr, groupName) => {
      arr.forEach(c => {
        map.set(c.key, {
          key: c.key,
          code: c.code,
          label: c.label || c.key,
          unit: c.unit || "",
          group: groupName
        });
      });
    };
    add(groups.eco, "Ökologische Qualität");
    add(groups.econ, "Ökonomische Qualität");
    add(groups.social, "Schutzgut Mensch");
    return map;
  }, [groups]);

  React.useEffect(() => {
    const all = new Set([...seriesMeta.keys()]);
    setSelectedKeys(all);
  }, [seriesMeta]);

  // ---------- Aggregation je Jahr ----------
  const chartData = React.useMemo(() => {
    const yearSet = new Set();
    const points = []; // [{ year, metrics }]
    for (const t of tables || []) {
      const dateStr = t?.context?.activity?.date;
      const year = dateStr ? new Date(dateStr).getFullYear() : null;
      if (year === null) continue;
      yearSet.add(year);
      points.push({ year, metrics: t?.data?.totals?.metrics || {} });
    }
    const years = Array.from(yearSet).sort((a, b) => a - b);
    return years.map(y => {
      const row = { year: y };
      seriesMeta.forEach((_meta, k) => {
        const sum = points.reduce((acc, p) => {
          if (p.year !== y) return acc;
          const v = Number(p.metrics?.[k]);
          return acc + (Number.isFinite(v) ? v : 0);
        }, 0);
        row[k] = sum;
      });
      return row;
    });
  }, [tables, seriesMeta]);

  // ---------- Farben ----------
  const paletteEco   = ["#4e79a7","#76b7b2","#59a14f","#edc949","#af7aa1","#bab0ab"];
  const paletteEcon  = ["#8c564b","#7f7f7f","#9c755f"];
  const paletteSoc   = ["#d62728","#9467bd","#ef4444","#7c3aed"];
  const colorByKey = React.useMemo(() => {
    const c = {};
    let iEco=0, iEcon=0, iSoc=0;
    seriesMeta.forEach(meta => {
      if (indicatorColors[meta.key]) {
        c[meta.key] = indicatorColors[meta.key];
      } else if (meta.group === "Ökologische Qualität") {
        c[meta.key] = paletteEco[iEco++ % paletteEco.length];
      } else if (meta.group === "Ökonomische Qualität") {
        c[meta.key] = paletteEcon[iEcon++ % paletteEcon.length];
      } else {
        c[meta.key] = paletteSoc[iSoc++ % paletteSoc.length];
      }
    });
    return c;
  }, [seriesMeta, indicatorColors]);

  // ---------- Achsen nach Einheit ----------
  const unitBuckets = React.useMemo(() => {
    const units = new Map(); // unit -> { unit, keys:[], side, index }
    let leftCount = 0, rightCount = 0;
    const pickSide = () => (leftCount <= rightCount ? (leftCount++, "left") : (rightCount++, "right"));
    seriesMeta.forEach(meta => {
      const u = meta.unit || "";
      if (!units.has(u)) units.set(u, { unit: u, keys: [], side: pickSide() });
      units.get(u).keys.push(meta.key);
    });
    return Array.from(units.values());
  }, [seriesMeta]);

  // ---------- Utils ----------
  const numberFmt = (v) =>
    new Intl.NumberFormat("de-DE", { maximumFractionDigits: 2 }).format(Number(v ?? 0));

  const toggleKey = (k) => {
    setSelectedKeys(prev => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k); else next.add(k);
      return next;
    });
  };
  const setGroup = (groupName, enable) => {
    setSelectedKeys(prev => {
      const next = new Set(prev);
      seriesMeta.forEach(meta => {
        if (meta.group === groupName) {
          if (enable) next.add(meta.key); else next.delete(meta.key);
        }
      });
      return next;
    });
  };
  const selectAll = () => setSelectedKeys(new Set([...seriesMeta.keys()]));
  const selectNone = () => setSelectedKeys(new Set());

  // ---------- CSV-Export der Tabelle ----------
  const exportCSV = () => {
    const activeKeys = [...selectedKeys];
    const header = ["Jahr", ...activeKeys.map(k => {
      const m = seriesMeta.get(k);
      return m?.unit ? `${m?.label} [${m?.unit}]` : (m?.label || k);
    })];
    const rows = chartData.map(r => {
      const vals = activeKeys.map(k => String(Number.isFinite(r[k]) ? r[k] : 0));
      return [String(r.year), ...vals];
    });
    const csv = [header, ...rows].map(arr => arr.map(x => `"${x.replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "indikatoren_uebersicht.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // ---------- Guards ----------
  if (seriesMeta.size === 0) {
    return <div className="text-muted">Keine Indikatoren gefunden.</div>;
  }

  // ---------- Render ----------
  return (
    <div className="card shadow-sm">
      <div className="card-body">
        {/* Controls */}
        <div className="d-flex flex-wrap gap-2 align-items-center mb-3">
          <div className="btn-group btn-group-sm" role="group">
            <button type="button" className="btn btn-outline-secondary" onClick={selectAll}>Alle</button>
            <button type="button" className="btn btn-outline-secondary" onClick={selectNone}>Keine</button>
          </div>

          <div className="btn-group btn-group-sm ms-2" role="group" aria-label="Eco">
            <button type="button" className="btn btn-outline-success" onClick={() => setGroup("Ökologische Qualität", true)}>Ökologie an</button>
            <button type="button" className="btn btn-outline-secondary" onClick={() => setGroup("Ökologische Qualität", false)}>Ökologie aus</button>
          </div>
          <div className="btn-group btn-group-sm" role="group" aria-label="Econ">
            <button type="button" className="btn btn-outline-primary" onClick={() => setGroup("Ökonomische Qualität", true)}>Ökonomie an</button>
            <button type="button" className="btn btn-outline-secondary" onClick={() => setGroup("Ökonomische Qualität", false)}>Ökonomie aus</button>
          </div>
          <div className="btn-group btn-group-sm" role="group" aria-label="Social">
            <button type="button" className="btn btn-outline-danger" onClick={() => setGroup("Schutzgut Mensch", true)}>Mensch an</button>
            <button type="button" className="btn btn-outline-secondary" onClick={() => setGroup("Schutzgut Mensch", false)}>Mensch aus</button>
          </div>

          <div className="form-check form-switch ms-auto">
            <input
              className="form-check-input"
              type="checkbox"
              id="smoothSwitchAll"
              checked={smooth}
              onChange={(e) => setSmooth(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="smoothSwitchAll">
              Kurven glätten
            </label>
          </div>
        </div>

        {/* Einzel-Checkboxen */}
        <div className="mb-2 d-flex flex-wrap gap-3">
          {[...seriesMeta.values()].map(meta => {
            const name = meta.unit ? `${meta.label} [${meta.unit}]` : meta.label;
            return (
              <label key={meta.key} className="form-check d-flex align-items-center gap-2">
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={selectedKeys.has(meta.key)}
                  onChange={() => toggleKey(meta.key)}
                />
                <span style={{ borderBottom: `3px solid ${indicatorColors[meta.key] || "#666"}` }}>
                  {name}
                  <small className="text-muted ms-1">({meta.group})</small>
                </span>
              </label>
            );
          })}
        </div>

        {/* Chart */}
        <div style={{ width: "100%", height: 440 }}>
          <ResponsiveContainer>
            <LineChart data={chartData} margin={{ top: 16, right: 24, left: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" label={{ value: "Jahr", position: "insideBottomRight", offset: -4 }} />

              {/* dynamische Y-Achsen nach Einheit */}
              {unitBuckets.map((bucket, idx) => (
                <YAxis
                  key={bucket.unit || `unit-${idx}`}
                  yAxisId={bucket.unit || `unit-${idx}`}
                  orientation={bucket.side}
                  tickFormatter={numberFmt}
                  label={{
                    value: bucket.unit ? `[${bucket.unit}]` : "Einheitlos",
                    angle: -90,
                    position: bucket.side === "left" ? "insideLeft" : "insideRight"
                  }}
                />
              ))}

              <Tooltip
                formatter={(val, key) => {
                  const meta = seriesMeta.get(key) || {};
                  const name = meta.unit ? `${meta.label} [${meta.unit}]` : (meta?.label || key);
                  return [numberFmt(val), name];
                }}
              />
              <Legend />

              {[...seriesMeta.values()].map(meta => {
                if (!selectedKeys.has(meta.key)) return null;
                const yAxisId = unitBuckets.find(b => b.unit === meta.unit)?.unit || unitBuckets[0]?.unit || "default";
                return (
                  <Line
                    key={meta.key}
                    type={smooth ? "monotone" : "linear"}
                    dataKey={meta.key}
                    name={meta.unit ? `${meta.label} [${meta.unit}]` : meta.label}
                    stroke={indicatorColors[meta.key] || "#666"}
                    strokeWidth={2}
                    dot={false}
                    connectNulls
                    isAnimationActive={false}
                    yAxisId={yAxisId}
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* --- Übersichtstabelle --- */}
        <div className="d-flex align-items-center justify-content-between mt-3 mb-2">
          <h6 className="mb-0">Übersicht (aggregiert pro Jahr)</h6>
          <button type="button" className="btn btn-sm btn-outline-secondary" onClick={exportCSV}>
            CSV exportieren
          </button>
        </div>

        <div className="table-responsive">
          <table className="table table-sm table-striped align-middle">
            <thead className="table-light">
              <tr>
                <th style={{ position: "sticky", left: 0, background: "var(--bs-body-bg)" }}>Jahr</th>
                {[...selectedKeys].map(k => {
                  const m = seriesMeta.get(k);
                  const label = m?.unit ? `${m?.label} [${m?.unit}]` : (m?.label || k);
                  return (
                    <th key={`h-${k}`} title={m?.group}>
                      <span style={{ borderBottom: `3px solid ${indicatorColors[k] || "#666"}` }}>
                        {label}
                      </span>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {chartData.map(row => (
                <tr key={`r-${row.year}`}>
                  <td style={{ position: "sticky", left: 0, background: "var(--bs-body-bg)" }}>{row.year}</td>
                  {[...selectedKeys].map(k => (
                    <td key={`c-${row.year}-${k}`}>{numberFmt(row[k])}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="small text-muted">
          Die Tabelle folgt der aktuellen Auswahl (Checkboxen). Werte sind Jahres-Summen über alle Aktivitäten.
        </div>
      </div>
    </div>
  );
}
