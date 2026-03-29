import React from 'react';
import { useSelector } from 'react-redux';
import { FaTimes, FaPhone, FaEnvelope, FaMapMarkerAlt, FaBriefcase, FaLanguage, FaShieldAlt, FaCheck } from 'react-icons/fa';

const AgentDetailPopup = ({ onClose }) => {
  const selectedAgent = useSelector(state => state.Agents?.selectedAgent);

  if (!selectedAgent) {
    return null;
  }

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content agent-detail-popup" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h3>Agent Details</h3>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="agent-detail-content">
          {/* Agent Header */}
          <div className="agent-header-section">
            <div className="agent-avatar-large">
              {selectedAgent.profilePicture || selectedAgent.profile_img ? (
                <img src={selectedAgent.profilePicture || selectedAgent.profile_img} alt={selectedAgent.firstName} />
              ) : (
                <span>{selectedAgent.firstName?.charAt(0)}{selectedAgent.lastName?.charAt(0)}</span>
              )}
            </div>
            <div className="agent-header-info">
              <div className="agent-name-section">
                <h2>{selectedAgent.firstName} {selectedAgent.lastName}</h2>
                {selectedAgent.isVerified && (
                  <div className="verified-badge-large">
                    <FaCheck /> Verified Agent
                  </div>
                )}
              </div>
              <p className="agent-location">
                <FaMapMarkerAlt /> {selectedAgent.region || selectedAgent.address?.state || 'Location not specified'}
              </p>
            </div>
          </div>

          {/* Agent Details */}
          <div className="agent-details-grid">
            <div className="detail-card">
              <FaBriefcase className="detail-icon" />
              <div>
                <h4>Experience</h4>
                <p>{selectedAgent.experience || 0} years</p>
              </div>
            </div>

            <div className="detail-card">
              <FaPhone className="detail-icon" />
              <div>
                <h4>Phone</h4>
                <p>{selectedAgent.phone || 'Not available'}</p>
              </div>
            </div>

            <div className="detail-card">
              <FaEnvelope className="detail-icon" />
              <div>
                <h4>Email</h4>
                <p>{selectedAgent.email || 'Not available'}</p>
              </div>
            </div>

            {selectedAgent.agency && (
              <div className="detail-card">
                <FaBriefcase className="detail-icon" />
                <div>
                  <h4>Agency</h4>
                  <p>{selectedAgent.agency}</p>
                </div>
              </div>
            )}
          </div>

          {/* Specialties */}
          {selectedAgent.specialties && selectedAgent.specialties.length > 0 && (
            <div className="specialties-section">
              <h4>Specialties</h4>
              <div className="tags-container">
                {selectedAgent.specialties.map((specialty, index) => (
                  <span key={index} className="specialty-tag">{specialty}</span>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {selectedAgent.languagesSpoken && selectedAgent.languagesSpoken.length > 0 && (
            <div className="languages-section">
              <h4><FaLanguage /> Languages Spoken</h4>
              <div className="tags-container">
                {selectedAgent.languagesSpoken.map((language, index) => (
                  <span key={index} className="language-tag">{language}</span>
                ))}
              </div>
            </div>
          )}

          {/* About */}
          {selectedAgent.about && (
            <div className="about-section">
              <h4>About</h4>
              <p>{selectedAgent.about}</p>
            </div>
          )}

          {/* License Info */}
          {selectedAgent.licenseNumber && (
            <div className="license-section">
              <h4>License Information</h4>
              <p><strong>License Number:</strong> {selectedAgent.licenseNumber}</p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .popup-content {
          background: white;
          border-radius: 12px;
          max-width: 600px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .agent-detail-popup {
          padding: 0;
        }

        .popup-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border-bottom: 1px solid #e2e8f0;
        }

        .popup-header h3 {
          margin: 0;
          font-size: 20px;
          font-weight: 600;
          color: #1e293b;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 18px;
          color: #64748b;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: all 0.2s ease;
        }

        .close-btn:hover {
          background: #f1f5f9;
          color: #1e293b;
        }

        .agent-detail-content {
          padding: 24px;
        }

        .agent-header-section {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 24px;
          padding-bottom: 24px;
          border-bottom: 1px solid #e2e8f0;
        }

        .agent-avatar-large {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: #667eea;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 24px;
          overflow: hidden;
          flex-shrink: 0;
        }

        .agent-avatar-large img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .agent-header-info {
          flex: 1;
        }

        .agent-name-section {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 8px;
        }

        .agent-name-section h2 {
          margin: 0;
          font-size: 24px;
          font-weight: 600;
          color: #1e293b;
        }

        .verified-badge-large {
          display: flex;
          align-items: center;
          gap: 4px;
          background: #10b981;
          color: white;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
        }

        .agent-location {
          margin: 0;
          color: #64748b;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .agent-details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .detail-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: #f8fafc;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }

        .detail-icon {
          color: #667eea;
          font-size: 18px;
          flex-shrink: 0;
        }

        .detail-card h4 {
          margin: 0 0 4px 0;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
        }

        .detail-card p {
          margin: 0;
          font-size: 14px;
          color: #1e293b;
        }

        .specialties-section,
        .languages-section,
        .about-section,
        .license-section {
          margin-bottom: 24px;
        }

        .specialties-section h4,
        .languages-section h4,
        .about-section h4,
        .license-section h4 {
          margin: 0 0 12px 0;
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .tags-container {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .specialty-tag,
        .language-tag {
          background: #667eea;
          color: white;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
        }

        .language-tag {
          background: #10b981;
        }

        .about-section p {
          margin: 0;
          line-height: 1.6;
          color: #374151;
        }

        .license-section p {
          margin: 0;
          color: #374151;
        }

        @media (max-width: 768px) {
          .agent-header-section {
            flex-direction: column;
            text-align: center;
          }

          .agent-details-grid {
            grid-template-columns: 1fr;
          }

          .popup-content {
            margin: 20px;
            max-width: calc(100vw - 40px);
          }
        }
      `}</style>
    </div>
  );
};

export default AgentDetailPopup;
