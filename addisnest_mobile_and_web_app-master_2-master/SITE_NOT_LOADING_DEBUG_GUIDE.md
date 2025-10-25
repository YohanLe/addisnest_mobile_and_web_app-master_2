# Website Not Loading - Quick Debug Guide

## Quick Reference: addisnest.com Debugging Steps

Use this guide when **addisnest.com** fails to load.

---

## Step-by-Step Debugging Process

### 1. Check Backend Server Status
```bash
# SSH into EC2 instance, then run:
sudo ss -tlnp | grep :7002
```
✅ **Expected**: Should show node process on port 7002  
❌ **If not running**: Start backend with `npm start` or `node server.js`

---

### 2. Check Nginx Status
```bash
sudo systemctl status nginx
```
✅ **Expected**: Active (running)  
❌ **If not running**: `sudo systemctl start nginx`

---

### 3. Verify DNS Configuration
```bash
nslookup addisnest.com
```
✅ **Expected**: Should return `34.228.244.224` (your EC2 IP)  
❌ **If wrong IP**: Update DNS A record in your domain registrar

---

### 4. Check EC2 Public IP
```bash
curl -s http://checkip.amazonaws.com
```
✅ **Expected**: Should match DNS IP (34.228.244.224)  
❌ **If different**: Update DNS or assign Elastic IP

---

### 5. Test Site Locally on Server
```bash
# Test HTTPS with domain header
curl -I -k https://localhost -H "Host: addisnest.com"
```
✅ **Expected**: `HTTP/1.1 200 OK`  
❌ **If 404 or error**: Check nginx configuration

---

### 6. Test External Access
```bash
curl -I https://addisnest.com
```
✅ **Expected**: `HTTP/1.1 200 OK`  
❌ **If timeout**: Check Security Groups (see Step 7)

---

### 7. Verify AWS Security Group Rules

**Go to AWS Console → EC2 → Security Groups**

Required inbound rules:
- ✅ SSH (22) - for server access
- ✅ HTTP (80) - for http traffic
- ✅ **HTTPS (443)** - for https traffic ⚠️ **MOST COMMON ISSUE**
- ✅ Custom TCP (7002) - for backend API

**To add missing rule:**
1. Select your security group (launch-wizard-1)
2. Click "Edit inbound rules"
3. Click "Add rule"
4. Type: HTTPS, Source: 0.0.0.0/0
5. Save rules

---

### 8. Check Browser Console for Errors

Open site in browser, press F12, check Console tab.

**Common issues:**

#### Mixed Content Error
```
Mixed Content: The page at 'https://addisnest.com' was loaded over HTTPS, 
but requested an insecure XMLHttpRequest endpoint 'http://...'
```

**Fix:** Update `.env` file to use HTTPS URLs:
```bash
# Edit .env file
nano .env

# Change these values:
VITE_API_BASE_URL=https://addisnest.com
CLIENT_URL=https://addisnest.com
CORS_ORIGIN=https://addisnest.com,https://www.addisnest.com

# Rebuild frontend
npm run build

# Restart backend
pm2 restart all
# OR if not using pm2:
pkill -f node
nohup node server.js &
```

---

## Common Issues & Quick Fixes

| Issue | Symptom | Fix |
|-------|---------|-----|
| **Port 443 blocked** | Site times out, can't load | Add HTTPS rule to Security Group |
| **Mixed content** | Site loads but no data/properties | Update .env to use HTTPS URLs, rebuild |
| **Backend down** | API calls fail | Restart backend server |
| **Wrong DNS** | Site unreachable | Check DNS points to correct EC2 IP |
| **Nginx misconfigured** | 404 or 502 errors | Check `/etc/nginx/sites-enabled/addisnest` |

---

## Restart Commands

### Restart Nginx
```bash
sudo systemctl restart nginx
```

### Restart Backend Server
```bash
# If using PM2:
pm2 restart all

# If running directly:
pkill -f "node.*server.js"
nohup node server.js > server.log 2>&1 &
```

### Rebuild Frontend
```bash
cd ~/addisnest_mobile_and_web_app-master_2/addisnest_mobile_and_web_app-master_2-master/addisnest_mobile_and_web_app-master
npm run build
```

---

## Quick Health Check Script

Save this as `check-health.sh`:

```bash
#!/bin/bash
echo "=== AddiNest Health Check ==="
echo ""
echo "1. Backend Status:"
sudo ss -tlnp | grep :7002 && echo "✅ Backend running" || echo "❌ Backend not running"
echo ""
echo "2. Nginx Status:"
sudo systemctl is-active nginx && echo "✅ Nginx running" || echo "❌ Nginx not running"
echo ""
echo "3. DNS Check:"
nslookup addisnest.com | grep "Address:" | tail -1
echo ""
echo "4. EC2 Public IP:"
curl -s http://checkip.amazonaws.com
echo ""
echo "5. Site Test:"
curl -I https://addisnest.com 2>&1 | head -1
```

Make it executable: `chmod +x check-health.sh`  
Run it: `./check-health.sh`

---

## Emergency Contact Info

- **Server IP**: 34.228.244.224
- **Domain**: addisnest.com
- **Backend Port**: 7002
- **SSH User**: ubuntu

---

## Notes

- Always check Security Groups first if site suddenly stops loading
- Remember to rebuild frontend after .env changes
- Keep backend running with PM2 or nohup for persistence
- Check nginx error logs: `sudo tail -f /var/log/nginx/error.log`
