import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicyPage = () => {
  return (
    <div className="privacy-policy-container" style={{
      maxWidth: '1200px',
      margin: '40px auto',
      padding: '20px',
      backgroundColor: '#fff',
      borderRadius: '12px',
      boxShadow: '0 5px 20px rgba(0,0,0,0.05)'
    }}>
      <div className="privacy-policy-header" style={{
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
        }}>Privacy Policy</h1>
        <p style={{
          fontSize: '16px',
          color: '#666',
          maxWidth: '800px',
          margin: '0 auto'
        }}>Last Updated: July 2, 2025</p>
      </div>

      <div className="privacy-policy-content" style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '30px',
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
            Introduction
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
            Addisnest ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, 
            use, disclose, and safeguard your information when you visit our website and use our services.
          </p>
          <p style={{
            fontSize: '16px',
            lineHeight: '1.6',
            color: '#555',
            marginBottom: '15px'
          }}>
            Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, 
            please do not access the site.
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
            Information We Collect
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
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#2e3d40',
            marginBottom: '10px',
            marginTop: '20px'
          }}>Personal Data</h3>
          <p style={{
            fontSize: '16px',
            lineHeight: '1.6',
            color: '#555',
            marginBottom: '15px'
          }}>
            We may collect personal information that you voluntarily provide to us when you register on the website, 
            express interest in obtaining information about us or our products and services, participate in activities 
            on the website, or otherwise contact us. The personal information we collect may include:
          </p>
          <ul style={{
            paddingLeft: '20px',
            marginBottom: '15px'
          }}>
            <li style={{
              fontSize: '16px',
              lineHeight: '1.6',
              color: '#555',
              marginBottom: '8px'
            }}>Name and contact information (email address, phone number, etc.)</li>
            <li style={{
              fontSize: '16px',
              lineHeight: '1.6',
              color: '#555',
              marginBottom: '8px'
            }}>Account credentials (username, password, etc.)</li>
            <li style={{
              fontSize: '16px',
              lineHeight: '1.6',
              color: '#555',
              marginBottom: '8px'
            }}>Profile information (profile picture, preferences, etc.)</li>
            <li style={{
              fontSize: '16px',
              lineHeight: '1.6',
              color: '#555',
              marginBottom: '8px'
            }}>Payment information (for property listings or premium services)</li>
            <li style={{
              fontSize: '16px',
              lineHeight: '1.6',
              color: '#555',
              marginBottom: '8px'
            }}>Property information (when listing a property)</li>
          </ul>

          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#2e3d40',
            marginBottom: '10px',
            marginTop: '20px'
          }}>Automatically Collected Information</h3>
          <p style={{
            fontSize: '16px',
            lineHeight: '1.6',
            color: '#555',
            marginBottom: '15px'
          }}>
            When you visit our website, we may automatically collect certain information about your device, including:
          </p>
          <ul style={{
            paddingLeft: '20px',
            marginBottom: '15px'
          }}>
            <li style={{
              fontSize: '16px',
              lineHeight: '1.6',
              color: '#555',
              marginBottom: '8px'
            }}>IP address</li>
            <li style={{
              fontSize: '16px',
              lineHeight: '1.6',
              color: '#555',
              marginBottom: '8px'
            }}>Browser type and version</li>
            <li style={{
              fontSize: '16px',
              lineHeight: '1.6',
              color: '#555',
              marginBottom: '8px'
            }}>Operating system</li>
            <li style={{
              fontSize: '16px',
              lineHeight: '1.6',
              color: '#555',
              marginBottom: '8px'
            }}>Referring website</li>
            <li style={{
              fontSize: '16px',
              lineHeight: '1.6',
              color: '#555',
              marginBottom: '8px'
            }}>Pages visited and time spent on those pages</li>
          </ul>
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
            How We Use Your Information
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
            We may use the information we collect for various purposes, including:
          </p>
          <ul style={{
            paddingLeft: '20px',
            marginBottom: '15px'
          }}>
            <li style={{
              fontSize: '16px',
              lineHeight: '1.6',
              color: '#555',
              marginBottom: '8px'
            }}>Providing, maintaining, and improving our services</li>
            <li style={{
              fontSize: '16px',
              lineHeight: '1.6',
              color: '#555',
              marginBottom: '8px'
            }}>Processing transactions and sending related information</li>
            <li style={{
              fontSize: '16px',
              lineHeight: '1.6',
              color: '#555',
              marginBottom: '8px'
            }}>Sending administrative information, such as updates, security alerts, and support messages</li>
            <li style={{
              fontSize: '16px',
              lineHeight: '1.6',
              color: '#555',
              marginBottom: '8px'
            }}>Responding to your comments, questions, and requests</li>
            <li style={{
              fontSize: '16px',
              lineHeight: '1.6',
              color: '#555',
              marginBottom: '8px'
            }}>Sending promotional communications, such as special offers or other information we think you may find interesting</li>
            <li style={{
              fontSize: '16px',
              lineHeight: '1.6',
              color: '#555',
              marginBottom: '8px'
            }}>Monitoring and analyzing trends, usage, and activities in connection with our services</li>
            <li style={{
              fontSize: '16px',
              lineHeight: '1.6',
              color: '#555',
              marginBottom: '8px'
            }}>Detecting, preventing, and addressing technical issues</li>
          </ul>
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
            Disclosure of Your Information
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
            We may share your information in the following situations:
          </p>
          <ul style={{
            paddingLeft: '20px',
            marginBottom: '15px'
          }}>
            <li style={{
              fontSize: '16px',
              lineHeight: '1.6',
              color: '#555',
              marginBottom: '8px'
            }}>With service providers who perform services for us</li>
            <li style={{
              fontSize: '16px',
              lineHeight: '1.6',
              color: '#555',
              marginBottom: '8px'
            }}>To comply with legal obligations</li>
            <li style={{
              fontSize: '16px',
              lineHeight: '1.6',
              color: '#555',
              marginBottom: '8px'
            }}>To protect and defend our rights and property</li>
            <li style={{
              fontSize: '16px',
              lineHeight: '1.6',
              color: '#555',
              marginBottom: '8px'
            }}>With your consent or at your direction</li>
          </ul>
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
            Your Rights
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
            You have certain rights regarding your personal information. These include:
          </p>
          <ul style={{
            paddingLeft: '20px',
            marginBottom: '15px'
          }}>
            <li style={{
              fontSize: '16px',
              lineHeight: '1.6',
              color: '#555',
              marginBottom: '8px'
            }}>The right to access the personal information we have about you</li>
            <li style={{
              fontSize: '16px',
              lineHeight: '1.6',
              color: '#555',
              marginBottom: '8px'
            }}>The right to request correction of inaccurate personal information</li>
            <li style={{
              fontSize: '16px',
              lineHeight: '1.6',
              color: '#555',
              marginBottom: '8px'
            }}>The right to request deletion of your personal information</li>
            <li style={{
              fontSize: '16px',
              lineHeight: '1.6',
              color: '#555',
              marginBottom: '8px'
            }}>The right to withdraw consent for processing your personal information</li>
          </ul>
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
            Security
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
            We implement appropriate technical and organizational measures to protect the security of your personal information. 
            However, please be aware that no method of transmission over the internet or electronic storage is 100% secure, 
            and we cannot guarantee absolute security.
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
            Changes to This Privacy Policy
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
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new 
            Privacy Policy on this page and updating the "Last Updated" date at the top of this page. You are advised 
            to review this Privacy Policy periodically for any changes.
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
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <p style={{
            fontSize: '16px',
            lineHeight: '1.6',
            color: '#555',
            marginBottom: '15px'
          }}>
            Email: privacy@addisnest.com<br />
            Or visit our <Link to="/contact-us" style={{ color: '#4a6cf7', textDecoration: 'none' }}>Contact page</Link>
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
