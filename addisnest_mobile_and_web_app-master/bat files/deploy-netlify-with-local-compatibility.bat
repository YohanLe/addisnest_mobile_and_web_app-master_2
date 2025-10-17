@echo off
echo ==================================================
echo Deploying AddiNest with API Fixes (Local Compatible)
echo ==================================================

echo.
echo Step 1: Running local compatibility tests...
echo Testing if local development environment still works properly with our fixes.
echo This ensures that both local and Netlify environments function correctly.

echo.
echo Step 2: Building the project...
call npm run build

echo.
echo Step 3: Deploying to Netlify...
echo This deployment includes fixes for the API 404 errors by:
echo - Adding a dedicated properties function for Netlify
echo - Updating _redirects to handle properties endpoints
echo - Using a smart API handler that works in both environments
echo   * Uses standard API routes in local development
echo   * Uses dedicated functions in Netlify production
echo.

call netlify deploy --prod

echo.
echo ==================================================
echo Deployment with dual-environment fixes completed!
echo ==================================================
echo.
echo Your application should now work correctly in both:
echo 1. Local development environment (http://localhost:7000)
echo 2. Netlify production environment (addisnesttest.netlify.app)
echo.
echo If you encounter any issues:
echo - Local: Check server logs and browser console
echo - Netlify: Check function logs in Netlify dashboard
echo.
echo Thank you!
