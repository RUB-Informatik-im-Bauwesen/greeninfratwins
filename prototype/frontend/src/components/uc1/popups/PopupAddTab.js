import React, { useState } from "react";

const PopupAddTab = ({ onClose, onCreate }) => {
  const [title, setTitle] = useState("");

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Neue Maßnahme auswählen</h3>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Maßnahme eingeben"
        />
        <button onClick={() => onCreate(title)}>Tab erstellen</button>
        <button onClick={onClose}>Abbrechen</button>
      </div>
    </div>
  );
};

export default PopupAddTab;
