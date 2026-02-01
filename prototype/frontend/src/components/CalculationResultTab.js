import React, { useEffect, useContext, useState } from "react";
import { AppContext } from "../AppProvider";
import calculationTables from "../calculationTables.json";
import { buildIndicatorTableResults_2_AT } from "../utils/uc2/A/calculate";
import { buildIndicatorTableResults_3_AT } from "../utils/uc3/A/calculate"; // 2025-07-31
import { buildIndicatorTableResults_2_CH } from "../utils/uc2/CH/calculate"; // 2025-08-01
import { formatCell } from "../utils/operations"

import { buildIndicatorTableResults_4_DE } from "../utils/uc4/DE/calculate"; // 2025-08-20
import {
  BarChart, Bar,
  XAxis, YAxis,
  Tooltip, Legend,
  PieChart, Pie, Cell,
  RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, CartesianGrid
} from 'recharts';

const CalculationResultTab = (props) => {
  const { indicatorTables, setIndicatorTables, massnahmeVariante, sumIndicatorRadar, setSumIndicatorRadar } = useContext(AppContext);
  const [expandedTables, setExpandedTables] = useState({});
  const showOnlyPieAndBar =
    props.countryCode === "DE" && props.awfNr !== "AWF1";// new added for AWF4, 2025-08-26
  const MATERIAL_COLORS = ['#FC8D62', '#A6CEE3', '#FFBB28', '#00C49F', '#0088FE'];// new added for AWF4, 2025-08-26
  const BAR_COLOR = 'rgb(223, 237, 214)'; // A distinct purple not in PIE_COLORS

  const toggleExpand = (index) => {
    setExpandedTables((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };
  useEffect(() => {
    setIndicatorTables([]);
  }, []);

  

const [stackedData, setStackedData] = useState([]);
const [allProperties, setAllProperties] = useState([]);
const [restwertChartData, setRestwertChartData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      if (props.countryCode === "AT") {
        if (props.awfNr === "AWF2") {
          const results = await buildIndicatorTableResults_2_AT(props.container, props.project, props.bearer, massnahmeVariante);
          setIndicatorTables(Object.values(results).flat());
        } else if (props.awfNr === "AWF3") {
          //New added , 2027-07-31
          const results_at3 = await buildIndicatorTableResults_3_AT(props.container, props.project, props.bearer, massnahmeVariante);
          setIndicatorTables(Object.values(results_at3).flat());
        }
      }
      else if (props.countryCode === "CH" && props.awfNr === "AWF2") {
        //New added , 2027-08-01
        const results_ch2 = await buildIndicatorTableResults_2_CH(props.container, props.project, props.bearer, massnahmeVariante);
        setIndicatorTables(Object.values(results_ch2).flat());
        //setIndicatorTables(Object.values(calculationTables.CH.at(0)).flat());
      }
      else if (props.countryCode === "DE" && props.awfNr !== "AWF1") {
        const results_de4 = await buildIndicatorTableResults_4_DE(props.container, props.project, props.bearer, props.awfNr);
        setIndicatorTables(Object.values(results_de4).flat());

      const restwertTable = results_de4.find(t => t.title.includes("Materialwert"));
let restwertChartDataX = [];
if (restwertTable && restwertTable.data.length >= 2) {
  const headers = restwertTable.data[0];   // ["Restwert", "", "BKA", ..., "Gesamt"]
  const row = restwertTable.data[1];       // ["Restwert [€]", "[€]", 4485.6, ..., 98100.6]

  // Ab Index 2 starten → Codes bis vor "Gesamt"
  restwertChartDataX = headers
    .slice(2, -1)
    .map((code, i) => ({
      code,
      value: Number(row[i + 2]) || 0  // +2 weil row[0]="Restwert [€]" und row[1]="[€]"
    }));
}

setRestwertChartData(restwertChartDataX);


        // Transformation für Stacked Data
        const stackedDataMap = {};
        results_de4.forEach(table => {
          if (!table.data || table.unit !== "t") return;

          const category = table.title;
          if (!stackedDataMap[category]) stackedDataMap[category] = { category };

          // Jede Zeile (außer Header) → property + Gesamtwert
          table.data.slice(1).forEach(row => {
            const property = row[0];
            const gesamt = row[row.length - 1];
            stackedDataMap[category][property] = Number(gesamt) || 0;
          });
        });

        const dataArr = Object.values(stackedDataMap);
        const properties = Array.from(
          new Set(dataArr.flatMap(d => Object.keys(d).filter(k => k !== "category")))
        );

        setStackedData(dataArr);
        setAllProperties(properties);
      }

      else if (props.countryCode === "DE" && props.awfNr === "AWF1") {
        //Case for DE-1
      }

      console.log('indicatorTables:', indicatorTables);
    };
    fetchData();

  }, [props.countryCode, props.awfNr, props.container, props.project, props.bearer, massnahmeVariante]);

  //Temp put all table values into radar //Modified based on VisualizationTab,  2025-07-29
  useEffect(() => {
    if (indicatorTables && indicatorTables.length > 0) {
      const sumTemp_Radar = getRadarDataFromTables(indicatorTables);
      setSumIndicatorRadar(sumTemp_Radar);
    }
  }, [indicatorTables]);




  const handleExportCSV = () => {
    let allCsvContent = indicatorTables.map(table => {
      const csvTable = table.data.map(row => row.join(",")).join("\n");
      return `${table.title}\n${csvTable}`;
    }).join("\n\n");

    const blob = new Blob([allCsvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute('download', 'Calculation_Results.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  //provide normalization, 2025-07-28 //Copy from VisualizationTab,  2025-07-29
  const getRadarDataFromTables = (tables) => {
    console.log("Print tables info: ", tables);

    return tables
      .filter(table => Array.isArray(table.data) && table.data.length > 0)
      .map(table => {
        const indicatorName = table.title;
        const headers = table.data[0]; // ["Activity", "Variant 1", "Variant 2"]
        const rows = table.data.slice(1);

        const totals = {};

        // Initialize totals for variants starting at index 2
        for (let i = 2; i < headers.length; i++) {
          const variant = headers[i];
          totals[variant] = 0;
        }

        // Sum up the values for each variant
        rows.forEach(row => {
          for (let i = 2; i < row.length; i++) {
            const variant = headers[i];
            const value = parseFloat(row[i]) || 0;
            totals[variant] += value;
          }
        });

        console.log("Print totals info: ", totals);

        // Obtain variant_1 and variant_2 here
        const variant1Key = Object.keys(totals).find(key => key.startsWith("Variante 1"));
        const variant2Key = Object.keys(totals).find(key => key.startsWith("Variante 2"));

        const variant_1 = totals[variant1Key] || 0;
        const variant_2 = totals[variant2Key] || 0;

        // Calculate min and max based on the example logic
        const min_value = Math.min(variant_1, variant_2) * 0.5;  // 0.5 factor on minimum
        const max_value = Math.max(variant_1, variant_2) * 2;    // 2 factor on maximum

        // Normalize each variant
        const variant_1_normalized = Math.min(1, (1 - (variant_1 - min_value) / (max_value - min_value)));
        const variant_2_normalized = Math.min((1 - (variant_2 - min_value) / (max_value - min_value)));

        totals[variant1Key] = variant_1_normalized;
        totals[variant2Key] = variant_2_normalized;

        console.log("Print variant: ", variant_1, variant_2);
        console.log("Print normalized: ", variant_1_normalized, variant_2_normalized);
        console.log("Print new totals info: ", totals);

        return {
          subject: indicatorName,
          A: variant_1_normalized,
          B: variant_2_normalized,
          fullMark: 1,
        };
      });
  };

  const isLoading =
    !indicatorTables?.length ||
    indicatorTables.every(t => !t?.data || t.data.length === 0);

   
   

  return (<>
    <button
      className="calculationButton btn btn-sm fw-bold"
      onClick={handleExportCSV}
      style={{ float: 'right', width: '25%', marginLeft: '25px' }}
    >
      Ergebnis herunterladen
    </button>
    <div className="clearfix"></div>

    {isLoading && (
      <div
        className="loading-overlay d-flex align-items-center justify-content-center"
        role="status"
        aria-live="polite"
        aria-label="Ergebnisse werden geladen"
      >
        {/* Bootstrap-Spinner oder eigene Animation */}
        <div className="spinner-border" role="status" aria-hidden="true"></div>
        <span className="ms-3 fw-semibold">Ergebnisse werden berechnet…</span>
      </div>
    )}

    {/* Ergebnisbereich als relativ positionierter Wrapper */}
    <div className="displayContentAside w-100">

      {/* Vollflächiges Overlay */}


      <div className="leftColumnResultsVis">
        {indicatorTables.map((table, tableIndex) => (
          table.data && table.data.length > 1 ? (
            <div key={tableIndex} style={{ marginBottom: "30px" }} className="w-100">
              <h3
                style={{ cursor: "pointer", userSelect: "none" }}
                onClick={() => toggleExpand(tableIndex)}
              >
                {table.title}{" "}
                {table.intermediateData && table.intermediateData.length > 0 && (
                  <span
                    style={{ backgroundColor: "#dfedd6" }}
                    className="btn btn-light btn-sm small float-end"
                  >
                    {expandedTables[tableIndex] ? "Details ausblenden ▼" : "Details anzeigen ►"}
                  </span>
                )}
              </h3>

              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "center" }}>
                <thead style={{ backgroundColor: "rgb(108, 140, 119)" }} className="text-white">
                  <tr>
                    {table.data?.[0]?.map((header, i) => (
                      <th key={i} style={{ border: "1px solid black", padding: "8px", textAlign: i > 1 ? "right" : "left", }}>
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {expandedTables[tableIndex] &&
                    table.intermediateData?.slice(0).map((row, rowIndex) => (
                      <tr
                        key={`inter-${rowIndex}`}
                        className="text-muted small"
                        style={{ backgroundColor: "rgba(223, 237, 214, 0.5)" }}
                      >
                        {row.map((cell, cellIndex) => {

                          return (
                            <td
                              key={cellIndex}
                              style={{
                                border: "1px solid black",
                                padding: "8px",
                                textAlign: cellIndex > 1 ? "right" : "left",
                              }}
                              className="white-space-pre"
                            >
                              {Array.isArray(cell) ? cell.join(", ") : cell}
                            </td>
                          );
                        })}
                      </tr>
                    ))}

                  {table.data?.slice(1).map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell, cellIndex) => {
                        return (
                          <td
                            key={cellIndex}
                            style={{
                              border: "1px solid black",
                              padding: "8px",
                              textAlign: cellIndex > 1 ? "right" : "left",
                            }}
                            className="white-space-pre"
                          >
                            {formatCell(cell, table.unit, cellIndex, table.type)}
                          </td>
                        );
                      })}
                    </tr>
                  ))}

                </tbody>
              </table>
            </div>
          ) : (
            // Only print message if table.data is empty array
            <div key={tableIndex} className=" mb-4">
              <h3>
                {table.title}{" "}                
              </h3>
              <span className="text-muted mb-4">
             keine Daten für diesen Indikator im Digitalen Zwilling vorhanden
                </span>
            </div>
          )
        ))}
      </div>

      <div className="rightColumnResultsVis">
        {showOnlyPieAndBar ? (
          // Only show PieChart and BarChart for DE and awfNr !== "AWF1",  2025-08-26
          <>
           {indicatorTables?.[1] && (
              <div className="card shadow-sm mb-3">
                <div className="card-header">
                  Masseermittlung für die einzelnen Indikatoren
                </div>
                <div className="card-body d-flex justify-content-center">
                
                 <ResponsiveContainer width="100%" height={300}>
  <BarChart data={stackedData}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="category" />
    <YAxis />
    <Tooltip />
    {allProperties.map((prop, idx) => (
      <Bar
        key={prop}
        dataKey={prop}
        stackId="a"
        fill={MATERIAL_COLORS[idx % MATERIAL_COLORS.length]}
      />
    ))}
  </BarChart>
</ResponsiveContainer>

                </div>
              </div>)}

            {indicatorTables?.[0] && (

              <div className="card shadow-sm mb-3">
  <div className="card-header">Restwert je Code [€]</div>
  <div className="card-body">
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={restwertChartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="code" />
        <YAxis />
        <Tooltip formatter={(v) => `${v.toLocaleString()} €`} />
        <Bar dataKey="value" fill="rgb(108, 140, 119)" />
      </BarChart>
    </ResponsiveContainer>
  </div>
</div>


            )}

          </>
        ) : (
          // Default: show RadarChart
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={sumIndicatorRadar}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={0.25} domain={[0, 1]} />
              <Radar name="Variante 1" dataKey="A" stroke="#FC8D62" strokeWidth={2} fill="#8884d8" fillOpacity={0} />
              <Radar name="Variante 2" dataKey="B" stroke="#A6CEE3" strokeWidth={2} fill="#82ca9d" fillOpacity={0} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  </>
  );
};

export default CalculationResultTab;