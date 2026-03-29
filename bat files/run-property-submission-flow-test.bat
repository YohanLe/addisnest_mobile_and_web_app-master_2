@echo off
echo =======================================================
echo PROPERTY SUBMISSION FLOW TEST
echo =======================================================
echo This batch file runs the test script to verify that 
echo property submission is working correctly with the fixed
echo ChoosePropmotionFixed component.
echo.
echo The test will:
echo 1. Authenticate a test user
echo 2. Submit a test property to the API
echo 3. Verify the property was saved in the database
echo =======================================================
echo.

echo Starting test script...
echo.

node test-property-submission-flow.js

echo.
echo Test completed!
echo =======================================================
echo.
pause
