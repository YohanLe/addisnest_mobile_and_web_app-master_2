// Export all models for easier imports throughout the application
const User = require('./User');
const Property = require('./Property');
const Conversation = require('./Conversation');
const Message = require('./Message');
const Notification = require('./Notification');
const Payment = require('./Payment');
const ConnectionTest = require('./ConnectionTest');
const PartnershipRequest = require('./PartnershipRequest');
const PartnershipRequests = require('./partnershiprequests');
const OtpVerification = require('./OtpVerification');

module.exports = {
  User,
  Property,
  Conversation,
  Message,
  Notification,
  Payment,
  ConnectionTest,
  PartnershipRequest,
  PartnershipRequests,
  OtpVerification
};
