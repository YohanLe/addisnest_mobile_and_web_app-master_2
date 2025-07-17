@echo off
echo ===============================================================
echo         MongoDB ID Property Lookup Fix - Test Script
echo ===============================================================
echo.
echo This script will test that property details can be fetched using 
echo MongoDB ObjectIDs without authentication errors.
echo.
echo Please ensure that:
echo  1. MongoDB is running locally
echo  2. Test data has been seeded (run-seed-test-property.bat)
echo  3. The server is running with the fix enabled (start-app-with-mongo-id-fix.bat)
echo.
echo Press any key to continue or Ctrl+C to cancel...
pause > nul

node test-property-mongo-id-fix.js

echo.
echo Press any key to exit...
pause > nul
