import React, { useState, useEffect } from 'react';
import ImageWithFallback from '../components/common/ImageWithFallback';

/**
 * Example component showing how to use ImageWithFallback
 * This example also includes image URL debugging to help troubleshoot connection issues
 */
const ImageWithFallbackExample = () => {
  const [debugInfo, setDebugInfo] = useState([]);
  const [testUrls, setTestUrls] = useState([
    '/uploads/properties/test-property-image-1749358117061-8113970.jpg',
    '/uploads/test-property-image-1749358117061-8113970.jpg',
    'genMid.731631728_14_0-1749364508350-544736909.jpg',
    '/uploads/properties/genMid.731631728_14_0-1749364508350-544736909.jpg'
  ]);
  const [customUrl, setCustomUrl] = useState('');

  const testImageConnection = async (url) => {
    // Format the URL properly if it's a relative path
    let fullUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      // For uploads, use port 7000
      if (url.includes('/uploads/')) {
        fullUrl = `http://localhost:7000${url.startsWith('/') ? url : `/${url}`}`;
      } else {
        // For other static assets, use the current origin
        fullUrl = `${window.location.origin}${url.startsWith('/') ? url : `/${url}`}`;
      }
    }

    try {
      const startTime = performance.now();
      const response = await fetch(fullUrl, { method: 'HEAD' });
      const endTime = performance.now();
      const responseTime = (endTime - startTime).toFixed(2);

      setDebugInfo(prev => [...prev, {
        url: fullUrl,
        status: response.status,
        ok: response.ok,
        statusText: response.statusText,
        time: responseTime,
        timestamp: new Date().toLocaleTimeString()
      }]);
    } catch (error) {
      setDebugInfo(prev => [...prev, {
        url: fullUrl,
        error: error.message,
        timestamp: new Date().toLocaleTimeString()
      }]);
    }
  };

  const handleTestAll = () => {
    setDebugInfo([]);
    testUrls.forEach(url => {
      testImageConnection(url);
    });
  };

  const addCustomUrl = () => {
    if (customUrl.trim()) {
      setTestUrls(prev => [...prev, customUrl.trim()]);
      setCustomUrl('');
    }
  };

  return (
    <div className="image-debug-container" style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h2>Image Loading Debug Tool</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Test Custom Image URL</h3>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <input 
            type="text" 
            value={customUrl} 
            onChange={(e) => setCustomUrl(e.target.value)} 
            placeholder="Enter image URL or path"
            style={{ flex: 1, padding: '8px' }}
          />
          <button 
            onClick={addCustomUrl}
            style={{ padding: '8px 16px', backgroundColor: '#4a6cf7', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            Add URL
          </button>
        </div>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Test URLs</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {testUrls.map((url, index) => (
            <li key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
              <span style={{ flex: 1, wordBreak: 'break-all' }}>{url}</span>
              <button 
                onClick={() => testImageConnection(url)}
                style={{ 
                  marginLeft: '10px', 
                  padding: '4px 10px', 
                  backgroundColor: '#8cc63f', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '4px' 
                }}
              >
                Test
              </button>
              <button 
                onClick={() => setTestUrls(prev => prev.filter((_, i) => i !== index))}
                style={{ 
                  marginLeft: '5px', 
                  padding: '4px 10px', 
                  backgroundColor: '#f44336', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '4px' 
                }}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
        <button 
          onClick={handleTestAll}
          style={{ 
            padding: '8px 16px', 
            backgroundColor: '#4a6cf7', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            marginTop: '10px'
          }}
        >
          Test All URLs
        </button>
      </div>
      
      <div style={{ marginBottom: '30px' }}>
        <h3>Debug Results</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>URL</th>
              <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Status</th>
              <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Response Time</th>
              <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {debugInfo.map((info, index) => (
              <tr key={index} style={{ backgroundColor: info.ok ? '#e6f7e6' : '#ffebee' }}>
                <td style={{ border: '1px solid #ddd', padding: '8px', wordBreak: 'break-all' }}>{info.url}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  {info.error ? 
                    <span style={{ color: 'red' }}>Error: {info.error}</span> : 
                    <span>{info.status} {info.statusText}</span>
                  }
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{info.time ? `${info.time} ms` : 'N/A'}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{info.timestamp}</td>
              </tr>
            ))}
            {debugInfo.length === 0 && (
              <tr>
                <td colSpan="4" style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                  No tests run yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div>
        <h3>Image Rendering Test</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
          {testUrls.map((url, index) => (
            <div key={index} style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', position: 'relative' }}>
              <div style={{ padding: '10px', backgroundColor: '#f5f5f5', fontWeight: 'bold', fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {url}
              </div>
              <div style={{ height: '150px', position: 'relative' }}>
                <ImageWithFallback 
                  src={url}
                  fallbackSrc="/placeholder-property.jpg"
                  alt={`Test image ${index + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageWithFallbackExample;
