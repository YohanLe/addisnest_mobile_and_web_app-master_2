@echo off
echo ========================================
echo PROPERTY IMAGE FORMAT FIX TEST LAUNCHER
echo ========================================
echo.
echo This script will test the property submission with different image formats
echo to verify that the image format fix is working correctly.
echo.
echo Before running this test:
echo 1. Make sure the server is running
echo 2. Verify you have the correct .env file with test user credentials
echo.
echo Press CTRL+C to cancel or any key to continue...
pause > nul

echo.
echo Starting test...
echo.

node test-property-image-format-fix.js

echo.
echo Test completed!
echo Check the image-format-test-results.json file for detailed results.
echo.
pause
