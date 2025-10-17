import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ContactusPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [id]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, you would send this data to a server
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="contact-us-container" style={{
      maxWidth: '1200px',
      margin: '40px auto',
      padding: '20px',
      backgroundColor: '#fff',
      borderRadius: '12px',
      boxShadow: '0 5px 20px rgba(0,0,0,0.05)'
    }}>
      <div className="contact-us-header" style={{
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
        }}>Contact Us</h1>
        <p style={{
          fontSize: '18px',
          color: '#666',
          maxWidth: '800px',
          margin: '0 auto'
        }}>Get in touch with our team for any questions or inquiries</p>
      </div>

      <div className="contact-content" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '40px',
        padding: '0 20px'
      }}>
        <div className="contact-form-wrapper" style={{
          backgroundColor: '#f9f9f9',
          borderRadius: '10px',
          padding: '30px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#2e3d40',
            marginBottom: '20px',
            position: 'relative',
            paddingBottom: '10px'
          }}>
            Send Us a Message
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
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label htmlFor="fullName" style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#444'
              }}>Full Name</label>
              <input 
                type="text" 
                id="fullName" 
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name" 
                required
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  borderRadius: '6px',
                  border: '1px solid #ddd',
                  fontSize: '14px',
                  transition: 'border-color 0.3s',
                  outline: 'none'
                }}
              />
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label htmlFor="email" style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#444'
              }}>Email</label>
              <input 
                type="email" 
                id="email" 
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email" 
                required
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  borderRadius: '6px',
                  border: '1px solid #ddd',
                  fontSize: '14px',
                  transition: 'border-color 0.3s',
                  outline: 'none'
                }}
              />
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label htmlFor="phone" style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#444'
              }}>Phone Number</label>
              <input 
                type="tel" 
                id="phone" 
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number" 
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  borderRadius: '6px',
                  border: '1px solid #ddd',
                  fontSize: '14px',
                  transition: 'border-color 0.3s',
                  outline: 'none'
                }}
              />
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label htmlFor="subject" style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#444'
              }}>Subject</label>
              <select 
                id="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  borderRadius: '6px',
                  border: '1px solid #ddd',
                  fontSize: '14px',
                  transition: 'border-color 0.3s',
                  outline: 'none',
                  backgroundColor: 'white'
                }}
              >
                <option value="">Select a subject</option>
                <option value="general">General Inquiry</option>
                <option value="support">Technical Support</option>
                <option value="property">Property Question</option>
                <option value="agent">Agent Inquiry</option>
                <option value="feedback">Feedback</option>
              </select>
            </div>
            
            <div style={{ marginBottom: '25px' }}>
              <label htmlFor="message" style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#444'
              }}>Message</label>
              <textarea 
                id="message" 
                rows="5" 
                value={formData.message}
                onChange={handleChange}
                placeholder="Type your message here"
                required
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  borderRadius: '6px',
                  border: '1px solid #ddd',
                  fontSize: '14px',
                  transition: 'border-color 0.3s',
                  outline: 'none',
                  resize: 'vertical'
                }}
              ></textarea>
            </div>
            
            <button 
              type="submit" 
              style={{
                backgroundColor: '#4a6cf7',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '14px 25px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.3s',
                width: '100%'
              }}
            >
              Send Message
            </button>
          </form>
        </div>
        
        <div className="contact-info" style={{
          padding: '30px'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#2e3d40',
            marginBottom: '25px',
            position: 'relative',
            paddingBottom: '10px'
          }}>
            Our Contact Information
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
            marginBottom: '25px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '15px'
          }}>
            <div style={{
              backgroundColor: '#f0f4ff',
              color: '#4a6cf7',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px'
            }}>📍</div>
            <div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#2e3d40',
                marginBottom: '5px'
              }}>Address</h3>
              <p style={{
                fontSize: '15px',
                lineHeight: '1.5',
                color: '#666'
              }}>Addis Ababa, Ethiopia</p>
              <p style={{
                fontSize: '15px',
                lineHeight: '1.5',
                color: '#666'
              }}>Oregon, USA</p>
            </div>
          </div>
          
          <div style={{
            marginBottom: '25px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '15px'
          }}>
            <div style={{
              backgroundColor: '#f0f4ff',
              color: '#4a6cf7',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px'
            }}>📱</div>
            <div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#2e3d40',
                marginBottom: '5px'
              }}>Phone</h3>
              <p style={{
                fontSize: '15px',
                lineHeight: '1.5',
                color: '#666'
              }}>+251 123 456 789</p>
            </div>
          </div>
          
          <div style={{
            marginBottom: '25px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '15px'
          }}>
            <div style={{
              backgroundColor: '#f0f4ff',
              color: '#4a6cf7',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px'
            }}>✉️</div>
            <div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#2e3d40',
                marginBottom: '5px'
              }}>Email</h3>
              <p style={{
                fontSize: '15px',
                lineHeight: '1.5',
                color: '#666'
              }}>contactus@addisnest.com</p>
            </div>
          </div>
          
          <div style={{
            marginBottom: '25px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '15px'
          }}>
            <div style={{
              backgroundColor: '#f0f4ff',
              color: '#4a6cf7',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px'
            }}>⏰</div>
            <div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#2e3d40',
                marginBottom: '5px'
              }}>Business Hours</h3>
              <p style={{
                fontSize: '15px',
                lineHeight: '1.5',
                color: '#666',
                marginBottom: '5px'
              }}>Monday - Friday: 9:00 AM - 6:00 PM</p>
              <p style={{
                fontSize: '15px',
                lineHeight: '1.5',
                color: '#666',
                marginBottom: '5px'
              }}>Saturday: 10:00 AM - 4:00 PM</p>
              <p style={{
                fontSize: '15px',
                lineHeight: '1.5',
                color: '#666'
              }}>Sunday: Closed</p>
            </div>
          </div>
          
          <div style={{ marginTop: '30px' }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#2e3d40',
              marginBottom: '15px'
            }}>Follow Us</h3>
            <div style={{
              display: 'flex',
              gap: '10px'
            }}>
              <a href="#" style={{ 
                width: '40px', 
                height: '40px', 
                backgroundColor: '#f0f4ff', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: '#4a6cf7',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                fontSize: '16px'
              }}>
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" style={{ 
                width: '40px', 
                height: '40px', 
                backgroundColor: '#f0f4ff', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: '#4a6cf7',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                fontSize: '16px'
              }}>
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" style={{ 
                width: '40px', 
                height: '40px', 
                backgroundColor: '#f0f4ff', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: '#4a6cf7',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                fontSize: '16px'
              }}>
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" style={{ 
                width: '40px', 
                height: '40px', 
                backgroundColor: '#f0f4ff', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: '#4a6cf7',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                fontSize: '16px'
              }}>
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactusPage;
