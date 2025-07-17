const mongoose = require('mongoose');

const OtpVerificationSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  otp: {
    type: String,
    required: [true, 'OTP is required']
  },
  expiresAt: {
    type: Date,
    required: [true, 'Expiry time is required']
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300 // Automatically delete documents after 5 minutes (300 seconds)
  }
});

module.exports = mongoose.model('OtpVerification', OtpVerificationSchema);
