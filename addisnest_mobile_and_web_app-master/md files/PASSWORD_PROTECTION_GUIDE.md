# Setting Up Password Protection for Addisnest.com Soft Launch

This guide provides step-by-step instructions for setting up password protection on your Netlify-deployed site to control access during the soft launch phase.

## Instructions for Password Protection via Netlify Dashboard

1. **Log in to Netlify**
   - Go to [https://app.netlify.com/](https://app.netlify.com/)
   - Sign in with your Netlify account credentials

2. **Navigate to Your Site**
   - From the dashboard, click on the site you just deployed (addisnest)
   - This will take you to your site's overview page

3. **Access Site Settings**
   - In the top navigation menu of your site's dashboard, click on "Site settings"
   - This will take you to the general settings page for your site

4. **Set Up Password Protection**
   - In the left sidebar menu, scroll down and click on "Access control"
   - Under the "Password protection" section, click on the toggle to enable it
   - You will be prompted to create a password
   - Enter a secure password that you can share with your test users
   - Click "Save" to apply the password protection

5. **Test the Password Protection**
   - Visit your site's URL in a private/incognito browser window
   - You should be prompted for a password before accessing the site
   - Enter the password you set to verify it works correctly

6. **Share Access with Test Users**
   - Use the templates in `USER_INVITATION_TEMPLATE.md` to invite your test users
   - Include the site URL and password in your invitation
   - Remind users not to share the password with others outside the test group

## Important Notes

- Password protection applies to the entire site, not individual pages
- All test users will use the same password (this is a limitation of Netlify's basic password protection)
- If you need to change the password later:
  - Go back to Site settings > Access control
  - Click "Change password" in the password protection section
  - Enter and save the new password
  - Update all test users with the new password

## Security Considerations

- Netlify's password protection is suitable for basic access control during a soft launch
- It is not intended for high-security applications
- Do not use a password that you use for other important accounts
- Consider changing the password periodically during the soft launch phase
- Remember to disable password protection when you're ready for public launch

## Troubleshooting

If users report issues accessing the site with the password:

1. Verify the password is correct (case-sensitive)
2. Ensure they are entering the password exactly as provided
3. Check if the password protection is still enabled in your Netlify dashboard
4. Try clearing browser cache and cookies, then attempting again
5. If issues persist, you can temporarily disable and re-enable password protection

## Next Steps After Setting Up Password Protection

1. Send invitations to your initial test group (5-10 users)
2. Set up a feedback collection system (form, email, etc.)
3. Begin monitoring site usage and collecting feedback
4. Make improvements based on initial feedback
5. Expand to a larger test group when ready
