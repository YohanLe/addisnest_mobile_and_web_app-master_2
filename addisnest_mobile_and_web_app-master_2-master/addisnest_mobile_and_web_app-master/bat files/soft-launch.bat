@echo off
echo.
echo ============================================================
echo            AddisnEst Soft Launch Configuration
echo ============================================================
echo.

echo Initializing Git repository (if not already initialized)...
git init

echo.
echo Adding all files to Git...
git add .

echo.
echo Committing files as initial master version...
git commit -m "Initial master version for soft launch"

echo.
echo Setting up master branch...
git branch -M master

echo.
echo ============================================================
echo  Success! The current code is now set as the master branch.
echo ============================================================
echo.
echo You can push this to a remote repository with:
echo   git remote add origin YOUR_REPOSITORY_URL
echo   git push -u origin master
echo.

pause
