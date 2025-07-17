@echo off
echo Running OTP popup test...
echo.
echo This test will:
echo 1. Start the application with our OTP popup fix
echo 2. Open a browser and navigate to the registration page
echo 3. Fill out the registration form
echo 4. Verify that the OTP popup appears correctly
echo.
echo Make sure the application is running before starting this test.
echo.
pause

node test-otp-popup-fix.js

echo.
echo Test completed. Check the console output for results.
echo.
pause
