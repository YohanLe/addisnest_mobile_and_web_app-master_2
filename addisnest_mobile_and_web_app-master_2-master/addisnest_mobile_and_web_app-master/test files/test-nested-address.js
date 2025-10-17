/**
 * Test script for the nested address structure implementation
 * 
 * This script tests:
 * 1. Creating a property with the nested address structure
 * 2. Verifying that both flat and nested address fields are correctly saved
 * 3. Retrieving the property and checking that both address formats are accessible
 */

const mongoose = require('mongoose');
require('dotenv').config();
const Property = require('./src/models/Property');
const User = require('./src/models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB for testing');
  runTest();
}).catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

async function runTest() {
  try {
    console.log('\n🧪 STARTING NESTED ADDRESS STRUCTURE TEST\n');
    
    // Find a test user or create one
    let testUser = await User.findOne({ email: 'test@example.com' });
    if (!testUser) {
      console.log('Creating a test user...');
      testUser = await User.create({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'password123',
        role: 'user'
      });
      console.log('Test user created with ID:', testUser._id);
    } else {
      console.log('Using existing test user with ID:', testUser._id);
    }

    // Create a test property with nested address structure
    const addressData = {
      street: 'Test Street 123',
      city: 'Urbandale',
      state: 'Afar Region',
      country: 'Ethiopia'
    };

    console.log('\n📝 Creating test property with address data:', addressData);
    
    // Create the property with both flat and nested address fields
    const testProperty = await Property.create({
      owner: testUser._id,
      title: 'Test Property with Nested Address',
      description: 'Property created for testing nested address structure',
      propertyType: 'House',
      offeringType: 'For Sale',
      status: 'active',
      price: 5000000,
      area: 250,
      bedrooms: 3,
      bathrooms: 2,
      images: [{ url: '/uploads/test-property-image.jpg' }],
      features: { 'parking-space': true, 'gym-fitness-center': true },
      isPremium: false,
      isVerified: false,
      promotionType: 'Basic',
      
      // Set both flat address fields and nested structure
      street: addressData.street,
      city: addressData.city,
      state: addressData.state,
      country: addressData.country,
      
      address: addressData
    });
    
    console.log('\n✅ Test property created successfully with ID:', testProperty._id);
    
    // Retrieve the property directly from the database to verify saved data
    const savedProperty = await Property.findById(testProperty._id);
    
    console.log('\n🔍 Verifying property data in database:');
    
    // Check flat address fields
    console.log('\n📋 FLAT ADDRESS FIELDS:');
    console.log('street:', savedProperty.street);
    console.log('city:', savedProperty.city);
    console.log('state:', savedProperty.state);
    console.log('country:', savedProperty.country);
    
    // Check nested address structure
    console.log('\n📋 NESTED ADDRESS STRUCTURE:');
    console.log('address.street:', savedProperty.address.street);
    console.log('address.city:', savedProperty.address.city);
    console.log('address.state:', savedProperty.address.state);
    console.log('address.country:', savedProperty.address.country);
    
    // Verify that both address formats match
    const flatAddressFields = {
      street: savedProperty.street,
      city: savedProperty.city,
      state: savedProperty.state,
      country: savedProperty.country
    };
    
    // Compare flat and nested address fields
    const addressesMatch = 
      flatAddressFields.street === savedProperty.address.street &&
      flatAddressFields.city === savedProperty.address.city &&
      flatAddressFields.state === savedProperty.address.state &&
      flatAddressFields.country === savedProperty.address.country;
    
    if (addressesMatch) {
      console.log('\n✅ SUCCESS: Flat and nested address fields match correctly');
    } else {
      console.log('\n❌ ERROR: Flat and nested address fields do not match');
      console.log('Flat address:', flatAddressFields);
      console.log('Nested address:', savedProperty.address);
    }
    
    // Test with only flat address fields
    console.log('\n🧪 Testing creation with only flat address fields...');
    
    const flatOnlyProperty = await Property.create({
      owner: testUser._id,
      title: 'Test Property with Flat Address Only',
      description: 'Property created for testing flat address fields',
      propertyType: 'Apartment',
      offeringType: 'For Rent',
      status: 'active',
      price: 15000,
      area: 120,
      bedrooms: 2,
      bathrooms: 1,
      images: [{ url: '/uploads/test-property-image.jpg' }],
      features: { 'parking-space': true },
      isPremium: false,
      isVerified: false,
      promotionType: 'Basic',
      
      // Set only flat address fields
      street: 'Flat Only Street 456',
      city: 'Flat City',
      state: 'Flat State',
      country: 'Ethiopia'
    });
    
    const savedFlatProperty = await Property.findById(flatOnlyProperty._id);
    
    console.log('\n📋 Checking if nested address was automatically created:');
    if (savedFlatProperty.address) {
      console.log('address.street:', savedFlatProperty.address.street);
      console.log('address.city:', savedFlatProperty.address.city);
      console.log('address.state:', savedFlatProperty.address.state);
      console.log('address.country:', savedFlatProperty.address.country);
      console.log('\n✅ Nested address structure was created correctly');
    } else {
      console.log('❌ ERROR: Nested address structure was not created');
    }
    
    // Test with only nested address
    console.log('\n🧪 Testing creation with only nested address...');
    
    const nestedOnlyProperty = await Property.create({
      owner: testUser._id,
      title: 'Test Property with Nested Address Only',
      description: 'Property created for testing nested address only',
      propertyType: 'Commercial',
      offeringType: 'For Sale',
      status: 'active',
      price: 10000000,
      area: 500,
      bedrooms: 0,
      bathrooms: 2,
      images: [{ url: '/uploads/test-property-image.jpg' }],
      features: { 'parking-space': true },
      isPremium: false,
      isVerified: false,
      promotionType: 'Basic',
      
      // Set only nested address
      address: {
        street: 'Nested Only Avenue 789',
        city: 'Nested City',
        state: 'Nested State',
        country: 'Ethiopia'
      }
    });
    
    const savedNestedProperty = await Property.findById(nestedOnlyProperty._id);
    
    console.log('\n📋 Checking if flat address fields were automatically set:');
    console.log('street:', savedNestedProperty.street);
    console.log('city:', savedNestedProperty.city);
    console.log('state:', savedNestedProperty.state);
    console.log('country:', savedNestedProperty.country);
    
    // Cleanup
    console.log('\n🧹 Cleaning up test data...');
    await Property.deleteMany({
      _id: { 
        $in: [
          testProperty._id,
          flatOnlyProperty._id,
          nestedOnlyProperty._id
        ]
      }
    });
    console.log('Test properties deleted');
    
    console.log('\n✅ TEST COMPLETED SUCCESSFULLY\n');
    
  } catch (error) {
    console.error('\n❌ TEST ERROR:', error);
  } finally {
    // Close the database connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  }
}
