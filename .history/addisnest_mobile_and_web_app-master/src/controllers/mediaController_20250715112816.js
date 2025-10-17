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
    // Check if file was uploaded
    if (!req.files || Object.keys(req.files).length === 0) {
      return this.sendError(res, new ErrorResponse('No files were uploaded', 400));
    }

    // Handle either single file or multiple files
    const files = Object.values(req.files);
    let mediaFiles = files.flat();

    const uploadedFiles = [];

    // Process each file
    for (const file of mediaFiles) {
      // Check file type
      if (!file.mimetype.startsWith('image/')) {
        return this.sendError(res, new ErrorResponse('Please upload image files only', 400));
      }

      // Create custom filename
      const fileName = `${Date.now()}-${Math.floor(Math.random() * 1000000000)}-${file.name}`;
      const uploadPath = path.join(process.env.FILE_UPLOAD_PATH || '../uploads', fileName);

      // Ensure uploads directory exists
      const uploadsDir = path.join(__dirname, '..', '..', 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      // Move file to the uploads directory
      await file.mv(path.join(uploadsDir, fileName));

      // Add file info to uploadedFiles array
      uploadedFiles.push({
        filename: fileName,
        originalName: file.name,
        mimetype: file.mimetype,
        size: file.size,
        path: `/uploads/${fileName}`, // The public URL path
        url: `/uploads/${fileName}` // The public URL
      });
    }

    // Return success response with uploaded files info
    this.sendResponse(res, {
      success: true,
      count: uploadedFiles.length,
      files: uploadedFiles
    });
  });
}

module.exports = new MediaController();
