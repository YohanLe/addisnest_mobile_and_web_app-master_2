@echo off
echo === GitHub Repository Setup ===
echo.

REM Check if git is installed
git --version > nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Error: Git is not installed. Please install Git first.
    exit /b 1
)

REM Initialize Git repository if it doesn't exist
if not exist .git (
    echo Initializing Git repository...
    git init
    echo Git repository initialized.
) else (
    echo Git repository already exists.
)

REM Check if remote origin exists
git remote | findstr "origin" > nul
if %ERRORLEVEL% equ 0 (
    echo Remote 'origin' already exists.
    for /f "tokens=*" %%a in ('git remote get-url origin') do set REMOTE_URL=%%a
    echo Current remote URL: %REMOTE_URL%
    
    set /p update_remote=Do you want to update the remote URL? (y/n): 
    if /i "%update_remote%"=="y" (
        set /p github_username=Enter your GitHub username: 
        set /p repo_name=Enter your repository name: 
        git remote set-url origin https://github.com/%github_username%/%repo_name%.git
        echo Remote URL updated to: https://github.com/%github_username%/%repo_name%.git
    )
) else (
    REM Set up remote origin
    set /p github_username=Enter your GitHub username: 
    set /p repo_name=Enter your repository name: 
    git remote add origin https://github.com/%github_username%/%repo_name%.git
    echo Remote origin added: https://github.com/%github_username%/%repo_name%.git
)

REM Stage files
echo.
echo Staging files...
git add .
echo Files staged.

REM Commit changes
echo.
set /p commit_message=Enter commit message (default: 'Initial commit'): 
if "%commit_message%"=="" set commit_message=Initial commit
git commit -m "%commit_message%"
echo Changes committed.

REM Push to GitHub
echo.
echo You'll need to create a repository on GitHub before pushing.
echo Go to https://github.com/new to create a new repository.
echo Make sure to name it: %repo_name%
echo DO NOT initialize the repository with README, .gitignore, or license files.
echo.
set /p repo_created=Have you created the repository on GitHub? (y/n): 

if /i "%repo_created%"=="y" (
    echo Pushing to GitHub...
    git push -u origin master 2>nul || git push -u origin main
    echo Push completed.
    echo.
    echo Your repository is now available at: https://github.com/%github_username%/%repo_name%
) else (
    echo Please create the repository on GitHub before pushing.
    echo When ready, run the following command to push your code:
    echo git push -u origin master
    echo.
)

echo.
echo === GitHub Setup Complete ===
pause
