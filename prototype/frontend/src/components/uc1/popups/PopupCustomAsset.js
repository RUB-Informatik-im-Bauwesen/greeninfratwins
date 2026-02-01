import React, { useState } from "react";

const PopupCustomAsset = ({ onClose, onSave }) => {
  const [customAsset, setCustomAsset] = useState({
    name: "",
    GWP: "",
    EP: "",
    AP: "",
    POCP: "",
    KEA: "",
    noise: "",
    cost: "",
  });

  const handleSave = () => {
    if (!customAsset.name) {
      alert("Bitte Name eingeben");
      return;
    }
    onSave({ ...customAsset, count: 1 });
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Benutzerdefiniertes Asset hinzufügen</h2>
        {Object.keys(customAsset).map((key) => (
          <input
            key={key}
            type="text"
            placeholder={key}
            value={customAsset[key]}
            onChange={(e) =>
              setCustomAsset({ ...customAsset, [key]: e.target.value })
            }
          />
        ))}
        <button onClick={handleSave}>Speichern</button>
        <button onClick={onClose}>Abbrechen</button>
      </div>
    </div>
  );
};

export default PopupCustomAsset;
