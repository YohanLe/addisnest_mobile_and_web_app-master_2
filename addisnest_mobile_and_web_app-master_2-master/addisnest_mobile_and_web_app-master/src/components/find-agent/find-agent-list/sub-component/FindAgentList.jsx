import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaCheck, FaPhone, FaStar, FaFilter, FaMapMarkerAlt, FaLanguage, FaBriefcase, FaEnvelope, FaUserTie, FaShieldAlt, FaArrowLeft } from 'react-icons/fa';
import { GetAgentAll } from '../../../../Redux-store/Slices/AgentAllSlice';
import { setAgentDetails } from '../../../../Redux-store/Slices/AgentSlice';
import AgentDetailPopup from '../../../helper/AgentDetailPopup';
import MessageAgentPopup from '../../../helper/MessageAgentPopup';
import './FindAgentList.css';

const RegionalStateList = [
    { value: 'addis-ababa-city-administration', label: 'Addis Ababa City Administration' },
    { value: 'afar-region', label: 'Afar Region' },
    { value: 'amhara-region', label: 'Amhara Region' },
    { value: 'oromia-region', label: 'Oromia Region' },
    { value: 'tigray-region', label: 'Tigray Region' }
];

const FindAgentList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: agentsData, pending: loading } = useSelector(state => state.AgentAll.data);
  const { agents = [] } = agentsData || {};

  const [filters, setFilters] = useState({
    region: '',
    specialty: '',
    language: '',
    verifiedOnly: false
  });
  const [showAgentPopup, setShowAgentPopup] = useState(false);
  const [showMessagePopup, setShowMessagePopup] = useState(false);
  const [selectedAgentForMessage, setSelectedAgentForMessage] = useState(null);

  // Parse URL params and fetch agents
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const newFilters = {
      region: queryParams.get('region') || '',
      specialty: queryParams.get('specialty') || '',
      language: queryParams.get('language') || '',
      verifiedOnly: queryParams.get('verifiedOnly') === 'true'
    };
    setFilters(newFilters);
    dispatch(GetAgentAll(newFilters));
  }, [location.search, dispatch]);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newFilters = { ...filters, [name]: type === 'checkbox' ? checked : value };
    setFilters(newFilters);
    
    const queryParams = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });
    
    navigate(`/find-agent/list?${queryParams.toString()}`);
  };

  const clearAllFilters = () => {
    setFilters({ region: '', specialty: '', language: '', verifiedOnly: false });
    navigate('/find-agent/list');
  };

  const handleViewAgentDetails = (agent) => {
    dispatch(setAgentDetails(agent));
    setShowAgentPopup(true);
  };

  const handleMessageAgent = (agent, e) => {
    e.stopPropagation();
    console.log('Agent data being set:', agent);
    console.log('Agent email:', agent.email);
    dispatch(setAgentDetails(agent));
    setSelectedAgentForMessage(agent);
    setShowMessagePopup(true);
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <FaStar key={i} className={i < Math.floor(rating) ? 'star-filled' : 'star-empty'} />
    ));
  };

  const hasActiveFilters = () => {
    return Object.values(filters).some(value => value);
  };

  return (
    <div className="find-agent-list">
      <div className="container">
        {/* Header */}
        <div className="agent-list-header">
          <button onClick={() => navigate('/find-agent')} className="back-btn">
            <FaArrowLeft /> Back to Search
          </button>
          <h1 style={{ color: 'white' }}>Connect with Top Real Estate Agents</h1>
          <p style={{ color: 'white' }}>Find experienced professionals who will help you buy, sell, or rent your perfect property</p>
          <p style={{ color: 'white' }}>{agents.length} agents found</p>
        </div>

        {/* Filters */}
        <div className="agent-filters">
          <h3><FaFilter /> Filters</h3>
          <div className="filter-grid">
            <select name="region" value={filters.region} onChange={handleFilterChange}>
              <option value="">All Regions</option>
              {RegionalStateList.map(region => (
                <option key={region.value} value={region.value}>{region.label}</option>
              ))}
            </select>

            <select name="specialty" value={filters.specialty} onChange={handleFilterChange}>
              <option value="">All Specialties</option>
              <option value="buying">Buying</option>
              <option value="selling">Selling</option>
              <option value="renting">Renting</option>
              <option value="commercial">Commercial</option>
              <option value="residential">Residential</option>
            </select>

            <select name="language" value={filters.language} onChange={handleFilterChange}>
              <option value="">All Languages</option>
              <option value="amharic">Amharic</option>
              <option value="english">English</option>
              <option value="afaan-oromo">Afaan Oromo</option>
            </select>

          </div>

          <div className="filter-actions">
            <label className="verified-checkbox">
              <input 
                type="checkbox" 
                name="verifiedOnly" 
                checked={filters.verifiedOnly}
                onChange={handleFilterChange}
              />
              <FaShieldAlt /> Verified Only
            </label>
            
            {hasActiveFilters() && (
              <button onClick={clearAllFilters} className="clear-filters-btn">
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Agent List */}
        <div className="agents-container">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading agents...</p>
            </div>
          ) : agents.length === 0 ? (
            <div className="no-agents">
              <FaUserTie className="no-agents-icon" />
              <h3>No Agents Found</h3>
              <p>Try adjusting your filters to see more results.</p>
              <button onClick={clearAllFilters} className="primary-btn">Clear Filters</button>
            </div>
          ) : (
            <div className="agent-grid">
              {agents.map(agent => (
                <div key={agent._id} className="agent-card" onClick={() => handleViewAgentDetails(agent)}>
                  {agent.isVerified && (
                    <div className="verified-badge">
                      <FaCheck /> Verified
                    </div>
                  )}
                  
                  <div className="agent-header">
                    <div className="agent-avatar">
                      {agent.profilePicture || agent.profile_img ? (
                        <img src={agent.profilePicture || agent.profile_img} alt={agent.firstName} />
                      ) : (
                        <span>{agent.firstName?.charAt(0)}{agent.lastName?.charAt(0)}</span>
                      )}
                    </div>
                    <div className="agent-info">
                      <h4>{agent.firstName} {agent.lastName}</h4>
                      <p><FaMapMarkerAlt /> {agent.region || agent.address?.state || 'Location not specified'}</p>
                    </div>
                  </div>

                  <div className="agent-details">
                    <div className="detail-item">
                      <FaBriefcase /> {agent.experience || 0} years experience
                    </div>
                    <div className="detail-item">
                      <FaPhone /> {agent.phone || 'Phone not available'}
                    </div>
                    
                    {agent.specialties && agent.specialties.length > 0 && (
                      <div className="specialties">
                        <strong>Specialties:</strong>
                        <div className="tags">
                          {agent.specialties.slice(0, 2).map((specialty, index) => (
                            <span key={index} className="tag">{specialty}</span>
                          ))}
                          {agent.specialties.length > 2 && <span className="tag-more">+{agent.specialties.length - 2}</span>}
                        </div>
                      </div>
                    )}
                  </div>

                  <button 
                    onClick={(e) => handleMessageAgent(agent, e)}
                    className="contact-btn"
                  >
                    <FaEnvelope /> Contact Agent
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Popups */}
      {showAgentPopup && <AgentDetailPopup onClose={() => setShowAgentPopup(false)} />}
      {showMessagePopup && <MessageAgentPopup agent={selectedAgentForMessage} onClose={() => setShowMessagePopup(false)} />}
    </div>
  );
};

export default FindAgentList;
