import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('EditPropertyForm Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback" style={{
          padding: '20px',
          margin: '30px auto',
          maxWidth: '600px',
          textAlign: 'center',
          backgroundColor: '#fff8f8',
          border: '1px solid #ffdddd',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#e74c3c', marginBottom: '15px' }}>
            Error Loading Property Form
          </h3>
          <p style={{ marginBottom: '20px', color: '#555' }}>
            We encountered a problem while loading the property form. 
            This could be due to missing data or a connection issue.
          </p>
          <div>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '8px 16px',
                backgroundColor: '#4a6cf7',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Try Again
            </button>
            <a 
              href="/my-property-listings"
              style={{
                display: 'inline-block',
                marginLeft: '10px',
                padding: '8px 16px',
                backgroundColor: '#f0f0f0',
                color: '#333',
                textDecoration: 'none',
                borderRadius: '4px'
              }}
            >
              Return to Listings
            </a>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
