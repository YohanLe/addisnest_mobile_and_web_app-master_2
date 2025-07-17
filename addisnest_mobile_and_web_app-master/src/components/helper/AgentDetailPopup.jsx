import React from 'react';
import { useSelector } from 'react-redux';
import { FaPhone, FaEnvelope, FaComments, FaTimes, FaCheck, FaStar, FaCalendarAlt } from 'react-icons/fa';

const AgentDetailPopup = ({ onClose }) => {
  // In a real application, we would fetch this from Redux
  // For now, we'll just use a placeholder
  const agent = useSelector(state => state.Agents?.selectedAgent) || {
    id: 1,
    name: 'Samuel Tesfaye',
    profilePicture: '',
    region: 'Addis Ababa',
    rating: 4.8,
    experience: 5,
    phone: '+251 91 234 5678',
    specialties: ['Buying', 'Selling', 'Luxury'],
    languages: ['Amharic', 'English'],
    bio: 'Experienced real estate agent specialized in luxury properties in Addis Ababa. Dedicated to helping clients find their dream homes.',
    email: 'samuel.tesfaye@example.com',
    isVerified: true,
    licenseNumber: 'ET-RE-12345',
    currentListings: 12,
    transactionsClosed: 45,
    reviews: [
      {
        id: 1,
        rating: 5,
        text: 'Samuel helped us find our dream home in a very competitive market. His knowledge of Addis Ababa neighborhoods was invaluable.'
      },
      {
        id: 2,
        rating: 4,
        text: 'Great communication throughout the buying process. Would recommend for anyone looking for properties in the city center.'
      }
    ]
  };

  // Render stars for ratings
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="star filled" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStar key={i} className="star half-filled" />);
      } else {
        stars.push(<FaStar key={i} className="star" />);
      }
    }
    
    return stars;
  };

  const handleCall = () => {
    window.location.href = `tel:${agent.phone}`;
  };

  const handleEmail = () => {
    window.location.href = `mailto:${agent.email}`;
  };

  const handleChat = () => {
    // In a real app, this would open a chat interface or redirect to one
    alert('Chat functionality would be implemented here');
  };

  const handleSchedule = () => {
    // In a real app, this would open a scheduling interface
    alert('Scheduling functionality would be implemented here');
  };

  return (
    <div className="agent-detail-popup-main">
      <div className="agent-detail-backdrop" onClick={onClose}></div>
      <div className="agent-detail-popup">
        <div className="agent-detail-popup-inner">
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>

          {/* Agent Profile Top Section */}
          <div className="agent-details-top">
            <div className="agent-profile-img">
              <span style={{backgroundImage: agent.profilePicture ? `url(${agent.profilePicture})` : 'none'}}></span>
              {agent.isVerified && (
                <div className="verified-badge-profile" title="Verified Agent">
                  <FaCheck />
                </div>
              )}
            </div>

            <div className="agent-profile-info">
              <h3>{agent.name}</h3>
              <div className="agent-region">{agent.region}</div>
              <p>
                <FaPhone /> {agent.phone}
              </p>
              <p>
                <FaEnvelope /> {agent.email}
              </p>
              <div className="agent-rating">
                {renderStars(agent.rating)}
                <span>({agent.rating})</span>
              </div>
            </div>
          </div>

          {/* Agent Stats */}
          <div className="agent-details-info">
            <div className="agent-info-row">
              <div className="agent-info-item">
                <h5>Experience</h5>
                <p>{agent.experience} years</p>
              </div>
              <div className="agent-info-item">
                <h5>Current Listings</h5>
                <p>{agent.currentListings}</p>
              </div>
              <div className="agent-info-item">
                <h5>Transactions Closed</h5>
                <p>{agent.transactionsClosed}</p>
              </div>
            </div>

            {/* Verification Info */}
            {agent.isVerified && (
              <div className="agent-verification-info">
                <div className="verification-badge">
                  <FaCheck />
                  <span>Verified Agent</span>
                </div>
                <p className="license-number">License No: {agent.licenseNumber}</p>
              </div>
            )}

            {/* Agent Bio */}
            <div className="agent-bio-section">
              <h4>About {agent.name}</h4>
              <p>{agent.bio}</p>
            </div>

            {/* Agent Specializations */}
            <div className="agent-specializations">
              <h4>Specialties</h4>
              <div className="specialization-tags">
                {agent.specialties.map((specialty, index) => (
                  <span key={index} className="specialization-tag">{specialty}</span>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div className="agent-specializations">
              <h4>Languages</h4>
              <div className="specialization-tags">
                {agent.languages.map((language, index) => (
                  <span key={index} className="specialization-tag">{language}</span>
                ))}
              </div>
            </div>

            {/* Reviews */}
            {agent.reviews && agent.reviews.length > 0 && (
              <div className="agent-reviews-section">
                <h4>Client Reviews</h4>
                <div className="agent-reviews">
                  {agent.reviews.map(review => (
                    <div key={review.id} className="review-item">
                      <div className="review-rating">
                        {renderStars(review.rating)}
                      </div>
                      <p className="review-text">{review.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Actions */}
            <div className="agent-contact-actions">
              <button 
                onClick={handleCall}
                style={{ backgroundColor: '#4a6cf7', color: 'white' }}
              >
                <FaPhone /> Call
              </button>
              <button 
                onClick={handleEmail}
                style={{ backgroundColor: '#28a745', color: 'white' }}
              >
                <FaEnvelope /> Email
              </button>
              <button 
                onClick={handleChat}
                style={{ backgroundColor: '#fd7e14', color: 'white' }}
              >
                <FaComments /> Chat
              </button>
              <button 
                onClick={handleSchedule}
                style={{ backgroundColor: '#17a2b8', color: 'white' }}
              >
                <FaCalendarAlt /> Schedule Meeting
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDetailPopup;
