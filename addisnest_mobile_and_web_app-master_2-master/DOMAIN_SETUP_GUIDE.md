# AddisNest Domain Setup Guide

## Current Status ✅

Your DNS is **successfully propagated**! The domain `addisnest.com` and `www.addisnest.com` are now resolving to your server IP `34.228.244.224` globally.

## The Issue 🔍

Your nginx web server configuration currently only accepts requests for the IP address `34.228.244.224`, but it doesn't recognize the domain names `addisnest.com` or `www.addisnest.com`. This is why the domain isn't working yet.

**Current nginx config:**
```nginx
server_name 34.228.244.224;  # ❌ Missing domain names!
```

**Required nginx config:**
```nginx
server_name addisnest.com www.addisnest.com 34.228.244.224;  # ✅ Correct!
```

## How to Fix It 🔧

### Step 1: Connect to Your EC2 Server

Open your terminal and SSH into your EC2 server:

```bash
ssh -i your-key.pem ubuntu@34.228.244.224
```

*(Replace `your-key.pem` with your actual EC2 key file)*

### Step 2: Upload the Fix Script

From your **local machine** (in a new terminal window), upload the fix script to your EC2 server:

```bash
scp -i your-key.pem fix-nginx-domain.sh ubuntu@34.228.244.224:~
```

### Step 3: Run the Fix Script on EC2

Back in your **EC2 SSH session**, run:

```bash
# Make the script executable
chmod +x fix-nginx-domain.sh

# Run the script
./fix-nginx-domain.sh
```

### Step 4: Verify It Works

After the script runs successfully, test your domain:

1. **Open a web browser**
2. **Visit:** http://addisnest.com
3. **Also try:** http://www.addisnest.com

Your website should now be accessible! 🎉

## Alternative: Manual Configuration

If you prefer to fix it manually without the script:

### 1. SSH into EC2
```bash
ssh -i your-key.pem ubuntu@34.228.244.224
```

### 2. Edit the nginx configuration
```bash
sudo nano /etc/nginx/sites-available/addisnest
```

### 3. Change the `server_name` line
Find the line that says:
```nginx
server_name 34.228.244.224;
```

Change it to:
```nginx
server_name addisnest.com www.addisnest.com 34.228.244.224;
```

### 4. Save and test
Press `Ctrl+X`, then `Y`, then `Enter` to save.

Test the configuration:
```bash
sudo nginx -t
```

### 5. Reload nginx
If the test passes:
```bash
sudo systemctl reload nginx
```

## Troubleshooting 🔍

### Domain Still Not Working?

1. **Check if nginx is running:**
   ```bash
   sudo systemctl status nginx
   ```

2. **Check if your backend is running:**
   ```bash
   sudo systemctl status addisnest  # or however your app runs
   ps aux | grep node
   ```

3. **Check nginx error logs:**
   ```bash
   sudo tail -f /var/log/nginx/error.log
   ```

4. **Check if port 80 is accessible:**
   ```bash
   sudo netstat -tulpn | grep :80
   ```

5. **Verify EC2 Security Group:**
   - Go to AWS Console → EC2 → Security Groups
   - Ensure port 80 (HTTP) is open to `0.0.0.0/0`

### Browser Shows Error?

- **"Connection refused"** → Server isn't running or port is closed
- **"This site can't be reached"** → DNS issue or firewall blocking
- **"502 Bad Gateway"** → nginx is running but backend isn't
- **"403 Forbidden"** → Permission issues with files

## Next Steps 🚀

### 1. Set Up HTTPS (Highly Recommended!)

Once HTTP is working, secure your site with SSL:

```bash
# Install Certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate (it's free!)
sudo certbot --nginx -d addisnest.com -d www.addisnest.com
```

Certbot will automatically:
- Obtain an SSL certificate
- Configure nginx for HTTPS
- Set up automatic certificate renewal

### 2. Test HTTPS

After SSL setup, your site will be accessible at:
- https://addisnest.com ✅
- https://www.addisnest.com ✅

HTTP traffic will automatically redirect to HTTPS.

### 3. Monitor Your Site

- Set up monitoring with tools like UptimeRobot or Pingdom
- Monitor server resources (CPU, memory, disk)
- Check logs regularly for errors

## Summary Checklist ✓

- [x] DNS configured in GoDaddy
- [x] DNS propagated globally
- [ ] nginx configured with domain names
- [ ] Domain accessible via HTTP
- [ ] SSL/HTTPS set up (recommended)
- [ ] Monitoring configured (optional)

## Need Help?

If you encounter any issues:

1. Check the nginx error logs: `sudo tail -f /var/log/nginx/error.log`
2. Verify your application logs
3. Ensure all required services are running
4. Check AWS Security Group settings

---

**Created:** 2025-10-21  
**Last Updated:** 2025-10-21
