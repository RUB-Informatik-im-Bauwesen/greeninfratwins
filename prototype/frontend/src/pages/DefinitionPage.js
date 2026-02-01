import React, { useState, useEffect ,useRef } from "react";
import "./DefinitionPage.css";
import {useNavigate, useLocation} from 'react-router-dom';

const DefinitionPage = ({   }) => {
  

  const [selectedOption,setSelectedOption]= useState ('');
  const [inputValue, setInputValue] = useState('');
  const [InputValue1, setInputValue1] = useState('');
  const [InputValue2, setInputValue2] = useState('');
  const [InputValue3, setInputValue3] = useState('');
  const [InputValue4, setInputValue4] = useState('');
  const [InputValue5, setInputValue5] = useState('');
  const [showExistingAssetsModal, setShowExistingAssetsModal] = useState(false);
  const [selectedAssetDetail, setSelectedAssetDetail] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showhours, setShowhours] = useState(false);
  const [hours, setHours ] = useState('');
  const [newTabTitle, setNewTabTitle] = useState('');
  const[history, setHistory]= useState('');
  const [selectedName, setSelectedName] = useState('');
  const [totalGWP, setTotalGWP] = useState (0);
  const [totalEP, setTotalEP] = useState (0);
  const [totalAP, setTotalAP] = useState (0);
  const [totalPOCP, setTotalPOCP] = useState (0);
  const [totalKEA, setTotalKEA] = useState (0);
  const [totalCost, setTotalCost] = useState(0);
  const [totaldB, setTotaldB] = useState(0);
  const [assetList, setAssetList] = useState([]);
  const [ Date, setDate ]  = useState('');
  const [inputText, setInputText] = useState('');
  const [customAsset, setCustomAsset] = useState({ name: '', GWP: '', EP: '', AP: '', POCP: '',noise:'',hours:'' ,cost: '' });
  const [selectedAsset, setSelectedAsset] = useState([]);
  const [showCustomAssetForm, setShowCustomAssetForm] = useState(false);
  const [savedStates, setSavedStates] = useState([]);
  const [stateName, setStateName] = useState("");
  const [tabData, setTabData] = useState({
    1: { date: "", inputText: "", InputValue1: "", InputValue2: "", InputValue3: "", InputValue4: "", InputValue5: "", calculatedValues: "", assets: "" },
  });
  const [activeTab, setActiveTab] = useState(1);
  const [tabs, setTabs] = useState([{ id: 1, name: "Maßnahmen Beschreibung", data: {} }]);
  const location = useLocation();
  const [tabName, setTabName] = useState('');
  
  const [assetHours, setAssetHours] = useState({});
  const [totals, setTotals] = useState({
    totalGWP: 0,
    totalEP: 0,
    totalAP: 0,
    totalPOCP: 0,
    totalKEA:0,
    totalCost: 0
  });
  
  useEffect(() => {
    const fetchData = async () => {
      const assets = [
        { name: 'LKW', count: 1, GWP: 79.200, EP: 0.3006, AP: 0.3126, POCP: 0.312, KEA:0.3, noise:3, cost: 75, image: "https://via.placeholder.com/150" },
        { name: 'Motorsäge', count: 1, GWP: 3.450, EP: 0.021, AP: 0.02118, POCP: 0.0285, KEA:0.6, noise:3, cost: 3.5, image: "https://via.placeholder.com/150" },
        { name: 'Fräse', count: 1, GWP: 66, EP: 0.0250, AP: 0.026125, POCP: 0.260, KEA:0.8, noise:3, cost: 47.5,  image: "https://via.placeholder.com/150" },
        { name: 'Stromgenerator', count: 1, GWP: 21.120, EP: 0.08, AP: 0.0836, POCP: 0.0832, KEA: 0.9, noise:3, cost: 15, image: "https://via.placeholder.com/150" },
      ];
    
      const assetArray = Object.values(assets);
      console.log(assetArray);

      try {
        const savedAssets = localStorage.getItem('assetList');
        let combinedAssets = [...assetArray];

        if (savedAssets) {
          const parsedAssets = JSON.parse(savedAssets);
          
          if (Array.isArray(parsedAssets)) {
            // Hier kombinieren wir die hartcodierten Assets mit den gespeicherten Assets aus localStorage
            combinedAssets = [
              ...combinedAssets,
              ...parsedAssets.filter(savedAsset =>
                !assets.some(asset => asset.name === savedAsset.name)
              )
            ];

          } else {
            console.error("Gespeicherte Assets sind kein Array.");
          }
        } else {
          console.log("Keine Assets im localStorage gefunden.");
        }
  
        setAssetList(combinedAssets); // Kombinierte Liste in den State setzen
      } catch (error) {
        console.error("Fehler beim Laden der assetList aus localStorage:", error);
        setAssetList(assets); // Bei Fehler nur die hart codierten Assets anzeigen
      }
    };

    fetchData();
  },[]);

    
    const navigate = useNavigate();
    const itemSelect = useRef(null);
    const itemTable= useRef(null);

    const handleTabClick = (tabId) => {
      setActiveTab(tabId);
    };

    // Funktion zum Auslesen der URL-Parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const maßnahme = params.get('maßnahme');
    if (maßnahme) {
      setTabName(maßnahme); // wenn du das brauchst
      setTabs(prevTabs =>
        prevTabs.map((tab, index) =>
          index === 0 ? { ...tab, name: maßnahme } : tab
        )
      );
    }
  }, [location.search]);

//funktion der Popup`s
    const openPopup = () => {
      setShowPopup(true);
    };
  
    const closePopup = () => {
      setShowPopup(false);
    };
    
    const openhours = () => {
      setShowhours(true);
    };
  
    const closehours = () => {
      setShowhours(false);
    };
    
    
  
    const applyHoursToAssets = (asset) => {
      const hours = asset.hours || 1; // Standardwert für Stunden
      const count = asset.count || 1; // Standardwert für Anzahl
    
      // Nutze Originalwerte (falls definiert)
      const originalGWP = asset.originalGWP || asset.GWP;
      const originalEP = asset.originalEP || asset.EP;
      const originalAP = asset.originalAP || asset.AP;
      const originalPOCP = asset.originalPOCP || asset.POCP;
      const originalKEA = asset.originalKEA || asset.KEA;
      const originalNoise = asset.originalNoise || asset.noise;
      const originalCost = asset.originalCost || asset.cost;
    
      // Berechne die aktualisierten Werte
      return {
        ...asset,
        GWP: originalGWP * count * hours,
        EP: originalEP * count * hours,
        AP: originalAP * count * hours,
        POCP: originalPOCP * count * hours,
        KEA: originalKEA * count * hours,
        noise: originalNoise * count * hours,
        cost: originalCost * count * hours,
      };
    };

    const handleHourChange = (assetName, newHours)=>{
          setSelectedAsset((prevState)=>
          prevState.map((asset)=> 
            asset.name === assetName 
          ? applyHoursToAssets({
            ...asset,
             hours: parseFloat(newHours) ||1
            })
             :asset
          )
        );
      };
      
     
        // Funktion zum Erstellen eines neuen Tabs
     const createNewTab = () => {
       const newTabId = tabs.length+1;
       const name = newTabTitle.trim() || `Maßnahme ${newTabId - 1}`; // falls kein Name eingegeben wurde

        setTabs([...tabs, { id: newTabId, name: name, data: {} }]);
        setTabData({
        ...tabData,
        [newTabId]: { 
          Date: "",
          inputText:"",
          InputValue1: "",
          InputValue2:"",
          InputValue3:"",
          InputValue4:"",
          InputValue5:"",
         calculatedValues:"",
          assets:""}
          
      });
      setActiveTab(newTabId);
      setNewTabTitle("");
    };
      

    
          // Funktion zum Aktualisieren der Eingabe für den aktiven Tab
      const handleInputChange = (e, field) => {
        const updatedTabData = {
          ...tabData,
          [activeTab]: { ...tabData[activeTab], [field]: e.target.value },
        };
        setTabData(updatedTabData);
      };
  
    const handleOpenExistingAssetsModal =()=> setShowExistingAssetsModal(true);
    const handleCloseExistingAssetsModal = () => setShowExistingAssetsModal(false);
        
    const handleAddAsset = (asset) => {
      setSelectedAsset((prevState) => {
        const existingAsset = prevState.find(
          (existingAsset) => existingAsset.name === asset.name
        );
    
        if (existingAsset) {
            return prevState.map((existingAsset) =>
              existingAsset.name === asset.name
                ? applyHoursToAssets({
                    ...existingAsset,
                    count: (existingAsset.count || 1) +1,
                  })
                : existingAsset
            );
          } else {
            return [
            ...prevState,
            applyHoursToAssets({
              ...asset,
              originalGWP: asset.GWP,
              originalEP: asset.EP,
              originalAP: asset.AP,
              originalPOCP: asset.POCP,
              originalKEA: asset.KEA,
              originalNoise: asset.noise,
              originalCost: asset.cost,
              count: 1,
              hours: 1,
            }),
          ];
        }
      });
    };

// Funktion zur Aktualisierung der Betriebsstunden
const handleHoursChange = (assetName, newHours) => {
  setSelectedAsset((prevState) =>
    prevState.map((asset) =>
      asset.name === assetName
        ? applyHoursToAssets({
            ...asset,
            hours: parseFloat(newHours) || 1, // Aktualisiere die Stunden
          })
        : asset
    )
  );
  setShowhours(false);
};

// Funktion zur Aktualisierung der Anzahl
const handleCountChange = (assetName, newCount) => {
  setSelectedAsset((prevState) =>
    prevState.map((asset) =>
      asset.name === assetName
        ? applyHoursToAssets({
            ...asset,
            count: parseInt(newCount, 10) || 1, // Aktualisiere die Anzahl
          })
        : asset
    )
  );
};

useEffect(() => {
  console.log("Selected Assets:", selectedAsset);
}, [selectedAsset]);

    // Modal öffnen und schließen
   const handleOpenCustomAssetModal = () => {
    setShowCustomAssetForm(true);
  };

  const handleCloseCustomAssetModal = () => {
    setShowCustomAssetForm(false);
  };
    //Hinzufügen eines benutzerdefinierten Assetes
    const handleAddCustomAsset = () => {
      const {name, GWP, EP, AP, POCP, KEA, noise, cost} =customAsset;
     
      if (name && GWP && EP && AP && POCP && KEA && noise &&cost) {
      const newAsset = {
         name,
        count: 1,
        GWP:parseFloat(GWP),
        EP: parseFloat(EP),
        AP: parseFloat(AP),
        POCP: parseFloat(POCP),
        KEA: parseFloat(KEA),
        noise: parseFloat(noise),
        cost:parseFloat(cost),
        isCustom: true,// Makiert als Benutzerdefiniert
        
       };
        const existingAsset = assetList.find(asset=> asset.name ===name);
     
        if (existingAsset) {

        alert('Ein Asset mit diesem Namen existiert bereits.Bitte wähle einen anderen Namen.');
      }else{
        const updatedAssetList=[...assetList, newAsset];
        
        setAssetList(updatedAssetList);
        localStorage.setItem('assetList', JSON.stringify(updatedAssetList));

        setShowCustomAssetForm(false); // schließt das Formular
        setCustomAsset({ name: '', GWP: '', EP: '', AP: '', POCP: '',KEA: '',noise:'' , cost: '' }); // Zurücksetzen der Felder
       
        handleCloseCustomAssetModal();

      }
    } else {
      alert('Bitte fülle alle Felder für das benutzerdefinierte Asset aus.');
      }
    };

    

// handleRemoveItem - Asset entfernen
const handleRemoveItem = (assetName) => {
  setSelectedAsset(prevState => {
    const assetToRemove = prevState.find(asset => asset.name === assetName);
    
    if (assetToRemove) {
      const originalAssetData = assetList.find(asset => asset.name === assetName);

      if (assetToRemove.count > 1) {
        // Wenn die Anzahl größer als 1 ist, verringere die Anzahl und die Gesamtwerte
        return prevState.map(asset =>
          asset.name === assetName
            ? {
                ...asset,
                count: asset.count - 1,
                GWP: asset.GWP - originalAssetData.GWP,
                EP: asset.EP - originalAssetData.EP,
                AP: asset.AP - originalAssetData.AP,
                POCP: asset.POCP - originalAssetData.POCP,
                cost: asset.cost - originalAssetData.cost,
                totalGWP: asset.totalGWP - originalAssetData.GWP,
                totalEP: asset.totalEP - originalAssetData.EP,
                totalAP: asset.totalAP - originalAssetData.AP,
                totalPOCP: asset.totalPOCP - originalAssetData.POCP,
                totalKEA: asset.totalKEA - originalAssetData.KEA,
                totalnoise: asset.totalnoise - originalAssetData.noise,
                totalCost: asset.totalCost - originalAssetData.cost,
                
              }
            : asset
        );
      } else {
        // Wenn die Anzahl 1 ist, entferne das Asset vollständig
        return prevState.filter(asset => asset.name !== assetName);
      }
    }

    return prevState;
  });
};

//Entfernen des Beutzer definierten Asset
const removeCustomAsset = (assetName) => {
  const updatedAssetList = assetList.filter(asset => asset.name !== assetName);
 setAssetList (updatedAssetList);
 localStorage.setItem('assetList', JSON.stringify(updatedAssetList));

 const updatedSelectedAssets = selectedAsset.filter(asset => asset.name !== assetName);
  setSelectedAsset(updatedSelectedAssets);
  
};


// useEffect für Gesamtsummenberechnung
useEffect(() => {
  const totals = selectedAsset.reduce(
    (totals, asset) => {
      totals.totalGWP += asset.GWP || 0;
      totals.totalEP += asset.EP || 0;
      totals.totalAP += asset.AP || 0;
      totals.totalPOCP += asset.POCP || 0;
      totals.totalKEA += asset.KEA ||0;
      totals.totalnoise += asset.noise||0;
      totals.totalCost += asset.cost || 0;
      return totals;
    },
    {
      totalGWP: 0,
      totalEP: 0,
      totalAP: 0,
      totalPOCP: 0,
      totalKEA: 0,
      totalnoise: 0,
      totalCost: 0,
    }
  );

  setTotals(totals); // Gesamtsummen im State speichern
}, [selectedAsset]);


// Zum Laden des gespeicherten Zustands
  useEffect(() => {
    const savedStateName = localStorage.getItem('stateName');
    if (savedStateName) {
      const savedState = JSON.parse(localStorage.getItem(savedStateName));
      if (savedState) {
        restoreState(savedStateName); // Restore state from the saved state
      }
    }
  }, []);

  // Speichern des Zustands unter einem benutzerdefinierten Namen
  const saveState = (statename) => {
    if (!stateName) {
          console.error("Kein Zustandname angegeben!");
          return;
        } 

    const stateToSave = {
      Date,
      InputValue1,
      InputValue2,
      InputValue3,
      InputValue4,
      InputValue5,
     calculatedValues: totals,
      assets: selectedAsset,
      inputText,
      isSavedState: true, 
    };
    

    localStorage.setItem(stateName, JSON.stringify(stateToSave)); // Speichern des Zustands unter dem Namen
    
    alert(`State gespeichert: ${stateName}`);
    window.location.reload()
  };
  

  const restoreState = (stateName) => {
    const savedState = localStorage.getItem(stateName);  // Zustand aus localStorage holen
  
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);  // Zustand parsen
        console.log('Geladener Zustand:', parsedState);  // Zustand in der Konsole anzeigen
        

    const updatedTabData = {
      ...tabData,
      [activeTab]: {
        ...tabData[activeTab],
        ...parsedState // Hier die geparsten Daten dem aktiven Tab zuweisen
      }
    };
    setTabData(updatedTabData);

  } catch (error) {
    console.error("Fehler beim Parsen des gespeicherten Zustands:", error);
  }
} else {
  console.error("Kein Zustand mit diesem Namen gefunden!");
}
};

// Löschen des gespeicherten Zustands basierend auf dem Namen
const clearState = (stateName) => {
  localStorage.removeItem(stateName); // Löscht den Zustand aus localStorage
    setSavedStates(savedStates.filter((name) => name !== stateName)); // Entfernt den Namen aus der History-Liste
    alert('State gelöscht: ' + stateName);
};

// leert die EIngabefelder
const clearInputFields = () => {
  setDate("");
  setInputValue1("");
  setInputValue2("");
  setInputValue3("");
  setInputValue4("");
  setInputValue5("");
  setAssetHours("");
  setTotalGWP("");
  setTotalEP("");
  setTotalAP("");
  setTotalPOCP("");
  setTotalKEA("");
  setTotalCost("");
  setSelectedAsset([]); // Tabelle nit Assets Leeren
  setInputText("");  
  setStateName("");
  
 };
 // Lädt gespeicherte States und aktualisiert den Zustand
useEffect(() =>{
  const loadSavedStates = () => {
    const allKeys = Object.keys(localStorage);
    const validSavedStates = allKeys.filter((key) => {
      const state = JSON.parse(localStorage.getItem(key));
      return state && state.isSavedState;  // Nur die States mit "isSavedState" Flag anzeigen
    });

    setSavedStates(validSavedStates);  // Setzt die gespeicherten State-Namen im Status
  };

  loadSavedStates();  // Ruft die Funktion zum Laden der gespeicherten States auf
}, []);

const handleAssetClick = (asset) => {
  setSelectedAssetDetail(asset); // Das ausgewählte Asset wird im State gespeichert
};




  // Rendern der Komponente
  return (
    <React.Fragment>
      <div>
        <div className="tabs mb-4">
          {tabs.map((tab) => (
            <button 
              key={tab.id}
              className={activeTab === tab.id ? "tab active" : "tab"}
                onClick={() => handleTabClick(tab.id)}
            >
              {tab.name}
            </button>
          ))}
          <button class="tab" onClick={openPopup}>Maßnahme Hinzufügen</button>
        </div>
      </div>

{tabs.map((tab)=> tab.id===activeTab &&(
    <div  key={tab.id} className="tabContent">
      {tab.id === tabs[0].id &&(
<div>
  <div className="leftColumn1">
    <h3>Maßnahme</h3>
    <h2>Jahr der Maßnahme </h2>
    <label for="date-of-action">Datum der Maßnahme:</label>
     <input type="date" id="date-of-action" name="date-of-action"></input>
     <div class="form-floating mb-0">
    </div>
  <div className="rightColumn1"></div>
</div>
</div>
)}

{tab.id !== tabs[0].id &&(
    <div>
      <div className="leftColumn1">
        <h3 class="">Maßnahmen</h3>
        <label for="date-of-action">Datum der Maßnahme:</label>
        <input type="date" value={tabData[tab.id]?.date || ""} onChange={(e) => handleInputChange(e, "date")} id="date-of-action" name="date-of-action"></input>
        <div class="form-floating mb-0">
          <textarea  value= {tabData[tab.id]?.inputText} onChange={(e) =>  handleInputChange(e, "inputText")} class="form-control" placeholder="Maßnahme beschreiben" style={{height: '100px'}}></textarea>
          <label for="floatingTextarea2">Beschreibung der Maßnahme</label>
          <div class="invalid-feedback">
            Beschreibung der Maßnahme.
          </div>
          </div>
          <h3>Assets</h3>
                  <button onClick={handleOpenExistingAssetsModal} id="AssetsSelect" >Asset mit Zeit aus der Datenbank einfügen</button>
                  
            <div className="input-group-sm mb-3">
                <span className="input-group-text">Fixkosten[€]</span>           
                <div className="form-floating">
                  <input type="number" className="form-control"value={tabData[tab.id]?.InputValue2} id="input2" placeholder=""  onChange={(e) => handleInputChange(e, "InputValue2")} required/>
                  <label htmlFor="input2"></label>
                  <div className="invalid-feedback"></div>
                </div>
              </div>
            <h3>Externe Berchnungen </h3>      
                <div><input className="form-control"> Externen Kosten</input>{/*einfügen der verbindung zur berechnung */}
                <input className="form-control"> Verkehrsbedingte Emissionen </input>{/*einfügen der verbindung zur berechnung */}
         
        <div>
        <a href="/">
          <button  className="btn btn-sm btn-light" style={{ float: 'left', width: '49%', whiteSpace: 'nowrap' }}>Zurück zum Hauptmenü</button>
        </a>
        <a href="/calculate"> 
         <button className="btn btn-sm btn-light" style={{ float: 'right', width: '49%' }} >Auswerten</button>
         </a>
        </div>
      </div>
      </div>

     <div className="rightColumn1"> 
      <div className="AWF1r">      
    <div style = {{display: "flex", flexDirection: "column"}}>
              <div className="tableAssets">
              <h3 style={{ margin: '10px 0 20px 0' }}>Genutzte Assets (Metadaten pro h) </h3> 
              <table id = "itemTable" ref ={itemTable} style={{ width: '100%' }} className="table table-striped">
                <thead>
                <tr style={{ height: '40px' }}>
                <th>Assets</th>
                <th>Anzahl</th>
                <th>Emissionen:</th>
                <th>GWP[KgCO₂/h ]</th>
                <th>EP [Kg/h]</th>
                <th>AP [Kg/h]</th>
                <th>POCP [Kg/h]</th>
                <th>KEA [MJ]</th>
                <th>Lärmbeeinträchtigung [dB]</th>
                <th>Kosten[€/h]</th>
                <th>Aktionen</th>
              </tr>
              </thead>
              <tbody> {selectedAsset && selectedAsset.length > 0 ? (
        selectedAsset.map((asset, index) => (
          <tr key={index}>
            <td>
              <span 
                onClick={() => handleAssetClick(asset)} 
                style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
              >
                {asset.name}
              </span>
            </td>
            <td>{asset.count}</td>
            <td></td>
            <td>{(asset.GWP).toFixed(4)}</td>
            <td>{(asset.EP).toFixed(4)}</td>
            <td>{(asset.AP).toFixed(4)}</td>
            <td>{(asset.POCP).toFixed(4)}</td>
            <td>{(asset.KEA).toFixed(4)}</td>
            
            <td>{(asset.cost).toFixed(2)}</td>
            <td>
              <button onClick={() => handleRemoveItem(asset.name)}>Entfernen</button>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="10" style={{ borderTop: '3px' }}>Keine Assets gefunden</td>
        </tr>
      )}
              <tr>
              <th>Gesamtsummen</th>
              <th></th>
              <th></th>
              <th> {totals.totalGWP.toFixed(4)} </th>
              <th>{totals.totalEP.toFixed(4)}</th>
              <th>{totals.totalAP.toFixed(4)}</th>
              <th>{totals.totalPOCP.toFixed(4)}</th>
              <th>{totals.totalKEA.toFixed(4)}</th>
              <th> {totals.totalCost}</th>
              <th></th>
              </tr>
              </tbody>
              </table> 
           </div>
          </div>



          <div className="AssetProfile">
          {selectedAssetDetail && (
      <div className="asset-detail">
        <h2 class="asset-title">Asset Steckbrief</h2>
        <div class="asset-profile">
        <div class="asset-image">
          <img src="asset-image-url.jpg" alt="Asset Name" />
        </div>
        <div className="asset-info">
          <h3 classname="asset-name">{selectedAssetDetail.name}</h3>
          <div class="asset-details">
        <p><strong>Globales Erwärmungspotential:</strong> {selectedAssetDetail.GWP} Kg CO₂</p>
        <p><strong>Eutrophierungspotential:</strong> {selectedAssetDetail.EP} Kg</p>
        <p><strong>Versauerungspotential:</strong> {selectedAssetDetail.AP} Kg </p>
        <p><strong>Ozonbildungspotential:</strong> {selectedAssetDetail.POCP}Kg </p>
        <p><strong>Kumulierter Energieaufwand:</strong> {selectedAssetDetail.KEA}MJ </p>
        <p><strong>Kosten:</strong> {selectedAssetDetail.cost} €</p>
        <p><strong>Anzahl:</strong> {selectedAssetDetail.count}</p>
        <p><strong>Verwendungszweck:{selectedAssetDetail.purpose}</strong></p>
    
         </div>
        </div>
       </div>
       
       </div> 
        )}
      </div>   
      </div> 
</div>    
 {showhours && (
                <div className="modal">
                  <div className="modal-content">
                    <h3>Betriebszeiten der Assets auschreiben </h3>
                    <table id="itemTable" ref={itemTable} style={{ width: '100%' }} className="table table-striped">
                    <thead>
                    <tr>
                      <th>Asset Name</th>
                      <th>Betriebszeit in stunden </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedAsset.length > 0 ? (
                      selectedAsset.map((asset, index) => (
                        <tr key={index}>
                          <td>{asset.name}</td>
                            <td>
                              <input
                                type= "number"
                                value={asset.hours||''}
                                onChange={(e) =>handleHourChange (asset.name,parseFloat(e.target.value)||0)}
                                placeholder="Betriebszeit"
                              />
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
                    <button onClick={handleHoursChange}>Speichern und Anwenden</button>
                    <button onClick={closehours}>Abbrechen</button>
                  </div>
                </div>
              )}


        {showPopup && (
                <div className="modal">
                  <div className="modal-content">
                    <h3>Neue Maßnahme auswählen</h3>
                    <input
                      type="text"
                      value={newTabTitle}
                      onChange={(e) => setNewTabTitle(e.target.value)}
                      placeholder="Maßnahme eingeben"
                    />
                    <button onClick={createNewTab}>Tab erstellen</button>
                    <button onClick={closePopup}>Abbrechen</button>
                  </div>
                </div>
              )}

                {showExistingAssetsModal && (
            <div className="modal">
              <div className="modal-content">
                <h1>Wählen Sie ein bestehendes Asset aus</h1>
                <table id="itemTable" ref={itemTable} style={{ width: '100%' }} className="table table-striped">
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
                          <td>{asset.isCustom&&(
                            < button onClick= {()=> removeCustomAsset(asset.name)}>Entfern</button>)}</td>
                          <td><button onClick={() => handleAddAsset (asset)}>Auswählen</button></td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="2">Keine Assets verfügbar.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
                <button onClick={handleCloseExistingAssetsModal}>Schließen</button>
              </div>
            </div>
          )}
          

          {showCustomAssetForm && (
            <div className="modal" >
              <div className="modal-content">
            <h2>Neues benutzerdefiniertes Asset hinzufügen</h2>
            <input type="text" placeholder="Name" value={customAsset.name} onChange={(e) => setCustomAsset({ ...customAsset, name: e.target.value })} />
            <input type="number" placeholder="GWP" value={customAsset.GWP} onChange={(e) => setCustomAsset({ ...customAsset, GWP: e.target.value })} />
            <input type="number" placeholder="EP" value={customAsset.EP} onChange={(e) => setCustomAsset({ ...customAsset, EP: e.target.value })} />
            <input type="number" placeholder="AP" value={customAsset.AP} onChange={(e) => setCustomAsset({ ...customAsset, AP: e.target.value })} />
            <input type="number" placeholder="POCP" value={customAsset.POCP} onChange={(e) => setCustomAsset({ ...customAsset, POCP: e.target.value })} />
            <input type="number" placeholder="KEA" value={customAsset.KEA} onChange={(e) => setCustomAsset({ ...customAsset, KEA: e.target.value })} />
            <input type="number" placeholder="Cost" value={customAsset.cost} onChange={(e) => setCustomAsset({ ...customAsset, cost: e.target.value })} />
            <button onClick={handleAddCustomAsset}>Hinzufügen</button>
            <button onClick={() => handleCloseCustomAssetModal(false)}>Abbrechen</button>
          </div>
        </div>
          )}
          </div>
        )}
        
         </div> 
       

    
      
    
))}
    </React.Fragment>
  );
 };

export default DefinitionPage;