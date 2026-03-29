# EC2 Deployment Fix Guide

## Problem Analysis

Your AddisNest application was crashing on AWS EC2 due to several critical issues:

1. **Port Configuration Mismatch**: The app-launcher.js was designed for development and tried to start both frontend and backend servers
2. **Missing Dependencies**: Server required `morgan`, `express-fileupload`, and `cookie-parser` but they weren't in package.json
3. **Environment Configuration**: Missing or incorrect environment variables
4. **Production vs Development Setup**: Using development configuration in production

## Solution Applied

### 1. Created Production Server (`server-production.js`)
- Simplified server that only runs the backend API
- Proper error handling and logging
- Health check endpoint at `/health`
- Configured to listen on `0.0.0.0` for Docker compatibility

### 2. Updated Docker Configuration
- **Dockerfile**: Now uses `server-production.js` instead of `app-launcher.js`
- **docker-compose.yml**: Set to production environment with proper volume mounting

### 3. Added Missing Dependencies
- `morgan`: HTTP request logger middleware
- `express-fileupload`: File upload handling
- `cookie-parser`: Cookie parsing middleware

### 4. Created Production Environment Template
- `.env.production`: Template with all required environment variables

## Deployment Steps

### Step 1: Update Your EC2 Instance

SSH into your EC2 instance:
```bash
ssh -i your-key.pem ubuntu@3.19.240.101
cd addisnest_mobile_and_web_app
```

### Step 2: Pull Latest Changes
```bash
git pull origin main
```

### Step 3: Set Up Environment Variables
```bash
# Copy the production environment template
cp .env.production .env

# Edit the .env file with your actual values
nano .env
```

**CRITICAL**: Update these values in your `.env` file:
- `MONGO_URI`: Your actual MongoDB connection string
- `JWT_SECRET`: A secure random string (at least 32 characters)
- `SENDGRID_API_KEY`: Your SendGrid API key (if using email features)

### Step 4: Stop Current PM2 Process
```bash
pm2 stop addisnest-app
pm2 delete addisnest-app
```

### Step 5: Install Dependencies
```bash
npm install
```

### Step 6: Start with New Production Server
```bash
pm2 start server-production.js --name addisnest-app
pm2 save
```

### Step 7: Check Status
```bash
pm2 status
pm2 logs addisnest-app
```

## Alternative: Docker Deployment

If you prefer Docker deployment:

### Step 1: Stop PM2 and Use Docker
```bash
pm2 stop all
pm2 delete all

# Build and run with Docker
sudo docker-compose down
sudo docker-compose up --build -d
```

### Step 2: Check Docker Status
```bash
sudo docker-compose ps
sudo docker-compose logs
```

## Verification

### Test the API
```bash
# Health check
curl http://localhost:3000/health

# Base API endpoint
curl http://localhost:3000/
```

### Check from Browser
Visit: `http://3.19.240.101/health`

You should see:
```json
{
  "success": true,
  "message": "Server is healthy",
  "timestamp": "2025-01-10T22:17:00.000Z",
  "environment": "production"
}
```

## Troubleshooting

### If Still Getting Errors:

1. **Check PM2 Logs**:
   ```bash
   pm2 logs addisnest-app --lines 50
   ```

2. **Check Environment Variables**:
   ```bash
   pm2 show addisnest-app
   ```

3. **Verify MongoDB Connection**:
   - Ensure MongoDB is running (if using local MongoDB)
   - Test connection string if using MongoDB Atlas

4. **Check Port Availability**:
   ```bash
   sudo netstat -tlnp | grep :3000
   ```

### Common Issues and Solutions:

1. **"Cannot find module" errors**: Run `npm install` again
2. **Database connection errors**: Check `MONGO_URI` in `.env`
3. **Port already in use**: Kill existing processes or change port
4. **Permission errors**: Check file permissions and ownership

## Environment Variables Checklist

Ensure these are set in your `.env` file:
- [ ] `PORT=3000`
- [ ] `NODE_ENV=production`
- [ ] `MONGO_URI` (with actual database connection)
- [ ] `JWT_SECRET` (secure random string)
- [ ] `SENDGRID_API_KEY` (if using email)
- [ ] `EMAIL_FROM` (your email address)

## Next Steps

1. Set up proper MongoDB (local or Atlas)
2. Configure email service (SendGrid)
3. Set up SSL certificate for HTTPS
4. Configure domain name
5. Set up monitoring and logging
6. Implement backup strategy

## Support

If you continue to experience issues:
1. Check the PM2 logs: `pm2 logs addisnest-app`
2. Verify all environment variables are correctly set
3. Test database connectivity separately
4. Check system resources: `htop` or `free -h`

## Quick Fix Commands

```bash
# Complete fix sequence
cd addisnest_mobile_and_web_app
git pull origin main
cp .env.production .env
nano .env  # Update with your actual values
pm2 stop addisnest-app
pm2 delete addisnest-app
npm install
pm2 start server-production.js --name addisnest-app
pm2 save
pm2 status
```

## Files Modified

1. **server-production.js** - New production server
2. **Dockerfile** - Updated to use production server
3. **docker-compose.yml** - Production configuration
4. **package.json** - Added missing dependencies
5. **.env.production** - Environment template

The main issue was that your `app-launcher.js` was trying to start both frontend and backend servers, which is not suitable for production deployment. The new `server-production.js` only runs the backend API server on port 3000, which is what you need for your EC2 deployment.
