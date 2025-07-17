/**
 * This module implements a fix for the property detail by MongoDB ID endpoint
 * which is returning 401 Unauthorized errors.
 */

// Function to create an express route handler for MongoDB ID property lookup
const createPropertyByMongoIdHandler = (router, propertyController) => {
// Add a specific route for MongoDB ID property lookup
  // This must be placed BEFORE the /:id route to avoid conflicts and BEFORE auth middleware
  // This is a public endpoint that doesn't require authentication
  router.get('/mongo-id/:id', async (req, res) => {
    try {
      // Get the MongoDB _id from params
      let mongoId = req.params.id;
      
      console.log(`[mongo-id] Lookup called with ID: ${mongoId}`);
      
      // Validate MongoDB ID format
      const isValidMongoId = /^[0-9a-fA-F]{24}$/.test(mongoId);
      if (!isValidMongoId) {
        console.error(`[mongo-id] Invalid MongoDB ID format: ${mongoId}`);
        return res.status(400).json({
          success: false,
          error: `Invalid MongoDB ID format: ${mongoId}`
        });
      }
      
      // Try to find the property - no auth check needed for public endpoint
      const { Property } = require('../models');
      
      // First try direct _id lookup
      let property = await Property.findOne({ _id: mongoId }).populate({
        path: 'owner',
        select: 'firstName lastName email phone'
      });
      
      // If not found, try id field (some records might use id instead of _id)
      if (!property) {
        property = await Property.findOne({ id: mongoId }).populate({
          path: 'owner',
          select: 'firstName lastName email phone'
        });
      }

      if (!property) {
        console.log(`[mongo-id] Property not found with MongoDB _id: ${mongoId}`);
        return res.status(404).json({
          success: false,
          error: `Property not found with MongoDB _id: ${mongoId}`
        });
      }

      console.log(`[mongo-id] Successfully retrieved property with MongoDB _id: ${mongoId}`);

      // Try to increment view count if possible
      try {
        property.views = (property.views || 0) + 1;
        await property.save();
      } catch (viewError) {
        // Log but don't fail if view count update fails
        console.warn(`[mongo-id] Could not update view count: ${viewError.message}`);
      }
      
      // Return the property
      return res.status(200).json({
        success: true,
        data: property
      });
    } catch (error) {
      console.error(`[mongo-id] Error finding property with MongoDB ID:`, error);
      return res.status(500).json({
        success: false,
        error: `Error retrieving property: ${error.message}`
      });
    }
  });

// Add a direct database query endpoint as fallback
  // This is a public endpoint that doesn't require authentication
  router.get('/direct-db-query/:id', async (req, res) => {
    try {
      // Get the MongoDB _id from params
      let mongoId = req.params.id;
      
      console.log(`[direct-db-query] Lookup called with ID: ${mongoId}`);
      
      // Validate MongoDB ID format
      const isValidMongoId = /^[0-9a-fA-F]{24}$/.test(mongoId);
      if (!isValidMongoId) {
        console.error(`[direct-db-query] Invalid MongoDB ID format: ${mongoId}`);
        return res.status(400).json({
          success: false,
          error: `Invalid MongoDB ID format: ${mongoId}`
        });
      }
      
      // Try to find the property directly from the database
      const { Property } = require('../models');
      
      // Try direct _id lookup with minimal projection to improve performance
      let property = await Property.findOne({ _id: mongoId })
        .populate({
          path: 'owner',
          select: 'firstName lastName email phone'
        });

      if (!property) {
        console.log(`[direct-db-query] Property not found with MongoDB _id: ${mongoId}`);
        return res.status(404).json({
          success: false,
          error: `Property not found with MongoDB _id: ${mongoId}`
        });
      }

      console.log(`[direct-db-query] Successfully retrieved property with MongoDB _id: ${mongoId}`);
      
      // Return the property
      return res.status(200).json({
        success: true,
        data: property
      });
    } catch (error) {
      console.error(`[direct-db-query] Error finding property with MongoDB ID:`, error);
      return res.status(500).json({
        success: false,
        error: `Error retrieving property: ${error.message}`
      });
    }
  });

  console.log('MongoDB ID property lookup routes registered');
  return router;
};

module.exports = { createPropertyByMongoIdHandler };
