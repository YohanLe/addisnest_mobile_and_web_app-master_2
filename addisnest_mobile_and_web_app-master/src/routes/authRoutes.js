const express = require('express');
const { userController } = require('../controllers');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/register', userController.register);
router.post('/register-agent', userController.registerAgent);
router.post('/login', userController.login);
router.post('/admin-login', userController.adminLogin);
router.post('/request-otp', userController.requestOTP);
router.post('/resend-otp', userController.requestOTP); // Use the same controller method for resend-otp
router.post('/verify-otp', userController.verifyOTP);
router.post('/verify-social-login', userController.verifySocialLogin); // Add endpoint for social login OTP verification
router.get('/check-user', userController.checkUserExists); // Add endpoint to check if user exists

// Protected routes
router.get('/profile', protect, userController.getProfile);

module.exports = router;
