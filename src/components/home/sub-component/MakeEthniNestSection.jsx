import React from 'react';
import { EthisnestBg, EthisnestImage } from '../../../assets/images';
import { SvgMake1Icon, SvgMake2Icon, SvgMake3Icon } from '../../../assets/svg-files/SvgFiles';

const MakeEthniNestSection = () => {
  return (
    <section className="common-section make-ethni-nest-section">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <div className="make-ethni-content">
              <div className="top-heading">
                <h3>Make EthiNest your home</h3>
                <p>
                  Discover why thousands of Ethiopians choose EthiNest for their real estate needs.
                  Our platform provides a seamless experience for buying, selling, and renting properties.
                </p>
              </div>
              <ul className="ethni-features">
                <li>
                  <div className="feature-icon">
                    <SvgMake1Icon />
                  </div>
                  <div className="feature-content">
                    <h4>Connect with trusted agents</h4>
                    <p>Access our network of verified real estate professionals ready to help you.</p>
                  </div>
                </li>
                <li>
                  <div className="feature-icon">
                    <SvgMake2Icon />
                  </div>
                  <div className="feature-content">
                    <h4>Find your perfect home</h4>
                    <p>Browse thousands of listings with detailed information and high-quality photos.</p>
                  </div>
                </li>
                <li>
                  <div className="feature-icon">
                    <SvgMake3Icon />
                  </div>
                  <div className="feature-content">
                    <h4>Smart tools and resources</h4>
                    <p>Use our mortgage calculator, location guides, and market insights to make informed decisions.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-md-6">
            <div 
              className="make-ethni-image" 
              style={{ 
                backgroundImage: `url(${EthisnestImage})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                borderRadius: '12px',
                height: '400px'
              }}
            >
            </div>
          </div>
        </div>
      </div>
      <div 
        className="ethni-bg-section" 
        style={{
          backgroundImage: `url(${EthisnestBg})`,
          backgroundAttachment: 'fixed',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          padding: '80px 0',
          marginTop: '80px',
          color: '#fff',
          textAlign: 'center'
        }}
      >
        <div className="container">
          <h2>Transforming Ethiopian Real Estate</h2>
          <p>Join thousands of satisfied customers who found their dream homes with EthiNest</p>
          <div className="stat-counters">
            <div className="row mt-5">
              <div className="col-md-4">
                <div className="stat-item">
                  <h3>500+</h3>
                  <p>Happy Clients</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="stat-item">
                  <h3>1,223+</h3>
                  <p>Properties Listed</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="stat-item">
                  <h3>10+</h3>
                  <p>Cities Covered</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MakeEthniNestSection;
