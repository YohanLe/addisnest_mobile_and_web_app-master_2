const express = require('express');
const { propertyController } = require('../controllers');
const { protect } = require('../middleware/auth');

const router = express.Router();

/**
 * @route   POST /api/property-submit
 * @desc    Submit a property and set it to pending_payment status
 * @access  Private
 */
const { authorize } = require('../middleware/auth');
router.post('/', protect, authorize('agent', 'customer', 'admin'), propertyController.submitPropertyPending);

module.exports = router;
