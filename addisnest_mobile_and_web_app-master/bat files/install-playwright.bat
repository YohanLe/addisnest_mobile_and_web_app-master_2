@echo off
echo Installing Playwright for testing...

echo Installing Playwright package...
npm install -D playwright

echo Installing Playwright browsers...
npx playwright install chromium

echo Playwright installation completed.
echo You can now run the location filter test using run-admin-location-filter-test.bat
