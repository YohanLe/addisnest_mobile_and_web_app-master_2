const fs = require('fs');
const path = require('path');

// Create a proper placeholder image using Canvas (if available) or SVG
const createProperPlaceholderImage = (filename) => {
  // Create an SVG placeholder image
  const width = 400;
  const height = 300;
  
  const svgContent = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#f0f0f0"/>
  <rect x="10" y="10" width="${width-20}" height="${height-20}" fill="none" stroke="#ddd" stroke-width="2" stroke-dasharray="5,5"/>
  <text x="50%" y="40%" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="#999">Property Image</text>
  <text x="50%" y="55%" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="#bbb">Not Available</text>
  <text x="50%" y="70%" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="#ccc">${filename}</text>
</svg>`;

  return Buffer.from(svgContent);
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

console.log('🖼️ Creating proper placeholder images...');

let createdCount = 0;

requiredImages.forEach(filename => {
  const filePath = path.join(uploadsDir, filename);
  
  // Always recreate to replace the tiny 1x1 pixel images
  try {
    // Create SVG placeholder with filename extension
    const extension = path.extname(filename).toLowerCase();
    let outputFilename = filename;
    
    // For WebP files, create as SVG but keep original name for URL compatibility
    if (extension === '.webp' || extension === '.jpg' || extension === '.jpeg') {
      const svgFilename = filename.replace(/\.(webp|jpg|jpeg)$/i, '.svg');
      const svgPath = path.join(uploadsDir, svgFilename);
      
      // Create SVG version
      const placeholderData = createProperPlaceholderImage(filename);
      fs.writeFileSync(svgPath, placeholderData);
      
      // Also create the original filename as SVG content for compatibility
      fs.writeFileSync(filePath, placeholderData);
    } else {
      // For other files, create as SVG
      const placeholderData = createProperPlaceholderImage(filename);
      fs.writeFileSync(filePath, placeholderData);
    }
    
    console.log(`✅ Created proper placeholder: ${filename}`);
    createdCount++;
  } catch (error) {
    console.error(`❌ Error creating ${filename}:`, error.message);
  }
});

console.log(`\n🎉 Created ${createdCount} proper placeholder images`);
console.log('📁 All image files now have visible placeholders');
console.log('💡 These placeholders will show "Property Image Not Available" instead of black areas');
