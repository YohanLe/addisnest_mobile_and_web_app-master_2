# Fixing Login Issues in Netlify: Environment Variable Changes

Based on your `.env` file, I can see several configuration values that need to be updated in your Netlify deployment to fix the login issues.

## Critical Environment Variables to Update

Your current development environment is configured to use local servers and resources, but these won't work when deployed to Netlify. Here are the specific changes needed:

### 1. API Base URL (Most Important for Login)

**Current setting:**
```
VITE_API_BASE_URL=http://localhost:7000/api
```

**Problem:** 
Your deployed Netlify site can't connect to "localhost" as that would refer to Netlify's servers, not your backend API.

**Solution:**
Change this to your actual backend API URL. If your API is deployed to a service like Heroku, Render, Railway, etc., use that URL:

```
VITE_API_BASE_URL=https://your-backend-api-url.com/api
```

### 2. MongoDB Connection

**Current setting:**
```
MONGO_URI=mongodb://localhost:27017/addisnest
```

**Problem:**
If your Netlify deployment needs to connect directly to MongoDB (uncommon for frontend-only deployments), it can't use localhost.

**Solution:**
Use a cloud MongoDB instance (Atlas) or your production database URL:

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/addisnest
```

**Note:** For frontend-only deployments, this variable is typically not needed in Netlify as database connections should be handled by your backend API.

### 3. File Upload Settings

**Current settings:**
```
FILE_UPLOAD_PATH=./uploads
FILE_UPLOAD_BASE_URL=http://localhost:7000
```

**Problem:**
Similar to the API URL, these localhost references won't work in production.

**Solution:**
Update to production URLs where your uploaded files will be stored/served from:

```
FILE_UPLOAD_BASE_URL=https://your-backend-api-url.com
```

## How to Update Environment Variables in Netlify

1. Go to your Netlify dashboard
2. Select your site (sparkling-dodol-ebc74c)
3. Go to **Site settings** > **Build & deploy** > **Environment**
4. Click **Edit variables**
5. Add/update each variable with the production values
6. Click **Save**
7. Trigger a new deployment for the changes to take effect

## Frontend vs. Backend Variables

Some of these environment variables are only needed on your backend server, not in your Netlify frontend deployment:

- Only needed for frontend: `VITE_API_BASE_URL`
- Typically only needed for backend: `PORT`, `MONGO_URI`, `JWT_SECRET`, `FILE_UPLOAD_PATH`

For a typical React/Vite frontend deployment to Netlify, you might only need to set `VITE_API_BASE_URL` in your Netlify environment settings.

## After Updating Environment Variables

1. Redeploy your site using the Netlify dashboard
2. Clear your browser cache or try in an incognito window
3. Test the login functionality again

This should resolve your login issues by connecting your frontend to your actual backend API instead of trying to reach localhost.
