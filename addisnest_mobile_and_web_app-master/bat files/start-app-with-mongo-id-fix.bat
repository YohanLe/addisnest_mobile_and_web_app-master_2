@echo off
echo ===============================================================
echo       Starting Application with MongoDB ID Lookup Fix
echo ===============================================================
echo.
echo This script will start the application with the MongoDB ID
echo property lookup fix enabled and open a test property detail page.
echo.
echo The fix ensures that property details can be accessed via 
echo MongoDB ObjectIDs without requiring authentication.
echo.
echo Press any key to continue or Ctrl+C to cancel...
pause > nul

node launch-with-mongo-id-fix.js

echo.
echo Press any key to exit...
pause > nul
