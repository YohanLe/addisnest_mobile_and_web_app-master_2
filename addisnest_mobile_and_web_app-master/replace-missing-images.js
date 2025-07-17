const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

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

// Get list of available real images in uploads folder
const getAvailableImages = () => {
  const uploadsDir = path.join(__dirname, 'uploads');
  const files = fs.readdirSync(uploadsDir);
  
  // Filter for real image files (larger than 1000 bytes)
  const realImages = files.filter(file => {
    if (file === '.gitkeep') return false;
    
    const filePath = path.join(uploadsDir, file);
    const stats = fs.statSync(filePath);
    return stats.size > 1000; // Real images are larger than 1KB
  });
  
  return realImages;
};

// Missing image filenames that need to be replaced
const missingImageFiles = [
  '1752115688074-665335086-413776592_0.jpg',
  '1752115704935-776105244-413776592_24_0.jpg',
  '1752115709068-219961550-genMid.413776592_5_0.jpg',
  '1752115712984-816162130-genMid.413776592_9_0.jpg',
  '1752115720287-393654054-genMid.413776592_15_0.jpg',
  '1752115727438-358867995-genMid.413776592_19_0.jpg',
  '1752121488187-9179501-9.webp',
  '1752121496777-316481652-413776592_24_0.jpg',
  '1752121503951-905557120-genMid.413776592_9_0.jpg',
  '1752121508368-620593804-genMid.413776592_23_0.jpg',
  '1752118223916-563825331-.webp',
  '1752118229992-685182976-2.webp',
  '1752118235303-911822418-7.webp',
  '1752118273747-832668969-9.webp',
  'test-property-image-1749260861596-438465535.jpg',
  '1749428928268-710498473-genMid.731631728_27_0.jpg'
];

// Replace missing images with available real images
const replaceMissingImages = async () => {
  try {
    console.log('\n🔄 Replacing Missing Images with Real Images...');
    
    const availableImages = getAvailableImages();
    console.log(`📁 Found ${availableImages.length} real images in uploads folder:`);
    availableImages.forEach(img => console.log(`   - ${img}`));
    
    if (availableImages.length === 0) {
      console.log('❌ No real images found. Please upload some images first using the image-upload-helper.html');
      return;
    }
    
    // Get all properties with images
    const properties = await Property.find({ 'images.0': { $exists: true } });
    console.log(`\n📊 Found ${properties.length} properties with images`);
    
    let updatedCount = 0;
    let replacedImagesCount = 0;
    
    for (const property of properties) {
      let hasUpdates = false;
      let imageIndex = 0; // Track which real image to use next
      
      // Update each image URL
      const updatedImages = property.images.map(image => {
        const filename = image.url.split('/').pop();
        
        if (missingImageFiles.includes(filename)) {
          // This is a missing placeholder image, replace it with a real image
          if (imageIndex < availableImages.length) {
            const newImageFile = availableImages[imageIndex % availableImages.length];
            const newUrl = `http://localhost:7001/uploads/${newImageFile}`;
            
            console.log(`🔄 Replacing: ${filename} -> ${newImageFile}`);
            hasUpdates = true;
            replacedImagesCount++;
            imageIndex++;
            
            return {
              ...image.toObject(),
              url: newUrl,
              caption: image.caption || `Property Image ${imageIndex}`
            };
          }
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
    console.log(`🖼️ Replaced ${replacedImagesCount} missing images with real images`);
    
    // Show updated properties
    if (updatedCount > 0) {
      console.log('\n📋 Updated Properties:');
      const updatedProperties = await Property.find({ 'images.0': { $exists: true } })
        .select('title images')
        .limit(5);
      
      updatedProperties.forEach((property, index) => {
        console.log(`${index + 1}. ${property.title}`);
        property.images.forEach((image, imgIndex) => {
          const filename = image.url.split('/').pop();
          const isReal = availableImages.includes(filename);
          console.log(`   Image ${imgIndex + 1}: ${filename} ${isReal ? '✅' : '❌'}`);
        });
        console.log('   ---');
      });
    }
    
  } catch (error) {
    console.error(`❌ Error replacing images: ${error.message}`);
  }
};

// Main function
const main = async () => {
  console.log('🚀 Starting Missing Image Replacement...');
  
  const connection = await connectDB();
  if (connection) {
    await replaceMissingImages();
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
    console.log('\n💡 Refresh your browser to see the updated images!');
  } else {
    console.log('❌ Failed to connect to database');
  }
  
  process.exit(0);
};

// Run the replacement
main().catch(error => {
  console.error('❌ Replacement failed:', error);
  process.exit(1);
});
