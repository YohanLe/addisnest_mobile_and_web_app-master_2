const http = require('http');
const fs = require('fs');
const path = require('path');

// Create a simple multipart form data manually
function createMultipartData(filePath, fieldName) {
    const boundary = '----WebKitFormBoundary' + Math.random().toString(16);
    const fileName = path.basename(filePath);
    const fileContent = fs.readFileSync(filePath);
    
    let data = '';
    data += `--${boundary}\r\n`;
    data += `Content-Disposition: form-data; name="${fieldName}"; filename="${fileName}"\r\n`;
    data += `Content-Type: text/plain\r\n\r\n`;
    
    const header = Buffer.from(data, 'utf8');
    const footer = Buffer.from(`\r\n--${boundary}--\r\n`, 'utf8');
    
    return {
        boundary,
        data: Buffer.concat([header, fileContent, footer])
    };
}

async function testUpload() {
    try {
        console.log('Testing upload functionality...');
        
        // Create multipart data
        const multipart = createMultipartData('./test-image.txt', 'mediaFiles');
        
        const options = {
            hostname: 'localhost',
            port: 7000, // Using port 7000 as seen in terminal
            path: '/api/media/upload',
            method: 'POST',
            headers: {
                'Content-Type': `multipart/form-data; boundary=${multipart.boundary}`,
                'Content-Length': multipart.data.length
            }
        };
        
        console.log('Sending upload request to http://localhost:7000/api/media/upload...');
        
        const req = http.request(options, (res) => {
            console.log('Response status:', res.statusCode);
            console.log('Response headers:', res.headers);
            
            let responseData = '';
            res.on('data', (chunk) => {
                responseData += chunk;
            });
            
            res.on('end', () => {
                console.log('Response body:', responseData);
                
                if (res.statusCode === 200) {
                    console.log('✅ Upload test PASSED - No "Unexpected end of form" error!');
                    try {
                        const jsonResponse = JSON.parse(responseData);
                        console.log('Parsed response:', JSON.stringify(jsonResponse, null, 2));
                    } catch (e) {
                        console.log('Response is not JSON, but upload succeeded');
                    }
                } else {
                    console.log('❌ Upload test FAILED');
                    if (responseData.includes('Unexpected end of form')) {
                        console.log('❌ "Unexpected end of form" error still present!');
                    }
                }
            });
        });
        
        req.on('error', (error) => {
            console.error('❌ Upload test ERROR:', error.message);
            if (error.message.includes('Unexpected end of form')) {
                console.log('❌ "Unexpected end of form" error still present!');
            }
        });
        
        req.write(multipart.data);
        req.end();
        
    } catch (error) {
        console.error('❌ Upload test ERROR:', error.message);
    }
}

// Run the test
testUpload();
