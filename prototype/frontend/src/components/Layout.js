import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation  } from 'react-router-dom'; //useLocation new added, 2025-03-11
import "./Layout.css";
import logo from "../images/GreenInfraTwins_Logo_transparent.png";
import { FaSignInAlt, FaSignOutAlt, FaUser, FaLayerGroup } from "react-icons/fa";
import ProjectsDialog from "./ProjectsDialog";
import { AppContext } from "../AppProvider";
import { FaCodeCommit, FaSection } from "react-icons/fa6";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();  // Get the current route path, new added, 2025-03-11

  // Zustandsvariablen
  const { projectId, setProjectId, isLoggedIn, setIsLoggedIn 
    /*new added , 2025-01-22 */, ifcFiles, setIfcFiles, projectName, setProjectName, 
    containerName, setContainerName, setContainerId } //use ifcFiles instead of ifcViewerFiles
    = useContext(AppContext); //, selectedFiles, setSelectedFiles (2025-01-22, replace selectedFiles by ifcViewerFiles)
  
    const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  //const [projectName, setProjectName] = useState("");
  //const [containerName, setContainerName] = useState("");
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [error, setError] = useState(null);
  const [showProjectsDialog, setShowProjectsDialog] = useState(false);

  //const [selectedFile, setSelectedFile] = useState(null);
  //const [selectedFiles, setSelectedFiles] = useState([]);//multi-file selection, 2024-11-13

   const [info, setInfo] = useState(null);

  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/static/commit.json`)
      .then((res) => res.json())
      .then((data) => setInfo(data))
      .catch(() => setInfo(null));
  }, [location]);


  // Effekt zum Überprüfen des Login-Status beim Laden der Komponente
useEffect(() => {
    console.log("Layout location changed:", location);
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);
  }, [location]);


  // Funktion zum Behandeln des Login-Vorgangs
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://icdd.vm.rub.de/dev01/api/v1/Auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Anmeldung fehlgeschlagen');
      }

      const data = await response.json();

      if (data.token) {
        localStorage.setItem('authToken', data.token);
        setIsLoggedIn(true);
        setShowLoginForm(false);
        setError(null);
        navigate('/');
      } else {
        throw new Error('Token not found in response');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Funktion zum Behandeln des Logout-Vorgangs
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
    setUsername("");
    setContainerId(null);
    setProjectId(null);
    //setSelectedFiles([]);
    setIfcFiles([]); // added, 2025-03-11
    navigate('/');
  };

  // Funktion zum Behandeln der Projektauswahl
  const handleProjectSelect = (projectId) => {
    setProjectId(projectId);
    setShowProjectsDialog(false);
  };

  // Funktion zum Behandeln der Dateiauswahl
  /*const handleFileSelect = (file) => {
    
    console.log("File selected:", file);  // Debug log

    if (file instanceof File || file instanceof Blob) {
      // Wenn es ein File- oder Blob-Objekt ist, als ArrayBuffer lesen
      const reader = new FileReader();
      reader.onload = (event) => {
        const arrayBuffer = event.target.result;
        setSelectedFile(new Uint8Array(arrayBuffer));
      };
      reader.readAsArrayBuffer(file);
    } else if (file instanceof ArrayBuffer) {
      // Wenn es bereits ein ArrayBuffer ist, in Uint8Array konvertieren
      setSelectedFile(new Uint8Array(file));
    } else if (file instanceof Uint8Array) {
      // Wenn es bereits ein Uint8Array ist, direkt verwenden
      setSelectedFile(file);
    } else if (typeof file === 'string') {
      // Wenn es ein String ist (möglicherweise eine URL oder base64), als solches übergeben
      setSelectedFile(file);
    } else if (file && file.content instanceof Blob) {
      // Wenn es ein Objekt mit einer content-Eigenschaft ist, die ein Blob ist
      const reader = new FileReader();
      reader.onload = (event) => {
        const arrayBuffer = event.target.result;
        setSelectedFile(new Uint8Array(arrayBuffer));
      };
      reader.readAsArrayBuffer(file.content);
    } else if (file && typeof file.url === 'string') {
      // Wenn es ein Objekt mit einer url-Eigenschaft ist, die ein String ist
      setSelectedFile(file.url);
    } else {
      console.error("Unsupported file type:", file);
    }

    console.log("File selected (layout, pass here):", file);  // Debug log

    setShowProjectsDialog(false);
  };*/

  //Updated on 2024-11-13 for multi-file selection
  // Function to handle multiple file selections
 const handleIfcFilesSelect = (files) => {
  
  console.log("Files selected:", files); // Debug log

  //New added, 2025-03-19
  /*const event = new CustomEvent('ifcViewerActivate', files);
  console.log("Listen here:", files);  // Debug log
  window.dispatchEvent(event);*/


  // Dispatch a custom event with the selected files
  /*const event = new CustomEvent("ifcFilesSelected", {
    detail: processedFiles.map((file) => ({
      name: file.Name,
      url: file.url,
      content: file.content
    })),
  });
  console.log("Listen here:", processedFiles);  // Debug log

  window.dispatchEvent(event);*/

  setShowProjectsDialog(false);
};

  // Pass updated `selectedFiles` and `setSelectedFiles` props to children, 2024-11-13
  // 2025-01-22, replace selectedFiles by ifcViewerFiles
  //All children components now automatically receive ifcViewerFiles and setifcViewerFiles 
  // as props without you needing to pass them manually in JSX.
  const childrenWithProps = React.Children.map(children, child =>
    React.cloneElement(child, { ifcFiles, setIfcFiles })//change from ifcViewerFiles to IfcFiles, 2025-03-11
  );

  // Rendern der Komponente
  return (
    <div className="dashboard-container small">
      <ToastContainer 
        position="bottom-right"
        autoClose={3000}          // 3s automatisch schließen
        hideProgressBar={false}
        newestOnTop={false}
        theme="light"
        closeOnClick
        pauseOnHover
        draggable
        stacked 
      />
      {/* Navigationsleiste */}
      <nav className="navigation">
        {/*<a href="/">*/}
        <div className="logo">
          <img src={logo} alt="GreenInfraTwin Logo" />
        </div>
        {/*</a>*/}
      
        <div className="small text-muted w-50">
      {isLoggedIn && projectName!=="" && (
          <span><b>Projekt:</b>&nbsp;{projectName}</span>
        )}
<br></br>
{/*{isLoggedIn && containerName!="" && (
          <span><b>Container:</b>&nbsp;{containerName}</span>
        )}*/}
      </div>
       
        <div className="user-info">
          
          {/* Projektauswahl-Dialog button - add location.pathname === '/' 2025-03-11 */}
          {isLoggedIn && location.pathname === '/' && (
            <button onClick={() => setShowProjectsDialog(true)} className="btn" style={{whiteSpace: 'nowrap'}}><FaLayerGroup />&nbsp;Projektauswahl</button>
          )}
          {(!isLoggedIn || username ===null || username ==="")? (
           
            <button onClick={() => setShowLoginForm(true)} className="btn login-btn">
              <FaSignInAlt /> Anmelden
            </button>
          ) : (
             <>
              <span className="user"><FaUser /></span><span>{username}</span>
              <button onClick={handleLogout} className="btn logout-btn">
                <FaSignOutAlt />&nbsp;Abmelden
              </button>
            </>
          )}
          
        </div>
        
      </nav>
      {/* Login-Formular */}
      {showLoginForm && (
        <div className="login-form-overlay">
          <form onSubmit={handleLogin} className="login-form w-25">
            <h2><FaUser className='text-success'></FaUser>&nbsp;Anmelden</h2>
            {error && <p className="error">{error}</p>}
            <input
              type="text" autoComplete="username"
              placeholder="Benutzername"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password" autoComplete="current-password"
              placeholder="Passwort"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit"> <FaSignInAlt></FaSignInAlt> Anmelden</button>
            <button type="button" onClick={() => setShowLoginForm(false)}>
              Abbrechen
            </button>
          </form>
        </div>
      )}

     
      {/* Projektauswahl-Dialog 
        onSelectIfcFiles={handleIfcFilesSelect}
      */}
      <ProjectsDialog
        isOpen={showProjectsDialog}
        onClose={() => setShowProjectsDialog(false)}
        setContainerName={setContainerName}
        setProjectName={setProjectName}
      />
     

      <div className="content">
        { childrenWithProps }
      </div>
{info?.commit && (<a
  href={`https://git.inf.bi.ruhr-uni-bochum.de/greeninfratwins/applications/greeninfratwins-app/-/commit/${info.commit}`}
  target="_blank"
  rel="noopener noreferrer"
  className="commit-info"
>
  <span>
    <FaCodeCommit />
    <span>Build-ID: {info.commit} at {info.buildTime}</span>
  </span>
</a> )}
<a
  href={`https://greeninfratwins.blogs.ruhr-uni-bochum.de/impressum/`}
  target="_blank"
  rel="noopener noreferrer"
  className="imprint-info"
>
  <span>
    <FaSection />
    <span>Impressum</span>
  </span>
</a>
    </div>
  );
};

export default Layout;