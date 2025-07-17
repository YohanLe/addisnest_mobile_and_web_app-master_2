const express = require('express');
const router = express.Router();
const propertyCountController = require('../controllers/propertyCountController');

// @route   GET /api/properties/count
// @desc    Get total count of properties
// @access  Public
router.get('/', propertyCountController.getPropertyCount);

module.exports = router;
