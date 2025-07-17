const express = require('express');
const { mediaController } = require('../controllers');
const { protect } = require('../middleware/auth');

const router = express.Router();

/**
 * @route   POST /api/media/upload
 * @desc    Upload media files
 * @access  Public (temporarily for debugging)
 */
router.post('/upload', mediaController.uploadMedia);

module.exports = router;
