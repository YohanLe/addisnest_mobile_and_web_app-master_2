const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Import models
const Property = require('./src/models/Property');
const User = require('./src/models/User');

// Connect to MongoDB
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    const hasDBName = mongoUri.split('/').length > 3;
    const connectionString = hasDBName ? mongoUri : `${mongoUri}/addinest_real_estate`;
    
    console.log('Connecting to MongoDB...');
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected Successfully');
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

// Create a dummy user for properties
const createDummyUser = async () => {
  try {
    // Check if a dummy user already exists
    let dummyUser = await User.findOne({ email: 'dummy@example.com' });
    
    if (!dummyUser) {
      dummyUser = new User({
        firstName: 'Demo',
        lastName: 'User',
        email: 'dummy@example.com',
        phoneNumber: '+251911000000',
        userType: 'agent',
        isVerified: true
      });
      await dummyUser.save();
      console.log('Created dummy user for properties');
    }
    
    return dummyUser._id;
  } catch (error) {
    console.error('Error creating dummy user:', error);
    // Return a default ObjectId if user creation fails
    return new mongoose.Types.ObjectId();
  }
};

// Sample property data
const getSampleProperties = (ownerId) => [
  {
    owner: ownerId,
    title: 'Modern Villa in Bole',
    description: 'Beautiful modern villa with stunning views and premium finishes. Perfect for families looking for luxury living in the heart of Addis Ababa.',
    propertyType: 'Villa',
    offeringType: 'For Sale',
    status: 'For Sale',
    furnishingStatus: 'Furnished',
    price: 8500000,
    area: 350,
    bedrooms: 4,
    bathrooms: 3,
    address: {
      regionalState: 'Addis Ababa City Administration',
      subCity: 'Bole',
      city: 'Addis Ababa',
      country: 'Ethiopia'
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
        caption: 'Front view of the villa'
      },
      {
        url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
        caption: 'Living room'
      }
    ],
    features: {
      hasPool: true,
      hasGarden: true,
      hasParking: true,
      hasSecuritySystem: true
    },
    promotionType: 'VIP',
    isPremium: true,
    isVerified: true,
    ownerName: 'John Doe'
  },
  {
    owner: ownerId,
    title: 'Cozy Apartment in Kazanchis',
    description: 'Well-maintained 2-bedroom apartment in a prime location. Close to shopping centers, restaurants, and public transportation.',
    propertyType: 'Apartment',
    offeringType: 'For Rent',
    status: 'For Rent',
    furnishingStatus: 'Semi-Furnished',
    price: 25000,
    area: 120,
    bedrooms: 2,
    bathrooms: 2,
    address: {
      regionalState: 'Addis Ababa City Administration',
      subCity: 'Kirkos',
      city: 'Addis Ababa',
      country: 'Ethiopia'
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
        caption: 'Apartment exterior'
      },
      {
        url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
        caption: 'Modern kitchen'
      }
    ],
    features: {
      hasPool: false,
      hasGarden: false,
      hasParking: true,
      hasElevator: true
    },
    promotionType: 'Basic',
    isPremium: false,
    isVerified: true,
    ownerName: 'Sarah Johnson'
  },
  {
    owner: ownerId,
    title: 'Spacious House in Gulele',
    description: 'Large family house with a beautiful garden. Perfect for those who want space and tranquility while staying connected to the city.',
    propertyType: 'House',
    offeringType: 'For Sale',
    status: 'For Sale',
    furnishingStatus: 'Unfurnished',
    price: 6200000,
    area: 280,
    bedrooms: 5,
    bathrooms: 3,
    address: {
      regionalState: 'Addis Ababa City Administration',
      subCity: 'Gulele',
      city: 'Addis Ababa',
      country: 'Ethiopia'
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800',
        caption: 'House front view'
      },
      {
        url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
        caption: 'Spacious living area'
      }
    ],
    features: {
      hasPool: false,
      hasGarden: true,
      hasParking: true,
      hasSecuritySystem: false
    },
    promotionType: 'Diamond',
    isPremium: true,
    isVerified: true,
    ownerName: 'Michael Chen'
  },
  {
    owner: ownerId,
    title: 'Modern Condo in Yeka',
    description: 'Brand new condominium with modern amenities and excellent location. Great for young professionals and small families.',
    propertyType: 'Condo',
    offeringType: 'For Sale',
    status: 'For Sale',
    furnishingStatus: 'Furnished',
    price: 3800000,
    area: 95,
    bedrooms: 2,
    bathrooms: 1,
    address: {
      regionalState: 'Addis Ababa City Administration',
      subCity: 'Yeka',
      city: 'Addis Ababa',
      country: 'Ethiopia'
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
        caption: 'Modern condo building'
      },
      {
        url: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800',
        caption: 'Stylish interior'
      }
    ],
    features: {
      hasPool: true,
      hasGarden: false,
      hasParking: true,
      hasGym: true
    },
    promotionType: 'VIP',
    isPremium: true,
    isVerified: true,
    ownerName: 'Emma Wilson'
  },
  {
    owner: ownerId,
    title: 'Commercial Space in Merkato',
    description: 'Prime commercial location perfect for retail business or office space. High foot traffic area with excellent visibility.',
    propertyType: 'Commercial',
    offeringType: 'For Rent',
    status: 'For Rent',
    furnishingStatus: 'Unfurnished',
    price: 45000,
    area: 200,
    bedrooms: 0,
    bathrooms: 2,
    address: {
      regionalState: 'Addis Ababa City Administration',
      subCity: 'Addis Ketema',
      city: 'Addis Ababa',
      country: 'Ethiopia'
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
        caption: 'Commercial space exterior'
      },
      {
        url: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800',
        caption: 'Open floor plan'
      }
    ],
    features: {
      hasPool: false,
      hasGarden: false,
      hasParking: true,
      hasSecuritySystem: true
    },
    promotionType: 'Basic',
    isPremium: false,
    isVerified: true,
    ownerName: 'David Rodriguez'
  },
  {
    owner: ownerId,
    title: 'Luxury Townhouse in Bole Atlas',
    description: 'Elegant townhouse in prestigious Bole Atlas area. Features high-end finishes and modern design throughout.',
    propertyType: 'Townhouse',
    offeringType: 'For Sale',
    status: 'For Sale',
    furnishingStatus: 'Furnished',
    price: 12500000,
    area: 420,
    bedrooms: 4,
    bathrooms: 4,
    address: {
      regionalState: 'Addis Ababa City Administration',
      subCity: 'Bole',
      city: 'Addis Ababa',
      country: 'Ethiopia'
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
        caption: 'Luxury townhouse'
      },
      {
        url: 'https://images.unsplash.com/photo-1600566753190-17f0b0e6b2a6?w=800',
        caption: 'Elegant interior'
      }
    ],
    features: {
      hasPool: true,
      hasGarden: true,
      hasParking: true,
      hasSecuritySystem: true
    },
    promotionType: 'Diamond',
    isPremium: true,
    isVerified: true,
    ownerName: 'Lisa Anderson'
  }
];

// Seed function
const seedProperties = async () => {
  try {
    await connectDB();
    
    // Clear existing properties
    console.log('Clearing existing properties...');
    await Property.deleteMany({});
    
    // Create dummy user
    const ownerId = await createDummyUser();
    
    // Get sample properties with owner ID
    const sampleProperties = getSampleProperties(ownerId);
    
    // Insert sample properties
    console.log('Inserting sample properties...');
    const insertedProperties = await Property.insertMany(sampleProperties);
    
    console.log(`✅ Successfully seeded ${insertedProperties.length} properties!`);
    console.log('Properties added:');
    insertedProperties.forEach((property, index) => {
      console.log(`${index + 1}. ${property.title} - ${property.offeringType} - ETB ${property.price.toLocaleString()}`);
    });
    
    // Verify the count
    const totalCount = await Property.countDocuments();
    console.log(`\n📊 Total properties in database: ${totalCount}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding properties:', error);
    process.exit(1);
  }
};

// Run the seeding
if (require.main === module) {
  seedProperties();
}

module.exports = { seedProperties, getSampleProperties };
