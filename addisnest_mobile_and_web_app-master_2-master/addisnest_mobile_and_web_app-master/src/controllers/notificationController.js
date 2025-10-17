const { BaseController, ErrorResponse } = require('./baseController');
const { Notification, Property, User } = require('../models');
const nodemailer = require('nodemailer');

class NotificationController extends BaseController {
  constructor() {
    super();
  }

  // @desc    Get all notifications for the logged in user
  // @route   GET /api/notifications
  // @access  Private
  getUserNotifications = this.asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    // Get total count for pagination
    const total = await Notification.countDocuments({ recipient: req.user.id });
    
    // Find notifications for the user with pagination
    const notifications = await Notification.find({ recipient: req.user.id })
      .sort('-createdAt')
      .skip(startIndex)
      .limit(limit)
      .populate({
        path: 'sender',
        select: 'firstName lastName profileImage'
      })
      .populate({
        path: 'property',
        select: 'title images price address'
      })
      .populate({
        path: 'conversation'
      });
    
    // Pagination result
    const pagination = {
      total,
      pages: Math.ceil(total / limit),
      page,
      limit
    };
    
    this.sendResponse(res, {
      count: notifications.length,
      pagination,
      data: notifications
    });
  });

  // @desc    Get unread notification count
  // @route   GET /api/notifications/unread/count
  // @access  Private
  getUnreadCount = this.asyncHandler(async (req, res) => {
    const count = await Notification.countDocuments({
      recipient: req.user.id,
      isRead: false
    });
    
    this.sendResponse(res, { count });
  });

  // @desc    Mark notification as read
  // @route   PUT /api/notifications/:id/read
  // @access  Private
  markAsRead = this.asyncHandler(async (req, res) => {
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) {
      return this.sendError(res, new ErrorResponse(`Notification not found with id of ${req.params.id}`, 404));
    }
    
    // Check if user is the recipient
    if (notification.recipient.toString() !== req.user.id) {
      return this.sendError(res, new ErrorResponse(`Not authorized to access this notification`, 401));
    }
    
    notification.isRead = true;
    notification.readAt = Date.now();
    await notification.save();
    
    this.sendResponse(res, notification);
  });

  // @desc    Mark all notifications as read
  // @route   PUT /api/notifications/read-all
  // @access  Private
  markAllAsRead = this.asyncHandler(async (req, res) => {
    await Notification.updateMany(
      { recipient: req.user.id, isRead: false },
      { isRead: true, readAt: Date.now() }
    );
    
    this.sendResponse(res, { success: true, message: 'All notifications marked as read' });
  });

  // @desc    Delete a notification
  // @route   DELETE /api/notifications/:id
  // @access  Private
  deleteNotification = this.asyncHandler(async (req, res) => {
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) {
      return this.sendError(res, new ErrorResponse(`Notification not found with id of ${req.params.id}`, 404));
    }
    
    // Check if user is the recipient
    if (notification.recipient.toString() !== req.user.id && req.user.role !== 'admin') {
      return this.sendError(res, new ErrorResponse(`Not authorized to delete this notification`, 401));
    }
    
    await notification.remove();
    
    this.sendResponse(res, { success: true });
  });

  // @desc    Delete all notifications
  // @route   DELETE /api/notifications
  // @access  Private
  deleteAllNotifications = this.asyncHandler(async (req, res) => {
    await Notification.deleteMany({ recipient: req.user.id });
    
    this.sendResponse(res, { success: true, message: 'All notifications deleted' });
  });

  // @desc    Create a system notification (admin only)
  // @route   POST /api/notifications/system
  // @access  Private/Admin
  createSystemNotification = this.asyncHandler(async (req, res) => {
    const { recipientId, title, message, type = 'system' } = req.body;
    
    const notification = await Notification.create({
      recipient: recipientId,
      sender: req.user.id,
      type,
      title,
      message,
      data: req.body.data || {}
    });
    
    const populatedNotification = await Notification.findById(notification._id)
      .populate({
        path: 'sender',
        select: 'firstName lastName profileImage'
      })
      .populate({
        path: 'recipient',
        select: 'firstName lastName email'
      });
    
    this.sendResponse(res, populatedNotification, 201);
  });

  // @desc    Send email notification
  // @route   POST /api/notifications/send-email
  // @access  Public (for tour requests)
  sendEmail = this.asyncHandler(async (req, res) => {
    try {
      const { to, subject, html, type, propertyId, visitorEmail, tourDetails } = req.body;

      // Validate required fields
      if (!to || !subject || !html) {
        return this.sendError(res, new ErrorResponse('Missing required fields: to, subject, html', 400));
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(to)) {
        return this.sendError(res, new ErrorResponse('Invalid recipient email address', 400));
      }

      if (visitorEmail && !emailRegex.test(visitorEmail)) {
        return this.sendError(res, new ErrorResponse('Invalid visitor email address', 400));
      }

      // Check if Gmail SMTP is configured for actual email sending
      if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD && 
          process.env.GMAIL_USER !== 'your_gmail@gmail.com' && 
          process.env.GMAIL_APP_PASSWORD !== 'your_app_password_here') {
        
        console.log('=== SENDING ACTUAL EMAIL VIA GMAIL SMTP ===');
        console.log('To:', to);
        console.log('Subject:', subject);
        console.log('From:', process.env.GMAIL_USER);
        
        // Create Gmail SMTP transporter
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD
          }
        });

        // Email options
        const mailOptions = {
          from: `"Addisnest" <${process.env.GMAIL_USER}>`,
          to: to,
          subject: subject,
          html: html
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);
        
        console.log('Email sent successfully! Message ID:', info.messageId);

        this.sendResponse(res, {
          success: true,
          message: 'Email sent successfully via Gmail SMTP',
          data: {
            messageId: info.messageId,
            to,
            subject,
            type,
            sentAt: new Date(),
            mode: 'gmail_smtp'
          }
        });
        return;
      }

      // For development mode without Gmail configured, simulate email sending
      if (process.env.NODE_ENV === 'development' || process.env.SENDGRID_API_KEY === 'development_mode') {
        console.log('=== EMAIL SIMULATION (Development Mode) ===');
        console.log('To:', to);
        console.log('Subject:', subject);
        console.log('Type:', type);
        if (tourDetails) {
          console.log('Tour Details:', tourDetails);
        }
        console.log('Visitor Email:', visitorEmail);
        console.log('HTML Content:', html.substring(0, 200) + '...');
        console.log('=== END EMAIL SIMULATION ===');
        console.log('');
        console.log('💡 TO ENABLE ACTUAL EMAIL SENDING:');
        console.log('1. Update .env file with your Gmail credentials:');
        console.log('   GMAIL_USER=your_email@gmail.com');
        console.log('   GMAIL_APP_PASSWORD=your_app_password');
        console.log('2. Enable 2-factor authentication on your Gmail account');
        console.log('3. Generate an App Password: https://support.google.com/accounts/answer/185833');
        console.log('4. Restart the server');
        console.log('');

        // Simulate successful email sending
        this.sendResponse(res, {
          success: true,
          message: 'Email sent successfully (simulated in development mode)',
          data: {
            to,
            subject,
            type,
            sentAt: new Date(),
            mode: 'development_simulation'
          }
        });
        return;
      }

      // For production with SendGrid, use actual email service
      // Create transporter (you can configure this based on your email service)
      const transporter = nodemailer.createTransport({
        service: 'gmail', // or your email service
        auth: {
          user: process.env.EMAIL_FROM,
          pass: process.env.EMAIL_PASSWORD
        }
      });

      // Email options
      const mailOptions = {
        from: process.env.EMAIL_FROM || 'contact@addisnest.com',
        to: to,
        subject: subject,
        html: html
      };

      // Send email
      const info = await transporter.sendMail(mailOptions);

      this.sendResponse(res, {
        success: true,
        message: 'Email sent successfully',
        data: {
          messageId: info.messageId,
          to,
          subject,
          type,
          sentAt: new Date()
        }
      });

    } catch (error) {
      console.error('Email sending error:', error);
      this.sendError(res, new ErrorResponse('Failed to send email: ' + error.message, 500));
    }
  });
}

module.exports = new NotificationController();
