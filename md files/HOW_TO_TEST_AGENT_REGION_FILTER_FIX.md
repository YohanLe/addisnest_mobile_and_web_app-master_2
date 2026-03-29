# How to Test the Agent Region Filter Fix

This guide explains how to test the fix for the issue where users couldn't filter agents by regional state.

## Prerequisites
- Node.js and npm installed
- MongoDB running locally
- Project dependencies installed (`npm install`)

## Testing the Fix with Test Scripts

We've provided scripts to automate the testing process:

### Automated Testing with Batch File

1. Run the following batch file:
   ```
   run-agent-region-filter-test.bat
   ```

This script will:
- Create/update a test agent with the "Addis Ababa City Administration" region
- Start the server with the agent filter fix
- Test the agent filtering functionality 
- Show the test results in the console

### Manual Testing Steps

If you prefer to test manually:

1. **Create a test agent with the region**:
   ```
   node update-agent-with-region.js
   ```

2. **Start the server**:
   ```
   node src/server.js
   ```

3. **Test the agent filtering**:
   ```
   node test-agent-region-filter.js
   ```

## Testing through the UI

To verify the fix works in the actual application:

1. Start the application server:
   ```
   node src/server.js
   ```

2. Start the frontend:
   ```
   cd src && npm run dev
   ```

3. Open the browser and navigate to:
   ```
   http://localhost:5173/find-agent/list
   ```

4. Use the Region/City dropdown to select "Addis Ababa City Administration"

5. Verify that:
   - The agents list shows at least one agent
   - The filter tag appears showing the selected region
   - The agent count updates correctly

## Expected Results

When testing is successful, you should see:
- The test agent appearing in the filtered results when searching for "Addis Ababa City Administration"
- The region filter tag displaying correctly
- The agent count showing the correct number of agents matching the filter

## Troubleshooting

If you encounter issues:

1. Check the console logs for errors
2. Verify MongoDB is running and accessible
3. Ensure all dependencies are installed
4. Confirm the agent was created with the correct region by running:
   ```
   node update-agent-with-region.js
   ```
   and reviewing the output

## Additional Information

For a detailed explanation of the fix implementation, refer to the `AGENT_REGION_FILTER_FIX_DOCUMENTATION.md` file.
