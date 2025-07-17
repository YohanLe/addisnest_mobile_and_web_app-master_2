import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const PartnerWithUsPage = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    partnershipType: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Send the partnership request to the backend
      await axios.post('/api/partnership-requests', formData);
      
      // Show success message
      setSubmitSuccess(true);
      console.log('Partnership request submitted successfully');
      
      // Reset form
      setFormData({
        companyName: '',
        contactName: '',
        email: '',
        phone: '',
        partnershipType: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting partnership request:', error);
      setSubmitError(
        error.response?.data?.error || 
        'An error occurred while submitting your request. Please try again later.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="partner-with-us-container" style={{
      maxWidth: '1200px',
      margin: '40px auto',
      padding: '20px',
      backgroundColor: '#fff',
      borderRadius: '12px',
      boxShadow: '0 5px 20px rgba(0,0,0,0.05)'
    }}>
      <div className="partner-with-us-header" style={{
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
        }}>Partner With Us</h1>
        <p style={{
          fontSize: '18px',
          color: '#666',
          maxWidth: '800px',
          margin: '0 auto'
        }}>Join forces with AddisNest to reach thousands of property seekers and homeowners across Ethiopia</p>
      </div>

      <div className="partnership-types" style={{
        marginBottom: '50px',
        padding: '0 20px'
      }}>
        <h2 style={{
          fontSize: '28px',
          fontWeight: '600',
          color: '#2e3d40',
          marginBottom: '30px',
          textAlign: 'center'
        }}>Partnership Opportunities</h2>

        {/* Empty space where partnership types were removed */}
      </div>

      <div className="partnership-benefits" style={{
        backgroundColor: '#f0f4ff',
        padding: '50px 30px',
        borderRadius: '10px',
        marginBottom: '50px'
      }}>
        <h2 style={{
          fontSize: '28px',
          fontWeight: '600',
          color: '#2e3d40',
          marginBottom: '30px',
          textAlign: 'center'
        }}>Why Partner With AddisNest?</h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '30px'
        }}>
          <div className="benefit-item" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center'
          }}>
            <div style={{
              backgroundColor: 'white',
              color: '#4a6cf7',
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '30px',
              marginBottom: '15px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
            }}>👥</div>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#2e3d40',
              marginBottom: '10px'
            }}>Growing Audience</h3>
            <p style={{
              fontSize: '15px',
              lineHeight: '1.5',
              color: '#555'
            }}>
              Reach thousands of monthly visitors actively looking for property and related services in Ethiopia.
            </p>
          </div>

          <div className="benefit-item" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center'
          }}>
            <div style={{
              backgroundColor: 'white',
              color: '#4a6cf7',
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '30px',
              marginBottom: '15px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
            }}>🎯</div>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#2e3d40',
              marginBottom: '10px'
            }}>Targeted Exposure</h3>
            <p style={{
              fontSize: '15px',
              lineHeight: '1.5',
              color: '#555'
            }}>
              Connect with a highly targeted audience interested in real estate and property services.
            </p>
          </div>

          <div className="benefit-item" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center'
          }}>
            <div style={{
              backgroundColor: 'white',
              color: '#4a6cf7',
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '30px',
              marginBottom: '15px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
            }}>📊</div>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#2e3d40',
              marginBottom: '10px'
            }}>Performance Tracking</h3>
            <p style={{
              fontSize: '15px',
              lineHeight: '1.5',
              color: '#555'
            }}>
              Receive detailed analytics and reports to measure the success of your partnership.
            </p>
          </div>

          <div className="benefit-item" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center'
          }}>
            <div style={{
              backgroundColor: 'white',
              color: '#4a6cf7',
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '30px',
              marginBottom: '15px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
            }}>🤝</div>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#2e3d40',
              marginBottom: '10px'
            }}>Flexible Options</h3>
            <p style={{
              fontSize: '15px',
              lineHeight: '1.5',
              color: '#555'
            }}>
              Customizable partnership packages to suit your business goals and budget.
            </p>
          </div>
        </div>
      </div>

      <div className="partnership-content" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '40px',
        padding: '0 20px'
      }}>
        <div className="partnership-form-wrapper" style={{
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
            Become a Partner
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
            fontSize: '15px',
            lineHeight: '1.6',
            color: '#666',
            marginBottom: '25px'
          }}>
            Interested in partnering with AddisNest? Fill out the form below and our partnership team will contact you to discuss opportunities.
          </p>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label htmlFor="companyName" style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#444'
              }}>Company Name</label>
              <input 
                type="text" 
                id="companyName" 
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Enter your company name" 
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
              <label htmlFor="contactName" style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#444'
              }}>Contact Person</label>
              <input 
                type="text" 
                id="contactName" 
                value={formData.contactName}
                onChange={handleChange}
                placeholder="Enter contact person's name" 
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
              <label htmlFor="partnershipType" style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#444'
              }}>Partnership Type</label>
              <select 
                id="partnershipType"
                value={formData.partnershipType}
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
                <option value="">Select partnership type</option>
                <option value="advertising">Advertising Partner</option>
                <option value="corporate">Corporate Sponsor</option>
                <option value="service">Service Provider</option>
                <option value="other">Other</option>
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
                placeholder="Tell us about your partnership interests and goals"
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
            
            {submitSuccess && (
              <div style={{
                backgroundColor: '#e6f7e6',
                color: '#2e7d32',
                padding: '15px',
                borderRadius: '6px',
                marginBottom: '20px',
                fontSize: '14px',
                textAlign: 'center'
              }}>
                Thank you for your interest in partnering with us! Your request has been submitted successfully. Our team will contact you soon.
              </div>
            )}
            
            {submitError && (
              <div style={{
                backgroundColor: '#ffebee',
                color: '#c62828',
                padding: '15px',
                borderRadius: '6px',
                marginBottom: '20px',
                fontSize: '14px',
                textAlign: 'center'
              }}>
                {submitError}
              </div>
            )}
            
            <button 
              type="submit" 
              disabled={isSubmitting}
              style={{
                backgroundColor: isSubmitting ? '#a0b3f9' : '#4a6cf7',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '14px 25px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.3s',
                width: '100%'
              }}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Partnership Request'}
            </button>
          </form>
        </div>
        
        <div className="partnership-info" style={{
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
            Partnership Process
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
          
          <div className="process-steps">
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
                fontSize: '18px',
                fontWeight: 'bold'
              }}>1</div>
              <div>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#2e3d40',
                  marginBottom: '5px'
                }}>Submit Your Request</h3>
                <p style={{
                  fontSize: '15px',
                  lineHeight: '1.5',
                  color: '#666'
                }}>Fill out the partnership form with your company details and partnership interests.</p>
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
                fontSize: '18px',
                fontWeight: 'bold'
              }}>2</div>
              <div>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#2e3d40',
                  marginBottom: '5px'
                }}>Initial Consultation</h3>
                <p style={{
                  fontSize: '15px',
                  lineHeight: '1.5',
                  color: '#666'
                }}>Our partnership team will contact you to discuss your goals and explore opportunities.</p>
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
                fontSize: '18px',
                fontWeight: 'bold'
              }}>3</div>
              <div>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#2e3d40',
                  marginBottom: '5px'
                }}>Custom Proposal</h3>
                <p style={{
                  fontSize: '15px',
                  lineHeight: '1.5',
                  color: '#666'
                }}>We'll create a tailored partnership proposal based on your specific needs and objectives.</p>
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
                fontSize: '18px',
                fontWeight: 'bold'
              }}>4</div>
              <div>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#2e3d40',
                  marginBottom: '5px'
                }}>Partnership Launch</h3>
                <p style={{
                  fontSize: '15px',
                  lineHeight: '1.5',
                  color: '#666'
                }}>Once terms are agreed upon, we'll implement your partnership and begin promoting your brand.</p>
              </div>
            </div>
          </div>
          
          <div style={{ 
            marginTop: '40px',
            padding: '25px',
            backgroundColor: '#f9f9f9',
            borderRadius: '10px',
            border: '1px solid #eee'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#2e3d40',
              marginBottom: '15px'
            }}>Contact Our Partnership Team Directly</h3>
            <p style={{
              fontSize: '15px',
              lineHeight: '1.5',
              color: '#666',
              marginBottom: '15px'
            }}>
              For immediate assistance or to discuss premium partnership opportunities:
            </p>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '10px'
            }}>
              <span style={{ color: '#4a6cf7', fontSize: '16px' }}>✉️</span>
              <span style={{ fontSize: '15px', color: '#555' }}>partnerships@addisnest.com</span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <span style={{ color: '#4a6cf7', fontSize: '16px' }}>📱</span>
              <span style={{ fontSize: '15px', color: '#555' }}>+251 123 456 789</span>
            </div>
          </div>
        </div>
      </div>

      <div className="testimonials-section" style={{
        marginTop: '50px',
        padding: '40px 20px',
        backgroundColor: '#f9f9f9',
        borderRadius: '10px'
      }}>
        <h2 style={{
          fontSize: '28px',
          fontWeight: '600',
          color: '#2e3d40',
          marginBottom: '30px',
          textAlign: 'center'
        }}>What Our Partners Say</h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '30px'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '25px',
            borderRadius: '10px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
          }}>
            <div style={{
              fontSize: '20px',
              color: '#4a6cf7',
              marginBottom: '15px'
            }}>★★★★★</div>
            <p style={{
              fontSize: '15px',
              lineHeight: '1.6',
              color: '#555',
              fontStyle: 'italic',
              marginBottom: '20px'
            }}>
              "Partnering with AddisNest has significantly increased our brand visibility in the Ethiopian real estate market. 
              Their targeted audience is exactly who we want to reach."
            </p>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                backgroundColor: '#f0f4ff',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px'
              }}>AB</div>
              <div>
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#2e3d40',
                  marginBottom: '3px'
                }}>Abebe Bekele</h4>
                <p style={{
                  fontSize: '14px',
                  color: '#777'
                }}>Marketing Director, Addis Home Furnishings</p>
              </div>
            </div>
          </div>
          
          <div style={{
            backgroundColor: 'white',
            padding: '25px',
            borderRadius: '10px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
          }}>
            <div style={{
              fontSize: '20px',
              color: '#4a6cf7',
              marginBottom: '15px'
            }}>★★★★★</div>
            <p style={{
              fontSize: '15px',
              lineHeight: '1.6',
              color: '#555',
              fontStyle: 'italic',
              marginBottom: '20px'
            }}>
              "The partnership with AddisNest has been incredibly valuable for our construction company. 
              We've connected with serious property developers and homeowners looking for quality services."
            </p>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                backgroundColor: '#f0f4ff',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px'
              }}>MT</div>
              <div>
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#2e3d40',
                  marginBottom: '3px'
                }}>Meron Tadesse</h4>
                <p style={{
                  fontSize: '14px',
                  color: '#777'
                }}>CEO, Addis Modern Construction</p>
              </div>
            </div>
          </div>
          
          <div style={{
            backgroundColor: 'white',
            padding: '25px',
            borderRadius: '10px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
          }}>
            <div style={{
              fontSize: '20px',
              color: '#4a6cf7',
              marginBottom: '15px'
            }}>★★★★★</div>
            <p style={{
              fontSize: '15px',
              lineHeight: '1.6',
              color: '#555',
              fontStyle: 'italic',
              marginBottom: '20px'
            }}>
              "As a financial institution, we needed to reach potential homebuyers. Our sponsorship with AddisNest 
              has delivered exceptional ROI and helped us connect with qualified mortgage applicants."
            </p>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                backgroundColor: '#f0f4ff',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px'
              }}>DG</div>
              <div>
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#2e3d40',
                  marginBottom: '3px'
                }}>Daniel Girma</h4>
                <p style={{
                  fontSize: '14px',
                  color: '#777'
                }}>Marketing Manager, Ethiopian National Bank</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerWithUsPage;
