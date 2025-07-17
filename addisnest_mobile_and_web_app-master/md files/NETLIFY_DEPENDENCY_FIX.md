# Netlify Deployment Dependency Fix

## Issue
Netlify deployment was failing with the following error:
```
A Netlify Function failed to require one of its dependencies.
Please make sure it is present in the site's top-level "package.json".

In file "/opt/build/repo/functions/api.js"
Cannot find module 'express-async-handler'
```

## Root Cause
The application uses several dependencies in the serverless functions that were not listed in the `package.json` file. Netlify requires all dependencies used by serverless functions to be listed in the appropriate package.json files.

The missing dependencies were:
1. `express-async-handler` - Used in baseController.js for wrapping async controller functions
2. `cors` - Used in api.js for enabling Cross-Origin Resource Sharing
3. `jsonwebtoken` - Used in auth.js middleware for token verification

## Fix Applied
1. Added the missing dependencies to the root package.json file:
```json
"express-async-handler": "^1.2.0",
"cors": "^2.8.5",
"jsonwebtoken": "^9.0.2"
```

2. Created a dedicated package.json file in the functions directory to ensure Netlify correctly resolves dependencies for serverless functions:
```json
{
  "name": "addisnest-functions",
  "version": "1.0.0",
  "description": "Netlify functions for Addisnest",
  "dependencies": {
    "@sendgrid/mail": "^7.7.0",
    "express": "^5.1.0",
    "express-async-handler": "^1.2.0",
    "serverless-http": "^3.2.0",
    "mongoose": "^8.15.1",
    "cors": "^2.8.5",
    "dotenv": "^16.5.0",
    "jsonwebtoken": "^9.0.2"
  }
}
```

3. Updated the netlify.toml build command to install function dependencies during build and properly set NODE_ENV:
```
[build]
  publish = "dist"
  command = "NODE_ENV=production npm run build && cd functions && npm install"
  functions = "functions"
```

4. Added the Netlify Functions Install Core plugin to ensure dependencies are properly installed:
```
[[plugins]]
  package = "@netlify/plugin-functions-install-core"
```

5. Removed NODE_ENV from .env.production file to avoid conflicts with Vite build configuration

## Deployment Instructions
1. Run the provided `deploy-netlify-with-fixes.bat` script which will:
   - Install the missing dependencies in the root directory
   - Install dependencies for serverless functions in the functions directory
   - Build the application
   - Create Netlify function bundles if needed
   - Deploy to Netlify

Or manually:
1. Run `npm install express-async-handler cors jsonwebtoken` in the root directory
2. Navigate to the functions directory and run `npm install`
3. Return to the root directory and run `npm run build`
4. Deploy to Netlify using `netlify deploy --prod`

## Verification
After deploying, check the Netlify build logs to ensure there are no more dependency errors. The serverless functions should now be able to load all required modules.

## Prevention for Future Updates
When adding new serverless functions or modifying existing ones:
1. Make sure all imported modules are listed in the top-level package.json
2. If you see "Cannot find module" errors in Netlify logs, check if the module is listed in package.json
