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
// This route should be last to avoid conflicts with specific routes like /count
router.get('/:id', propertyController.getPropertyById);

// Protected routes (require authentication)
router.use(protect);
// Use the nested address controller for create and update operations
router.post('/', authorize('agent', 'customer', 'admin'), propertyControllerNested.createProperty);
router.put('/:id', propertyControllerNested.updateProperty);
router.delete('/:id', propertyController.deleteProperty);
router.put('/:id/photos', propertyController.uploadPropertyPhotos);

module.exports = router;
