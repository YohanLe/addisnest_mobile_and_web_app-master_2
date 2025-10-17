import React from 'react';
import { Link } from 'react-router-dom';

const AboutUsPage = () => {
  return (
    <div className="about-us-container" style={{
      maxWidth: '1200px',
      margin: '40px auto',
      padding: '20px',
      backgroundColor: '#fff',
      borderRadius: '12px',
      boxShadow: '0 5px 20px rgba(0,0,0,0.05)'
    }}>
      <div className="about-us-header" style={{
        textAlign: 'center',
        marginBottom: '40px',
        padding: '20px 0',
        borderBottom: '1px solid #eee'
      }}>
        <h1 style={{
          fontSize: '36px',
          fontWeight: '700',
          color: '#2e3d40',
          marginBottom: '15px'
        }}>About Addisnest</h1>
        <p style={{
          fontSize: '18px',
          color: '#666',
          maxWidth: '800px',
          margin: '0 auto'
        }}>Connecting you to the best properties across Ethiopia</p>
      </div>

      <div className="about-us-content" style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '40px',
        padding: '0 20px'
      }}>
        <section>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#2e3d40',
            marginBottom: '15px',
            position: 'relative',
            paddingBottom: '10px'
          }}>
            Our Mission
            <span style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '60px',
              height: '3px',
              background: '#b9f73e',
              borderRadius: '2px'
            }}></span>
          </h2>
          <p style={{
            fontSize: '16px',
            lineHeight: '1.6',
            color: '#555',
            marginBottom: '15px'
          }}>
            At Addisnest, our mission is to transform the real estate experience in Ethiopia by creating a transparent, 
            efficient, and accessible marketplace for property buyers, sellers, and renters. We strive to empower 
            individuals and families to find their perfect home while helping property owners connect with the right 
            audience.
          </p>
        </section>

        <section>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#2e3d40',
            marginBottom: '15px',
            position: 'relative',
            paddingBottom: '10px'
          }}>
            Our Story
            <span style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '60px',
              height: '3px',
              background: '#b9f73e',
              borderRadius: '2px'
            }}></span>
          </h2>
          <p style={{
            fontSize: '16px',
            lineHeight: '1.6',
            color: '#555',
            marginBottom: '15px'
          }}>
            Founded in 2023, Addisnest emerged from a vision to address the challenges in Ethiopia's real estate market. 
            Our founders recognized the need for a modern, digital platform that could bridge the gap between property 
            seekers and owners, making the process more efficient and transparent for everyone involved.
          </p>
          <p style={{
            fontSize: '16px',
            lineHeight: '1.6',
            color: '#555',
            marginBottom: '15px'
          }}>
            What began as a small startup has grown into a trusted platform serving thousands of users across Ethiopia. 
            Our journey has been driven by continuous innovation and a deep commitment to improving the real estate 
            experience for all Ethiopians.
          </p>
        </section>

        <section>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#2e3d40',
            marginBottom: '15px',
            position: 'relative',
            paddingBottom: '10px'
          }}>
            What Sets Us Apart
            <span style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '60px',
              height: '3px',
              background: '#b9f73e',
              borderRadius: '2px'
            }}></span>
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginTop: '20px'
          }}>
            <div style={{
              padding: '20px',
              backgroundColor: '#f9f9f9',
              borderRadius: '8px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#2e3d40',
                marginBottom: '10px'
              }}>Local Expertise</h3>
              <p style={{
                fontSize: '15px',
                lineHeight: '1.5',
                color: '#666'
              }}>
                Our team has deep knowledge of Ethiopia's real estate market, providing insights that help our users make informed decisions.
              </p>
            </div>
            <div style={{
              padding: '20px',
              backgroundColor: '#f9f9f9',
              borderRadius: '8px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#2e3d40',
                marginBottom: '10px'
              }}>User-Centered Design</h3>
              <p style={{
                fontSize: '15px',
                lineHeight: '1.5',
                color: '#666'
              }}>
                We've built our platform with the user experience at the forefront, making it easy to navigate and find exactly what you're looking for.
              </p>
            </div>
            <div style={{
              padding: '20px',
              backgroundColor: '#f9f9f9',
              borderRadius: '8px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#2e3d40',
                marginBottom: '10px'
              }}>Comprehensive Listings</h3>
              <p style={{
                fontSize: '15px',
                lineHeight: '1.5',
                color: '#666'
              }}>
                From apartments in Addis Ababa to houses in regional cities, we offer a wide range of property options to suit every need and budget.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#2e3d40',
            marginBottom: '15px',
            position: 'relative',
            paddingBottom: '10px'
          }}>
            Our Team
            <span style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '60px',
              height: '3px',
              background: '#b9f73e',
              borderRadius: '2px'
            }}></span>
          </h2>
          <p style={{
            fontSize: '16px',
            lineHeight: '1.6',
            color: '#555',
            marginBottom: '25px'
          }}>
            Addisnest is powered by a diverse team of professionals passionate about real estate and technology. 
            Our experts in real estate, software development, customer service, and market analysis work together 
            to deliver an exceptional platform for our users.
          </p>
        </section>

        <section>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#2e3d40',
            marginBottom: '15px',
            position: 'relative',
            paddingBottom: '10px'
          }}>
            Contact Us
            <span style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '60px',
              height: '3px',
              background: '#b9f73e',
              borderRadius: '2px'
            }}></span>
          </h2>
          <p style={{
            fontSize: '16px',
            lineHeight: '1.6',
            color: '#555',
            marginBottom: '15px'
          }}>
            Have questions or feedback? We'd love to hear from you! Visit our <Link to="/contact-us" style={{ color: '#4a6cf7', textDecoration: 'none' }}>Contact page</Link> to get in touch with our team.
          </p>
        </section>
      </div>
    </div>
  );
};

export default AboutUsPage;
