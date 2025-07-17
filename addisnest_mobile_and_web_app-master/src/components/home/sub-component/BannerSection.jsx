import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { PropertyImage3, BannerImage } from '../../../assets/images';
import { SvgSearchIcon } from '../../../assets/svg-files/SvgFiles.jsx';
import { useNavigate } from 'react-router-dom';
import { GetHomeData } from '../../../Redux-store/Slices/HomeSlice';
import { isAuthenticated } from '../../../utils/tokenHandler';
import { applyFilters, FILTER_OPTIONS } from '../../../utils/propertyFilters';
import './BannerSection.css';

const BannerSection = () => {
  const [searchType, setSearchType] = useState('buy');
  const [buyRentToggle, setBuyRentToggle] = useState('buy'); // New state for Buy/Rent toggle
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  // Filter states
  const [priceRange, setPriceRange] = useState('any');
  const [propertyType, setPropertyType] = useState('all');
  const [bedrooms, setBedrooms] = useState('any');
  const [bathrooms, setBathrooms] = useState('any');
  const [regionalState, setRegionalState] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (e, type) => {
    if (e) e.preventDefault();
    const currentSearchType = type || searchType;
    
    // Determine offering type based on the search type or toggle
    let offeringType = 'For Sale'; // Default
    
    if (currentSearchType === 'buy-rent') {
      // For the combined Buy/Rent button, use the toggle state
      offeringType = buyRentToggle === 'buy' ? 'For Sale' : 'For Rent';
    } else if (currentSearchType === 'rent' || currentSearchType === 'for-rent') {
      offeringType = 'For Rent';
    }
    
    // Use the filter utility to apply filters and navigate
    applyFilters(navigate, {
      searchQuery,
      offeringType,
      priceRange,
      propertyType,
      bedrooms,
      bathrooms,
      regionalState
    });
  };

  // Function to toggle between Buy and Rent
  const toggleBuyRent = () => {
    const newToggle = buyRentToggle === 'buy' ? 'rent' : 'buy';
    setBuyRentToggle(newToggle);
    setSearchType('buy-rent');
    
    // Immediately search for properties with the new toggle selection
    handleSearch(null, 'buy-rent');
  };

  const handleTabClick = (type) => {
    setSearchType(type);
    handleSearch(null, type);
  };
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <section
      className="banner-section"
      style={{
        backgroundImage: `url(${BannerImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '360px',
        position: 'relative',
      }}
    >
      <style jsx="true">{`
        @media screen and (max-width: 767px) {
          .banner-section {
            height: 210px !important;
            padding-top: 15px !important;
          }
          .banner-content h1 {
            font-size: 1.4rem !important;
            margin-bottom: 0.2rem !important;
          }
          .search-tabs-container {
            max-width: 100% !important;
            transform: scale(0.85) !important;
            transform-origin: top left !important;
            margin-top: -5px !important;
          }
          .search-tabs .nav {
            display: flex !important;
            flex-direction: row !important;
            justify-content: space-between !important;
            width: 100% !important;
          }
          .search-tabs .nav-item {
            flex: 1 !important;
            display: inline-block !important;
            margin: 0 2px !important;
          }
          .search-tabs .nav-link {
            padding: 10px 5px !important;
            font-size: 13px !important;
            text-align: center !important;
            font-weight: 600 !important;
            width: 100% !important;
            display: block !important;
          }
          .search-form {
            padding: 12px !important;
          }
          .search-input {
            height: 38px !important;
            font-size: 14px !important;
            padding: 8px 12px !important;
          }
          .search-button {
            height: 38px !important;
            padding: 0 15px !important;
          }
          .filter-toggle {
            margin-top: 4px !important;
          }
          .filter-toggle button {
            font-size: 13px !important;
            padding: 4px 12px !important;
          }
        }
      `}</style>
      <div className="banner-overlay" style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        zIndex: 1
      }}></div>
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div className="row">
          <div className="col-md-8">
            <div className="banner-content">
              <h1>
                Find the perfect home<br />for your family
              </h1>

              <div className="search-tabs-container">
                <div className="search-tabs">
                  <ul className="nav">
                    <li className="nav-item">
                      <button
                        className={`nav-link ${searchType === 'for-sale' ? 'active' : ''}`}
                        onClick={() => handleTabClick('for-sale')}
                      >
                        For Sale
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`nav-link ${searchType === 'for-rent' ? 'active' : ''}`}
                        onClick={() => handleTabClick('for-rent')}
                      >
                        For Rent
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`nav-link ${searchType === 'sell' ? 'active' : ''}`}
                        onClick={(e) => {
                          setSearchType('sell');
                          if (!isAuthenticated()) {
                            // If not authenticated, show login popup with redirect target
                            window.dispatchEvent(new CustomEvent('showLoginPopup', {
                              detail: { redirectTo: '/property-list-form' }
                            }));
                          } else {
                            // If authenticated, navigate to property list form
                            navigate('/property-list-form');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }
                        }}
                      >
                        Sell
                      </button>
                    </li>

                  </ul>
                </div>

                <form onSubmit={handleSearch} className="search-form">
                  <input
                    type="text"
                    className="form-control search-input"
                    placeholder="City, School, Agent, ZIP"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button
                    className="btn search-button"
                    type="submit"
                  >
                    <SvgSearchIcon style={{ width: '20px', height: '20px' }} />
                  </button>
                </form>

                {/* Filter toggle button */}
                <div className="filter-toggle" style={{ textAlign: 'center', marginTop: '10px' }}>
                  <button 
                    onClick={toggleFilters} 
                    className="btn"
                    style={{
                      backgroundColor: showFilters ? '#e8f7c4' : 'rgba(255, 255, 255, 0.8)',
                      color: '#333',
                      border: 'none',
                      borderRadius: '20px',
                      padding: '5px 15px',
                      fontSize: '14px',
                      fontWeight: '600',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    {showFilters ? 'Hide Filters' : 'Show Filters'}
                  </button>
                </div>

                {/* Filters section */}
                {showFilters && (
                  <div className="filters-container" style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '10px',
                    padding: '15px',
                    marginTop: '10px',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: '10px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }}>
                    {/* Price Range Filter */}
                    <div className="filter-item">
                      <label style={{ 
                        fontSize: '13px', 
                        fontWeight: '600', 
                        marginBottom: '5px', 
                        color: '#333',
                        display: 'block'
                      }}>Price Range</label>
                      <select 
                        value={priceRange}
                        onChange={(e) => setPriceRange(e.target.value)}
                        style={{ 
                          width: '100%',
                          padding: '8px 10px',
                          borderRadius: '8px',
                          border: '1px solid #ddd',
                          backgroundColor: 'white',
                          fontSize: '13px'
                        }}
                      >
                        {FILTER_OPTIONS.priceRanges.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Regional State Filter */}
                    <div className="filter-item">
                      <label style={{ 
                        fontSize: '13px', 
                        fontWeight: '600', 
                        marginBottom: '5px', 
                        color: '#333',
                        display: 'block'
                      }}>Regional State</label>
                      <select 
                        value={regionalState}
                        onChange={(e) => setRegionalState(e.target.value)}
                        style={{ 
                          width: '100%',
                          padding: '8px 10px',
                          borderRadius: '8px',
                          border: '1px solid #ddd',
                          backgroundColor: 'white',
                          fontSize: '13px'
                        }}
                      >
                        {FILTER_OPTIONS.regionalStates.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Property Type Filter */}
                    <div className="filter-item">
                      <label style={{ 
                        fontSize: '13px', 
                        fontWeight: '600', 
                        marginBottom: '5px', 
                        color: '#333',
                        display: 'block'
                      }}>Property Type</label>
                      <select 
                        value={propertyType}
                        onChange={(e) => setPropertyType(e.target.value)}
                        style={{ 
                          width: '100%',
                          padding: '8px 10px',
                          borderRadius: '8px',
                          border: '1px solid #ddd',
                          backgroundColor: 'white',
                          fontSize: '13px'
                        }}
                      >
                        {FILTER_OPTIONS.propertyTypes.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Bedrooms Filter */}
                    <div className="filter-item">
                      <label style={{ 
                        fontSize: '13px', 
                        fontWeight: '600', 
                        marginBottom: '5px', 
                        color: '#333',
                        display: 'block'
                      }}>Bedrooms</label>
                      <select 
                        value={bedrooms}
                        onChange={(e) => setBedrooms(e.target.value)}
                        style={{ 
                          width: '100%',
                          padding: '8px 10px',
                          borderRadius: '8px',
                          border: '1px solid #ddd',
                          backgroundColor: 'white',
                          fontSize: '13px'
                        }}
                      >
                        {FILTER_OPTIONS.bedBathOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Bathrooms Filter */}
                    <div className="filter-item">
                      <label style={{ 
                        fontSize: '13px', 
                        fontWeight: '600', 
                        marginBottom: '5px', 
                        color: '#333',
                        display: 'block'
                      }}>Bathrooms</label>
                      <select 
                        value={bathrooms}
                        onChange={(e) => setBathrooms(e.target.value)}
                        style={{ 
                          width: '100%',
                          padding: '8px 10px',
                          borderRadius: '8px',
                          border: '1px solid #ddd',
                          backgroundColor: 'white',
                          fontSize: '13px'
                        }}
                      >
                        {FILTER_OPTIONS.bedBathOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Apply Filters Button */}
                    <div className="filter-item">
                      <label style={{ 
                        fontSize: '13px', 
                        fontWeight: '600', 
                        marginBottom: '5px', 
                        color: '#333',
                        display: 'block'
                      }}>Apply</label>
                      <button
                        onClick={(e) => handleSearch(e)}
                        className="btn"
                        style={{
                          backgroundColor: '#a4ff2a',
                          color: '#222',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '8px 10px',
                          fontSize: '13px',
                          width: '100%',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                      >
                        Apply Filters
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BannerSection;
