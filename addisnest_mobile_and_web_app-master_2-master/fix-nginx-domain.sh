#!/bin/bash
# Script to update Nginx configuration for addisnest.com domain

# Create updated Nginx configuration with domain names
cat > /tmp/addisnest << 'EOF'
server {
    listen 80;
    server_name addisnest.com www.addisnest.com 34.228.244.224;

    # Serve the React frontend
    root /home/ubuntu/addisnest_mobile_and_web_app-master_2/addisnest_mobile_and_web_app-master_2-master/addisnest_mobile_and_web_app-master/dist;
    index index.html;

    # Frontend - serve static files and handle client-side routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API routes - proxy all API endpoints to backend
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Auth routes
    location /auth/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # User routes
    location /users/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Property routes (direct /properties endpoint)
    location /properties {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Uploads directory
    location /uploads/ {
        alias /home/ubuntu/addisnest_mobile_and_web_app-master_2/addisnest_mobile_and_web_app-master_2-master/addisnest_mobile_and_web_app-master/uploads/;
        autoindex on;
    }
}
EOF

# Copy to Nginx sites-available
sudo cp /tmp/addisnest /etc/nginx/sites-available/addisnest

# Enable the site if not already enabled
sudo ln -sf /etc/nginx/sites-available/addisnest /etc/nginx/sites-enabled/

# Remove default site if it exists
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
echo "Testing Nginx configuration..."
sudo nginx -t

# If test passes, reload Nginx
if [ $? -eq 0 ]; then
    echo "Configuration test passed. Reloading Nginx..."
    sudo systemctl reload nginx
    echo ""
    echo "✅ Nginx configuration updated successfully!"
    echo ""
    echo "Your domain should now be accessible at:"
    echo "  - http://addisnest.com"
    echo "  - http://www.addisnest.com"
    echo "  - http://34.228.244.224"
    echo ""
    echo "Next steps:"
    echo "1. Test your site in a browser"
    echo "2. Consider setting up HTTPS/SSL with Let's Encrypt"
else
    echo "❌ Configuration test failed. Please check the error messages above."
    exit 1
fi
