const express = require('express');
const { notificationController } = require('../controllers');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All notification routes require authentication
router.use(protect);

router.route('/')
  .get(notificationController.getUserNotifications)
  .delete(notificationController.deleteAllNotifications);

router.get('/unread/count', notificationController.getUnreadCount);
router.put('/read-all', notificationController.markAllAsRead);
router.put('/:id/read', notificationController.markAsRead);
router.delete('/:id', notificationController.deleteNotification);

// Admin only route
router.post('/system', authorize('admin'), notificationController.createSystemNotification);

module.exports = router;
