// Base controller with common utilities and error handlers
const asyncHandler = require('express-async-handler');

// Custom error class
class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Create a base controller class
class BaseController {
  // Success response
  sendResponse(res, data, statusCode = 200) {
    res.status(statusCode).json(data);
  }

  // Error response
  sendError(res, error, statusCode = 500) {
    res.status(statusCode).json({
      success: false,
      error: error.message || 'Server Error'
    });
  }

  // Async handler wrapper
  asyncHandler(fn) {
    return asyncHandler(fn);
  }

  // Create a new item
  create(Model) {
    return this.asyncHandler(async (req, res) => {
      const item = await Model.create(req.body);
      this.sendResponse(res, item, 201);
    });
  }

  // Get all items
  getAll(Model, populateOptions = null) {
    return this.asyncHandler(async (req, res) => {
      let query = Model.find();
      
      // Populate references if specified
      if (populateOptions) {
        query = query.populate(populateOptions);
      }
      
      const items = await query;
      this.sendResponse(res, items);
    });
  }

  // Get a single item by ID
  getById(Model, populateOptions = null) {
    return this.asyncHandler(async (req, res) => {
      let query = Model.findById(req.params.id);
      
      // Populate references if specified
      if (populateOptions) {
        query = query.populate(populateOptions);
      }
      
      const item = await query;
      
      if (!item) {
        return this.sendError(res, new ErrorResponse(`Resource not found with id ${req.params.id}`, 404));
      }
      
      this.sendResponse(res, item);
    });
  }

  // Update an item
  update(Model) {
    return this.asyncHandler(async (req, res) => {
      let item = await Model.findById(req.params.id);
      
      if (!item) {
        return this.sendError(res, new ErrorResponse(`Resource not found with id ${req.params.id}`, 404));
      }
      
      item = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      });
      
      this.sendResponse(res, item);
    });
  }

  // Delete an item
  delete(Model) {
    return this.asyncHandler(async (req, res) => {
      const item = await Model.findById(req.params.id);
      
      if (!item) {
        return this.sendError(res, new ErrorResponse(`Resource not found with id ${req.params.id}`, 404));
      }
      
      await item.remove();
      
      this.sendResponse(res, { id: req.params.id });
    });
  }
}

module.exports = {
  BaseController,
  ErrorResponse
};
