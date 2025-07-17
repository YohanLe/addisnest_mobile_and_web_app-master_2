import React from 'react';
import PropertyImageWithFallback from '../components/common/PropertyImageWithFallback';

/**
 * Example component that demonstrates the use of PropertyImageWithFallback
 * This shows various ways to use the component with different image path formats
 */
const PropertyImageWithFallbackExample = () => {
  // Sample image paths in different formats
  const imagePaths = {
    // Simple filename (will be transformed to use correct server URL and path structure)
    simple: 'genMid.731631728_14_0-1749359999235-908500567.jpg',
    
    // Partial path with /properties/ prefix
    withProperties: '/properties/genMid.731631728_9_0-1749364073870-909428905.jpg',
    
    // Path with /uploads/ prefix
    withUploads: '/uploads/genMid.731631728_22_0-1749364077288-28071155.jpg',
    
    // Complete path with /uploads/properties/ prefix
    complete: '/uploads/properties/731631728_0-1749366751554-424580686.jpg',
    
    // Full URL (used as-is)
    fullUrl: 'http://localhost:7000/uploads/properties/731631728_18_0-1749362285097-248555303.jpg',
    
    // Invalid path (will show fallback)
    invalid: '/invalid/path/image.jpg'
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>PropertyImageWithFallback Examples</h1>
      <p>This component automatically handles various image path formats and displays a fallback when images fail to load.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
        {Object.entries(imagePaths).map(([type, path]) => (
          <div key={type} style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', padding: '15px' }}>
            <h3>{type.charAt(0).toUpperCase() + type.slice(1)} Path</h3>
            <p style={{ fontSize: '12px', color: '#666', wordBreak: 'break-all' }}>{path}</p>
            
            <div style={{ height: '200px', position: 'relative', marginTop: '10px' }}>
              <PropertyImageWithFallback
                src={path}
                alt={`${type} example`}
                width={280}
                height={200}
                style={{ 
                  border: '1px solid #eee',
                  borderRadius: '4px'
                }}
              />
            </div>
          </div>
        ))}
      </div>
      
      <div style={{ marginTop: '40px', background: '#f7f7f7', padding: '20px', borderRadius: '8px' }}>
        <h2>Usage in Code</h2>
        <pre style={{ background: '#f0f0f0', padding: '15px', borderRadius: '4px', overflow: 'auto' }}>
{`import PropertyImageWithFallback from '../components/common/PropertyImageWithFallback';

// Basic usage
<PropertyImageWithFallback 
  src="path/to/image.jpg"
  alt="Property image" 
/>

// With custom dimensions and style
<PropertyImageWithFallback 
  src="/uploads/properties/image.jpg"
  alt="Property image"
  width={300}
  height={200}
  style={{ 
    borderRadius: '8px',
    border: '2px solid #eee'
  }}
/>

// The component will automatically:
// 1. Add the correct server URL prefix (http://localhost:7000)
// 2. Format the path correctly (/uploads/properties/...)
// 3. Display a fallback image if loading fails
`}
        </pre>
      </div>
    </div>
  );
};

export default PropertyImageWithFallbackExample;
