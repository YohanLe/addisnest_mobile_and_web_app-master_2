const mongoose = require('mongoose');

const ConnectionTestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  testType: {
    type: String,
    required: true,
    enum: ['api', 'database', 'payment_gateway', 'messaging', 'notification']
  },
  endpoint: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['success', 'failed', 'pending'],
    default: 'pending'
  },
  requestData: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  responseData: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  responseTime: {
    type: Number, // in milliseconds
    default: 0
  },
  errorMessage: {
    type: String,
    default: ''
  },
  testDate: {
    type: Date,
    default: Date.now
  },
  ipAddress: {
    type: String,
    default: ''
  },
  userAgent: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create indexes for frequently queried fields
ConnectionTestSchema.index({ user: 1, testDate: -1 });
ConnectionTestSchema.index({ testType: 1, status: 1 });
ConnectionTestSchema.index({ createdAt: -1 });

module.exports = mongoose.model('ConnectionTest', ConnectionTestSchema);
