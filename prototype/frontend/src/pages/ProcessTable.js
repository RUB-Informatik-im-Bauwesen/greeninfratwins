import TTLViewer from '../components/TTLViewer';
import React, { useState, useEffect } from 'react';


const ProcessTable = () => {
  const [processes, setProcesses] = useState([]);
  const [expandedProcess, setExpandedProcess] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

 
  useEffect(() => {
    const fetchProcesses = async () => {
      try {
        const response = await fetch("http://localhost:2000/api/processes");
        const jsonData = await response.json();
        const xmlString = jsonData.data;

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

        const processElements = Array.from(xmlDoc.getElementsByTagName('p:process'));
        const processes = processElements.map((processElement) => {
          const nameElement = Array.from(processElement.getElementsByTagName('sapi:name'))
            .find((name) => name.getAttribute('xml:lang') === 'de');
          const name = nameElement ? nameElement.textContent : 'N/A';
          const uuid = processElement.getElementsByTagName('sapi:uuid')[0]?.textContent || '';
          const dataSetVersion = processElement.getElementsByTagName('sapi:dataSetVersion')[0]?.textContent || '';

          return { name, uuid, dataSetVersion, data: null };
        });

        setProcesses(processes);
      } catch (error) {
        console.error('Error fetching XML:', error);
      }
    };

    fetchProcesses();
  }, []);

  const handleRowClick = async (originalIndex, uuid, version) => {
    if (expandedProcess === originalIndex) {
      setExpandedProcess(null);
      return;
    }

    setExpandedProcess(originalIndex);
    console.log(`Clicked process with UUID: ${uuid} and version: ${version}`);
    const req = [{ id: uuid, version: version }];
    try {
      const response = await fetch("http://localhost:4000/api/oekobaudat/processes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req),
      });
      const data = await response.json();
      console.log(data);

      setProcesses((prevProcesses) => {
        const newProcesses = [...prevProcesses];
        newProcesses[originalIndex].data = data.data;
        return newProcesses;
      });
    } catch (error) {
      console.error('Error fetching process data:', error);
    }
  };

  const filteredProcesses = processes
    .map((process, index) => ({ ...process, originalIndex: index }))
    .filter((process) => process.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <h1 style={{ margin: '10px 0' }}>Datensätze verfügbar in ÖKOBAUDAT</h1>

      <input
        type="text"
        placeholder="Prozesse suchen..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{
          margin: '10px 0',
          padding: '10px',
          fontSize: '16px',
          border: '1px solid #ddd',
          borderRadius: '5px',
        }}
      />

      <div
        style={{
          flex: 1,
          border: '1px solid #ddd',
          borderRadius: '5px',
          overflow: 'auto',
        }}
      >
        {filteredProcesses.map((process) => (
          <React.Fragment key={process.originalIndex}>
            <div>
              <div
                onClick={() =>
                  handleRowClick(process.originalIndex, process.uuid, process.dataSetVersion)
                }
                style={{
                  cursor: 'pointer',
                  padding: '10px',
                  backgroundColor: '#f9f9f9',
                  transition: 'background-color 0.3s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f9f9f9')}
              >
                {process.name} ({process.dataSetVersion})
              </div>
              {expandedProcess === process.originalIndex && process.data && (
                <div style={{ maxHeight: '60vh', overflow: 'auto', borderTop: '1px solid #ddd' }}>
                  <TTLViewer ttlContent={process.data} />
                </div>
              )}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ProcessTable;
