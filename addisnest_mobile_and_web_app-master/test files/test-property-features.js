const mongoose = require('mongoose');
const Property = require('./src/models/Property');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

async function runTest() {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log('Connected to in-memory database.');

  const testProperty = {
    title: "Test Property with Features",
    description: "A property for testing dynamic features.",
    propertyType: "House",
    offeringType: "For Sale",
    status: "active",
    price: 500000,
    area: 200,
    bedrooms: 4,
    bathrooms: 3,
    features: {
      "parking-space": true,
      "garage": true,
      "24-7-security": true,
      "cctv-surveillance": false, // This should not be displayed
      "gym-fitness-center": true,
      "swimming-pool": false, // This should not be displayed
    },
    address: {
      street: "123 Test St",
      city: "Testville",
      state: "Test State",
      country: "Testland",
    },
    owner: new mongoose.Types.ObjectId(),
  };

  const property = new Property(testProperty);
  await property.save();

  console.log('Test property created:', property);

  const fetchedProperty = await Property.findById(property._id);
  console.log('Fetched property features:', fetchedProperty.features);

  await mongoose.disconnect();
  await mongoServer.stop();
  console.log('Disconnected from in-memory database.');
}

runTest().catch(err => console.error(err));
