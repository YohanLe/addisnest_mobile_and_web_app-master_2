import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { GetAgentAll } from '../../../../Redux-store/Slices/AgentAllSlice';

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

const SearchAgent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchForm, setSearchForm] = useState({
    region: '',
    specialty: '',
    language: '',
    rating: '',
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
    
    // Build query string from form values
    const queryParams = new URLSearchParams();
    
    Object.entries(searchForm).forEach(([key, value]) => {
      if (value) {
        queryParams.append(key, value);
      }
    });
    
    navigate(`/find-agent/list?${queryParams.toString()}`);
  };

  const handleBrowseAll = () => {
    navigate('/find-agent/list');
  };

  return (
    <div className="search-agent-main">
      <div className="container">
        <div className="scrchagent-inner">
          <div className="srchagent-heading">
            <h3>Find a Real Estate Agent</h3>
            <p>Search for professional agents in your area</p>
          </div>

          <form className="agent-search-form" onSubmit={handleSubmit}>
            <div className="search-form-row">
              <div className="search-form-group">
                <label htmlFor="region">Region/City</label>
                <select 
                  id="region" 
                  name="region" 
                  value={searchForm.region}
                  onChange={handleInputChange}
                >
                  <option value="">Select Region</option>
                  {RegionalStateList.map(region => (
                    <option key={region.value} value={region.value.toLowerCase().replace(/ /g, '-')}>
                      {region.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="search-form-group">
                <label htmlFor="specialty">Specialty</label>
                <select 
                  id="specialty" 
                  name="specialty" 
                  value={searchForm.specialty}
                  onChange={handleInputChange}
                >
                  <option value="">All Specialties</option>
                  <option value="buying">Buying</option>
                  <option value="selling">Selling</option>
                  <option value="renting">Renting</option>
                  <option value="commercial">Commercial</option>
                  <option value="residential">Residential</option>
                  <option value="luxury">Luxury Homes</option>
                  <option value="farmland">Farmland</option>
                  <option value="investment">Investment Properties</option>
                </select>
              </div>
            </div>

            <div className="search-form-row">
              <div className="search-form-group">
                <label htmlFor="language">Language</label>
                <select 
                  id="language" 
                  name="language" 
                  value={searchForm.language}
                  onChange={handleInputChange}
                >
                  <option value="">All Languages</option>
                  <option value="amharic">Amharic</option>
                  <option value="afaan-oromo">Afaan Oromo</option>
                  <option value="english">English</option>
                  <option value="tigrinya">Tigrinya</option>
                  <option value="somali">Somali</option>
                </select>
              </div>

              <div className="search-form-group">
                <label htmlFor="rating">Minimum Rating</label>
                <select 
                  id="rating" 
                  name="rating" 
                  value={searchForm.rating}
                  onChange={handleInputChange}
                >
                  <option value="">Any Rating</option>
                  <option value="3">3+ Stars</option>
                  <option value="4">4+ Stars</option>
                  <option value="5">5 Stars</option>
                </select>
              </div>
            </div>

            <div className="search-form-checkbox">
              <input 
                type="checkbox" 
                id="verifiedOnly" 
                name="verifiedOnly" 
                checked={searchForm.verifiedOnly}
                onChange={handleInputChange}
              />
              <label htmlFor="verifiedOnly">Show only verified agents</label>
            </div>

            <div className="search-form-actions">
              <button type="submit" className="primary-btn">Search Agents</button>
            </div>
          </form>

          <div className="search-divider">
            <span>OR</span>
          </div>

          <div className="findagent-loaction">
            <button className="location-link" onClick={handleBrowseAll}>
              <FaMapMarkerAlt />
              Browse All Agents
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchAgent;
