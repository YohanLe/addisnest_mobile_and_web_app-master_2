const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./src/models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => {
  console.error('MongoDB Connection Error:', err);
  process.exit(1);
});

const updateUserFields = async () => {
  try {
    console.log('Starting to update user fields...');
    
    // Update users without an about field or with empty about field
    const aboutUpdateResult = await User.updateMany(
      { $or: [{ about: { $exists: false } }, { about: "" }] },
      { $set: { about: "None" } }
    );
    
    console.log(`Updated ${aboutUpdateResult.modifiedCount} users with default 'about' field`);
    
    // Update users without a profileImage field or with empty profileImage field
    const profileImageUpdateResult = await User.updateMany(
      { $or: [{ profileImage: { $exists: false } }, { profileImage: "" }] },
      { $set: { profileImage: "None" } }
    );
    
    console.log(`Updated ${profileImageUpdateResult.modifiedCount} users with default 'profileImage' field`);
    
    console.log('User fields update completed successfully');
    
    // Close the MongoDB connection
    mongoose.connection.close();
    console.log('MongoDB connection closed');
    
  } catch (error) {
    console.error('Error updating user fields:', error);
    mongoose.connection.close();
    process.exit(1);
  }
};

// Run the update function
updateUserFields();
