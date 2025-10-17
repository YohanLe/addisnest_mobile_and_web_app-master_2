const mongoose = require('mongoose');

const partnershipRequestSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: [true, 'Company name is required']
  },
  contactName: {
    type: String,
    required: [true, 'Contact name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
  },
  phone: {
    type: String,
    trim: true
  },
  partnershipType: {
    type: String,
    required: [true, 'Partnership type is required'],
    enum: ['advertising', 'corporate', 'service', 'other']
  },
  message: {
    type: String,
    required: [true, 'Message is required']
  },
  status: {
    type: String,
    enum: ['not revised', 'in progress', 'approved', 'rejected'],
    default: 'not revised'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
partnershipRequestSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Update the updatedAt field before updating
partnershipRequestSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: Date.now() });
  next();
});

const PartnershipRequest = mongoose.model('PartnershipRequest', partnershipRequestSchema);

module.exports = PartnershipRequest;
