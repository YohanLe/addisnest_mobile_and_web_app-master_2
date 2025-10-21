import React from 'react';
import { useSelector } from 'react-redux';
import { FaPhone, FaEnvelope, FaComments, FaTimes, FaCheck, FaStar, FaCalendarAlt } from 'react-icons/fa';
import './AgentDetailPopup.css';

const AgentDetailPopup = ({ onClose }) => {
  const agent = useSelector(state => state.Agents?.selectedAgent);

  if (!agent) {
    return null;
  }

  // Format agent data for display
  const agentName = `${agent.firstName || ''} ${agent.lastName || ''}`.trim() || 'N/A';
  const agentEmail = agent.email || 'Not provided';
  const agentPhone = (agent.phone && agent.phone !== 'None' && agent.phone !== '') ? agent.phone : 'Not provided';
  const agentRegion = agent.region || agent.address?.state || 'Not specified';
  const agentExperience = agent.experience || 0;
  const agentLicense = (agent.licenseNumber && agent.licenseNumber !== 'None' && agent.licenseNumber !== '') ? agent.licenseNumber : 'Not provided';
  const agentAgency = (agent.agency && agent.agency !== 'None' && agent.agency !== '') ? agent.agency : 'Not provided';
  const agentBio = (agent.about && agent.about !== 'None' && agent.about !== '') ? agent.about : 'No bio available';
  const agentProfilePic = (agent.profilePicture && agent.profilePicture !== 'None') ? agent.profilePicture : (agent.profile_img && agent.profile_img !== 'None') ? agent.profile_img : '';
  const agentRating = agent.rating || agent.averageRating || 0;
  const isVerified = agent.isVerified || agent.licenseVerified || false;

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
              <span style={{backgroundImage: agentProfilePic ? `url(${agentProfilePic})` : 'none'}}></span>
              {isVerified && (
                <div className="verified-badge-profile" title="Verified Agent">
                  <FaCheck />
                </div>
              )}
            </div>

            <div className="agent-profile-info">
              <h3>{agentName}</h3>
              <div className="agent-region">{agentRegion}</div>
              <p>
                <FaPhone /> {agentPhone}
              </p>
              <p>
                <FaEnvelope /> {agentEmail}
              </p>
              {agentRating > 0 && (
                <div className="agent-rating">
                  {renderStars(agentRating)}
                  <span>({agentRating})</span>
                </div>
              )}
            </div>
          </div>

          {/* Agent Stats */}
          <div className="agent-details-info">
            <div className="agent-info-row">
              <div className="agent-info-item">
                <h5>Experience</h5>
                <p>{agentExperience} years</p>
              </div>
              {agentAgency !== 'Not provided' && (
                <div className="agent-info-item">
                  <h5>Agency</h5>
                  <p>{agentAgency}</p>
                </div>
              )}
              {agentLicense !== 'Not provided' && (
                <div className="agent-info-item">
                  <h5>License</h5>
                  <p>{agentLicense}</p>
                </div>
              )}
            </div>

            {/* Verification Info */}
            {isVerified && agentLicense !== 'Not provided' && (
              <div className="agent-verification-info">
                <div className="verification-badge">
                  <FaCheck />
                  <span>Verified Agent</span>
                </div>
                <p className="license-number">License No: {agentLicense}</p>
              </div>
            )}

            {/* Agent Bio */}
            {agentBio !== 'No bio available' && (
              <div className="agent-bio-section">
                <h4>About {agentName}</h4>
                <p>{agentBio}</p>
              </div>
            )}

            {/* Agent Specializations */}
            {agent.specialties && agent.specialties.length > 0 && (
              <div className="agent-specializations">
                <h4>Specialties</h4>
                <div className="specialization-tags">
                  {agent.specialties.map((specialty, index) => (
                    <span key={index} className="specialization-tag">{specialty}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {agent.languages && agent.languages.length > 0 && (
              <div className="agent-specializations">
                <h4>Languages</h4>
                <div className="specialization-tags">
                  {agent.languages.map((language, index) => (
                    <span key={index} className="specialization-tag">{language}</span>
                  ))}
                </div>
              </div>
            )}

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
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDetailPopup;
