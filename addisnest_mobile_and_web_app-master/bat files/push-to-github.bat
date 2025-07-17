@echo off
echo ===================================================
echo Pushing API 404 error fixes to GitHub
echo ===================================================

echo.
echo Step 1: Committing changes...
git add functions/properties.js
git add _redirects
git add src/utils/netlifyApiHandler.js
git add src/Redux-store/Slices/HomeSlice.js
git add src/Redux-store/Slices/PropertyDetailSlice.js

git commit -m "Fix: Netlify API 404 errors with properties endpoint"

echo.
echo Step 2: Pushing to master branch...
git push origin master

echo.
echo ===================================================
echo Changes pushed to GitHub. Netlify should now redeploy.
echo ===================================================
echo.
echo Please verify on Netlify that:
echo 1. The deployment was successful
echo 2. The property listings appear correctly without 404 errors
echo 3. Property detail pages load correctly
echo.
echo If you continue to see issues, check the Netlify logs
echo for any deployment or function errors.
echo.
pause
