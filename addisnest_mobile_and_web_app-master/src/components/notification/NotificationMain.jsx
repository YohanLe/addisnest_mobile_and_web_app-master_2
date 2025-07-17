import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import Api from "../../Apis/Api";
import { toast } from "react-toastify";
import NotificationList from "./NotificationList";

/**
 * NotificationMain Component
 * Main component for notification management with comprehensive filtering and interaction capabilities
 */
const NotificationMain = ({
  showHeader = true,
  showFilters = true,
  showActions = true,
  maxItems = null,
  onNotificationClick = null,
  onMarkAllRead = null
}) => {
  // Get user details from Redux store
  const { userDetails } = useSelector((state) => state.auth);
  
  // State for notifications
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  
  // Load notifications on component mount
  useEffect(() => {
    if (userDetails) {
      loadNotifications();
    }
  }, [userDetails, page]);

  // Filter notifications when filter changes
  useEffect(() => {
    filterNotifications();
  }, [activeFilter, notifications]);

  // Load notifications from API
  const loadNotifications = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, this would be an API call
      // const response = await Api.get("/notifications", { params: { page, limit: 20 } });
      
      // For demo purposes, we'll use mock data
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      
      const mockNotifications = generateMockNotifications(page);
      
      if (page === 1) {
        setNotifications(mockNotifications);
      } else {
        setNotifications(prev => [...prev, ...mockNotifications]);
      }
      
      // Check if there are more notifications to load
      setHasMore(mockNotifications.length === 20);
    } catch (error) {
      console.error("Error loading notifications:", error);
      toast.error("Failed to load notifications. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Generate mock notifications for demo purposes
  const generateMockNotifications = (page) => {
    const startIndex = (page - 1) * 20;
    const count = page < 3 ? 20 : (page === 3 ? 10 : 0); // Only 50 mock notifications total
    
    return Array.from({ length: count }, (_, i) => {
      const index = startIndex + i;
      const types = ["message", "property", "offer", "system"];
      const type = types[index % types.length];
      
      return {
        id: `notif-${index}`,
        type,
        title: getNotificationTitle(type, index),
        message: getNotificationMessage(type, index),
        createdAt: new Date(Date.now() - (index * 3600000)).toISOString(),
        isRead: index % 3 === 0,
        actionUrl: getActionUrl(type, index),
        sender: type === "message" ? {
          id: `user-${index % 5}`,
          name: `User ${index % 5}`,
          avatar: null
        } : null,
        metadata: {
          propertyId: type === "property" ? `prop-${index}` : null,
          offerId: type === "offer" ? `offer-${index}` : null
        }
      };
    });
  };

  // Helper functions for generating mock data
  const getNotificationTitle = (type, index) => {
    switch (type) {
      case "message":
        return "New Message";
      case "property":
        return "Property Update";
      case "offer":
        return "Offer Status Changed";
      case "system":
        return "System Notification";
      default:
        return "Notification";
    }
  };

  const getNotificationMessage = (type, index) => {
    switch (type) {
      case "message":
        return `You have received a new message from User ${index % 5}.`;
      case "property":
        return `There's an update to property listing #${index}.`;
      case "offer":
        return `Your offer status has changed to ${index % 2 === 0 ? "accepted" : "pending"}.`;
      case "system":
        return `System maintenance scheduled for ${new Date(Date.now() + 86400000).toLocaleDateString()}.`;
      default:
        return "You have a new notification.";
    }
  };

  const getActionUrl = (type, index) => {
    switch (type) {
      case "message":
        return `/messages/${index % 5}`;
      case "property":
        return `/properties/${index}`;
      case "offer":
        return `/offers/${index}`;
      case "system":
        return null;
      default:
        return null;
    }
  };

  // Apply filters to notifications
  const filterNotifications = () => {
    let filtered = [...notifications];
    
    switch (activeFilter) {
      case "unread":
        filtered = filtered.filter(notif => !notif.isRead);
        break;
      case "read":
        filtered = filtered.filter(notif => notif.isRead);
        break;
      case "message":
      case "property":
      case "offer":
      case "system":
        filtered = filtered.filter(notif => notif.type === activeFilter);
        break;
      default:
        // "all" filter, no filtering needed
        break;
    }
    
    // Apply max items limit if provided
    if (maxItems && filtered.length > maxItems) {
      filtered = filtered.slice(0, maxItems);
    }
    
    setFilteredNotifications(filtered);
  };

  // Handle filter changes
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  // Handle notification click
  const handleNotificationClick = (notification) => {
    // Mark as read in state
    setNotifications(prevNotifications => 
      prevNotifications.map(notif => 
        notif.id === notification.id 
          ? { ...notif, isRead: true } 
          : notif
      )
    );
    
    // In a real implementation, we would call an API to mark as read
    // Api.post(`/notifications/${notification.id}/read`);
    
    // Call callback if provided
    if (onNotificationClick) {
      onNotificationClick(notification);
    }
    
    // Navigate to action URL if available
    if (notification.actionUrl) {
      // In a real implementation, we would use navigation
      console.log(`Navigate to: ${notification.actionUrl}`);
    }
  };

  // Handle mark all as read
  const handleMarkAllRead = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, this would be an API call
      // await Api.post("/notifications/mark-all-read");
      
      // For demo purposes, we'll just update the state
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      
      setNotifications(prevNotifications => 
        prevNotifications.map(notif => ({ ...notif, isRead: true }))
      );
      
      toast.success("All notifications marked as read");
      
      // Call callback if provided
      if (onMarkAllRead) {
        onMarkAllRead();
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      toast.error("Failed to mark all notifications as read. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Load more notifications
  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  };

  return (
    <div className="notification-main">
      {showHeader && (
        <div className="notification-header">
          <h2 className="notification-title">Notifications</h2>
          {showActions && (
            <button 
              className="mark-all-read-button"
              onClick={handleMarkAllRead}
              disabled={isLoading || notifications.every(n => n.isRead)}
            >
              Mark All as Read
            </button>
          )}
        </div>
      )}
      
      {showFilters && (
        <div className="notification-filters">
          <button 
            className={`filter-button ${activeFilter === "all" ? "active" : ""}`}
            onClick={() => handleFilterChange("all")}
          >
            All
          </button>
          <button 
            className={`filter-button ${activeFilter === "unread" ? "active" : ""}`}
            onClick={() => handleFilterChange("unread")}
          >
            Unread
          </button>
          <button 
            className={`filter-button ${activeFilter === "message" ? "active" : ""}`}
            onClick={() => handleFilterChange("message")}
          >
            Messages
          </button>
          <button 
            className={`filter-button ${activeFilter === "property" ? "active" : ""}`}
            onClick={() => handleFilterChange("property")}
          >
            Properties
          </button>
          <button 
            className={`filter-button ${activeFilter === "offer" ? "active" : ""}`}
            onClick={() => handleFilterChange("offer")}
          >
            Offers
          </button>
          <button 
            className={`filter-button ${activeFilter === "system" ? "active" : ""}`}
            onClick={() => handleFilterChange("system")}
          >
            System
          </button>
        </div>
      )}
      
      <NotificationList 
        notifications={filteredNotifications}
        isLoading={isLoading}
        hasMore={hasMore && (!maxItems || notifications.length < maxItems)}
        onNotificationClick={handleNotificationClick}
        onLoadMore={handleLoadMore}
      />
      
      {filteredNotifications.length === 0 && !isLoading && (
        <div className="empty-state">
          <p>No notifications found.</p>
        </div>
      )}
    </div>
  );
};

NotificationMain.propTypes = {
  showHeader: PropTypes.bool,
  showFilters: PropTypes.bool,
  showActions: PropTypes.bool,
  maxItems: PropTypes.number,
  onNotificationClick: PropTypes.func,
  onMarkAllRead: PropTypes.func
};

export default NotificationMain;
