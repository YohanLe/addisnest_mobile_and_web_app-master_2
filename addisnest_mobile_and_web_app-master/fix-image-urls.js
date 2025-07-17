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
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    return null;
  }
};

// Fix image URLs
const fixImageUrls = async () => {
  try {
    console.log('\n🔧 Fixing Image URLs...');
    
    // Get all properties with images
    const properties = await Property.find({ 'images.0': { $exists: true } });
    console.log(`📊 Found ${properties.length} properties with images`);
    
    let updatedCount = 0;
    
    for (const property of properties) {
      let hasUpdates = false;
      
      // Update each image URL
      const updatedImages = property.images.map(image => {
        if (image.url && image.url.includes('3.144.240.220')) {
          // Extract the filename from the URL
          const filename = image.url.split('/uploads/').pop();
          // Create new local URL
          const newUrl = `http://localhost:7001/uploads/${filename}`;
          
          console.log(`🔄 Updating: ${image.url} -> ${newUrl}`);
          hasUpdates = true;
          
          return {
            ...image.toObject(),
            url: newUrl
          };
        }
        return image;
      });
      
      if (hasUpdates) {
        // Update the property with new image URLs
        await Property.findByIdAndUpdate(property._id, {
          images: updatedImages
        });
        updatedCount++;
        console.log(`✅ Updated property: ${property.title}`);
      }
    }
    
    console.log(`\n🎉 Successfully updated ${updatedCount} properties`);
    
    // Show updated properties
    if (updatedCount > 0) {
      console.log('\n📋 Updated Properties:');
      const updatedProperties = await Property.find({ 'images.0': { $exists: true } })
        .select('title images')
        .limit(5);
      
      updatedProperties.forEach((property, index) => {
        console.log(`${index + 1}. ${property.title}`);
        property.images.forEach((image, imgIndex) => {
          console.log(`   Image ${imgIndex + 1}: ${image.url}`);
        });
        console.log('   ---');
      });
    }
    
  } catch (error) {
    console.error(`❌ Error fixing image URLs: ${error.message}`);
  }
};

// Main function
const main = async () => {
  console.log('🚀 Starting Image URL Fix...');
  
  const connection = await connectDB();
  if (connection) {
    await fixImageUrls();
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  } else {
    console.log('❌ Failed to connect to database');
  }
  
  process.exit(0);
};

// Run the fix
main().catch(error => {
  console.error('❌ Fix failed:', error);
  process.exit(1);
});
