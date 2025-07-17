# Property POST API Fix

## Issue Summary

The application was encountering a 404 error when trying to post property data to the Netlify functions:

```
Calling Api.postWithtoken with "properties" and formattedData...
/.netlify/functions/api/properties:1 Failed to load resource: the server responded with a status of 404 ()
```

## Root Cause

The issue occurred because:

1. The front-end code was attempting to make POST requests to `/.netlify/functions/api/properties`
2. While GET requests were properly set up and working via the dedicated `properties.js` function, POST requests were not implemented
3. The existing _redirects file was redirecting `/properties` to `/.netlify/functions/properties`, but the properties.js function didn't have a POST handler

## Solution Implemented

### 1. Added POST endpoint to functions/properties.js

Added a POST handler to the properties.js serverless function that:
- Accepts both creating new properties and updating existing ones
- Connects to MongoDB
- Performs proper error handling and logging

### 2. Enhanced netlifyApiHandler.js

- Added debug logging for API configuration
- Implemented a new `postProperty` function that works in both local and Netlify environments
- Exports the new function to be used by other components

### 3. Updated Api.js to use the dedicated handler

- Imported the propertyApi from netlifyApiHandler.js
- Added special handling in the `postWithtoken` method to route 'properties' requests to the dedicated handler
- Improved error handling and logging

## How It Works

Now when the application makes a call to `Api.postWithtoken('properties', data)`:

1. The `postWithtoken` method in Api.js detects it's a properties request
2. It calls `propertyApi.postProperty(data)` from netlifyApiHandler.js
3. The netlifyApiHandler determines the correct URL based on the environment
   - In Netlify: `/properties` (which is redirected to `/.netlify/functions/properties`)
   - In local dev: `http://localhost:7000/api/properties`
4. The request is sent to the appropriate endpoint
5. The properties.js function processes the POST request and interacts with MongoDB

## Testing

To verify the fix is working:
1. Deploy the updated code to Netlify
2. Try creating or updating a property
3. Check the Netlify function logs for successful POST requests
4. Confirm the property is saved in the MongoDB database

## Related Files Modified

1. `functions/properties.js` - Added POST endpoint
2. `src/utils/netlifyApiHandler.js` - Added postProperty function
3. `src/Apis/Api.js` - Updated postWithtoken to use the specialized handler for properties
