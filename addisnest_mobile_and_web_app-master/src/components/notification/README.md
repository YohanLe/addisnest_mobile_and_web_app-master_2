# Notification Component

A flexible and customizable notification system for React applications.

## Features

- Comprehensive notification management
- Multiple notification types: message, property, offer, system
- Filtering options
- Read/unread status tracking
- Infinite scrolling for pagination
- Responsive design
- Highly customizable interface

## Installation

This component is part of the Addisnest application. All dependencies are managed by the main project.

Required dependencies:
- React 
- date-fns (for time formatting)
- react-toastify (for toast notifications)

## Usage

```jsx
import { NotificationMain } from '../components/notification';
import '../assets/css/notification.css';

function MyComponent() {
  const handleNotificationClick = (notification) => {
    console.log("Notification clicked:", notification);
    // Handle notification click, e.g. navigate to relevant page
  };

  const handleMarkAllRead = () => {
    console.log("All notifications marked as read");
    // Update your state or perform additional actions
  };

  return (
    <NotificationMain 
      showHeader={true}
      showFilters={true}
      showActions={true}
      maxItems={null} // Set a number to limit displayed notifications
      onNotificationClick={handleNotificationClick}
      onMarkAllRead={handleMarkAllRead}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showHeader` | boolean | `true` | Shows/hides the header section with title and mark all read button |
| `showFilters` | boolean | `true` | Shows/hides the filter buttons |
| `showActions` | boolean | `true` | Shows/hides action buttons like "Mark All as Read" |
| `maxItems` | number \| null | `null` | Maximum number of notifications to display. `null` for no limit |
| `onNotificationClick` | function | `null` | Callback when a notification is clicked |
| `onMarkAllRead` | function | `null` | Callback when "Mark All as Read" is clicked |

## Component Structure

- **NotificationMain**: Main container component
- **NotificationList**: Displays the list of notifications with infinite scroll
- **NotificationItem**: Individual notification component

## Demo

A demo component is available at `NotificationDemo.jsx` which demonstrates the component with configurable options.

## Styling

The component includes a comprehensive CSS file (`src/assets/css/notification.css`) with all required styles. The styles use CSS variables for easy theming:

```css
.notification-main {
  --primary-color: #2C62F6;
  --secondary-color: #FF9900;
  --success-color: #56b68b;
  --danger-color: #dc3545;
  --warning-color: #f0ad4e;
  --info-color: #4a90e2;
  --light-color: #f8f9fa;
  --dark-color: #333;
}
```

Override these variables in your CSS to customize the colors to match your application's theme.

## Mock Data

For demonstration purposes, the component currently uses mock data. In a real implementation, you would:

1. Connect to an API endpoint to fetch real notifications
2. Implement proper pagination
3. Implement read/unread functionality with backend support

## Integration Examples

### In a Dashboard

```jsx
import { NotificationMain } from '../components/notification';

function Dashboard() {
  return (
    <div className="dashboard">
      <div className="dashboard-sidebar">
        {/* Other sidebar content */}
      </div>
      <div className="dashboard-main">
        {/* Other dashboard content */}
      </div>
      <div className="dashboard-notifications">
        <NotificationMain 
          maxItems={5} 
          showFilters={false}
        />
      </div>
    </div>
  );
}
```

### As a Dropdown

```jsx
import { useState } from 'react';
import { NotificationMain } from '../components/notification';

function HeaderWithNotifications() {
  const [showNotifications, setShowNotifications] = useState(false);
  
  return (
    <header className="app-header">
      <div className="logo">App Logo</div>
      <nav>
        {/* Navigation items */}
      </nav>
      <div className="notification-dropdown">
        <button 
          className="notification-toggle"
          onClick={() => setShowNotifications(!showNotifications)}
        >
          Notifications
        </button>
        
        {showNotifications && (
          <div className="notification-dropdown-content">
            <NotificationMain 
              maxItems={10}
              showHeader={true}
              showFilters={true}
            />
          </div>
        )}
      </div>
    </header>
  );
}
