import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { USstates, countries } from "./locationData";

/**
 * LocationPopup Component
 * A customizable location selector with search, suggestions, and recent selections.
 */
const LocationPopupMain = ({
  isOpen,
  onClose,
  onSelect,
  title = "Select Location",
  placeholder = "Search for location",
  showRecent = true,
  maxRecentItems = 5,
  defaultFilter = "all", // all, country, state
  customLocations = null,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState(defaultFilter);
  const [recentLocations, setRecentLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const popupRef = useRef(null);
  const searchInputRef = useRef(null);

  // Combine custom locations with default ones if provided
  const allLocations = customLocations || {
    countries: countries,
    states: USstates,
  };

  // Initialize with data
  useEffect(() => {
    // Load recent locations from localStorage
    if (showRecent) {
      const savedLocations = localStorage.getItem("recentLocations");
      if (savedLocations) {
        setRecentLocations(JSON.parse(savedLocations));
      }
    }

    // Initial filtered locations based on default filter
    updateFilteredLocations("");

    // Focus search input when popup opens
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current.focus();
      }, 100);
    }
  }, [isOpen, defaultFilter, showRecent]);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Update filtered locations based on search term and filter
  const updateFilteredLocations = (term) => {
    setIsLoading(true);
    
    let results = [];
    const searchText = term.toLowerCase();
    
    if (filter === "country" || filter === "all") {
      const matchedCountries = allLocations.countries.filter(country => 
        country.name.toLowerCase().includes(searchText) ||
        country.code.toLowerCase().includes(searchText)
      );
      
      results = [
        ...results, 
        ...matchedCountries.map(country => ({
          ...country,
          type: "country"
        }))
      ];
    }
    
    if (filter === "state" || filter === "all") {
      const matchedStates = allLocations.states.filter(state => 
        state.name.toLowerCase().includes(searchText) ||
        state.code.toLowerCase().includes(searchText)
      );
      
      results = [
        ...results, 
        ...matchedStates.map(state => ({
          ...state,
          type: "state"
        }))
      ];
    }
    
    // Sort results by relevance
    results.sort((a, b) => {
      // Exact matches first
      const aExact = a.name.toLowerCase() === searchText;
      const bExact = b.name.toLowerCase() === searchText;
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      
      // Then starts with
      const aStarts = a.name.toLowerCase().startsWith(searchText);
      const bStarts = b.name.toLowerCase().startsWith(searchText);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      
      // Then alphabetically
      return a.name.localeCompare(b.name);
    });
    
    setFilteredLocations(results);
    setIsLoading(false);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    updateFilteredLocations(term);
  };

  // Handle filter change
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    updateFilteredLocations(searchTerm);
  };

  // Handle selection of a location
  const handleLocationSelect = (location) => {
    // Add to recent locations if enabled
    if (showRecent) {
      const newRecent = [
        location,
        ...recentLocations.filter(item => item.code !== location.code)
      ].slice(0, maxRecentItems);
      
      setRecentLocations(newRecent);
      localStorage.setItem("recentLocations", JSON.stringify(newRecent));
    }
    
    // Call the onSelect callback
    onSelect(location);
    onClose();
  };

  // If popup is not open, don't render anything
  if (!isOpen) return null;

  return (
    <div className="location-popup-overlay">
      <div className="location-popup-container" ref={popupRef}>
        <div className="location-popup-header">
          <h3>{title}</h3>
          <button 
            className="location-popup-close"
            onClick={onClose}
            aria-label="Close"
          >
            <span>&times;</span>
          </button>
        </div>
        
        <div className="location-popup-search">
          <div className="search-input-container">
            <input
              type="text"
              ref={searchInputRef}
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder={placeholder}
              className="location-search-input"
            />
            {searchTerm && (
              <button 
                className="clear-search-btn"
                onClick={() => {
                  setSearchTerm("");
                  updateFilteredLocations("");
                  searchInputRef.current.focus();
                }}
                aria-label="Clear search"
              >
                &times;
              </button>
            )}
            <span className="search-icon">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.6667 14.6667L11.2 11.2M12.8889 6.94444C12.8889 10.1961 10.1961 12.8889 6.94444 12.8889C3.69289 12.8889 1 10.1961 1 6.94444C1 3.69289 3.69289 1 6.94444 1C10.1961 1 12.8889 3.69289 12.8889 6.94444Z" stroke="#555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </div>
          
          <div className="location-filter-buttons">
            <button 
              className={`filter-btn ${filter === "all" ? "active" : ""}`}
              onClick={() => handleFilterChange("all")}
            >
              All
            </button>
            <button 
              className={`filter-btn ${filter === "country" ? "active" : ""}`}
              onClick={() => handleFilterChange("country")}
            >
              Countries
            </button>
            <button 
              className={`filter-btn ${filter === "state" ? "active" : ""}`}
              onClick={() => handleFilterChange("state")}
            >
              States
            </button>
          </div>
        </div>
        
        <div className="location-popup-content">
          {/* Recent Locations */}
          {showRecent && recentLocations.length > 0 && searchTerm === "" && (
            <div className="location-section">
              <h4 className="section-title">Recent Selections</h4>
              <div className="location-list">
                {recentLocations.map((location) => (
                  <div 
                    key={`recent-${location.code}`}
                    className="location-item recent"
                    onClick={() => handleLocationSelect(location)}
                  >
                    <span className="location-name">{location.name}</span>
                    <span className="location-type">
                      {location.type === "country" ? "Country" : "State"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Search Results */}
          {isLoading ? (
            <div className="loading-indicator">
              <span>Loading locations...</span>
            </div>
          ) : filteredLocations.length > 0 ? (
            <div className="location-section">
              <h4 className="section-title">
                {searchTerm ? "Search Results" : "Popular Locations"}
              </h4>
              <div className="location-list">
                {filteredLocations.map((location) => (
                  <div 
                    key={`${location.type}-${location.code}`}
                    className="location-item"
                    onClick={() => handleLocationSelect(location)}
                  >
                    <span className="location-name">{location.name}</span>
                    <span className="location-type">
                      {location.type === "country" ? "Country" : "State"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="no-results">
              <p>No locations found matching "{searchTerm}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

LocationPopupMain.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  title: PropTypes.string,
  placeholder: PropTypes.string,
  showRecent: PropTypes.bool,
  maxRecentItems: PropTypes.number,
  defaultFilter: PropTypes.oneOf(["all", "country", "state"]),
  customLocations: PropTypes.shape({
    countries: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        code: PropTypes.string.isRequired,
      })
    ),
    states: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        code: PropTypes.string.isRequired,
      })
    ),
  }),
};

export default LocationPopupMain;
