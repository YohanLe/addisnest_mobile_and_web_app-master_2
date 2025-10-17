const { BaseController, ErrorResponse } = require('./baseController');
const { Payment, Property, User, Notification } = require('../models');

class PaymentController extends BaseController {
  constructor() {
    super();
  }

  // @desc    Create a new payment
  // @route   POST /api/payments
  // @access  Private
  createPayment = this.asyncHandler(async (req, res) => {
    const {
      propertyId,
      amount,
      currency,
      paymentMethod,
      paymentType,
      paymentProvider,
      transactionId,
      description,
      billingAddress,
      paymentDetails
    } = req.body;

    // Verify property exists if provided
    if (propertyId) {
      const property = await Property.findById(propertyId);
      if (!property) {
        return this.sendError(res, new ErrorResponse(`Property not found with id of ${propertyId}`, 404));
      }
    }

    // Create payment
    const payment = await Payment.create({
      user: req.user.id,
      property: propertyId || null,
      amount,
      currency: currency || 'USD',
      paymentMethod,
      paymentType,
      paymentProvider,
      transactionId,
      description,
      billingAddress: billingAddress || {},
      paymentDetails: paymentDetails || {},
      status: 'pending'
    });

    // Create notification for user
    await Notification.create({
      recipient: req.user.id,
      type: 'payment_confirmation',
      title: 'Payment Initiated',
      message: `Your payment of ${currency || 'USD'} ${amount} for ${description} has been initiated.`,
      payment: payment._id,
      property: propertyId || null
    });

    this.sendResponse(res, payment, 201);
  });

  // @desc    Get all payments for the logged in user
  // @route   GET /api/payments
  // @access  Private
  getUserPayments = this.asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    // Get total count for pagination
    const total = await Payment.countDocuments({ user: req.user.id });
    
    // Find payments for the user with pagination
    const payments = await Payment.find({ user: req.user.id })
      .sort('-createdAt')
      .skip(startIndex)
      .limit(limit)
      .populate({
        path: 'property',
        select: 'title images price address'
      });
    
    // Pagination result
    const pagination = {
      total,
      pages: Math.ceil(total / limit),
      page,
      limit
    };
    
    this.sendResponse(res, {
      count: payments.length,
      pagination,
      data: payments
    });
  });

  // @desc    Get a single payment
  // @route   GET /api/payments/:id
  // @access  Private
  getPayment = this.asyncHandler(async (req, res) => {
    const payment = await Payment.findById(req.params.id).populate({
      path: 'property',
      select: 'title images price address'
    });
    
    if (!payment) {
      return this.sendError(res, new ErrorResponse(`Payment not found with id of ${req.params.id}`, 404));
    }
    
    // Check if user is the payment owner or admin
    if (payment.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return this.sendError(res, new ErrorResponse(`Not authorized to access this payment`, 401));
    }
    
    this.sendResponse(res, payment);
  });

  // @desc    Update payment status
  // @route   PUT /api/payments/:id/status
  // @access  Private (Admin or Payment Owner)
  updatePaymentStatus = this.asyncHandler(async (req, res) => {
    const { status, receiptUrl, refundReason, paymentMethod, paymentProvider } = req.body;
    
    const payment = await Payment.findById(req.params.id);
    
    if (!payment) {
      return this.sendError(res, new ErrorResponse(`Payment not found with id of ${req.params.id}`, 404));
    }
    
    // Check if user is admin or the payment owner
    if (req.user.role !== 'admin' && payment.user.toString() !== req.user.id) {
      return this.sendError(res, new ErrorResponse(`Not authorized to update payment status`, 401));
    }
    
    // Additional validation for non-admins
    if (req.user.role !== 'admin') {
      // Non-admins can only update to completed status for their own payments
      if (status !== 'completed') {
        return this.sendError(res, new ErrorResponse(`You can only mark payments as completed`, 400));
      }
      
      // Ensure payment belongs to the authenticated user
      if (payment.user.toString() !== req.user.id) {
        return this.sendError(res, new ErrorResponse(`This payment does not belong to you`, 401));
      }
    }
    
    // Update payment status
    payment.status = status;
    
    // If status is completed, add receipt URL
    if (status === 'completed' && receiptUrl) {
      payment.receiptUrl = receiptUrl;
    }
    
    // If status is refunded, add refund reason and date
    if (status === 'refunded') {
      payment.refundReason = refundReason || 'Refunded by admin';
      payment.refundedAt = Date.now();
    }
    
    await payment.save();
    
    // If payment is for a property and status is completed, update property status
    if (payment.property && status === 'completed') {
      const property = await Property.findById(payment.property);
      
      if (property) {
        // Check if property is in pending status
        if (property.status === 'pending') {
          // Update property status to active
          property.status = 'active';
          property.paymentStatus = 'active';
          await property.save();
          
          console.log(`Property ${property._id} status updated to active after payment completion`);
        }
      }
    }
    
    // Create notification for user about payment status change
    let notificationTitle, notificationMessage;
    
    switch (status) {
      case 'completed':
        notificationTitle = 'Payment Completed';
        notificationMessage = `Your payment of ${payment.currency} ${payment.amount} for ${payment.description} has been completed successfully.`;
        break;
      case 'failed':
        notificationTitle = 'Payment Failed';
        notificationMessage = `Your payment of ${payment.currency} ${payment.amount} for ${payment.description} has failed. Please contact support for assistance.`;
        break;
      case 'refunded':
        notificationTitle = 'Payment Refunded';
        notificationMessage = `Your payment of ${payment.currency} ${payment.amount} for ${payment.description} has been refunded. Reason: ${payment.refundReason}`;
        break;
      case 'cancelled':
        notificationTitle = 'Payment Cancelled';
        notificationMessage = `Your payment of ${payment.currency} ${payment.amount} for ${payment.description} has been cancelled.`;
        break;
      default:
        notificationTitle = 'Payment Status Updated';
        notificationMessage = `Your payment status has been updated to ${status}.`;
    }
    
    await Notification.create({
      recipient: payment.user,
      type: 'payment_received',
      title: notificationTitle,
      message: notificationMessage,
      payment: payment._id,
      property: payment.property
    });
    
    this.sendResponse(res, payment);
  });

  // @desc    Get payments for a property
  // @route   GET /api/payments/property/:propertyId
  // @access  Private
  getPropertyPayments = this.asyncHandler(async (req, res) => {
    const { propertyId } = req.params;
    
    // Verify property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return this.sendError(res, new ErrorResponse(`Property not found with id of ${propertyId}`, 404));
    }
    
    // Check if user is the property owner or admin
    if (property.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return this.sendError(res, new ErrorResponse(`Not authorized to access payments for this property`, 401));
    }
    
    const payments = await Payment.find({ property: propertyId }).sort('-createdAt');
    
    this.sendResponse(res, {
      count: payments.length,
      data: payments
    });
  });

  // @desc    Get payment statistics (admin only)
  // @route   GET /api/payments/stats
  // @access  Private/Admin
  getPaymentStats = this.asyncHandler(async (req, res) => {
    // Get total payments
    const totalPayments = await Payment.countDocuments();
    
    // Get total payment amount
    const paymentAmounts = await Payment.aggregate([
      {
        $match: { status: 'completed' }
      },
      {
        $group: {
          _id: '$currency',
          total: { $sum: '$amount' }
        }
      }
    ]);
    
    // Get payment counts by status
    const paymentsByStatus = await Payment.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Get payment counts by type
    const paymentsByType = await Payment.aggregate([
      {
        $group: {
          _id: '$paymentType',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Get payment counts by provider
    const paymentsByProvider = await Payment.aggregate([
      {
        $group: {
          _id: '$paymentProvider',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Get recent payments
    const recentPayments = await Payment.find()
      .sort('-createdAt')
      .limit(5)
      .populate({
        path: 'user',
        select: 'firstName lastName email'
      })
      .populate({
        path: 'property',
        select: 'title'
      });
    
    this.sendResponse(res, {
      totalPayments,
      paymentAmounts,
      paymentsByStatus,
      paymentsByType,
      paymentsByProvider,
      recentPayments
    });
  });
}

module.exports = new PaymentController();
