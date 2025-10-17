@echo off
echo ===============================================
echo Testing Agent Region Filter Fix
echo ===============================================

echo.
echo Step 1: Creating/updating test agent with region...
node update-agent-with-region.js

echo.
echo Step 2: Starting server with the agent filter fix...
start "Addisnest Server" node src/server.js

echo.
echo Waiting for server to start...
timeout /t 5 /nobreak > nul

echo.
echo Step 3: Testing agent region filtering...
node test-agent-region-filter.js

echo.
echo Test completed. Press any key to close the server...
pause > nul

echo.
echo Shutting down server...
taskkill /FI "WINDOWTITLE eq Addisnest Server" /F > nul 2>&1

echo.
echo Done!
echo.
