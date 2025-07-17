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

    // Find the user
    const user = await User.findOne({ email });
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
  // @route   PUT /api/users/profile
  // @access  Private
  updateProfile = this.asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);

    if (!user) {
      return this.sendError(res, new ErrorResponse('User not found', 404));
    }

    // Update user fields
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    
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

    const updatedUser = await user.save();

    this.sendResponse(res, {
      _id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      phone: updatedUser.phone,
      role: updatedUser.role,
      address: updatedUser.address
    });
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
    console.log('getAllAgents called with query:', req.query);
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

    console.log('Constructed query:', query);

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;

    const agents = await User.find(query)
      .select('-password -otp -otpExpire')
      .skip(skip)
      .limit(limitNumber);

    console.log('Found agents:', agents.length);

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
    try {
      console.log('requestOTP called with body:', req.body);
      const { email } = req.body;
      
      if (!email) {
        return this.sendError(res, new ErrorResponse('Email is required', 400));
      }
      
      const emailService = require('../utils/emailService');
      const { OtpVerification } = require('../models');
      
      console.log('Looking up user with email:', email);
      
      // Check if user exists to get their name for the email template
      const user = await User.findOne({ email });
      if (user) {
        console.log('User found:', user.email);
      } else {
        console.log('No existing user found with that email. Proceeding with OTP for registration.');
      }
      
      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Set OTP expiry (5 minutes)
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 5);
      
      try {
        console.log('Deleting existing OTP records for email:', email);
        // Delete any existing OTP records for this email
        await OtpVerification.deleteMany({ email });
        
        console.log('Creating new OTP verification record');
        // Create new OTP verification record
        await OtpVerification.create({
          email,
          otp,
          expiresAt
        });
        
        console.log(`OTP generated for ${email}: ${otp}`);
      } catch (dbError) {
        console.error('Database error during OTP creation:', dbError);
        return this.sendError(res, new ErrorResponse('Error creating OTP verification record', 500));
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
        
        // Always return the OTP in development mode, regardless of email sending success
        if (process.env.NODE_ENV === 'development') {
          console.log('==================================================');
          console.log(`DEVELOPMENT OTP CODE: ${otp}`);
          console.log('==================================================');
          
          // If email sending was successful
          if (emailResult && emailResult.success) {
            console.log(`✅ OTP email sent to ${email}`);
            this.sendResponse(res, {
              message: 'OTP sent successfully to your email (development mode)',
              otp: otp // Include OTP in development mode only
            });
          } 
          // If email sending failed or timed out
          else {
            console.warn('⚠️ Email sending failed or timed out. Using development fallback.');
            this.sendResponse(res, {
              message: 'OTP generated but email sending failed. Using development fallback.',
              otp: otp, // Include OTP in development mode
              emailError: emailResult ? emailResult.error : 'Unknown email error'
            });
          }
        } 
        // Production mode
        else {
          if (emailResult && emailResult.success) {
            console.log(`✅ OTP email sent to ${email}`);
            this.sendResponse(res, {
              message: 'OTP sent successfully to your email'
            });
          } else {
            console.error('❌ Failed to send OTP email in production mode');
            return this.sendError(res, new ErrorResponse('Failed to send OTP email. Please try again later.', 500));
          }
        }
      } catch (emailError) {
        console.error('❌ Unexpected error in email sending:', emailError.message || emailError);
        
        // In development mode, still return the OTP even if email sending fails
        if (process.env.NODE_ENV === 'development') {
          console.warn('⚠️ Using development fallback due to email error');
          this.sendResponse(res, {
            message: 'OTP generated but email sending failed. Using development fallback.',
            otp: otp, // Include OTP in development mode
            emailError: emailError.message || 'Unknown email error'
          });
        } else {
          return this.sendError(res, new ErrorResponse('Failed to send OTP email. Please try again later.', 500));
        }
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

      // If this is a registration request
      if (isRegistration) {
        console.log('Processing registration with OTP verification');
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
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
        
        console.log('Creating new user with data:', userData);
        
        // Create the user
        const user = await User.create(userData);
        
        // Generate token
        const token = this.generateToken(user._id);
        
        // Delete the OTP verification record
        await OtpVerification.deleteOne({ _id: otpVerificationRecord._id });
        
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
      } else {
        // For login, find the user
        const user = await User.findOne({ email });
        
        if (!user) {
          return this.sendError(res, new ErrorResponse('User not found', 404));
        }
        
        // Mark user as verified if not already
        if (!user.isVerified) {
          user.isVerified = true;
          await user.save();
        }
        
        // Delete the OTP verification record
        await OtpVerification.deleteOne({ _id: otpVerificationRecord._id });
        
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

  // Generate JWT
  generateToken(userId, expiresIn = '30d') {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: expiresIn
    });
  }
}

module.exports = new UserController();
