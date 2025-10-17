const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => {
  console.error('MongoDB Connection Error:', err);
  process.exit(1);
});

// Define the schema
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

// Create a sample document to initialize the collection
const createSampleRequest = async () => {
  try {
    // Create a sample document
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
    
    // Close the connection
    mongoose.connection.close();
    console.log('Database connection closed.');
    
    console.log('Initialization complete!');
  } catch (error) {
    console.error(`Error initializing partnershiprequests collection: ${error.message}`);
    // Close the connection on error
    mongoose.connection.close();
    process.exit(1);
  }
};

// Run the initialization
createSampleRequest();
