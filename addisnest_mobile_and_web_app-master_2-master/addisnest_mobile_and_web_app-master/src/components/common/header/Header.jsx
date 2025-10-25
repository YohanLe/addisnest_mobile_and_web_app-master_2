import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import LoginPopup from '../../../helper/LoginPopup';
import CustomerRegisterPopup from '../../../helper/CustomerRegisterPopup';
import MortgageCalculatorPopup from '../../../components/helper/MortgageCalculatorPopup';
import MobileBottomNav from '../MobileBottomNav';
import { isAuthenticated, getTokenData } from '../../../utils/tokenHandler';
import { useSelector } from 'react-redux';
import messageNotificationService from '../../../utils/messageNotifications';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useTranslations } from '../../../locales/translations';
import './Header.css';

const Header = ({ showLoginPopup, setShowLoginPopup }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showRegisterPopup, setShowRegisterPopup] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMortgageCalculator, setShowMortgageCalculator] = useState(false);
  const [buyRentMode, setBuyRentMode] = useState('buy'); // Track the Buy/Rent toggle state
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const navigate = useNavigate();
  const user = useSelector((state) => state.Auth.Details.data);
  const userMenuRef = useRef(null);
  
  // Language context and translations
  const { language, toggleLanguage } = useLanguage();
  const t = useTranslations(language);
  
  // Get user data from token as fallback if Redux store doesn't have it
  const tokenData = getTokenData();
  const effectiveUser = user || tokenData;
  
  // Check if user is admin - add multiple fallback checks
  const isOnAdminPage = location.pathname.startsWith('/admin');
  const isAdmin = effectiveUser?.role === 'admin' || 
                  effectiveUser?.role === 'ADMIN' ||
                  effectiveUser?.isAdmin === true ||
                  effectiveUser?.isAdmin === 'true' ||
                  localStorage.getItem('userRole') === 'admin' ||
                  isOnAdminPage; // If user is on admin page, they must be admin
  
  // Authentication status tracking
  useEffect(() => {
    // Store user role in localStorage for persistence across reloads
    if (effectiveUser?.role) {
      localStorage.setItem('userRole', effectiveUser.role);
    }
  }, [user, tokenData, effectiveUser, isAdmin]);

  // Set up message notification listener
  useEffect(() => {
    const handleMessageCountUpdate = (count) => {
      setUnreadMessageCount(count);
    };

    // Add listener for message count updates
    messageNotificationService.addListener(handleMessageCountUpdate);

    // Initialize with current count - fetch from backend if available
    if (isAuthenticated() && effectiveUser?._id) {
      // Start with 0, actual count will be fetched from the backend
      messageNotificationService.setUnreadCount(0);
      
      // TODO: Fetch actual unread message count from the backend
      // Example:
      // Api.get(`/messages/unread-count?userId=${effectiveUser._id}`)
      //   .then(response => {
      //     messageNotificationService.setUnreadCount(response.data.count);
      //   })
      //   .catch(error => console.error('Error fetching unread count:', error));
    }

    // Cleanup listener on unmount
    return () => {
      messageNotificationService.removeListener(handleMessageCountUpdate);
    };
  }, [effectiveUser]);
  
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

  // Add event listener for custom showLoginPopup event from BannerSection
  useEffect(() => {
    const handleShowLoginPopup = (event) => {
      setShowLoginPopup(true);
    };

    window.addEventListener('showLoginPopup', handleShowLoginPopup);
    return () => {
      window.removeEventListener('showLoginPopup', handleShowLoginPopup);
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
      {isAuthenticated() && effectiveUser && (
        <div className="welcome-header">
          <div className="container">
            <div className="welcome-message">
              Welcome, <span className="welcome-name">{effectiveUser.firstName} {effectiveUser.lastName}</span>
            </div>
          </div>
        </div>
      )}
      <div className="container">
        <div className="header-main">
          <div className="logo-area">
            <Link to="/" className="logo">
              <div className="logo-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="house-icon">
                  {/* Main A-shaped house in blue */}
                  <path d="M 50 10 L 90 60 L 80 60 L 80 85 L 20 85 L 20 60 L 10 60 Z" fill="#5fa8d3"/>
                  
                  {/* Yellow window with grid */}
                  <rect x="40" y="40" width="20" height="20" fill="#f4d03f"/>
                  <rect x="43" y="43" width="4" height="4" fill="#2e3e4e"/>
                  <rect x="51" y="43" width="4" height="4" fill="#2e3e4e"/>
                  <rect x="43" y="51" width="4" height="4" fill="#2e3e4e"/>
                  <rect x="51" y="51" width="4" height="4" fill="#2e3e4e"/>
                  
                  {/* Ethiopian flag stripes (Green, Yellow, Red) */}
                  <polygon points="20,65 32,50 38,56 26,70" fill="#22b14c"/>
                  <polygon points="26,70 38,56 44,62 32,76" fill="#f4d03f"/>
                  <polygon points="32,76 44,62 50,68 38,82" fill="#ff0000"/>
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
                    if (newMode === 'buy') {
                      navigate('/property-list?for=sale');
                    } else {
                      navigate('/property-list?for=rent');
                    }
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <span>{t.buyRent}</span>
                  <span className={`toggle-indicator ${buyRentMode}`}>
                    {buyRentMode === 'buy' ? t.buy : t.rent}
                  </span>
                </div>
              </li>
              <li>
                <div
                  className={`${isActive('/property-list-form')} nav-link`}
                  onClick={() => {
                    if (!isAuthenticated()) {
                      setShowLoginPopup(true);
                    } else {
                      navigate('/property-list-form');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  {t.sell}
                </div>
              </li>
              <li>
                <div
                  className={`${isActive('/mortgage-calculator')} nav-link`}
                  onClick={() => setShowMortgageCalculator(true)}
                  style={{ cursor: 'pointer' }}
                >
                  {t.mortgageCalculator}
                </div>
              </li>
              <li>
                <Link
                  to="/find-agent"
                  className={`${isActive('/find-agent')} nav-link`}
                >
                  {t.findAgent}
                </Link>
              </li>
            </ul>
          </div>
          )}

          <div className="right-section">
            {/* Language Toggle Button */}
            <button
              onClick={toggleLanguage}
              className="language-toggle"
              style={{
                backgroundColor: 'transparent',
                border: '2px solid #a4ff2a',
                borderRadius: '20px',
                padding: '6px 12px',
                marginRight: '15px',
                color: '#333',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontFamily: language === 'am' ? "'Noto Sans Ethiopic', sans-serif" : 'inherit'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#a4ff2a';
                e.target.style.color = '#000';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#333';
              }}
            >
              {language === 'en' ? 'አማ' : 'EN'}
            </button>
            
            {isAuthenticated() ? (
              <>
                <div 
                  className="message-icon-container"
                  onClick={() => {
                    navigate('/account-management', { state: { activeTab: 'messages' } });
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    messageNotificationService.clearUnreadCount(); // Clear count when user clicks messages
                  }}
                  title="My Messages"
                  style={{ position: 'relative', cursor: 'pointer', padding: '8px' }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="message-icon">
                    <path d="M3 3h18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm17 4.238l-7.928 7.1L4 7.216V19h16V7.238zM4.511 5l7.55 6.662L19.502 5H4.511z" />
                  </svg>
                  {unreadMessageCount > 0 && (
                    <span 
                      className="message-count-badge"
                      style={{
                        position: 'absolute',
                        top: '2px',
                        right: '2px',
                        backgroundColor: '#ff4444',
                        color: 'white',
                        borderRadius: '50%',
                        width: '18px',
                        height: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '10px',
                        fontWeight: 'bold',
                        border: '2px solid white',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                      }}
                    >
                      {unreadMessageCount > 99 ? '99+' : unreadMessageCount}
                    </span>
                  )}
                </div>
                <div className="user-menu-container" ref={userMenuRef}>
                  <div
                    className="user-menu-trigger"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                  >
                    <div className="user-header-info">
                      {effectiveUser?.firstName && (
                        <span className="user-header-name">
                          {effectiveUser.firstName}
                        </span>
                      )}
                      <div className="profile-picture-container">
                        {effectiveUser?.profilePicture ? (
                          <img
                            src={effectiveUser.profilePicture}
                            alt="Profile"
                            className="profile-picture"
                          />
                        ) : (
                          <span className="profile-initial">
                            {effectiveUser?.firstName?.charAt(0) || 'C'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {showUserMenu && (
                    <div className="user-menu">
                      <div className="user-info">
                        <p className="user-name">
                          {effectiveUser?.firstName} {effectiveUser?.lastName}
                        </p>
                        {effectiveUser?.role && (
                          <p className="user-role" style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                            {effectiveUser.role}
                          </p>
                        )}
                      </div>
                      {isAdmin && (
                        <Link
                          to="/admin/dashboard"
                          className="user-menu-link"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Dashboard
                        </Link>
                      )}
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
                  {t.login}
                </button>
                <button
                  onClick={() => setShowRegisterPopup(true)}
                  className="register-btn"
                >
                  {t.register}
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
