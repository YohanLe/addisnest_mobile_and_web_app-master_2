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
    // Validate upload
    if (!req.files || Object.keys(req.files).length === 0) {
      return this.sendError(res, new ErrorResponse('No files were uploaded', 400));
    }

    // Support multiple or single file
    const files = Object.values(req.files).flat();
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
