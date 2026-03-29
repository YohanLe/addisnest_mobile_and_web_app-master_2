const mongoose = require('mongoose');

const PropertyScheduleSchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.ObjectId,
    ref: 'Property',
    required: [true, 'Property is required']
  },
  visitor: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Visitor is required']
  },
  propertyOwner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Property owner is required']
  },
  tourType: {
    type: String,
    enum: ['in-person', 'video'],
    required: [true, 'Tour type is required']
  },
  scheduledDate: {
    type: Date,
    required: [true, 'Scheduled date is required']
  },
  scheduledTime: {
    type: String,
    required: [true, 'Scheduled time is required']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed', 'rejected'],
    default: 'pending'
  },
  visitorMessage: {
    type: String,
    maxlength: [500, 'Message cannot be more than 500 characters']
  },
  ownerResponse: {
    type: String,
    maxlength: [500, 'Response cannot be more than 500 characters']
  },
  visitorContact: {
    phone: {
      type: String,
      required: false // Make phone optional
    },
    email: {
      type: String,
      required: [true, 'Email is required']
    }
  },
  meetingDetails: {
    location: String, // For in-person tours
    meetingLink: String, // For video tours
    instructions: String
  },
  reminderSent: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  confirmedAt: Date,
  cancelledAt: Date,
  completedAt: Date
}, {
  timestamps: true
});

// Index for efficient queries
PropertyScheduleSchema.index({ property: 1, scheduledDate: 1 });
PropertyScheduleSchema.index({ visitor: 1, status: 1 });
PropertyScheduleSchema.index({ propertyOwner: 1, status: 1 });
PropertyScheduleSchema.index({ scheduledDate: 1, status: 1 });

// Virtual for formatted date and time
PropertyScheduleSchema.virtual('formattedDateTime').get(function() {
  if (!this.scheduledDate || !this.scheduledTime) return '';
  
  const date = new Date(this.scheduledDate);
  const options = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  
  return `${date.toLocaleDateString('en-US', options)} at ${this.scheduledTime}`;
});

// Pre-save middleware to update the updatedAt field
PropertyScheduleSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Static method to check for scheduling conflicts
PropertyScheduleSchema.statics.checkConflict = async function(propertyId, date, time, excludeId = null) {
  const query = {
    property: propertyId,
    scheduledDate: date,
    scheduledTime: time,
    status: { $in: ['pending', 'confirmed'] }
  };
  
  if (excludeId) {
    query._id = { $ne: excludeId };
  }
  
  const existingSchedule = await this.findOne(query);
  return !!existingSchedule;
};

// Instance method to check if schedule can be cancelled
PropertyScheduleSchema.methods.canBeCancelled = function() {
  const now = new Date();
  const scheduledDateTime = new Date(this.scheduledDate);
  const timeDiff = scheduledDateTime.getTime() - now.getTime();
  const hoursDiff = timeDiff / (1000 * 3600);
  
  // Can be cancelled if more than 2 hours before scheduled time
  return hoursDiff > 2 && ['pending', 'confirmed'].includes(this.status);
};

// Instance method to check if schedule can be confirmed
PropertyScheduleSchema.methods.canBeConfirmed = function() {
  return this.status === 'pending';
};

module.exports = mongoose.model('PropertySchedule', PropertyScheduleSchema);
