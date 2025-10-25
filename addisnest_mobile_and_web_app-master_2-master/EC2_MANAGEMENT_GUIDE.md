# AWS EC2 Management Guide for AddisNest

## Table of Contents
1. [Connecting to EC2](#connecting-to-ec2)
2. [Checking App Status](#checking-app-status)
3. [Starting/Stopping the App](#startingstopping-the-app)
4. [Making Code Changes](#making-code-changes)
5. [Deploying Changes](#deploying-changes)
6. [Common Maintenance Tasks](#common-maintenance-tasks)
7. [Troubleshooting](#troubleshooting)

---

## Connecting to EC2

### From Windows (Using PuTTY or PowerShell)

**Option 1: PowerShell/Command Prompt**
```bash
ssh -i "your-key.pem" ubuntu@34.228.244.224
```

**Option 2: Using PuTTY**
1. Open PuTTY
2. Host Name: `ubuntu@34.228.244.224`
3. Connection > SSH > Auth: Browse to your `.ppk` key file
4. Click "Open"

### Navigate to Project Directory
```bash
cd ~/addisnest_mobile_and_web_app-master_2/addisnest_mobile_and_web_app-master_2-master/addisnest_mobile_and_web_app-master
```

---

## Checking App Status

### Check Backend (Node.js with PM2)
```bash
# View all processes
pm2 status

# View logs
pm2 logs addisnest-app

# View last 50 lines of logs
pm2 logs addisnest-app --lines 50

# View only error logs
pm2 logs addisnest-app --err

# Monitor in real-time
pm2 monit
```

### Check Frontend (Nginx)
```bash
# Check Nginx status
sudo systemctl status nginx

# View Nginx error logs
sudo tail -f /var/log/nginx/error.log

# View Nginx access logs
sudo tail -f /var/log/nginx/access.log
```

### Check MongoDB Connection
```bash
# View backend logs to see MongoDB status
pm2 logs addisnest-app --lines 20 | grep -i mongo
```

### Quick Health Check
```bash
# Test backend API
curl http://localhost:5000/api/properties

# Test frontend
curl http://localhost/
```

---

## Starting/Stopping the App

### Backend (PM2)

**Start the backend:**
```bash
cd ~/addisnest_mobile_and_web_app-master_2/addisnest_mobile_and_web_app-master_2-master/addisnest_mobile_and_web_app-master

# If not running, start with:
pm2 start server.js --name addisnest-app
```

**Restart the backend:**
```bash
# Simple restart
pm2 restart addisnest-app

# Restart with updated environment variables
pm2 restart addisnest-app --update-env

# Restart and clear logs
pm2 restart addisnest-app && pm2 flush
```

**Stop the backend:**
```bash
pm2 stop addisnest-app
```

**Delete from PM2:**
```bash
pm2 delete addisnest-app
```

### Frontend (Nginx)

**Restart Nginx:**
```bash
sudo systemctl restart nginx
```

**Stop Nginx:**
```bash
sudo systemctl stop nginx
```

**Start Nginx:**
```bash
sudo systemctl start nginx
```

**Reload Nginx (graceful, no downtime):**
```bash
sudo systemctl reload nginx
```

---

## Making Code Changes

### Method 1: Edit Directly on EC2 (Quick Changes)

**Using nano (beginner-friendly):**
```bash
cd ~/addisnest_mobile_and_web_app-master_2/addisnest_mobile_and_web_app-master_2-master/addisnest_mobile_and_web_app-master

# Edit a file
nano src/components/home/HomePage.jsx

# Save: Ctrl+O, Enter
# Exit: Ctrl+X
```

**Using vim (advanced):**
```bash
vim src/components/home/HomePage.jsx

# Press 'i' to enter insert mode
# Make changes
# Press 'Esc' then ':wq' to save and exit
```

### Method 2: Edit Locally and Push to GitHub (Recommended)

**On your local machine:**
```bash
# Make changes to your code locally
# Commit and push to GitHub
git add .
git commit -m "Your commit message"
git push origin main
```

**On EC2, pull the changes:**
```bash
cd ~/addisnest_mobile_and_web_app-master_2/addisnest_mobile_and_web_app-master_2-master/addisnest_mobile_and_web_app-master

# Pull latest changes
git pull origin main

# If you have local changes that conflict:
git stash
git pull origin main
git stash pop
```

---

## Deploying Changes

### Backend Changes (Node.js)

**After changing backend code:**
```bash
cd ~/addisnest_mobile_and_web_app-master_2/addisnest_mobile_and_web_app-master_2-master/addisnest_mobile_and_web_app-master

# Restart the backend
pm2 restart addisnest-app --update-env

# View logs to confirm
pm2 logs addisnest-app --lines 20
```

### Frontend Changes (React)

**After changing frontend code:**
```bash
cd ~/addisnest_mobile_and_web_app-master_2/addisnest_mobile_and_web_app-master_2-master/addisnest_mobile_and_web_app-master

# Rebuild the frontend
npm run build

# Set permissions
chmod -R 755 dist

# Reload Nginx
sudo systemctl reload nginx
```

### Full Deployment (Both Backend and Frontend)

```bash
cd ~/addisnest_mobile_and_web_app-master_2/addisnest_mobile_and_web_app-master_2-master/addisnest_mobile_and_web_app-master

# Pull latest code
git pull origin main

# Install any new dependencies
npm install

# Rebuild frontend
npm run build
chmod -R 755 dist

# Restart backend
pm2 restart addisnest-app --update-env

# Reload Nginx
sudo systemctl reload nginx

# Check status
pm2 status
pm2 logs addisnest-app --lines 20
```

---

## Common Maintenance Tasks

### Update Environment Variables

```bash
cd ~/addisnest_mobile_and_web_app-master_2/addisnest_mobile_and_web_app-master_2-master/addisnest_mobile_and_web_app-master

# Edit .env file
nano .env

# Save changes
# Restart with new environment
pm2 restart addisnest-app --update-env
```

### View and Clear Logs

```bash
# View logs
pm2 logs addisnest-app

# Clear all logs
pm2 flush

# Clear logs for specific app
pm2 flush addisnest-app
```

### Update Nginx Configuration

```bash
# Edit Nginx config
sudo nano /etc/nginx/sites-available/addisnest

# Test configuration
sudo nginx -t

# If test passes, reload
sudo systemctl reload nginx
```

### Install New npm Packages

```bash
cd ~/addisnest_mobile_and_web_app-master_2/addisnest_mobile_and_web_app-master_2-master/addisnest_mobile_and_web_app-master

# Install package
npm install package-name

# Restart backend
pm2 restart addisnest-app
```

### Database Backup (Manual)

```bash
# Your MongoDB is on Atlas, so backup through MongoDB Atlas Dashboard:
# 1. Go to https://cloud.mongodb.com
# 2. Select your cluster
# 3. Click "Backup" tab
# 4. Create backup
```

---

## Troubleshooting

### App Not Loading

**Check if backend is running:**
```bash
pm2 status
pm2 logs addisnest-app --lines 50
```

**Check if Nginx is running:**
```bash
sudo systemctl status nginx
```

**Check ports:**
```bash
sudo netstat -tulpn | grep -E ':(80|5000)'
```

### 502 Bad Gateway Error

**This means Nginx can't reach the backend:**
```bash
# Check if backend is running
pm2 status

# Restart backend
pm2 restart addisnest-app

# Check backend logs
pm2 logs addisnest-app --lines 20
```

### Properties Not Showing

**Check MongoDB connection:**
```bash
pm2 logs addisnest-app | grep -i "mongo"
```

**Test API directly:**
```bash
curl http://localhost:5000/api/properties
```

**If API returns data but frontend doesn't show it:**
```bash
# Rebuild frontend
npm run build
chmod -R 755 dist
sudo systemctl reload nginx
```

### High Memory/CPU Usage

**Check resource usage:**
```bash
# Overall system
htop  # or 'top' if htop not installed

# PM2 specific
pm2 monit
```

**Restart if needed:**
```bash
pm2 restart addisnest-app
```

### Can't Connect via SSH

**Check security group in AWS Console:**
1. Go to EC2 Dashboard
2. Select your instance
3. Click "Security" tab
4. Ensure port 22 is open for your IP

### Clean Start (Nuclear Option)

**If everything is broken:**
```bash
# Stop everything
pm2 stop all
sudo systemctl stop nginx

# Clean caches
cd ~/addisnest_mobile_and_web_app-master_2/addisnest_mobile_and_web_app-master_2-master/addisnest_mobile_and_web_app-master
rm -rf node_modules/.vite dist

# Reinstall
npm install
npm run build
chmod -R 755 dist

# Start everything
pm2 restart addisnest-app --update-env
sudo systemctl start nginx

# Check status
pm2 status
sudo systemctl status nginx
```

---

## Quick Reference Commands

### Most Common Commands

```bash
# Navigate to project
cd ~/addisnest_mobile_and_web_app-master_2/addisnest_mobile_and_web_app-master_2-master/addisnest_mobile_and_web_app-master

# Check status
pm2 status

# View logs
pm2 logs addisnest-app

# Restart backend
pm2 restart addisnest-app

# Rebuild frontend
npm run build && chmod -R 755 dist && sudo systemctl reload nginx

# Pull code from GitHub
git pull origin main

# Full deployment
git pull origin main && npm install && npm run build && chmod -R 755 dist && pm2 restart addisnest-app --update-env && sudo systemctl reload nginx
```

---

## Important Directories

```
Project Root:
~/addisnest_mobile_and_web_app-master_2/addisnest_mobile_and_web_app-master_2-master/addisnest_mobile_and_web_app-master/

Frontend Source:
~/addisnest_mobile_and_web_app-master_2/addisnest_mobile_and_web_app-master_2-master/addisnest_mobile_and_web_app-master/src/

Frontend Build:
~/addisnest_mobile_and_web_app-master_2/addisnest_mobile_and_web_app-master_2-master/addisnest_mobile_and_web_app-master/dist/

Backend:
~/addisnest_mobile_and_web_app-master_2/addisnest_mobile_and_web_app-master_2-master/addisnest_mobile_and_web_app-master/server.js

Nginx Config:
/etc/nginx/sites-available/addisnest

Environment Variables:
~/addisnest_mobile_and_web_app-master_2/addisnest_mobile_and_web_app-master_2-master/addisnest_mobile_and_web_app-master/.env
```

---

## Important URLs

- **Live Site**: http://34.228.244.224
- **API Endpoint**: http://34.228.244.224/api/properties
- **MongoDB Atlas**: https://cloud.mongodb.com

---

## Need Help?

- Check PM2 logs: `pm2 logs addisnest-app`
- Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
- Check system logs: `sudo journalctl -xe`
- Test API: `curl http://localhost:5000/api/properties`
