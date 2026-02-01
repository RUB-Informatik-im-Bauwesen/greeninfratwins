import React from "react";

const PopupExistingAssets = ({ assetList, onClose, onAddAsset }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <h1>Wählen Sie ein bestehendes Asset aus</h1>
        <table style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Asset Name</th>
              <th>Aktion</th>
            </tr>
          </thead>
          <tbody>
            {assetList.length > 0 ? (
              assetList.map((asset, index) => (
                <tr key={index}>
                  <td>{asset.name}</td>
                  <td>
                    <button onClick={() => onAddAsset(asset)}>Auswählen</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2">Keine Assets verfügbar.</td>
              </tr>
            )}
          </tbody>
        </table>
        <button onClick={onClose}>Schließen</button>
      </div>
    </div>
  );
};

export default PopupExistingAssets;
