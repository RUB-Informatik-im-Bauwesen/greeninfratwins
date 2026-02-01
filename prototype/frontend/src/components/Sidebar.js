import React, { useState } from 'react';
import './Sidebar.css';
import { FaHouse, FaChartColumn, FaArrowRightArrowLeft} from 'react-icons/fa6';
import { Link } from 'react-router-dom';

// Sidebar component
const Sidebar = () => {
    const [selectedButton, setSelectedButton] = useState(null); // Track selected button
  
    const handleButtonClick = (buttonName) => {
      setSelectedButton(buttonName);
    }

    return (
      <ul className="button-list">
        <li>
          <Link to="/">
          <button
            className={`sidebar-button ${selectedButton === 'home' ? 'selected' : ''}`}
            onClick={() => handleButtonClick('home')}
          >
            <span><FaHouse/></span>
          </button>
          </Link>
        </li>
        {/* Commented the follwoing on 2025-06-10, Update for Basic Requirement 1 */}
        {/*<li>
          <Link to="/calculate/:formulaString?/:valueshref?">
          <button
            className={`sidebar-button ${selectedButton === 'analytics' ? 'selected' : ''}`}
            onClick={() => handleButtonClick('analytics')}
          >
            <span><FaChartColumn/></span>
          </button>
          </Link>
        </li>
        <li>
          <button
            className={`sidebar-button ${selectedButton === 'settings' ? 'selected' : ''}`}
            onClick={() => handleButtonClick('settings')}
          >
            <span><FaArrowRightArrowLeft/></span>
          </button>
        </li> */}
      </ul>
    );
};

export default Sidebar;