import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import LoginPopup from '../../../helper/LoginPopup';
import CustomerRegisterPopup from '../../../helper/CustomerRegisterPopup';
import MortgageCalculatorPopup from '../../../components/helper/MortgageCalculatorPopup';
import MobileBottomNav from '../MobileBottomNav';
import { isAuthenticated } from '../../../utils/tokenHandler';
import { useSelector } from 'react-redux';
import './Header.css';

const Header = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showRegisterPopup, setShowRegisterPopup] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMortgageCalculator, setShowMortgageCalculator] = useState(false);
  const [buyRentMode, setBuyRentMode] = useState('buy'); // Track the Buy/Rent toggle state
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);
  const navigate = useNavigate();
  const user = useSelector((state) => state.Auth.Details.data);
  const userMenuRef = useRef(null);
  
  // Add event listener for window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Add click outside handler to close user menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <header className="header">
      {isAuthenticated() && user && (
        <div className="welcome-header">
          <div className="container">
            <div className="welcome-message">
              Welcome, <span className="welcome-name">{user.firstName} {user.lastName}</span>
            </div>
          </div>
        </div>
      )}
      <div className="container">
        <div className="header-main">
          <div className="logo-area">
            <Link to="/" className="logo">
              <div className="logo-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="house-icon">
                  <path d="M12 2.1L1 12h3v9h7v-6h2v6h7v-9h3L12 2.1zm0 2.691l6 5.4V19h-3v-6H9v6H6v-8.809l6-5.4z" />
                </svg>
              </div>
              <div className="logo-text">
                <span className="addis">Addis</span>
                <span className="nest">Nest</span>
              </div>
            </Link>
          </div>

          {!isMobile && (
          <div className="nav-main desktop-only-nav">
            <ul className="navigation desktop-only-nav">
              <li>
                <div 
                  className={`${isActive('/property-list')} nav-link buy-rent-toggle`}
                  onClick={(e) => {
                    e.preventDefault();
                    // Toggle between buy and rent
                    const newMode = buyRentMode === 'buy' ? 'rent' : 'buy';
                    setBuyRentMode(newMode);
                    
                    // Navigate to the appropriate page based on the new mode
                    console.log(`Buy/Rent button clicked, toggling to ${newMode} mode`);
                    if (newMode === 'buy') {
                      navigate('/property-list?for=sale');
                    } else {
                      navigate('/property-list?for=rent');
                    }
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <span>Buy/Rent</span>
                  <span className={`toggle-indicator ${buyRentMode}`}>
                    {buyRentMode === 'buy' ? 'Buy' : 'Rent'}
                  </span>
                </div>
              </li>
              <li>
                <Link
                  to="/sell"
                  className={`${isActive('/sell')} nav-link`}
                  onClick={(e) => {
                    if (!isAuthenticated()) {
                      e.preventDefault();
                      setShowLoginPopup(true);
                    } else {
                      e.preventDefault();
                      navigate('/property-list-form');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                >
                  Sell
                </Link>
              </li>
              <li>
                <div
                  className={`${isActive('/mortgage-calculator')} nav-link`}
                  onClick={() => setShowMortgageCalculator(true)}
                  style={{ cursor: 'pointer' }}
                >
                  Mortgage Calculator
                </div>
              </li>
              <li>
                <Link
                  to="/find-agent"
                  className={`${isActive('/find-agent')} nav-link`}
                >
                  Find Agent
                </Link>
              </li>
            </ul>
          </div>
          )}

          <div className="right-section">
            
            {isAuthenticated() ? (
              <>
                <div 
                  className="message-icon-container"
                  onClick={() => {
                    navigate('/account-management', { state: { activeTab: 'messages' } });
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  title="My Messages"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="message-icon">
                    <path d="M3 3h18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm17 4.238l-7.928 7.1L4 7.216V19h16V7.238zM4.511 5l7.55 6.662L19.502 5H4.511z" />
                  </svg>
                </div>
                <div className="user-menu-container" ref={userMenuRef}>
                  <div
                    className="user-menu-trigger"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                  >
                    <div className="user-header-info">
                      {user?.firstName && (
                        <span className="user-header-name">
                          {user.firstName}
                        </span>
                      )}
                      <div className="profile-picture-container">
                        {user?.profilePicture ? (
                          <img
                            src={user.profilePicture}
                            alt="Profile"
                            className="profile-picture"
                          />
                        ) : (
                          <span className="profile-initial">
                            {user?.firstName?.charAt(0) || 'U'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {showUserMenu && (
                    <div className="user-menu">
                      <div className="user-info">
                        <p className="user-name">
                          {user?.firstName} {user?.lastName}
                        </p>
                      </div>
                      <Link
                        to="/account-management"
                        className="user-menu-link"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Account Management
                      </Link>
                      <div
                        className="logout-button"
                        onClick={() => {
                          localStorage.removeItem('addisnest_token');
                          localStorage.removeItem('isLogin');
                          localStorage.removeItem('userId');
                          window.location.href = '/';
                        }}
                      >
                        Logout
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="auth-buttons">
                <button
                  className="login-btn"
                  onClick={() => setShowLoginPopup(true)}
                >
                  Login
                </button>
                <button
                  onClick={() => setShowRegisterPopup(true)}
                  className="register-btn"
                >
                  Register
                </button>
              </div>
            )}

            <button
              className="mobile-menu-toggle"
              onClick={toggleMobileMenu}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </div>
      {showLoginPopup && <LoginPopup handlePopup={() => setShowLoginPopup(false)} />}
      {showRegisterPopup && <CustomerRegisterPopup handlePopup={() => setShowRegisterPopup(false)} handleLogin={() => {
        setShowRegisterPopup(false);
        setShowLoginPopup(true);
      }} />}
      {showMortgageCalculator && <MortgageCalculatorPopup handlePopup={() => setShowMortgageCalculator(false)} />}
      
      {/* Mobile Bottom Navigation */}
      <MobileBottomNav 
        buyRentMode={buyRentMode} 
        setBuyRentMode={setBuyRentMode} 
        setShowLoginPopup={setShowLoginPopup}
        setShowMortgageCalculator={setShowMortgageCalculator}
      />
    </header>
  );
};

export default Header;
