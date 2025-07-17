const express = require('express');
const { propertyController } = require('../controllers');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', propertyController.getAllProperties);
router.get('/search', propertyController.searchProperties);
router.get('/featured', propertyController.getFeaturedProperties);
// router.get('/mongo-id/:id', propertyController.getPropertyByMongoId); // Commenting out as this method doesn't exist
router.get('/:id', propertyController.getPropertyById);
router.get('/user/:userId', propertyController.getPropertiesByUser);

// Protected routes (require authentication)
router.use(protect);
// Use the main controller with our fixes applied
router.post('/', authorize('agent', 'customer', 'admin'), propertyController.createProperty);
router.put('/:id', authorize('agent','customer', 'admin'), propertyController.updateProperty);
router.delete('/:id', authorize('agent','customer','admin'), propertyController.deleteProperty);
router.put('/:id/photos', authorize('agent','customer','admin'), propertyController.uploadPropertyPhotos);

module.exports = router;
 