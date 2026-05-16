const asyncHandler = require('express-async-handler');
const { User, Property } = require('../models');

// @desc    Toggle save/unsave a property
// @route   POST /api/favorites/toggle
// @access  Private
exports.toggleFavorite = asyncHandler(async (req, res) => {
  const { propertyId } = req.body;

  if (!propertyId) {
    return res.status(400).json({
      success: false,
      error: 'Property ID is required'
    });
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ success: false, error: 'User not found' });
  }

  const index = user.savedProperties.indexOf(propertyId);
  let isSaved;

  if (index > -1) {
    // Already saved → remove
    user.savedProperties.splice(index, 1);
    isSaved = false;
    // Decrement likes count on the property
    await Property.findByIdAndUpdate(propertyId, { $inc: { likes: -1 } });
  } else {
    // Not saved → add
    user.savedProperties.push(propertyId);
    isSaved = true;
    // Increment likes count on the property
    await Property.findByIdAndUpdate(propertyId, { $inc: { likes: 1 } });
  }

  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: isSaved ? 'Property saved to favorites' : 'Property removed from favorites',
    data: { isSaved, propertyId }
  });
});

// @desc    Get all saved/favorite properties for the logged-in user
// @route   GET /api/favorites
// @access  Private
exports.getFavorites = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: 'savedProperties',
    populate: { path: 'owner', select: 'firstName lastName profileImage profile_img' }
  });

  if (!user) {
    return res.status(404).json({ success: false, error: 'User not found' });
  }

  // Filter out any null entries (deleted properties)
  const favorites = (user.savedProperties || []).filter(Boolean);

  res.status(200).json({
    success: true,
    count: favorites.length,
    data: favorites
  });
});

// @desc    Check if a property is saved by the current user
// @route   GET /api/favorites/check/:propertyId
// @access  Private
exports.checkFavorite = asyncHandler(async (req, res) => {
  const { propertyId } = req.params;
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ success: false, error: 'User not found' });
  }

  const isSaved = user.savedProperties.includes(propertyId);

  res.status(200).json({
    success: true,
    data: { isSaved, propertyId }
  });
});

// @desc    Get saved count for a specific property (public)
// @route   GET /api/favorites/count/:propertyId
// @access  Public
exports.getFavoriteCount = asyncHandler(async (req, res) => {
  const { propertyId } = req.params;

  const property = await Property.findById(propertyId).select('likes');
  const count = property ? (property.likes || 0) : 0;

  res.status(200).json({
    success: true,
    data: { count, propertyId }
  });
});
