@echo off
echo Starting application with OTP popup fix...

:: Start the backend server
start cmd /k "node src/server.js"

:: Wait for the server to start
timeout /t 5

:: Start the frontend
start cmd /k "npm run dev"

echo Application started with OTP popup fix.
echo Please test the registration flow to verify the OTP popup appears correctly.
