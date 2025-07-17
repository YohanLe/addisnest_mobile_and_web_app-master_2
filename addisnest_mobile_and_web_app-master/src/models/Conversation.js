const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ConversationSchema = new Schema({
  // Participants in the conversation
  participants: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  
  // Related property (if applicable)
  property: {
    type: Schema.Types.ObjectId,
    ref: 'Property'
  },
  
  // Last message for preview
  lastMessage: {
    type: String
  },
  
  // Conversation metadata
  title: {
    type: String
  },
  
  // Conversation status
  status: {
    type: String,
    enum: ['pending', 'accepted', 'ignored'],
    default: 'pending'
  },
  
  // Unread counts for each participant
  unreadCounts: {
    type: Map,
    of: Number,
    default: {}
  }
}, {
  timestamps: true
});

// Add indexes for faster queries
ConversationSchema.index({ participants: 1 });
ConversationSchema.index({ property: 1 });
ConversationSchema.index({ updatedAt: -1 });

module.exports = mongoose.model('Conversation', ConversationSchema);
