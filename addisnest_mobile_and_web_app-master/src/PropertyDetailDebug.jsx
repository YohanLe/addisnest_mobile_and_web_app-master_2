import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Api from './Apis/Api';

/**
 * Debug component for property detail display issues
 * This component bypasses Redux and directly fetches the property data
 */
function PropertyDetailDebug() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('PropertyDetailDebug mounted with ID:', id);
    
    // Direct API call without Redux
    const fetchProperty = async () => {
      try {
        setLoading(true);
        console.log('Fetching property with ID:', id);
        
        const response = await Api.get(`/properties/${id}`);
        console.log('API Response:', response);
        
        if (response.data && response.data.success) {
          setProperty(response.data.data);
          console.log('Property data:', response.data.data);
        } else {
          setError('API returned unsuccessful response');
          console.error('API returned unsuccessful response');
        }
      } catch (error) {
        setError(error.message || 'Error fetching property');
        console.error('Error fetching property:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProperty();
  }, [id]);

  // Show loading state
  if (loading) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <h2>Loading property data...</h2>
        <p>Property ID: {id}</p>
      </div>
    );
  }

  // Show error state
  if (error || !property) {
    return (
      <div style={{ padding: '50px', textAlign: 'center', color: 'red' }}>
        <h2>Error Loading Property</h2>
        <p>{error || 'Property not found'}</p>
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f8f8', textAlign: 'left' }}>
          <h3>Debug Information:</h3>
          <p>Property ID: {id}</p>
          <p>URL: {window.location.href}</p>
        </div>
      </div>
    );
  }

  // Show property data as raw JSON for debugging
  return (
    <div style={{ padding: '30px' }}>
      <h1>Property Detail Debug View</h1>
      <p>ID: {id}</p>
      
      <div style={{ marginTop: '20px' }}>
        <h2>Basic Info:</h2>
        <ul>
          <li><strong>Title:</strong> {property.title}</li>
          <li><strong>Property Type:</strong> {property.property_type || property.propertyType}</li>
          <li><strong>For:</strong> {property.property_for || property.offeringType}</li>
          <li><strong>Price:</strong> {property.total_price || property.price}</li>
          <li><strong>Bedrooms:</strong> {property.number_of_bedrooms || property.bedrooms}</li>
          <li><strong>Bathrooms:</strong> {property.number_of_bathrooms || property.bathrooms}</li>
          <li><strong>Size:</strong> {property.property_size || property.area} sqm</li>
          <li><strong>Furnishing:</strong> {property.furnishing || 'Not specified'}</li>
        </ul>
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <h2>Address:</h2>
        <p>{property.property_address || 
            (property.address ? 
              `${property.address.street || ''}, ${property.address.city || ''}, ${property.address.state || ''}` : 
              `${property.street || ''}, ${property.city || ''}, ${property.state || ''}`)}</p>
        <ul>
          <li><strong>City:</strong> {property.city}</li>
          <li><strong>State:</strong> {property.regional_state || property.state}</li>
          <li><strong>Country:</strong> {property.country}</li>
        </ul>
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <h2>Media:</h2>
        <p>Media Paths Count: {Array.isArray(property.media_paths) ? property.media_paths.length : 'Not an array'}</p>
        <p>Images Count: {Array.isArray(property.images) ? property.images.length : 'Not an array'}</p>
        
        {Array.isArray(property.media_paths) && property.media_paths.length > 0 && (
          <div>
            <h3>Media Paths:</h3>
            <ul>
              {property.media_paths.map((path, index) => (
                <li key={`media-${index}`}>{path}</li>
              ))}
            </ul>
          </div>
        )}
        
        {Array.isArray(property.images) && property.images.length > 0 && (
          <div>
            <h3>Images:</h3>
            <ul>
              {property.images.map((img, index) => (
                <li key={`img-${index}`}>{typeof img === 'string' ? img : img.url}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      <div style={{ marginTop: '30px', backgroundColor: '#f5f5f5', padding: '15px', borderRadius: '5px' }}>
        <h2>Raw Property Data:</h2>
        <pre style={{ overflow: 'auto', maxHeight: '500px' }}>
          {JSON.stringify(property, null, 2)}
        </pre>
      </div>
    </div>
  );
}

export default PropertyDetailDebug;
