const { PartnershipRequests } = require('../models');
const { errorHandler } = require('../utils/errorHandler');

/**
 * @desc    Create a new partnership request
 * @route   POST /api/partnership-requests
 * @access  Public
 */
exports.createPartnershipRequest = async (req, res) => {
  try {
    const { companyName, contactName, email, phone, partnershipType, message } = req.body;

    // Create new partnership request
    const partnershipRequest = await PartnershipRequests.create({
      companyName,
      contactName,
      email,
      phone,
      partnershipType,
      message,
      status: 'not revised' // Default status
    });

    res.status(201).json({
      success: true,
      data: partnershipRequest
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

/**
 * @desc    Get all partnership requests
 * @route   GET /api/partnership-requests
 * @access  Admin
 */
exports.getAllPartnershipRequests = async (req, res) => {
  try {
    // Get query parameters for filtering
    const { status } = req.query;
    
    // Build filter object
    const filter = {};
    if (status && status !== 'all') {
      filter.status = status;
    }
    
    // Get all partnership requests with optional filtering
    const partnershipRequests = await PartnershipRequests.find(filter)
      .sort({ createdAt: -1 }); // Sort by newest first
    
    res.status(200).json({
      success: true,
      count: partnershipRequests.length,
      data: partnershipRequests
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

/**
 * @desc    Get a single partnership request by ID
 * @route   GET /api/partnership-requests/:id
 * @access  Admin
 */
exports.getPartnershipRequestById = async (req, res) => {
  try {
    const partnershipRequest = await PartnershipRequests.findById(req.params.id);
    
    if (!partnershipRequest) {
      return res.status(404).json({
        success: false,
        error: 'Partnership request not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: partnershipRequest
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

/**
 * @desc    Update a partnership request
 * @route   PUT /api/partnership-requests/:id
 * @access  Admin
 */
exports.updatePartnershipRequest = async (req, res) => {
  try {
    // Find the partnership request
    let partnershipRequest = await PartnershipRequests.findById(req.params.id);
    
    if (!partnershipRequest) {
      return res.status(404).json({
        success: false,
        error: 'Partnership request not found'
      });
    }
    
    // Update the partnership request
    partnershipRequest = await PartnershipRequests.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // Return the updated document
        runValidators: true // Run model validators
      }
    );
    
    res.status(200).json({
      success: true,
      data: partnershipRequest
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

/**
 * @desc    Delete a partnership request
 * @route   DELETE /api/partnership-requests/:id
 * @access  Admin
 */
exports.deletePartnershipRequest = async (req, res) => {
  try {
    const partnershipRequest = await PartnershipRequests.findById(req.params.id);
    
    if (!partnershipRequest) {
      return res.status(404).json({
        success: false,
        error: 'Partnership request not found'
      });
    }
    
    await PartnershipRequests.deleteOne({ _id: req.params.id });
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    errorHandler(res, error);
  }
};
