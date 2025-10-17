const express = require('express');
const { propertyController } = require('../controllers');
// Import the new nested address controller
const propertyControllerNested = require('../controllers/propertyController-nested');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', propertyController.getAllProperties);
router.get('/search', propertyController.searchProperties);
router.get('/featured', propertyController.getFeaturedProperties);
router.get('/mongo-id/:id', propertyController.getPropertyByMongoId);
router.get('/user/:userId', propertyController.getPropertiesByUser);
// This route should be last among public routes to avoid conflicts with specific routes
router.get('/:id', propertyController.getPropertyById);

// Protected routes (require authentication)
router.use(protect);

// Admin-only routes for property approval
router.get('/pending', authorize('admin'), propertyController.getPendingProperties);
router.put('/:id/approve', authorize('admin'), propertyController.approveProperty);
router.put('/:id/reject', authorize('admin'), propertyController.rejectProperty);

// Use the nested address controller for create and update operations
router.post('/', authorize('agent', 'customer', 'admin'), propertyControllerNested.createProperty);
router.put('/:id', authorize('agent', 'customer', 'admin'), propertyControllerNested.updateProperty);
router.put('/:id/status', authorize('agent', 'customer', 'admin'), propertyController.updatePropertyStatus);
router.delete('/:id', propertyController.deleteProperty);
router.put('/:id/photos', propertyController.uploadPropertyPhotos);

module.exports = router;
