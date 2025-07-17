@echo off
echo.
echo ===============================================================
echo PROPERTY ADDRESS VALIDATION TEST
echo ===============================================================
echo.
echo This script will test the property submission address validation fix
echo.
echo Requirements:
echo  - Server must be running on http://localhost:7000
echo  - You must be logged in (valid auth token in .env)
echo.
echo ===============================================================
echo.

node test-property-address-validation.js

echo.
echo Test completed. Press any key to exit...
pause > nul
