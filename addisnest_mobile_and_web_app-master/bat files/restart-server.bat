@echo off
echo ========================================
echo ADDINEST SERVER RESTART UTILITY
echo ========================================
echo.
echo This script will restart the Addinest server with improved error handling and status messages.
echo.
echo Press any key to continue or Ctrl+C to abort...
pause > nul

echo.
echo Running improved server restart utility...
echo.

node restart-server.js

echo.
pause
