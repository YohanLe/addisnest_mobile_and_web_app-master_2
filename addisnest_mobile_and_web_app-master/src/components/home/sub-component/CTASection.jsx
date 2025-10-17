import React from 'react';
import { Link } from 'react-router-dom';
import { EthisnestBg } from '../../../assets/images';

const CTASection = () => {
  return (
    <section 
      className="cta-section py-5"
      style={{
        background: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${EthisnestBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        color: 'white',
        position: 'relative'
      }}
    >
      <div className="container py-5">
        <div className="row">
          <div className="col-lg-8 col-md-10 mx-auto text-center">
            <h2 
              className="section-title"
              style={{
                fontSize: '2.75rem',
                fontWeight: '700',
                marginBottom: '1.5rem',
                color: 'white'
              }}
            >
              Join Our Professional Network
            </h2>
            <p 
              className="section-subtitle mb-5"
              style={{
                fontSize: '1.2rem',
                color: 'rgba(255, 255, 255, 0.9)',
                maxWidth: '800px',
                margin: '0 auto 2.5rem'
              }}
            >
              Connect with industry professionals and explore new opportunities in real estate.
            </p>
            
            <div className="cta-buttons">
              <Link 
                to="/find-agent" 
                className="btn-primary mr-3"
                style={{
                  display: 'inline-block',
                  padding: '14px 32px',
                  background: '#0066cc',
                  color: 'white',
                  borderRadius: '30px',
                  fontWeight: '600',
                  textDecoration: 'none',
                  marginRight: '15px',
                  boxShadow: '0 10px 20px rgba(0, 102, 204, 0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = '#0052a3';
                  e.target.style.transform = 'translateY(-3px)';
                  e.target.style.boxShadow = '0 15px 25px rgba(0, 102, 204, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = '#0066cc';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 10px 20px rgba(0, 102, 204, 0.3)';
                }}
              >
                Partner With Us
              </Link>
            </div>
          </div>
        </div>
        
        <div className="row mt-5 pt-4">
          <div className="col-md-4 mb-4 mb-md-0">
            <div 
              className="feature-box text-center"
              style={{
                padding: '30px 20px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                height: '100%',
                transition: 'transform 0.3s ease, background 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              <div 
                className="feature-icon mb-3"
                style={{
                  fontSize: '2.5rem',
                  marginBottom: '15px'
                }}
              >
                🏠
              </div>
              <h3 
                style={{
                  fontSize: '1.4rem',
                  fontWeight: '600',
                  marginBottom: '10px'
                }}
              >
                Expand Your Reach
              </h3>
              <p
                style={{
                  fontSize: '1rem',
                  color: 'rgba(255, 255, 255, 0.8)',
                  marginBottom: 0
                }}
              >
                Connect with serious buyers and sellers
              </p>
            </div>
          </div>
          
          <div className="col-md-4 mb-4 mb-md-0">
            <div 
              className="feature-box text-center"
              style={{
                padding: '30px 20px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                height: '100%',
                transition: 'transform 0.3s ease, background 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              <div 
                className="feature-icon mb-3"
                style={{
                  fontSize: '2.5rem',
                  marginBottom: '15px'
                }}
              >
                👨‍💼
              </div>
              <h3 
                style={{
                  fontSize: '1.4rem',
                  fontWeight: '600',
                  marginBottom: '10px'
                }}
              >
                Showcase Listings
              </h3>
              <p
                style={{
                  fontSize: '1rem',
                  color: 'rgba(255, 255, 255, 0.8)',
                  marginBottom: 0
                }}
              >
                Stand out with optimized property listings
              </p>
            </div>
          </div>
          
          <div className="col-md-4">
            <div 
              className="feature-box text-center"
              style={{
                padding: '30px 20px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                height: '100%',
                transition: 'transform 0.3s ease, background 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              <div 
                className="feature-icon mb-3"
                style={{
                  fontSize: '2.5rem',
                  marginBottom: '15px'
                }}
              >
                🔒
              </div>
              <h3 
                style={{
                  fontSize: '1.4rem',
                  fontWeight: '600',
                  marginBottom: '10px'
                }}
              >
                Supportive Platform
              </h3>
              <p
                style={{
                  fontSize: '1rem',
                  color: 'rgba(255, 255, 255, 0.8)',
                  marginBottom: 0
                }}
              >
                Tools and resources to help you succeed
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
