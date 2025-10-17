const { BaseController, ErrorResponse } = require('./baseController');
const { ConnectionTest } = require('../models');

class ConnectionTestController extends BaseController {
  constructor() {
    super();
  }

  // @desc    Create a new connection test
  // @route   POST /api/connectiontests
  // @access  Private
  createTest = this.asyncHandler(async (req, res) => {
    const { testType, endpoint, requestData, userAgent, ipAddress } = req.body;
    
    // Create initial test entry
    const test = await ConnectionTest.create({
      user: req.user.id,
      testType,
      endpoint,
      requestData: requestData || {},
      status: 'pending',
      userAgent: userAgent || req.headers['user-agent'],
      ipAddress: ipAddress || req.ip
    });
    
    this.sendResponse(res, test, 201);
  });

  // @desc    Update connection test results
  // @route   PUT /api/connectiontests/:id
  // @access  Private
  updateTestResults = this.asyncHandler(async (req, res) => {
    const { status, responseData, responseTime, errorMessage } = req.body;
    
    const test = await ConnectionTest.findById(req.params.id);
    
    if (!test) {
      return this.sendError(res, new ErrorResponse(`Connection test not found with id of ${req.params.id}`, 404));
    }
    
    // Check if user is the test creator
    if (test.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return this.sendError(res, new ErrorResponse(`Not authorized to update this test`, 401));
    }
    
    // Update test results
    test.status = status || test.status;
    test.responseData = responseData || test.responseData;
    test.responseTime = responseTime || test.responseTime;
    test.errorMessage = errorMessage || test.errorMessage;
    test.updatedAt = Date.now();
    
    await test.save();
    
    this.sendResponse(res, test);
  });

  // @desc    Get all connection tests for a user
  // @route   GET /api/connectiontests
  // @access  Private
  getUserTests = this.asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    // Get total count for pagination
    const total = await ConnectionTest.countDocuments({ user: req.user.id });
    
    // Find tests for the user with pagination
    const tests = await ConnectionTest.find({ user: req.user.id })
      .sort('-testDate')
      .skip(startIndex)
      .limit(limit);
    
    // Pagination result
    const pagination = {
      total,
      pages: Math.ceil(total / limit),
      page,
      limit
    };
    
    this.sendResponse(res, {
      count: tests.length,
      pagination,
      data: tests
    });
  });

  // @desc    Get a single connection test
  // @route   GET /api/connectiontests/:id
  // @access  Private
  getTest = this.asyncHandler(async (req, res) => {
    const test = await ConnectionTest.findById(req.params.id);
    
    if (!test) {
      return this.sendError(res, new ErrorResponse(`Connection test not found with id of ${req.params.id}`, 404));
    }
    
    // Check if user is the test creator or admin
    if (test.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return this.sendError(res, new ErrorResponse(`Not authorized to access this test`, 401));
    }
    
    this.sendResponse(res, test);
  });

  // @desc    Delete a connection test
  // @route   DELETE /api/connectiontests/:id
  // @access  Private
  deleteTest = this.asyncHandler(async (req, res) => {
    const test = await ConnectionTest.findById(req.params.id);
    
    if (!test) {
      return this.sendError(res, new ErrorResponse(`Connection test not found with id of ${req.params.id}`, 404));
    }
    
    // Check if user is the test creator or admin
    if (test.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return this.sendError(res, new ErrorResponse(`Not authorized to delete this test`, 401));
    }
    
    await test.remove();
    
    this.sendResponse(res, { success: true });
  });

  // @desc    Get connection test statistics (admin only)
  // @route   GET /api/connectiontests/stats
  // @access  Private/Admin
  getTestStats = this.asyncHandler(async (req, res) => {
    // Get total tests
    const totalTests = await ConnectionTest.countDocuments();
    
    // Get test counts by type
    const testsByType = await ConnectionTest.aggregate([
      {
        $group: {
          _id: '$testType',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Get test counts by status
    const testsByStatus = await ConnectionTest.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Get average response time
    const avgResponseTime = await ConnectionTest.aggregate([
      {
        $match: { 
          responseTime: { $gt: 0 } 
        }
      },
      {
        $group: {
          _id: '$testType',
          avgTime: { $avg: '$responseTime' }
        }
      }
    ]);
    
    // Get recent tests
    const recentTests = await ConnectionTest.find()
      .sort('-testDate')
      .limit(10)
      .populate({
        path: 'user',
        select: 'firstName lastName email'
      });
    
    this.sendResponse(res, {
      totalTests,
      testsByType,
      testsByStatus,
      avgResponseTime,
      recentTests
    });
  });
}

module.exports = new ConnectionTestController();
