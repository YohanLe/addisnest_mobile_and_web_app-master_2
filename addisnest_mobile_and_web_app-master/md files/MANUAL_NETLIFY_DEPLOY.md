# Manual Netlify Deployment Guide for Addisnest Soft Launch

Since we're experiencing some issues with the Netlify CLI, this guide provides steps to deploy your Addisnest site manually through the Netlify web interface.

## Manual Deployment Steps

1. **Log in to Netlify**
   - Go to [https://app.netlify.com/](https://app.netlify.com/)
   - Sign in with your Netlify account credentials (or create an account if you don't have one)

2. **Create a New Site**
   - Click the "Add new site" button
   - Select "Deploy manually" from the dropdown menu

3. **Upload Your Site Files**
   - Drag and drop your entire `dist` folder onto the deployment area
   - Alternatively, click "Browse to upload" and navigate to select your `dist` folder
   - Wait for the files to upload (this may take a few minutes depending on your internet connection)

4. **Configure Your Site Settings**
   - After the upload completes, Netlify will automatically deploy your site and provide a unique URL
   - Click on "Site settings" to access additional configuration options

5. **Set Up Password Protection for Soft Launch**
   - In the left sidebar menu, scroll down and click on "Access control"
   - Under the "Password protection" section, click on the toggle to enable it
   - Create a password that you'll share with your test users
   - Click "Save" to apply the password protection

6. **Configure Custom Domain (Optional for Initial Soft Launch)**
   - In the left sidebar menu, click on "Domain management"
   - Click "Add custom domain"
   - Enter your domain (either addisnest.com or beta.addisnest.com for soft launch)
   - Follow the instructions to configure your DNS settings

## Verifying Your Deployment

1. **Check Your Site**
   - Visit the Netlify-provided URL to ensure your site is working correctly
   - Test the password protection by opening the site in an incognito/private browser window
   - Verify key functionality works as expected

2. **Deploy Status**
   - On your Netlify dashboard, you can view deployment status and history
   - Check for any errors or warnings that might need to be addressed

## Updating Your Site

When you need to make updates during the soft launch phase:

1. Make your changes locally
2. Rebuild your site (`npm run build`)
3. Return to your site's Netlify dashboard
4. Click "Deploys" in the top navigation
5. Drag and drop your updated `dist` folder onto the deployment area
6. Netlify will create a new deployment with your changes

## Setting Up Redirects

Ensure your site handles client-side routing correctly:

1. Verify that your `dist` folder contains a `_redirects` file with this content:
   ```
   /*  /index.html  200
   ```
2. If this file is missing, create it in your `dist` folder before uploading

## Monitoring During Soft Launch

1. Use Netlify Analytics (if available on your plan) to monitor site usage
2. Check deployment logs for any errors
3. Gather feedback from your test users as outlined in the soft launch plan

## Next Steps

After your site is successfully deployed with password protection:

1. Follow the steps in SOFT_LAUNCH_CHECKLIST.md to proceed with your soft launch
2. Invite your initial test users using templates from USER_INVITATION_TEMPLATE.md
3. Begin collecting feedback and monitoring site performance
