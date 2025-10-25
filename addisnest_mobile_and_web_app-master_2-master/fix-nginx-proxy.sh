#!/bin/bash
# Script to fix Nginx configuration on EC2

# Create updated Nginx configuration
cat > /tmp/addisnest << 'EOF'
server {
    listen 80;
    server_name 34.228.244.224;

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

# Test and reload Nginx
sudo nginx -t && sudo systemctl reload nginx

echo "Nginx configuration updated!"
echo "Test by visiting: http://34.228.244.224"
