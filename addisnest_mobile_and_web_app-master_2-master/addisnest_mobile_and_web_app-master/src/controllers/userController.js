const { BaseController, ErrorResponse } = require('./baseController');
const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class UserController extends BaseController {
  constructor() {
    super();
  }

  // @desc    Register a new user
  // @route   POST /api/users/register
  // @access  Public
  register = this.asyncHandler(async (req, res) => {
    try {
      const { 
        firstName, 
        lastName, 
        email, 
        password, 
        phone, 
        role,
        regionalState,
        licenseNumber,
        agency,
        experience,
        specialization
      } = req.body;

      console.log('Registration attempt:', req.body);

      // Check if user already exists
      const userExists = await User.findOne({ email });
      if (userExists) {
        return this.sendError(res, new ErrorResponse('User already exists', 400));
      }

      // Prepare user data
      const userData = {
        firstName,
        lastName,
        email,
        password,
        phone,
        address: {
          state: regionalState
        }
      };
      
      // Normalize role (handle case sensitivity)
      if (role) {
        const normalizedRole = role.toLowerCase();
        if (normalizedRole === 'agent' || normalizedRole === 'admin') {
          userData.role = normalizedRole;
        } else {
          // Default to 'customer' for any other role value
          userData.role = 'customer';
        }
      } else {
        userData.role = 'customer'; // Changed default from 'user' to 'customer' for consistency
      }
      
      // Add agent-specific fields if role is agent
      if (userData.role === 'agent') {
        userData.experience = experience ? parseInt(experience) : 0;
        
        // Add licenseNumber and agency if provided
        if (licenseNumber) userData.licenseNumber = licenseNumber;
        if (agency) userData.agency = agency;
        
        // Add specialization if provided
        if (specialization && Array.isArray(specialization)) {
          userData.specialization = specialization;
        }
      }

      // Create the user
      const user = await User.create(userData);

      // Generate token
      const token = this.generateToken(user._id);

      console.log(`User registered successfully: ${email}`);

      this.sendResponse(res, {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        token
      }, 201);
    } catch (error) {
      console.error('Registration error:', error);
      
      // Handle mongoose validation errors
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return this.sendError(res, new ErrorResponse(messages.join(', '), 400));
      }
      
      // Handle duplicate key error
      if (error.code === 11000) {
        return this.sendError(res, new ErrorResponse('Email is already in use', 400));
      }
      
      // Send the error to the error handling middleware
      return this.sendError(res, new ErrorResponse('Error registering user', 500));
    }
  });

  // @desc    Register a new agent
  // @route   POST /api/users/register-agent
  // @access  Public
  registerAgent = this.asyncHandler(async (req, res) => {
    try {
      const { 
        fullName, 
        email, 
        phone, 
        password, 
        confirmPassword,
        experience,
        state
      } = req.body;

      console.log('Agent registration attempt:', req.body);

      // Basic validation
      if (password !== confirmPassword) {
        return this.sendError(res, new ErrorResponse('Passwords do not match', 400));
      }

      // Split fullName into firstName and lastName
      let firstName = fullName, lastName = '';
      if (fullName && fullName.includes(' ')) {
        const nameParts = fullName.split(' ');
        firstName = nameParts[0];
        lastName = nameParts.slice(1).join(' ');
      }

      // Check if user already exists
      const userExists = await User.findOne({ email });
      if (userExists) {
        return this.sendError(res, new ErrorResponse('Email already registered', 400));
      }

      // Create the agent
      const agent = await User.create({
        firstName,
        lastName,
        email,
        password,
        phone,
        role: 'agent',
        experience: experience ? parseInt(experience) : 0,
        address: {
          state: state
        }
      });

      // Generate token
      const token = this.generateToken(agent._id);

      console.log(`Agent registered successfully: ${email}`);

      this.sendResponse(res, {
        _id: agent._id,
        firstName: agent.firstName,
        lastName: agent.lastName,
        email: agent.email,
        role: agent.role,
        token
      }, 201);
    } catch (error) {
      console.error('Agent registration error:', error);
      
      // Handle mongoose validation errors
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return this.sendError(res, new ErrorResponse(messages.join(', '), 400));
      }
      
      // Handle duplicate key error
      if (error.code === 11000) {
        return this.sendError(res, new ErrorResponse('Email is already in use', 400));
      }
      
      // Send the error to the error handling middleware
      return this.sendError(res, new ErrorResponse('Error registering agent', 500));
    }
  });

  // @desc    Login user
  // @route   POST /api/users/login
  // @access  Public
  login = this.asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    console.log('Login attempt for email:', email);


    try {
      // Set a timeout for database operations (5 seconds)
      const dbTimeout = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Database operation timed out')), 5000);
      });

      // Find the user with timeout protection
      const user = await Promise.race([
        User.findOne({ email }).maxTimeMS(5000),
        dbTimeout
      ]);

      if (!user) {
        return this.sendError(res, new ErrorResponse('Email not registered. Please check your email or sign up.', 401));
      }

      // Check password
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return this.sendError(res, new ErrorResponse('The password you entered is incorrect. Please try again.', 401));
      }

      // Generate token
      const token = this.generateToken(user._id);

      console.log(`Successful login for: ${email}`);

      this.sendResponse(res, {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        token
      });
    } catch (error) {
      console.error('Database error during login:', error.message);
      
      // If it's a database timeout, provide a helpful error message
      if (error.message.includes('timed out') || error.message.includes('buffering timed out')) {
        return this.sendError(res, new ErrorResponse('We are experiencing temporary database connectivity issues. Please try again in a moment or use the OTP login option.', 503));
      }
      
      // For other database errors
      return this.sendError(res, new ErrorResponse('Login service temporarily unavailable. Please try again later.', 503));
    }
  });
  
  // @desc    Admin Login
  // @route   POST /api/auth/admin-login
  // @access  Public
  adminLogin = this.asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    console.log('Admin login attempt for email:', email);

    // Hardcoded admin check for development/testing
    // This allows login with the documented credentials even if the database seed hasn't run
    if (email === 'admin@addisnest.com' && password === 'Admin@123') {
      console.log('Using hardcoded admin credentials for development');
      
      // Create a temporary admin user object
      const adminUser = {
        _id: 'admin-user-id',
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@addisnest.com',
        role: 'admin'
      };
      
      // Generate token with extended expiry for admin (30 days)
      const token = this.generateToken(adminUser._id, '30d');
      
      console.log(`Successful admin login for: ${email} (hardcoded)`);
      
      return this.sendResponse(res, {
        ...adminUser,
        token
      });
    }

    // Regular database check for admin users
    // Find the user
    const user = await User.findOne({ email });
    if (!user) {
      return this.sendError(res, new ErrorResponse('Email not registered. Please check your email.', 401));
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return this.sendError(res, new ErrorResponse('The password you entered is incorrect. Please try again.', 401));
    }

    // Check if user is an admin
    if (user.role !== 'admin') {
      return this.sendError(res, new ErrorResponse('Access denied. This account does not have administrator privileges.', 403));
    }

    // Generate token with extended expiry for admin (30 days)
    const token = this.generateToken(user._id, '30d');

    console.log(`Successful admin login for: ${email}`);

    this.sendResponse(res, {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      token
    });
  });

  // @desc    Get user profile
  // @route   GET /api/auth/profile
  // @access  Private
  getProfile = this.asyncHandler(async (req, res) => {
    try {
      // The user's information is attached to the request object by the 'protect' middleware.
      console.log('User from token:', req.user);

      // Check if the user object exists on the request
      if (!req.user) {
        console.error('Authentication error: req.user is not defined.');
        return this.sendError(res, new ErrorResponse('Not authorized', 401));
      }

      // Retrieve the full user profile from the database
      const user = await User.findById(req.user.id).select('-password');

      // Check if the user exists in the database
      if (!user) {
        console.error(`User with ID ${req.user.id} not found in the database.`);
        return this.sendError(res, new ErrorResponse('User not found', 404));
      }

      console.log('User profile retrieved successfully:', user);

      // Send the user's profile as a response with the expected format
      // The frontend expects the user data to be in the 'result' property
      return res.status(200).json({
        success: true,
        result: user
      });
    } catch (error) {
      console.error('Error in getProfile:', error);
      return this.sendError(res, new ErrorResponse('Error retrieving user profile', 500));
    }
  });

  // @desc    Update user profile
  // @route   POST /api/auth/updateProfile
  // @access  Private
  updateProfile = this.asyncHandler(async (req, res) => {
    try {
      console.log('updateProfile called with data:', req.body);
      console.log('User from token:', req.user);

      const user = await User.findById(req.user.id);

      if (!user) {
        return this.sendError(res, new ErrorResponse('User not found', 404));
      }

      // Update user fields
      if (req.body.firstName) user.firstName = req.body.firstName;
      if (req.body.lastName) user.lastName = req.body.lastName;
      if (req.body.email) user.email = req.body.email;
      if (req.body.phone) user.phone = req.body.phone;
      if (req.body.name) user.name = req.body.name;
      if (req.body.about) user.about = req.body.about;
      
      // Update profile image
      if (req.body.profile_img) user.profile_img = req.body.profile_img;
      if (req.body.profileImage) user.profileImage = req.body.profileImage;
      
      // Update password if provided
      if (req.body.password) {
        user.password = req.body.password;
      }

      // Update address if provided
      if (req.body.address) {
        user.address = {
          ...user.address,
          ...req.body.address
        };
      }

      // Update agent-specific fields if user is an agent
      if (user.role === 'agent') {
        if (req.body.experience !== undefined) user.experience = parseInt(req.body.experience) || 0;
        if (req.body.licenseNumber) user.licenseNumber = req.body.licenseNumber;
        if (req.body.agency) user.agency = req.body.agency;
        if (req.body.specialties) user.specialties = req.body.specialties;
        if (req.body.languagesSpoken) user.languagesSpoken = req.body.languagesSpoken;
        if (req.body.averageRating) user.averageRating = parseFloat(req.body.averageRating);
      }

      const updatedUser = await user.save();
      console.log('User profile updated successfully:', updatedUser._id);

      this.sendResponse(res, {
        success: true,
        message: 'Profile updated successfully',
        data: {
          _id: updatedUser._id,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          email: updatedUser.email,
          phone: updatedUser.phone,
          role: updatedUser.role,
          address: updatedUser.address,
          about: updatedUser.about,
          profile_img: updatedUser.profile_img,
          profileImage: updatedUser.profileImage,
          experience: updatedUser.experience,
          licenseNumber: updatedUser.licenseNumber,
          agency: updatedUser.agency,
          specialties: updatedUser.specialties,
          languagesSpoken: updatedUser.languagesSpoken,
          averageRating: updatedUser.averageRating
        }
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
      return this.sendError(res, new ErrorResponse('Error updating profile', 500));
    }
  });

  // @desc    Get all users (admin only)
  // @route   GET /api/users
  // @access  Private/Admin
  getAllUsers = this.asyncHandler(async (req, res) => {
    const users = await User.find({}).select('-password');
    this.sendResponse(res, users);
  });

  // @desc    Get all agents with filtering
  // @route   GET /api/agents/list
  // @access  Public
  getAllAgents = this.asyncHandler(async (req, res) => {
    const {
      region,
      specialty,
      language,
      rating,
      verifiedOnly,
      page = 1,
      limit = 10,
    } = req.query;

    const query = { role: { $in: ['agent', 'AGENT'] } };

    if (region) {
      // Convert hyphenated region to regex pattern that can match spaces
      const regionPattern = region.replace(/-/g, '[ -]');
      
      // Support both new field structure and legacy field structure
      query.$or = [
        { 'address.state': { $regex: regionPattern, $options: 'i' } },
        { region: { $regex: regionPattern, $options: 'i' } }
      ];
    }
    if (specialty) {
      // Support both field names
      query.$or = query.$or || [];
      query.$or.push(
        { specialties: { $in: [specialty] } },
        { specialization: { $in: [specialty] } }
      );
    }
    if (language) {
      // Support both field names
      query.$or = query.$or || [];
      query.$or.push(
        { languagesSpoken: { $in: [language] } },
        { languages: { $in: [language] } }
      );
    }
    if (rating) {
      query.averageRating = { $gte: Number(rating) };
    }
    if (verifiedOnly === 'true') {
      query.isVerified = true;
    }

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;

    const agents = await User.find(query)
      .select('-password -otp -otpExpire')
      .skip(skip)
      .limit(limitNumber);

    const totalCount = await User.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limitNumber);

    this.sendResponse(res, {
      data: {
        agents,
        totalCount,
        currentPage: pageNumber,
        totalPages,
      },
    });
  });

  // @desc    Get user by ID (admin only)
  // @route   GET /api/users/:id
  // @access  Private/Admin
  getUserById = this.asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return this.sendError(res, new ErrorResponse('User not found', 404));
    }
    
    this.sendResponse(res, user);
  });

  // @desc    Update user (admin only)
  // @route   PUT /api/users/:id
  // @access  Private/Admin
  updateUser = this.asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return this.sendError(res, new ErrorResponse('User not found', 404));
    }
    
    // Update fields
    Object.keys(req.body).forEach(key => {
      if (key !== 'password') {
        user[key] = req.body[key];
      }
    });
    
    // Update password if provided
    if (req.body.password) {
      user.password = req.body.password;
    }
    
    const updatedUser = await user.save();
    
    this.sendResponse(res, {
      _id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      role: updatedUser.role
    });
  });

  // @desc    Delete user (admin only)
  // @route   DELETE /api/users/:id
  // @access  Private/Admin
  deleteUser = this.asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return this.sendError(res, new ErrorResponse('User not found', 404));
    }
    
    await user.remove();
    
    this.sendResponse(res, { message: 'User removed' });
  });

  // @desc    Request OTP for login
  // @route   POST /api/auth/request-otp
  // @access  Public
  requestOTP = this.asyncHandler(async (req, res) => {
    console.log('=== requestOTP method called ===');
    console.log('Request body:', req.body);
    console.log('Request headers:', req.headers);
    
    try {
      if (!req.body) {
        console.error('Request body is undefined. This indicates a middleware issue.');
        return this.sendError(res, new ErrorResponse('Request body is missing. Please ensure you are sending a valid JSON request with Content-Type: application/json header.', 400));
      }

      const { email } = req.body;
      console.log('Extracted email:', email);
      
      if (!email) {
        console.error('Email is missing from request body');
        return this.sendError(res, new ErrorResponse('Email is required', 400));
      }
      
      console.log('About to import required modules...');
      // Import required modules at the top level to avoid issues
      const emailService = require('../utils/emailService');
      const { OtpVerification } = require('../models');
      console.log('Modules imported successfully');
      
      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Set OTP expiry (5 minutes)
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 5);
      
      let user = null;
      let dbOperationSuccess = false;
      
      // In-memory storage for development fallback
      const otpStorage = global.otpStorage || (global.otpStorage = new Map());
      
      try {
        console.log('Looking up user with email:', email);
        
        // Set a shorter timeout for database operations (5 seconds)
        const dbTimeout = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Database operation timed out')), 5000);
        });
        
        // Check if user exists to get their name for the email template
        user = await Promise.race([
          User.findOne({ email }).maxTimeMS(5000),
          dbTimeout
        ]);
        
        if (user) {
          console.log('User found:', user.email);
        } else {
          console.log('No existing user found with that email. Proceeding with OTP for registration.');
        }
        
        console.log('Deleting existing OTP records for email:', email);
        // Delete any existing OTP records for this email
        await Promise.race([
          OtpVerification.deleteMany({ email }).maxTimeMS(5000),
          dbTimeout
        ]);
        
        console.log('Creating new OTP verification record');
        // Create new OTP verification record
        await Promise.race([
          OtpVerification.create({
            email,
            otp,
            expiresAt
          }),
          dbTimeout
        ]);
        
        console.log(`OTP generated and stored for ${email}: ${otp}`);
        dbOperationSuccess = true;
      } catch (dbError) {
        console.error('Database error during OTP operations:', dbError.message || dbError);
        console.warn('⚠️ Database operations failed, using in-memory storage for development');
        
        // Store OTP in memory as fallback
        otpStorage.set(email, {
          otp,
          expiresAt,
          createdAt: new Date()
        });
        
        // Clean up expired OTPs from memory
        for (const [key, value] of otpStorage.entries()) {
          if (value.expiresAt < new Date()) {
            otpStorage.delete(key);
          }
        }
        
        console.log(`OTP stored in memory for ${email}: ${otp}`);
        dbOperationSuccess = false; // Mark as failed but continue
      }
      
      try {
        console.log(`Attempting to send OTP email to ${email}`);
        const startTime = Date.now();
        
        // Set a timeout for the email sending operation
        const emailPromise = emailService.sendOTPEmail(email, otp, user ? user.firstName : '');
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Email sending timed out after 10 seconds')), 10000);
        });
        
        // Race the email sending against the timeout
        const emailResult = await Promise.race([emailPromise, timeoutPromise])
          .catch(error => {
            console.error(`Email sending error or timeout: ${error.message}`);
            return { 
              success: false, 
              error: error.message,
              timedOut: error.message.includes('timed out')
            };
          });
        
        const endTime = Date.now();
        console.log(`Email sending operation took ${endTime - startTime}ms to complete`);
        
        // Always return success in development mode
        console.log('==================================================');
        console.log(`DEVELOPMENT OTP CODE: ${otp}`);
        console.log('==================================================');
        
        // Return success response immediately
        return this.sendResponse(res, {
          success: true,
          message: 'OTP sent successfully',
          otp: process.env.NODE_ENV === 'development' ? otp : undefined, // Include OTP in development mode only
          dbStatus: dbOperationSuccess ? 'database' : 'memory',
          emailStatus: emailResult && emailResult.success ? 'sent' : 'simulated'
        });
        
      } catch (emailError) {
        console.error('❌ Unexpected error in email sending:', emailError.message || emailError);
        
        // Still return success with OTP in development mode
        console.log('==================================================');
        console.log(`DEVELOPMENT OTP CODE: ${otp}`);
        console.log('==================================================');
        
        return this.sendResponse(res, {
          success: true,
          message: 'OTP generated successfully',
          otp: process.env.NODE_ENV === 'development' ? otp : undefined,
          dbStatus: dbOperationSuccess ? 'database' : 'memory',
          emailStatus: 'failed_but_continuing'
        });
      }
    } catch (error) {
      console.error('Unexpected error in requestOTP:', error);
      return this.sendError(res, new ErrorResponse('Server error processing OTP request', 500));
    }
  });

  // @desc    Verify OTP and login or register
  // @route   POST /api/auth/verify-otp
  // @access  Public
  verifyOTP = this.asyncHandler(async (req, res) => {
    try {
      const { 
        email, 
        otp, 
        firstName, 
        lastName, 
        password, 
        role, 
        regionalState,
        experience,
        specialization 
      } = req.body;
      const { OtpVerification } = require('../models');

      console.log('verifyOTP called with data:', JSON.stringify(req.body, null, 2));

      // Validate required fields
      if (!email || !otp) {
        return this.sendError(res, new ErrorResponse('Email and OTP are required', 400));
      }

      // Check if this is a registration request
      const isRegistration = firstName && lastName && password;

      // In-memory storage for development fallback
      const otpStorage = global.otpStorage || (global.otpStorage = new Map());
      
      let otpVerificationRecord = null;
      let usingMemoryStorage = false;

      try {
        // Try to find the OTP verification record in database first
        otpVerificationRecord = await OtpVerification.findOne({
          email,
          otp
        }).maxTimeMS(5000);
      } catch (dbError) {
        console.warn('Database lookup failed, checking memory storage:', dbError.message);
        usingMemoryStorage = true;
      }

      // If database lookup failed or no record found, check memory storage
      if (!otpVerificationRecord && otpStorage.has(email)) {
        const memoryOtp = otpStorage.get(email);
        if (memoryOtp.otp === otp) {
          otpVerificationRecord = {
            email,
            otp: memoryOtp.otp,
            expiresAt: memoryOtp.expiresAt,
            _id: 'memory-record'
          };
          usingMemoryStorage = true;
          console.log('Found OTP in memory storage');
        }
      }

      // If no OTP record found in either database or memory
      if (!otpVerificationRecord) {
        return this.sendError(res, new ErrorResponse('The OTP code you entered is incorrect. Please double-check the code from your email and try again.', 401));
      }

      // Check if OTP is expired
      if (otpVerificationRecord.expiresAt < new Date()) {
        // Clean up expired OTP
        if (usingMemoryStorage) {
          otpStorage.delete(email);
        }
        return this.sendError(res, new ErrorResponse('Your OTP code has expired or is no longer valid. Please click "Resend OTP" to get a new verification code.', 401));
      }

      // If this is a registration request
      if (isRegistration) {
        console.log('Processing registration with OTP verification');
        
        // Check if user already exists
        let existingUser = null;
        try {
          existingUser = await User.findOne({ email }).maxTimeMS(5000);
        } catch (dbError) {
          console.warn('Database check for existing user failed:', dbError.message);
          // Continue with registration attempt
        }
        
        if (existingUser) {
          return this.sendError(res, new ErrorResponse('User already exists', 400));
        }
        
        // Prepare user data
        const userData = {
          firstName,
          lastName,
          email,
          password,
          isVerified: true,
          address: {
            state: regionalState
          }
        };
        
        // Normalize role (handle case sensitivity)
        if (role) {
          const normalizedRole = role.toLowerCase();
          if (normalizedRole === 'agent' || normalizedRole === 'admin') {
            userData.role = normalizedRole;
          } else {
            // Default to 'customer' for any other role value
            userData.role = 'customer';
          }
        } else {
          userData.role = 'customer';
        }
        
        // Add agent-specific fields if role is agent
        if (userData.role === 'agent') {
          userData.experience = experience ? parseInt(experience) : 0;
          userData.region = regionalState; // Set region field to match the model
          
          // Add specialties if provided (using the correct field name from the model)
          if (specialization && Array.isArray(specialization)) {
            userData.specialties = specialization;
          }
        }
        
        // Log the user data being created
        console.log('Creating user with data:', JSON.stringify(userData, null, 2));
        
        try {
          // Create the user
          const user = await User.create(userData);
          
          // Generate token
          const token = this.generateToken(user._id);
          
          // Clean up OTP record
          if (usingMemoryStorage) {
            otpStorage.delete(email);
          } else {
            try {
              await OtpVerification.deleteOne({ _id: otpVerificationRecord._id });
            } catch (cleanupError) {
              console.warn('Failed to cleanup OTP record:', cleanupError.message);
            }
          }
          
          console.log(`User registered successfully: ${email}`);
          
          return this.sendResponse(res, {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            token,
            user: user
          }, 201);
        } catch (userCreationError) {
          console.error('Failed to create user:', userCreationError);
          return this.sendError(res, new ErrorResponse('Failed to create user account. Please try again.', 500));
        }
      } else {
        // For login, find the user
        let user = null;
        try {
          user = await User.findOne({ email }).maxTimeMS(5000);
        } catch (dbError) {
          console.error('Database lookup for user failed:', dbError.message);
          return this.sendError(res, new ErrorResponse('Database error. Please try again later.', 500));
        }
        
        if (!user) {
          return this.sendError(res, new ErrorResponse('User not found', 404));
        }
        
        try {
          // Mark user as verified if not already
          if (!user.isVerified) {
            user.isVerified = true;
            await user.save();
          }
          
          // Clean up OTP record
          if (usingMemoryStorage) {
            otpStorage.delete(email);
          } else {
            try {
              await OtpVerification.deleteOne({ _id: otpVerificationRecord._id });
            } catch (cleanupError) {
              console.warn('Failed to cleanup OTP record:', cleanupError.message);
            }
          }
          
          // Generate token
          const token = this.generateToken(user._id);
          
          console.log(`User logged in via OTP: ${email}`);
          
          this.sendResponse(res, {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            token,
            user: user
          });
        } catch (updateError) {
          console.error('Failed to update user:', updateError);
          // Still allow login even if update fails
          const token = this.generateToken(user._id);
          
          this.sendResponse(res, {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            token,
            user: user
          });
        }
      }
    } catch (error) {
      console.error('Error in verifyOTP:', error);
      return this.sendError(res, new ErrorResponse('Error verifying OTP', 500));
    }
  });

  // @desc    Check if a user exists by email
  // @route   GET /api/auth/check-user
  // @access  Public
  checkUserExists = this.asyncHandler(async (req, res) => {
    try {
      const { email } = req.query;
      
      if (!email) {
        return this.sendError(res, new ErrorResponse('Email is required', 400));
      }
      
      console.log('Checking if user exists with email:', email);
      
      // Check if user exists
      const user = await User.findOne({ email });
      
      // Return result without exposing sensitive user data
      return this.sendResponse(res, {
        exists: !!user,
        userId: user ? user._id : null
      });
    } catch (error) {
      console.error('Error checking user existence:', error);
      return this.sendError(res, new ErrorResponse('Error checking user existence', 500));
    }
  });

  // @desc    Verify OTP for social login
  // @route   POST /api/auth/verify-social-login
  // @access  Public
  verifySocialLogin = this.asyncHandler(async (req, res) => {
    try {
      const { email, otp, provider } = req.body;
      const { OtpVerification } = require('../models');

      console.log('verifySocialLogin called with data:', JSON.stringify(req.body, null, 2));

      // Validate required fields
      if (!email || !otp) {
        return this.sendError(res, new ErrorResponse('Email and OTP are required', 400));
      }

      // Find the OTP verification record
      const otpVerificationRecord = await OtpVerification.findOne({
        email,
        otp
      });

      // If no OTP record found
      if (!otpVerificationRecord) {
        return this.sendError(res, new ErrorResponse('The OTP code you entered is incorrect. Please double-check the code from your email and try again.', 401));
      }

      // Check if OTP is expired
      if (otpVerificationRecord.expiresAt < new Date()) {
        return this.sendError(res, new ErrorResponse('Your OTP code has expired or is no longer valid. Please click "Resend OTP" to get a new verification code.', 401));
      }

      // Find or create the user
      let user = await User.findOne({ email });
      
      if (!user) {
        // Create a new user with minimal information
        const userData = {
          email,
          firstName: email.split('@')[0], // Use part of email as name
          lastName: '',
          // Generate a random secure password since social login doesn't need it
          password: Math.random().toString(36).slice(-10) + Math.random().toString(36).toUpperCase().slice(-2) + '!1',
          isVerified: true,
          role: 'customer',
          socialProvider: provider || 'unknown'
        };
        
        console.log('Creating new user from social login:', userData);
        user = await User.create(userData);
      } else {
        // Update existing user if needed
        if (!user.isVerified) {
          user.isVerified = true;
          await user.save();
        }
        
        // Update social provider if not already set
        if (provider && !user.socialProvider) {
          user.socialProvider = provider;
          await user.save();
        }
      }
      
      // Delete the OTP verification record
      await OtpVerification.deleteOne({ _id: otpVerificationRecord._id });
      
      // Generate token
      const token = this.generateToken(user._id);
      
      console.log(`User authenticated via social login OTP: ${email}`);
      
      this.sendResponse(res, {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        token,
        user: user
      });
    } catch (error) {
      console.error('Error in verifySocialLogin:', error);
      return this.sendError(res, new ErrorResponse('Error verifying social login OTP', 500));
    }
  });

  // @desc    Change user password
  // @route   POST /api/auth/changePassword
  // @access  Private
  changePassword = this.asyncHandler(async (req, res) => {
    try {
      const { current_password, new_password, confirm_password } = req.body;

      console.log('changePassword called for user:', req.user.id);

      // Validate required fields
      if (!current_password || !new_password || !confirm_password) {
        return this.sendError(res, new ErrorResponse('All fields are required', 400));
      }

      // Check if new password and confirm password match
      if (new_password !== confirm_password) {
        return this.sendError(res, new ErrorResponse('New password and confirm password do not match', 400));
      }

      // Find the user
      const user = await User.findById(req.user.id);
      if (!user) {
        return this.sendError(res, new ErrorResponse('User not found', 404));
      }

      // Check if current password is correct
      const isCurrentPasswordValid = await user.matchPassword(current_password);
      if (!isCurrentPasswordValid) {
        return this.sendError(res, new ErrorResponse('Current password is incorrect', 400));
      }

      // Update the password
      user.password = new_password;
      await user.save();

      console.log(`Password changed successfully for user: ${user.email}`);

      this.sendResponse(res, {
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error) {
      console.error('Error changing password:', error);
      return this.sendError(res, new ErrorResponse('Error changing password', 500));
    }
  });

  // Generate JWT
  generateToken(userId, expiresIn = '30d') {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: expiresIn
    });
  }
}

module.exports = new UserController();
