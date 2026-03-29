const express = require('express');
const scheduleController = require('../controllers/scheduleController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/availability/:propertyId/:date', scheduleController.getAvailableTimeSlots);

// Protected routes (require authentication)
router.use(protect);

// Schedule CRUD operations
router.post('/', authorize('customer', 'agent', 'admin'), scheduleController.createSchedule);
router.get('/', scheduleController.getUserSchedules);
router.get('/:id', scheduleController.getScheduleById);
router.put('/:id/status', scheduleController.updateScheduleStatus);
router.delete('/:id', scheduleController.deleteSchedule);

// Property-specific schedules (for property owners)
router.get('/property/:propertyId', scheduleController.getPropertySchedules);

module.exports = router;
