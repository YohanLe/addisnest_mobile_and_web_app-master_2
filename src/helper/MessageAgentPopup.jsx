import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { FaTimes, FaEnvelope, FaSpinner } from 'react-icons/fa';
import Api from '../Apis/Api';

const MessageAgentPopup = ({ onClose, agent }) => {
  // Use agent prop if provided, otherwise fall back to Redux state
  const selectedAgentFromRedux = useSelector(state => state.Agents?.selectedAgent);
  const selectedAgent = agent || selectedAgentFromRedux;
  
  // Debug logging
  console.log('Agent prop:', agent);
  console.log('Selected agent from Redux:', selectedAgentFromRedux);
  console.log('Final selected agent:', selectedAgent);
  console.log('Agent email:', selectedAgent?.email);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: 'I\'m interested in working with you as my real estate agent and would like to know more about your services...',
    agreeToContact: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      setError('Please fill in all required fields');
      return;
    }

    if (!formData.agreeToContact) {
      setError('Please agree to be contacted to proceed');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Validate agent email before sending
      if (!selectedAgent?.email) {
        setError('Agent email not found. Please try again.');
        setIsLoading(false);
        return;
      }

      const messageData = {
        agentId: selectedAgent?._id,
        agentEmail: selectedAgent?.email,
        agentName: `${selectedAgent?.firstName} ${selectedAgent?.lastName}`,
        senderName: formData.name,
        senderEmail: formData.email,
        message: formData.message,
        subject: `New inquiry from ${formData.name}`,
        type: 'agent_contact'
      };

      console.log('Sending message data:', messageData);
      console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL);
      
      // Try direct fetch first to test connectivity
      try {
        const directResponse = await fetch('/api/messages/send-to-agent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(messageData)
        });
        
        console.log('Direct fetch response status:', directResponse.status);
        const directData = await directResponse.json();
        console.log('Direct fetch response data:', directData);
        
        if (directData.success) {
          setIsSuccess(true);
          setTimeout(() => {
            onClose();
          }, 2000);
          return;
        }
      } catch (directError) {
        console.error('Direct fetch failed:', directError);
      }
      
      // Fallback to Api.post
      const response = await Api.post('messages/send-to-agent', messageData);
      
      console.log('API Response:', response);
      console.log('Response data:', response.data);
      
      if (response.data && response.data.success) {
        setIsSuccess(true);
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setError(response.data?.message || response.data?.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      setError(error.response?.data?.message || error.message || 'Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="popup-overlay" onClick={onClose}>
        <div className="popup-content success-popup" onClick={(e) => e.stopPropagation()}>
          <div className="success-icon">
            <FaEnvelope />
          </div>
          <h3>Message Sent Successfully!</h3>
          <p>Your message has been sent to {selectedAgent?.firstName} {selectedAgent?.lastName}. They will contact you soon.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content message-agent-popup" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h3>Message the Agent</h3>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="agent-info-header">
          <div className="agent-avatar">
            {selectedAgent?.profilePicture || selectedAgent?.profile_img ? (
              <img src={selectedAgent.profilePicture || selectedAgent.profile_img} alt={selectedAgent.firstName} />
            ) : (
              <span>{selectedAgent?.firstName?.charAt(0)}{selectedAgent?.lastName?.charAt(0)}</span>
            )}
          </div>
          <div>
            <h4>{selectedAgent?.firstName} {selectedAgent?.lastName}</h4>
            <p>{selectedAgent?.region || selectedAgent?.address?.state}</p>
          </div>
        </div>

        <p className="popup-subtitle">Send a message to connect with this agent</p>

        <form onSubmit={handleSubmit} className="message-form">
          <div className="form-group">
            <input
              type="text"
              name="name"
              placeholder="Your name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Your email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <textarea
              name="message"
              placeholder="Your message"
              value={formData.message}
              onChange={handleInputChange}
              rows="4"
              required
            />
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="agreeToContact"
                checked={formData.agreeToContact}
                onChange={handleInputChange}
              />
              <span className="checkmark"></span>
              I agree to be contacted by Addisnest regarding this property and other relevant services.
            </label>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="send-btn" disabled={isLoading}>
            {isLoading ? (
              <>
                <FaSpinner className="spinner" />
                Sending...
              </>
            ) : (
              <>
                <FaEnvelope />
                Send Message
              </>
            )}
          </button>
        </form>
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
          max-width: 500px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .message-agent-popup {
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

        .agent-info-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 20px 24px 0;
        }

        .agent-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #667eea;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 16px;
          overflow: hidden;
        }

        .agent-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .agent-info-header h4 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
        }

        .agent-info-header p {
          margin: 4px 0 0;
          font-size: 14px;
          color: #64748b;
        }

        .popup-subtitle {
          padding: 8px 24px 20px;
          margin: 0;
          color: #64748b;
          font-size: 14px;
        }

        .message-form {
          padding: 0 24px 24px;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 14px;
          color: #1e293b;
          background: #f8fafc;
          transition: all 0.3s ease;
          box-sizing: border-box;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #667eea;
          background: white;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .form-group textarea {
          resize: vertical;
          min-height: 100px;
        }

        .checkbox-group {
          margin: 20px 0;
        }

        .checkbox-label {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          cursor: pointer;
          font-size: 14px;
          color: #374151;
          line-height: 1.5;
        }

        .checkbox-label input[type="checkbox"] {
          width: auto;
          margin: 0;
          accent-color: #667eea;
        }

        .error-message {
          background: #fef2f2;
          color: #dc2626;
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 14px;
          margin-bottom: 16px;
          border: 1px solid #fecaca;
        }

        .send-btn {
          width: 100%;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 14px 24px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.3s ease;
        }

        .send-btn:hover:not(:disabled) {
          background: #5a67d8;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .send-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .success-popup {
          padding: 40px 24px;
          text-align: center;
        }

        .success-icon {
          width: 64px;
          height: 64px;
          background: #10b981;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          color: white;
          font-size: 24px;
        }

        .success-popup h3 {
          margin: 0 0 12px;
          color: #1e293b;
          font-size: 20px;
          font-weight: 600;
        }

        .success-popup p {
          margin: 0;
          color: #64748b;
          line-height: 1.5;
        }

        @media (max-width: 480px) {
          .popup-content {
            margin: 20px;
            max-width: calc(100vw - 40px);
          }
          
          .popup-header,
          .agent-info-header,
          .message-form {
            padding-left: 20px;
            padding-right: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default MessageAgentPopup;
