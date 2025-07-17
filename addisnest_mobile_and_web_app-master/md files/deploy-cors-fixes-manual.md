# Manual Deployment Steps for CORS Fixes

The automated deployment script encountered some issues with the build process. Follow these manual steps to deploy the CORS fixes to Netlify:

## 1. Git Push (Already Completed)

You've already committed and pushed the changes to GitHub:
```
git add functions/properties.js functions/getListings.js functions/api.js NETLIFY_CORS_FIXES_DOCUMENTATION.md deploy-cors-fixes.bat
git commit -m "Fix CORS policy issues for Netlify deploy previews"
git push origin master
```

## 2. Manual Netlify Deployment

Since the automatic build process encountered issues with Vite, deploy through the Netlify dashboard:

1. Log in to your Netlify dashboard: https://app.netlify.com/
2. Select the "addisnesttest" site
3. Go to the "Deploys" tab
4. Click "Trigger deploy" → "Deploy site"
5. Monitor the deployment progress

## 3. Verify the Fixes

After deployment completes:

1. Visit your main site
2. Check the browser console for any CORS errors
3. If you have a deploy preview URL, test that as well
4. Confirm that property data is loading correctly

## Issues to Watch For

The Netlify build process showed these warnings that should be addressed in a future update:

```
Warning: some redirects have syntax errors:

Could not parse redirect number 1:
  {"from":"/.netlify/functions/getListings","query":{},"to":"/.netlify/functions/getListings","status":200,"force":false,"conditions":{}}
"path" field must not start with "/.netlify"

Could not parse redirect number 2:
  {"from":"/.netlify/functions/api/*","query":{},"to":"/.netlify/functions/api/:splat","status":200,"force":false,"conditions":{}}
"path" field must not start with "/.netlify"
```

These redirect issues don't affect the CORS fixes we implemented but should be fixed in a future update by modifying the redirect rules in `_redirects` or `netlify.toml`.
