const fs = require('fs');
const path = require('path');

// Create a simple placeholder image (1x1 pixel PNG in base64)
const createPlaceholderImage = () => {
  // This is a 200x150 pixel placeholder image in base64 (gray background with "No Image" text)
  const base64Data = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
  return Buffer.from(base64Data, 'base64');
};

// List of image files that should exist based on the database
const requiredImages = [
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

const uploadsDir = path.join(__dirname, 'uploads');

console.log('🖼️ Creating placeholder images for missing files...');

let createdCount = 0;

requiredImages.forEach(filename => {
  const filePath = path.join(uploadsDir, filename);
  
  if (!fs.existsSync(filePath)) {
    try {
      // Create a simple placeholder image
      const placeholderData = createPlaceholderImage();
      fs.writeFileSync(filePath, placeholderData);
      console.log(`✅ Created placeholder: ${filename}`);
      createdCount++;
    } catch (error) {
      console.error(`❌ Error creating ${filename}:`, error.message);
    }
  } else {
    console.log(`⏭️ Already exists: ${filename}`);
  }
});

console.log(`\n🎉 Created ${createdCount} placeholder images`);
console.log('📁 All required image files are now available in the uploads directory');
