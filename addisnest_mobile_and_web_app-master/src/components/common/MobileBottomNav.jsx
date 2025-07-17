import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../../utils/tokenHandler';

const MobileBottomNav = ({ buyRentMode, setBuyRentMode, setShowLoginPopup, setShowMortgageCalculator }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="mobile-bottom-nav">
      <div 
        className={`mobile-nav-item ${isActive('/property-list')}`}
        onClick={() => {
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
        <div className="mobile-nav-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            <path d="M12 2.1L1 12h3v9h7v-6h2v6h7v-9h3L12 2.1zm0 2.691l6 5.4V19h-3v-6H9v6H6v-8.809l6-5.4z" />
          </svg>
        </div>
        <span>{buyRentMode === 'buy' ? 'Buy' : 'Rent'}</span>
      </div>

      <div 
        className={`mobile-nav-item ${isActive('/sell')}`}
        onClick={() => {
          if (!isAuthenticated()) {
            setShowLoginPopup(true);
          } else {
            navigate('/property-list-form');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
      >
        <div className="mobile-nav-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-1-5h2v2h-2v-2zm2-1.645V14h-2v-1.5a1 1 0 0 1 1-1 1.5 1.5 0 1 0-1.471-1.794l-1.962-.393A3.5 3.5 0 1 1 13 13.355z" />
          </svg>
        </div>
        <span>Sell</span>
      </div>

      <div 
        className={`mobile-nav-item ${isActive('/mortgage-calculator')}`}
        onClick={() => setShowMortgageCalculator(true)}
      >
        <div className="mobile-nav-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            <path d="M3 3h18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm17 8H4v8h16v-8zm0-2V5H4v4h16zm-5 4h4v3h-4v-3z" />
          </svg>
        </div>
        <span>Calculator</span>
      </div>

      <Link
        to="/find-agent"
        className={`mobile-nav-item ${isActive('/find-agent')}`}
      >
        <div className="mobile-nav-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            <path d="M12 14v2a6 6 0 0 0-6 6H4a8 8 0 0 1 8-8zm0-1c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6zm0-2c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm9 6h1v5h-8v-5h1v-1a3 3 0 0 1 6 0v1zm-2 0v-1a1 1 0 0 0-2 0v1h2z" />
          </svg>
        </div>
        <span>Find Agent</span>
      </Link>

      {isAuthenticated() && (
        <div 
          className={`mobile-nav-item ${isActive('/account-management')}`}
          onClick={() => {
            navigate('/account-management', { state: { activeTab: 'messages' } });
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <div className="mobile-nav-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
              <path d="M3 3h18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm17 4.238l-7.928 7.1L4 7.216V19h16V7.238zM4.511 5l7.55 6.662L19.502 5H4.511z" />
            </svg>
          </div>
          <span>Messages</span>
        </div>
      )}
    </nav>
  );
};

export default MobileBottomNav;
