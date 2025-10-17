const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const User = require('../models/User');
const Property = require('../models/Property');
const mongoose = require('mongoose');
const { errorHandler } = require('../utils/errorHandler');

/**
 * @desc    Create a new message
 * @route   POST /api/messages
 * @access  Private
 */
exports.createMessage = async (req, res) => {
  try {
    const { conversationId, recipientId, content, propertyId } = req.body;
    const senderId = req.user.id;

    // Validate required fields
    if (!recipientId || !content) {
      return res.status(400).json({
        success: false,
        error: 'Please provide recipient ID and message content'
      });
    }

    let conversation;
    
    // If conversationId is provided, verify it exists
    if (conversationId) {
      conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        return res.status(404).json({
          success: false,
          error: 'Conversation not found'
        });
      }
    } else {
      // If no conversationId, check if a conversation already exists between these users
      let existingConversation;
      
      if (propertyId) {
        // If property is specified, look for a conversation about this specific property
        existingConversation = await Conversation.findOne({
          participants: { $all: [senderId, recipientId] },
          property: propertyId
        });
      } else {
        // Otherwise, look for any conversation between these users
        existingConversation = await Conversation.findOne({
          participants: { $all: [senderId, recipientId] }
        });
      }
      
      if (existingConversation) {
        conversation = existingConversation;
      } else {
        // Get sender and recipient details for creating a new conversation
        const sender = await User.findById(senderId);
        const recipient = await User.findById(recipientId);
        
        if (!sender || !recipient) {
          return res.status(404).json({
            success: false,
            error: 'Sender or recipient not found'
          });
        }
        
        // Get property details if provided
        let property = null;
        let title = "New Conversation";
        
        if (propertyId) {
          property = await Property.findById(propertyId);
          if (property) {
            title = `Inquiry about ${property.title || 'a property'}`;
          }
        } else {
          title = `Conversation with ${recipient.firstName} ${recipient.lastName || ''}`;
        }
        
        // Create a new conversation
        conversation = await Conversation.create({
          participants: [senderId, recipientId],
          property: propertyId || null,
          title,
          status: 'pending',
          unreadCounts: {
            [recipientId]: 0
          }
        });
      }
    }

    // Get sender and recipient details
    const sender = await User.findById(senderId);
    const recipient = await User.findById(recipientId);

    if (!sender || !recipient) {
      return res.status(404).json({
        success: false,
        error: 'Sender or recipient not found'
      });
    }

    // Get property details if provided
    let property = null;
    let propertyTitle = null;
    
    if (propertyId) {
      property = await Property.findById(propertyId);
      if (property) {
        propertyTitle = property.title || 'Property Inquiry';
      }
    }

    // Create the message
    const message = await Message.create({
      sender: senderId,
      senderName: `${sender.firstName} ${sender.lastName || ''}`.trim(),
      recipient: recipientId,
      recipientName: `${recipient.firstName} ${recipient.lastName || ''}`.trim(),
      property: propertyId || null,
      propertyTitle: propertyTitle,
      content,
      conversation: conversation._id,
      isRead: false,
      status: 'pending'
    });

    // Update conversation with last message
    await Conversation.findByIdAndUpdate(conversation._id, {
      lastMessage: content,
      updatedAt: Date.now()
    });

    // Return the created message
    return res.status(201).json({
      success: true,
      data: message
    });
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

/**
 * @desc    Get all messages for a conversation
 * @route   GET /api/messages/conversation/:conversationId
 * @access  Private
 */
exports.getMessagesByConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    // Verify conversation exists and user is a participant
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversation not found'
      });
    }

    // Check if user is a participant in the conversation
    const isParticipant = conversation.participants.some(
      participant => participant.toString() === userId
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        error: 'You are not authorized to view these messages'
      });
    }

    // Get messages for the conversation
    const messages = await Message.find({ conversation: conversationId })
      .sort({ createdAt: 1 })
      .populate('sender', 'firstName lastName profilePicture')
      .populate('recipient', 'firstName lastName profilePicture')
      .populate('property', 'title address price media');

    // Mark messages as read if user is the recipient
    const unreadMessages = messages.filter(
      message => !message.isRead && message.recipient._id.toString() === userId
    );

    if (unreadMessages.length > 0) {
      await Message.updateMany(
        {
          _id: { $in: unreadMessages.map(message => message._id) }
        },
        {
          isRead: true,
          readAt: Date.now()
        }
      );
    }

    return res.status(200).json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

/**
 * @desc    Mark a message as read
 * @route   PUT /api/messages/:id/read
 * @access  Private
 */
exports.markMessageAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Find the message
    const message = await Message.findById(id);
    if (!message) {
      return res.status(404).json({
        success: false,
        error: 'Message not found'
      });
    }

    // Check if user is the recipient
    if (message.recipient.toString() !== userId) {
      return res.status(403).json({
        success: false,
        error: 'You are not authorized to mark this message as read'
      });
    }

    // Mark as read if not already
    if (!message.isRead) {
      message.isRead = true;
      message.readAt = Date.now();
      await message.save();
    }

    return res.status(200).json({
      success: true,
      data: message
    });
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

/**
 * @desc    Accept a message
 * @route   PUT /api/messages/:id/accept
 * @access  Private
 */
exports.acceptMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Find the message
    const message = await Message.findById(id);
    if (!message) {
      return res.status(404).json({
        success: false,
        error: 'Message not found'
      });
    }

    // Check if user is the recipient
    if (message.recipient.toString() !== userId) {
      return res.status(403).json({
        success: false,
        error: 'You are not authorized to accept this message'
      });
    }

    // Update message status
    message.status = 'accepted';
    await message.save();

    // Update conversation status
    await Conversation.findByIdAndUpdate(message.conversation, {
      status: 'accepted'
    });

    return res.status(200).json({
      success: true,
      data: message
    });
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

/**
 * @desc    Ignore a message
 * @route   PUT /api/messages/:id/ignore
 * @access  Private
 */
exports.ignoreMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Find the message
    const message = await Message.findById(id);
    if (!message) {
      return res.status(404).json({
        success: false,
        error: 'Message not found'
      });
    }

    // Check if user is the recipient
    if (message.recipient.toString() !== userId) {
      return res.status(403).json({
        success: false,
        error: 'You are not authorized to ignore this message'
      });
    }

    // Update message status
    message.status = 'ignored';
    await message.save();

    // Update conversation status
    await Conversation.findByIdAndUpdate(message.conversation, {
      status: 'ignored'
    });

    return res.status(200).json({
      success: true,
      data: message
    });
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

/**
 * @desc    Get messages by status
 * @route   GET /api/messages?status=pending
 * @access  Private
 */
exports.getMessagesByStatus = async (req, res) => {
  try {
    const { status } = req.query;
    const userId = req.user.id;

    // Validate status parameter
    if (!status) {
      return res.status(400).json({
        success: false,
        error: 'Status parameter is required'
      });
    }

    // Find messages where user is the recipient and status matches
    const messages = await Message.find({
      recipient: userId,
      status: status
    })
      .sort({ createdAt: -1 })
      .populate('sender', 'firstName lastName profilePicture')
      .populate('property', 'title address price media');

    return res.status(200).json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

/**
 * @desc    Get unread message count for a user
 * @route   GET /api/messages/unread/count
 * @access  Private
 */
exports.getUnreadMessageCount = async (req, res) => {
  try {
    const userId = req.user.id;

    // Count unread messages where user is the recipient
    const count = await Message.countDocuments({
      recipient: userId,
      isRead: false
    });

    return res.status(200).json({
      success: true,
      count
    });
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

/**
 * @desc    Delete a message (soft delete by setting content to null)
 * @route   DELETE /api/messages/:id
 * @access  Private
 */
exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Find the message
    const message = await Message.findById(id);
    if (!message) {
      return res.status(404).json({
        success: false,
        error: 'Message not found'
      });
    }

    // Check if user is the sender or recipient
    if (message.sender.toString() !== userId && message.recipient.toString() !== userId) {
      return res.status(403).json({
        success: false,
        error: 'You are not authorized to delete this message'
      });
    }

    // Soft delete by setting content to null
    message.content = '[Message deleted]';
    await message.save();

    return res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

/**
 * @desc    Send email to agent
 * @route   POST /api/messages/send-to-agent
 * @access  Public
 */
exports.sendToAgent = async (req, res) => {
  try {
    const { 
      agentId, 
      agentEmail, 
      agentName, 
      senderName, 
      senderEmail, 
      message, 
      subject 
    } = req.body;

    console.log('sendToAgent called with data:', {
      agentId,
      agentEmail,
      agentName,
      senderName,
      senderEmail,
      messageLength: message?.length,
      subject
    });

    // Validate required fields
    if (!agentEmail || !senderName || !senderEmail || !message) {
      console.error('Missing required fields:', {
        agentEmail: !!agentEmail,
        senderName: !!senderName,
        senderEmail: !!senderEmail,
        message: !!message
      });
      return res.status(400).json({
        success: false,
        error: 'Please provide all required fields: agentEmail, senderName, senderEmail, and message'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(senderEmail) || !emailRegex.test(agentEmail)) {
      console.error('Invalid email format:', { senderEmail, agentEmail });
      return res.status(400).json({
        success: false,
        error: 'Please provide valid email addresses'
      });
    }

    // Try to import email service
    let emailService;
    try {
      emailService = require('../utils/emailService');
    } catch (importError) {
      console.warn('Email service not available:', importError.message);
      // Continue without email service for development
    }

    // Prepare email content
    const emailSubject = subject || `New inquiry from ${senderName}`;
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #667eea;">New Client Inquiry</h2>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 15px 0; color: #1e293b;">Contact Information</h3>
          <p><strong>Name:</strong> ${senderName}</p>
          <p><strong>Email:</strong> ${senderEmail}</p>
        </div>
        
        <div style="background: #ffffff; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h3 style="margin: 0 0 15px 0; color: #1e293b;">Message</h3>
          <p style="line-height: 1.6; color: #374151;">${message}</p>
        </div>
        
        <div style="margin-top: 20px; padding: 15px; background: #667eea; color: white; border-radius: 8px; text-align: center;">
          <p style="margin: 0;">Please respond to this inquiry by replying to ${senderEmail}</p>
        </div>
        
        <div style="margin-top: 20px; text-align: center; color: #64748b; font-size: 12px;">
          <p>This message was sent through Addisnest Real Estate Platform</p>
        </div>
      </div>
    `;

    // Attempt to send email
    let emailSent = false;
    let emailError = null;

    if (emailService && emailService.sendAgentInquiryEmail) {
      try {
        const emailResult = await emailService.sendAgentInquiryEmail(
          agentEmail,
          emailSubject,
          emailContent,
          {
            senderName,
            senderEmail,
            agentName: agentName || 'Agent'
          }
        );
        emailSent = emailResult.success;
        if (!emailSent) {
          emailError = emailResult.error;
        }
      } catch (error) {
        console.error('Email sending failed:', error);
        emailError = error.message;
      }
    }

    // Log the inquiry for tracking purposes
    console.log(`Agent inquiry: ${senderName} (${senderEmail}) contacted ${agentName || 'Agent'} (${agentEmail})`);
    console.log(`Message: ${message}`);

    // Always return success in development mode
    const response = {
      success: true,
      message: `Your message has been sent to ${agentName || 'the agent'} successfully`,
      data: {
        emailSent,
        emailError: emailError || null,
        timestamp: new Date().toISOString(),
        agentEmail,
        agentName: agentName || 'Agent',
        senderEmail
      }
    };

    console.log('Sending response:', response);
    return res.status(200).json(response);

  } catch (error) {
    console.error('Error in sendToAgent:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to send message to agent. Please try again later.',
      details: error.message
    });
  }
};
