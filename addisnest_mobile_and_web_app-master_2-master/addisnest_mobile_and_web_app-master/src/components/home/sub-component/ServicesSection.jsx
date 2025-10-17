import React from 'react';
import { Link } from 'react-router-dom';
import { EthionestIcon1, EthionestIcon2, EthionestIcon3 } from '../../../assets/images';

const ServicesSection = () => {
  const services = [
    {
      id: 1,
      icon: EthionestIcon1,
      title: 'Buy',
      description: 'Find the perfect property to call home. Browse listings tailored to your needs and budget.',
      link: '/property-list',
      color: '#1a73e8',
      buttonText: 'Find an agent'
    },
    {
      id: 2,
      icon: EthionestIcon2,
      title: 'Sell',
      description: 'List your property effortlessly and reach serious buyers with maximum visibility.',
      link: '/sell',
      color: '#34a853',
      buttonText: 'Learn more'
    },
    {
      id: 3,
      icon: EthionestIcon3,
      title: 'Rent',
      description: 'Discover rental options that fit your lifestyle, whether for the short or long term.',
      link: '/rent',
      color: '#ea4335',
      buttonText: 'Explore rentals'
    }
  ];

  return (
    <section className="services-section py-4 bg-light">
      <div className="container py-3">
        <div className="row mb-4">
          <div className="col-lg-8 col-md-10 mx-auto text-center">
            <h2 
              className="section-title"
              style={{
                fontSize: '2.2rem',
                fontWeight: '700',
                marginBottom: '1rem',
                color: '#333'
              }}
            >
              Our Services
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
              We provide comprehensive real estate services to make your property
              journey smooth and successful, whether you're buying, selling, or renting.
            </p>
          </div>
        </div>

        <div 
          className="services-container"
          style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            justifyContent: 'center', 
            gap: '1rem'
          }}
        >
          {services.map((service) => (
            <div 
              key={service.id} 
              className="service-card-wrapper mb-3"
              style={{ flex: '0 1 calc(33.333% - 1rem)', minWidth: '250px', maxWidth: '320px' }}
            >
              <div 
                className="service-card h-100 d-flex flex-column justify-content-between align-items-center"
                style={{
                  background: 'white',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                  border: '1px solid #e0e0e0',
                  height: '100%',
                  textAlign: 'center',
                  padding: '25px 15px', 
                  width: '100%' 
                }}
              >
                <div className="text-center mb-2">
                  <img 
                    src={service.icon} 
                    alt={service.title} 
                    style={{
                      height: '50px',
                      width: 'auto',
                      marginBottom: '15px'
                    }}
                  />
                  <h3 
                    style={{
                      fontSize: '1.3rem',
                      fontWeight: '700', 
                      marginBottom: '8px', 
                      color: '#333'
                    }}
                  >
                    {service.title === 'Buy' ? (
                      <Link 
                        to="/property-list" 
                        style={{ 
                          textDecoration: 'none', 
                          color: '#333',
                          transition: 'color 0.2s ease'
                        }}
                        onClick={() => {
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                          if (window.location.pathname === '/property-list') {
                            window.location.reload();
                          }
                        }}
                        onMouseOver={(e) => {
                          e.target.style.color = '#0066cc';
                        }}
                        onMouseOut={(e) => {
                          e.target.style.color = '#333';
                        }}
                      >
                        {service.title}
                      </Link>
                    ) : (
                      service.title
                    )}
                  </h3>
                </div>
                
                <p 
                  style={{
                    fontSize: '0.85rem', 
                    color: '#555555',
                    marginBottom: '20px',
                    lineHeight: '1.5'
                  }}
                >
                  {service.description}
                </p>
                
                <div>
                  <Link 
                    to={service.link}
                    className="btn btn-outline-dark px-3 py-1"
                    style={{
                      fontWeight: '500',
                      fontSize: '0.85rem',
                      textDecoration: 'none',
                      position: 'relative',
                      minWidth: '130px', 
                      borderRadius: '6px' 
                    }}
                  >
                    {service.buttonText}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
