const { BaseController, ErrorResponse } = require('./baseController');
const path = require('path');
const fs = require('fs');

class MediaController extends BaseController {
  constructor() {
    super();
  }

  // @desc    Upload media files
  // @route   POST /api/media/upload
  // @access  Private
  uploadMedia = this.asyncHandler(async (req, res) => {
    try {
      console.log('=== MEDIA UPLOAD DEBUG ===');
      console.log('req.files:', req.files);
      console.log('req.body:', req.body);
      console.log('Content-Type:', req.headers['content-type']);
      console.log('Request method:', req.method);
      console.log('Request URL:', req.url);
      console.log('Available request properties:', Object.keys(req));
      console.log('=== END DEBUG ===');

      // Check if files exist in the request
      if (!req.files || Object.keys(req.files).length === 0) {
        console.error('No files found in request');
        console.error('Request headers:', req.headers);
        console.error('Request body:', req.body);
        
        // Check if this is a multipart request
        const contentType = req.headers['content-type'] || '';
        if (!contentType.includes('multipart/form-data')) {
          return this.sendError(res, new ErrorResponse('Request must be multipart/form-data', 400));
        }
        
        return this.sendError(res, new ErrorResponse('No files were uploaded', 400));
      }

      // Support multiple or single file - check for different field names
      let files = [];
      if (req.files.mediaFiles) {
        files = Array.isArray(req.files.mediaFiles) ? req.files.mediaFiles : [req.files.mediaFiles];
      } else if (req.files.file) {
        // Handle single file upload with 'file' field name
        files = Array.isArray(req.files.file) ? req.files.file : [req.files.file];
      } else if (req.files.images) {
        // Handle 'images' field name
        files = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
      } else {
        // Fallback to any files in the request
        files = Object.values(req.files).flat();
      }
      
      console.log('Processing files:', files.length);
      if (files.length === 0) {
        console.error('No files to process after parsing');
        return this.sendError(res, new ErrorResponse('No valid files found', 400));
      }
      
      const uploadedFiles = [];

      // Prepare upload directory
      const uploadsDir = path.join(__dirname, '..', '..', 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
        console.log('Created uploads directory:', uploadsDir);
      }

      // Process each file
      for (const file of files) {
        console.log('Processing file:', {
          name: file.name,
          mimetype: file.mimetype,
          size: file.size,
          tempFilePath: file.tempFilePath
        });

        // Only accept images
        if (!file.mimetype.startsWith('image/')) {
          return this.sendError(res, new ErrorResponse('Please upload image files only', 400));
        }

        // Validate file size (50MB limit)
        if (file.size > 50 * 1024 * 1024) {
          return this.sendError(res, new ErrorResponse('File size too large. Maximum 50MB allowed.', 400));
        }

        const fileName = `${Date.now()}-${Math.floor(Math.random() * 1e9)}-${file.name}`;
        const fullPath = path.join(uploadsDir, fileName);

        try {
          // Move the file
          await file.mv(fullPath);
          console.log('File moved successfully to:', fullPath);

          // Verify file was created
          if (!fs.existsSync(fullPath)) {
            throw new Error('File was not created successfully');
          }

          uploadedFiles.push({
            filename: fileName,
            originalName: file.name,
            mimetype: file.mimetype,
            size: file.size,
            path: `/uploads/${fileName}`,
            url: `/uploads/${fileName}`,
          });
        } catch (moveError) {
          console.error('Error moving file:', moveError);
          throw new Error(`Failed to save file: ${moveError.message}`);
        }
      }

      console.log('Successfully processed files:', uploadedFiles.length);

      // Respond
      this.sendResponse(res, {
        success: true,
        count: uploadedFiles.length,
        files: uploadedFiles,
      });
    
    } catch (error) {
      console.error('Media upload error:', error);
      console.error('Error stack:', error.stack);
      return this.sendError(res, new ErrorResponse(error.message || 'Upload failed', 500));
    }
  });
}

module.exports = new MediaController();
