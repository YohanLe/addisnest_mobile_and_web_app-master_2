import React from 'react';
import ReactDOM from 'react-dom/client';

function SimpleTest() {
  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '800px', 
      margin: '40px auto',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h1 style={{ color: '#4a6cf7' }}>Simple React Test</h1>
      <p>This is a simple React component with no dependencies.</p>
      <p>If you can see this, basic React rendering is working correctly.</p>
    </div>
  );
}

export default SimpleTest;
