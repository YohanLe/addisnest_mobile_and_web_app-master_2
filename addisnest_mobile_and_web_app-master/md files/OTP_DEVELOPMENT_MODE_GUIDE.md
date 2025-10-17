# OTP Development Mode Guide

## Overview

In development mode, the AddisnEst application simulates email sending rather than actually sending emails. This is a common practice in development environments to avoid sending real emails during testing.

## How to Find Your OTP Code

When you request an OTP in development mode, the code is generated and displayed in the server console logs rather than being sent to your actual email address. Here's how to find it:

1. Look at the terminal window where the server is running (the one started with `node restart-server-clean.js`).
2. After requesting an OTP, you'll see a log message like this:

```
==================================================
DEVELOPMENT OTP CODE: 388632
==================================================
✅ OTP email sent to yohanb1212@gmail.com
```

3. The number displayed (in this example, `388632`) is your OTP code.
4. Use this code in the OTP verification form to complete the authentication process.

## Fixed Issue

We've fixed an issue where the frontend was using an incorrect endpoint (`auth/send-otp`) to request OTP codes. The correct endpoint is `auth/request-otp`, which is now being used.

## Testing the Fix

To test that the fix is working:

1. Start the backend server: `node restart-server-clean.js`
2. Start the frontend server: `.\run-frontend-fixed.bat`
3. Navigate to the application in your browser: `http://localhost:5179/`
4. Try to log in or register, which will trigger the OTP flow
5. When prompted for an OTP, check the server console logs for the OTP code
6. Enter the OTP code from the console logs into the verification form

## Production Environment

In a production environment, the application would be configured to actually send emails using a service like SendGrid. The OTP code would be sent to your actual email address rather than being displayed in the console logs.
