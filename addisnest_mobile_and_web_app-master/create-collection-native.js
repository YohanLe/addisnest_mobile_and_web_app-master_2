const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// MongoDB connection URI
const uri = process.env.MONGO_URI;

if (!uri) {
  console.error('MongoDB URI not found in environment variables');
  process.exit(1);
}

// Create a new MongoClient
const client = new MongoClient(uri);

async function createCollection() {
  try {
    // Connect the client to the server
    await client.connect();
    console.log("Connected successfully to MongoDB server");

    // Get the database name from the connection string
    const dbName = uri.split('/').pop().split('?')[0];
    console.log(`Using database: ${dbName}`);

    // Get the database
    const db = client.db(dbName);

    // Check if the collection exists
    const collections = await db.listCollections({ name: 'partnershiprequests' }).toArray();
    
    if (collections.length > 0) {
      console.log('The partnershiprequests collection already exists.');
    } else {
      console.log('Creating partnershiprequests collection...');
      
      // Create the collection explicitly
      await db.createCollection('partnershiprequests');
      console.log('Collection created successfully.');
      
      // Insert a sample document to ensure the collection is properly initialized
      const sampleDoc = {
        companyName: 'Sample Company',
        contactName: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        partnershipType: 'advertising',
        message: 'This is a sample partnership request to initialize the collection.',
        status: 'not revised',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const result = await db.collection('partnershiprequests').insertOne(sampleDoc);
      console.log(`Sample document inserted with ID: ${result.insertedId}`);
      
      // Delete the sample document
      await db.collection('partnershiprequests').deleteOne({ _id: result.insertedId });
      console.log('Sample document deleted. Collection is now empty and ready for use.');
    }
    
    // List all collections to verify
    const allCollections = await db.listCollections().toArray();
    console.log('Collections in database:');
    allCollections.forEach(collection => {
      console.log(` - ${collection.name}`);
    });
    
    console.log('Collection creation process completed!');
  } catch (error) {
    console.error(`Error creating collection: ${error.message}`);
  } finally {
    // Close the connection
    await client.close();
    console.log("MongoDB connection closed");
  }
}

// Run the function
createCollection().catch(console.error);
