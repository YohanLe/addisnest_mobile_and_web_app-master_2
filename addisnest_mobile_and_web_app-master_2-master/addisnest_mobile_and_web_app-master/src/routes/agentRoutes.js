const express = require('express');
const { userController } = require('../controllers');

const router = express.Router();

// Public routes
router.get('/list', userController.getAllAgents);

module.exports = router;
