//created on 2025-06-18, to define the data in Maßnahme Tab

import { useEffect, useContext } from "react";
import { AppContext } from "../AppProvider";


const MassnahmeTab = () => {
  const { containerId, projectId,
    massnahmeVariante, setMassnahmeVariante
  } = useContext(AppContext);
  //massnahmeVariante: Store Massnahme & Variante info of target container from ontology, 2025-06-18
  /*massnahmeVariante Format: 
  { 
    description:"", 
    varianten: [{
      activity: [{
        activityName:"",
        ifcFile:"",
        indicatorSet:[{ indicatorSetName:"", indicators:[] }],
        guids:[]
      }] 
    }] 
  } */

  /*const [description, setDescription] = useState('Die Betondeckensanierung umfasst das Entfernen beschädigter Betonschichten durch Fräsen, Schleifen oder Hochdruckwasserstrahlen und das erneute Auftragen von Beton oder Spezialmörtel. Sie dient dazu, Risse, Abplatzungen oder Korrosion der Bewehrung zu beheben und die Tragfähigkeit sowie Langlebigkeit der Betonoberfläche zu sichern.');//temp for testing, */

  useEffect(() => {
    queryMassnahmeVariante();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //Quary all Massnahme & Variante Ontology info,  added, 2025-06-18
  const queryMassnahmeVariante = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Authentication token is missing.');
      }

      if (!containerId) {
        throw new Error('Container ID is required.');
      }

      // Define the JSON data 
      const massnahmeVarianteTemp = {
        description: "",
        varianten: [],
        bestandsmodell: []
      };

      //Part 1: Query description (Done, 2025-06-18)
      const queryDes = `
        PREFIX grit: <https://greeninfratwins.com/ns/grit#>
        SELECT ?desMeasure 
        WHERE {
          ?defMeasure a grit:Measure ;
          rdfs:comment ?desMeasure .
        } 
      `;
      const urlDes = `https://icdd.vm.rub.de/dev01/api/v1/projects/${projectId}/containerTypes/0/containers/${containerId}/query?query=${encodeURIComponent(queryDes)}`;
      const responseDes = await fetch(urlDes, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!responseDes.ok) {
        throw new Error(`HTTP error! Status: ${responseDes.status}`);
      }
      const filesDes = await responseDes.json();
      const valueDes = filesDes.results?.bindings[0]?.desMeasure?.value;
      massnahmeVarianteTemp.description = valueDes;
      console.log("Print Description Ontology data: ", valueDes);

      //Part 1.5 Find Bestandsmodel

      const query = `
        PREFIX ct: <https://standards.iso.org/iso/21597/-1/ed-1/en/Container#>
        PREFIX grit: <https://greeninfratwins.com/ns/grit#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

        SELECT DISTINCT ?ifcName WHERE {
          ?container ct:containsDocument ?ifcModel .
          ?ifcModel a ct:InternalDocument ;
                    ct:name ?ifcName ;
                    ct:filetype ?filetype .

          FILTER (LCASE(STR(?filetype)) = "ifc")

          OPTIONAL {
            ?measure grit:hasMeasureVariant ?variant .
            ?variant grit:involvesActivities ?activity .
            ?activity grit:hasIcddModelID ?ifcName .
          }

          FILTER (!BOUND(?variant))
        }
      `;

      const url = `https://icdd.vm.rub.de/dev01/api/v1/projects/${projectId}/containerTypes/0/containers/${containerId}/query?query=${encodeURIComponent(query)}`;

      try {
        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Extrahieren der Modellnamen als Array
        const namesArray = data.results.bindings.map(
          (item) => item.ifcName.value
        );
        massnahmeVarianteTemp.bestandsmodell = namesArray;
        console.log(namesArray);
      } catch (err) {
        console.log(err.message);
      }


      //Part 2: Query for all Maßnahme & Variante info (Done, 2025-06-18)
      const queryUbersicht = `
        PREFIX grit: <https://greeninfratwins.com/ns/grit#>
        SELECT ?nameMeasureVariant ?varMeasure ?nameActivity ?icddIFCDocID ?nameIndicatorSet ?nameIndicator ?defActivity
        WHERE {
          ?defMeasure a grit:Measure ;
          grit:hasMeasureVariant ?varMeasure .
          ?varMeasure           rdfs:label ?nameMeasureVariant ;
          grit:involvesActivities ?defActivity .
          ?defActivity rdfs:label ?nameActivity ;
          grit:hasIcddModelID ?icddIFCDocID ;
          grit:hasIndicatorSet ?defIndicatorSet ;
          rdfs:label                ?nameActivity .
          ?defIndicatorSet grit:hasIndicator ?defIndicator ;
          rdfs:label ?nameIndicatorSet .
          ?defIndicator rdfs:label ?nameIndicator .
        }
      `;
      const urlUbersicht = `https://icdd.vm.rub.de/dev01/api/v1/projects/${projectId}/containerTypes/0/containers/${containerId}/query?query=${encodeURIComponent(queryUbersicht)}`;
      const responseUbersicht = await fetch(urlUbersicht, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!responseUbersicht.ok) {
        throw new Error(`HTTP error! Status: ${responseUbersicht.status}`);
      }
      const filesUbersicht = await responseUbersicht.json();

      console.log("Print Ubersicht Ontology data: ", filesUbersicht);

      filesUbersicht.results?.bindings?.forEach(binding => {
        const variantName = binding.nameMeasureVariant.value;
        const activityName = binding.nameActivity.value;
        const variantUrl = binding.varMeasure.value;
        const activityUrl = binding.defActivity.value;
        const ifcFile = binding.icddIFCDocID.value;
        const indicatorSetName = binding.nameIndicatorSet.value;
        const indicator = binding.nameIndicator.value;

        // Find or create the variant
        let variant = massnahmeVarianteTemp.varianten?.find(v => v.nameMeasureVariant === variantName);
        if (!variant) {
          variant = { nameMeasureVariant: variantName, urlMeasureVariant: variantUrl, activity: [] };
          massnahmeVarianteTemp.varianten.push(variant);
        }

        // Find or create the activity
        let activity = variant.activity.find(a => a.activityName === activityName && a.ifcFile === ifcFile);
        if (!activity) {
          activity = { activityName, ifcFile, indicatorSet: [], activityUrl: activityUrl };
          variant.activity.push(activity);
        }

        // Find or create the indicator set
        let indicatorSet = activity.indicatorSet.find(i => i.indicatorSetName === indicatorSetName);
        if (!indicatorSet) {
          indicatorSet = { indicatorSetName, indicators: [] };
          activity.indicatorSet.push(indicatorSet);
        }

        // Add indicator if not already present
        if (!indicatorSet.indicators.includes(indicator)) {
          indicatorSet.indicators.push(indicator);
        }
      });

      console.log("Print massnahmeVarianteTemp: ", massnahmeVarianteTemp);

      setMassnahmeVariante(massnahmeVarianteTemp);
    } catch (err) {
      console.error('Error fetching measure variants:', err.message);
    }
  };


  return (

    <div className="h-100">
      <div style={{overflow:"scroll", height:"90%", overflowX:"clip"}} className="pe-3 m-0"> 
      <h3 className="measure">Beschreibung</h3>
      {/*  {index === 0 &&(<button onClick={openmeasure} >wählen sie ihre Maßnhame</button>)}*/}
      <div className="text-muted text-break fw-lighter text-justify">
        {!massnahmeVariante
          ? (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "50px" }}>
              <div className="spinner-border text-secondary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )
          : massnahmeVariante.description
        }
      </div>

      {/*  added start, for basic requirment 4, 2025-06-13, update with actiually value on 2025-06-18*/}
      <h3 className="measure mt-3">Varianten der Maßnahme</h3>
      
      {massnahmeVariante?.varianten?.map((variant, vIndex) => (
        <div key={vIndex} className="mx-2 my-3">
          <div className="card">
            {/* Titel der Variante */}
            <div className="card-header">
              <h5 className="mb-0">Variante {vIndex + 1}: {variant.nameMeasureVariant}</h5>
            </div>

            {/* Tabellenkopf */}
            <div className="card-body p-0">
              <div className="row fw-bold py-2 mx-0">
                <div className="col-md-4">Ausgeführte Aktivität</div>
                <div className="col-md-7 py-0 my-0 border-1 border-start">Verknüpftes IFC-Modell</div>
              </div>

              {/* Aktivitätenzeilen */}
              {variant.activity.map((act, aIndex) => (
                <div className="row py-2 mx-0 border-1 border-top" key={aIndex}>
                  <div className="col-md-4">{act.activityName}</div>
                  <div className="col-md-7 py-0 my-0 border-1 border-start"><code>{act.ifcFile}</code></div>
                </div>
              ))}
            </div>
          </div>
        </div>



      ))}
      

      {/*  added start, for basic requirement 4, 2025-06-13, update with actual value on 2025-06-18 */}
{massnahmeVariante?.bestandsmodell && massnahmeVariante.bestandsmodell.length > 0 && (
  <>
    <h3 className="measure mt-3">Bestandsmodelle</h3>
    <div className="card">
      <div className="card-body">
        {/* Tabellenkopf */}
        <div className="row fw-bold py-2 mx-0">
          <div className="col-md-4">Typ</div>
          <div className="col-md-7 py-0 my-0 border-1 border-start">Verknüpftes IFC-Modell</div>
        </div>

        {/* Aktivitätenzeilen */}
        {massnahmeVariante.bestandsmodell.map((model, mIndex) => (
          <div className="row py-2 mx-0 border-1 border-top" key={mIndex}>
            <div className="col-md-4">Bestandsmodell</div>
            <div className="col-md-7 py-0 my-0 border-1 border-start">
              <code>{model}</code>
            </div>
          </div>
        ))}
      </div>
    </div>
  </>
)}

</div>


      {/*  added end, for basic requirment 4, 2025-06-13*/}
    </div>

  );
};

export default MassnahmeTab;