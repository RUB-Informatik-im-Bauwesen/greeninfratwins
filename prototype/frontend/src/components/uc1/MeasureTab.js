import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../../AppProvider";
import IfcViewerX from "../IfcViewer";
import * as WEBIFC from "web-ifc";

const Measure = ({ data = {}, onChange }) => {
  const [date, setDate] = useState(data?.date || "");
  const [description, setDescription] = useState(data?.description || "");

  const {
    containerId,
    projectId,
    ifcFiles,
    setIfcFiles,
    measure
  } = useContext(AppContext);

  const formatDate = (dateString) => {
    if (!dateString) return "Kein Datum";
    const date = new Date(dateString);
    return date.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

 


        const handleIfcFiles = async (containerId) => {
          if (!containerId) return;

          try {
            const token = localStorage.getItem("authToken");
            const response = await fetch(
              `https://icdd.vm.rub.de/dev01/api/v1/projects/${projectId}/containerTypes/0/containers/${containerId}/contents`,
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            const files = await response.json();
            if (!Array.isArray(files)) throw new Error("Unexpected data format");

            const filteredFiles = files
              .filter(
                (file) =>
                  file?.Name?.endsWith(".ifc") &&
                  file.Type === "application/octet-stream" &&
                  file.ContainerInternalId
              )
              .map((file) => ({
                ...file,
                url: `https://icdd.vm.rub.de/dev01/api/v1/projects/${projectId}/containerTypes/0/containers/${containerId}/contents/${file.Id}/attachment`,
              }));

            setIfcFiles(filteredFiles);
          } catch (err) {
            console.error("Error fetching IFC files:", err);
          }
        };

        useEffect(() => {
          handleIfcFiles(containerId);
        }, [containerId]);



        return (
          <div key={"measure"} className="tabContentUC1">
            <div className="leftColumnUC1">
              <h3 className="measure">{measure?.name ?? ""}</h3>
              <div className="text-muted text-break fw-lighter text-justify">
                {measure?.description ?? ""}
              </div>

              <div className="mt-4 h-100">
                <h5 className="mb-3">Übersicht über Aktivitäten</h5>
                <div style={{overflow:"scroll", overflowX:"clip", height:"80%"}} className="p-3"> 
                  {(measure?.activity || []).map((act, index) => (
                    <div key={index} className="alert alert-light my-1 mb-3 position-relative">
                      <span
                        className="position-absolute top-0 start-0 translate-middle badge rounded-circle"
                        style={{
                          backgroundColor: "inherit",
                          border: "2px solid #dee2e6", // gleiche Rahmenfarbe wie alert-light
                          color: "black",
                          width: "28px",
                          height: "28px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {index + 1}
                      </span>
                      <div className="">
                        <div className="">
                          <div className="row">
                            <div className="col-3 fw-bold">Name:</div>
                            <div className="col-8">{act.label || "Unbenannte Aktivität"}</div>
                          </div>
                          <div className="row">
                            <div className="col-3 fw-bold">Datum:</div>
                            <div className="col-8">{formatDate(act.date)}</div>
                          </div>
                          <div className="row">
                            <div className="col-3 fw-bold">Modell:</div>
                            <div className="col-8"><code>{(act.model)}</code></div>
                          </div>
                          <div className="row">
                            <div className="col-3 fw-bold">Referenzfläche:</div>
                            <div className="col-8">

                            {(act.area)} m²

                            </div>
                          </div>


                          {act.description && (
                            <div className="row">
                              <div className="col-3 fw-bold">Datum:</div>
                              <div className="col-8 text-muted">{act.description}</div>
                            </div>
                          )}
                          {!!(act.assets?.length) && (
                            <div className="row">
                              <div className="col-3 fw-bold">Assets:</div>
                              <div className="col-8">
                                {act.assets.map((as, i) => (
                                  <span key={as.uri} className="badge text-bg-success me-1">
                                    {`${as.label} ist ${as.hours} ${Number(as.hours) === 1 ? "Stunde" : "Stunden"} im Einsatz`}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rightColumnUC1">
              <IfcViewerX />
            </div>
          </div>
        );
      };

      export default Measure;
