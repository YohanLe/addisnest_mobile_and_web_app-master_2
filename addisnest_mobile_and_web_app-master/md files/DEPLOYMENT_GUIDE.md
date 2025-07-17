# Addinest Deployment Guide

This comprehensive guide explains how to deploy the Addinest Real Estate Platform to Netlify and connect it to the addisnest.com domain.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Build Process](#build-process)
3. [Deployment to Netlify](#deployment-to-netlify)
   - [Using the Automated Scripts](#using-the-automated-scripts)
   - [Manual Deployment](#manual-deployment)
4. [Domain Configuration](#domain-configuration)
   - [Option 1: Using Netlify DNS](#option-1-using-netlify-dns)
   - [Option 2: Using External DNS](#option-2-using-external-dns)
5. [Post-Deployment Verification](#post-deployment-verification)
6. [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying, ensure you have:

- Node.js and npm installed
- Git installed (optional but recommended)
- A Netlify account (create one at [netlify.com](https://netlify.com) if needed)
- Ownership of the addisnest.com domain or appropriate access to configure it

## Build Process

The Addinest platform is a React application that needs to be built before deployment. The build process has already been completed, and the output is in the `dist` directory.

Key files in the `dist` directory:
- `index.html`: The main HTML entry point
- `assets/`: Contains compiled JavaScript and CSS files
- `_redirects`: Netlify configuration for client-side routing
- `netlify.toml`: Configuration for Netlify build settings and redirects

## Deployment to Netlify

### Using the Automated Scripts

For convenience, we've provided scripts that automate the deployment process.

#### Windows Users:

1. Open Command Prompt or PowerShell
2. Navigate to the project directory
3. Run the deployment script:
   ```
   deploy-to-netlify.bat
   ```
4. Follow the prompts in the terminal

#### Unix/Linux/Mac Users:

1. Open Terminal
2. Navigate to the project directory
3. Make the script executable:
   ```
   chmod +x deploy-to-netlify.sh
   ```
4. Run the script:
   ```
   ./deploy-to-netlify.sh
   ```
5. Follow the prompts in the terminal

### Manual Deployment

If you prefer to deploy manually:

1. Install the Netlify CLI globally:
   ```
   npm install -g netlify-cli
   ```

2. Log in to your Netlify account:
   ```
   netlify login
   ```

3. Initialize a new Netlify site:
   ```
   netlify init
   ```
   - Select "Create & configure a new site"
   - Choose your team
   - Enter a site name or press enter for a random name
   - When asked for the build command, enter: `npm run build`
   - When asked for the directory to deploy, enter: `dist`

4. Deploy to production:
   ```
   netlify deploy --prod
   ```

5. Your site will be deployed, and the CLI will provide a URL to access it.

## Domain Configuration

### Option 1: Using Netlify DNS (Recommended)

1. Log in to the [Netlify Dashboard](https://app.netlify.com/)
2. Select your site
3. Go to Site settings > Domain management > Domains > Add custom domain
4. Enter `addisnest.com` and click "Verify"
5. Select "Yes, add domain" to add your apex domain
6. Click "Set up Netlify DNS for addisnest.com"
7. Follow the instructions to configure nameservers at your domain registrar
   - Typically, you'll need to replace your current nameservers with Netlify's nameservers
   - This may take up to 24 hours to propagate

### Option 2: Using External DNS

If you prefer to keep your current DNS provider:

1. Log in to the [Netlify Dashboard](https://app.netlify.com/)
2. Select your site
3. Go to Site settings > Domain management > Domains > Add custom domain
4. Enter `addisnest.com` and follow the verification steps
5. In your DNS provider's dashboard, configure:
   - For the apex domain (addisnest.com): Add an A record pointing to Netlify's load balancer IP address: `75.2.60.5`
   - For the www subdomain: Add a CNAME record for `www.addisnest.com` pointing to your Netlify site URL (e.g., `your-site-name.netlify.app`)

6. Back in Netlify, set up domain redirects to ensure that both addisnest.com and www.addisnest.com work:
   - Go to Site settings > Domain management > Custom domains
   - Select "Set up a domain redirect" if needed

## Post-Deployment Verification

After deployment and domain configuration, verify:

1. Your site is accessible at the Netlify URL (e.g., `your-site-name.netlify.app`)
2. Your site is accessible at addisnest.com (once DNS propagation is complete)
3. All site functionality works as expected, including:
   - Navigation and routing
   - Forms and submission processes
   - Image loading
   - API connections

## Troubleshooting

### Common Issues and Solutions

1. **Broken links or routing issues after deployment**
   - Ensure the `_redirects` file is properly set up in the `dist` directory
   - Check that the Netlify configuration includes the redirect rule: `/*  /index.html  200`

2. **Custom domain not working**
   - Verify that DNS is correctly configured
   - Check if DNS propagation is complete (can take up to 24-48 hours)
   - Ensure SSL certificate is provisioned (Netlify handles this automatically)

3. **Missing assets or styles**
   - Ensure all assets are properly referenced with correct paths
   - Verify that all required files were included in the build output

4. **Form submissions not working**
   - If using Netlify Forms, ensure forms have the `netlify` attribute
   - Check Netlify Form settings in the dashboard

### Getting Help

If you encounter issues not covered in this guide:

1. Check the [Netlify documentation](https://docs.netlify.com/)
2. Visit the Netlify Community forum
3. Review the Netlify status page for service disruptions
4. Contact the development team for application-specific issues
