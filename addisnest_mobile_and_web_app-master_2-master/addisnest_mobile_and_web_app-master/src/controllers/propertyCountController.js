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
      console.log('getPropertyCount called');
      
      // Get actual count from database
      const total = await Property.countDocuments();
      
      // Send response
      this.sendResponse(res, {
        success: true,
        total: total
      });
    } catch (error) {
      console.error('Error getting property count:', error);
      this.sendError(res, new ErrorResponse('Error getting property count', 500));
    }
  });
}

module.exports = new PropertyCountController();
