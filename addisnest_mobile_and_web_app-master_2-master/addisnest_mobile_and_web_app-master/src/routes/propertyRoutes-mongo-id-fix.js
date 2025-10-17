/**
 * Property routes with MongoDB ID lookup fix
 * 
 * This version places public MongoDB ID lookup routes BEFORE authentication middleware
 * to ensure they can be accessed without authentication.
 */

const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');
const { protect } = require('../middleware/auth');

// PUBLIC ROUTES - Must be defined BEFORE the protect middleware
// ============================================================

// Special route for fetching property by MongoDB ID (no auth required)
router.get('/mongo-id/:id', async (req, res) => {
  try {
    console.log(`MongoDB ID lookup for: ${req.params.id}`);
    const property = await require('../models/Property').findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        error: 'Property not found with that MongoDB ID'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: property
    });
  } catch (error) {
    console.error(`Error in MongoDB ID lookup: ${error.message}`);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Direct database query route as a fallback
router.get('/direct-db-query/:id', async (req, res) => {
  try {
    console.log(`Direct DB query for ID: ${req.params.id}`);
    const property = await require('../models/Property').findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        error: 'Property not found via direct DB query'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: property
    });
  } catch (error) {
    console.error(`Error in direct DB query: ${error.message}`);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Standard public property routes (no auth required)
router.get('/:id', propertyController.getPropertyById);
router.get('/', propertyController.getAllProperties);

// PROTECTED ROUTES - Only accessible with authentication
// =====================================================

// Apply authentication middleware to all routes below this
router.use(protect);

// Property CRUD operations (require authentication)
router.post('/', propertyController.createProperty);
router.put('/:id', propertyController.updateProperty);
router.delete('/:id', propertyController.deleteProperty);

// User-specific property routes (require authentication)
router.get('/user/:userId', propertyController.getPropertiesByUser);

module.exports = router;
