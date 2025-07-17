@echo off
echo Creating admin user...
node src/scripts/seedAdminUser.js
echo.
echo If successful, you can now log in with:
echo Email: admin@addisnest.com
echo Password: Admin@123
echo.
pause
