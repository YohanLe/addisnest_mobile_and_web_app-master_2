const { BaseController, ErrorResponse } = require('./baseController');
const { Property } = require('../models');

class PropertyCountController extends BaseController {
  constructor() {
    super();
  }

  // @desc    Get total count of properties
  // @route   GET /api/properties/count
  // @access  Public
  getPropertyCount = this.asyncHandler(async (req, res) => {
    try {
      // Build query based on filters if needed
      const query = {};
      
      // If 'for' parameter is provided, filter by offering type
      if (req.query.for) {
        const offeringTypeMap = {
          'buy': 'For Sale',
          'rent': 'For Rent',
          'sell': 'For Sale',
          'sale': 'For Sale'
        };
        if (offeringTypeMap[req.query.for]) {
          query.offeringType = offeringTypeMap[req.query.for];
        }
      }
      
      // Count total properties
      const total = await Property.countDocuments(query);
      
      // Send response
      this.sendResponse(res, {
        success: true,
        total
      });
    } catch (error) {
      console.error('Error getting property count:', error);
      this.sendError(res, new ErrorResponse('Error getting property count', 500));
    }
  });
}

module.exports = new PropertyCountController();
