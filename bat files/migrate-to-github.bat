@echo off
echo ===================================================
echo    ADDINEST REAL ESTATE - GITHUB MIGRATION TOOL
echo ===================================================
echo.
echo This script will perform all steps needed to migrate
echo the project to GitHub in a single process.
echo.
echo Steps that will be performed:
echo 1. Create necessary empty directories for Git tracking
echo 2. Initialize Git repository
echo 3. Stage all files
echo 4. Commit changes
echo 5. Set up GitHub remote
echo 6. Push to GitHub
echo.
echo Please make sure you have:
echo - Git installed on your system
echo - A GitHub account
echo - Created a new empty repository on GitHub
echo.
pause

REM Check if git is installed
git --version > nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Error: Git is not installed. Please install Git first.
    echo You can download Git from https://git-scm.com/downloads
    pause
    exit /b 1
)

REM Create necessary empty directories for Git
echo.
echo Step 1: Creating necessary empty directories for Git...
if not exist uploads mkdir uploads
echo. > uploads\.gitkeep
echo Done.

REM Initialize Git repository if it doesn't exist
echo.
echo Step 2: Initializing Git repository...
if not exist .git (
    git init
    echo Git repository initialized.
) else (
    echo Git repository already exists.
)

REM Set up GitHub remote
echo.
echo Step 3: Setting up GitHub remote...
set github_username=YohanLe
set repo_name=addisnest_desktop_new
echo Using repository: https://github.com/%github_username%/%repo_name%.git

git remote | findstr "origin" > nul
if %ERRORLEVEL% equ 0 (
    echo Remote 'origin' already exists.
    set /p update_remote=Do you want to update the remote URL? (y/n): 
    if /i "%update_remote%"=="y" (
        git remote set-url origin https://github.com/%github_username%/%repo_name%.git
        echo Remote URL updated to: https://github.com/%github_username%/%repo_name%.git
    )
) else (
    git remote add origin https://github.com/%github_username%/%repo_name%.git
    echo Remote origin added: https://github.com/%github_username%/%repo_name%.git
)

REM Stage files
echo.
echo Step 4: Staging files...
git add .
echo Files staged.

REM Commit changes
echo.
echo Step 5: Committing changes...
set /p commit_message=Enter commit message (default: 'Initial commit'): 
if "%commit_message%"=="" set commit_message=Initial commit
git commit -m "%commit_message%"
echo Changes committed.

REM Push to GitHub
echo.
echo Step 6: Pushing to GitHub...
echo Before proceeding, make sure you have created a repository named '%repo_name%' on GitHub.
echo Go to https://github.com/new to create a new repository if you haven't already.
echo IMPORTANT: Do NOT initialize the repository with README, .gitignore, or license files.
echo.
set /p ready_to_push=Are you ready to push to GitHub? (y/n): 

if /i "%ready_to_push%"=="y" (
    echo Pushing to GitHub...
    git push -u origin master 2>nul || git push -u origin main
    
    if %ERRORLEVEL% equ 0 (
        echo.
        echo ===================================================
        echo       MIGRATION COMPLETED SUCCESSFULLY!
        echo ===================================================
        echo.
        echo Your repository is now available at:
        echo https://github.com/%github_username%/%repo_name%
        echo.
        echo Next steps:
        echo 1. Visit your GitHub repository to verify all files were uploaded
        echo 2. Share your repository with your team
        echo 3. Continue development using Git for version control
        echo.
    ) else (
        echo.
        echo ===================================================
        echo            PUSH FAILED
        echo ===================================================
        echo.
        echo There was an error pushing to GitHub.
        echo Common issues:
        echo - Repository doesn't exist on GitHub
        echo - Repository was initialized with files on GitHub
        echo - Authentication issues
        echo.
        echo Please check the error message above and try again.
        echo You can manually push your changes later with:
        echo   git push -u origin master
        echo.
    )
) else (
    echo.
    echo Push skipped. You can push your changes later with:
    echo   git push -u origin master
    echo.
)

pause
