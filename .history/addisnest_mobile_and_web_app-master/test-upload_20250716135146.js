const fs = require('fs');
const FormData = require('form-data');
const fetch = require('node-fetch');

async function testUpload() {
    try {
        console.log('Testing upload functionality...');
        
        // Create a FormData object
        const form = new FormData();
        
        // Add the test file
        const fileStream = fs.createReadStream('./test-image.txt');
        form.append('mediaFiles', fileStream, {
            filename: 'test-image.txt',
            contentType: 'text/plain'
        });
        
        console.log('Sending upload request...');
        
        // Send the request
        const response = await fetch('http://localhost:7001/api/media/upload', {
            method: 'POST',
            body: form,
            headers: form.getHeaders()
        });
        
        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));
        
        const responseText = await response.text();
        console.log('Response body:', responseText);
        
        if (response.ok) {
            console.log('✅ Upload test PASSED - No "Unexpected end of form" error!');
            try {
                const jsonResponse = JSON.parse(responseText);
                console.log('Parsed response:', JSON.stringify(jsonResponse, null, 2));
            } catch (e) {
                console.log('Response is not JSON, but upload succeeded');
            }
        } else {
            console.log('❌ Upload test FAILED');
            if (responseText.includes('Unexpected end of form')) {
                console.log('❌ "Unexpected end of form" error still present!');
            }
        }
        
    } catch (error) {
        console.error('❌ Upload test ERROR:', error.message);
        if (error.message.includes('Unexpected end of form')) {
            console.log('❌ "Unexpected end of form" error still present!');
        }
    }
}

// Run the test
testUpload();
