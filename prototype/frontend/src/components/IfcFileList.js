import React, { useState, useEffect } from 'react';
import axios from 'axios';

const IfcFileList = ({ projectId, containerType, containerId }) => {
  const [ifcFiles, setIfcFiles] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchIfcFiles();
  }, [projectId, containerType, containerId]);

  const fetchIfcFiles = async () => {
    try {
      const response = await axios.get(`/api/icdd/projects/${projectId}/containertypes/${containerType}/containers/${containerId}/ifccontents`);
      setIfcFiles(JSON.parse(response.data.data));
      setError(null);
    } catch (error) {
      console.error('Error fetching Ifc files:', error);
      setError('Failed to fetch Ifc files');
    }
  };

  const handleDownload = async (contentId) => {
    try {
      const response = await axios.get(
        `/api/icdd/projects/${projectId}/containertypes/${containerType}/containers/${containerId}/contents/${contentId}/attachment`,
        { responseType: 'blob' }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `file_${contentId}.ifc`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading file:', error);
      setError('Failed to download file');
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h3>Ifc Files</h3>
      {ifcFiles.length === 0 ? (
        <p>No Ifc files found</p>
      ) : (
        <ul>
          {ifcFiles.map(file => (
            <li key={file.Id}>
              {file.Name}
              <button onClick={() => handleDownload(file.Id)}>Download</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default IfcFileList;