import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaSearch, FaUserTie, FaLanguage, FaStar, FaShieldAlt, FaBriefcase, FaUsers, FaHome, FaFilter } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { GetAgentAll } from '../../../../Redux-store/Slices/AgentAllSlice';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { useTranslations } from '../../../../locales/translations';
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
  const { language } = useLanguage();
  const t = useTranslations(language);
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
            <h1 style={{ color: 'white' }}>{t.connectWithTopAgents}</h1>
            <p style={{ color: 'white' }}>{t.findExperiencedProfessionals}</p>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">XXX</span>
              <span className="stat-label">{t.verifiedAgents}</span>
            </div>
            <div className="stat">
              <span className="stat-number">XXX</span>
              <span className="stat-label">{t.successRate}</span>
            </div>
            <div className="stat">
              <span className="stat-number">XXX</span>
              <span className="stat-label">{t.support}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="search-section">
        <div className="container">
          <div className="search-wrapper">
            <h2>{t.findYourPerfectAgent}</h2>
            <form className="agent-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-field">
                  <FaMapMarkerAlt className="field-icon" />
                  <select name="region" value={searchForm.region} onChange={handleInputChange}>
                    <option value="">{t.selectLocation}</option>
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
                    <option value="">{t.propertyTypeLabel}</option>
                    <option value="buying">{t.buying}</option>
                    <option value="selling">{t.selling}</option>
                    <option value="renting">{t.renting}</option>
                    <option value="commercial">{t.commercial}</option>
                    <option value="residential">{t.residential}</option>
                    <option value="luxury">{t.luxury}</option>
                    <option value="farmland">{t.farmland}</option>
                    <option value="investment">{t.investment}</option>
                  </select>
                </div>

                <div className="form-field">
                  <FaLanguage className="field-icon" />
                  <select name="language" value={searchForm.language} onChange={handleInputChange}>
                    <option value="">{t.language}</option>
                    <option value="amharic">{t.amharic}</option>
                    <option value="afaan-oromo">{t.afaanOromo}</option>
                    <option value="english">{t.english}</option>
                    <option value="tigrinya">{t.tigrinya}</option>
                    <option value="somali">{t.somali}</option>
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
                  <span className="toggle-text">{t.verifiedAgentsOnly}</span>
                </label>
              </div>

              <div className="form-actions">
                <button type="submit" className="search-button">
                  <FaSearch />
                  {t.findAgents}
                </button>
                <button type="button" onClick={handleBrowseAll} className="browse-button">
                  <FaUsers />
                  {t.browseAll}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="benefits-section">
        <div className="container">
          <h2>{t.whyChooseOurPlatform}</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">
                <FaShieldAlt />
              </div>
              <h3>{t.verifiedProfessionals}</h3>
              <p>{t.verifiedProfessionalsDesc}</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">
                <FaStar />
              </div>
              <h3>{t.provenTrackRecord}</h3>
              <p>{t.provenTrackRecordDesc}</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">
                <FaUserTie />
              </div>
              <h3>{t.expertGuidance}</h3>
              <p>{t.expertGuidanceDesc}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchAgent;
