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

// Define User schema
const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  role: String,
  isVerified: Boolean
}, { collection: 'users' });

// Test registration and check database
const testRegistrationAndDB = async () => {
  try {
    // Connect to MongoDB
    const conn = await connectDB();
    
    // Create User model
    const User = mongoose.model('User', UserSchema);
    
    // Test email with timestamp to ensure uniqueness
    const testEmail = `test-user-${Date.now()}@example.com`;
    
    console.log(`\n=== Testing User Registration with email: ${testEmail} ===\n`);
    
    // Step 1: Request OTP
    console.log('Step 1: Requesting OTP...');
    const otpResponse = await axios.post('http://localhost:7000/api/auth/request-otp', {
      email: testEmail
    });
    
    if (otpResponse.status !== 200) {
      throw new Error(`Failed to request OTP: ${otpResponse.statusText}`);
    }
    
    console.log('OTP request successful');
    
    // Extract OTP from response (in development mode)
    let otp = null;
    if (otpResponse.data && otpResponse.data.otp) {
      otp = otpResponse.data.otp;
      console.log(`Received OTP: ${otp}`);
    } else {
      throw new Error('No OTP received in response. Make sure NODE_ENV is set to development');
    }
    
    // Step 2: Verify OTP and register user
    console.log('\nStep 2: Verifying OTP and registering user...');
    const verifyResponse = await axios.post('http://localhost:7000/api/auth/verify-otp', {
      email: testEmail,
      otp: otp,
      firstName: 'Test',
      lastName: 'User',
      password: 'Password123',
      role: 'customer',
      isVerified: true
    });
    
    if (verifyResponse.status !== 200 && verifyResponse.status !== 201) {
      throw new Error(`Failed to verify OTP: ${verifyResponse.statusText}`);
    }
    
    console.log('OTP verification successful');
    console.log('User registration data:', verifyResponse.data);
    
    // Step 3: Check if user exists in database
    console.log('\nStep 3: Checking if user exists in database...');
    
    // Wait a moment for database operations to complete
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Query database for the user
    const user = await User.findOne({ email: testEmail });
    
    if (user) {
      console.log('\n✅ SUCCESS: User found in database!');
      console.log('User details:');
      console.log(`- ID: ${user._id}`);
      console.log(`- Name: ${user.firstName} ${user.lastName}`);
      console.log(`- Email: ${user.email}`);
      console.log(`- Role: ${user.role}`);
      console.log(`- Verified: ${user.isVerified}`);
    } else {
      console.log('\n❌ ERROR: User not found in database!');
    }
    
    // Close MongoDB connection
    await mongoose.connection.close();
    console.log('\nMongoDB connection closed');
    
  } catch (error) {
    console.error(`\n❌ Test failed: ${error.message}`);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    
    // Close MongoDB connection if open
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('\nMongoDB connection closed');
    }
  }
};

// Run the test
testRegistrationAndDB();
