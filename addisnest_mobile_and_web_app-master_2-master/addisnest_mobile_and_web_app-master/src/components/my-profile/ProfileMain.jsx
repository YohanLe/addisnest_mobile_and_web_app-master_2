import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import Api from "../../Apis/Api";
import { toast } from "react-toastify";
import ProfileForm from "./ProfileForm";

/**
 * ProfileMain Component
 * Main component for user profile management with comprehensive profile editing capabilities
 */
const ProfileMain = ({
  showAvatar = true,
  showContactInfo = true,
  showPersonalInfo = true,
  showAddressInfo = true,
  showNotificationSettings = true,
  onProfileUpdate = null
}) => {
  // Get user details from Redux store
  const { userDetails } = useSelector((state) => state.auth);
  
  // State for user profile data
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    profilePicture: "",
    bio: "",
    notificationPreferences: {
      email: true,
      sms: false,
      app: true
    }
  });
  
  // State for form submission and UI
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  
  // Load user profile data on component mount
  useEffect(() => {
    if (userDetails) {
      loadUserProfile();
    }
  }, [userDetails]);

  // Load user profile data from API
  const loadUserProfile = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, this would be an API call
      // const response = await Api.get("/users/profile");
      
      // For demo purposes, we'll use the userDetails directly or mock data
      const userData = userDetails || {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        phone: "555-123-4567",
        address: "123 Main St",
        city: "Anytown",
        state: "CA",
        zipCode: "12345",
        country: "USA",
        profilePicture: "",
        bio: "Real estate enthusiast looking for the perfect home.",
        notificationPreferences: {
          email: true,
          sms: false,
          app: true
        }
      };
      
      setProfileData(userData);
      if (userData.profilePicture) {
        setImagePreview(userData.profilePicture);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      toast.error("Failed to load profile data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle profile form field changes
  const handleInputChange = (field, value) => {
    setProfileData(prevData => ({
      ...prevData,
      [field]: value
    }));
    
    // Clear error for this field if exists
    if (formErrors[field]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Handle notification preference changes
  const handleNotificationChange = (channel, enabled) => {
    setProfileData(prevData => ({
      ...prevData,
      notificationPreferences: {
        ...prevData.notificationPreferences,
        [channel]: enabled
      }
    }));
  };

  // Handle profile picture upload
  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setProfileData(prev => ({
          ...prev,
          profilePicture: file // In a real app, you'd upload this to a server
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Validate form data
  const validateForm = () => {
    const errors = {};
    
    if (showPersonalInfo) {
      if (!profileData.firstName) errors.firstName = "First name is required";
      if (!profileData.lastName) errors.lastName = "Last name is required";
    }
    
    if (showContactInfo) {
      if (!profileData.email) {
        errors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
        errors.email = "Email is invalid";
      }
      
      if (profileData.phone && !/^\+?[0-9()-\s]{10,15}$/.test(profileData.phone)) {
        errors.phone = "Phone number is invalid";
      }
    }
    
    if (showAddressInfo) {
      if (!profileData.city) errors.city = "City is required";
      if (!profileData.country) errors.country = "Country is required";
      if (profileData.zipCode && !/^[0-9-]{5,10}$/.test(profileData.zipCode)) {
        errors.zipCode = "Zip code is invalid";
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please correct the errors in the form");
      return;
    }
    
    setIsLoading(true);
    try {
      // In a real implementation, this would be an API call
      // const response = await Api.put("/users/profile", profileData);
      
      // For demo purposes, we'll simulate an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Profile updated successfully");
      
      // Call the callback if provided
      if (onProfileUpdate) {
        onProfileUpdate(profileData);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="profile-main">
      <div className="profile-container">
        <h2 className="profile-title">My Profile</h2>
        <div className="profile-description">
          Manage your personal information and account preferences
        </div>
        
        <ProfileForm
          profileData={profileData}
          imagePreview={imagePreview}
          isLoading={isLoading}
          formErrors={formErrors}
          showAvatar={showAvatar}
          showContactInfo={showContactInfo}
          showPersonalInfo={showPersonalInfo}
          showAddressInfo={showAddressInfo}
          showNotificationSettings={showNotificationSettings}
          onInputChange={handleInputChange}
          onNotificationChange={handleNotificationChange}
          onProfilePictureChange={handleProfilePictureChange}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

ProfileMain.propTypes = {
  showAvatar: PropTypes.bool,
  showContactInfo: PropTypes.bool,
  showPersonalInfo: PropTypes.bool,
  showAddressInfo: PropTypes.bool,
  showNotificationSettings: PropTypes.bool,
  onProfileUpdate: PropTypes.func
};

export default ProfileMain;
