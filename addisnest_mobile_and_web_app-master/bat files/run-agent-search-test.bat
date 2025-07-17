@echo off
echo.
echo ======================================================
echo        TESTING AGENT SEARCH FUNCTIONALITY
echo ======================================================
echo.
echo This test will verify that the agent search feature is working correctly
echo after the fixes we applied to:
echo.
echo 1. Database fields (specialties, languagesSpoken, region, averageRating)
echo 2. Frontend component field name references
echo 3. JSX syntax for conditional rendering
echo.
echo Starting the test...
echo.

REM First restart the server to ensure all changes are applied
call node restart-server.js

REM Run the direct database update script to ensure agent data is properly set
call node direct-update-agent.js

REM Launch the frontend application
echo Starting the React frontend application...
start "" http://localhost:5173/find-agent/list

REM Launch the frontend in development mode
cd src && npm run dev

echo.
echo Test completed! Check the browser to verify agents are displaying correctly.
echo.
