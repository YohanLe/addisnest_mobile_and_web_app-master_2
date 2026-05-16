const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  toggleFavorite,
  getFavorites,
  checkFavorite,
  getFavoriteCount
} = require('../controllers/favoritesController');

// Public route - get saved count for a property
router.get('/count/:propertyId', getFavoriteCount);

// Protected routes - require login
router.get('/', protect, getFavorites);
router.post('/toggle', protect, toggleFavorite);
router.get('/check/:propertyId', protect, checkFavorite);

module.exports = router;
