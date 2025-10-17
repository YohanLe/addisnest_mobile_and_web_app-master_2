const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Import Property model
const Property = require('./src/models/Property');

// Database connection
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    const hasDBName = mongoUri.split('/').length > 3;
    const connectionString = hasDBName ? mongoUri : `${mongoUri}/addisnest`;
    console.log('Connecting to MongoDB Atlas...');
    const conn = await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`✅ Database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    return null;
  }
};

// Test property retrieval
const testPropertyRetrieval = async () => {
  try {
    console.log('\n🔍 Testing Property Retrieval...');
    
    // Get total count of properties
    const totalCount = await Property.countDocuments();
    console.log(`📊 Total properties in database: ${totalCount}`);
    
    if (totalCount > 0) {
      // Get first 5 properties with basic info
      const properties = await Property.find()
        .select('title propertyType price offeringType address.regionalState address.subCity status createdAt')
        .limit(5)
        .sort('-createdAt');
      
      console.log('\n📋 Recent Properties:');
      properties.forEach((property, index) => {
        console.log(`${index + 1}. ${property.title}`);
        console.log(`   Type: ${property.propertyType} | Price: ${property.price}`);
        console.log(`   Offering: ${property.offeringType} | Status: ${property.status}`);
        console.log(`   Location: ${property.address?.subCity || 'N/A'}, ${property.address?.regionalState || 'N/A'}`);
        console.log(`   Created: ${property.createdAt}`);
        console.log('   ---');
      });
      
      // Test filtering by offering type
      const forSaleCount = await Property.countDocuments({ offeringType: 'For Sale' });
      const forRentCount = await Property.countDocuments({ offeringType: 'For Rent' });
      
      console.log(`\n🏠 Properties for Sale: ${forSaleCount}`);
      console.log(`🏠 Properties for Rent: ${forRentCount}`);
      
      // Test filtering by property type
      const propertyTypes = await Property.aggregate([
        { $group: { _id: '$propertyType', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]);
      
      console.log('\n🏗️ Properties by Type:');
      propertyTypes.forEach(type => {
        console.log(`   ${type._id}: ${type.count}`);
      });
      
      // Test filtering by regional state
      const regionalStates = await Property.aggregate([
        { $group: { _id: '$address.regionalState', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]);
      
      console.log('\n🌍 Properties by Regional State:');
      regionalStates.forEach(state => {
        console.log(`   ${state._id || 'Unknown'}: ${state.count}`);
      });
      
    } else {
      console.log('⚠️ No properties found in the database');
    }
    
    console.log('\n✅ Property retrieval test completed successfully!');
    
  } catch (error) {
    console.error(`❌ Error testing property retrieval: ${error.message}`);
  }
};

// Main function
const main = async () => {
  console.log('🚀 Starting MongoDB Atlas Property Retrieval Test...');
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  
  const connection = await connectDB();
  if (connection) {
    await testPropertyRetrieval();
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  } else {
    console.log('❌ Failed to connect to database');
  }
  
  process.exit(0);
};

// Run the test
main().catch(error => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});
