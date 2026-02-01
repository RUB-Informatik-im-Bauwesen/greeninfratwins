
/*function extractMaterialCodes(materialData) {
  return [...new Set(materialData.map(item => item.code))];
}*/

function groupMaterialByCode(materialData) {
  //check if any same code, if yes, then sum up the mass_t, concrete_t and steel_t
  //merge the arrays with same code
  const grouped = materialData.reduce((acc, item) => {
    if (!acc[item.Material]) {
      acc[item.Material] = { ...item };
    } else {
      acc[item.Material].BituminoeseMischungen += item.BituminoeseMischungen;
      acc[item.Material].Kunststoffe += item.Kunststoffe;
      acc[item.Material].Metalle += item.Metalle;
      acc[item.Material].MineralischeBaustoffe += item.MineralischeBaustoffe;
    }
    return acc;
  }, {});

  //merge the arrays with same code


  return grouped;
}

//check
//If steel_t and concrete_t are both 0, then mass_t with orignial value;
//If one of steel_t or concrete_t  is not 0, then mass_t is 0;
//Make sure all the inputs are float numbers
function updateMass_t(code, Materiallass, mass_t, steel_t, concrete_t) {
  let result = {
    Material: code,
    MineralischeBaustoffe: 0, //concrete_t
    Metalle: 0,//steel_t
    Kunststoffe: 0, //mass_t
    BituminoeseMischungen: 0 //mass_t with "Bituminöse" class
  };

  if (steel_t === 0 && concrete_t === 0) {
    if (Materiallass === "Bituminöse") {
      result.BituminoeseMischungen = mass_t;
    } else {
      result.Kunststoffe = mass_t;
    }
  } else {
    result.Metalle = steel_t;
    result.MineralischeBaustoffe = concrete_t;
  }
  return result
}

/**
 * Berechnet die Masse eines Materials während der Demontage (D4).
 * Formel:
 * Masse = Volumen * Dichte
 * 
 * Betonmasse: 
 * Material “Beton”: Volumen * Dichte  
 * Material “Stahlbeton”: Volumen * Dichte * (1-Bewehrungsgrad)
 *
 * Stahlmasse:
 * Material “Stahl”: Masse
 * Material “Stahlbeton”: Volumen * Dichte * Bewehrungsgrad"
 *
 * Parameter:
 * - Volumen: Demontiertes Volumen in m³
 * - Dichte: Materialdichte in kg/m³ (z.B. Beton = 2400 kg/m³)
 * 
 * Rückgabewert:
 * - Masse des Materials in kg
 * 
 * 
 * Beispiel:
 * const betonMasse = calcMaterialMasse(10, 2400, 0); // → 24.000 kg
 * const betonMasse = calcMaterialMasse(10, 2400, 0.5); // → 12.000 kg
 */
export function calcMaterialMasse(materialData) {
  /*{
    Material: "",//code
    MineralischeBaustoffe: 0, //concrete_t
    Metalle: 0,//steel_t
    Kunststoffe: 0, //mass_t
    BituminoeseMischungen: 0 //mass_t with "Bituminöse" class
  }*/
  let results = [];

  //step 0: make all the values float type
  materialData?.map(item => {
    item.mass_t = parseFloat(item.mass_t) || 0;
    item.steel_t = parseFloat(item.steel_t) || 0;
    item.concrete_t = parseFloat(item.concrete_t) || 0;
  });

  //Step 1: update mass_t

  materialData?.map(item => {
    results?.push(updateMass_t(item.code, item.class, item.mass_t, item.steel_t, item.concrete_t));
  });
  console.log("update mass:", results);

  //Step 2: check if any same code, if yes, then sum up the mass_t, concrete_t and steel_t
  const sameCodeItems = groupMaterialByCode(results);
  console.log("same:", sameCodeItems);

  return Object.values(sameCodeItems);
};

/**
 * Berechnet den prozentualen Anteil eines Materials an der Gesamtmasse des Bauwerks.
 * 
 * Formel:
 * MaterialBauwerks = (Materialmasse / Gesamtmasse) * 100
 * 
 * Parameter:
 * - Materialmasse: Masse des betrachteten Materials in kg
 * - Gesamtmasse: Gesamtmasse des Bauwerks in kg
 * 
 * Rückgabewert:
 * - Prozentualer Anteil des Materials (0-100)
 * 
 * Beispiel:
 * const anteil = calcMaterialBauwerks(1200, 5000); // → 24
 */
{/*export function calcMaterialBauwerks(Materialmasse) {
  const mineralMass = Materialmasse.materialMasses.MineralischeBaustoffe;
  const metalMass = Materialmasse.materialMasses.Metalle;
  const bitumenMass = Materialmasse.materialMasses.BituminoeseMischungen;
  const totalMineral = mineralMass.reduce((sum, val) => sum + val, 0);
  const totalMetal = metalMass.reduce((sum, val) => sum + val, 0);
  const totalBitumen = bitumenMass.reduce((sum, val) => sum + val, 0);

  const totalMass = Materialmasse.totalMass;
  const mineralPercent = ((totalMineral / totalMass) * 100).toFixed(2);
  const metalPercent = ((totalMetal / totalMass) * 100).toFixed(2);
  const bitumenPercent = ((totalBitumen / totalMass) * 100).toFixed(2);
  return [
            `${mineralPercent}%`,
            `${metalPercent}%`,
            `${bitumenPercent}%`,
        ];
}*/}

// get the latest date material from the array
export function getLatestDateMaterial(dateArray) {
  if (!Array.isArray(dateArray) || dateArray.length === 0) {
    return null;
  }

  const latestItem = dateArray.reduce((latest, current) => {
    const currentDate = new Date(current.Stichtag);
    const latestDate = new Date(latest.Stichtag);
    return currentDate > latestDate ? current : latest;
  });

  return latestItem.Material;
}

/**
 * Berechnet den monetären Restwert eines Materials nach der Demontage (D4-Phase).
 * 
 * Formel:
 * Restwert = Materialmasse * Restwert_pro_Einheit
 * 
 * Parameter:
 * - Materialmasse: Menge des demontierten Materials (z.B. in kg, m³)
 * - Restwert_pro_Einheit: Wiederverkaufswert pro Einheit (EUR/kg, EUR/m³ etc.)
 * 
 * Rückgabewert:
 * - Gesamtrestwert in EUR
 * 
 * Beispiel:
 * const wert = calcRestwert(500, 0.8); // → 400 EUR (500kg * 0.8EUR/kg)
 */
export function calcRestwert(Materialmasse, Kalkulationsblatt_Restwerte) {
  const material = [];
  const mineralMass = [];
  const metalMass = [];
  const kunststoffeMass = [];
  const bitumenMass = [];

  Materialmasse?.map(itemM => {
    material.push(itemM.Material);
    mineralMass.push(itemM.MineralischeBaustoffe);
    metalMass.push(itemM.Metalle);
    kunststoffeMass.push(itemM.Kunststoffe);
    bitumenMass.push(itemM.BituminoeseMischungen);
  });

  const massMapping = {
    "Mineralische Baustoffe": mineralMass,
    "Metalle": metalMass,
    "Kunststoffe": kunststoffeMass,
    "Bituminöse Mischungen": bitumenMass
  };

  const restwertMapping = {};
  Kalkulationsblatt_Restwerte.forEach(item => {
    restwertMapping[item.Name] = item.Restwert;
  });

  let MaterialRestwert = [];

  for (let j = 0; j < material.length; j++) {
    let materialRestwert = 0;

    for (const [materialType, massArray] of Object.entries(massMapping)) {
      const restwert = restwertMapping[materialType] || 0;
      materialRestwert += (massArray[j] || 0) * restwert;
    }

    MaterialRestwert.push(materialRestwert);
  }

  const totalRestwert = MaterialRestwert.reduce((sum, val) => sum + val, 0);
  let MRW = 0;
  let MaterialRestwertPercent = [];
  for (let i = 0; i < MaterialRestwert.length; i++) {
    MRW = ((MaterialRestwert[i] / totalRestwert) * 100).toFixed(2);
    MaterialRestwertPercent.push(MRW);
  }

  return {
    totalRestwert: totalRestwert.toFixed(2),
    Restwert: {
      Restwert_Material: material,
      Restwert_EUR: MaterialRestwert,
      Restwert_Percent: MaterialRestwertPercent
    }
  }
}


/**
 * Berechnet die Masse von Schad- und Risikostoffen in einem Material (D4-Phase).
 * 
 * Formel:
 * Schadstoffmasse = Materialmasse * Schadstoffanteil
 * 
 * Parameter:
 * - Materialmasse: Gesamtmasse des Materials in kg
 * - Schadstoffanteil: Anteil der Schadstoffe im Material (0-1)
 * 
 * Rückgabewert:
 * - Masse der Schadstoffe in kg
 * 
 * Beispiel:
 * const schadstoffMasse = calcSchadstoffMasse(1000, 0.05); // → 50 kg
 */
{/*export function calcSchadstoffMasse(Code_GrIT_L2, Code_GrIT_L3) {
  if (Code_GrIT_L2 == "AUS") {
    if(Code_GrIT_L3.KAP) {
      return "Chloridbelasteter Beton";
    }
  }

  else if (Code_GrIT_L2 == "UNT") {
    if(Code_GrIT_L3.WID) {
      return "Taubenkot";
    }
  }
}*/}

/**
 * Berechnet die demontierbare Masse nach Bauteilklassen (D4-Phase).
 * 
 * Formel:
 * Demontierbare_Masse = Volumen * Dichte * Demontagefaktor
 * 
 * Parameter:
 * - Volumen: Volumen des Bauteils in m³
 * - Dichte: Materialdichte in kg/m³
 * - Demontagefaktor: Faktor für Demontagefähigkeit (0-1)
 * 
 * Rückgabewert:
 * - Demontierbare Masse in kg
 * 
 * Beispiel:
 * const masse = calcDemontierbareMasse(5, 2400, 0.8); // → 9600 kg (5m³ Beton mit 80% Demontagefähigkeit)
 */
{/*export function calcDemontierbareMasse(Materialmasse) {
  const mineralMass = Materialmasse.materialMasses.MineralischeBaustoffe;
  const metalMass = Materialmasse.materialMasses.Metalle;
  const bitumenMass = Materialmasse.materialMasses.BituminoeseMischungen;
  const PK = Materialmasse.KategorieDemontagefreundlichkeit;

  let Optimiert = [];
  let Verbessert = [];
  let Standard = [];
  let Eingeschränkt = [];
  let Problematisch = [];
  let NichtBewertbar = [];
  
  for (let i =0; i< PK.length; i++) {
    const totalMass = mineralMass[i] + metalMass[i] + bitumenMass[i];
    if (PK[i] === "Optimiert") {
      Optimiert.push(totalMass);
    } else if (PK[i] === "Verbessert") {
      Verbessert.push(totalMass);
    } else if (PK[i] === "Standard") {
      Standard.push(totalMass);
    } else if (PK[i] === "Eingeschränkt") {
      Eingeschränkt.push(totalMass);
    } else if (PK[i] === "Problematisch") {
      Problematisch.push(totalMass);
    } else if (PK[i] === "NichtBewertbar") {
      NichtBewertbar.push(totalMass);
    }
  }

  return {
    Masse: {
      NamedNodeMap:['Optimiert', 'Verbessert', 'Standard', 'Eingeschränkt', 'Problematisch', 'NichtBewertbar'],
      Masse:{Optimiert, Verbessert, Standard, Eingeschränkt, Problematisch, NichtBewertbar}
    }
  }
}*/}

/**
 * Berechnet die Kreislauffähigkeit eines Materials basierend auf Recycling- und Verwertungsanteilen (D4-Phase).
 * 
 * Formeln:
 * - Recyclingmasse = Materialmasse * Recyclinganteil
 * - Verwertungsmasse = Materialmasse * Verwertungsanteil
 * - Gesamtkreislauffähigkeit = (Recyclingmasse + Verwertungsmasse) / Materialmasse * 100
 * 
 * Parameter:
 * - Materialmasse: Masse des Materials in kg
 * - Recyclinganteil: Anteil des stofflichen Recyclings (0-1)
 * - Verwertungsanteil: Anteil der energetischen Verwertung (0-1)
 * 
 * Rückgabewert:
 * - Objekt mit Einzelmassen und Gesamtanteil in %
 * 
 * Beispiel:
 * const result = calcKreislauffaehigkeit(1000, 0.6, 0.3);
 * // → { recycling: 600, verwertung: 300, gesamtanteil: 90% }
 */
{/*export function calcKreislauffaehigkeit(Materialmasse) {
  const mineralMass = Materialmasse.materialMasses.MineralischeBaustoffe;
  const metalMass = Materialmasse.materialMasses.Metalle;
  const bitumenMass = Materialmasse.materialMasses.BituminoeseMischungen;
  const PK = Materialmasse.KategoriePotentielleKreislauffähigkeit;
  
  let Wiederverwendung = [];
  let WerkstofflicheQualitativeWiederverwendung = [];
  let StofflicheWeiterverwendung = [];
  let ThermischeVerwertung = [];
  let Verfüllung = [];
  let Deponierung = [];
  let EntsorgungGefährlicherAbfall = [];
  
  for (let i =0; i< PK.length; i++) {
    const totalMass = mineralMass[i] + metalMass[i] + bitumenMass[i];
    if (PK[i] === "Wiederverwendung") {
      Wiederverwendung.push(totalMass);
    } else if (PK[i] === "WerkstofflicheQualitativeWiederverwendung") {
      WerkstofflicheQualitativeWiederverwendung.push(totalMass);
    } else if (PK[i] === "StofflicheWeiterverwendung") {
      StofflicheWeiterverwendung.push(totalMass);
    } else if (PK[i] === "ThermischeVerwertung") {
      ThermischeVerwertung.push(totalMass);
    } else if (PK[i] === "Verfüllung") {
      Verfüllung.push(totalMass);
    } else if (PK[i] === "Deponierung") {
      Deponierung.push(totalMass);
    }else if (PK[i] === "EntsorgungGefährlicherAbfall") {
      EntsorgungGefährlicherAbfall.push(totalMass);
    }
  }

  return {
    Masse: {
      NamedNodeMap:['Wiederverwendung', 'WerkstofflicheQualitativeWiederverwendung', 
        'StofflicheWeiterverwendung', 'ThermischeVerwertung', 'Verfüllung', 
        'Deponierung','EntsorgungGefährlicherAbfall'],
      Masse:{Wiederverwendung, WerkstofflicheQualitativeWiederverwendung, 
        StofflicheWeiterverwendung, ThermischeVerwertung, Verfüllung, 
        Deponierung, EntsorgungGefährlicherAbfall}
    }
  };
}*/}