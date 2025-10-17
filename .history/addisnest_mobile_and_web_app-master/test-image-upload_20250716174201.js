const FormData = require('form-data');
const fs = require('fs');
const fetch = require('node-fetch');
const path = require('path');

async function testImageUpload() {
    try {
        console.log('🧪 Testing Image Upload Functionality...');
        
        // Check if we have any real images to test with
        const uploadsDir = path.join(__dirname, 'uploads');
        const files = fs.readdirSync(uploadsDir).filter(file => 
            file.endsWith('.jpg') || file.endsWith('.png') || file.endsWith('.webp')
        );
        
        if (files.length === 0) {
            console.log('❌ No test images found in uploads directory');
            return;
        }
        
        const testImagePath = path.join(uploadsDir, files[0]);
        console.log('📁 Using test image:', files[0]);
        
        // Create form data
        const formData = new FormData();
        const fileStream = fs.createReadStream(testImagePath);
        formData.append('file', fileStream, files[0]);
        
        console.log('📤 Sending upload request...');
        
        // Send upload request
        const response = await fetch('http://localhost:7001/api/media/upload', {
            method: 'POST',
            body: formData,
            headers: formData.getHeaders()
        });
        
        console.log('📊 Response status:', response.status);
        console.log('📊 Response headers:', Object.fromEntries(response.headers.entries()));
        
        const responseText = await response.text();
        console.log('📊 Response body:', responseText);
        
        if (response.ok) {
            const data = JSON.parse(responseText);
            console.log('✅ Upload successful!');
            console.log('📁 Uploaded files:', data.files);
        } else {
            console.log('❌ Upload failed');
            console.log('Error:', responseText);
        }
        
