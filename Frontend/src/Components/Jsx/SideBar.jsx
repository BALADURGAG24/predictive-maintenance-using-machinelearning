import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BiHomeAlt, BiTable, BiCategoryAlt, BiTargetLock, BiError, BiBarChart, BiDetail, BiChevronLeft, BiChevronRight, BiGridAlt, BiNetworkChart, BiLink } from 'react-icons/bi';
import '../Css/SideBar.css';

const Sidebar = () => {
  const [isMinimized, setIsMinimized] = useState(false);

  const toggleSidebar = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div className={`sidebar ${isMinimized ? 'minimized' : ''}`}>
      <button className="toggle-button" onClick={toggleSidebar}>
        {isMinimized ? <BiChevronRight /> : <BiChevronLeft />}
      </button>
      <ul>
        <li>
          <Link to="/" className="sidebar-link">
            <BiHomeAlt className="icon" />
            <span className={`text ${isMinimized ? 'hidden' : ''}`}>Dashboard</span>
          </Link>
        </li>
        <li>
          <Link to="/table-data" className="sidebar-link">
            <BiTable className="icon" />
            <span className={`text ${isMinimized ? 'hidden' : ''}`}>All Data</span>
          </Link>
        </li>
        <li>
          <Link to="/type" className="sidebar-link">
            <BiCategoryAlt className="icon" />
            <span className={`text ${isMinimized ? 'hidden' : ''}`}>Type</span>
          </Link>
        </li>
        <li>
          <Link to="/target" className="sidebar-link">
            <BiTargetLock className="icon" />
            <span className={`text ${isMinimized ? 'hidden' : ''}`}>Target</span>
          </Link>
        </li>
        <li>
          <Link to="/failure-type" className="sidebar-link">
            <BiError className="icon" />
            <span className={`text ${isMinimized ? 'hidden' : ''}`}>Failure Type</span>
          </Link>
        </li>
        <li>
          <Link to="/temperature-data" className="sidebar-link">
            <BiBarChart className="icon" />
            <span className={`text ${isMinimized ? 'hidden' : ''}`}>Performance Characteristics</span>
          </Link>
        </li>
        <li>
          <Link to="/Details" className="sidebar-link">
            <BiDetail className="icon" />
            <span className={`text ${isMinimized ? 'hidden' : ''}`}>Details</span>
          </Link>
        </li>
        <li>
          <Link to="/DataTable" className="sidebar-link">
            <BiGridAlt className="icon" />
            <span className={`text ${isMinimized ? 'hidden' : ''}`}>Data Table</span>
          </Link>
        </li>
        <li>
          <Link to="/SensorData" className="sidebar-link">
            <BiNetworkChart className="icon" />
            <span className={`text ${isMinimized ? 'hidden' : ''}`}>Sensor Data</span>
          </Link>
        </li>
        <li>
          <Link to="/Insights" className="sidebar-link">
            <BiLink className="icon" />
            <span className={`text ${isMinimized ? 'hidden' : ''}`}>Insights</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
