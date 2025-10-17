import React, { useState } from "react";
import LocationPopupMain from "./LocationPopupMain";

/**
 * Demo component for the LocationPopup
 * Demonstrates how to use the LocationPopup component with various configurations
 */
const LocationPopupDemo = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [demoFilter, setDemoFilter] = useState("all");
  const [showRecent, setShowRecent] = useState(true);

  // Handle selection of location from popup
  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setIsPopupOpen(false);
  };

  // Open the location popup
  const openPopup = () => {
    setIsPopupOpen(true);
  };

  // Close the location popup
  const closePopup = () => {
    setIsPopupOpen(false);
  };

  // Handle filter change
  const handleFilterChange = (filter) => {
    setDemoFilter(filter);
  };

  // Toggle showing recent selections
  const toggleShowRecent = () => {
    setShowRecent(!showRecent);
  };

  // Clear saved recent locations from localStorage
  const clearRecentLocations = () => {
    localStorage.removeItem("recentLocations");
    alert("Recent locations cleared from localStorage");
  };

  return (
    <div className="location-demo-container">
      <h2 className="demo-title">Location Selector Demo</h2>
      
      <div className="demo-description">
        <p>
          This demo showcases a reusable location selector component with search, 
          filtering, and recent selection capabilities.
        </p>
      </div>
      
      <div className="demo-controls">
        <div className="control-section">
          <h3>Configuration</h3>
          <div className="control-options">
            <div className="control-option">
              <label>Filter Type:</label>
              <div className="option-buttons">
                <button 
                  className={demoFilter === "all" ? "active" : ""}
                  onClick={() => handleFilterChange("all")}
                >
                  All
                </button>
                <button 
                  className={demoFilter === "country" ? "active" : ""}
                  onClick={() => handleFilterChange("country")}
                >
                  Countries Only
                </button>
                <button 
                  className={demoFilter === "state" ? "active" : ""}
                  onClick={() => handleFilterChange("state")}
                >
                  States Only
                </button>
              </div>
            </div>
            
            <div className="control-option">
              <label>Recent Selections:</label>
              <div className="option-buttons">
                <button 
                  className={showRecent ? "active" : ""}
                  onClick={toggleShowRecent}
                >
                  {showRecent ? "Enabled" : "Disabled"}
                </button>
                <button 
                  onClick={clearRecentLocations}
                  className="clear-button"
                >
                  Clear Recent Data
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="selected-location">
          {selectedLocation ? (
            <div className="location-details">
              <h3>Selected Location:</h3>
              <div className="location-data">
                <p><strong>Name:</strong> {selectedLocation.name}</p>
                <p><strong>Code:</strong> {selectedLocation.code}</p>
                <p><strong>Type:</strong> {selectedLocation.type === "country" ? "Country" : "State"}</p>
              </div>
            </div>
          ) : (
            <div className="no-selection">
              <p>No location selected yet</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="demo-action">
        <button className="open-popup-button" onClick={openPopup}>
          Open Location Selector
        </button>
      </div>
      
      {/* Location Popup Component */}
      <LocationPopupMain
        isOpen={isPopupOpen}
        onClose={closePopup}
        onSelect={handleLocationSelect}
        title="Select Your Location"
        placeholder="Search for a country or state..."
        showRecent={showRecent}
        maxRecentItems={5}
        defaultFilter={demoFilter}
      />
      
      <div className="demo-instructions">
        <h3>How to Use This Component</h3>
        <div className="code-example">
          <pre>
{`import React, { useState } from "react";
import { LocationPopup } from "./components/location-popup";

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const [location, setLocation] = useState(null);
  
  const handleSelect = (selectedLocation) => {
    setLocation(selectedLocation);
    setIsOpen(false);
  };
  
  return (
    <div>
      <button onClick={() => setIsOpen(true)}>
        {location ? location.name : "Select Location"}
      </button>
      
      <LocationPopup
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSelect={handleSelect}
        showRecent={true}
        defaultFilter="all"
      />
    </div>
  );
}`}
          </pre>
        </div>
      </div>
      
      <div className="component-features">
        <h3>Component Features</h3>
        <ul>
          <li>Search for countries and states</li>
          <li>Filter by location type (country/state)</li>
          <li>Stores and displays recent selections</li>
          <li>Keyboard accessible</li>
          <li>Mobile responsive</li>
          <li>Customizable appearance and behavior</li>
          <li>Handles outside clicks</li>
        </ul>
      </div>
    </div>
  );
};

export default LocationPopupDemo;
