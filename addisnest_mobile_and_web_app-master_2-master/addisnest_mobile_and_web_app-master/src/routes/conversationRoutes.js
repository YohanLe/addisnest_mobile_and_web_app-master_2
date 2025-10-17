const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createOrGetConversation,
  getUserConversations,
  getConversation,
  markConversationAsRead,
  deleteConversation
} = require('../controllers/conversationController');

// Create or get a conversation
router.post('/', protect, createOrGetConversation);

// Get all conversations for a user
router.get('/', protect, getUserConversations);

// Get a single conversation by ID
router.get('/:id', protect, getConversation);

// Mark all messages in a conversation as read
router.put('/:id/read', protect, markConversationAsRead);

// Delete a conversation
router.delete('/:id', protect, deleteConversation);

module.exports = router;
