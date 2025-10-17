import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SvgSearchIcon } from '../../../assets/svg-files/SvgFiles.jsx';

const HeroSection = () => {
  const [searchType, setSearchType] = useState('buy');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/${searchType}?search=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <section className="hero-section" style={{
      background: '#f5f5f5', // Light gray background like Redfin
      padding: '20px 0',
      height: 'auto'
    }}>
      <div className="container">
        <div className="row">
          <div className="col-lg-8 col-md-10 mx-auto">
            <div className="hero-content" style={{ textAlign: 'center' }}>
              <h1 style={{
                fontSize: '1.2rem',
                fontWeight: '500',
                color: '#333',
                marginBottom: '1rem'
              }}>
                Find the right home at the right price
              </h1>

              <div className="search-container" style={{
                background: 'white',
                borderRadius: '3px',
                padding: '4px',
                maxWidth: '500px',
                margin: '0 auto',
               
              }}>
                <div className="search-tabs" style={{
                  display: 'flex',
                  paddingBottom: '4px',
                  borderBottom: '1px solid #f0f0f0',
                  marginBottom: '4px',
                  justifyContent: 'center'
                }}>
                  {['buy', 'rent', 'sell'].map((type) => (
                    <button 
                      key={type}
                      onClick={() => setSearchType(type)}
                      style={{
                        padding: '2px 8px',
                        fontWeight: '400',
                        textTransform: 'capitalize',
                        color: searchType === type ? '#000' : '#666',
                        background: searchType === type ? '#e9ecef' : 'transparent',
                        border: 'none',
                        borderRadius: '2px',
                        cursor: 'pointer',
                        fontSize: '10px',
                        margin: '0 2px'
                      }}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSearch}>
                  <div style={{
                    display: 'flex',
                    overflow: 'hidden'
                  }}>
                    <input
                      type="text"
                      placeholder="City, Address, School, Agent, ZIP"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{
                        flex: 1,
                        padding: '4px 8px',
                        fontSize: '10px',
                        border: 'none',
                        borderRadius: '2px 0 0 2px',
                        outline: 'none',
                        height: '24px'
                      }}
                    />
                    <button 
                      type="submit"
                      style={{
                        background: '#d9534f',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0 2px 2px 0',
                        padding: '0 10px',
                        fontSize: '10px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <SvgSearchIcon style={{ width: '10px', height: '10px' }} />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;