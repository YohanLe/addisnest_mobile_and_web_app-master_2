# Immediate Deployment Steps for EC2 Fix

## Current Status
✅ Code fixes have been pushed to GitHub repository
❌ EC2 instance still running the old crashing version

## Execute These Commands on Your EC2 Instance

### 1. SSH into your EC2 instance
```bash
ssh -i your-key.pem ubuntu@3.19.240.101
```

### 2. Execute the complete fix sequence
```bash
cd addisnest_mobile_and_web_app
git pull origin main
cp .env.production .env
nano .env
pm2 stop addisnest-app
pm2 delete addisnest-app
npm install
pm2 start server-production.js --name addisnest-app
pm2 save
```

**CRITICAL - When editing .env file, update these values:**
- `MONGO_URI=mongodb://localhost:27017/addinest_real_estate` (or your MongoDB Atlas connection)
- `JWT_SECRET=your_super_secure_jwt_secret_key_here_change_this` (change this!)
- `SENDGRID_API_KEY=your_sendgrid_api_key_here` (if you have one)

### 8. Check if it's working
```bash
pm2 status
pm2 logs addisnest-app --lines 20
```

### 9. Test the API
```bash
# Test health endpoint
curl http://localhost:3000/health

# Test base API
curl http://localhost:3000/
```

## Expected Results

After running these commands, you should see:

1. **PM2 Status**: Shows "online" instead of "errored"
2. **Health Check**: Returns JSON with server status
3. **No More Crashes**: Application stays running without high CPU usage

## If You Still Have Issues

1. **Check logs**: `pm2 logs addisnest-app`
2. **Verify environment**: Make sure `.env` file has correct MongoDB connection
3. **Check MongoDB**: Ensure MongoDB is running if using local database

## Quick Verification Commands
```bash
# Check if server is responding
curl http://3.19.240.101/health

# Check PM2 status
pm2 status

# View recent logs
pm2 logs addisnest-app --lines 10
```

The main fix was replacing the development `app-launcher.js` with a production-ready `server-production.js` that only runs the backend API server without trying to start frontend servers.
