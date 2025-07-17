const { BaseController, ErrorResponse } = require('./baseController');
const { Property, User } = require('../models');

class PropertyController extends BaseController {
  constructor() {
    super();
  }

  // @desc    Create a new property
  // @route   POST /api/properties
  // @access  Private
  createProperty = this.asyncHandler(async (req, res) => {
    try {
      // Add user to req.body
      req.body.owner = req.user.id;
      // Add owner name to req.body
      req.body.ownerName = `${req.user.firstName} ${req.user.lastName}`;
      console.log('User role:', req.user.role);
      
      // Check promotionType for logic
      const promotionType = req.body.promotionType || 'Basic';
      if (promotionType === 'Basic' || promotionType === 'None') {
        req.body.status = 'active';
        req.body.promotionType = 'Basic';
      } else if (promotionType === 'VIP' || promotionType === 'Diamond') {
        req.body.status = 'pending';
        req.body.promotionType = promotionType;
      } else {
        req.body.status = 'active';
        req.body.promotionType = promotionType;
      }
      
      // No need to manually reconstruct the address object if it's already in the correct format.
      // The frontend is now sending the address object in the correct format.
      
      console.log('Creating property with data:', req.body);
      
      // Basic validation
      if (!req.body.propertyType || !req.body.price || !req.body.title || !req.body.offeringType) {
        return this.sendError(res, new ErrorResponse('Missing required fields (propertyType, price, title, or offeringType)', 400));
      }
      
      // Check for duplicate properties before creating a new one (more restrictive check)
      const potentialDuplicate = await Property.findOne({
        owner: req.user.id,
        title: req.body.title,
        price: req.body.price,
        propertyType: req.body.propertyType,
        'address.subCity': req.body.address?.subCity,
        'address.regionalState': req.body.address?.regionalState,
        createdAt: { $gte: new Date(Date.now() - 30 * 1000) } // Check only within the last 30 seconds
      });
      
      if (potentialDuplicate) {
        console.log(`Prevented duplicate property creation. Existing property: ${potentialDuplicate._id}`);
        return this.sendResponse(res, potentialDuplicate, 200);
      }
      
      // Remove promotionType from property data if present (keep it in propertyData)
      const propertyData = { ...req.body };
      
      // Ensure _id is not passed to create method
      delete propertyData._id;

      const property = await Property.create(propertyData);
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

  getAllProperties = this.asyncHandler(async (req, res) => {
    const {
        select,
        sort,
        page: pageStr = '1',
        limit: limitStr = '10',
        for: offeringTypeFor,
        search,
        priceRange,
        propertyType,
        bedrooms,
        bathrooms,
        regionalState,
        sortBy
    } = req.query;

    console.log('=== PROPERTY QUERY DEBUG ===');
    console.log('Request query params:', req.query);

    const query = {};

    // Handle 'for' parameter for offering type
    if (req.query.for) {
        const offeringTypeMap = {
            'buy': 'For Sale',
            'rent': 'For Rent',
            'sell': 'For Sale',
            'sale': 'For Sale'
        };
        if (offeringTypeMap[req.query.for]) {
            query.offeringType = offeringTypeMap[req.query.for];
            console.log(`Filtering for offeringType: ${query.offeringType}`);
        }
    }

    // Handle search query with wildcard support
    if (search) {
        const searchKeywords = search.split(/\s+/).filter(Boolean); // Split by spaces and remove empty strings
        
        // Create a regex for each keyword to allow partial matching
        const keywordRegex = searchKeywords.map(keyword => new RegExp(keyword, 'i'));

        // Build a query that requires all keywords to match in any of the specified fields
        query.$and = (query.$and || []).concat(keywordRegex.map(regex => ({
            $or: [
                { title: regex },
                { description: regex },
                { 'address.subCity': regex },
                { 'address.state': regex },
                { 'address.regionalState': regex },
                { 'address.street': regex },
                { propertyType: regex },
                { feature: regex }
            ]
        })));
    }

    // Handle propertyType filter
    if (propertyType && propertyType.toLowerCase() !== 'all') {
        query.propertyType = propertyType;
    }

    // Handle regionalState filter
    if (regionalState && regionalState.toLowerCase() !== 'all') {
        query['address.regionalState'] = regionalState;
    }

    // Handle priceRange filter
    if (priceRange && priceRange !== 'any') {
        if (priceRange.includes('-')) {
            const [min, max] = priceRange.split('-');
            query.price = {};
            if (min) query.price.$gte = parseInt(min, 10);
            if (max) query.price.$lte = parseInt(max, 10);
        } else if (priceRange.endsWith('+')) {
            const min = priceRange.slice(0, -1);
            query.price = { $gte: parseInt(min, 10) };
        }
    }

    // Handle bedrooms filter
    if (bedrooms && bedrooms !== 'any') {
        query.bedrooms = { $gte: parseInt(bedrooms, 10) };
    }

    // Handle bathrooms filter
    if (bathrooms && bathrooms !== 'any') {
        query.bathrooms = { $gte: parseInt(bathrooms, 10) };
    }

    console.log('Final property filter query:', JSON.stringify(query));

    // Finding resource
    let findQuery = Property.find(query)
        .populate({
            path: 'owner',
            select: 'firstName lastName email phone'
        })
        .populate({
            path: 'images',
            select: 'url'
        });

    // Select Fields
    if (select) {
        const fields = select.split(',').join(' ');
        findQuery = findQuery.select(fields);
    }

    // Sort
    if (sortBy) {
        const sortQuery = sortBy.split(',').join(' ');
        findQuery = findQuery.sort(sortQuery);
    } else {
        findQuery = findQuery.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(pageStr, 10);
    const limit = parseInt(limitStr, 10);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Property.countDocuments(query);

    findQuery = findQuery.skip(startIndex).limit(limit);

    // Executing query
    const properties = await findQuery;

    // Add logging after executing query
    console.log('Properties found:', properties.length);
    console.log('Property IDs:', properties.map(p => p._id));
    console.log('Offering types:', properties.map(p => p.offeringType));
    console.log('Property titles:', properties.map(p => p.title));
    console.log('=== END PROPERTY QUERY DEBUG ===');

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
      // Return a formatted error response instead of throwing an error
      return this.sendError(res, new ErrorResponse(`Invalid property ID format: ${req.params.id}`, 400));
    }
    
    try {
      const property = await Property.findById(propertyId).populate({
        path: 'owner',
        select: 'firstName lastName email phone'
      });

      if (!property) {
        console.log(`Property not found with id: ${propertyId}`);
        // Return a formatted error response instead of throwing an error
        return this.sendError(res, new ErrorResponse(`Property not found with id of ${propertyId}`, 404));
      }

      try {
        // Increment view count in a try-catch to ensure it doesn't break the response
        property.views += 1;
        await property.save();
      } catch (viewError) {
        // Log view count error but continue with the response
        console.error(`Error updating view count for property ${propertyId}:`, viewError);
      }

      console.log(`Successfully retrieved property: ${propertyId}`);
      this.sendResponse(res, property);
    } catch (error) {
      console.error(`Error finding property with ID ${propertyId}:`, error);
      // Return a formatted error response instead of throwing an error
      return this.sendError(res, new ErrorResponse(`Error retrieving property: ${error.message}`, 500));
    }
  });

  // @desc    Get single property by MongoDB ID
  // @route   GET /api/properties/mongo-id/:id
  // @access  Public
  getPropertyByMongoId = this.asyncHandler(async (req, res) => {
    // Get the MongoDB ID from the request parameters
    const mongoId = req.params.id;
    
    console.log(`getPropertyByMongoId called with ID: ${mongoId}`);
    
    // Validate MongoDB ID format
    const isValidMongoId = /^[0-9a-fA-F]{24}$/.test(mongoId);
    if (!isValidMongoId) {
      console.error(`Invalid MongoDB ID format: ${mongoId}`);
      return this.sendError(res, new ErrorResponse(`Invalid MongoDB ID format: ${mongoId}`, 400));
    }
    
    try {
      // Find the property by MongoDB ID
      const property = await Property.findById(mongoId).populate({
        path: 'owner',
        select: 'firstName lastName email phone'
      });
      
      if (!property) {
        console.log(`Property not found with MongoDB ID: ${mongoId}`);
        return this.sendError(res, new ErrorResponse(`Property not found with MongoDB ID: ${mongoId}`, 404));
      }
      
      try {
        // Increment view count
        property.views += 1;
        await property.save();
      } catch (viewError) {
        console.error(`Error updating view count for property ${mongoId}:`, viewError);
      }
      
      console.log(`Successfully retrieved property with MongoDB ID: ${mongoId}`);
      this.sendResponse(res, property);
    } catch (error) {
      console.error(`Error finding property with MongoDB ID ${mongoId}:`, error);
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
      // Add owner name to req.body
      req.body.ownerName = `${req.user.firstName} ${req.user.lastName}`;
      
      // Check promotionType for logic
      const promotionType = req.body.promotionType || 'Basic';
      if (promotionType === 'Basic' || promotionType === 'None') {
        req.body.status = 'active';
        req.body.promotionType = 'Basic';
        console.log('Setting property status to ACTIVE for basic package');
      } else if (promotionType === 'VIP' || promotionType === 'Diamond') {
        req.body.status = 'pending';
        req.body.promotionType = promotionType;
        console.log('Setting property status to PENDING for premium package');
      } else {
        req.body.status = 'active';
        req.body.promotionType = promotionType;
        console.log('Setting property status to ACTIVE for other package');
      }
      
      // Handle nested address structure
      if (req.body.address) {
        req.body.address.country = req.body.address.country || 'Ethiopia';
      } else if (req.body.regionalState) {
        // If address fields are provided at the top level, move them to the nested address object
        req.body.address = {
          regionalState: req.body.regionalState,
          subCity: req.body.subCity,
          country: req.body.country || 'Ethiopia'
        };
        // Remove the top-level fields
        delete req.body.subCity;
        delete req.body.regionalState;
        delete req.body.country;
      }
      
      console.log('Submitting property:', {
        propertyType: req.body.propertyType,
        price: req.body.price,
        title: req.body.title,
        ownerId: req.user.id,
        package: req.body.promotion_package || 'not specified',
        status: req.body.status,
        address: req.body.address
      });
      
      // Basic validation
      if (!req.body.propertyType || !req.body.price || !req.body.title || !req.body.offeringType) {
        return this.sendError(res, new ErrorResponse('Missing required fields (propertyType, price, title, or offeringType)', 400));
      }
      
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
      
      // Validate that media_paths exists and is an array if provided
      if (req.body.media_paths) {
        if (!Array.isArray(req.body.media_paths)) {
          req.body.media_paths = [req.body.media_paths]; // Convert to array if it's a single string
        }
        
        // Convert media_paths to images format if needed
        if (req.body.media_paths.length > 0 && !req.body.images) {
          req.body.images = req.body.media_paths.map(url => ({
            url,
            caption: ''
          }));
        }
      }
      
      // Remove promotionType from property data if present (keep it in propertyData)
      const propertyData = { ...req.body };
      
      // Create the property
      const property = await Property.create(propertyData);
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

          // Create proper image URL with fallback
          const baseUrl = process.env.FILE_UPLOAD_BASE_URL || 
                         (process.env.NODE_ENV === 'production' ? 
                          `https://${req.get('host')}/uploads` : 
                          `http://${req.get('host')}/uploads`);

          // Add to uploaded photos array
          uploadedPhotos.push({
            url: `${baseUrl}/${fileName}`,
            caption: ''
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
  searchProperties = this.asyncHandler(async (req, res) => {
    const { q, type, minPrice, maxPrice, beds, baths, status, offeringType } = req.query;
    
    // Build query
    const query = {};
    
    // Search term
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { 'address.subCity': { $regex: q, $options: 'i' } },
        { 'address.state': { $regex: q, $options: 'i' } }
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
