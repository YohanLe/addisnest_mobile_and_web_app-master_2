import React from 'react';
import ReactDOM from 'react-dom/client';

function TestApp() {
  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '800px', 
      margin: '40px auto',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h1 style={{ color: '#4a6cf7' }}>React Test App</h1>
      <p>This is a simple React component to test if React is working properly.</p>
      <p>If you can see this content styled with a blue heading and in a white box with shadow, then React is functioning correctly.</p>
    </div>
  );
}

// Create root element and render the test app
const root = document.createElement('div');
root.id = 'test-root';
document.body.appendChild(root);

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <TestApp />
  </React.StrictMode>
);
