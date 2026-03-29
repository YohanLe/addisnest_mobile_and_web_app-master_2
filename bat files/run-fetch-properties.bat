@echo off
setlocal enabledelayedexpansion
color 0A

echo ===========================================================
echo     AddinEst Fetch Properties Launcher
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

:: Kill any existing Node.js processes (optional, only if needed)
echo Do you want to kill any existing Node.js processes before starting?
echo This might be necessary if you're experiencing port conflicts.
echo.
set /p KILL_PROCESSES="Kill existing Node.js processes? (Y/N): "
if /i "!KILL_PROCESSES!"=="Y" (
    echo.
    echo Terminating existing Node.js processes...
    taskkill /im node.exe /f >nul 2>nul
    if %errorlevel% equ 0 (
        echo All Node.js processes have been terminated.
    ) else (
        echo No Node.js processes were running.
    )
    echo.
)

echo Starting the application with proper configuration to fetch properties...
echo This will launch both frontend and backend servers.
echo.
echo Launching application... Please wait...
echo.

:: Run the fetch properties launcher script
node fetch-properties-launcher.js

:: Check if the launcher started successfully
if %errorlevel% neq 0 (
    color 0C
    echo.
    echo ERROR: The application failed to start properly.
    echo.
    echo Troubleshooting steps:
    echo 1. Run 'taskkill /im node.exe /f' to kill any conflicting processes
    echo 2. Make sure MongoDB is running (if required)
    echo 3. Check that all required npm packages are installed
    echo 4. Run 'node check-app-status.js' to diagnose issues
    echo.
    pause
    exit /b 1
)

echo.
echo ===========================================================
echo.
echo Application is now running!
echo.
echo Frontend: http://localhost:5173
echo Backend API: http://localhost:7000
echo.
echo Press Ctrl+C in the application window to stop the servers.
echo ===========================================================
echo.

pause
