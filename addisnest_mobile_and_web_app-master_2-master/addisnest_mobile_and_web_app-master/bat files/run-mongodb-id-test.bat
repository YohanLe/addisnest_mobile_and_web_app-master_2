@echo off
echo ====================================================
echo MongoDB ID Property Edit Test Runner
echo ====================================================
echo.
echo This script will:
echo 1. Setup test data for MongoDB ID property editing
echo 2. Open the test HTML page to help with testing

REM Create test data in localStorage
echo Setting up test data...
node test-mongodb-id-property-edit.js

REM Wait a moment
timeout /t 2 > nul

REM Open the test HTML page
echo Opening test page...
start "" test-mongodb-id-property-edit.html

echo.
echo Test setup complete!
echo.
echo IMPORTANT TESTING STEPS:
echo 1. On the test page, click "Prepare Test Data"
echo 2. Then click "Edit Property" to navigate to the edit form
echo 3. Verify the form is populated with MongoDB property data
echo 4. Property ID in URL should be: 6849bd6a2b9f36399990f4fb
echo.
echo If form loads empty, check:
echo - Both servers are running (backend on port 5000, frontend on port 5173)
echo - MongoDB connection is active
echo - PropertyListingsTab is correctly processing _id fields
echo.
echo Press any key to exit...
pause > nul
