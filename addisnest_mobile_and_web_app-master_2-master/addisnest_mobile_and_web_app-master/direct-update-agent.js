const mongoose = require('mongoose');
require('dotenv').config();

async function updateAgent() {
  let connection;
  
  try {
    console.log('Connecting to MongoDB...');
    connection = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/addisnest', {
      serverSelectionTimeoutMS: 5000 // Set a shorter timeout for faster feedback
    });
    
    console.log('Connected to MongoDB');
    const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }), 'users');
    
    // Update the agent with ID 6845436d504a2bf073a4a7e2
    const agentId = '6845436d504a2bf073a4a7e2'; // Yohan's agent ID
    
    const result = await User.updateOne(
      { _id: agentId },
      { 
        $set: {
          specialties: ['Buying', 'Selling', 'Residential'],
          languagesSpoken: ['Amharic', 'English'],
          averageRating: 4.5,
          region: 'Addis Ababa',
          isVerified: true
        }
      }
    );
    
    console.log('Update result:', JSON.stringify(result, null, 2));
    
    if (result.modifiedCount === 0) {
      console.log('Warning: No document was modified. This could mean the agent was not found or the values were already set.');
    }
    
    // Fetch and display the updated agent
    const agent = await User.findById(agentId);
    
    if (!agent) {
      console.error('Error: Agent not found after update');
      return;
    }
    
    console.log('Updated agent details:');
    console.log('ID:', agent._id);
    console.log('Name:', agent.firstName, agent.lastName);
    console.log('Specialties:', agent.specialties);
    console.log('Languages:', agent.languagesSpoken);
    console.log('Rating:', agent.averageRating);
    console.log('Verified:', agent.isVerified);
    console.log('Region:', agent.region);
    
  } catch (err) {
    console.error('Error:', err.message);
    if (err.name === 'MongooseError' || err.name === 'MongoError') {
      console.error('MongoDB Error Details:', err);
    }
  } finally {
    if (connection) {
      console.log('Disconnecting from MongoDB...');
      await mongoose.disconnect();
      console.log('Disconnected from MongoDB');
    }
  }
}

updateAgent();
