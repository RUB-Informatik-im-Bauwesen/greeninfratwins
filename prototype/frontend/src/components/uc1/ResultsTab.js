import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../../AppProvider";
import ResultsLineChart from "./ResultsLineChart";
import { fillTable } from "../../utils/uc1/DE/calculate";

const indicatorColors = {
  // Ökologische Qualität
  GWP:  "#4e79a7", // Blau
  EP:   "#f28e2b", // Orange
  ODP:  "#e15759", // Rot
  AP:   "#76b7b2", // Türkis
  POCP: "#59a14f", // Grün
  KEA:  "#edc949", // Gelb

  // Ökonomische Qualität
  PROC_COST: "#8c564b", // Braun
  EXT_COST:  "#7f7f7f", // Grau

  // Schutzgut Mensch
  NOISE:  "#d62728", // Signalrot
  HEALTH: "#9467bd", // Violett
};


const Results = () => {
  const { containerId, projectId, measure } = useContext(AppContext);
  const [tables, setTables]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

  useEffect(() => {
    let isActive = true; // verhindert setState nach Unmount
    async function loadTables() {
      if (!measure) return;
      setLoading(true);
      setError("");
      try {
        const t = await fillTable(measure, containerId, projectId, token);
        if (isActive) setTables(Array.isArray(t) ? t : []);
      } catch (e) {
        console.error("Results: fillTable failed", e);
        if (isActive) setError("Ergebnisse konnten nicht geladen werden.");
      } finally {
        if (isActive) setLoading(false);
      }
    }
    loadTables();
    return () => { isActive = false; };
  }, [measure, containerId, projectId, token]);

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

  return (
    <div className="tabContentUC1">
      <div className="leftColumnUC1">
        <h3 className="measure">
          Ergebnisse der Maßnahme „{measure?.name ?? ""}“ im Jahresverlauf
        </h3>

        
       
        {error && <div className="text-danger">{error}</div>}

        {!loading && !error && tables.length === 0 && (
          <div className="text-muted">Keine Aktivitäten/Ergebnisse vorhanden.</div>
        )}

        {!loading && !error && tables.length > 0 && (
          <ResultsLineChart
  tables={tables}
  indicatorColors={indicatorColors}
          />
        )}
      </div>
    </div>
  );
};

export default Results;
