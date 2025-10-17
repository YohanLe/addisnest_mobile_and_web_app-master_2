# EC2 SSH and Deployment Fix Guide

## Issues Identified from Your Output

1. **SSH Key Issue**: `Identity file your-key.pem not accessible`
2. **Directory Issue**: `cd: addisnest_mobile_and_web_app: No such file or directory`
3. **Git Authentication**: Asking for GitHub username

## Solution Steps

### Step 1: Fix SSH Connection

You have a few options for SSH:

#### Option A: If you have the SSH key file
```bash
# Find your SSH key file (it might be named differently)
ls ~/.ssh/
# Or check if it's in your current directory
ls *.pem

# Use the correct key file name
ssh -i /path/to/your-actual-key.pem ubuntu@3.144.240.220
```

#### Option B: If you don't have the SSH key
```bash
# Try connecting without specifying a key (if password auth is enabled)
ssh ubuntu@3.144.240.220
```

#### Option C: Alternative connection methods
- Use AWS Systems Manager Session Manager if available
- Use EC2 Instance Connect from AWS Console
- Reset/create new SSH key pair in AWS Console

### Step 2: Find Your Application Directory

Once connected to EC2, find where your application is located:

```bash
# Check current directory
pwd

# Look for your application
ls -la
find / -name "*addisnest*" -type d 2>/dev/null
find /home -name "*addisnest*" -type d 2>/dev/null
find /var/www -name "*addisnest*" -type d 2>/dev/null

# Check if it's in a different name
ls -la | grep -i nest
ls -la | grep -i addis
```

### Step 3: Check Current PM2 Processes

```bash
# Check what's currently running
pm2 list
pm2 status

# Check if there are any Node.js processes
ps aux | grep node
```

### Step 4: Navigate to Correct Directory

Based on what you find, navigate to your app directory:
```bash
# Example possibilities:
cd /home/ubuntu/addisnest_mobile_and_web_app
# OR
cd /var/www/addisnest_mobile_and_web_app
# OR
cd ~/addisnest_mobile_and_web_app
# OR whatever directory you found
```

### Step 5: Update Your Application

Once in the correct directory:

```bash
# Check current git status
git status
git remote -v

# Pull latest changes (you may need to authenticate)
git pull origin main

# If git asks for credentials, you can:
# Option A: Use personal access token
# Username: your-github-username
# Password: your-github-personal-access-token

# Option B: Or clone fresh if needed
cd ..
git clone https://github.com/YohanLe/addisnest_mobile_and_web_app.git
cd addisnest_mobile_and_web_app
```

### Step 6: Deploy the Fixed Server

```bash
# Stop current server (use whatever name it's running under)
pm2 stop all
pm2 delete all

# Or if you know the specific name:
pm2 stop addisnest-app
pm2 delete addisnest-app

# Install dependencies
npm install

# Start with the new fixed server
pm2 start server-production-fixed.js --name addisnest-app
pm2 save

# Check logs
pm2 logs addisnest-app --lines 30
```

## Alternative: Manual File Upload

If git pull doesn't work, you can manually upload the fixed server file:

### Option A: Using SCP (if you have SSH key)
```bash
# From your local machine
scp -i your-key.pem server-production-fixed.js ubuntu@3.144.240.220:/path/to/your/app/
```

### Option B: Copy-paste method
1. SSH into your EC2 instance
2. Navigate to your app directory
3. Create the new file:
```bash
nano server-production-fixed.js
```
4. Copy the entire content from your local `server-production-fixed.js` file
5. Paste it into the nano editor
6. Save with Ctrl+X, then Y, then Enter

## Troubleshooting Commands

```bash
# Check what's running on port 3000
sudo netstat -tlnp | grep :3000
sudo lsof -i :3000

# Check system resources
free -h
df -h
htop

# Check if MongoDB is running (if using local MongoDB)
sudo systemctl status mongod

# Check environment variables
cat .env
```

## Quick Test Commands

Once deployed:
```bash
# Test locally on EC2
curl http://localhost:3000/health
curl http://localhost:3000/api/properties/count

# Test from outside
curl http://3.144.240.220:3000/health
curl http://3.144.240.220:3000/api/properties/count
```

## Expected Success Output

When `pm2 logs addisnest-app` runs successfully, you should see:
```
✓ Agent routes loaded
✓ User routes loaded
✓ Auth routes loaded
✓ Property count routes loaded
✓ Property routes loaded
...
✓ Mounted /api/agents
✓ Mounted /api/users
✓ Mounted /api/auth
✓ Mounted /api/properties/count
✓ Mounted /api/properties
...
All available routes mounted successfully!
Server startup complete!
```

## If You Still Can't Access EC2

### Option 1: Use AWS Console
1. Go to AWS EC2 Console
2. Select your instance
3. Click "Connect" 
4. Use "EC2 Instance Connect" (browser-based SSH)

### Option 2: Reset SSH Access
1. Stop your EC2 instance
2. Create a new key pair in AWS Console
3. Attach the new key pair to your instance
4. Start the instance
5. Use the new key to connect

### Option 3: Use AWS Systems Manager
If SSM is enabled on your instance:
```bash
aws ssm start-session --target i-your-instance-id
```

## Summary

The main issue is that your EC2 API routes aren't working. I've created a fixed server file that will resolve this. The steps are:

1. **Get SSH access** to your EC2 instance (using one of the methods above)
2. **Find your app directory** (likely `/home/ubuntu/` or `/var/www/`)
3. **Update the code** (git pull or manual copy)
4. **Deploy the fixed server** (`pm2 start server-production-fixed.js`)
5. **Test the fix** (curl the API endpoints)

The fixed server will show detailed logs about which routes load successfully, making it easy to identify and resolve any remaining issues.
