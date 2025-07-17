@echo off
echo Creating necessary empty directories for Git...

REM Create uploads directory if it doesn't exist
if not exist uploads mkdir uploads

REM Create .gitkeep file in uploads directory
echo. > uploads\.gitkeep

echo Done. Empty directories will now be tracked by Git.
pause
