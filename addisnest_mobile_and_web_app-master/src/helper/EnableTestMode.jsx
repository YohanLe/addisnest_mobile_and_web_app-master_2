import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../Redux-store/Slices/AuthSlice';

const EnableTestMode = () => {
  const [enabled, setEnabled] = useState(false);
  const dispatch = useDispatch();

  const enableTestMode = () => {
    // Set test token in localStorage
    localStorage.setItem('addisnest_token', 'test-token-123456');
    localStorage.setItem('isLogin', 'true');
    localStorage.setItem('userId', 'test-user-id');
    
    // Dispatch login action with mock user data
    dispatch(login({
      _id: 'test-user-id',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      isVerified: true,
      userType: 'customer'
    }));
    
    setEnabled(true);
    
    // Reload the page to reflect changes
    window.location.reload();
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 9999,
      background: '#f0f0f0',
      padding: '15px',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>Test Mode</h3>
      <button 
        onClick={enableTestMode}
        disabled={enabled}
        style={{
          background: enabled ? '#cccccc' : '#a4ff2a',
          border: 'none',
          padding: '8px 15px',
          borderRadius: '4px',
          cursor: enabled ? 'default' : 'pointer',
          fontWeight: 'bold',
          color: '#333'
        }}
      >
        {enabled ? 'Test Mode Enabled' : 'Enable Test Mode'}
      </button>
    </div>
  );
};

export default EnableTestMode;
