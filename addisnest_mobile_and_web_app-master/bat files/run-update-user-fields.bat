@echo off
echo Running script to update user fields in MongoDB...
node update-user-fields.js
echo.
echo If the script completed successfully, all users in the database now have 'about' and 'profileImage' fields with default values of 'None' if they were missing or empty.
echo.
pause
