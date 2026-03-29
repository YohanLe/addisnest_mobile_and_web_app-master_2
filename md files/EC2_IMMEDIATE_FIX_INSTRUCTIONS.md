# EC2 Immediate Fix Instructions

## Problem Identified
Your EC2 instance at http://3.144.240.220/ has:
- ✅ Frontend working (website loads)
- ✅ Backend server running on port 3000
- ❌ API routes not working (404 errors on /api/properties/count, etc.)

## Root Cause
The server is starting but the API routes are not being properly registered due to errors during route loading.

## Solution
I've created a new `server-production-fixed.js` with:
- Better error handling during route loading
- Individual route loading with error catching
- Detailed logging to identify which routes fail to load
- Graceful degradation (continues even if some routes fail)

## Deployment Steps

### Step 1: SSH into your EC2 instance
```bash
ssh -i your-key.pem ubuntu@3.144.240.220
```

### Step 2: Navigate to your project directory
```bash
cd addisnest_mobile_and_web_app
```

### Step 3: Pull the latest changes (including the fixed server)
```bash
git pull origin main
```

### Step 4: Stop the current server
```bash
pm2 stop addisnest-app
pm2 delete addisnest-app
```

### Step 5: Install any missing dependencies
```bash
npm install
```

### Step 6: Start with the new fixed server
```bash
pm2 start server-production-fixed.js --name addisnest-app
pm2 save
```

### Step 7: Check the status and logs
```bash
pm2 status
pm2 logs addisnest-app --lines 30
```

## What the Fixed Server Does

The new server will:
1. **Load routes individually** - If one route fails, others still work
2. **Show detailed logging** - You'll see exactly which routes load successfully
3. **Continue on errors** - Won't crash if database connection fails initially
4. **Better error handling** - More informative error messages

## Expected Output

When you run `pm2 logs addisnest-app`, you should see:
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

## Testing the Fix

### Test 1: Health Check
```bash
curl http://localhost:3000/health
```
Should return: `{"success":true,"message":"Server is healthy",...}`

### Test 2: Property Count API
```bash
curl http://localhost:3000/api/properties/count
```
Should return property count data instead of 404

### Test 3: From Browser
Visit: http://3.144.240.220:3000/api/properties/count
Should show JSON data instead of "Cannot GET" error

## If Issues Persist

1. **Check the logs for specific errors**:
   ```bash
   pm2 logs addisnest-app --lines 50
   ```

2. **Look for failed route loading**:
   - Lines starting with "✗ Failed to load" indicate missing files
   - Lines starting with "✓" indicate successful loading

3. **Check environment variables**:
   ```bash
   cat .env
   ```
   Ensure `MONGO_URI` and other required variables are set

4. **Verify database connection**:
   - If using local MongoDB: `sudo systemctl status mongod`
   - If using MongoDB Atlas: Check connection string

## Quick Verification Commands

```bash
# Check PM2 status
pm2 status

# Check server logs
pm2 logs addisnest-app --lines 20

# Test API endpoints
curl http://localhost:3000/health
curl http://localhost:3000/api/properties/count

# Check from external
curl http://3.144.240.220:3000/health
curl http://3.144.240.220:3000/api/properties/count
```

## Rollback Plan (if needed)

If the new server doesn't work, you can rollback:
```bash
pm2 stop addisnest-app
pm2 delete addisnest-app
pm2 start server-production.js --name addisnest-app
pm2 save
```

## Key Differences in Fixed Server

1. **Async initialization** - Database and routes load properly
2. **Individual route loading** - Each route file is loaded separately with error handling
3. **Better logging** - Shows exactly what's happening during startup
4. **Graceful error handling** - Continues even if some components fail
5. **Proper middleware order** - Routes are mounted after all middleware is set up

The main issue was likely that the original server was trying to load all routes at once, and if any single route file had an error, it would prevent all API routes from working. The fixed version loads each route individually and continues even if some fail.
