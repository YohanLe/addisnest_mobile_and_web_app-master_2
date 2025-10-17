@echo off
echo Preparing deployment to Netlify with all required dependencies...

echo Running npm install to update dependencies in root directory...
call npm install express-async-handler cors jsonwebtoken

echo Installing dependencies for serverless functions...
cd functions
call npm install
cd ..

echo Building the application...
call npm run build

echo Creating Netlify function bundles...
if not exist ".netlify" mkdir .netlify
if not exist ".netlify\functions" mkdir .netlify\functions

echo Deploying to Netlify...
call npx netlify-cli deploy --prod

echo Deployment process completed!
pause
