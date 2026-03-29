import React from "react";
import PropTypes from "prop-types";

/**
 * ProfileForm Component
 * Form component for user profile editing with sections for different types of information
 */
const ProfileForm = ({
  profileData,
  imagePreview,
  isLoading,
  formErrors,
  showAvatar,
  showContactInfo,
  showPersonalInfo,
  showAddressInfo,
  showNotificationSettings,
  onInputChange,
  onNotificationChange,
  onProfilePictureChange,
  onSubmit
}) => {
  // Handle text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    onInputChange(name, value);
  };

  // Handle checkbox changes for notification preferences
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    onNotificationChange(name, checked);
  };

  return (
    <form className="profile-form" onSubmit={onSubmit}>
      {/* Avatar Section */}
      {showAvatar && (
        <div className="form-section avatar-section">
          <div className="avatar-container">
            {imagePreview ? (
              <img 
                src={imagePreview} 
                alt="Profile" 
                className="profile-avatar" 
              />
            ) : (
              <div className="avatar-placeholder">
                {profileData.firstName && profileData.lastName 
                  ? `${profileData.firstName.charAt(0)}${profileData.lastName.charAt(0)}`
                  : "User"}
              </div>
            )}
            <div className="avatar-upload">
              <label htmlFor="profile-image" className="upload-button">
                Change Photo
              </label>
              <input
                type="file"
                id="profile-image"
                accept="image/*"
                onChange={onProfilePictureChange}
                className="file-input"
              />
            </div>
          </div>
        </div>
      )}

      {/* Personal Information Section */}
      {showPersonalInfo && (
        <div className="form-section">
          <h3 className="section-title">Personal Information</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={profileData.firstName}
                onChange={handleChange}
                className={formErrors.firstName ? "input-error" : ""}
              />
              {formErrors.firstName && (
                <div className="error-message">{formErrors.firstName}</div>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={profileData.lastName}
                onChange={handleChange}
                className={formErrors.lastName ? "input-error" : ""}
              />
              {formErrors.lastName && (
                <div className="error-message">{formErrors.lastName}</div>
              )}
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={profileData.bio}
              onChange={handleChange}
              rows="4"
              placeholder="Tell us a bit about yourself"
            />
          </div>
        </div>
      )}

      {/* Contact Information Section */}
      {showContactInfo && (
        <div className="form-section">
          <h3 className="section-title">Contact Information</h3>
          
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={profileData.email}
              onChange={handleChange}
              className={formErrors.email ? "input-error" : ""}
            />
            {formErrors.email && (
              <div className="error-message">{formErrors.email}</div>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={profileData.phone}
              onChange={handleChange}
              placeholder="e.g., 555-123-4567"
              className={formErrors.phone ? "input-error" : ""}
            />
            {formErrors.phone && (
              <div className="error-message">{formErrors.phone}</div>
            )}
          </div>
        </div>
      )}

      {/* Address Information Section */}
      {showAddressInfo && (
        <div className="form-section">
          <h3 className="section-title">Address Information</h3>
          
          <div className="form-group">
            <label htmlFor="address">Street Address</label>
            <input
              type="text"
              id="address"
              name="address"
              value={profileData.address}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                name="city"
                value={profileData.city}
                onChange={handleChange}
                className={formErrors.city ? "input-error" : ""}
              />
              {formErrors.city && (
                <div className="error-message">{formErrors.city}</div>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="state">State/Province</label>
              <input
                type="text"
                id="state"
                name="state"
                value={profileData.state}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="zipCode">Zip/Postal Code</label>
              <input
                type="text"
                id="zipCode"
                name="zipCode"
                value={profileData.zipCode}
                onChange={handleChange}
                className={formErrors.zipCode ? "input-error" : ""}
              />
              {formErrors.zipCode && (
                <div className="error-message">{formErrors.zipCode}</div>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="country">Country</label>
              <input
                type="text"
                id="country"
                name="country"
                value={profileData.country}
                onChange={handleChange}
                className={formErrors.country ? "input-error" : ""}
              />
              {formErrors.country && (
                <div className="error-message">{formErrors.country}</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Notification Settings Section */}
      {showNotificationSettings && (
        <div className="form-section">
          <h3 className="section-title">Notification Preferences</h3>
          
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="email"
                checked={profileData.notificationPreferences.email}
                onChange={handleCheckboxChange}
              />
              Email Notifications
            </label>
            <span className="checkbox-description">
              Receive updates, alerts, and newsletters via email
            </span>
          </div>
          
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="sms"
                checked={profileData.notificationPreferences.sms}
                onChange={handleCheckboxChange}
              />
              SMS Notifications
            </label>
            <span className="checkbox-description">
              Receive updates and alerts via text message
            </span>
          </div>
          
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="app"
                checked={profileData.notificationPreferences.app}
                onChange={handleCheckboxChange}
              />
              In-App Notifications
            </label>
            <span className="checkbox-description">
              Receive notifications within the application
            </span>
          </div>
        </div>
      )}

      {/* Form Actions */}
      <div className="form-actions">
        <button 
          type="submit" 
          className="save-button" 
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </button>
        
        <button 
          type="button" 
          className="cancel-button"
          disabled={isLoading}
          onClick={() => window.location.reload()}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

ProfileForm.propTypes = {
  profileData: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    address: PropTypes.string,
    city: PropTypes.string,
    state: PropTypes.string,
    zipCode: PropTypes.string,
    country: PropTypes.string,
    profilePicture: PropTypes.any,
    bio: PropTypes.string,
    notificationPreferences: PropTypes.shape({
      email: PropTypes.bool,
      sms: PropTypes.bool,
      app: PropTypes.bool
    })
  }).isRequired,
  imagePreview: PropTypes.string,
  isLoading: PropTypes.bool,
  formErrors: PropTypes.object,
  showAvatar: PropTypes.bool,
  showContactInfo: PropTypes.bool,
  showPersonalInfo: PropTypes.bool,
  showAddressInfo: PropTypes.bool,
  showNotificationSettings: PropTypes.bool,
  onInputChange: PropTypes.func.isRequired,
  onNotificationChange: PropTypes.func.isRequired,
  onProfilePictureChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default ProfileForm;
