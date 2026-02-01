import React from "react";

const PopupHours = ({ selectedAsset, setSelectedAsset, onClose }) => {
  const handleHourChange = (assetName, newHours) => {
    setSelectedAsset((prev) =>
      prev.map((asset) =>
        asset.name === assetName
          ? { ...asset, hours: parseFloat(newHours) || 1 }
          : asset
      )
    );
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Betriebszeiten ändern</h3>
        <table style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Asset Name</th>
              <th>Stunden</th>
            </tr>
          </thead>
          <tbody>
            {selectedAsset.length > 0 ? (
              selectedAsset.map((asset, index) => (
                <tr key={index}>
                  <td>{asset.name}</td>
                  <td>
                    <input
                      type="number"
                      value={asset.hours || ""}
                      onChange={(e) =>
                        handleHourChange(asset.name, e.target.value)
                      }
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2">Keine Assets verfügbar</td>
              </tr>
            )}
          </tbody>
        </table>
        <button onClick={onClose}>Speichern</button>
      </div>
    </div>
  );
};

export default PopupHours;
