import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { GetPropertyList } from '../../../Redux-store/Slices/PropertyListSlice';

const ConfirmationPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // On component mount, make sure property list is refreshed
  useEffect(() => {
    console.log("ConfirmationPage mounted - fetching property list");
    
    // Log debug info
    const debugFlow = localStorage.getItem('debugRedirectFlow') || 'Not tracked';
    const propertyId = localStorage.getItem('savedPropertyId') || 'Not available';
    const timestamp = localStorage.getItem('redirectTimestamp') || 'Not recorded';
    
    console.log("Debug info:", { debugFlow, propertyId, timestamp });
    
    // Fetch updated property list
    dispatch(GetPropertyList({ limit: 100, page: 1 }))
      .then(result => {
        console.log("Property list fetched successfully in confirmation page:", result);
      })
      .catch(err => {
        console.error("Error fetching property list in confirmation page:", err);
      });
      
    // Cleanup debug info after a while
    const timer = setTimeout(() => {
      localStorage.removeItem('debugRedirectFlow');
      localStorage.removeItem('savedPropertyId');
      localStorage.removeItem('redirectTimestamp');
    }, 60000); // Clean up after 1 minute
    
    return () => clearTimeout(timer);
  }, [dispatch]);
  
  const goToMyProperties = () => {
    // Add property list refresh before navigation
    dispatch(GetPropertyList({ limit: 100, page: 1 }))
      .then(() => {
        console.log("Navigating to my-property-listings after refresh");
        window.location.href = '/my-property-listings';
      })
      .catch(() => {
        // Navigate even if refresh fails
        window.location.href = '/my-property-listings';
      });
  };
  
  return (
    <div className="payment-container" style={{
      maxWidth: '800px',
      margin: '40px auto',
      padding: '30px',
      backgroundColor: '#fff',
      borderRadius: '12px',
      boxShadow: '0 5px 20px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Payment Confirmation</h2>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <div style={{ backgroundColor: '#edfcf3', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
          <div style={{ fontSize: '48px', color: '#25c16f', marginBottom: '10px' }}>✓</div>
          <h3 style={{ color: '#25c16f', marginBottom: '10px' }}>Success!</h3>
          <p>Your property has been listed successfully!</p>
        </div>
        
        {/* Debug information - will be visible only during testing */}
        <div style={{ 
          margin: '10px 0', 
          padding: '10px', 
          border: '1px solid #ddd', 
          borderRadius: '4px',
          backgroundColor: '#f9f9f9',
          fontSize: '12px',
          textAlign: 'left'
        }}>
          <h4 style={{ margin: '0 0 8px 0' }}>Debug Information</h4>
          <p><strong>Redirect Flow:</strong> {localStorage.getItem('debugRedirectFlow') || 'Not tracked'}</p>
          <p><strong>Property ID:</strong> {localStorage.getItem('savedPropertyId') || 'Not available'}</p>
          <p><strong>Timestamp:</strong> {localStorage.getItem('redirectTimestamp') || 'Not recorded'}</p>
          <p><strong>Current URL:</strong> {window.location.href}</p>
        </div>
        
        <p style={{ color: '#666', marginTop: '10px' }}>You can now view and manage your property in your listings.</p>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button 
          onClick={goToMyProperties}
          style={{
            padding: '12px 30px',
            backgroundColor: '#4a6cf7',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            textDecoration: 'none',
            fontWeight: '500',
            marginRight: '10px',
            cursor: 'pointer'
          }}
        >
          View My Properties
        </button>
        
        <a href="/" style={{
          padding: '12px 30px',
          backgroundColor: 'transparent',
          color: '#4a6cf7',
          border: '1px solid #4a6cf7',
          borderRadius: '6px',
          textDecoration: 'none',
          fontWeight: '500'
        }}>
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default ConfirmationPage;
