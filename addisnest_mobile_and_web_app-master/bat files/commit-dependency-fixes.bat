@echo off
echo Committing Netlify dependency fixes to master branch...

echo Adding modified files to git...
git add package.json
git add functions/package.json
git add deploy-netlify-with-fixes.bat
git add NETLIFY_DEPENDENCY_FIX.md
git add NETLIFY_DEPLOY_WITH_FIXES.md
git add netlify.toml

echo Committing changes...
git commit -m "Fix: Add missing dependencies for Netlify functions deployment"

echo Pushing to master branch...
git push origin master

echo Commit process completed!
pause
