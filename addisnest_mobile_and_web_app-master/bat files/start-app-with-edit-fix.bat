@echo off
echo Starting Addinest application with Property Edit Fixes...
echo.

echo This script will:
echo 1. Start the Addinest application with property edit fixes
echo 2. Open the property edit test page

REM Start the application
echo Starting application server...
start cmd /k "npm run dev"

REM Wait for server to start
echo Waiting for server to start (10 seconds)...
timeout /t 10 /nobreak > nul

REM Open the test page
echo Opening test page...
start "" test-edit-property-fix.html

echo.
echo Application started with property edit fixes!
echo.
echo To test the property edit functionality:
echo 1. Log in to the application
echo 2. Go to your account management page
echo 3. Click on a property's "Edit" button
echo 4. Verify that all fields are correctly populated
echo.
echo Alternatively, use the test page that opened to simulate edit clicks
echo and test with sample data.
echo.
echo Press any key to exit...
pause > nul
