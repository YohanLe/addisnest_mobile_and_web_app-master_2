const { BaseController, ErrorResponse } = require('./baseController');
const { Notification } = require('../models');

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
}

module.exports = new NotificationController();
