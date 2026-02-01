import React, { useState, useEffect, useContext } from "react";
import "../../pages/DefinitionPage23.css";
import CurrentActivityTable from "./CurrentActivityTable"
import {generateTablesFromMeasure, fillTable} from "../../utils/uc1/DE/calculate"
import { AppContext } from "../../AppProvider";

const ActivityTab = ({
  data,
  activity,
  onChange,
  assetList,
  selectedAsset,
  setSelectedAsset,
  totals,
  openExistingAssets,
  openCustomAsset,
  openHours
}) => {
  const [inputText, setInputText] = useState(data.inputText || "");
  const [tables, setTables] = useState([]);
    const {
      containerId,
      projectId,
      measure,
      setMeasure,
      selectedModels,
      indexer
    } = useContext(AppContext);

    const token = localStorage.getItem('authToken');
        if (!token) throw new Error('Authentication token is missing.');

  useEffect(() => {
    onChange({ inputText });
  }, [inputText]);


  const formatDate = (dateString) => {
    if (!dateString) return "Kein Datum";
    const date = new Date(dateString);
    return date.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };



  return (
    <div className="tabContentUC1" key={data.id} >
      <div className="leftColumnUC1">
        <h3>{(activity?.label)} </h3>
        <div key={data.id} className="alert alert-light my-1 mb-3 position-relative" style={{ overflow: "scroll", height: "90%" }}>

          <div className="">
            <div className="">

              <div className="row">
                <div className="col-4 fw-bold">Datum:</div>
                <div className="col-6">{formatDate(activity?.date)}</div>
              </div>
              <div className="row">
                <div className="col-4 fw-bold">Modell:</div>
                <div className="col-6"><code>{(activity?.model)}</code></div>
              </div>
              <div className="row">
                <div className="col-4 fw-bold">Arbeitsfläche im IFC Modell:</div>
                <div className="col-6">
                  {(activity?.area)} m²
                </div>
              </div>


              {activity.description && (
                <div className="row">
                  <div className="col-4 fw-bold">Datum:</div>
                  <div className="col-6 text-muted">{activity?.description}</div>
                </div>
              )}
              
              <hr className="border-light"></hr>
              <h5 className="mb-3">Indikatoren</h5>
              {Array.isArray(activity.indicatorsets) && activity.indicatorsets.length > 0 && (
                <>
                  {[...activity.indicatorsets]
                    .sort((a, b) => (a.label || "").localeCompare(b.label || "", "de"))
                    .map((set) => (

                      <div className="p-0" key={set.uri || set.label} >
                        {/* LINKE SPALTE: Indikator-Set */}
                        <div className=" fw-bold  my-1 mt-4">
                          {set.label || "Indikator-Set"}
                        </div>

                        {/* RECHTE SPALTE: zugehörige Indikatoren */}
                        <div className=" my-1">
                          {Array.isArray(set.indicators) && set.indicators.length > 0 ? (
                            <ul className="list-group mb-0">
                              {[...set.indicators]
                                .sort((a, b) => (a.label || "").localeCompare(b.label || "", "de"))
                                // distinct by label
                                .filter(
                                  (ind, idx, self) =>
                                    ind.label &&
                                    idx === self.findIndex((el) => el.label === ind.label)
                                )
                                .map((ind) => (
                                  <li className="list-group-item d-flex justify-content-between align-items-center" key={ind.uri || ind.label}>
                                    <span className="">{ind.label}</span>
                                  </li>
                                ))}
                            </ul>
                          ) : (
                            <span className="text-muted">–</span>
                          )}
                        </div>

                      </div>
                    ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="rightColumnUC1 p-3 w-100">
        <h3>Genutzte Assets und berechnete Indikatoren</h3>
        {/* Tabelle: Aktivitäts-Assets (aus RDF) */}
        <div className="table-responsive w-100">
          <CurrentActivityTable
  measure={measure}
  activityUrl={activity.url}
  containerId={containerId}
  projectId={projectId}
  token={token}
  fillTotals={true} />          
        </div>

      </div>
    </div>
  );
};

export default ActivityTab;
