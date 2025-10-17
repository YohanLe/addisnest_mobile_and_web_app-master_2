/**
 * Test script for user registration and login flow
 * This script tests the registration process and verifies that user data is saved to MongoDB
 */

const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

// API base URL
const API_URL = process.env.API_URL || 'http://localhost:7000/api';

// Test user data
const testUser = {
  firstName: 'Test',
  lastName: 'User',
  email: `test${Date.now()}@example.com`, // Unique email to avoid conflicts
  password: 'Password123!',
  role: 'CUSTOMER',
  regionalState: 'Addis Ababa City Administration'
};

// Test registration flow
const testRegistration = async () => {
  try {
    console.log('Starting registration test...');
    console.log(`Using test email: ${testUser.email}`);

    // Step 1: Request OTP
    console.log('Step 1: Requesting OTP...');
    const otpResponse = await axios.post(`${API_URL}/auth/request-otp`, {
      email: testUser.email
    });

    if (!otpResponse.data || !otpResponse.data.data || !otpResponse.data.data.otp) {
      console.error('Failed to get OTP from response');
      return false;
    }

    const otp = otpResponse.data.data.otp;
    console.log(`OTP received: ${otp}`);

    // Step 2: Verify OTP and register user
    console.log('Step 2: Verifying OTP and registering user...');
    const verifyResponse = await axios.post(`${API_URL}/auth/verify-otp`, {
      email: testUser.email,
      otp,
      firstName: testUser.firstName,
      lastName: testUser.lastName,
      password: testUser.password,
      role: testUser.role,
      regionalState: testUser.regionalState
    });

    if (!verifyResponse.data || !verifyResponse.data.success) {
      console.error('Failed to verify OTP and register user');
      console.error('Response:', verifyResponse.data);
      return false;
    }

    console.log('User registered successfully!');
    console.log('User data:', verifyResponse.data.data);

    // Step 3: Verify user exists in MongoDB
    console.log('Step 3: Verifying user exists in MongoDB...');
    const conn = await connectDB();
    const User = conn.model('User', require('./src/models/User').schema);
    
    const dbUser = await User.findOne({ email: testUser.email });
    
    if (!dbUser) {
      console.error('User not found in MongoDB');
      return false;
    }
    
    console.log('User found in MongoDB:');
    console.log({
      _id: dbUser._id,
      firstName: dbUser.firstName,
      lastName: dbUser.lastName,
      email: dbUser.email,
      role: dbUser.role,
      isVerified: dbUser.isVerified
    });
    
    // Disconnect from MongoDB
    await mongoose.disconnect();
    
    return true;
  } catch (error) {
    console.error('Error during registration test:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    return false;
  }
};

// Run the test
(async () => {
  const success = await testRegistration();
  console.log(`Registration test ${success ? 'PASSED' : 'FAILED'}`);
  process.exit(success ? 0 : 1);
})();
