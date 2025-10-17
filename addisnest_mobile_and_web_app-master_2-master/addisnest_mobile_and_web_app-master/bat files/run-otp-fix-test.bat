@echo off
echo =================================================
echo  Running OTP Fix Test
echo =================================================
echo.
echo This script will test the OTP functionality by making a request
echo to the correct endpoint (auth/request-otp) and displaying the response.
echo.
echo Make sure the server is running before executing this test.
echo.
pause

node test-otp-fix.js

echo.
echo Test completed. Check the output above for results.
echo.
pause
