import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaCheck, FaPhone, FaStar, FaTimesCircle, FaFilter, FaMapMarkerAlt, FaLanguage, FaSearch, FaBuilding, FaBriefcase, FaEnvelope, FaComments } from 'react-icons/fa';
import './FindAgentList.css';

import { GetAgentAll } from '../../../../Redux-store/Slices/AgentAllSlice';
import { setAgentDetails } from '../../../../Redux-store/Slices/AgentSlice';
import AgentDetailPopup from '../../../helper/AgentDetailPopup';
import MessageAgentPopup from '../../../helper/MessageAgentPopup';

const RegionalStateList = [
    { value: 'Addis Ababa City Administration', label: 'Addis Ababa City Administration' },
    { value: 'Afar Region', label: 'Afar Region' },
    { value: 'Amhara Region', label: 'Amhara Region' },
    { value: 'Benishangul-Gumuz Region', label: 'Benishangul-Gumuz Region' },
    { value: 'Dire Dawa City Administration', label: 'Dire Dawa City Administration' },
    { value: 'Gambela Region', label: 'Gambela Region' },
    { value: 'Harari Region', label: 'Harari Region' },
    { value: 'Oromia Region', label: 'Oromia Region' },
    { value: 'Sidama Region', label: 'Sidama Region' },
    { value: 'Somali Region', label: 'Somali Region' },
    { value: 'South Ethiopia Region', label: 'South Ethiopia Region' },
    { value: 'South West Ethiopia Peoples\' Region', label: 'South West Ethiopia Peoples\' Region' },
    { value: 'Tigray Region', label: 'Tigray Region' },
    { value: 'Central Ethiopia Region', label: 'Central Ethiopia Region' }
];

const FindAgentList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: agentsData, pending: loading, error } = useSelector(state => state.AgentAll.data);
  const { agents, totalPages } = agentsData;

  const [filters, setFilters] = useState({
    region: '',
    specialty: '',
    language: '',
    rating: '',
    verifiedOnly: false
  });
  const [showAgentPopup, setShowAgentPopup] = useState(false);
  const [showMessagePopup, setShowMessagePopup] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // Parse query parameters from URL and fetch agents
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const newFilters = {
      region: queryParams.get('region') || '',
      specialty: queryParams.get('specialty') || '',
      language: queryParams.get('language') || '',
      rating: queryParams.get('rating') || '',
      verifiedOnly: queryParams.get('verifiedOnly') === 'true'
    };
    setFilters(newFilters);
    dispatch(GetAgentAll(newFilters));
  }, [location.search, dispatch]);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newFilters = {
      ...filters,
      [name]: type === 'checkbox' ? checked : value
    };
    setFilters(newFilters);
    
    // Update URL with new filters
    const queryParams = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        queryParams.append(key, value);
      }
    });
    
    navigate(`/find-agent/list?${queryParams.toString()}`);
  };

  const clearFilter = (filterName) => {
    const newFilters = { ...filters, [filterName]: '' };
    setFilters(newFilters);
    
    // Update URL with new filters
    const queryParams = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        queryParams.append(key, value);
      }
    });
    
    navigate(`/find-agent/list?${queryParams.toString()}`);
  };

  const clearAllFilters = () => {
    const newFilters = {
      region: '',
      specialty: '',
      language: '',
      rating: '',
      verifiedOnly: false
    };
    setFilters(newFilters);
    navigate('/find-agent/list');
  };

  const handleViewAgentDetails = (agent) => {
    dispatch(setAgentDetails(agent));
    setShowAgentPopup(true);
  };

  const closeAgentPopup = () => {
    setShowAgentPopup(false);
  };
  
  const handleMessageAgent = (agent, e) => {
    e.stopPropagation(); // Prevent triggering the card click
    dispatch(setAgentDetails(agent));
    setShowMessagePopup(true);
  };
  
  const closeMessagePopup = () => {
    setShowMessagePopup(false);
  };

  // Get current agents for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAgents = agents.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Render stars for ratings
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="star filled" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStar key={i} className="star half-filled" />);
      } else {
        stars.push(<FaStar key={i} className="star" />);
      }
    }
    
    return (
      <div className="agent-rating">
        {stars} <span>({rating})</span>
      </div>
    );
  };

  // Check if any filters are active
  const hasActiveFilters = () => {
    return filters.region || filters.specialty || filters.language || filters.rating || filters.verifiedOnly;
  };

  return (
    <div className="findagent-list-main">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            {/* Filters Section */}
            <div className="agent-filters-section">
              <h3><FaFilter /> Filter Agents</h3>
              
              <div className="agent-filter-container">
                <div className="agent-filter-row">
                  <div className="agent-filter-group">
                    <label htmlFor="region-filter"><FaMapMarkerAlt /> Region/City</label>
                    <select 
                      id="region-filter" 
                      name="region" 
                      value={filters.region}
                      onChange={handleFilterChange}
                    >
                      <option value="">All Regions</option>
                      {RegionalStateList.map(region => (
                        <option key={region.value} value={region.value.toLowerCase().replace(/ /g, '-')}>
                          {region.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="agent-filter-group">
                    <label htmlFor="language-filter"><FaLanguage /> Language</label>
                    <select 
                      id="language-filter" 
                      name="language" 
                      value={filters.language}
                      onChange={handleFilterChange}
                    >
                      <option value="">All Languages</option>
                      <option value="amharic">Amharic</option>
                      <option value="afaan-oromo">Afaan Oromo</option>
                      <option value="english">English</option>
                      <option value="tigrinya">Tigrinya</option>
                      <option value="somali">Somali</option>
                    </select>
                  </div>
                  
                  <div className="agent-filter-group">
                    <label htmlFor="rating-filter"><FaStar /> Minimum Rating</label>
                    <select 
                      id="rating-filter" 
                      name="rating" 
                      value={filters.rating}
                      onChange={handleFilterChange}
                    >
                      <option value="">Any Rating</option>
                      <option value="3">3+ Stars</option>
                      <option value="4">4+ Stars</option>
                      <option value="5">5 Stars</option>
                    </select>
                  </div>
                  
                  <div className="agent-filter-group checkbox-group">
                    <input 
                      type="checkbox" 
                      id="verifiedOnly-filter" 
                      name="verifiedOnly" 
                      checked={filters.verifiedOnly}
                      onChange={handleFilterChange}
                    />
                    <label htmlFor="verifiedOnly-filter">Verified Only</label>
                  </div>
                  
                  <div className="agent-filter-actions">
                    {hasActiveFilters() && (
                      <button className="secondary-btn" onClick={clearAllFilters}>
                        Clear All
                      </button>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Active Filters Display */}
              {hasActiveFilters() && (
                <div className="active-filters">
                  {filters.region && (
                    <div className="filter-tag">
                      Region: {filters.region.replace('-', ' ')}
                      <button onClick={() => clearFilter('region')}><FaTimesCircle /></button>
                    </div>
                  )}
                  
                  {filters.specialty && (
                    <div className="filter-tag">
                      Specialty: {filters.specialty}
                      <button onClick={() => clearFilter('specialty')}><FaTimesCircle /></button>
                    </div>
                  )}
                  
                  {filters.language && (
                    <div className="filter-tag">
                      Language: {filters.language.replace('-', ' ')}
                      <button onClick={() => clearFilter('language')}><FaTimesCircle /></button>
                    </div>
                  )}
                  
                  {filters.rating && (
                    <div className="filter-tag">
                      {filters.rating}+ Stars
                      <button onClick={() => clearFilter('rating')}><FaTimesCircle /></button>
                    </div>
                  )}
                  
                  {filters.verifiedOnly && (
                    <div className="filter-tag">
                      Verified Only
                      <button onClick={() => clearFilter('verifiedOnly')}><FaTimesCircle /></button>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Agent List Section */}
            <div className="agentfind-list">
                <div className="agentfnd-location-title">
                  <p>
                    <FaBuilding /> {agents.length} Agents {filters.region ? `in ${filters.region.replace('-', ' ')}` : 'Available'}
                  </p>
                </div>
              
              {loading ? (
                <div className="agents-loading">
                  <p><span className="loading-spinner"></span> Loading agents...</p>
                </div>
              ) : agents.length === 0 ? (
                <div className="no-agents-found">
                  <h4>No Agents Found</h4>
                  <p>Try adjusting your filters to see more results.</p>
                  <button className="primary-btn" onClick={clearAllFilters}>Clear All Filters</button>
                </div>
              ) : (
                <>
                  <ul className="agent-list">
                    {currentAgents.map(agent => (
                      <li key={agent._id} className="agent-list-item">
                        <div className="agent-card" onClick={() => handleViewAgentDetails(agent)}>
                          {agent.isVerified && (
                            <div className="verified-badge" title="Verified Agent">
                              <FaCheck />
                            </div>
                          )}
                          
                          <div className="agent-image">
                            <span style={{backgroundImage: agent.profilePicture ? `url(${agent.profilePicture})` : 'none'}}></span>
                          </div>
                          
                          <div className="agent-info">
                            <div className="agent-info-top">
                              <div className="agent-name-info">
                                <h5>{agent.firstName} {agent.lastName}</h5>
                                <div className="agent-region">{agent.region}</div>
                                <div className="agent-phone">
                                  <FaPhone /> {agent.phone}
                                </div>
                              </div>
                              
                              <div>
                                {renderStars(agent.averageRating || 0)}
                              </div>
                            </div>
                            
                              <div className="agent-details">
                                <div className="message-agent-button-container">
                                  <button 
                                    className="message-agent-btn"
                                    onClick={(e) => handleMessageAgent(agent, e)}
                                  >
                                    <FaEnvelope /> Message Agent
                                  </button>
                                </div>
                                
                  <div className="agent-detail-item">
                    <p><strong><FaBriefcase /> Experience:</strong> {agent.experience} years</p>
                  </div>
                              
                              <div className="agent-detail-item">
                                <p><strong>Specialties:</strong></p>
                                <div className="agent-specialties">
                                {agent.specialties && agent.specialties.length > 0 ? agent.specialties.map((specialty, index) => (
                                  <span key={index} className="specialty-tag">{specialty}</span>
                                )) : <span>No specialties listed</span>}
                                </div>
                              </div>
                              
                              <div className="agent-detail-item">
                                <p><strong>Languages:</strong></p>
                                <div className="agent-languages">
                                  {agent.languagesSpoken && agent.languagesSpoken.length > 0 ? agent.languagesSpoken.map((language, index) => (
                                    <span key={index} className="language-tag">{language}</span>
                                  )) : <span>No languages listed</span>}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                  
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="pagination-container">
                      <button 
                        className="pagination-btn"
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                      &laquo; Previous
                      </button>
                      
                      <div className="page-numbers">
                        {[...Array(totalPages).keys()].map(number => (
                          <button
                            key={number + 1}
                            className={`page-number ${currentPage === number + 1 ? 'active' : ''}`}
                            onClick={() => paginate(number + 1)}
                          >
                            {number + 1}
                          </button>
                        ))}
                      </div>
                      
                      <button 
                        className="pagination-btn"
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                      Next &raquo;
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Agent Detail Popup */}
      {showAgentPopup && (
        <AgentDetailPopup onClose={closeAgentPopup} />
      )}
      
      {/* Message Agent Popup */}
      {showMessagePopup && (
        <MessageAgentPopup onClose={closeMessagePopup} />
      )}
    </div>
  );
};

export default FindAgentList;
