const express = require('express');
const router = express.Router();
const { partnershipRequestController } = require('../controllers');
const { protect, authorize } = require('../middleware/auth');

// Public route for creating partnership requests
router.post('/', partnershipRequestController.createPartnershipRequest);

// Admin-only routes
router.get('/', protect, authorize('admin'), partnershipRequestController.getAllPartnershipRequests);
router.get('/:id', protect, authorize('admin'), partnershipRequestController.getPartnershipRequestById);
router.put('/:id', protect, authorize('admin'), partnershipRequestController.updatePartnershipRequest);
router.delete('/:id', protect, authorize('admin'), partnershipRequestController.deletePartnershipRequest);

module.exports = router;
