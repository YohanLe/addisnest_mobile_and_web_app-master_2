const userRoutes = require('./userRoutes');
const authRoutes = require('./authRoutes');
// Use our fixed property routes with MongoDB ID endpoint implementation
const propertyRoutes = require('./propertyRoutes');
const propertySubmitRoute = require('./propertySubmitRoute');
const propertyCountRoutes = require('./propertyCountRoutes');
const conversationRoutes = require('./conversationRoutes');
const messageRoutes = require('./messageRoutes');
const notificationRoutes = require('./notificationRoutes');
const paymentRoutes = require('./paymentRoutes');
const connectionTestRoutes = require('./connectionTestRoutes');
const mediaRoutes = require('./mediaRoutes');
const agentRoutes = require('./agentRoutes');
const partnershipRequestRoutes = require('./partnershipRequestRoutes');

module.exports = {
  agentRoutes,
  userRoutes,
  authRoutes,
  propertyRoutes,
  propertySubmitRoute,
  propertyCountRoutes,
  conversationRoutes,
  messageRoutes,
  notificationRoutes,
  paymentRoutes,
  connectionTestRoutes,
  mediaRoutes,
  partnershipRequestRoutes
};
