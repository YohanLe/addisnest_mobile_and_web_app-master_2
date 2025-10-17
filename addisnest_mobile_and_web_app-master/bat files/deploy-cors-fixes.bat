@echo off
echo ===================================================
echo Deploying CORS fixes to Netlify
echo ===================================================

echo.
echo 1. Committing changes to git...
git add functions/properties.js functions/getListings.js functions/api.js
git commit -m "Fix CORS policy issues for Netlify deploy previews"

echo.
echo 2. Deploying to Netlify...
netlify deploy --prod

echo.
echo ===================================================
echo Deployment complete! CORS issues should be fixed.
echo ===================================================
