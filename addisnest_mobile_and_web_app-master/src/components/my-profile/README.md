# My Profile Component

A comprehensive user profile management component with customizable sections, form validation, and interactive UI.

## Features

- **Complete Profile Management**: Edit personal information, contact details, address, and more
- **Avatar Upload**: Supports profile picture uploads with preview functionality
- **Form Validation**: Built-in validation for all input fields with error messaging
- **Notification Preferences**: Manage email, SMS, and in-app notification settings
- **Configurable Sections**: Show or hide different profile sections based on needs
- **Responsive Design**: Works across all screen sizes and devices
- **Callback Integration**: Easy integration with application state management

## Usage

### Basic Usage

```jsx
import React from 'react';
import { ProfileMain } from './components/my-profile';

function MyComponent() {
  return (
    <div>
      <h2>My Profile</h2>
      <ProfileMain />
    </div>
  );
}
```

### With Custom Configuration

```jsx
import React from 'react';
import { ProfileMain } from './components/my-profile';

function CustomProfilePage() {
  const handleProfileUpdate = (profileData) => {
    console.log("Profile updated:", profileData);
    // Save to database or perform additional actions
  };

  return (
    <div>
      <h2>Update Your Contact Information</h2>
      <ProfileMain 
        showAvatar={true}
        showContactInfo={true}
        showPersonalInfo={false}
        showAddressInfo={false}
        showNotificationSettings={false}
        onProfileUpdate={handleProfileUpdate}
      />
    </div>
  );
}
```

## Component Props

| Prop                     | Type       | Default | Description                                      |
|--------------------------|------------|---------|--------------------------------------------------|
| `showAvatar`             | Boolean    | true    | Show the avatar/profile picture section          |
| `showContactInfo`        | Boolean    | true    | Show email and phone number fields               |
| `showPersonalInfo`       | Boolean    | true    | Show name and bio fields                         |
| `showAddressInfo`        | Boolean    | true    | Show address, city, state, and country fields    |
| `showNotificationSettings` | Boolean  | true    | Show notification preferences toggles            |
| `onProfileUpdate`        | Function   | null    | Callback function that receives updated profile data |

## Profile Data Structure

The component handles a profile data structure with the following properties:

```javascript
{
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phone: "555-123-4567",
  address: "123 Main St",
  city: "Anytown",
  state: "CA",
  zipCode: "12345",
  country: "USA",
  profilePicture: File, // The actual file object when uploading
  bio: "Real estate enthusiast looking for the perfect home.",
  notificationPreferences: {
    email: true,
    sms: false,
    app: true
  }
}
```

## Demo Component

The package includes a demo component that showcases the profile component with configuration options:

```jsx
import { ProfileDemo } from './components/my-profile';

function App() {
  return (
    <div>
      <h1>My Profile Demo</h1>
      <ProfileDemo />
    </div>
  );
}
```

Visit `/profile-demo` route to see the demo in action.

## Implementation Details

The profile component is built with React and leverages hooks for state management. It's designed to be:

1. **Modular**: Each section can be independently shown/hidden
2. **Reusable**: Works in various contexts from settings pages to onboarding flows
3. **Adaptable**: Easily styled to match your application's theme
4. **Well-documented**: Comprehensive prop types and documentation

### Key Files

- `ProfileMain.jsx`: Main container component with API integration
- `ProfileForm.jsx`: Form UI component with all input fields and validation
- `ProfileDemo.jsx`: Demo component showcasing usage and configuration
- `index.js`: Entry point for easy imports

### Integration Tips

- Connect the `onProfileUpdate` callback to your state management solution (Redux, Context API, etc.)
- If you need to upload profile pictures to a server, modify the `handleProfilePictureChange` function in ProfileMain
- For authentication integration, utilize the Redux auth state that the component already connects to

## Customization

The component can be styled by targeting its CSS classes:

- `.profile-main`: The main container
- `.profile-container`: The form container
- `.profile-title`: The title element
- `.profile-form`: The form element
- `.form-section`: Individual sections of the form
- `.avatar-section`: The avatar upload section
- `.profile-avatar`: The avatar image
- `.form-group`: Input groups
- `.form-actions`: The buttons container
- `.save-button`: The save button
- `.cancel-button`: The cancel button
