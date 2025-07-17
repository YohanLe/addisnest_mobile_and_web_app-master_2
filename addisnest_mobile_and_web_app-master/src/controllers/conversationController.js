const Conversation = require('../models/Conversation');
const User = require('../models/User');
const Property = require('../models/Property');
const Message = require('../models/Message');
const mongoose = require('mongoose');
const { errorHandler } = require('../utils/errorHandler');

/**
 * @desc    Create or get a conversation between users
 * @route   POST /api/conversations
 * @access  Private
 */
exports.createOrGetConversation = async (req, res) => {
  try {
    const { participantId, propertyId } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!participantId) {
      return res.status(400).json({
        success: false,
        error: 'Please provide participant ID'
      });
    }

    // Check if users exist
    const currentUser = await User.findById(userId);
    const participant = await User.findById(participantId);

    if (!currentUser || !participant) {
      return res.status(404).json({
        success: false,
        error: 'One or more users not found'
      });
    }

    // Check if property exists if propertyId is provided
    let property = null;
    if (propertyId) {
      property = await Property.findById(propertyId);
      if (!property) {
        return res.status(404).json({
          success: false,
          error: 'Property not found'
        });
      }
    }

    // Check if conversation already exists between these users
    let conversation;
    
    if (propertyId) {
      // If property is specified, look for a conversation about this specific property
      conversation = await Conversation.findOne({
        participants: { $all: [userId, participantId] },
        property: propertyId
      });
    } else {
      // Otherwise, look for any conversation between these users
      conversation = await Conversation.findOne({
        participants: { $all: [userId, participantId] }
      });
    }

    // If conversation doesn't exist, create a new one
    if (!conversation) {
      const title = property ? `Inquiry about ${property.title || 'a property'}` : 
        `Conversation with ${participant.firstName} ${participant.lastName || ''}`;
      
      conversation = await Conversation.create({
        participants: [userId, participantId],
        property: propertyId || null,
        title,
        status: 'pending',
        unreadCounts: {
          [participantId]: 0
        }
      });
    }

    // Return the conversation
    return res.status(200).json({
      success: true,
      data: conversation
    });
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

/**
 * @desc    Get all conversations for a user
 * @route   GET /api/conversations
 * @access  Private
 */
exports.getUserConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all conversations where user is a participant
    const conversations = await Conversation.find({
      participants: userId
    })
      .sort({ updatedAt: -1 })
      .populate('participants', 'firstName lastName profilePicture')
      .populate('property', 'title address price media');

    // For each conversation, get the last message and unread count
    const conversationsWithDetails = await Promise.all(
      conversations.map(async (conversation) => {
        // Get the last message
        const lastMessage = await Message.findOne({
          conversation: conversation._id
        })
          .sort({ createdAt: -1 })
          .select('content sender createdAt isRead');

        // Get unread count for this user
        const unreadCount = await Message.countDocuments({
          conversation: conversation._id,
          recipient: userId,
          isRead: false
        });

        // Get the other participant(s)
        const otherParticipants = conversation.participants.filter(
          participant => participant._id.toString() !== userId
        );

        return {
          ...conversation.toObject(),
          lastMessage: lastMessage || null,
          unreadCount,
          otherParticipants
        };
      })
    );

    return res.status(200).json({
      success: true,
      count: conversationsWithDetails.length,
      data: conversationsWithDetails
    });
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

/**
 * @desc    Get a single conversation by ID
 * @route   GET /api/conversations/:id
 * @access  Private
 */
exports.getConversation = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Find the conversation
    const conversation = await Conversation.findById(id)
      .populate('participants', 'firstName lastName profilePicture')
      .populate('property', 'title address price media');

    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversation not found'
      });
    }

    // Check if user is a participant
    const isParticipant = conversation.participants.some(
      participant => participant._id.toString() === userId
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        error: 'You are not authorized to view this conversation'
      });
    }

    // Get the last 20 messages for this conversation
    const messages = await Message.find({
      conversation: id
    })
      .sort({ createdAt: -1 })
      .limit(20)
      .populate('sender', 'firstName lastName profilePicture')
      .populate('recipient', 'firstName lastName profilePicture');

    // Get unread count for this user
    const unreadCount = await Message.countDocuments({
      conversation: id,
      recipient: userId,
      isRead: false
    });

    // Get the other participant(s)
    const otherParticipants = conversation.participants.filter(
      participant => participant._id.toString() !== userId
    );

    return res.status(200).json({
      success: true,
      data: {
        ...conversation.toObject(),
        messages: messages.reverse(),
        unreadCount,
        otherParticipants
      }
    });
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

/**
 * @desc    Mark all messages in a conversation as read
 * @route   PUT /api/conversations/:id/read
 * @access  Private
 */
exports.markConversationAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Find the conversation
    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversation not found'
      });
    }

    // Check if user is a participant
    const isParticipant = conversation.participants.some(
      participant => participant.toString() === userId
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        error: 'You are not authorized to mark this conversation as read'
      });
    }

    // Mark all messages as read where user is the recipient
    await Message.updateMany(
      {
        conversation: id,
        recipient: userId,
        isRead: false
      },
      {
        isRead: true,
        readAt: Date.now()
      }
    );

    // Update unread count in conversation
    const unreadCounts = { ...conversation.unreadCounts };
    unreadCounts[userId] = 0;
    
    await Conversation.findByIdAndUpdate(id, {
      unreadCounts
    });

    return res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

/**
 * @desc    Delete a conversation (soft delete)
 * @route   DELETE /api/conversations/:id
 * @access  Private
 */
exports.deleteConversation = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Find the conversation
    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversation not found'
      });
    }

    // Check if user is a participant
    const isParticipant = conversation.participants.some(
      participant => participant.toString() === userId
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        error: 'You are not authorized to delete this conversation'
      });
    }

    // Instead of actually deleting, we could implement a "hidden" field
    // For now, we'll just remove the user from participants
    const updatedParticipants = conversation.participants.filter(
      participant => participant.toString() !== userId
    );

    // If no participants left, delete the conversation
    if (updatedParticipants.length === 0) {
      await Conversation.findByIdAndDelete(id);
      
      // Also delete all messages in this conversation
      await Message.deleteMany({ conversation: id });
    } else {
      // Otherwise, update the participants list
      await Conversation.findByIdAndUpdate(id, {
        participants: updatedParticipants
      });
    }

    return res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    return errorHandler(error, req, res);
  }
};
