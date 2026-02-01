import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import DefinitionPage1 from './pages/DefinitionPage1';
import DefinitionPage23 from './pages/DefinitionPage23';
import DefPage4 from './pages/DefPage4';
import Sidebar from './components/Sidebar';


const App = () => {
  return (
    <BrowserRouter  basename="/greeninfratwins">
      <Layout>
      <div className="sidebar">
         <Sidebar /> 
      </div >
      <div className="fullColumn">    
<Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/uc1" element={<DefinitionPage1 />} />
          <Route path="/uc2" element={<DefinitionPage23 />} />
          <Route path="/uc3" element={<DefinitionPage23 />} />
          <Route path="/uc4" element={<DefPage4 />} />         
        </Routes>
        </div>
      </Layout>
    </BrowserRouter >
  );
};

export default App;