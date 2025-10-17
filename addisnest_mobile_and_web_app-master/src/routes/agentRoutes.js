const express = require('express');
const { userController } = require('../controllers');

const router = express.Router();

// Public routes
console.log('Registering agent routes...');
router.get('/list', userController.getAllAgents);
console.log('Agent routes registered.');

module.exports = router;
