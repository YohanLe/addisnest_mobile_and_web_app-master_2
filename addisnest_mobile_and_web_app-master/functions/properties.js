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

// Import the Property model
let Property;
try {
  Property = require('../src/models/Property');
} catch (err) {
  console.error('Error importing Property model:', err);
}

// Database connection
const connectDB = async () => {
  try {
    // Get MongoDB URI from environment variable
    const mongoUri = process.env.MONGO_URI;
    
    // Check if the MongoDB URI has a database name
    const hasDBName = mongoUri.split('/').length > 3;
    
    // Add database name if missing
    const connectionString = hasDBName ? mongoUri : `${mongoUri}/addisnest`;
    
    console.log('Connecting to MongoDB with URI:', connectionString.replace(/:[^\/]+@/, ':****@'));
    
    const conn = await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    return null;
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
  
  // Connect to database if not already connected
  if (mongoose.connection.readyState !== 1) {
    await connectDB();
  }
  
  // Handle the request
  return handler(event, context);
};
