@echo off
echo ========================================================
echo Deploying Property POST API Fix to Netlify
echo ========================================================
echo.

echo Step 1: Building the application...
echo Installing dependencies first...
call npm install
echo Building with npx to ensure vite is found...
call npx vite build
echo Copying redirects file...
copy /Y _redirects dist\_redirects
echo Build completed successfully!
echo.

echo Step 2: Preparing functions for deployment...
echo Creating functions directory in dist if it doesn't exist...
if not exist dist\functions mkdir dist\functions
echo Copying function files to dist...
xcopy /E /I /Y functions\* dist\functions\
copy /Y package.json dist\functions\
copy /Y functions\package.json dist\functions\
copy /Y _redirects dist\_redirects
echo Function setup completed successfully!
echo.

echo Step 3: Deploying to Netlify...
echo.
echo You can now deploy to Netlify using one of these methods:
echo.
echo Option 1: Use Netlify CLI (if installed)
echo   netlify deploy --prod
echo.
echo Option 2: Manual upload through Netlify website
echo   1. Go to https://app.netlify.com/
echo   2. Navigate to your site
echo   3. Go to "Deploys" tab
echo   4. Drag and drop the "dist" folder
echo.
echo Option 3: Push to GitHub (if your site is connected to GitHub)
echo   Use the push-to-github.bat script
echo.
echo Deployment package prepared successfully!
echo See PROPERTY_POST_API_FIX.md for details about the changes.
echo.
echo ========================================================
