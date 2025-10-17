const express = require('express');
const serverless = require('serverless-http');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Load env vars
dotenv.config();

// Create Express app
const app = express();

// Enable CORS with specific configuration
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl requests)
    if (!origin) return callback(null, true);
    
    // Allow any subdomain of netlify.app
    if (origin.endsWith('netlify.app') || origin.includes('--addisnesttest.netlify.app')) {
      return callback(null, true);
    }
    
    // Allow localhost for development
    if (origin.match(/^https?:\/\/localhost(:\d+)?$/)) {
      return callback(null, true);
    }
    
    // Add your production domain here if needed
    if (origin === 'https://addisnesttest.netlify.app') {
      return callback(null, true);
    }
    
    callback(null, true); // Temporarily allow all origins while debugging
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Set additional CORS headers for all responses
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Body parser
app.use(express.json());

// Define Property schema directly in the function
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

// Create or get the Property model
let Property;
try {
  Property = mongoose.model('Property');
} catch (error) {
  Property = mongoose.model('Property', PropertySchema);
}

// Database connection with enhanced error handling
const connectDB = async () => {
  try {
    // Get MongoDB URI from environment variable
    const mongoUri = process.env.MONGO_URI;
    
    if (!mongoUri) {
      throw new Error('MONGO_URI environment variable is not set');
    }
    
    console.log('Environment check - MONGO_URI exists:', !!mongoUri);
    console.log('MONGO_URI length:', mongoUri.length);
    
    // Check if the MongoDB URI has a database name
    const hasDBName = mongoUri.split('/').length > 3 && mongoUri.split('/')[3] !== '';
    
    // Add database name if missing
    const connectionString = hasDBName ? mongoUri : `${mongoUri}/addisnest`;
    
    console.log('Connecting to MongoDB...');
    console.log('Connection string (masked):', connectionString.replace(/:[^\/]+@/, ':****@'));
    console.log('Has database name:', hasDBName);
    
    // Enhanced connection options for serverless environment
    const conn = await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // 10 seconds
      socketTimeoutMS: 45000, // 45 seconds
      maxPoolSize: 10,
      minPoolSize: 1,
      maxIdleTimeMS: 30000,
      bufferCommands: false,
      bufferMaxEntries: 0
    });
    
    console.log(`MongoDB Connected Successfully: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
    console.log(`Connection state: ${conn.connection.readyState}`);
    
    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.error('Full error:', error);
    throw error;
  }
};

// POST endpoint for creating or updating properties
app.post('/', async (req, res) => {
  try {
    console.log('POST request to /properties received');
    console.log('Request body:', JSON.stringify(req.body));
    
    // Check if property has an ID (update case)
    if (req.body._id) {
      console.log(`Attempting to update property with ID: ${req.body._id}`);
      
      const updatedProperty = await Property.findByIdAndUpdate(
        req.body._id,
        req.body,
        { new: true, runValidators: true }
      );
      
      if (!updatedProperty) {
        console.log('Property not found for update');
        return res.status(404).json({
          success: false,
          error: 'Property not found'
        });
      }
      
      console.log('Property successfully updated');
      return res.status(200).json({
        success: true,
        data: updatedProperty
      });
    }
    
    // Create new property
    console.log('Creating new property');
    const property = await Property.create(req.body);
    
    console.log('Property successfully created with ID:', property._id);
    return res.status(201).json({
      success: true,
      data: property
    });
    
  } catch (error) {
    console.error('Error in POST /properties:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET endpoint for properties
app.get('/', async (req, res) => {
  try {
    // Extract query parameters
    const { 
      for: offeringType, 
      page = 1, 
      limit = 10, 
      search = '',
      priceRange = 'any',
      propertyType = 'all',
      bedrooms = 'any',
      bathrooms = 'any',
      regionalState = 'all',
      sortBy = 'newest'
    } = req.query;
    
    console.log('Received property search query:', req.query);
    
    // Build query object
    const query = {};
    
    // Add offering type filter (buy/rent)
    if (offeringType === 'buy') {
      query.offeringType = 'For Sale';
    } else if (offeringType === 'rent') {
      query.offeringType = 'For Rent';
    }
    
    // Add search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'address.city': { $regex: search, $options: 'i' } },
        { 'address.state': { $regex: search, $options: 'i' } }
      ];
    }
    
    // Add property type filter
    if (propertyType !== 'all') {
      query.propertyType = propertyType;
    }
    
    // Add bedrooms filter
    if (bedrooms !== 'any') {
      query.bedrooms = { $gte: parseInt(bedrooms, 10) };
    }
    
    // Add bathrooms filter
    if (bathrooms !== 'any') {
      query.bathrooms = { $gte: parseInt(bathrooms, 10) };
    }
    
    // Add regional state filter
    if (regionalState !== 'all') {
      query['address.state'] = regionalState;
    }
    
    // Add price range filter
    if (priceRange !== 'any') {
      const [min, max] = priceRange.split('-').map(p => parseInt(p, 10));
      query.price = {};
      if (min) query.price.$gte = min;
      if (max) query.price.$lte = max;
    }
    
    // Determine sort order
    let sortOrder = {};
    switch (sortBy) {
      case 'newest':
        sortOrder = { createdAt: -1 };
        break;
      case 'oldest':
        sortOrder = { createdAt: 1 };
        break;
      case 'price-high-low':
        sortOrder = { price: -1 };
        break;
      case 'price-low-high':
        sortOrder = { price: 1 };
        break;
      default:
        sortOrder = { createdAt: -1 };
    }
    
    // Calculate pagination
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;
    
    // Get properties with pagination
    const properties = await Property.find(query)
      .sort(sortOrder)
      .skip(skip)
      .limit(limitNum);
    
    // Get total count for pagination
    const total = await Property.countDocuments(query);
    
    // Send response
    res.status(200).json({
      success: true,
      count: properties.length,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      data: properties
    });
    
  } catch (error) {
    console.error('Error in properties function:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET endpoint for properties by user ID
app.get('/user/:userId', async (req, res) => {
  try {
    console.log('Fetching properties for user:', req.params.userId);
    console.log('MongoDB connection state:', mongoose.connection.readyState);
    
    const userIdParam = req.params.userId;
    
    // Debug: Check total properties in database
    const totalProperties = await Property.countDocuments();
    console.log(`Total properties in database: ${totalProperties}`);
    
    // Debug: Check properties with pending status
    const pendingProperties = await Property.countDocuments({ status: 'pending' });
    console.log(`Properties with pending status: ${pendingProperties}`);
    
    // Try multiple query approaches to ensure we find the properties
    let properties = [];
    
    // First, try with ObjectId conversion (this should work based on our debug)
    if (mongoose.Types.ObjectId.isValid(userIdParam)) {
      const userIdAsObjectId = new mongoose.Types.ObjectId(userIdParam);
      properties = await Property.find({ 
        owner: userIdAsObjectId
      }).sort({ createdAt: -1 });
      
      console.log(`Found ${properties.length} properties with ObjectId query`);
      
      // Debug: Also try including pending status specifically
      if (properties.length === 0) {
        const pendingPropsForUser = await Property.find({ 
          owner: userIdAsObjectId,
          status: 'pending'
        }).sort({ createdAt: -1 });
        console.log(`Found ${pendingPropsForUser.length} pending properties for user with ObjectId`);
        properties = pendingPropsForUser;
      }
    }
    
    // If no properties found, try with string query as fallback
    if (properties.length === 0) {
      properties = await Property.find({ 
        owner: userIdParam
      }).sort({ createdAt: -1 });
      
      console.log(`Found ${properties.length} properties with string query`);
      
      // Debug: Also try including pending status specifically
      if (properties.length === 0) {
        const pendingPropsForUser = await Property.find({ 
          owner: userIdParam,
          status: 'pending'
        }).sort({ createdAt: -1 });
        console.log(`Found ${pendingPropsForUser.length} pending properties for user with string`);
        properties = pendingPropsForUser;
      }
    }
    
    // If still no properties, try other possible field names
    if (properties.length === 0) {
      const alternativeQueries = [
        { ownerId: userIdParam },
        { ownerId: mongoose.Types.ObjectId.isValid(userIdParam) ? new mongoose.Types.ObjectId(userIdParam) : userIdParam },
        { userId: userIdParam },
        { userId: mongoose.Types.ObjectId.isValid(userIdParam) ? new mongoose.Types.ObjectId(userIdParam) : userIdParam },
        { user: userIdParam },
        { user: mongoose.Types.ObjectId.isValid(userIdParam) ? new mongoose.Types.ObjectId(userIdParam) : userIdParam }
      ];
      
      for (const query of alternativeQueries) {
        properties = await Property.find(query).sort({ createdAt: -1 });
        if (properties.length > 0) {
          console.log(`Found ${properties.length} properties with alternative query:`, query);
          break;
        }
      }
    }
    
    // Debug: If still no properties, let's see what's in the database
    if (properties.length === 0) {
      console.log('No properties found, checking database contents...');
      const sampleProperties = await Property.find().limit(5);
      console.log('Sample properties in database:');
      sampleProperties.forEach(prop => {
        console.log(`- ID: ${prop._id}, Owner: ${prop.owner}, Status: ${prop.status}, Title: ${prop.title}`);
      });
    }
    
    console.log(`Final result: Found ${properties.length} properties for user ${req.params.userId}`);
    
    res.status(200).json({
      success: true,
      count: properties.length,
      data: properties
    });
    
  } catch (error) {
    console.error('Error fetching user properties:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET endpoint for a single property by ID
app.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        error: 'Property not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: property
    });
    
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Create serverless handler
const handler = serverless(app);

// Wrap the handler to ensure MongoDB is connected
exports.handler = async (event, context) => {
  // Make sure MongoDB is connected before handling the request
  context.callbackWaitsForEmptyEventLoop = false;
  
  try {
    console.log('=== Netlify Function Handler Started ===');
    console.log('Event path:', event.path);
    console.log('Event httpMethod:', event.httpMethod);
    console.log('Current connection state:', mongoose.connection.readyState);
    
    // Connect to database if not already connected
    if (mongoose.connection.readyState !== 1) {
      console.log('Database not connected, attempting connection...');
      await connectDB();
      console.log('Database connection established');
    } else {
      console.log('Database already connected');
    }
    
    // Verify connection is working
    if (mongoose.connection.readyState !== 1) {
      throw new Error('Failed to establish database connection');
    }
    
    console.log('Processing request...');
    
    // Handle the request
    const result = await handler(event, context);
    
    console.log('Request processed successfully');
    return result;
    
  } catch (error) {
    console.error('Handler error:', error);
    
    // Return error response
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: false,
        error: 'Internal server error: ' + error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      })
    };
  }
};
