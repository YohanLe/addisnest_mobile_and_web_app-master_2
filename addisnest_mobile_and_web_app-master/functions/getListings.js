const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// Import Property model - using dynamic require to avoid circular dependencies
let Property;

// Handler for the Netlify function
exports.handler = async (event, context) => {
  try {
    // Make database connection non-blocking
    context.callbackWaitsForEmptyEventLoop = false;
    
    // Connect to MongoDB if not already connected
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }
    
    // Dynamically import the Property model
    if (!Property) {
      try {
        Property = require('../src/models/Property');
      } catch (err) {
        console.error('Error importing Property model:', err);
        return {
          statusCode: 500,
          body: JSON.stringify({ 
            success: false, 
            error: 'Error loading Property model' 
          })
        };
      }
    }

    // Parse query parameters
    const queryParams = event.queryStringParameters || {};
    
    // Extract filtering parameters
    const { status, type, minPrice, maxPrice, bedrooms, bathrooms, limit = 10, page = 1 } = queryParams;
    
    // Build query object
    const query = {};
    
    // Add filters if they exist
    if (status) query.status = status;
    if (type) query.type = type;
    if (bedrooms) query.bedrooms = { $gte: parseInt(bedrooms, 10) };
    if (bathrooms) query.bathrooms = { $gte: parseInt(bathrooms, 10) };
    
    // Add price range if specified
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseInt(minPrice, 10);
      if (maxPrice) query.price.$lte = parseInt(maxPrice, 10);
    }
    
    // Calculate pagination
    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    
    // Get properties with pagination
    const properties = await Property.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10));
    
    // Get total count for pagination
    const total = await Property.countDocuments(query);
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
      },
      body: JSON.stringify({
        success: true,
        count: properties.length,
        totalPages: Math.ceil(total / parseInt(limit, 10)),
        currentPage: parseInt(page, 10),
        data: properties
      })
    };
    
  } catch (error) {
    console.error('Error in getListings function:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
      },
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
};

// Database connection function
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
