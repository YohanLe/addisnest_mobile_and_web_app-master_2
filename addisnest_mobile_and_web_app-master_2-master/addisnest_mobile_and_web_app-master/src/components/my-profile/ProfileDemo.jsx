import React, { useState } from "react";
import ProfileMain from "./ProfileMain";

/**
 * ProfileDemo Component
 * Demonstrates how to use the ProfileMain component with various configurations
 */
const ProfileDemo = () => {
  const [profileConfig, setProfileConfig] = useState({
    showAvatar: true,
    showContactInfo: true,
    showPersonalInfo: true,
    showAddressInfo: true,
    showNotificationSettings: true
  });

  const [updatedProfile, setUpdatedProfile] = useState(null);

  // Handle profile configuration changes
  const handleConfigChange = (setting) => {
    setProfileConfig(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  // Handle profile update from ProfileMain component
  const handleProfileUpdate = (profileData) => {
    setUpdatedProfile(profileData);
  };

  return (
    <div className="profile-demo">
      <div className="demo-header">
        <h1 className="demo-title">User Profile Component</h1>
        <p className="demo-description">
          A fully interactive profile management component with customizable sections,
          form validation, and notification preferences.
        </p>
      </div>

      <div className="demo-configuration">
        <h2>Component Configuration</h2>
        <div className="config-options">
          <div className="config-option">
            <label>
              <input
                type="checkbox"
                checked={profileConfig.showAvatar}
                onChange={() => handleConfigChange("showAvatar")}
              />
              Show Avatar Section
            </label>
          </div>

          <div className="config-option">
            <label>
              <input
                type="checkbox"
                checked={profileConfig.showPersonalInfo}
                onChange={() => handleConfigChange("showPersonalInfo")}
              />
              Show Personal Information
            </label>
          </div>

          <div className="config-option">
            <label>
              <input
                type="checkbox"
                checked={profileConfig.showContactInfo}
                onChange={() => handleConfigChange("showContactInfo")}
              />
              Show Contact Information
            </label>
          </div>

          <div className="config-option">
            <label>
              <input
                type="checkbox"
                checked={profileConfig.showAddressInfo}
                onChange={() => handleConfigChange("showAddressInfo")}
              />
              Show Address Information
            </label>
          </div>

          <div className="config-option">
            <label>
              <input
                type="checkbox"
                checked={profileConfig.showNotificationSettings}
                onChange={() => handleConfigChange("showNotificationSettings")}
              />
              Show Notification Settings
            </label>
          </div>
        </div>
      </div>

      <div className="profile-container-demo">
        <ProfileMain
          showAvatar={profileConfig.showAvatar}
          showContactInfo={profileConfig.showContactInfo}
          showPersonalInfo={profileConfig.showPersonalInfo}
          showAddressInfo={profileConfig.showAddressInfo}
          showNotificationSettings={profileConfig.showNotificationSettings}
          onProfileUpdate={handleProfileUpdate}
        />
      </div>

      {updatedProfile && (
        <div className="profile-update-results">
          <h2>Profile Update Results</h2>
          <p className="api-description">
            When using this component in your application, you can access the updated profile 
            data through the <code>onProfileUpdate</code> callback prop.
            Below is the data structure you would receive:
          </p>
          <div className="api-code">
            <pre>
              {JSON.stringify(updatedProfile, null, 2)}
            </pre>
          </div>
        </div>
      )}

      <div className="usage-examples">
        <h2>Usage Examples</h2>

        <div className="code-example">
          <h3>Basic Usage</h3>
          <pre>
{`import React from "react";
import { ProfileMain } from "./components/my-profile";

function MyProfilePage() {
  return (
    <div>
      <h2>Manage Your Profile</h2>
      <ProfileMain />
    </div>
  );
}`}
          </pre>
        </div>

        <div className="code-example">
          <h3>With Custom Configuration</h3>
          <pre>
{`import React from "react";
import { ProfileMain } from "./components/my-profile";

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
}`}
          </pre>
        </div>
      </div>

      <div className="component-features">
        <h2>Key Features</h2>
        <ul>
          <li>Comprehensive profile management with multiple sections</li>
          <li>Form validation for all inputs</li>
          <li>Profile picture upload with preview</li>
          <li>Responsive design that works on all devices</li>
          <li>Configurable sections that can be shown or hidden</li>
          <li>Notification preference management</li>
          <li>Detailed error handling and user feedback</li>
          <li>Callback function to integrate with your application's state management</li>
          <li>Clean, modern UI that can be easily styled to match your application</li>
        </ul>
      </div>
    </div>
  );
};

export default ProfileDemo;
