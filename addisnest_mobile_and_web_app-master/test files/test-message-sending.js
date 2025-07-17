const axios = require('axios');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// MongoDB connection string
const MONGO_URI = process.env.MONGO_URI;
const API_URL = 'http://localhost:7000';

// Test user credentials
const testUser1 = {
  email: 'test@example.com',
  password: 'password123'
};

const testUser2 = {
  email: 'agent@example.com',
  password: 'password123'
};

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// Login function to get token
const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/login`, {
      email,
      password
    });
    
    return response.data.token;
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    throw error;
  }
};

// Function to send a message
const sendMessage = async (token, recipientId, content, propertyId = null) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
    
    const data = {
      recipientId,
      content
    };
    
    if (propertyId) {
      data.propertyId = propertyId;
    }
    
    const response = await axios.post(`${API_URL}/api/messages`, data, { headers });
    return response.data;
  } catch (error) {
    console.error('Send message error:', error.response?.data || error.message);
    throw error;
  }
};

// Import models
const User = require('./src/models/User');
const Property = require('./src/models/Property');

// Function to get a user by email
const getUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ email });
    return user;
  } catch (error) {
    console.error('Get user error:', error.message);
    throw error;
  }
};

// Function to get a property
const getProperty = async () => {
  try {
    const property = await Property.findOne({});
    return property;
  } catch (error) {
    console.error('Get property error:', error.message);
    throw error;
  }
};

// Main function to run the test
const runTest = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Get user IDs
    const user1 = await getUserByEmail(testUser1.email);
    const user2 = await getUserByEmail(testUser2.email);
    
    if (!user1 || !user2) {
      console.error('Test users not found. Please make sure they exist in the database.');
      process.exit(1);
    }
    
    console.log(`User 1 ID: ${user1._id}`);
    console.log(`User 2 ID: ${user2._id}`);
    
    // Get a property
    const property = await getProperty();
    
    if (!property) {
      console.error('No properties found in the database.');
      process.exit(1);
    }
    
    console.log(`Property ID: ${property._id}`);
    
    // Login as user 1
    const token1 = await login(testUser1.email, testUser1.password);
    console.log('User 1 logged in successfully');
    
    // Send a message from user 1 to user 2
    console.log('Sending message from user 1 to user 2...');
    const messageResponse = await sendMessage(
      token1, 
      user2._id.toString(), 
      'Hello, this is a test message from the property detail page!',
      property._id.toString()
    );
    
    console.log('Message sent successfully:');
    console.log(JSON.stringify(messageResponse, null, 2));
    
    // Login as user 2
    const token2 = await login(testUser2.email, testUser2.password);
    console.log('User 2 logged in successfully');
    
    // Send a reply from user 2 to user 1
    console.log('Sending reply from user 2 to user 1...');
    const replyResponse = await sendMessage(
      token2,
      user1._id.toString(),
      'Thank you for your message! This is a test reply.',
      property._id.toString()
    );
    
    console.log('Reply sent successfully:');
    console.log(JSON.stringify(replyResponse, null, 2));
    
    console.log('Test completed successfully!');
    
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
    
    process.exit(0);
  } catch (error) {
    console.error('Test failed:', error.message);
    
    // Disconnect from MongoDB
    try {
      await mongoose.disconnect();
      console.log('MongoDB disconnected');
    } catch (err) {
      console.error('Error disconnecting from MongoDB:', err.message);
    }
    
    process.exit(1);
  }
};

// Run the test
runTest();
