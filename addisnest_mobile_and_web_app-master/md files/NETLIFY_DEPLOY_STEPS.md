# Netlify Manual Deployment Steps with Screenshots

Based on the screenshot you shared, here's how to proceed with manually deploying your site:

## Step 1: Access the Manual Deployment Option

I can see you're already on the Netlify dashboard at app.netlify.com/teams/yohanb1212/projects.

Look at the bottom section of your screen that says "...or deploy manually" - this is what you'll use for deployment without connecting to Git.

## Step 2: Upload Your Site Files

1. You can either:
   - Drag and drop your entire `dist` folder directly onto the deployment area shown in the screenshot (the large empty space where it says "Drag and drop your project output folder here")
   - OR click the "browse to upload" link visible in the screenshot

2. Navigate to the `dist` folder in your project (c:/Users/yohan/Desktop/final_addinest_code/dist)

3. Select the entire folder and upload it

## Step 3: Wait for Deployment

After uploading, Netlify will automatically deploy your site and provide a unique URL.

## Step 4: Set Up Password Protection

1. Once deployed, click on your new site in the Netlify dashboard
2. Go to Site settings > Access control
3. Enable password protection
4. Create a password and save it

## Step 5: Share with Test Users

Use the templates in USER_INVITATION_TEMPLATE.md to invite your initial test users.

Remember to include:
- The Netlify-provided URL
- The password you created
- Instructions for providing feedback
