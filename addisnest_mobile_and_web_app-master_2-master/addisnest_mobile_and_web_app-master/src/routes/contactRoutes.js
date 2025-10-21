const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// @route   POST /api/contact/send
// @desc    Send contact form message to contact@addisnest.com
// @access  Public
router.post('/send', contactController.sendContactMessage);

module.exports = router;
