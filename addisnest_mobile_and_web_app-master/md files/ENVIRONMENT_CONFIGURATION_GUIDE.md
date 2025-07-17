# Environment Configuration Guide for Addisnest.com Soft Launch

This guide provides a detailed walkthrough for properly configuring your environment variables before deploying addisnest.com for a soft launch.

## Step 1: Locate Your Environment Files

First, locate the environment configuration files in your project:

```
.env.production      # Main production environment file
.env.example         # Example environment template with required variables
```

## Step 2: Review .env.production Settings

1. Open the `.env.production` file in your editor:

   ```bash
   # Windows
   notepad .env.production
   
   # Unix/Linux/Mac
   nano .env.production
   ```

2. Currently, your `.env.production` file contains:

   ```
   VITE_API_BASE_URL=https://addinest-api-demo.netlify.app/.netlify/functions/api
   VITE_APP_ENV=production
   VITE_APP_TITLE=Addinest Real Estate Platform
   ```

3. Review each variable to ensure it's correct:

   - **VITE_API_BASE_URL**: This points to your backend API. For a soft launch, confirm:
     - Is this the correct API endpoint you want to use?
     - For the soft launch, you might be using a staging API instead of production
     - If you need to use a different API endpoint, update this value

   - **VITE_APP_ENV**: This should remain "production" for the soft launch
   
   - **VITE_APP_TITLE**: This is the application title, which should be correct

4. Check if there are any missing environment variables by comparing with `.env.example`:

   ```bash
   # Compare the files to see if .env.production is missing any required variables
   # Windows
   type .env.example
   
   # Unix/Linux/Mac
   cat .env.example
   ```

## Step 3: Verify the API Endpoint

1. Test if the API endpoint is operational:

   ```bash
   curl https://addinest-api-demo.netlify.app/.netlify/functions/api/health
   # or
   curl https://addinest-api-demo.netlify.app/.netlify/functions/api
   ```

   You should receive a successful response. If you get an error, the API might not be ready.

2. If you need to set up your own API endpoint:

   - Deploy your backend API to Netlify or your preferred hosting service
   - Update the `VITE_API_BASE_URL` in `.env.production` to point to your new API
   - Test the new endpoint to ensure it's responding correctly

## Step 4: Update Environment Variables (If Needed)

If you need to make changes to `.env.production`:

1. Open the file in your editor
2. Make the necessary changes
3. Save the file

Example of an updated file:

```
VITE_API_BASE_URL=https://your-new-api-endpoint.netlify.app/.netlify/functions/api
VITE_APP_ENV=production
VITE_APP_TITLE=Addinest Real Estate Platform
```

## Step 5: Test Environment Configuration

1. Build your application with the updated environment variables:

   ```bash
   npm run build
   ```

2. Verify the build process completes without errors

3. Deploy to a staging environment to test:

   ```bash
   netlify deploy
   ```

4. Test the deployed staging site to ensure it correctly connects to your API

## Step 6: Secure Sensitive Information

If your `.env.production` file contains sensitive information:

1. Ensure it's included in your `.gitignore` file to prevent accidental commits
2. Consider using Netlify environment variables for sensitive information:
   - Go to Netlify dashboard > Site settings > Build & deploy > Environment
   - Add your variables there instead of in the `.env.production` file

## Step 7: Finalize for Deployment

Once you've confirmed all environment variables are correct:

1. Rebuild your application if you made any changes:

   ```bash
   npm run build
   ```

2. Your environment is now configured and ready for soft launch deployment

## API Endpoint Verification Checklist

Before proceeding with deployment, verify that your API endpoint:

- [ ] Is accessible (returns a 200 status code when queried)
- [ ] Handles authentication correctly (if applicable)
- [ ] Can process property data retrieval
- [ ] Can process user registration and login
- [ ] Has proper error handling
- [ ] Has sufficient capacity for your expected soft launch traffic

## Troubleshooting Common Issues

### API Connection Failures

If the frontend can't connect to the API:

1. Verify the API URL is correct in `.env.production`
2. Check if the API server is running
3. Test API endpoints directly using curl or Postman
4. Check for CORS issues if receiving related errors in browser console

### Environment Variables Not Loading

If environment variables aren't being applied correctly:

1. Ensure you've rebuilt the application after changing `.env.production`
2. Verify variables are prefixed with `VITE_` (required for client-side access)
3. Check the Netlify build logs to see if environment variables are being properly injected

### API Rate Limiting

If you're experiencing API rate limiting during testing:

1. Implement appropriate rate limiting for your soft launch users
2. Consider increasing limits temporarily for testing purposes
3. Monitor API usage during the soft launch phase
