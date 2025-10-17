import React from 'react';
import { Link } from 'react-router-dom';
import { 
  /* SvgFacebookIcon, */
  /* SvgTwitterIcon, */
  /* SvgInstagramIcon, */
  /* SvgLinkedInIcon */
} from '../../../assets/svg-files/SvgFiles';
import { Logo } from '../../../assets/images';

const Footer = () => {
  return (
    <>
      {/* Main Footer - Enhanced with modern design */}
      <footer className="footer" style={{ 
        backgroundColor: '#2e3d40', 
        color: 'white', 
        padding: '20px 0 10px',
        borderTop: '2px solid #b9f73e'
      }}>
        <div className="container">
          <div className="row mb-4">
            <div className="col-lg-4 col-md-6 mb-4 mb-md-0">
              <h2 style={{ 
                fontSize: '18px', 
                fontWeight: '700', 
                marginBottom: '8px', 
                color: 'white',
                position: 'relative',
                paddingBottom: '5px'
              }}>
                Addisnest
                <span style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '60px',
                  height: '3px',
                  background: '#b9f73e',
                  borderRadius: '2px'
                }}></span>
              </h2>
              <p style={{ 
                fontSize: '12px', 
                color: '#e0e0e0', 
                lineHeight: '1.4', 
                marginBottom: '5px',
                maxWidth: '90%'
              }}>
                Connecting you to the best properties across Ethiopia.
              </p>
            </div>
            
          </div>
          
          {/* Footer Links - Horizontal Layout */}
          <div className="row mb-2">
            <div className="col-12">
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '15px',
                justifyContent: 'space-between'
              }}>
                {/* Addisnest Links */}
                <div>
                  <h5 style={{ 
                    fontSize: '12px', 
                    marginBottom: '5px', 
                    color: '#b9f73e',
                    fontWeight: '600'
                  }}>
                    Addisnest
                  </h5>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    <li style={{ marginBottom: '8px' }}>
                      <Link 
                        to="/property-list" 
                        style={{ 
                          color: '#e0e0e0', 
                          textDecoration: 'none', 
                          transition: 'all 0.3s ease',
                          fontSize: '11px'
                        }}
                        onClick={() => {
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                          if (window.location.pathname === '/property-list') {
                            window.location.reload();
                          }
                        }}
                        onMouseOver={(e) => e.target.style.color = '#b9f73e'}
                        onMouseOut={(e) => e.target.style.color = '#e0e0e0'}
                      >
                        Buy a house
                      </Link>
                    </li>
                    <li style={{ marginBottom: '8px' }}>
                      <Link 
                        to="/sell" 
                        style={{ 
                          color: '#e0e0e0', 
                          textDecoration: 'none', 
                          transition: 'all 0.3s ease',
                          fontSize: '11px'
                        }}
                        onClick={() => {
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                          if (window.location.pathname === '/sell') {
                            window.location.reload();
                          }
                        }}
                        onMouseOver={(e) => e.target.style.color = '#b9f73e'}
                        onMouseOut={(e) => e.target.style.color = '#e0e0e0'}
                      >
                        Sell a house
                      </Link>
                    </li>
                  </ul>
                </div>
                
                {/* Quick Links */}
                <div>
                  <h5 style={{ 
                    fontSize: '12px', 
                    marginBottom: '5px', 
                    color: '#b9f73e',
                    fontWeight: '600'
                  }}>
                    Quick Links
                  </h5>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    <li style={{ marginBottom: '8px' }}>
                      <Link to="/about-us" style={{ 
                        color: '#e0e0e0', 
                        textDecoration: 'none', 
                        transition: 'all 0.3s ease',
                        fontSize: '11px'
                      }}
                      onMouseOver={(e) => e.target.style.color = '#b9f73e'}
                      onMouseOut={(e) => e.target.style.color = '#e0e0e0'}
                      >
                        About Us
                      </Link>
                    </li>
                    <li style={{ marginBottom: '8px' }}>
                      <Link to="/contact-us" style={{ 
                        color: '#e0e0e0', 
                        textDecoration: 'none', 
                        transition: 'all 0.3s ease',
                        fontSize: '11px'
                      }}
                      onMouseOver={(e) => e.target.style.color = '#b9f73e'}
                      onMouseOut={(e) => e.target.style.color = '#e0e0e0'}
                      >
                        Contact
                      </Link>
                    </li>
                    <li style={{ marginBottom: '8px' }}>
                      <Link to="/privacy-policy" style={{ 
                        color: '#e0e0e0', 
                        textDecoration: 'none', 
                        transition: 'all 0.3s ease',
                        fontSize: '11px'
                      }}
                      onMouseOver={(e) => e.target.style.color = '#b9f73e'}
                      onMouseOut={(e) => e.target.style.color = '#e0e0e0'}
                      >
                        Privacy Policy
                      </Link>
                    </li>
                    <li style={{ marginBottom: '8px' }}>
                      <Link to="/terms-of-service" style={{ 
                        color: '#e0e0e0', 
                        textDecoration: 'none', 
                        transition: 'all 0.3s ease',
                        fontSize: '11px'
                      }}
                      onMouseOver={(e) => e.target.style.color = '#b9f73e'}
                      onMouseOut={(e) => e.target.style.color = '#e0e0e0'}
                      >
                        Terms of Service
                      </Link>
                    </li>
                  </ul>
                </div>
                
                {/* For Partners */}
                <div>
                  <h5 style={{ 
                    fontSize: '12px', 
                    marginBottom: '5px', 
                    color: '#b9f73e',
                    fontWeight: '600'
                  }}>
                    For Partners
                  </h5>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    <li style={{ marginBottom: '8px' }}>
                      <Link to="/partner-with-us" style={{ 
                        color: '#e0e0e0', 
                        textDecoration: 'none', 
                        transition: 'all 0.3s ease',
                        fontSize: '11px'
                      }}
                      onMouseOver={(e) => e.target.style.color = '#b9f73e'}
                      onMouseOut={(e) => e.target.style.color = '#e0e0e0'}
                      >
                        Partner With Us
                      </Link>
                    </li>
                  </ul>
                </div>
                
                {/* Connect With Us */}
                <div>
                  <h5 style={{ 
                    fontSize: '12px', 
                    marginBottom: '5px', 
                    color: '#b9f73e',
                    fontWeight: '600'
                  }}>
                    Connect With Us
                  </h5>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <a href="#" style={{ 
                    width: '30px', 
                    height: '30px', 
                    backgroundColor: 'rgba(255,255,255,0.1)', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: 'white',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    border: '1px solid rgba(255,255,255,0.05)'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#b9f73e';
                    e.target.style.color = '#2e3d40';
                    e.target.style.transform = 'translateY(-3px)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
                    e.target.style.color = 'white';
                    e.target.style.transform = 'translateY(0)';
                  }}
                  >
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a href="#" style={{ 
                    width: '30px', 
                    height: '30px', 
                    backgroundColor: 'rgba(255,255,255,0.1)', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: 'white',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    border: '1px solid rgba(255,255,255,0.05)'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#b9f73e';
                    e.target.style.color = '#2e3d40';
                    e.target.style.transform = 'translateY(-3px)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
                    e.target.style.color = 'white';
                    e.target.style.transform = 'translateY(0)';
                  }}
                  >
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href="#" style={{ 
                    width: '42px', 
                    height: '42px', 
                    backgroundColor: 'rgba(255,255,255,0.1)', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: 'white',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    border: '1px solid rgba(255,255,255,0.05)'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#b9f73e';
                    e.target.style.color = '#2e3d40';
                    e.target.style.transform = 'translateY(-3px)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
                    e.target.style.color = 'white';
                    e.target.style.transform = 'translateY(0)';
                  }}
                  >
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a href="#" style={{ 
                    width: '42px', 
                    height: '42px', 
                    backgroundColor: 'rgba(255,255,255,0.1)', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: 'white',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    border: '1px solid rgba(255,255,255,0.05)'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#b9f73e';
                    e.target.style.color = '#2e3d40';
                    e.target.style.transform = 'translateY(-3px)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
                    e.target.style.color = 'white';
                    e.target.style.transform = 'translateY(0)';
                  }}
                  >
                    <i className="fab fa-linkedin-in"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom" style={{ 
            borderTop: '1px solid rgba(255,255,255,0.1)', 
            paddingTop: '20px', 
            display: 'flex', 
            justifyContent: 'space-between', 
            flexWrap: 'wrap',
            marginTop: '10px'
          }}>
            <p style={{ 
              fontSize: '14px', 
              color: '#e0e0e0',
              letterSpacing: '0.5px'
            }}>&copy; {new Date().getFullYear()} Addisnest. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
