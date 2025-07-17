// Export all controllers for easier imports
const userController = require('./userController');
const propertyController = require('./propertyController');
const conversationController = require('./conversationController');
const messageController = require('./messageController');
const notificationController = require('./notificationController');
const paymentController = require('./paymentController');
const connectionTestController = require('./connectionTestController');
const mediaController = require('./mediaController');
const partnershipRequestController = require('./partnershipRequestController');
const { BaseController, ErrorResponse } = require('./baseController');

module.exports = {
  userController,
  propertyController,
  conversationController,
  messageController,
  notificationController,
  paymentController,
  connectionTestController,
  mediaController,
  partnershipRequestController,
  BaseController,
  ErrorResponse
};
