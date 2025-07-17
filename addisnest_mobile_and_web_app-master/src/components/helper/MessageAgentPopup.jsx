import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { FaTimes, FaEnvelope } from 'react-icons/fa';
import './MessageAgentPopup.css';

const MessageAgentPopup = ({ onClose }) => {
  const agent = useSelector(state => state.Agents?.selectedAgent) || {
    id: 1,
    name: 'Samuel Tesfaye',
    region: 'Addis Ababa',
    email: 'samuel.tesfaye@example.com',
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: "I'm interested in this property and would like to know more about...",
    agreeToContact: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prevErrors => {
        const newErrors = {...prevErrors};
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    
    if (!formData.agreeToContact) {
      newErrors.agreeToContact = 'You must agree to be contacted';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      // In a real app, this would send the message to the backend
      setTimeout(() => {
        setIsSubmitting(false);
        alert(`Message sent to ${agent.name}!`);
        onClose();
      }, 1000);
    }
  };

  return (
    <div className="message-agent-popup-main">
      <div className="message-agent-backdrop" onClick={onClose}></div>
      <div className="message-agent-popup">
        <div className="message-agent-popup-inner">
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>

          <div className="message-agent-header">
            <h3>Message the Agent</h3>
            <p>Have questions about this property?</p>
          </div>

          <form onSubmit={handleSubmit} className="message-agent-form">
            <div className="form-group">
              <input
                type="text"
                name="name"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>
            
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Your email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
            
            <div className="form-group">
              <textarea
                name="message"
                placeholder="I'm interested in this property and would like to know more about..."
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className={errors.message ? 'error' : ''}
              ></textarea>
              {errors.message && <span className="error-message">{errors.message}</span>}
            </div>
            
            <div className="form-group checkbox-group">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  name="agreeToContact"
                  checked={formData.agreeToContact}
                  onChange={handleChange}
                />
                <span className="checkmark"></span>
                <span className="checkbox-text">
                  I agree to be contacted by Addisnest regarding this property and other relevant services.
                </span>
              </label>
              {errors.agreeToContact && <span className="error-message">{errors.agreeToContact}</span>}
            </div>
            
            <button 
              type="submit" 
              className="send-message-btn"
              disabled={isSubmitting}
            >
              <FaEnvelope /> {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MessageAgentPopup;
