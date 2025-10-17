const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/addinest')
  .then(async () => {
    console.log('Connected to MongoDB');
    const User = require('./src/models/User');
    
    // Update the existing agent with specialties and languages with correct field structure
    const result = await User.updateOne(
      { _id: '6845436d504a2bf073a4a7e2' },
      { 
        $set: {
          specialties: ['Buying', 'Selling', 'Residential'],
          languagesSpoken: ['Amharic', 'English'],
          averageRating: 4.5,
          'address.state': 'Addis Ababa',  // This is the correct field structure
          isVerified: true
        }
      }
    );
    
    console.log('Update result:', result);
    console.log('Updated agent:');
    const agent = await User.findById('6845436d504a2bf073a4a7e2');
    console.log(agent);
    
    mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
