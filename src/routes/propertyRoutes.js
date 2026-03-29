const express = require('express');
const { propertyController } = require('../controllers');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', propertyController.getAllProperties);
router.get('/search', propertyController.searchProperties);
router.get('/featured', propertyController.getFeaturedProperties);
router.get('/mongo-id/:id', propertyController.getPropertyByMongoId);
router.get('/user/:userId', propertyController.getPropertiesByUser);
// Property detail route must be public (before protect middleware)
router.get('/:id', propertyController.getPropertyById);

// Protected routes (require authentication)
router.use(protect);

// Admin-only routes for property approval
router.get('/pending', authorize('admin'), propertyController.getPendingProperties);
router.put('/:id/approve', authorize('admin'), propertyController.approveProperty);
router.put('/:id/reject', authorize('admin'), propertyController.rejectProperty);

// Property CRUD operations - now with integrated address middleware
router.post('/', authorize('agent', 'customer', 'admin'), propertyController.createProperty);
router.put('/:id', authorize('agent', 'customer', 'admin'), propertyController.updateProperty);
router.put('/:id/status', authorize('agent', 'customer', 'admin'), propertyController.updatePropertyStatus);
router.delete('/:id', propertyController.deleteProperty);
router.put('/:id/photos', propertyController.uploadPropertyPhotos);

module.exports = router;
