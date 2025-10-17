/**
 * Add Admin User Script
 * 
 * This script adds an admin user directly to the MongoDB database.
 * It uses the MongoDB connection string from the environment variables.
 */

const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

// Admin user details
const adminUser = {
  firstName: 'Admin',
  lastName: 'User',
  email: 'admin@addisnest.com',
  password: 'Admin@123', // This will be hashed before saving
  role: 'admin',
  createdAt: new Date(),
  updatedAt: new Date()
};

// MongoDB connection details
const MONGO_URI = 'mongodb://localhost:27017/addisnest'; // Using the connection string from the screenshot

async function addAdminUser() {
  let client;
  
  try {
    console.log('Connecting to MongoDB...');
    client = new MongoClient(MONGO_URI);
    await client.connect();
    console.log('Connected to MongoDB successfully!');
    
    const db = client.db();
    const usersCollection = db.collection('users');
    
    // Check if admin user already exists
    const existingAdmin = await usersCollection.findOne({ email: adminUser.email });
    
    if (existingAdmin) {
      console.log('Admin user already exists. Updating password...');
      
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminUser.password, salt);
      
      // Update the admin user
      await usersCollection.updateOne(
        { email: adminUser.email },
        { 
          $set: { 
            password: hashedPassword,
            updatedAt: new Date()
          } 
        }
      );
      
      console.log('Admin user password updated successfully!');
    } else {
      console.log('Admin user does not exist. Creating new admin user...');
      
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminUser.password, salt);
      
      // Create the admin user with hashed password
      const newAdminUser = {
        ...adminUser,
        password: hashedPassword
      };
      
      // Insert the admin user
      await usersCollection.insertOne(newAdminUser);
      
      console.log('Admin user created successfully!');
    }
    
    // Verify the admin user exists
    const adminUserInDb = await usersCollection.findOne({ email: adminUser.email });
    
    if (adminUserInDb) {
      console.log('Admin user verified in database:');
      console.log(`- ID: ${adminUserInDb._id}`);
      console.log(`- Email: ${adminUserInDb.email}`);
      console.log(`- Role: ${adminUserInDb.role}`);
    } else {
      console.log('Failed to verify admin user in database!');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    if (client) {
      await client.close();
      console.log('MongoDB connection closed.');
    }
  }
}

// Run the script
addAdminUser();
