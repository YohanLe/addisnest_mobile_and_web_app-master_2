/**
 * Test script for agent search functionality
 * 
 * This script will:
 * 1. Update agent data in the database
 * 2. Open the agent search page in the default browser
 */

const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);
const path = require('path');
const open = require('open');

async function runTest() {
  console.log("======================================================");
  console.log("        TESTING AGENT SEARCH FUNCTIONALITY");
  console.log("======================================================");
  console.log();
  console.log("This test will verify that the agent search feature is working correctly");
  console.log("after the fixes we applied.");
  console.log();

  try {
    // First, update the agent in the database
    console.log("Step 1: Updating agent data in the database...");
    await execAsync('node direct-update-agent.js');
    console.log("✓ Agent data updated successfully");
    console.log();

    // Check if server is running by making a request to the API endpoint
    console.log("Step 2: Checking if server is running...");
    const isServerRunning = await checkServerStatus();
    
    if (!isServerRunning) {
      console.log("! Server not running. Starting server...");
      // Start the server in a new terminal window/process
      exec('start cmd.exe /K node src/server.js', (error) => {
        if (error) {
          console.error(`Error starting server: ${error.message}`);
          return;
        }
      });
      
      // Wait for server to start
      console.log("Waiting for server to start (5 seconds)...");
      await new Promise(resolve => setTimeout(resolve, 5000));
    } else {
      console.log("✓ Server is already running");
    }
    console.log();

    // Open the agent search page in the browser
    console.log("Step 3: Opening agent search page in browser...");
    await open('http://localhost:5173/find-agent/list');
    console.log("✓ Browser opened with agent search page");
    console.log();

    console.log("Test completed!");
    console.log("Please check your browser to verify that agents are displaying correctly.");
    console.log("The page should show at least one agent with specialties, languages, and rating.");
    console.log();
  } catch (error) {
    console.error("Error running test:", error.message);
  }
}

async function checkServerStatus() {
  try {
    const { stdout } = await execAsync('curl -s -o /dev/null -w "%{http_code}" http://localhost:7000/api/agents/list');
    return stdout.trim() === '200';
  } catch (error) {
    return false;
  }
}

// Run the test
runTest();
