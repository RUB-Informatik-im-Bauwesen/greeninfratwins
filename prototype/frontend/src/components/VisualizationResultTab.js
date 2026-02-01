// created on 2025-06-15, for visualization result tab (Basic requirment 10)

import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../AppProvider";
import {
  BarChart, Bar,
  XAxis, YAxis,
  Tooltip, Legend,
  PieChart, Pie, Cell,
  RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer
} from 'recharts';

//const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const VARIANT_COLORS = ['#FC8D62', '#A6CEE3'];

const VisualizationResultTab = () => {
  const { indicatorTables, setIndicatorTables, sumIndicatorRadar
  } = useContext(AppContext);

  //const [sumIndicatorTables, setSumIndicatorTables] = useState([]);//Store all indicator results as a pie, 2025-06-15
  //const [sumIndicatorTables_v2, setSumIndicatorTables_v2] = useState([]);//Store all indicator results as a pie, V2, 2025-06-15
  //const [sumIndicatorRadar, setSumIndicatorRadar] = useState([]);//Store all indicator results as a radar, 2025-06-18

  // Helper to convert table data to chart-compatible format, 2025-06-15
  const convertToChartData = (data) => {
    const headers = data[0];
    return data.slice(1).map(row => ({
      activity: row[0],
      [headers[2]]: Number(row[2]),
      [headers[3]]: Number(row[3])
    }));
  };

  //Temp put all table values into pie, 2025-06-15
  /*useEffect(() => {
    const sumTemp = getPieDataByVariant(indicatorTables);
    setSumIndicatorTables(sumTemp);

    const sumTemp_v2 = getPieDataByVariant_v2(indicatorTables);
    setSumIndicatorTables_v2(sumTemp_v2);

    const sumTemp_Radar = getRadarDataFromTables(indicatorTables);
    setSumIndicatorRadar(sumTemp_Radar);
  }, []);*/


  // Helper to convert all table data to Pie-compatible format, 2025-06-15
  /*const getPieDataByVariant = (tables) => {
    const pieData = [];

    tables.forEach((table) => {
      const headers = table.data[0]; // ["Activity", "Variant 1", "Variant 2"]
      const rows = table.data.slice(1); // skip header

      rows.forEach((row) => {
        const activity = row[0];
        for (let i = 1; i < row.length; i++) {
          const variant = headers[i];
          const value = parseFloat(row[i]);
          pieData.push({
            name: `${activity} (${variant})`,
            value: value,
            variant: variant
          });
        }
      });
    });

    return pieData;
  };*/

  // Helper to convert all table data to Pie-compatible format, V2, 2025-06-15
  /*const getPieDataByVariant_v2 = (tables) => {
    const variantSums = {};

    tables.forEach(table => {
      const headers = table.data[0]; // e.g. ["Activity", "Variant 1", "Variant 2"]
      for (let row of table.data.slice(1)) {
        for (let i = 1; i < row.length; i++) {
          const variant = headers[i];
          const value = parseFloat(row[i]) || 0;
          variantSums[variant] = (variantSums[variant] || 0) + value;
        }
      }
    });

    return Object.entries(variantSums).map(([name, value]) => ({ name, value }));
  };*/

  // Helper to convert all table data to radar-compatible format, 2025-06-18
  /*const getRadarDataFromTables = (tables) => {
    console.log("Print tables info: ", tables);
    return tables.map(table => {
      const indicatorName = table.title;
      const headers = table.data[0]; // ["Activity", "Variant 1", "Variant 2"]
      const rows = table.data.slice(1);

      const totals = {};

      for (let i = 2; i < headers.length; i++) { // Start at index 2 to skip non-variant columns, 2025-07-28
        const variant = headers[i];
        totals[variant] = 0;
      }

      rows.forEach(row => {
        for (let i = 2; i < row.length; i++) { // Start at index 2 to skip non-variant columns, 2025-07-28
          const variant = headers[i];
          const value = parseFloat(row[i]) || 0;
          totals[variant] += value;
        }
      });

      console.log("Print totals info: ", totals);

      return {
        subject: indicatorName,
        ...totals
      };
    });
  };*/

  // provide normalization, 2025-07-28
  /*const getRadarDataFromTables = (tables) => {
  console.log("Print tables info: ", tables);
  
  return tables.map(table => {
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
    const variant_1_normalized = 1 - (variant_1 - min_value) / (max_value - min_value);
    const variant_2_normalized = 1 - (variant_2 - min_value) / (max_value - min_value);

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
};*/


  return (
    <div className="displayContentAside">
     {/* Voraussetzung: Bootstrap-CSS ist eingebunden */}
<div className="leftColumnResultsVis">
  <div className="container-fluid p-0 w-100">
    <div className="row m-0 p-0 w-100 justify-content-center">
      {indicatorTables.map((table, tableIndex) => {
        const chartData = convertToChartData(table.data) ?? [];
        const first = chartData[0] ?? {};
        const keys = Object.keys(first).filter(k => k !== "activity");

        return (
          <div className="col-12 col-md-12 col-lg-5 col-xl-3 m-0 p-0" key={tableIndex}>
            <div className="card h-100 m-0">
              <div className="card-header">
                <h5 className="card-title mb-0">{table.title}</h5>
              </div>

              <div className="card-body">
                {chartData.length > 0 && keys.length > 0 ? (
                  <div style={{ width: "100%", height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <XAxis dataKey="activity" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {keys.map((key, i) => (
                          <Bar
                            key={key}
                            dataKey={key}
                            fill={VARIANT_COLORS[i % VARIANT_COLORS.length]}
                          />
                        ))}
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="text-muted small">
                    Keine darstellbaren Daten vorhanden.
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
</div>

      <div className="rightColumnResultsVis">
        {/* Commented below , 2025-07-28 */}
        {/*<ResponsiveContainer width="100%" height={500}>
          <PieChart>
            <Pie
              data={sumIndicatorTables}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={150}
              label
            >
              {sumIndicatorTables.map((entry, index) => (
                <Cell key={`cell-${index}`}
                  fill={VARIANT_COLORS[entry.variant] || '#8884d8'}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>

        <br /><br />
        <h3>Normalisieren (V2):</h3>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={sumIndicatorTables_v2}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              label
            >
              {sumIndicatorTables_v2.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>*/}


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


      </div>
    </div>
  );
};

export default VisualizationResultTab;