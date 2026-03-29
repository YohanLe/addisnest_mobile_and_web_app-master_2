@echo off
setlocal enabledelayedexpansion
color 0A

echo ===========================================================
echo     AddinEst Buy/Rent Toggle Button Test Script
echo ===========================================================
echo.

:: Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    color 0C
    echo ERROR: Node.js is not installed or not in the PATH.
    echo Please install Node.js and try again.
    echo.
    pause
    exit /b 1
)

echo Starting the Buy/Rent toggle button test...
echo This will launch the application and provide test instructions.
echo.
echo Press any key to continue or Ctrl+C to cancel...
pause > nul

:: Run the test script
node test-buy-rent-toggle.js

if %errorlevel% neq 0 (
    color 0C
    echo.
    echo ERROR: The test script encountered an error.
    echo.
    pause
    exit /b 1
)

pause
