const express = require('express');
const { propertyController } = require('../controllers');
// Import the fixed controller that normalizes image formats
const propertyControllerNestedFix = require('../controllers/propertyController-nested-fix');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', propertyController.getAllProperties);
router.get('/search', propertyController.searchProperties);
router.get('/featured', propertyController.getFeaturedProperties);
router.get('/mongo-id/:id', propertyController.getPropertyByMongoId);
router.get('/:id', propertyController.getPropertyById);
router.get('/user/:userId', propertyController.getPropertiesByUser);

// Protected routes (require authentication)
router.use(protect);
// Use the fixed controller with image format normalization for create and update operations
router.post('/', authorize('agent', 'customer', 'admin'), propertyControllerNestedFix.createProperty);
router.put('/:id', propertyControllerNestedFix.updateProperty);
router.delete('/:id', propertyController.deleteProperty);
router.put('/:id/photos', propertyController.uploadPropertyPhotos);

// Special MongoDB routes for property with ID 684a51f37cb3172bbb3c73a3
router.post('/mongo-update/:id', propertyControllerNestedFix.updateMongoProperty);
router.put('/mongo-id/:id', propertyControllerNestedFix.updateMongoProperty);
router.patch('/mongo-id/:id', propertyControllerNestedFix.updateMongoProperty);

module.exports = router;
