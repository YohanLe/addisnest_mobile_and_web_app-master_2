import React, { useState, useEffect } from 'react';
import '../../../assets/css/about-place.css';

const AboutThisHome = ({ propertyDetails }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [daysOnMarket, setDaysOnMarket] = useState(0);
  
  // Default description if none provided
  const description = propertyDetails?.description || 'No description available for this property.';
  
  // Calculate days on Addisnest
  useEffect(() => {
    if (propertyDetails?.createdAt) {
      const createdDate = new Date(propertyDetails.createdAt);
      const currentDate = new Date();
      const diffTime = Math.abs(currentDate - createdDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      setDaysOnMarket(diffDays);
    }
  }, [propertyDetails]);

  // Format price with commas
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US').format(price);
  };
  
  // Calculate price per square meter if not provided directly
  const getPricePerSqm = () => {
    if (propertyDetails?.price_per_sqm) {
      return formatPrice(propertyDetails.price_per_sqm);
    } else if (propertyDetails?.price && propertyDetails?.property_size && propertyDetails.property_size > 0) {
      return formatPrice(Math.round(propertyDetails.price / propertyDetails.property_size));
    } else {
      return 'Not available';
    }
  };
  
  // Handle toggle description
  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  return (
    <div className="about-this-home">
      <h2 className="section-title">About This Home</h2>
      
      {/* Property Description with Animation */}
      <div className="description-container">
        <div 
          className={`property-description ${showFullDescription ? 'expanded' : 'collapsed'}`}
          style={{ 
            maxHeight: showFullDescription ? '1000px' : '100px',
            transition: 'max-height 0.5s ease-in-out',
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          <p>{description}</p>
          
          {/* Gradient fade effect for collapsed state */}
          {!showFullDescription && (
            <div 
              className="fade-overlay"
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: '50px',
                background: 'linear-gradient(to bottom, transparent, white)',
                pointerEvents: 'none'
              }}
            />
          )}
        </div>
        
        <button 
          className="toggle-description-btn" 
          onClick={toggleDescription}
          aria-expanded={showFullDescription}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '8px 16px',
            marginTop: '8px',
            background: 'transparent',
            border: '1px solid #e0e0e0',
            borderRadius: '20px',
            color: '#4a6cf7',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontWeight: '500',
            fontSize: '14px'
          }}
        >
          {showFullDescription ? 'Show Less' : 'Show More'} 
          <span style={{ 
            marginLeft: '5px', 
            transform: showFullDescription ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease'
          }}>↓</span>
        </button>
      </div>
      
      {/* Property Features Grid */}
      <div 
        className="property-features-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '20px',
          marginTop: '30px'
        }}
      >
        {/* Property Type */}
        <div className="feature-card">
          <div className="feature-header">
            <div className="feature-icon" aria-hidden="true">🏠</div>
            <div className="feature-label">Property Type</div>
          </div>
          <div className="feature-value">
            {propertyDetails?.property_type?.label || propertyDetails?.propertyType || 'Not specified'}
          </div>
        </div>
        
        {/* Bedrooms */}
        <div className="feature-card">
          <div className="feature-header">
            <div className="feature-icon" aria-hidden="true">🛏️</div>
            <div className="feature-label">Bedrooms</div>
          </div>
          <div className="feature-value">
            {propertyDetails?.specifications?.bedrooms || propertyDetails?.beds || 0}
          </div>
        </div>
        
        {/* Bathrooms */}
        <div className="feature-card">
          <div className="feature-header">
            <div className="feature-icon" aria-hidden="true">🚿</div>
            <div className="feature-label">Bathrooms</div>
          </div>
          <div className="feature-value">
            {propertyDetails?.specifications?.bathrooms || propertyDetails?.bathroom_information?.length || 0}
          </div>
        </div>
        
        {/* Living Area */}
        <div className="feature-card">
          <div className="feature-header">
            <div className="feature-icon" aria-hidden="true">📏</div>
            <div className="feature-label">Living Area</div>
          </div>
          <div className="feature-value">
            {propertyDetails?.specifications?.area?.size || propertyDetails?.property_size || 0} sqm
          </div>
        </div>
        
        {/* Lot Size */}
        <div className="feature-card">
          <div className="feature-header">
            <div className="feature-icon" aria-hidden="true">🌄</div>
            <div className="feature-label">Lot Size</div>
          </div>
          <div className="feature-value">
            {propertyDetails?.specifications?.lotSize?.size || propertyDetails?.lot_size || 0} sqm
          </div>
        </div>
        
        {/* Year Built */}
        <div className="feature-card">
          <div className="feature-header">
            <div className="feature-icon" aria-hidden="true">🏗️</div>
            <div className="feature-label">Year Built</div>
          </div>
          <div className="feature-value">
            {propertyDetails?.specifications?.yearBuilt || propertyDetails?.year_built || 'Not specified'}
          </div>
        </div>
        
        {/* Days on Addisnest */}
        <div className="feature-card">
          <div className="feature-header">
            <div className="feature-icon" aria-hidden="true">📅</div>
            <div className="feature-label">Days on Addisnest</div>
          </div>
          <div className="feature-value">
            {daysOnMarket} days
          </div>
        </div>
        
        {/* Price per SQ.M */}
        <div className="feature-card">
          <div className="feature-header">
            <div className="feature-icon" aria-hidden="true">💰</div>
            <div className="feature-label">Price per SQ.M</div>
          </div>
          <div className="feature-value">
            ETB {getPricePerSqm()}
          </div>
        </div>
        
        {/* Parking */}
        <div className="feature-card">
          <div className="feature-header">
            <div className="feature-icon" aria-hidden="true">🚗</div>
            <div className="feature-label">Parking</div>
          </div>
          <div className="feature-value">
            {propertyDetails?.specifications?.parking > 0 || propertyDetails?.has_parking ? 'Available' : 'Not available'}
          </div>
        </div>
        
        {/* Heating & AC */}
        <div className="feature-card">
          <div className="feature-header">
            <div className="feature-icon" aria-hidden="true">🌡️</div>
            <div className="feature-label">Heating & AC</div>
          </div>
          <div className="feature-value">
            {propertyDetails?.features?.amenities?.includes('air-conditioning') || propertyDetails?.has_heating ? 'Available' : 'Not available'}
          </div>
        </div>
      </div>

      <style jsx>{`
        .about-this-home {
          padding: 24px;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          margin-bottom: 30px;
        }
        
        .section-title {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 20px;
          color: #333;
        }
        
        .property-description p {
          line-height: 1.6;
          color: #555;
          margin-bottom: 0;
        }
        
        .feature-card {
          background-color: #f9f9f9;
          border-radius: 8px;
          padding: 16px;
          transition: all 0.2s ease;
        }
        
        .feature-card:hover {
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }
        
        .feature-header {
          display: flex;
          align-items: center;
          margin-bottom: 8px;
        }
        
        .feature-icon {
          font-size: 18px;
          margin-right: 8px;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .feature-label {
          font-size: 14px;
          color: #666;
          font-weight: 500;
        }
        
        .feature-value {
          font-size: 16px;
          font-weight: 600;
          color: #333;
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .property-features-grid {
            grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          }
        }
        
        @media (max-width: 480px) {
          .property-features-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default AboutThisHome;
