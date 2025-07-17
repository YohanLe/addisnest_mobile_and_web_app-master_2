// Validation utility functions for form validation

// Login validation
export const validateLogin = (data) => {
  const errors = {};
  
  // Email validation
  if (!data.email) {
    errors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(data.email)) {
    errors.email = "Email is invalid";
  }
  
  // Password validation
  if (!data.password) {
    errors.password = "Password is required";
  } else if (data.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Registration validation
export const validateRegister = (data) => {
  const errors = {};
  
  // Full name validation
  if (!data.fullName) {
    errors.fullName = "Full name is required";
  }
  
  // Email validation
  if (!data.email) {
    errors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(data.email)) {
    errors.email = "Email is invalid";
  }
  
  // Phone validation
  if (!data.phone) {
    errors.phone = "Phone number is required";
  }
  
  // Password validation
  if (!data.password) {
    errors.password = "Password is required";
  } else if (data.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }
  
  // Confirm password validation
  if (!data.confirmPassword) {
    errors.confirmPassword = "Confirm password is required";
  } else if (data.password !== data.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Forgot password validation
export const validateForgotPassword = (data) => {
  const errors = {};
  
  // Email validation
  if (!data.email) {
    errors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(data.email)) {
    errors.email = "Email is invalid";
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Reset password validation
export const ValidateResetpassword = (data) => {
  const errors = {};
  
  // Password validation
  if (!data.password) {
    errors.password = "New password is required";
  } else if (data.password.length < 6) {
    errors.password = "New password must be at least 6 characters";
  }
  
  // Confirm password validation
  if (!data.confirmPassword) {
    errors.confirmPassword = "Confirm password is required";
  } else if (data.password !== data.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Change password validation
export const ValidateChangePassword = (data) => {
  const errors = {};
  
  // Current password validation
  if (!data.currentPassword) {
    errors.currentPassword = "Current password is required";
  }
  
  // New password validation
  if (!data.newPassword) {
    errors.newPassword = "New password is required";
  } else if (data.newPassword.length < 6) {
    errors.newPassword = "New password must be at least 6 characters";
  }
  
  // Confirm password validation
  if (!data.confirmPassword) {
    errors.confirmPassword = "Confirm password is required";
  } else if (data.newPassword !== data.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// User profile update validation
export const ValidateUserCusProfileUpdate = (data) => {
  const errors = {};
  
  // Name validation
  if (!data.fullName) {
    errors.fullName = "Full name is required";
  }
  
  // Email validation
  if (!data.email) {
    errors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(data.email)) {
    errors.email = "Email is invalid";
  }
  
  // Phone validation
  if (!data.phone) {
    errors.phone = "Phone number is required";
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Property form validation
export const ValidatePropertyForm = (data) => {
  const errors = {};
  
  // Regional state validation
  if (!data.regional_state) {
    errors.regional_state = "Regional state is required";
  }
  
  // City validation
  if (!data.city) {
    errors.city = "City is required";
  }
  
  // Property address validation
  if (!data.property_address) {
    errors.property_address = "Property address is required";
  }
  
  // Total price validation
  if (!data.total_price) {
    errors.total_price = "Price is required";
  } else if (isNaN(data.total_price) || Number(data.total_price) <= 0) {
    errors.total_price = "Please enter a valid price";
  }
  
  // Property size validation (optional)
  if (data.property_size && (isNaN(data.property_size) || Number(data.property_size) <= 0)) {
    errors.property_size = "Please enter a valid property size";
  }
  
  // Bedrooms validation (optional)
  if (data.number_of_bedrooms && (isNaN(data.number_of_bedrooms) || Number(data.number_of_bedrooms) < 0)) {
    errors.number_of_bedrooms = "Please enter a valid number of bedrooms";
  }
  
  // Bathrooms validation (optional)
  if (data.number_of_bathrooms && (isNaN(data.number_of_bathrooms) || Number(data.number_of_bathrooms) < 0)) {
    errors.number_of_bathrooms = "Please enter a valid number of bathrooms";
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
