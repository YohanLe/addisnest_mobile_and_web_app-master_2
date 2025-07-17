import React from 'react';

const WhyChooseUs = () => {
  const benefits = [
    {
      id: 1,
      icon: '🔍',
      title: 'Verified Listings',
      description: 'All properties are verified by our team to ensure accuracy and reliability.'
    },
    {
      id: 2,
      icon: '🏆',
      title: 'Expert Agents',
      description: 'Connect with qualified real estate professionals who know the Ethiopian market.'
    },
    {
      id: 3,
      icon: '💼',
      title: 'Complete Transparency',
      description: 'Clear pricing and detailed property information with no hidden fees or surprises.'
    }
  ];

  return (
    <section className="why-choose-us-section py-4">
      <div className="container py-3">
        <div className="row">
          <div className="col-12">
            <div className="content-wrapper text-center mb-4">
              <h2 
                className="section-title"
                style={{
                  fontSize: '2.2rem',
                  fontWeight: '700',
                  marginBottom: '1rem',
                  color: '#333'
                }}
              >
                Why Choose Us
              </h2>
              <p 
                className="section-subtitle mb-3"
                style={{
                  fontSize: '1rem',
                  color: '#666',
                  lineHeight: '1.6',
                  maxWidth: '800px',
                  margin: '0 auto'
                }}
              >
                We are Ethiopia's trusted real estate platform, dedicated to making property 
                transactions simple, transparent, and rewarding for everyone. We combine local 
                expertise with innovative technology to deliver an exceptional real estate experience.
              </p>
              <div 
                className="why-choose-us-cards-container mt-3" 
                style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  justifyContent: 'center', 
                  gap: '1rem' 
                }}
              >
                {benefits.map((benefit) => (
                  <div 
                    key={benefit.id} 
                    className="benefit-card-wrapper mb-3" 
                    style={{ flex: '0 1 calc(33.333% - 1rem)', minWidth: '250px', maxWidth: '320px' }}
                  >
                    <div 
                      className="benefit-card-styled h-100 d-flex flex-column justify-content-start align-items-center"
                      style={{
                        background: 'white',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                        border: '1px solid #e0e0e0',
                        textAlign: 'center',
                        padding: '25px 15px', 
                        width: '100%'
                      }}
                    >
                      <div 
                        className="benefit-icon-display"
                        style={{
                          fontSize: '2rem',
                          marginBottom: '15px'
                        }}
                      >
                        {benefit.icon}
                      </div>
                      <h3 
                        style={{
                          fontSize: '1.3rem', 
                          fontWeight: '700', 
                          marginBottom: '8px', 
                          color: '#333'
                        }}
                      >
                        {benefit.title}
                      </h3>
                      <p 
                        style={{
                          fontSize: '0.85rem', 
                          color: '#555555', 
                          lineHeight: '1.5',
                          marginBottom: '0' 
                        }}
                      >
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
