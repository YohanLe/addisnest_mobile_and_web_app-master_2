const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ownerName: {
    type: String,
    required: false,
    trim: true
  },
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  propertyType: {
    type: String,
    required: [true, 'Please specify property type'],
    enum: [
      'House',
      'Apartment',
      'Commercial',
      'Land',
      'Villa',
      'Condo',
      'Townhouse',
      'Other'
    ]
  },
  offeringType: {
    type: String,
    required: [true, 'Please specify if the property is for sale or rent'],
    enum: ['For Sale', 'For Rent']
  },
  status: {
    type: String,
    required: [true, 'Please specify property status'],
    enum: ['For Sale', 'For Rent', 'Sold', 'Rented', 'Pending', 'pending_payment', 'active', 'pending']
  },
  furnishingStatus: {
    type: String,
    required: false,
    enum: ['Furnished', 'Unfurnished', 'Semi-Furnished']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price']
  },
  area: {
    type: Number,
    required: [true, 'Please add property area in sq ft']
  },
  bedrooms: {
    type: Number,
    required: [true, 'Please add number of bedrooms']
  },
  bathrooms: {
    type: Number,
    required: [true, 'Please add number of bathrooms']
  },
  // Nested address structure
  address: {
    regionalState: {
      type: String,
      required: true,
    },
    subCity: {
        type: String,
        required: false
    },
    city: {
        type: String,
        required: false
    },
    country: {
      type: String,
      required: true,
      default: 'Ethiopia'
    }
  },
  // Image array with URL and caption objects
  images: [
    {
      url: {
        type: String,
        required: true
      },
      caption: {
        type: String,
        default: ''
      }
    }
  ],
  // Features as an object with boolean properties
  features: {
    type: Object,
    default: { hasPool: false }
  },
  promotionType: {
    type: String,
    enum: ['Basic', 'VIP', 'Diamond', 'None'],
    default: 'None'
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add virtual for all messages related to this property
PropertySchema.virtual('messages', {
  ref: 'Message',
  localField: '_id',
  foreignField: 'property',
  justOne: false
});

module.exports = mongoose.model('Property', PropertySchema);
