const express = require('express');
const { userController } = require('../controllers');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/register', userController.register);
router.post('/register-agent', userController.registerAgent);
router.post('/login', userController.login);

// Protected routes (require authentication)
router.use(protect);
router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);

// Admin only routes
router.use(authorize('admin'));
router.route('/')
  .get(userController.getAllUsers)
  .post(userController.register); // Admin can create users

router.route('/:id')
  .get(userController.getUserById)
  .put(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
