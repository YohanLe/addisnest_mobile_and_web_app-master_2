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
      console.log('=== END DEBUG ===');

      // Validate upload
      if (!req.files || Object.keys(req.files).length === 0) {
        console.error('No files found in request');
        console.error('Available request properties:', Object.keys(req));
        return this.sendError(res, new ErrorResponse('No files were uploaded', 400));
      }

      // Support multiple or single file - check for mediaFiles field specifically
      let files = [];
      if (req.files.mediaFiles) {
        files = Array.isArray(req.files.mediaFiles) ? req.files.mediaFiles : [req.files.mediaFiles];
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
    }

    // Process each file
    for (const file of files) {
      // Only accept images
      if (!file.mimetype.startsWith('image/')) {
        return this.sendError(res, new ErrorResponse('Please upload image files only', 400));
      }

      const fileName = `${Date.now()}-${Math.floor(Math.random() * 1e9)}-${file.name}`;
      const fullPath = path.join(uploadsDir, fileName);

      // Move the file
      await file.mv(fullPath);

      uploadedFiles.push({
        filename: fileName,
        originalName: file.name,
        mimetype: file.mimetype,
        size: file.size,
        path: `/uploads/${fileName}`,
        url: `/uploads/${fileName}`,
      });
    }

    // Respond
    this.sendResponse(res, {
      success: true,
      count: uploadedFiles.length,
      files: uploadedFiles,
    });
  });
}

module.exports = new MediaController();
