const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const { PartnershipRequests } = require('./src/models');

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
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

// Initialize the partnershiprequests collection
const initPartnershipRequests = async () => {
  try {
    // Connect to the database
    const conn = await connectDB();
    
    // Check if the collection exists
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionExists = collections.some(col => col.name === 'partnershiprequests');
    
    if (collectionExists) {
      console.log('The partnershiprequests collection already exists.');
    } else {
      // Create a sample document to initialize the collection
      const sampleRequest = new PartnershipRequests({
        companyName: 'Sample Company',
        contactName: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        partnershipType: 'advertising',
        message: 'This is a sample partnership request to initialize the collection.',
        status: 'not revised'
      });
      
      // Save the sample document
      await sampleRequest.save();
      console.log('Created partnershiprequests collection with a sample document.');
      
      // Delete the sample document (optional)
      await PartnershipRequests.deleteOne({ _id: sampleRequest._id });
      console.log('Removed sample document. The collection is now empty and ready for use.');
    }
    
    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed.');
    
    console.log('Initialization complete!');
  } catch (error) {
    console.error(`Error initializing partnershiprequests collection: ${error.message}`);
    // Close the connection on error
    await mongoose.connection.close();
    process.exit(1);
  }
};

// Run the initialization
initPartnershipRequests();
