@echo off
echo ===================================================
echo       Deploying Addinest to Netlify
echo ===================================================
echo.

REM Check if netlify CLI is installed
where netlify >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
  echo Netlify CLI not found. Installing...
  npm install -g netlify-cli
  if %ERRORLEVEL% NEQ 0 (
    echo Failed to install Netlify CLI. Please install it manually with:
    echo npm install -g netlify-cli
    exit /b 1
  )
)

echo.
echo Deploying to Netlify...
echo.
echo NOTE: When prompted, choose the "dist" directory as the publish directory.
echo.

REM Deploy to Netlify
netlify deploy --prod

if %ERRORLEVEL% NEQ 0 (
  echo.
  echo Deployment failed. Please check the error messages above.
  exit /b 1
)

echo.
echo ===================================================
echo Deployment completed successfully!
echo.
echo Next Steps:
echo 1. Visit the Netlify URL provided above to verify your site
echo 2. Connect your custom domain (addisnest.com) in the Netlify dashboard:
echo    - Go to Site settings > Domain management > Add custom domain
echo ===================================================
