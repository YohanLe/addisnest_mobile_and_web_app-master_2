@echo off
echo Committing final Netlify deployment fixes...

echo Adding modified files to git...
git add .env.production
git add netlify.toml
git add functions/package.json
git add NETLIFY_DEPENDENCY_FIX.md
git add commit-final-fixes.bat

echo Committing changes...
git commit -m "Fix: Add SendGrid dependency and update build configuration for Netlify"

echo Pushing to master branch...
git push origin master

echo Commit process completed!
pause
