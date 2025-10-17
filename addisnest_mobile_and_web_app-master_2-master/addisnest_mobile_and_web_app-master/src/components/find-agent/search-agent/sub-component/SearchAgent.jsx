import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaSearch, FaUserTie, FaLanguage, FaStar, FaShieldAlt, FaBriefcase, FaUsers, FaHome, FaFilter } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { GetAgentAll } from '../../../../Redux-store/Slices/AgentAllSlice';
import '../../find-agent.css';

const RegionalStateList = [
    { value: 'addis-ababa-city-administration', label: 'Addis Ababa City Administration' },
    { value: 'afar-region', label: 'Afar Region' },
    { value: 'amhara-region', label: 'Amhara Region' },
    { value: 'oromia-region', label: 'Oromia Region' },
    { value: 'tigray-region', label: 'Tigray Region' }
];

const SearchAgent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchForm, setSearchForm] = useState({
    region: '',
    specialty: '',
    language: '',
    verifiedOnly: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSearchForm({
      ...searchForm,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(GetAgentAll(searchForm));
    
    const queryParams = new URLSearchParams();
    Object.entries(searchForm).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });
    
    navigate(`/find-agent/list?${queryParams.toString()}`);
  };

  const handleBrowseAll = () => {
    dispatch(GetAgentAll({}));
    navigate('/find-agent/list');
  };

  return (
    <div className="agent-finder">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 style={{ color: 'white' }}>Connect with Top Real Estate Agents</h1>
            <p style={{ color: 'white' }}>Find experienced professionals who will help you buy, sell, or rent your perfect property</p>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">500+</span>
              <span className="stat-label">Verified Agents</span>
            </div>
            <div className="stat">
              <span className="stat-number">98%</span>
              <span className="stat-label">Success Rate</span>
            </div>
            <div className="stat">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Support</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="search-section">
        <div className="container">
          <div className="search-wrapper">
            <h2>Find Your Perfect Agent</h2>
            <form className="agent-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-field">
                  <FaMapMarkerAlt className="field-icon" />
                  <select name="region" value={searchForm.region} onChange={handleInputChange}>
                    <option value="">Select Location</option>
                    {RegionalStateList.map(region => (
                      <option key={region.value} value={region.value}>
                        {region.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-field">
                  <FaBriefcase className="field-icon" />
                  <select name="specialty" value={searchForm.specialty} onChange={handleInputChange}>
                    <option value="">Property Type</option>
                    <option value="buying">Buying</option>
                    <option value="selling">Selling</option>
                    <option value="renting">Renting</option>
                    <option value="commercial">Commercial</option>
                    <option value="residential">Residential</option>
                    <option value="luxury">Luxury</option>
                    <option value="farmland">Farmland</option>
                    <option value="investment">Investment</option>
                  </select>
                </div>

                <div className="form-field">
                  <FaLanguage className="field-icon" />
                  <select name="language" value={searchForm.language} onChange={handleInputChange}>
                    <option value="">Language</option>
                    <option value="amharic">Amharic</option>
                    <option value="afaan-oromo">Afaan Oromo</option>
                    <option value="english">English</option>
                    <option value="tigrinya">Tigrinya</option>
                    <option value="somali">Somali</option>
                  </select>
                </div>

              </div>

              <div className="form-options">
                <label className="verified-toggle">
                  <input 
                    type="checkbox" 
                    name="verifiedOnly" 
                    checked={searchForm.verifiedOnly}
                    onChange={handleInputChange}
                  />
                  <span className="toggle-slider"></span>
                  <span className="toggle-text">Verified agents only</span>
                </label>
              </div>

              <div className="form-actions">
                <button type="submit" className="search-button">
                  <FaSearch />
                  Find Agents
                </button>
                <button type="button" onClick={handleBrowseAll} className="browse-button">
                  <FaUsers />
                  Browse All
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="benefits-section">
        <div className="container">
          <h2>Why Choose Our Platform?</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">
                <FaShieldAlt />
              </div>
              <h3>Verified Professionals</h3>
              <p>Every agent is thoroughly vetted, licensed, and background-checked for your peace of mind.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">
                <FaStar />
              </div>
              <h3>Proven Track Record</h3>
              <p>Browse real client reviews and ratings to find agents with proven success in your area.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">
                <FaUserTie />
              </div>
              <h3>Expert Guidance</h3>
              <p>Get professional support and personalized service throughout your real estate journey.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchAgent;
