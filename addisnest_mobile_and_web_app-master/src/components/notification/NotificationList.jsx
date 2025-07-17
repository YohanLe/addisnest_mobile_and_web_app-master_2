import React from "react";
import PropTypes from "prop-types";
import NotificationItem from "./NotificationItem";

/**
 * NotificationList Component
 * Displays a list of notifications with infinite scrolling support
 */
const NotificationList = ({
  notifications,
  isLoading,
  hasMore,
  onNotificationClick,
  onLoadMore
}) => {
  // Handle scroll event for infinite loading
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    
    // If we're near the bottom and we have more items to load
    if (scrollHeight - scrollTop <= clientHeight * 1.5 && hasMore && !isLoading) {
      onLoadMore();
    }
  };

  return (
    <div className="notification-list-container" onScroll={handleScroll}>
      <div className="notification-list">
        {notifications.map(notification => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onClick={() => onNotificationClick(notification)}
          />
        ))}
        
        {isLoading && (
          <div className="loading-indicator">
            <div className="spinner"></div>
            <p>Loading notifications...</p>
          </div>
        )}
        
        {!isLoading && notifications.length === 0 && (
          <div className="empty-state">
            <p>No notifications available.</p>
          </div>
        )}
        
        {!isLoading && !hasMore && notifications.length > 0 && (
          <div className="end-of-list">
            <p>You've reached the end of your notifications.</p>
          </div>
        )}
      </div>
    </div>
  );
};

NotificationList.propTypes = {
  notifications: PropTypes.arrayOf(
    PropTypes.shape({
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
    })
  ).isRequired,
  isLoading: PropTypes.bool.isRequired,
  hasMore: PropTypes.bool.isRequired,
  onNotificationClick: PropTypes.func.isRequired,
  onLoadMore: PropTypes.func.isRequired
};

export default NotificationList;
