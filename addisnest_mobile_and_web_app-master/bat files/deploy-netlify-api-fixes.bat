@echo off
echo ====================================
echo Deploying AddiNest with API Fixes
echo ====================================

echo.
echo Step 1: Building the project...
call npm run build

echo.
echo Step 2: Deploying to Netlify...
echo This will fix the API 404 errors by:
echo - Adding a dedicated properties function
echo - Updating _redirects to handle properties endpoints
echo - Updating Redux store to use the new API handler
echo.

call netlify deploy --prod

echo.
echo ====================================
echo Deployment with API fixes completed!
echo ====================================
echo.
echo If you're still seeing 404 errors, please check:
echo 1. Netlify function logs in the Netlify dashboard
echo 2. The browser console for more detailed error messages
echo 3. Verify that the MongoDB connection is working
echo.
echo Thank you!
