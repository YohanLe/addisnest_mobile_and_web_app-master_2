import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoginPopup from '../../helper/LoginPopup';
import './PropertySellListPage.css';

const PropertySellListPage = () => {
  const navigate = useNavigate();
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  
  const handleListPropertyClick = () => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLogin') === '1';
    
    if (isLoggedIn) {
      // If logged in, navigate to property listing form
      navigate('/property-list-form');
    } else {
      // If not logged in, show login popup
      setShowLoginPopup(true);
    }
  };
  
  const handleCloseLoginPopup = () => {
    setShowLoginPopup(false);
  };

  return (
    <>
      <div className="property-sell-list-page">
        <div className="container">
          <div className="page-header">
            <h1>Sell Your Property</h1>
            <p>List your property on Addisnest and reach thousands of potential buyers</p>
          </div>
          
          <div className="sell-info-section">
            <div className="sell-benefits">
              <h2>Why Choose AddisNest to Sell Your Home?</h2>
              <div className="benefits-list">
                <div className="benefit-item">
                  <div className="benefit-icon">🧭</div>
                  <h3>More Exposure</h3>
                  <p>Reach thousands of serious home seekers across Ethiopia.</p>
                </div>
                
                <div className="benefit-item">
                  <div className="benefit-icon">💰</div>
                  <h3>Better Pricing</h3>
                  <p>Get fair pricing support with our market-smart platform.</p>
                </div>
                
                <div className="benefit-item">
                  <div className="benefit-icon">⚡</div>
                  <h3>Faster Selling</h3>
                  <p>Homes listed on AddisNest sell up to 2x faster than average.</p>
                </div>
                
                <div className="benefit-item">
                  <div className="benefit-icon">🤝</div>
                  <h3>Expert Help</h3>
                  <p>Our team is here to assist you every step of the way.</p>
                </div>
              </div>
            </div>
            
            <div className="cta-section">
              <button 
                onClick={handleListPropertyClick}
                className="primary-btn">
                List Your Property Now
              </button>
            </div>
            
            <div className="how-it-works">
              <h2>How It Works</h2>
              <div className="steps-list">
                <div className="step">
                  <div className="step-number">1</div>
                  <h3>Create a Listing</h3>
                  <p>Fill in your property details and upload beautiful photos.</p>
                </div>
                <div className="step">
                  <div className="step-number">2</div>
                  <h3>Get Seen</h3>
                  <p>Your property becomes visible to thousands of buyers instantly.</p>
                </div>
                <div className="step">
                  <div className="step-number">3</div>
                  <h3>Connect with Buyers</h3>
                  <p>Chat with interested buyers through AddisNest.</p>
                </div>
                <div className="step">
                  <div className="step-number">4</div>
                  <h3>Close the Sale</h3>
                  <p>Finalize the deal directly with your chosen buyer.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="cta-section">
            <h2>Ready to Sell Your Property?</h2>
            <p className="subtext">It only takes a few minutes to create a listing</p>
            <button 
              onClick={handleListPropertyClick}
              className="primary-btn">
              List Your Property Now
            </button>
          </div>
        </div>
      </div>
      
      {/* Login Popup */}
      {showLoginPopup && (
        <LoginPopup 
          handlePopup={handleCloseLoginPopup} 
          redirectAfterLogin="/property-list-form"
        />
      )}
    </>
  );
};

export default PropertySellListPage;
