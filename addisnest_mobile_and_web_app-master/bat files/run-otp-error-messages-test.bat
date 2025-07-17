@echo off
echo ===================================================
echo    Testing OTP Error Messages Implementation
echo ===================================================
echo.
echo This script will restart the server with the updated
echo OTP error messages implementation.
echo.
echo After the server starts:
echo 1. Request an OTP for login or registration
echo 2. Enter an incorrect OTP to test the error message
echo 3. Wait 5+ minutes and try using an expired OTP
echo 4. Try to register with an email that already exists
echo    to test the "already registered" error message
echo.
echo Press any key to start the server...
pause > nul

echo.
echo Starting server with updated OTP error messages...
echo.

node restart-server-clean.js

echo.
echo Server started. You can now test the OTP error messages.
echo.
echo Remember to check both regular OTP verification and social login OTP verification.
echo.
