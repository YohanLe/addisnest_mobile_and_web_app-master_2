@echo off
echo Seeding test users in MongoDB...
node seed-test-user.js
if %ERRORLEVEL% EQU 0 (
  echo Test users created successfully!
  echo You can now test login with the emails shown above.
  echo Password for all test users: Password123!
) else (
  echo Failed to create test users with error code %ERRORLEVEL%
)
pause
