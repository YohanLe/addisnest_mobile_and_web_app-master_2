const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// MongoDB connection URI
const uri = process.env.MONGO_URI;

if (!uri) {
  console.error('MongoDB URI not found in environment variables');
  process.exit(1);
}

// Connect to MongoDB
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => {
  console.error('MongoDB Connection Error:', err);
  process.exit(1);
});

// Define the schema with explicit collection name
const partnershipRequestSchema = new mongoose.Schema({
  companyName: String,
  contactName: String,
  email: String,
  phone: String,
  partnershipType: String,
  message: String,
  status: {
    type: String,
    default: 'not revised'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  collection: 'partnershiprequests' // Explicitly set the collection name
});

// Create the model
const PartnershipRequests = mongoose.model('PartnershipRequests', partnershipRequestSchema);

// Function to create the collection
const createCollection = async () => {
  try {
    // Get the database connection
    const db = mongoose.connection.db;
    
    // Check if the collection exists
    const collections = await db.listCollections({ name: 'partnershiprequests' }).toArray();
    
    if (collections.length > 0) {
      console.log('The partnershiprequests collection already exists.');
    } else {
      console.log('Creating partnershiprequests collection...');
      
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
      const savedRequest = await sampleRequest.save();
      console.log(`Created partnershiprequests collection with a sample document. ID: ${savedRequest._id}`);
      
      // Delete the sample document
      await PartnershipRequests.deleteOne({ _id: savedRequest._id });
      console.log('Removed sample document. The collection is now empty and ready for use.');
    }
    
    // List all collections to verify
    const allCollections = await db.listCollections().toArray();
    console.log('Collections in database:');
    allCollections.forEach(collection => {
      console.log(` - ${collection.name}`);
    });
    
    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed.');
    
    console.log('Collection creation process completed!');
  } catch (error) {
    console.error(`Error creating collection: ${error.message}`);
    // Close the connection on error
    await mongoose.connection.close();
    process.exit(1);
  }
};

// Run the function
createCollection();
