import React from 'react';
import { Link } from 'react-router-dom';

const TermsOfServicePage = () => {
  return (
    <div className="terms-of-service-container" style={{
      maxWidth: '1200px',
      margin: '40px auto',
      padding: '20px',
      backgroundColor: '#fff',
      borderRadius: '12px',
      boxShadow: '0 5px 20px rgba(0,0,0,0.05)'
    }}>
      <div className="terms-of-service-header" style={{
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
        }}>Terms of Service</h1>
        <p style={{
          fontSize: '16px',
          color: '#666',
          maxWidth: '800px',
          margin: '0 auto'
        }}>Last Updated: July 2, 2025</p>
      </div>

      <div className="terms-of-service-content" style={{
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
            Welcome to Addisnest. These Terms of Service ("Terms") govern your access to and use of the Addisnest website, 
            services, and applications (collectively, the "Services"). By accessing or using our Services, you agree to be 
            bound by these Terms. If you do not agree to these Terms, you may not access or use the Services.
          </p>
          <p style={{
            fontSize: '16px',
            lineHeight: '1.6',
            color: '#555',
            marginBottom: '15px'
          }}>
            Please read these Terms carefully before using our Services. If you have any questions about these Terms, 
            please contact us using the information provided at the end of this document.
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
            Definitions
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
          <ul style={{
            paddingLeft: '20px',
            marginBottom: '15px'
          }}>
            <li style={{
              fontSize: '16px',
              lineHeight: '1.6',
              color: '#555',
              marginBottom: '8px'
            }}><strong>"Addisnest,"</strong> "we," "our," or "us" refers to Addisnest, the company that operates the Services.</li>
            <li style={{
              fontSize: '16px',
              lineHeight: '1.6',
              color: '#555',
              marginBottom: '8px'
            }}><strong>"User,"</strong> "you," or "your" refers to any individual or entity that accesses or uses the Services.</li>
            <li style={{
              fontSize: '16px',
              lineHeight: '1.6',
              color: '#555',
              marginBottom: '8px'
            }}><strong>"Content"</strong> refers to any information, text, graphics, photos, or other materials uploaded, downloaded, or appearing on the Services.</li>
            <li style={{
              fontSize: '16px',
              lineHeight: '1.6',
              color: '#555',
              marginBottom: '8px'
            }}><strong>"Property Listing"</strong> refers to any real estate property information posted on the Services.</li>
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
            Account Registration and Security
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
            To access certain features of the Services, you may be required to register for an account. When you register, 
            you agree to provide accurate, current, and complete information about yourself. You are responsible for 
            maintaining the confidentiality of your account credentials and for all activities that occur under your account.
          </p>
          <p style={{
            fontSize: '16px',
            lineHeight: '1.6',
            color: '#555',
            marginBottom: '15px'
          }}>
            You agree to:
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
            }}>Immediately notify Addisnest of any unauthorized use of your account or any other breach of security.</li>
            <li style={{
              fontSize: '16px',
              lineHeight: '1.6',
              color: '#555',
              marginBottom: '8px'
            }}>Ensure that you log out of your account at the end of each session when accessing the Services on a shared computer.</li>
            <li style={{
              fontSize: '16px',
              lineHeight: '1.6',
              color: '#555',
              marginBottom: '8px'
            }}>Not share your account credentials with any third party.</li>
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
            User Content and Conduct
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
            Our Services allow you to post, link, store, share, and otherwise make available certain information, text, 
            graphics, videos, or other material. You are responsible for the Content that you post on or through the Services, 
            including its legality, reliability, and appropriateness.
          </p>
          <p style={{
            fontSize: '16px',
            lineHeight: '1.6',
            color: '#555',
            marginBottom: '15px'
          }}>
            By posting Content on or through the Services, you represent and warrant that:
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
            }}>The Content is yours (you own it) or you have the right to use it and grant us the rights and license as provided in these Terms.</li>
            <li style={{
              fontSize: '16px',
              lineHeight: '1.6',
              color: '#555',
              marginBottom: '8px'
            }}>The posting of your Content on or through the Services does not violate the privacy rights, publicity rights, copyrights, contract rights, or any other rights of any person or entity.</li>
          </ul>
          <p style={{
            fontSize: '16px',
            lineHeight: '1.6',
            color: '#555',
            marginBottom: '15px'
          }}>
            You agree not to engage in any of the following prohibited activities:
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
            }}>Use the Services in any manner that could disable, overburden, damage, or impair the Services.</li>
            <li style={{
              fontSize: '16px',
              lineHeight: '1.6',
              color: '#555',
              marginBottom: '8px'
            }}>Use any robot, spider, or other automatic device, process, or means to access the Services for any purpose.</li>
            <li style={{
              fontSize: '16px',
              lineHeight: '1.6',
              color: '#555',
              marginBottom: '8px'
            }}>Introduce any viruses, Trojan horses, worms, logic bombs, or other material that is malicious or technologically harmful.</li>
            <li style={{
              fontSize: '16px',
              lineHeight: '1.6',
              color: '#555',
              marginBottom: '8px'
            }}>Attempt to gain unauthorized access to, interfere with, damage, or disrupt any parts of the Services.</li>
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
            Property Listings
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
            Addisnest provides a platform for users to list and browse real estate properties. If you choose to list a property, 
            you represent and warrant that:
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
            }}>You have the legal right to list the property for sale or rent.</li>
            <li style={{
              fontSize: '16px',
              lineHeight: '1.6',
              color: '#555',
              marginBottom: '8px'
            }}>All information provided about the property is accurate, complete, and up-to-date.</li>
            <li style={{
              fontSize: '16px',
              lineHeight: '1.6',
              color: '#555',
              marginBottom: '8px'
            }}>You will promptly update the listing if any information changes or if the property is no longer available.</li>
          </ul>
          <p style={{
            fontSize: '16px',
            lineHeight: '1.6',
            color: '#555',
            marginBottom: '15px'
          }}>
            Addisnest reserves the right to remove any property listing that violates these Terms or for any other reason at our sole discretion.
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
            Intellectual Property
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
            The Services and their original content (excluding Content provided by users), features, and functionality are and 
            will remain the exclusive property of Addisnest and its licensors. The Services are protected by copyright, 
            trademark, and other laws of both Ethiopia and foreign countries. Our trademarks and trade dress may not be used 
            in connection with any product or service without the prior written consent of Addisnest.
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
            Limitation of Liability
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
            In no event shall Addisnest, its directors, employees, partners, agents, suppliers, or affiliates be liable for 
            any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, 
            data, use, goodwill, or other intangible losses, resulting from:
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
            }}>Your access to or use of or inability to access or use the Services.</li>
            <li style={{
              fontSize: '16px',
              lineHeight: '1.6',
              color: '#555',
              marginBottom: '8px'
            }}>Any conduct or content of any third party on the Services.</li>
            <li style={{
              fontSize: '16px',
              lineHeight: '1.6',
              color: '#555',
              marginBottom: '8px'
            }}>Any content obtained from the Services.</li>
            <li style={{
              fontSize: '16px',
              lineHeight: '1.6',
              color: '#555',
              marginBottom: '8px'
            }}>Unauthorized access, use, or alteration of your transmissions or content.</li>
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
            Disclaimer
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
            Your use of the Services is at your sole risk. The Services are provided on an "AS IS" and "AS AVAILABLE" basis. 
            The Services are provided without warranties of any kind, whether express or implied, including, but not limited to, 
            implied warranties of merchantability, fitness for a particular purpose, non-infringement, or course of performance.
          </p>
          <p style={{
            fontSize: '16px',
            lineHeight: '1.6',
            color: '#555',
            marginBottom: '15px'
          }}>
            Addisnest does not warrant that:
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
            }}>The Services will function uninterrupted, secure, or available at any particular time or location.</li>
            <li style={{
              fontSize: '16px',
              lineHeight: '1.6',
              color: '#555',
              marginBottom: '8px'
            }}>Any errors or defects will be corrected.</li>
            <li style={{
              fontSize: '16px',
              lineHeight: '1.6',
              color: '#555',
              marginBottom: '8px'
            }}>The Services are free of viruses or other harmful components.</li>
            <li style={{
              fontSize: '16px',
              lineHeight: '1.6',
              color: '#555',
              marginBottom: '8px'
            }}>The results of using the Services will meet your requirements.</li>
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
            Changes to Terms
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
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, 
            we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change 
            will be determined at our sole discretion.
          </p>
          <p style={{
            fontSize: '16px',
            lineHeight: '1.6',
            color: '#555',
            marginBottom: '15px'
          }}>
            By continuing to access or use our Services after any revisions become effective, you agree to be bound by the 
            revised terms. If you do not agree to the new terms, you are no longer authorized to use the Services.
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
            Governing Law
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
            These Terms shall be governed and construed in accordance with the laws of Ethiopia, without regard to its 
            conflict of law provisions.
          </p>
          <p style={{
            fontSize: '16px',
            lineHeight: '1.6',
            color: '#555',
            marginBottom: '15px'
          }}>
            Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. 
            If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of 
            these Terms will remain in effect.
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
            If you have any questions about these Terms, please contact us at:
          </p>
          <p style={{
            fontSize: '16px',
            lineHeight: '1.6',
            color: '#555',
            marginBottom: '15px'
          }}>
            Email: legal@addisnest.com<br />
            Or visit our <Link to="/contact-us" style={{ color: '#4a6cf7', textDecoration: 'none' }}>Contact page</Link>
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
