import React, { useState, useContext } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './TTLViewer.css';
import { AppContext } from "../AppProvider";

const ttlLanguage = {
  comment: {
    pattern: /#.*/,
    greedy: true
  },
  'turtle-punctuation': {
    pattern: /[{}.,;[\]()]/,
  },
  'turtle-keyword': {
    pattern: /@(?:prefix|base)\b/i,
  },
  'turtle-uri': {
    pattern: /<[^>]+>/,
  },
  'turtle-prefix': {
    pattern: /\w+:/,
  },
  string: {
    pattern: /"(?:\\.|[^\\"\r\n])*"/,
    greedy: true
  },
};

const TTLViewer = ({ ttlContent }) => {
  const [copySuccess, setCopySuccess] = useState('');
  const [sendSuccess, setSendSuccess] = useState('');
  const { containerId, projectId} = useContext(AppContext);
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(ttlContent);
      setCopySuccess('Copied!');
      // Setze die Kopier-Bestätigung nach 2 Sekunden zurück
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      setCopySuccess('Failed to copy');
      console.error('Failed to copy text: ', err);
    }
  };

  const sendToBackend = async () => {
    const blob = new Blob([ttlContent], { type: 'text/turtle' });
    const formData = new FormData();
    formData.append('file', blob, new Date().toISOString().replace(/[:.-]/g, "_")+'_EPD_Data.ttl');

    try {
      const token = localStorage.getItem('authToken');

      const response = await fetch(`http://localhost:2000/api/icdd/projects/${projectId}/containertypes/0/containers/${containerId}/content`, {
        method: 'POST',
        body: formData,
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setSendSuccess('File sent successfully!');
      } else {
        setSendSuccess('Failed to send file');
      }

      setTimeout(() => setSendSuccess(''), 2000);
    } catch (err) {
      setSendSuccess('Failed to send file');
      console.error('Failed to send file: ', err);
    }
  };

  return (
    <div style={{
      position: 'relative',
      border: '1px solid #e0e0e0',
      borderRadius: '5px',
      overflow: 'hidden'
    }}>

      <div style={{
                display: 'flex',
                position: 'absolute',
                top: '10px',
                right: '10px',
                zIndex: 1,
                gap: '10px',
      }}>

        <button
          onClick={copyToClipboard}
          style={{
            top: '10px',
            right: '10px',
            zIndex: 1,
            padding: '5px 10px',
            backgroundColor: '#f0f0f0',
            border: '1px solid #ccc',
            borderRadius: '3px',
            cursor: 'pointer',
          }}
        >
          {copySuccess || 'Copy'}
        </button>

        <button
          title='Send to ICDD container'
          onClick={sendToBackend}
          style={{
            top: '10px',
            right: '10px',
            zIndex: 1,
            padding: '5px 10px',
            backgroundColor: '#f0f0f0',
            border: '1px solid #ccc',
            borderRadius: '3px',
            cursor: 'pointer',
          }}
        >
          {sendSuccess || 'Send to ICDD Container'}
        </button>
      </div>
      <div style={{
        maxHeight: '300px',
        overflow: 'auto',
        paddingTop: '40px', // Space for the button
      }}>
        <SyntaxHighlighter
          language="ttl"
          style={prism}
          customStyle={{
            margin: 0,
            fontSize: '14px',
            lineHeight: '1.5',
            padding: '15px',
          }}
          showLineNumbers={true}
          wrapLines={true}
        >
          {ttlContent}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default TTLViewer;