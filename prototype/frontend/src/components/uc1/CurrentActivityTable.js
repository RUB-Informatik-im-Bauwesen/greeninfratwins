import React from "react";
import SustainabilityTable from "./SustainabilityTable";
import SustainabilityIndicatorChart from "./SustainabilityIndicatorChart";
import { generateTablesFromMeasure, fillTable } from "../../utils/uc1/DE/calculate";

/**
 * Rendert genau eine Tabelle & Diagramm: die der aktuell ausgewählten Activity.
 * @param {object} props.measure          Ihr Measure-JSON (Input)
 * @param {string} props.activityUrl      Die URI/URL der aktuell aktiven Activity
 * @param {string} [props.containerId]    optional für Totals
 * @param {string} [props.projectId]      optional für Totals
 * @param {string} [props.token]          optional für Totals
 * @param {boolean} [props.fillTotals]    wenn true, lädt PROC/EXT per SPARQL nach
 */
export default function CurrentActivityTable({
  measure,
  activityUrl,
  containerId,
  projectId,
  token,
  fillTotals = true
}) {
  const [tableJson, setTableJson] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    if (!measure || !activityUrl) return;
    let cancelled = false;

    async function build() {
      try {
        setLoading(true);
        setError(null);

        // 1) Tabellen-Modelle erzeugen (für alle Activities)
        const tables = generateTablesFromMeasure(measure);

        // 2) gewünschte Activity finden
        const one =
          tables.find((t) => t?.context?.activity?.uri === activityUrl) ||
          tables[0] || null;

        if (!one) {
          if (!cancelled) {
            setError("Keine passende Aktivität gefunden.");
            setTableJson(null);
            setLoading(false);
          }
          return;
        }

        // 3) Optional: Totals befüllen
        let result = one;
        if (fillTotals && containerId && projectId && token) {
          // nur diese eine Tabelle anreichern:
          const perMeasure = {
            ...measure,
            activity: measure.activity.filter((a) => a.url === activityUrl),
          };
          const enriched = await fillTable(perMeasure, containerId, projectId, token);
          result = enriched?.[0] ?? one;
          console.log(result);
        }

        if (!cancelled) {
          setTableJson(result);
          setLoading(false);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e?.message || String(e));
          setLoading(false);
        }
      }
    }

    build();
    return () => {
      cancelled = true;
    };
  }, [measure, activityUrl, containerId, projectId, token, fillTotals]);

  if (!activityUrl)
    return <div className="text-muted">Keine Aktivität ausgewählt.</div>;
  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(255,255,255,0.8)",
          zIndex: 2000,
        }}
      >
        <div className="text-center">
          <div
            className="spinner-border text-success"
            style={{ width: "3rem", height: "3rem" }}
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
          <div className="mt-3 fw-semibold">Ergebnisse werden berechnet…</div>
        </div>
      </div>
    );
  }
  if (error) return <div className="text-danger">Fehler: {error}</div>;
  if (!tableJson) return <div className="text-muted">Keine Daten.</div>;

  return (
    <div className="d-flex flex-column gap-4">
      <SustainabilityTable tableJson={tableJson} />

      {/* Neue Komponente: Diagramm zu den Ökobilanzdaten */}
      <SustainabilityIndicatorChart
        tableJson={tableJson}
        defaultIndicator="GWP"
        defaultWeighted={true}
      />
    </div>
  );
}
