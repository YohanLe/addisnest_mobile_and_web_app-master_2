import React from 'react';
import { Link } from 'react-router-dom';
import { Property1, Property2, Property3 } from '../../../assets/images';

const NeighborhoodGuide = () => {
  const neighborhoods = [
    {
      id: 1,
      name: 'CMC',
      image: Property3,
      description: 'Residential area with spacious homes, good schools, and family-friendly amenities.',
      properties: 192,
      averagePrice: 'ETB 7.5M'
    },
    {
      id: 2,
      name: 'Bole',
      image: Property1,
      description: 'Upscale area with international restaurants, shopping malls, and modern apartments.',
      properties: 278,
      averagePrice: 'ETB 6.2M'
    },
    {
      id: 3,
      name: 'Kazanchis',
      image: Property2,
      description: 'Business district with government offices, hotels, and commercial properties.',
      properties: 156,
      averagePrice: 'ETB 4.8M'
    }
  ];

  return (
    <section className="neighborhood-guide-section py-4">
      <div className="container py-3">
        <div className="text-center mb-4">
          <h2 
            className="section-title"
            style={{
              fontSize: '2.2rem',
              fontWeight: '700',
              marginBottom: '1rem',
              color: '#333'
            }}
          >
            Neighborhood Guide
          </h2>
          <p 
            className="section-subtitle"
            style={{
              fontSize: '1rem',
              color: '#666',
              maxWidth: '800px',
              margin: '0 auto'
            }}
          >
            Explore popular neighborhoods across Ethiopia and find the perfect 
            location for your next home or investment property.
          </p>
        </div>

        <div 
          className="neighborhood-cards-container"
          style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            justifyContent: 'center', 
            gap: '1rem' 
          }}
        >
          {neighborhoods.map(neighborhood => (
            <div 
              key={neighborhood.id} 
              className="neighborhood-card-wrapper mb-3"
              style={{ flex: '0 1 calc(33.333% - 1rem)', minWidth: '250px', maxWidth: '320px' }}
            >
              <div 
                className="neighborhood-card-styled h-100"
                style={{
                  background: 'white',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                  border: '1px solid #e0e0e0',
                  width: '100%'
                }}
              >
                <div className="position-relative">
                  <img 
                    src={neighborhood.image} 
                    alt={neighborhood.name}
                    className="w-100"
                    style={{ height: '180px', objectFit: 'cover', display: 'block' }}
                  />
                  <div 
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: 'none',
                      display: 'flex',
                      alignItems: 'flex-end',
                      padding: '15px'
                    }}
                  >
                    <h3 style={{ fontSize: '1.3rem', marginBottom: '0' }} className="text-dark">{neighborhood.name}</h3>
                  </div>
                </div>
                
                <div className="p-3">
                  <p style={{ fontSize: '0.85rem', lineHeight: '1.5' }} className="text-muted mb-3">{neighborhood.description}</p>
                  <div className="d-flex justify-content-between border-top pt-2 mb-3">
                    <div>
                      <span className="d-block text-muted small">Properties</span>
                      <strong style={{ fontSize: '0.9rem' }}>{neighborhood.properties}</strong>
                    </div>
                    <div className="text-end">
                      <span className="d-block text-muted small">Average Price</span>
                      <strong style={{ fontSize: '0.9rem' }}>{neighborhood.averagePrice}</strong>
                    </div>
                  </div>
                  <Link 
                    to={`/buy?location=${neighborhood.name}`}
                    className="btn btn-outline-primary w-100 py-1"
                    style={{ fontSize: '0.85rem' }}
                  >
                    View Properties
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-3">
          <Link 
            to="/neighborhoods" 
            className="btn btn-outline-primary px-3 py-1"
            style={{ fontSize: '0.85rem' }}
          >
            Explore All Neighborhoods
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="14" 
              height="14" 
              fill="currentColor" 
              className="bi bi-arrow-right ms-2" 
              viewBox="0 0 16 16"
            >
              <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NeighborhoodGuide;
