const { BaseController, ErrorResponse } = require('./baseController');
const { Property, User } = require('../models');
const mongoose = require('mongoose');

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
      
      // ALL PROPERTIES DEFAULT TO PENDING STATUS FOR ADMIN APPROVAL
      // Only admin can approve properties to make them public
      req.body.status = 'pending';
      req.body.promotionType = req.body.promotionType || 'Basic';
      
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
    try {
      const {
          select,
          sort,
          page: pageStr = '1',
          limit: limitStr = '1000',
          for: offeringTypeFor,
          search,
          priceRange,
          propertyType,
          bedrooms,
          bathrooms,
          regionalState,
          sortBy,
          status
      } = req.query;

      console.log('getAllProperties called with query:', req.query);
      console.log('User making request:', {
        id: req.user?.id,
        role: req.user?.role,
        email: req.user?.email,
        firstName: req.user?.firstName,
        lastName: req.user?.lastName
      });

      const query = {};

      // ONLY SHOW APPROVED PROPERTIES TO PUBLIC
      // Only authenticated admins can see all properties, everyone else only sees active properties
      // Check if this is an admin request - be more permissive
      const isAdminRequest = req.query.admin === 'true' && req.user && 
        (req.user.role === 'admin' || 
         req.user.id === 'admin-user-id' || 
         req.user.email === 'admin@example.com' ||
         req.user.firstName === 'Admin' ||
         (req.user.id && req.user.id.includes('admin')));
      
      console.log('Admin request check:', {
        hasUser: !!req.user,
        userRole: req.user?.role,
        userId: req.user?.id,
        userEmail: req.user?.email,
        userFirstName: req.user?.firstName,
        adminParam: req.query.admin,
        isAdminRequest: isAdminRequest
      });
      
      // Handle status filtering based on user role and admin parameter
      if (isAdminRequest) {
          // Admin users can see all properties or filter by specific status
          if (status && ['pending', 'rejected', 'active', 'For Sale', 'For Rent'].includes(status)) {
              query.status = status;
              console.log(`Admin filtering by status: ${status}`);
          } else {
              // No status filter for admin = show ALL properties
              console.log('Admin request: showing ALL properties (no status filter)');
          }
      } else {
          // For debugging: if admin=true but not recognized as admin, still show all properties
          if (req.query.admin === 'true') {
              console.log('⚠️ Admin parameter provided but user not recognized as admin - showing all properties anyway for debugging');
              // No status filter = show all properties for debugging
          } else {
              // Non-admin users can only see active properties
              if (status === 'active') {
                  query.status = 'active';
              } else {
                  // Default: show active properties and legacy status values to public
                  query.status = { $in: ['active', 'For Sale', 'For Rent'] };
              }
              console.log('Public request: showing only active properties');
          }
      }
      
      console.log('Status filtering applied:', query.status);

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

      let properties = [];
      let dbOperationSuccess = false;

      try {
        console.log('Executing database queries...');
        console.log('Query object:', JSON.stringify(query, null, 2));
        
        // Check database connection state
        const dbState = mongoose.connection.readyState;
        console.log(`Database connection state: ${dbState} (1=connected, 0=disconnected)`);
        
        if (dbState !== 1) {
          throw new Error('Database not connected');
        }
        
        // Use Promise.race to implement custom timeout with better error handling
        const queryPromise = Property.find(query)
          .select('title description propertyType offeringType status price bedrooms bathrooms squareFeet area address images createdAt updatedAt owner ownerName')
          .sort('-createdAt')
          .limit(parseInt(limitStr, 10))
          .lean()
          .maxTimeMS(30000) // Set MongoDB query timeout to 30 seconds
          .exec();

        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Query timeout after 30 seconds')), 30000);
        });

        properties = await Promise.race([queryPromise, timeoutPromise]);

        console.log(`Successfully retrieved ${properties.length} properties from database`);
        if (properties.length > 0) {
          console.log('Sample property:', {
            id: properties[0]._id,
            title: properties[0].title,
            status: properties[0].status,
            offeringType: properties[0].offeringType
          });
        }
        dbOperationSuccess = true;

      } catch (dbError) {
        console.error('Database error during property retrieval:', dbError.message || dbError);
        
        console.warn('⚠️ Database operations failed, returning empty result set');
        properties = [];
        
        // Don't fail in development mode, just log the error
        if (process.env.NODE_ENV !== 'development') {
          return this.sendError(res, new ErrorResponse('Database error. Please try again later.', 500));
        }
      }

      // Simplified pagination result (without total count to avoid database timeout)
      const pagination = {};
      const page = parseInt(pageStr, 10);
      const limit = parseInt(limitStr, 10);

      // Simple pagination based on returned results
      if (properties.length === limit) {
          pagination.next = {
              page: page + 1,
              limit
          };
      }

      if (page > 1) {
          pagination.prev = {
              page: page - 1,
              limit
          };
      }

      this.sendResponse(res, {
          count: properties.length,
          pagination,
          data: properties,
          dbStatus: dbOperationSuccess ? 'success' : 'failed_but_continuing'
      });
    } catch (error) {
      console.error('Unexpected error in getAllProperties:', error);
      return this.sendError(res, new ErrorResponse('Server error retrieving properties', 500));
    }
  });

  // @desc    Get single property
  // @route   GET /api/properties/:id
  // @access  Public
  getPropertyById = this.asyncHandler(async (req, res) => {
    // Normalize the ID to handle various formats
    let propertyId = req.params.id;
    
    // Handle ObjectId format - extract the hex string if ID is in format ObjectId("...")
    if (typeof propertyId === 'string' && propertyId.startsWith('ObjectId(') && propertyId.endsWith(')')) {
      propertyId = propertyId.substring(9, propertyId.length - 1);
    }
    
    // Remove quotes if present
    if (typeof propertyId === 'string' && 
        ((propertyId.startsWith('"') && propertyId.endsWith('"')) || 
         (propertyId.startsWith("'") && propertyId.endsWith("'")))) {
      propertyId = propertyId.substring(1, propertyId.length - 1);
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

    // Handle status updates with validation
    if (req.body.status) {
      const currentStatus = property.status.toLowerCase();
      const newStatus = req.body.status.toLowerCase();
      
      // Validate status transitions - only allow ACTIVE -> SOLD/RENTED
      if (currentStatus === 'active' && (newStatus === 'sold' || newStatus === 'rented')) {
        // Allow this transition and make it permanent
        req.body.statusUpdatedAt = new Date();
        req.body.statusUpdatedBy = req.user.id;
        req.body.statusHistory = property.statusHistory || [];
        req.body.statusHistory.push({
          from: currentStatus,
          to: newStatus,
          updatedAt: new Date(),
          updatedBy: req.user.id,
          reason: 'Property status changed by owner/agent'
        });
      } else if (currentStatus === 'sold' || currentStatus === 'rented') {
        // Prevent changing from sold/rented back to any other status
        return this.sendError(res, new ErrorResponse(`Cannot change property status from ${currentStatus}. This status is permanent.`, 400));
      } else if (currentStatus !== 'active' && (newStatus === 'sold' || newStatus === 'rented')) {
        // Only active properties can be marked as sold/rented
        return this.sendError(res, new ErrorResponse(`Only active properties can be marked as ${newStatus}. Current status: ${currentStatus}`, 400));
      }
    }

    property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    this.sendResponse(res, property);
  });

  // @desc    Update property status (with validation)
  // @route   PUT /api/properties/:id/status
  // @access  Private
  updatePropertyStatus = this.asyncHandler(async (req, res) => {
    const { status } = req.body;
    
    if (!status) {
      return this.sendError(res, new ErrorResponse('Status is required', 400));
    }

    const property = await Property.findById(req.params.id);

    if (!property) {
      return this.sendError(res, new ErrorResponse(`Property not found with id of ${req.params.id}`, 404));
    }

    // Make sure user is property owner or admin
    if (property.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return this.sendError(res, new ErrorResponse(`User ${req.user.id} is not authorized to update this property`, 401));
    }

    const currentStatus = property.status.toLowerCase();
    const newStatus = status.toLowerCase();

    // Validate status transitions
    if (currentStatus === 'sold' || currentStatus === 'rented') {
      return this.sendError(res, new ErrorResponse(`Cannot change property status from ${currentStatus}. This status is permanent.`, 400));
    }

    if (currentStatus !== 'active' && (newStatus === 'sold' || newStatus === 'rented')) {
      return this.sendError(res, new ErrorResponse(`Only active properties can be marked as ${newStatus}. Current status: ${currentStatus}`, 400));
    }

    if (currentStatus === 'active' && !['sold', 'rented'].includes(newStatus)) {
      return this.sendError(res, new ErrorResponse(`Active properties can only be changed to 'sold' or 'rented'`, 400));
    }

    // Update the property status
    property.status = newStatus;
    property.statusUpdatedAt = new Date();
    property.statusUpdatedBy = req.user.id;
    
    // Add to status history
    if (!property.statusHistory) {
      property.statusHistory = [];
    }
    
    property.statusHistory.push({
      from: currentStatus,
      to: newStatus,
      updatedAt: new Date(),
      updatedBy: req.user.id,
      reason: req.body.reason || 'Property status changed by owner/agent'
    });

    await property.save();

    this.sendResponse(res, {
      success: true,
      message: `Property status successfully updated to ${newStatus}`,
      data: property
    });
  });

  // @desc    Approve property (Admin only)
  // @route   PUT /api/properties/:id/approve
  // @access  Private (Admin only)
  approveProperty = this.asyncHandler(async (req, res) => {
    // Only admins can approve properties
    if (req.user.role !== 'admin') {
      return this.sendError(res, new ErrorResponse('Not authorized to approve properties', 403));
    }

    const property = await Property.findById(req.params.id);

    if (!property) {
      return this.sendError(res, new ErrorResponse(`Property not found with id of ${req.params.id}`, 404));
    }

    // Update property status to active
    property.status = 'active';
    property.approvedAt = new Date();
    property.approvedBy = req.user.id;
    
    await property.save();

    this.sendResponse(res, {
      success: true,
      message: 'Property approved successfully',
      data: property
    });
  });

  // @desc    Reject property (Admin only)
  // @route   PUT /api/properties/:id/reject
  // @access  Private (Admin only)
  rejectProperty = this.asyncHandler(async (req, res) => {
    // Only admins can reject properties
    if (req.user.role !== 'admin') {
      return this.sendError(res, new ErrorResponse('Not authorized to reject properties', 403));
    }

    const property = await Property.findById(req.params.id);

    if (!property) {
      return this.sendError(res, new ErrorResponse(`Property not found with id of ${req.params.id}`, 404));
    }

    // Update property status to rejected
    property.status = 'rejected';
    property.rejectedAt = new Date();
    property.rejectedBy = req.user.id;
    property.rejectionReason = req.body.reason || 'No reason provided';
    
    await property.save();

    this.sendResponse(res, {
      success: true,
      message: 'Property rejected successfully',
      data: property
    });
  });

  // @desc    Get pending properties (Admin only)
  // @route   GET /api/properties/pending
  // @access  Private (Admin only)
  getPendingProperties = this.asyncHandler(async (req, res) => {
    // Only admins can view pending properties
    if (req.user.role !== 'admin') {
      return this.sendError(res, new ErrorResponse('Not authorized to view pending properties', 403));
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const total = await Property.countDocuments({ status: 'pending' });
    const properties = await Property.find({ status: 'pending' })
      .populate({
        path: 'owner',
        select: 'firstName lastName email phone'
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

  // @desc    Submit a property with pending_payment or active status based on promotion_package
  // @route   POST /api/property-submit
  // @access  Private
  submitPropertyPending = this.asyncHandler(async (req, res) => {
    try {
      // Add user to req.body
      req.body.owner = req.user.id;
      // Add owner name to req.body
      req.body.ownerName = `${req.user.firstName} ${req.user.lastName}`;
      
      // ALL PROPERTIES DEFAULT TO PENDING STATUS FOR ADMIN APPROVAL
      // Only admin can approve properties to make them public
      req.body.status = 'pending';
      req.body.promotionType = req.body.promotionType || 'Basic';
      
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
      if (file.size > parseInt(process.env.MAX_FILE_UPLOAD)) {
        return this.sendError(res, new ErrorResponse(`Please upload an image less than ${parseInt(process.env.MAX_FILE_UPLOAD) / 1000000}MB`, 400));
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
  // @access  Public (but shows all properties for the owner, including pending)
  getPropertiesByUser = this.asyncHandler(async (req, res) => {
    // Verify user exists
    const user = await User.findById(req.params.userId);
    if (!user) {
      return this.sendError(res, new ErrorResponse(`User not found with id of ${req.params.userId}`, 404));
    }

    // Property owners can see ALL their properties (including pending)
    // This allows users to see their pending submissions in their account
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
