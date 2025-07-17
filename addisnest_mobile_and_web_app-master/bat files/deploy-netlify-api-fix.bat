@echo off
echo ===================================================
echo Deploying Addisnest with API 404 error fixes
echo ===================================================

echo.
echo Step 1: Building the application...
echo Installing dependencies first...
npm install
echo Building with npx to ensure vite is found...
npx vite build
echo Copying redirects file...
copy /Y _redirects dist\_redirects

echo.
echo Step 2: Creating Netlify function dependencies...
if not exist dist\functions mkdir dist\functions
xcopy /E /I /Y functions\* dist\functions\
copy /Y package.json dist\functions\
copy /Y functions\package.json dist\functions\
copy /Y _redirects dist\_redirects

echo.
echo Step 3: Deploying to Netlify...
echo.
echo IMPORTANT: When prompted to "Publish directory", use "dist"
echo IMPORTANT: Make sure to add the following environment variables in Netlify:
echo   - MONGO_URI=mongodb+srv://addisnest_admin:40057200$aA@cluster0.erzzpdo.mongodb.net/addisnest
echo   - NODE_ENV=production
echo   - JWT_SECRET=addinest_super_secret_jwt_key_12345
echo   - JWT_EXPIRE=30d
echo.
echo This deployment includes fixes for the API 404 errors by:
echo - Adding a dedicated properties function for Netlify
echo - Updating _redirects to handle properties endpoints
echo - Using a smart API handler that works in both environments
echo   * Uses standard API routes in local development
echo   * Uses dedicated functions in Netlify production
echo.
echo Manual deployment instructions:
echo 1. Log into the Netlify dashboard at app.netlify.com
echo 2. Go to your site (addisnesttest.netlify.app)
echo 3. Click "Deploys" in the top menu
echo 4. Drag and drop your entire "dist" folder to deploy
echo 5. Wait for deployment to complete
echo 6. Verify your API by checking:
echo    - https://addisnesttest.netlify.app/.netlify/functions/api (general API)
echo    - https://addisnesttest.netlify.app/.netlify/functions/properties (property listings)
echo.
echo After deployment, please verify that:
echo 1. Your API is accessible at the endpoints above
echo 2. The database connection is working
echo 3. Property data is visible on your site without 404 errors
echo 4. Property detail pages load correctly
echo.
pause
