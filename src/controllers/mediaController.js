const { BaseController, ErrorResponse } = require('./baseController');
const path = require('path');
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const s3 = require('../config/s3');

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
      console.log('=== END DEBUG ===');

      // Check if files exist
      if (!req.files || Object.keys(req.files).length === 0) {
        return this.sendError(
          res,
          new ErrorResponse('No files were uploaded', 400)
        );
      }

      // Handle different field names
      let files = [];

      if (req.files.mediaFiles) {
        files = Array.isArray(req.files.mediaFiles)
          ? req.files.mediaFiles
          : [req.files.mediaFiles];
      } else if (req.files.file) {
        files = Array.isArray(req.files.file)
          ? req.files.file
          : [req.files.file];
      } else if (req.files.images) {
        files = Array.isArray(req.files.images)
          ? req.files.images
          : [req.files.images];
      } else {
        files = Object.values(req.files).flat();
      }

      if (files.length === 0) {
        return this.sendError(
          res,
          new ErrorResponse('No valid files found', 400)
        );
      }

      const uploadedFiles = [];

      // Process each file
      for (const file of files) {

        console.log('Processing file:', {
          name: file.name,
          mimetype: file.mimetype,
          size: file.size
        });

        // Only allow images
        if (!file.mimetype.startsWith('image/')) {
          return this.sendError(
            res,
            new ErrorResponse('Please upload image files only', 400)
          );
        }

        // Max 50MB
        if (file.size > 50 * 1024 * 1024) {
          return this.sendError(
            res,
            new ErrorResponse('File size too large. Maximum 50MB allowed.', 400)
          );
        }

        try {

          const fileExtension = path.extname(file.name);

          const s3FileName =
            `${Date.now()}-${Math.round(Math.random() * 1E9)}${fileExtension}`;

          const s3Key = `properties/${s3FileName}`;

          await s3.send(
            new PutObjectCommand({
              Bucket: process.env.AWS_BUCKET_NAME,
              Key: s3Key,
              Body: file.data,
              ContentType: file.mimetype,
            })
          );

          const fileUrl =
            `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;

          uploadedFiles.push({
            filename: s3FileName,
            originalName: file.name,
            mimetype: file.mimetype,
            size: file.size,
            path: fileUrl,
            url: fileUrl,
          });

        } catch (moveError) {

          console.error('Error uploading to S3:', moveError);

          throw new Error(
            `Failed to upload file: ${moveError.message}`
          );
        }
      }

      console.log('Successfully uploaded files:', uploadedFiles.length);

      this.sendResponse(res, {
        success: true,
        count: uploadedFiles.length,
        files: uploadedFiles,
      });

    } catch (error) {

      console.error('Media upload error:', error);
      console.error('Error stack:', error.stack);

      return this.sendError(
        res,
        new ErrorResponse(error.message || 'Upload failed', 500)
      );
    }
  });
}

module.exports = new MediaController();
