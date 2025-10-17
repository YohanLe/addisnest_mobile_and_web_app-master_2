const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createMessage,
  getMessagesByConversation,
  markMessageAsRead,
  acceptMessage,
  ignoreMessage,
  getMessagesByStatus,
  getUnreadMessageCount,
  deleteMessage
} = require('../controllers/messageController');

// Create a new message
router.post('/', protect, createMessage);

// Get messages by status (e.g., pending)
router.get('/', protect, getMessagesByStatus);

// Get all messages for a conversation
router.get('/conversation/:conversationId', protect, getMessagesByConversation);

// Mark a message as read
router.put('/:id/read', protect, markMessageAsRead);

// Accept a message
router.put('/:id/accept', protect, acceptMessage);

// Ignore a message
router.put('/:id/ignore', protect, ignoreMessage);

// Get unread message count
router.get('/unread/count', protect, getUnreadMessageCount);

// Delete a message
router.delete('/:id', protect, deleteMessage);

module.exports = router;
