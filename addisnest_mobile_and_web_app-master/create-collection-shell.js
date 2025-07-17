const { exec } = require('child_process');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables
dotenv.config();

// Get MongoDB URI from environment variables
const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  console.error('MongoDB URI not found in environment variables');
  process.exit(1);
}

// Extract database name from URI
const dbName = mongoUri.split('/').pop().split('?')[0];
console.log(`Database name: ${dbName}`);

// Create a temporary MongoDB script file
const tempScriptPath = path.join(__dirname, 'temp_mongo_script.js');
const scriptContent = `
// Create the partnershiprequests collection if it doesn't exist
db.createCollection("partnershiprequests");

// Insert a sample document to ensure the collection is properly initialized
var sampleDoc = {
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

// Insert the sample document
var result = db.partnershiprequests.insertOne(sampleDoc);
print("Sample document inserted with ID: " + result.insertedId);

// Delete the sample document
db.partnershiprequests.deleteOne({ _id: result.insertedId });
print("Sample document deleted. Collection is now empty and ready for use.");

// List all collections to verify
var collections = db.getCollectionNames();
print("Collections in database:");
collections.forEach(function(collection) {
  print(" - " + collection);
});
`;

// Write the script to a temporary file
fs.writeFileSync(tempScriptPath, scriptContent);
console.log(`Temporary MongoDB script created at: ${tempScriptPath}`);

// Construct the mongo shell command
// For MongoDB Atlas, we need to use the connection string
const mongoCommand = `mongosh "${mongoUri}" --file "${tempScriptPath}"`;

console.log('Executing MongoDB command...');
exec(mongoCommand, (error, stdout, stderr) => {
  // Delete the temporary script file
  fs.unlinkSync(tempScriptPath);
  console.log('Temporary script file deleted');

  if (error) {
    console.error(`Error executing MongoDB command: ${error.message}`);
    console.error('Make sure mongosh (MongoDB Shell) is installed and in your PATH');
    process.exit(1);
  }

  if (stderr) {
    console.error(`MongoDB Shell stderr: ${stderr}`);
  }

  console.log('MongoDB Shell output:');
  console.log(stdout);
  console.log('Collection creation process completed');
});
