import React, { useState } from "react";
import NotificationMain from "./NotificationMain";
import "../../../assets/css/notification.css";

/**
 * NotificationDemo Component
 * 
 * This is a demonstration component showing how to use the Notification system.
 * It allows toggling different options to see how the component behaves.
 */
const NotificationDemo = () => {
  // State for configuring the notification component
  const [showHeader, setShowHeader] = useState(true);
  const [showFilters, setShowFilters] = useState(true);
  const [showActions, setShowActions] = useState(true);
  const [maxItems, setMaxItems] = useState(null);
  
  // Handler for notification clicks
  const handleNotificationClick = (notification) => {
    console.log("Notification clicked:", notification);
    alert(`Clicked on notification: ${notification.title}`);
  };

  // Handler for mark all as read action
  const handleMarkAllRead = () => {
    console.log("All notifications marked as read");
  };

  // Handler for max items change
  const handleMaxItemsChange = (e) => {
    const value = e.target.value;
    setMaxItems(value === "" ? null : Number(value));
  };

  return (
    <div className="notification-demo-container">
      <div className="notification-demo-header">
        <h1>Notification System Demo</h1>
        <p>This demo shows the notification system with various configuration options.</p>
      </div>
      
      <div className="notification-demo-controls">
        <div className="control-group">
          <label>
            <input 
              type="checkbox" 
              checked={showHeader} 
              onChange={() => setShowHeader(!showHeader)} 
            />
            Show Header
          </label>
        </div>
        
        <div className="control-group">
          <label>
            <input 
              type="checkbox" 
              checked={showFilters} 
              onChange={() => setShowFilters(!showFilters)} 
            />
            Show Filters
          </label>
        </div>
        
        <div className="control-group">
          <label>
            <input 
              type="checkbox" 
              checked={showActions} 
              onChange={() => setShowActions(!showActions)} 
            />
            Show Actions
          </label>
        </div>
        
        <div className="control-group">
          <label>
            Max Items:
            <input 
              type="number" 
              value={maxItems || ""} 
              onChange={handleMaxItemsChange} 
              placeholder="No limit"
              min="1"
            />
          </label>
        </div>
      </div>
      
      <div className="notification-demo-component">
        <NotificationMain 
          showHeader={showHeader}
          showFilters={showFilters}
          showActions={showActions}
          maxItems={maxItems}
          onNotificationClick={handleNotificationClick}
          onMarkAllRead={handleMarkAllRead}
        />
      </div>
      
      <div className="notification-demo-code">
        <h3>Usage Example:</h3>
        <pre>
{`import { NotificationMain } from '../components/notification';
import '../assets/css/notification.css';

// In your component:
<NotificationMain 
  showHeader={${showHeader}}
  showFilters={${showFilters}}
  showActions={${showActions}}
  ${maxItems !== null ? `maxItems={${maxItems}}` : '// maxItems={null}'}
  onNotificationClick={(notification) => {
    console.log("Notification clicked:", notification);
    // Handle notification click, e.g., navigate to relevant page
  }}
  onMarkAllRead={() => {
    console.log("All notifications marked as read");
    // Update your state or perform additional actions
  }}
/>`}
        </pre>
      </div>
      
      <div className="notification-demo-footer">
        <h3>Component Features:</h3>
        <ul>
          <li>Real-time notification updates</li>
          <li>Filter notifications by type or read status</li>
          <li>Mark individual or all notifications as read</li>
          <li>Responsive design for all device sizes</li>
          <li>Infinite scrolling for pagination</li>
          <li>Configurable interface elements</li>
          <li>Callback support for custom notification actions</li>
        </ul>
      </div>
    </div>
  );
};

export default NotificationDemo;
