const { BaseController, ErrorResponse } = require('./baseController');
const { Property, User } = require('../models');

class PropertyController extends BaseController {
  constructor() {
    super();
  }

  // @desc    Create a new property
  // @route   POST /api/properties
  // @access  Private
  // Helper method to ensure all required address fields are present
  ensureAddressFields(data) {
    // Prepare fallback values for required address fields
    const fallbackStreet = "Unknown Street";
    const fallbackCity = "Unknown City";
    const fallbackState = "Unknown State";
    const fallbackCountry = "Ethiopia";
    
    // Handle different possible address field locations
    if (data.address && typeof data.address === 'object') {
      // Extract from nested address object to top-level properties
      data.street = data.street || data.address.street || data.property_address || fallbackStreet;
      data.city = data.city || data.address.city || fallbackCity;
      data.state = data.state || data.address.state || data.regional_state || fallbackState;
      data.country = data.country || data.address.country || fallbackCountry;
      
      // Remove the nested address object as it's not part of the schema
      delete data.address;
    } else {
      // Set flat fields with proper fallbacks
      data.street = data.street || data.property_address || fallbackStreet;
      data.city = data.city || fallbackCity;
      data.state = data.state || data.regional_state || fallbackState;
      data.country = data.country || fallbackCountry;
    }
    
    // Log the address fields for debugging
    console.log('Ensured address fields:', {
      street: data.street,
      city: data.city,
      state: data.state,
      country: data.country
    });
    
    return data;
  }
  
  // Helper method to sanitize property data before saving
  sanitizePropertyData(data) {
    // Remove fields that are not in the schema or that could cause validation issues
    delete data.paymentStatus; // Not in schema
    delete data.property_address; // Legacy field, use street instead
    delete data.regional_state; // Legacy field, use state instead
    
    // Ensure numerical fields are numbers
    data.price = Number(data.price) || 0;
    data.area = Number(data.area) || 0;
    data.bedrooms = Number(data.bedrooms) || 0;
    data.bathrooms = Number(data.bathrooms) || 0;
    
    // Ensure features is an object
    if (!data.features || typeof data.features !== 'object') {
      data.features = { hasPool: false };
    }
    
    // Ensure images array exists
    if (!data.images || !Array.isArray(data.images)) {
      data.images = [];
    }
    
    // Convert any media_paths to images format if needed
    if (data.media_paths) {
      if (!Array.isArray(data.media_paths)) {
        data.media_paths = [data.media_paths]; // Convert to array if it's a single string
      }
      
      if (data.media_paths.length > 0) {
        // Add any media_paths items that aren't already in images
        const mediaPathUrls = data.media_paths.map(path => {
          if (typeof path === 'string') return path;
          return path.url || String(path);
        });
        
        // Add any missing media paths to images
        mediaPathUrls.forEach(url => {
          // Check if this URL is already in images
          const isAlreadyInImages = data.images.some(img => 
            img.url === url || (typeof img === 'string' && img === url)
          );
          
          if (!isAlreadyInImages) {
            data.images.push({ url: url });
          }
        });
      }
    }
    
    return data;
  }

  createProperty = this.asyncHandler(async (req, res) => {
    try {
      // Add user to req.body
      req.body.owner = req.user.id;
      console.log('User role:', req.user.role);
      
      // Check promotionType for logic
      const promotionType = req.body.promotionType || 'Basic';
      if (promotionType === 'Basic' || promotionType === 'None') {
        req.body.status = 'active';
        req.body.promotionType = 'Basic';
      } else if (promotionType === 'VIP' || promotionType === 'Diamond') {
        req.body.status = 'Pending';  // Fixed: changed from 'pending' to 'Pending' to match enum
        req.body.promotionType = promotionType;
      } else {
        req.body.status = 'active';
        req.body.promotionType = promotionType;
      }
      
      console.log('Creating property with data:', req.body);
      
      // Basic validation for required fields
      if (!req.body.propertyType || !req.body.price || !req.body.title || !req.body.offeringType) {
        return this.sendError(res, new ErrorResponse('Missing required fields (propertyType, price, title, or offeringType)', 400));
      }
      
      // CRITICAL FIX: Ensure all required address fields are present
      this.ensureAddressFields(req.body);
      
      // Check for duplicate properties before creating a new one
      const potentialDuplicate = await Property.findOne({
        owner: req.user.id,
        title: req.body.title,
        price: req.body.price,
        propertyType: req.body.propertyType,
        createdAt: { $gte: new Date(Date.now() - 60 * 1000) } // Check only within the last minute
      });
      
      if (potentialDuplicate) {
        console.log(`Prevented duplicate property creation. Existing property: ${potentialDuplicate._id}`);
        return this.sendResponse(res, potentialDuplicate, 200);
      }
      
      // Remove any fields that could cause validation errors
      this.sanitizePropertyData(req.body);
      
      // Create the property
      const property = await Property.create(req.body);
      console.log('Property created successfully:', property._id);
      this.sendResponse(res, property, 201);
    } catch (err) {
      console.error('Create property error:', err);
      if (err.name === 'ValidationError') {
        // Handle mongoose validation errors
        const messages = Object.values(err.errors).map(val => val.message);
        return this.sendError(res, new ErrorResponse(messages.join(', '), 400));
      }
      this.sendError(res, new ErrorResponse(err.message || 'Error creating property', 500));
    }
  });

  // @desc    Get all properties
  // @route   GET /api/properties
  // @access  Public
  getAllProperties = this.asyncHandler(async (req, res) => {
    // Copy req.query
    const reqQuery = { ...req.query };
    
    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];
    
    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);
    
    // Handle the 'for' parameter separately for filtering by offering type
    if (req.query.for) {
      // Map 'for' parameter values to offeringType values in the database
      const offeringTypeMap = {
        'buy': 'For Sale',
        'rent': 'For Rent', 
        'sell': 'For Sale'
      };
      
      // Add offeringType filter based on 'for' parameter
      if (offeringTypeMap[req.query.for]) {
        reqQuery.offeringType = offeringTypeMap[req.query.for];
        console.log(`Filtering properties by offeringType: ${reqQuery.offeringType}`);
      }
      
      // Remove the 'for' parameter since we've handled it separately
      delete reqQuery.for;
    }
    
    // Create query string
    let queryStr = JSON.stringify(reqQuery);
    
    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    
    console.log('Final property filter query:', queryStr);
    
    // Finding resource
    let query = Property.find(JSON.parse(queryStr)).populate({
      path: 'owner',
      select: 'firstName lastName email phone'
    });

    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Property.countDocuments(JSON.parse(queryStr));

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const properties = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
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
      count: properties.length,
      pagination,
      data: properties
    });
  });

  // @desc    Get single property
  // @route   GET /api/properties/:id
  // @access  Public
  getPropertyById = this.asyncHandler(async (req, res) => {
    // Normalize the ID to handle various formats
    let propertyId = req.params.id;
    
    // Log the request for debugging
    console.log(`getPropertyById called with ID: ${propertyId}`);
    
    // Handle ObjectId format - extract the hex string if ID is in format ObjectId("...")
    if (typeof propertyId === 'string' && propertyId.startsWith('ObjectId(') && propertyId.endsWith(')')) {
      propertyId = propertyId.substring(9, propertyId.length - 1);
      console.log(`Extracted ID from ObjectId format: ${propertyId}`);
    }
    
    // Remove quotes if present
    if (typeof propertyId === 'string' && 
        ((propertyId.startsWith('"') && propertyId.endsWith('"')) || 
         (propertyId.startsWith("'") && propertyId.endsWith("'")))) {
      propertyId = propertyId.substring(1, propertyId.length - 1);
      console.log(`Removed quotes from ID: ${propertyId}`);
    }
    
    // Validate MongoDB ID format
    const isValidMongoId = /^[0-9a-fA-F]{24}$/.test(propertyId);
    if (!isValidMongoId) {
      console.error(`Invalid MongoDB ID format: ${propertyId}`);
      return this.sendError(res, new ErrorResponse(`Invalid property ID format: ${req.params.id}`, 400));
    }
    
    try {
      const property = await Property.findById(propertyId).populate({
        path: 'owner',
        select: 'firstName lastName email phone'
      });

      if (!property) {
        console.log(`Property not found with id: ${propertyId}`);
        return this.sendError(res, new ErrorResponse(`Property not found with id of ${propertyId}`, 404));
      }

      // Increment view count
      property.views += 1;
      await property.save();

      console.log(`Successfully retrieved property: ${propertyId}`);
      this.sendResponse(res, property);
    } catch (error) {
      console.error(`Error finding property with ID ${propertyId}:`, error);
      return this.sendError(res, new ErrorResponse(`Error retrieving property: ${error.message}`, 500));
    }
  });

  // @desc    Update property
  // @route   PUT /api/properties/:id
  // @access  Private
  updateProperty = this.asyncHandler(async (req, res) => {
    let property = await Property.findById(req.params.id);

    if (!property) {
      return this.sendError(res, new ErrorResponse(`Property not found with id of ${req.params.id}`, 404));
    }

    // Make sure user is property owner
    if (property.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return this.sendError(res, new ErrorResponse(`User ${req.user.id} is not authorized to update this property`, 401));
    }

    // Ensure all required address fields are present
    this.ensureAddressFields(req.body);
    
    // Sanitize the property data
    this.sanitizePropertyData(req.body);

    property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    this.sendResponse(res, property);
  });

  // @desc    Submit a property with pending_payment or active status based on promotion_package
  // @route   POST /api/property-submit
  // @access  Private
  submitPropertyPending = this.asyncHandler(async (req, res) => {
    try {
      // Add user to req.body
      req.body.owner = req.user.id;
      
      // Check promotionType for logic
      const promotionType = req.body.promotionType || 'Basic';
      if (promotionType === 'Basic' || promotionType === 'None') {
        req.body.status = 'active';
        req.body.promotionType = 'Basic';
        console.log('Setting property status to ACTIVE for basic package');
      } else if (promotionType === 'VIP' || promotionType === 'Diamond') {
        req.body.status = 'Pending';  // Fixed: changed from 'pending' to 'Pending' to match enum
        req.body.promotionType = promotionType;
        console.log('Setting property status to PENDING for premium package');
      } else {
        req.body.status = 'active';
        req.body.promotionType = promotionType;
        console.log('Setting property status to ACTIVE for other package');
      }
      
      console.log('Submitting property:', {
        propertyType: req.body.propertyType,
        price: req.body.price,
        title: req.body.title,
        ownerId: req.user.id,
        package: req.body.promotion_package || 'not specified',
        status: req.body.status
      });
      
      // Basic validation
      if (!req.body.propertyType || !req.body.price || !req.body.title || !req.body.offeringType) {
        return this.sendError(res, new ErrorResponse('Missing required fields (propertyType, price, title, or offeringType)', 400));
      }
      
      // Ensure all required address fields are present
      this.ensureAddressFields(req.body);
      
      // Check for duplicate properties before creating a new one
      const potentialDuplicate = await Property.findOne({
        owner: req.user.id,
        title: req.body.title,
        price: req.body.price,
        propertyType: req.body.propertyType,
        createdAt: { $gte: new Date(Date.now() - 60 * 1000) } // Check only within the last minute
      });
      
      if (potentialDuplicate) {
        console.log(`Prevented duplicate property submission. Existing property: ${potentialDuplicate._id}`);
        return this.sendResponse(res, potentialDuplicate, 200);
      }
      
      // Sanitize the property data
      this.sanitizePropertyData(req.body);
      
      // Create the property
      const property = await Property.create(req.body);
      console.log('Property created successfully with ID:', property._id);
      
      // Return the created property
      this.sendResponse(res, property, 201);
    } catch (err) {
      console.error('Submit property error:', err);
      if (err.name === 'ValidationError') {
        // Handle mongoose validation errors
        const messages = Object.values(err.errors).map(val => val.message);
        return this.sendError(res, new ErrorResponse(messages.join(', '), 400));
      }
      this.sendError(res, new ErrorResponse(err.message || 'Error submitting property', 500));
    }
  });

  // @desc    Delete property
  // @route   DELETE /api/properties/:id
  // @access  Private
  deleteProperty = this.asyncHandler(async (req, res) => {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return this.sendError(res, new ErrorResponse(`Property not found with id of ${req.params.id}`, 404));
    }

    // Make sure user is property owner
    if (property.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return this.sendError(res, new ErrorResponse(`User ${req.user.id} is not authorized to delete this property`, 401));
    }

    await property.remove();

    this.sendResponse(res, { success: true, data: {} });
  });

  // @desc    Upload photos for property
  // @route   PUT /api/properties/:id/photos
  // @access  Private
  uploadPropertyPhotos = this.asyncHandler(async (req, res) => {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return this.sendError(res, new ErrorResponse(`Property not found with id of ${req.params.id}`, 404));
    }

    // Make sure user is property owner
    if (property.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return this.sendError(res, new ErrorResponse(`User ${req.user.id} is not authorized to update this property`, 401));
    }

    if (!req.files) {
      return this.sendError(res, new ErrorResponse(`Please upload a file`, 400));
    }

    // Handle multiple photo uploads
    const files = Array.isArray(req.files.photos) ? req.files.photos : [req.files.photos];

    // Add photos to property
    const uploadedPhotos = [];
    for (const file of files) {
      // Check if file is an image
      if (!file.mimetype.startsWith('image')) {
        return this.sendError(res, new ErrorResponse(`Please upload an image file`, 400));
      }

      // Check filesize
      if (file.size > process.env.MAX_FILE_UPLOAD) {
        return this.sendError(res, new ErrorResponse(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD / 1000000}MB`, 400));
      }

      // Create custom filename
      const fileName = `property_${property._id}_photo_${Date.now()}${file.name.substring(file.name.lastIndexOf('.'))}`;

      // Upload file
      file.mv(`${process.env.FILE_UPLOAD_PATH}/${fileName}`, async err => {
        if (err) {
          console.error(err);
          return this.sendError(res, new ErrorResponse(`Problem with file upload`, 500));
        }

        // Add to uploaded photos array
        uploadedPhotos.push({
          url: `${process.env.FILE_UPLOAD_BASE_URL}/${fileName}`
        });

        // If all files have been processed, update property and send response
        if (uploadedPhotos.length === files.length) {
          // Add new photos to property
          property.images = [...property.images, ...uploadedPhotos];
          await property.save();

          this.sendResponse(res, property.images);
        }
      });
    }
  });

  // @desc    Get properties by user
  // @route   GET /api/properties/user/:userId
  // @access  Public
  getPropertiesByUser = this.asyncHandler(async (req, res) => {
    // Verify user exists
    const user = await User.findById(req.params.userId);
    if (!user) {
      return this.sendError(res, new ErrorResponse(`User not found with id of ${req.params.userId}`, 404));
    }

    const properties = await Property.find({ owner: req.params.userId }).sort('-createdAt');

    this.sendResponse(res, {
      count: properties.length,
      data: properties
    });
  });

  // @desc    Get featured properties
  // @route   GET /api/properties/featured
  // @access  Public
  getFeaturedProperties = this.asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit, 10) || 6;
    
    // Featured properties are premium and have high view counts
    const properties = await Property.find({ isPremium: true })
      .sort('-views')
      .limit(limit)
      .populate({
        path: 'owner',
        select: 'firstName lastName'
      });

    this.sendResponse(res, properties);
  });

  // @desc    Search properties
  // @route   GET /api/properties/search
  // @access  Public
  // @desc    Get property by MongoDB _id
  // @route   GET /api/property-by-id/:id
  // @access  Public
  getPropertyByMongoId = this.asyncHandler(async (req, res) => {
    // Get the MongoDB _id from params
    let mongoId = req.params.id;
    
    console.log(`getPropertyByMongoId called with ID: ${mongoId}`);
    
    // Validate MongoDB ID format
    const isValidMongoId = /^[0-9a-fA-F]{24}$/.test(mongoId);
    if (!isValidMongoId) {
      console.error(`Invalid MongoDB ID format: ${mongoId}`);
      return this.sendError(res, new ErrorResponse(`Invalid MongoDB ID format: ${mongoId}`, 400));
    }
    
    try {
      // First try direct _id lookup
      let property = await Property.findOne({ _id: mongoId }).populate({
        path: 'owner',
        select: 'firstName lastName email phone'
      });
      
      // If not found, try id field (some records might use id instead of _id)
      if (!property) {
        property = await Property.findOne({ id: mongoId }).populate({
          path: 'owner',
          select: 'firstName lastName email phone'
        });
      }

      if (!property) {
        console.log(`Property not found with MongoDB _id: ${mongoId}`);
        return this.sendError(res, new ErrorResponse(`Property not found with MongoDB _id: ${mongoId}`, 404));
      }

      console.log(`Successfully retrieved property with MongoDB _id: ${mongoId}`);
      this.sendResponse(res, property);
    } catch (error) {
      console.error(`Error finding property with MongoDB _id ${mongoId}:`, error);
      return this.sendError(res, new ErrorResponse(`Error retrieving property: ${error.message}`, 500));
    }
  });
  
  searchProperties = this.asyncHandler(async (req, res) => {
    const { q, type, minPrice, maxPrice, beds, baths, status, offeringType } = req.query;
    
    // Build query
    const query = {};
    
    // Search term
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { city: { $regex: q, $options: 'i' } },
        { state: { $regex: q, $options: 'i' } }
      ];
    }
    
    // Property type
    if (type) {
      query.propertyType = type;
    }
    
    // Price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseInt(minPrice);
      if (maxPrice) query.price.$lte = parseInt(maxPrice);
    }
    
    // Bedrooms
    if (beds) {
      query.bedrooms = { $gte: parseInt(beds) };
    }
    
    // Bathrooms
    if (baths) {
      query.bathrooms = { $gte: parseInt(baths) };
    }
    
    // Status
    if (status) {
      query.status = status;
    }
    
    // Offering Type (For Sale or For Rent)
    if (offeringType) {
      query.offeringType = offeringType;
    }
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    // Execute query
    const total = await Property.countDocuments(query);
    const properties = await Property.find(query)
      .populate({
        path: 'owner',
        select: 'firstName lastName'
      })
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
      count: properties.length,
      total,
      pagination,
      data: properties
    });
  });
}

module.exports = new PropertyController();
