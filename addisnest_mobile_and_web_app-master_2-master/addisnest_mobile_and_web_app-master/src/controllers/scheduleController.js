const { BaseController, ErrorResponse } = require('./baseController');
const { PropertySchedule, Property, User } = require('../models');
const mongoose = require('mongoose');

class ScheduleController extends BaseController {
  constructor() {
    super();
  }

  // @desc    Create a new property schedule
  // @route   POST /api/schedules
  // @access  Private
  createSchedule = this.asyncHandler(async (req, res) => {
    try {
      console.log('=== CREATE SCHEDULE REQUEST ===');
      console.log('Request body:', req.body);
      console.log('User:', req.user);
      
      const {
        propertyId,
        tourType,
        scheduledDate,
        scheduledTime,
        visitorMessage,
        visitorContact
      } = req.body;

      // Validate required fields
      if (!propertyId || !tourType || !scheduledDate || !scheduledTime || !visitorContact) {
        console.log('Missing required fields:', { propertyId, tourType, scheduledDate, scheduledTime, visitorContact });
        return this.sendError(res, new ErrorResponse('Missing required fields', 400));
      }

      // Validate tour type
      if (!['in-person', 'video'].includes(tourType)) {
        console.log('Invalid tour type:', tourType);
        return this.sendError(res, new ErrorResponse('Invalid tour type', 400));
      }

      // Validate date is in the future
      const scheduleDate = new Date(scheduledDate);
      const now = new Date();
      if (scheduleDate <= now) {
        console.log('Invalid date - not in future:', scheduleDate, 'vs', now);
        return this.sendError(res, new ErrorResponse('Scheduled date must be in the future', 400));
      }

      // Check if the property exists
      console.log('Looking up property with ID:', propertyId);
      const property = await Property.findById(propertyId);
      if (!property) {
        console.log('Property not found with ID:', propertyId);
        return this.sendError(res, new ErrorResponse('Property not found', 404));
      }

      console.log('Property found:', { id: property._id, title: property.title, owner: property.owner });

      // Get property owner
      const propertyOwner = property.owner;
      if (!propertyOwner) {
        console.log('Property owner not found in property:', property);
        return this.sendError(res, new ErrorResponse('Property owner not found', 404));
      }

      // Check for scheduling conflicts
      console.log('Checking for scheduling conflicts...');
      const hasConflict = await PropertySchedule.checkConflict(propertyId, scheduleDate, scheduledTime);
      if (hasConflict) {
        console.log('Scheduling conflict found for:', { propertyId, scheduleDate, scheduledTime });
        return this.sendError(res, new ErrorResponse('This time slot is already booked. Please choose a different time.', 409));
      }

      // Create the schedule
      const scheduleData = {
        property: propertyId,
        visitor: req.user.id,
        propertyOwner: propertyOwner,
        tourType,
        scheduledDate: scheduleDate,
        scheduledTime,
        visitorMessage: visitorMessage || '',
        visitorContact: {
          phone: visitorContact.phone || req.user.phone || '',
          email: visitorContact.email || req.user.email || ''
        }
      };

      console.log('Creating schedule with data:', scheduleData);
      const schedule = await PropertySchedule.create(scheduleData);
      console.log('Schedule created successfully:', schedule._id);

      // Populate the schedule with property and user details
      const populatedSchedule = await PropertySchedule.findById(schedule._id)
        .populate('property', 'title address images price')
        .populate('visitor', 'firstName lastName email phone')
        .populate('propertyOwner', 'firstName lastName email phone');

      // Send email notification to property owner (non-blocking - email failure won't stop schedule creation)
      setImmediate(async () => {
        try {
          const propertyOwnerUser = await User.findById(propertyOwner);
          if (propertyOwnerUser && propertyOwnerUser.email) {
            // Format the scheduled date and time
            const formattedDate = new Date(scheduledDate).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });

            // Create email content
            const emailSubject = `New Property Tour Request - ${property.title}`;
            const emailHtml = `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #2c5530;">New Property Tour Request</h2>
                <p>Hello ${propertyOwnerUser.firstName} ${propertyOwnerUser.lastName},</p>
                
                <p>You have received a new tour request for your property:</p>
                
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="color: #2c5530; margin-top: 0;">${property.title}</h3>
                  <p><strong>Tour Type:</strong> ${tourType === 'in-person' ? 'In-Person Tour' : 'Video Tour'}</p>
                  <p><strong>Requested Date:</strong> ${formattedDate}</p>
                  <p><strong>Requested Time:</strong> ${scheduledTime}</p>
                  <p><strong>Visitor:</strong> ${req.user.firstName} ${req.user.lastName}</p>
                  <p><strong>Visitor Email:</strong> ${visitorContact.email || req.user.email}</p>
                  <p><strong>Visitor Phone:</strong> ${visitorContact.phone || req.user.phone || 'Not provided'}</p>
                  ${visitorMessage ? `<p><strong>Message:</strong> ${visitorMessage}</p>` : ''}
                </div>
                
                <p>Please log in to your Addisnest account to confirm or reschedule this tour request.</p>
                
                <div style="margin: 30px 0;">
                  <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/account" 
                     style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                    Manage Tour Requests
                  </a>
                </div>
                
                <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                <p style="color: #666; font-size: 14px;">
                  This is an automated message from Addisnest. Please do not reply to this email.
                  <br>
                  If you have any questions, please contact us at contact@addisnest.com
                </p>
              </div>
            `;

            // Send email using the notification controller's email service
            const axios = require('axios');
            const emailData = {
              to: propertyOwnerUser.email,
              subject: emailSubject,
              html: emailHtml,
              type: 'schedule_request',
              propertyId: propertyId,
              visitorEmail: visitorContact.email || req.user.email,
              tourDetails: {
                type: tourType,
                date: scheduledDate,
                time: scheduledTime
              }
            };

            // Make internal API call to send email
            try {
              await axios.post(`${process.env.API_BASE_URL || 'http://localhost:7002'}/api/notifications/send-email`, emailData);
              console.log(`✅ Email notification sent successfully to: ${propertyOwnerUser.email}`);
            } catch (emailError) {
              console.error('⚠️  Failed to send email notification:', emailError.message);
              console.error('   (Schedule was still created successfully - email will need to be sent manually)');
            }
          }
        } catch (emailError) {
          console.error('⚠️  Error in email notification process:', emailError.message);
          console.error('   (Schedule was still created successfully - email will need to be sent manually)');
        }
      });

      // Return success immediately (don't wait for email)
      this.sendResponse(res, populatedSchedule, 201);
    } catch (err) {
      console.error('Create schedule error:', err);
      if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(val => val.message);
        return this.sendError(res, new ErrorResponse(messages.join(', '), 400));
      }
      this.sendError(res, new ErrorResponse(err.message || 'Error creating schedule', 500));
    }
  });

  // @desc    Get all schedules for a user
  // @route   GET /api/schedules
  // @access  Private
  getUserSchedules = this.asyncHandler(async (req, res) => {
    try {
      const { status, type } = req.query;
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const startIndex = (page - 1) * limit;

      // Build query based on user role
      let query = {};
      
      if (type === 'visitor' || !type) {
        // Get schedules where user is the visitor
        query.visitor = req.user.id;
      } else if (type === 'owner') {
        // Get schedules where user is the property owner
        query.propertyOwner = req.user.id;
      }

      // Filter by status if provided
      if (status && ['pending', 'confirmed', 'cancelled', 'completed', 'rejected'].includes(status)) {
        query.status = status;
      }

      const total = await PropertySchedule.countDocuments(query);
      const schedules = await PropertySchedule.find(query)
        .populate('property', 'title address images price')
        .populate('visitor', 'firstName lastName email phone')
        .populate('propertyOwner', 'firstName lastName email phone')
        .sort('-createdAt')
        .skip(startIndex)
        .limit(limit);

      // Pagination result
      const pagination = {};
      
      if (startIndex + limit < total) {
        pagination.next = {
          page: page + 1,
          limit
        };
      }
      
      if (startIndex > 0) {
        pagination.prev = {
          page: page - 1,
          limit
        };
      }

      this.sendResponse(res, {
        count: schedules.length,
        total,
        pagination,
        data: schedules
      });
    } catch (error) {
      console.error('Get user schedules error:', error);
      this.sendError(res, new ErrorResponse('Error retrieving schedules', 500));
    }
  });

  // @desc    Get single schedule
  // @route   GET /api/schedules/:id
  // @access  Private
  getScheduleById = this.asyncHandler(async (req, res) => {
    try {
      const schedule = await PropertySchedule.findById(req.params.id)
        .populate('property', 'title address images price')
        .populate('visitor', 'firstName lastName email phone')
        .populate('propertyOwner', 'firstName lastName email phone');

      if (!schedule) {
        return this.sendError(res, new ErrorResponse('Schedule not found', 404));
      }

      // Check if user is authorized to view this schedule
      if (schedule.visitor._id.toString() !== req.user.id && 
          schedule.propertyOwner._id.toString() !== req.user.id &&
          req.user.role !== 'admin') {
        return this.sendError(res, new ErrorResponse('Not authorized to view this schedule', 403));
      }

      this.sendResponse(res, schedule);
    } catch (error) {
      console.error('Get schedule by ID error:', error);
      this.sendError(res, new ErrorResponse('Error retrieving schedule', 500));
    }
  });

  // @desc    Update schedule status (confirm, reject, cancel)
  // @route   PUT /api/schedules/:id/status
  // @access  Private
  updateScheduleStatus = this.asyncHandler(async (req, res) => {
    try {
      const { status, ownerResponse, meetingDetails } = req.body;

      if (!status) {
        return this.sendError(res, new ErrorResponse('Status is required', 400));
      }

      if (!['confirmed', 'rejected', 'cancelled', 'completed'].includes(status)) {
        return this.sendError(res, new ErrorResponse('Invalid status', 400));
      }

      const schedule = await PropertySchedule.findById(req.params.id);

      if (!schedule) {
        return this.sendError(res, new ErrorResponse('Schedule not found', 404));
      }

      // Check authorization based on status change
      if (status === 'cancelled') {
        // Only visitor can cancel
        if (schedule.visitor.toString() !== req.user.id) {
          return this.sendError(res, new ErrorResponse('Only the visitor can cancel the schedule', 403));
        }
        
        // Check if schedule can be cancelled
        if (!schedule.canBeCancelled()) {
          return this.sendError(res, new ErrorResponse('Schedule cannot be cancelled (less than 2 hours before scheduled time or already processed)', 400));
        }
      } else {
        // Only property owner can confirm, reject, or mark as completed
        if (schedule.propertyOwner.toString() !== req.user.id && req.user.role !== 'admin') {
          return this.sendError(res, new ErrorResponse('Only the property owner can update this schedule', 403));
        }
      }

      // Validate status transitions
      if (status === 'confirmed' && !schedule.canBeConfirmed()) {
        return this.sendError(res, new ErrorResponse('Schedule cannot be confirmed (not in pending status)', 400));
      }

      // Update the schedule
      schedule.status = status;
      
      if (ownerResponse) {
        schedule.ownerResponse = ownerResponse;
      }

      if (meetingDetails) {
        schedule.meetingDetails = {
          ...schedule.meetingDetails,
          ...meetingDetails
        };
      }

      // Set timestamp based on status
      switch (status) {
        case 'confirmed':
          schedule.confirmedAt = new Date();
          break;
        case 'cancelled':
          schedule.cancelledAt = new Date();
          break;
        case 'completed':
          schedule.completedAt = new Date();
          break;
      }

      await schedule.save();

      // Populate and return updated schedule
      const updatedSchedule = await PropertySchedule.findById(schedule._id)
        .populate('property', 'title address images price')
        .populate('visitor', 'firstName lastName email phone')
        .populate('propertyOwner', 'firstName lastName email phone');

      this.sendResponse(res, {
        success: true,
        message: `Schedule ${status} successfully`,
        data: updatedSchedule
      });
    } catch (error) {
      console.error('Update schedule status error:', error);
      this.sendError(res, new ErrorResponse('Error updating schedule status', 500));
    }
  });

  // @desc    Get schedules for a specific property
  // @route   GET /api/schedules/property/:propertyId
  // @access  Private
  getPropertySchedules = this.asyncHandler(async (req, res) => {
    try {
      const { propertyId } = req.params;
      const { status } = req.query;

      // Check if property exists and user is authorized
      const property = await Property.findById(propertyId);
      if (!property) {
        return this.sendError(res, new ErrorResponse('Property not found', 404));
      }

      // Only property owner or admin can view property schedules
      if (property.owner.toString() !== req.user.id && req.user.role !== 'admin') {
        return this.sendError(res, new ErrorResponse('Not authorized to view schedules for this property', 403));
      }

      let query = { property: propertyId };
      
      if (status && ['pending', 'confirmed', 'cancelled', 'completed', 'rejected'].includes(status)) {
        query.status = status;
      }

      const schedules = await PropertySchedule.find(query)
        .populate('visitor', 'firstName lastName email phone')
        .sort('scheduledDate scheduledTime');

      this.sendResponse(res, {
        count: schedules.length,
        data: schedules
      });
    } catch (error) {
      console.error('Get property schedules error:', error);
      this.sendError(res, new ErrorResponse('Error retrieving property schedules', 500));
    }
  });

  // @desc    Get available time slots for a property on a specific date
  // @route   GET /api/schedules/availability/:propertyId/:date
  // @access  Public
  getAvailableTimeSlots = this.asyncHandler(async (req, res) => {
    try {
      const { propertyId, date } = req.params;

      // Validate date format
      const scheduleDate = new Date(date);
      if (isNaN(scheduleDate.getTime())) {
        return this.sendError(res, new ErrorResponse('Invalid date format', 400));
      }

      // Check if property exists
      const property = await Property.findById(propertyId);
      if (!property) {
        return this.sendError(res, new ErrorResponse('Property not found', 404));
      }

      // Get all booked time slots for this property on this date
      const bookedSlots = await PropertySchedule.find({
        property: propertyId,
        scheduledDate: scheduleDate,
        status: { $in: ['pending', 'confirmed'] }
      }).select('scheduledTime');

      const bookedTimes = bookedSlots.map(slot => slot.scheduledTime);

      // Define available time slots (9 AM to 5 PM, 30-minute intervals)
      const allTimeSlots = [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
        '15:00', '15:30', '16:00', '16:30', '17:00'
      ];

      // Filter out booked time slots
      const availableSlots = allTimeSlots.filter(time => !bookedTimes.includes(time));

      this.sendResponse(res, {
        date: date,
        availableSlots,
        bookedSlots: bookedTimes
      });
    } catch (error) {
      console.error('Get available time slots error:', error);
      this.sendError(res, new ErrorResponse('Error retrieving available time slots', 500));
    }
  });

  // @desc    Delete schedule
  // @route   DELETE /api/schedules/:id
  // @access  Private
  deleteSchedule = this.asyncHandler(async (req, res) => {
    try {
      const schedule = await PropertySchedule.findById(req.params.id);

      if (!schedule) {
        return this.sendError(res, new ErrorResponse('Schedule not found', 404));
      }

      // Only visitor or admin can delete
      if (schedule.visitor.toString() !== req.user.id && req.user.role !== 'admin') {
        return this.sendError(res, new ErrorResponse('Not authorized to delete this schedule', 403));
      }

      // Can only delete if status is pending or cancelled
      if (!['pending', 'cancelled'].includes(schedule.status)) {
        return this.sendError(res, new ErrorResponse('Cannot delete confirmed or completed schedules', 400));
      }

      await schedule.remove();

      this.sendResponse(res, { success: true, data: {} });
    } catch (error) {
      console.error('Delete schedule error:', error);
      this.sendError(res, new ErrorResponse('Error deleting schedule', 500));
    }
  });
}

module.exports = new ScheduleController();
