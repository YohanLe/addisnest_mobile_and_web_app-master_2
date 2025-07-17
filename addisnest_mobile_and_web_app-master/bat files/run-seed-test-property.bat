@echo off
echo ===============================================================
echo       Seeding Test Properties with MongoDB ID Lookup Fix
echo ===============================================================
echo.
echo This script will seed the database with test properties 
echo that have specific MongoDB IDs for testing the property lookup fix.
echo.
echo Press any key to continue or Ctrl+C to cancel...
pause > nul

node seed-test-property-data.js

echo.
echo Press any key to exit...
pause > nul
