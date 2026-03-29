const express = require('express');
const { connectionTestController } = require('../controllers');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All connection test routes require authentication
router.use(protect);

router.route('/')
  .post(connectionTestController.createTest)
  .get(connectionTestController.getUserTests);

router.route('/:id')
  .get(connectionTestController.getTest)
  .put(connectionTestController.updateTestResults)
  .delete(connectionTestController.deleteTest);

// Admin only routes
router.get('/stats', authorize('admin'), connectionTestController.getTestStats);

module.exports = router;
