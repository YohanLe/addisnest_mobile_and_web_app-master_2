import React from "react";
import PropTypes from "prop-types";
import { formatDistanceToNow } from "date-fns";

/**
 * NotificationItem Component
 * Renders an individual notification with appropriate styling based on its type and read status
 */
const NotificationItem = ({ notification, onClick }) => {
  const {
    type,
    title,
    message,
    createdAt,
    isRead,
    sender
  } = notification;

  // Format the notification time
  const formatTime = (timestamp) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "some time ago";
    }
  };

  // Get icon based on notification type
  const getTypeIcon = (type) => {
    switch (type) {
      case "message":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="notification-icon message-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        );
      case "property":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="notification-icon property-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
        );
      case "offer":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="notification-icon offer-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
          </svg>
        );
      case "system":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="notification-icon system-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="notification-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
        );
    }
  };

  return (
    <div 
      className={`notification-item ${isRead ? 'read' : 'unread'} ${type}`}
      onClick={onClick}
    >
      <div className="notification-icon-container">
        {getTypeIcon(type)}
        {!isRead && <span className="unread-indicator"></span>}
      </div>
      
      <div className="notification-content">
        <div className="notification-header">
          <h3 className="notification-title">{title}</h3>
          <span className="notification-time">{formatTime(createdAt)}</span>
        </div>
        
        {sender && (
          <div className="notification-sender">
            {sender.avatar ? (
              <img 
                src={sender.avatar} 
                alt={`${sender.name}'s avatar`} 
                className="sender-avatar"
              />
            ) : (
              <div className="sender-avatar-placeholder">
                {sender.name.charAt(0)}
              </div>
            )}
            <span className="sender-name">{sender.name}</span>
          </div>
        )}
        
        <p className="notification-message">{message}</p>
      </div>
    </div>
  );
};

NotificationItem.propTypes = {
  notification: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    isRead: PropTypes.bool.isRequired,
    actionUrl: PropTypes.string,
    sender: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      avatar: PropTypes.string
    }),
    metadata: PropTypes.object
  }).isRequired,
  onClick: PropTypes.func.isRequired
};

export default NotificationItem;
