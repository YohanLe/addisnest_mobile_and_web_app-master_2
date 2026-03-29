/**
 * Admin User Seed Script
 * 
 * This script creates an admin user in the database with the default credentials.
 * Run this script once to set up the initial admin account.
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { User } = require('../models');
require('dotenv').config();

// Admin user credentials
const adminUser = {
  firstName: 'Admin',
  lastName: 'User',
  email: 'admin@addisnest.com',
  password: 'Admin@123',
  role: 'admin',
  isVerified: true
};

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

// Create admin user
const seedAdminUser = async () => {
  try {
    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: adminUser.email });
    
    if (existingAdmin) {
      console.log('Admin user already exists. Updating password...');
      
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminUser.password, salt);
      
      // Update the existing admin user
      existingAdmin.password = hashedPassword;
      await existingAdmin.save();
      
      console.log('Admin user password updated successfully.');
    } else {
      // Create new admin user
      const user = await User.create(adminUser);
      console.log(`Admin user created successfully with ID: ${user._id}`);
    }
    
    console.log('Admin credentials:');
    console.log(`Email: ${adminUser.email}`);
    console.log(`Password: ${adminUser.password}`);
    
    process.exit(0);
  } catch (error) {
    console.error(`Error creating admin user: ${error.message}`);
    process.exit(1);
  }
};

// Run the seed function
connectDB().then(() => {
  seedAdminUser();
});
