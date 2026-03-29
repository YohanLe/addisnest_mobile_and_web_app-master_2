const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  // Sender information
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  senderName: {
    type: String,
    required: true
  },
  
  // Recipient information
  recipient: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipientName: {
    type: String,
    required: true
  },
  
  // Property information
  property: {
    type: Schema.Types.ObjectId,
    ref: 'Property'
  },
  propertyTitle: {
    type: String
  },
  
  // Message content
  content: {
    type: String,
    required: true
  },
  
  // Conversation reference
  conversation: {
    type: Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true
  },
  
  // Message status
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'ignored'],
    default: 'pending'
  },
  
  // Optional attachments
  attachments: [{
    type: String
  }]
}, {
  timestamps: true
});

// Add indexes for faster queries
MessageSchema.index({ sender: 1 });
MessageSchema.index({ recipient: 1 });
MessageSchema.index({ conversation: 1 });
MessageSchema.index({ property: 1 });
MessageSchema.index({ isRead: 1 });

module.exports = mongoose.model('Message', MessageSchema);
