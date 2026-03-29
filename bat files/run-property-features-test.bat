@echo off
echo ========================================
echo PROPERTY FEATURES IMPLEMENTATION TEST
echo ========================================
echo.
echo This script will test the property features implementation in the property detail page.
echo.
echo Prerequisites:
echo  - Node.js is installed
echo  - The AddisnEst application is running (Frontend: http://localhost:5173, Backend: http://localhost:7001)
echo.
echo Press any key to continue or Ctrl+C to abort...
pause > nul

echo.
echo Running property features test...
echo.

node test-property-features.js

echo.
echo Test completed!
echo If the test was successful, a screenshot named "property-features-test.png" has been saved.
echo.
pause
