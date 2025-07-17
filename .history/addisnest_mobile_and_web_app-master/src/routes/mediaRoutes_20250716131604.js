const express = require('express');
const { mediaController } = require('../controllers');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Debug middleware for media upload
router.use('/upload', (req, res, next) => {
  console.log('=== MEDIA ROUTE DEBUG ===');
  console.log('Method:', req.method);
  console.log('Content-Type:', req.headers['content-type']);
  console.log('Content-Length:', req.headers['content-length']);
  console.log('Has files:', !!req.files);
  console.log('Files keys:', req.files ? Object.keys(req.files) : 'none');
  console.log('Body keys:', Object.keys(req.body || {}));
  console.log('=== END MEDIA ROUTE DEBUG ===');
  next();
});

// Error handling middleware specifically for busboy errors
router.use('/upload', (err, req, res, next) => {
  if (err && err.message && err.message.includes('Unexpected end of form')) {
    console.log('Caught busboy "Unexpected end of form" error - this is usually harmless');
    // If files were successfully processed, continue normally
    if (req.files && Object.keys(req.files).length > 0) {
      console.log('Files were processed successfully despite busboy error');
      return next();
    }
  }
  next(err);
});

/**
 * @route   POST /api/media/upload
 * @desc    Upload media files
 * @access  Public (temporarily for debugging)
 */
router.post('/upload', mediaController.uploadMedia);

module.exports = router;
