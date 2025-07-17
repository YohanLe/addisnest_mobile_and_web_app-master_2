/**
 * Direct Partnership Requests Seed Script
 * 
 * This script directly inserts sample data into the partnershiprequests collection
 * with minimal dependencies and maximum error reporting.
 */

const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables
dotenv.config();

// Get MongoDB URI from environment or use a default local connection
let uri = process.env.MONGO_URI;

// If no URI is found in environment, check for a .env file
if (!uri) {
  try {
    if (fs.existsSync('.env')) {
      const envContent = fs.readFileSync('.env', 'utf8');
      const mongoUriMatch = envContent.match(/MONGO_URI=(.+)/);
      if (mongoUriMatch && mongoUriMatch[1]) {
        uri = mongoUriMatch[1].trim();
        console.log('Found MONGO_URI in .env file');
      }
    }
  } catch (err) {
    console.error('Error reading .env file:', err);
  }
}

// If still no URI, use a default local connection
if (!uri) {
  uri = 'mongodb://localhost:27017/addisnest';
  console.log(`No MONGO_URI found in environment variables or .env file. Using default: ${uri}`);
}

// Sample partnership requests data - simplified for direct insertion
const samplePartnershipRequests = [
  {
    companyName: 'Abyssinia Real Estate',
    contactName: 'Dawit Bekele',
    email: 'dawit@abyssiniarealestate.com',
    phone: '+251911234567',
    partnershipType: 'advertising',
    message: 'We would like to advertise our new properties on your platform.',
    status: 'not revised',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    companyName: 'Habesha Home Builders',
    contactName: 'Sara Tadesse',
    email: 'sara@habeshabuilders.com',
    phone: '+251922345678',
    partnershipType: 'corporate',
    message: 'Our company is interested in a corporate partnership to list all our new developments.',
    status: 'not revised',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    companyName: 'Addis Home Inspection',
    contactName: 'Yonas Haile',
    email: 'yonas@addisinspection.com',
    phone: '+251933456789',
    partnershipType: 'service',
    message: 'We provide professional home inspection services and would like to partner with you.',
    status: 'not revised',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

async function seedPartnershipRequests() {
  let client;
  
  try {
    console.log('Connecting to MongoDB...');
    console.log(`Using connection string: ${uri}`);
    
    // Create a new MongoClient
    client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 30000
    });
    
    // Connect to the MongoDB server
    await client.connect();
    console.log('Successfully connected to MongoDB');
    
    // Extract database name from URI or use default
    let dbName;
    try {
      dbName = uri.split('/').pop().split('?')[0];
      if (!dbName) throw new Error('Could not extract database name from URI');
    } catch (error) {
      dbName = 'addisnest';
      console.log(`Could not extract database name from URI. Using default: ${dbName}`);
    }
    
    console.log(`Using database: ${dbName}`);
    const db = client.db(dbName);
    
    // List all collections to check if partnershiprequests exists
    console.log('Checking for existing collections...');
    const collections = await db.listCollections().toArray();
    console.log('Collections in database:');
    collections.forEach(collection => {
      console.log(` - ${collection.name}`);
    });
    
    const collectionExists = collections.some(collection => collection.name === 'partnershiprequests');
    
    if (!collectionExists) {
      console.log('partnershiprequests collection does not exist. Creating it now...');
      await db.createCollection('partnershiprequests');
      console.log('partnershiprequests collection created successfully');
    } else {
      console.log('partnershiprequests collection already exists');
    }
    
    // Get reference to the collection
    const collection = db.collection('partnershiprequests');
    
    // Check if collection has data
    const count = await collection.countDocuments();
    console.log(`Current document count in partnershiprequests: ${count}`);
    
    if (count > 0 && !process.argv.includes('--force')) {
      console.log('Collection already has data. Use --force flag to add seed data anyway.');
      console.log('Example: node direct-seed-partnership-requests.js --force');
      return;
    }
    
    // Insert the sample data
    console.log('Inserting sample partnership requests...');
    const result = await collection.insertMany(samplePartnershipRequests);
    
    console.log(`Successfully inserted ${result.insertedCount} documents into partnershiprequests collection`);
    
    // Verify the inserted documents
    console.log('\nVerifying inserted documents:');
    const insertedDocs = await collection.find({}).toArray();
    
    insertedDocs.forEach((doc, index) => {
      console.log(`\n${index + 1}. ${doc.companyName}`);
      console.log(`   Contact: ${doc.contactName}, ${doc.email}`);
      console.log(`   Type: ${doc.partnershipType}`);
      console.log(`   Status: ${doc.status}`);
      console.log(`   ID: ${doc._id}`);
    });
    
    console.log('\nSeed data operation completed successfully!');
    
  } catch (error) {
    console.error('\n========== ERROR ==========');
    console.error(`Error seeding partnership requests: ${error.message}`);
    console.error(error.stack);
    console.error('===========================\n');
    
    // Additional error diagnostics
    console.log('\nDiagnostic Information:');
    console.log(`MongoDB URI: ${uri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')}`); // Hide credentials
    console.log(`Node.js version: ${process.version}`);
    console.log(`Operating System: ${process.platform}`);
    
    // Check if MongoDB is running locally
    if (uri.includes('localhost') || uri.includes('127.0.0.1')) {
      console.log('\nTrying to check if MongoDB is running locally...');
      const { exec } = require('child_process');
      
      if (process.platform === 'win32') {
        exec('tasklist | findstr mongod', (err, stdout) => {
          if (err) {
            console.log('Could not check if MongoDB is running (Windows)');
            return;
          }
          if (stdout) {
            console.log('MongoDB seems to be running locally:');
            console.log(stdout);
          } else {
            console.log('MongoDB does not appear to be running locally. Please start MongoDB service.');
          }
        });
      } else {
        exec('ps aux | grep mongod', (err, stdout) => {
          if (err) {
            console.log('Could not check if MongoDB is running (Unix)');
            return;
          }
          if (stdout) {
            console.log('MongoDB seems to be running locally:');
            console.log(stdout);
          } else {
            console.log('MongoDB does not appear to be running locally. Please start MongoDB service.');
          }
        });
      }
    }
    
  } finally {
    // Close the connection
    if (client) {
      try {
        await client.close();
        console.log('MongoDB connection closed');
      } catch (closeError) {
        console.error(`Error closing MongoDB connection: ${closeError.message}`);
      }
    }
  }
}

// Run the seed function
seedPartnershipRequests();
