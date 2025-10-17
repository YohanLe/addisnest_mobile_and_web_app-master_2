const express = require('express');
const { paymentController } = require('../controllers');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All payment routes require authentication
router.use(protect);

router.route('/')
  .post(paymentController.createPayment)
  .get(paymentController.getUserPayments);

router.get('/property/:propertyId', paymentController.getPropertyPayments);
router.get('/history', paymentController.getUserPayments);
router.get('/:id', paymentController.getPayment);

// Admin only routes
router.put('/:id/status', authorize('admin'), paymentController.updatePaymentStatus);
router.get('/stats', authorize('admin'), paymentController.getPaymentStats);

module.exports = router;
