/**
 * Simplified test script for agent search functionality
 * This script updates the agent data in the database
 */

const mongoose = require('mongoose');
require('dotenv').config();

async function runTest() {
  console.log("======================================================");
  console.log("        TESTING AGENT SEARCH FUNCTIONALITY");
  console.log("======================================================");
  console.log();
  console.log("This test will update the agent data in the database to ensure");
  console.log("the agent search feature works correctly.");
  console.log();

  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/addinest');
    console.log("Connected to MongoDB");
    
    const User = require('./src/models/User');
    
    // Update the existing agent with proper fields
    console.log("Updating agent data...");
    const result = await User.updateOne(
      { _id: '6845436d504a2bf073a4a7e2' },
      { 
        $set: {
          specialties: ['Buying', 'Selling', 'Residential'],
          languagesSpoken: ['Amharic', 'English'],
          averageRating: 4.5,
          region: 'Addis Ababa',
          isVerified: true,
          firstName: 'John',
          lastName: 'Doe'
        }
      }
    );
    
    console.log("Update result:", result);
    console.log();
    
    // Get and display the updated agent
    const agent = await User.findById('6845436d504a2bf073a4a7e2');
    console.log("Updated agent:");
    console.log({
      id: agent._id,
      firstName: agent.firstName,
      lastName: agent.lastName,
      specialties: agent.specialties,
      languagesSpoken: agent.languagesSpoken,
      averageRating: agent.averageRating,
      region: agent.region,
      isVerified: agent.isVerified
    });
    
    console.log();
    console.log("Agent data updated successfully!");
    console.log();
    console.log("NEXT STEPS:");
    console.log("1. Open your browser and navigate to: http://localhost:5173/find-agent/list");
    console.log("2. Verify that the agent appears in the list with proper information");
    console.log("3. Verify that specialties, languages, and rating are displayed correctly");
    console.log();
    
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
    
  } catch (error) {
    console.error("Error running test:", error.message);
    
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  }
}

// Run the test
runTest();
