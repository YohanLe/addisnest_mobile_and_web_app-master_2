# Setting Up Environment Variables in Netlify

This guide will help you properly configure your environment variables in Netlify to ensure your application can connect to your backend API and other services correctly.

## Why Environment Variables Matter

For your deployed application to function properly, especially features like login, it needs access to the same environment variables you use in development. These might include:

- API URLs
- Authentication tokens or keys
- Service endpoints
- Database connection strings

## Checking Your Local Environment Variables

First, identify all the environment variables your application uses:

1. Check your local `.env` file(s)
2. Look for any `import.meta.env`, `process.env`, or similar references in your code
3. Make note of any variables that might be needed for authentication

## Setting Up Environment Variables in Netlify

1. **Access Environment Variables Section**:
   - Log in to your Netlify dashboard
   - Select your site (sparkling-dodol-ebc74c)
   - Click on **Site settings**
   - In the left sidebar, go to **Build & deploy** > **Environment**

2. **Add Environment Variables**:
   - Click the **Edit variables** button
   - Add each environment variable from your local development setup
   - Pay special attention to API URLs (they should point to your production backend)
   - For each variable, enter the key (e.g., `REACT_APP_API_URL`) and the value

3. **Key Variables to Check**:
   - Backend API URL (e.g., `REACT_APP_API_URL`, `VITE_API_URL`)
   - Authentication service endpoints
   - JWT or authentication secrets (if needed by your frontend)
   - Any third-party service keys

## Special Considerations for React and Vite

- **React** environment variables must be prefixed with `REACT_APP_`
- **Vite** environment variables must be prefixed with `VITE_`
- Variable names are case-sensitive

## Verifying Your Environment Variables

After setting up your environment variables:

1. **Redeploy Your Site**:
   - Go to the **Deploys** tab in your Netlify dashboard
   - Click **Trigger deploy** > **Deploy site**

2. **Check Browser Console**:
   - Open your deployed site
   - Open browser developer tools (F12 or right-click > Inspect)
   - Go to the Console tab
   - Look for any errors related to environment variables or API connections
   - You might see messages like "Cannot read property 'X' of undefined" or "Failed to fetch" if there are issues

3. **Add Temporary Debugging Code**:
   
   You can temporarily add code like this to your application to check if environment variables are loaded:

   ```javascript
   // For React
   console.log("API URL:", process.env.REACT_APP_API_URL);
   
   // For Vite
   console.log("API URL:", import.meta.env.VITE_API_URL);
   ```

## Troubleshooting Common Issues

1. **Wrong API URL Format**:
   - Make sure your API URL includes the protocol (https:// or http://)
   - Double-check for typos in the domain or path
   - Ensure any path suffixes are correct (/api/v1, etc.)

2. **CORS Issues**:
   - Your backend needs to allow requests from your Netlify domain
   - Add `https://sparkling-dodol-ebc74c.netlify.app` to your backend's CORS allowed origins

3. **Missing Variables**:
   - If you've added variables but they're not working, try rebuilding the site from scratch
   - Netlify only uses environment variables that were present during build time

4. **Environment Variable Not Available**:
   - If your variable is available during build but not at runtime, make sure it's properly exposed to the browser
   - Not all environment variables are automatically available in the browser for security reasons

## Security Best Practices

- Never expose sensitive secrets directly to the browser
- Use Netlify Functions for operations requiring sensitive credentials
- Consider using environment-specific variable values (different values for development vs. production)
