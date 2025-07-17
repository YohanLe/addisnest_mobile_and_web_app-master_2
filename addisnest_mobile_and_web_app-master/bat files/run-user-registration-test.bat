@echo off
echo Running user registration test...
node test-user-registration.js
if %ERRORLEVEL% EQU 0 (
  echo Test completed successfully!
) else (
  echo Test failed with error code %ERRORLEVEL%
)
pause
