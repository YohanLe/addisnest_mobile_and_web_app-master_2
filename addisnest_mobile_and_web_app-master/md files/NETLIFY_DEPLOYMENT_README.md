# Deploying to addisnest.com via Netlify

This README explains how to deploy the Addinest Real Estate Platform to Netlify and connect it to the addisnest.com domain.

## Deployment Files

The following files have been prepared to streamline the deployment process:

- **deploy-to-netlify.bat** - Windows batch script for deployment
- **deploy-to-netlify.sh** - Unix/Linux/Mac shell script for deployment
- **_redirects** - Netlify configuration for client-side routing
- **netlify.toml** - Netlify build and redirect configuration
- **DEPLOYMENT_GUIDE.md** - Comprehensive deployment guide with detailed steps

## Quick Deployment Steps

1. The project has already been built, and the output is in the `dist` directory.

2. Deploy to Netlify using the prepared script:
   ```
   # On Windows
   deploy-to-netlify.bat
   
   # On Unix/Linux/Mac (make executable first)
   chmod +x deploy-to-netlify.sh
   ./deploy-to-netlify.sh
   ```

3. When prompted for the publish directory, confirm `dist`.

4. After deployment, Netlify will provide a unique URL where your site is live (something like `random-name.netlify.app`).

## Connecting Your Custom Domain

1. Log into the Netlify dashboard at [app.netlify.com](https://app.netlify.com)
2. Select your newly deployed site
3. Go to Site settings > Domain management > Domains > Add custom domain
4. Enter `addisnest.com` and follow the on-screen instructions

### DNS Configuration Options

**Option 1: Using Netlify DNS (Recommended)**
- In your Netlify site dashboard, go to Domain settings
- Select "Set up Netlify DNS" and follow the instructions
- Update your domain's nameservers at your registrar to the ones provided by Netlify

**Option 2: Using External DNS**
- Add a CNAME record for `www.addisnest.com` pointing to your Netlify site URL
- For the apex domain (addisnest.com), add an A record pointing to Netlify's load balancer: `75.2.60.5`

## Troubleshooting

If you encounter any issues during deployment:

1. Check the Netlify deployment logs for error messages
2. Verify that the `_redirects` file is correctly set up in the dist directory
3. Ensure your domain's DNS settings are properly configured

## Additional Resources

For more comprehensive instructions, refer to the included `DEPLOYMENT_GUIDE.md` file.

For Netlify-specific questions, refer to [Netlify's documentation](https://docs.netlify.com/).
