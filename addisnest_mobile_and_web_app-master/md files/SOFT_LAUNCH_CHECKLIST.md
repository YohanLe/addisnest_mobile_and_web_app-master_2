# Addisnest.com Soft Launch Checklist

Use this actionable checklist to execute your soft launch plan for addisnest.com. Check off items as you complete them.

## Pre-Launch Tasks

- [ ] **Review Environment Configuration**
  - [ ] Verify API endpoint in `.env.production` is correct and working
  - [ ] Ensure all environment variables are properly set

- [ ] **Test Deployment to Staging**
  - [ ] Run `netlify deploy` (without `--prod` flag) to create a draft URL
  - [ ] Test all functionality on the draft URL using this checklist:
    - [ ] Homepage loads correctly
    - [ ] User registration works
    - [ ] User login works
    - [ ] Property search functions properly
    - [ ] Property listing details display correctly
    - [ ] Property image uploads work
    - [ ] Contact forms submit successfully
    - [ ] User profile management works
    - [ ] Mobile view renders appropriately

- [ ] **Prepare Feedback Collection System**
  - [ ] Create a feedback form (Google Forms, Typeform, etc.)
  - [ ] Set up a system to track reported issues (Trello, GitHub, etc.)
  - [ ] Prepare a template email for inviting test users

## Launch Day Tasks

- [ ] **Deploy to Production**
  - [ ] Run `deploy-to-netlify.bat` (or `./deploy-to-netlify.sh` on Unix/Linux/Mac)
  - [ ] Confirm deployment was successful
  - [ ] Note the Netlify URL provided after deployment

- [ ] **Configure Limited Access**
  - [ ] Choose your access limitation method:
    - [ ] Option A: Set up password protection
    - [ ] Option B: Create beta.addisnest.com subdomain

- [ ] **Connect Custom Domain**
  - [ ] In Netlify dashboard, go to Site settings > Domain management
  - [ ] Add custom domain (either addisnest.com or beta.addisnest.com)
  - [ ] Configure DNS settings as directed by Netlify
  - [ ] Verify SSL certificate is provisioned (may take up to 24 hours)

- [ ] **Final Verification**
  - [ ] Check that the site loads at your chosen domain
  - [ ] Verify access restrictions are working
  - [ ] Test core functionality on the production site

## User Testing Phase Tasks

- [ ] **Invite Initial Test Users**
  - [ ] Send invitation emails to your first small group (5-10 users)
  - [ ] Provide access instructions and feedback guidelines
  - [ ] Confirm users have successfully accessed the site

- [ ] **Daily Monitoring (Days 1-3)**
  - [ ] Check Netlify logs for errors
  - [ ] Review any submitted feedback
  - [ ] Address critical issues immediately
  - [ ] Document non-critical issues for later sprints

- [ ] **First Iteration (End of Week 1)**
  - [ ] Compile feedback from initial users
  - [ ] Prioritize issues to address
  - [ ] Deploy fixes for critical issues
  - [ ] Update documentation based on common questions

- [ ] **Expand Test Group**
  - [ ] Invite second group of users (10-20 more)
  - [ ] Update feedback form if needed based on initial responses
  - [ ] Schedule individual feedback sessions with key users

- [ ] **Second Iteration (End of Week 2)**
  - [ ] Deploy additional improvements
  - [ ] Update all users on changes made
  - [ ] Gather feedback on the improvements

## Pre-Public Launch Tasks

- [ ] **Final Preparations**
  - [ ] Address all critical and high-priority issues
  - [ ] Finalize user documentation
  - [ ] Prepare launch announcement materials
  - [ ] Set up analytics tracking

- [ ] **Remove Access Restrictions**
  - [ ] Disable password protection or
  - [ ] Set up redirects from beta subdomain to main domain

- [ ] **Launch Announcement**
  - [ ] Send announcement to all stakeholders
  - [ ] Post on social media and other channels
  - [ ] Ensure customer support is ready for inquiries

## Post-Launch Evaluation

- [ ] **Conduct Retrospective Meeting**
  - [ ] Review what worked well in the soft launch
  - [ ] Identify improvements for future releases
  - [ ] Document lessons learned

- [ ] **Analyze Initial Metrics**
  - [ ] Review user engagement statistics
  - [ ] Analyze any drop-off points in user journeys
  - [ ] Identify areas for immediate optimization

- [ ] **Plan Next Development Sprint**
  - [ ] Prioritize features based on soft launch feedback
  - [ ] Schedule next release cycle
