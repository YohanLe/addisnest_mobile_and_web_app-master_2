#!/bin/bash

# =============================================================================
# AddisNest EC2 Deployment Script
# =============================================================================
# This script automates the deployment of AddisNest to AWS EC2
# 
# Prerequisites:
# 1. EC2 instance with Ubuntu
# 2. SSH key (.pem file) with proper permissions (chmod 400)
# 3. Security group allowing HTTP (80), HTTPS (443), and SSH (22)
# =============================================================================

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# =============================================================================
# CONFIGURATION - UPDATE THESE VALUES
# =============================================================================
EC2_HOST="YOUR_EC2_PUBLIC_IP"           # e.g., "3.15.123.45"
EC2_USER="ubuntu"                        # Default for Ubuntu AMI
SSH_KEY_PATH="~/path/to/your-key.pem"   # Path to your .pem file
APP_PORT="3000"                          # Port your Node.js app runs on
APP_NAME="addisnest-app"                 # PM2 process name
GITHUB_REPO="https://github.com/YohanLe/addisnest_mobile_and_web_app-master_2.git"
DEPLOY_PATH="/home/ubuntu/addisnest"     # Where to deploy on EC2

# =============================================================================
# DO NOT EDIT BELOW THIS LINE UNLESS YOU KNOW WHAT YOU'RE DOING
# =============================================================================

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}AddisNest EC2 Deployment Script${NC}"
echo -e "${GREEN}========================================${NC}"

# Check if configuration is set
if [ "$EC2_HOST" = "YOUR_EC2_PUBLIC_IP" ]; then
    echo -e "${RED}ERROR: Please configure your EC2_HOST in this script${NC}"
    echo "Edit this file and set:"
    echo "  - EC2_HOST (your EC2 public IP)"
    echo "  - SSH_KEY_PATH (path to your .pem file)"
    exit 1
fi

# Check if SSH key exists
if [ ! -f "$SSH_KEY_PATH" ]; then
    echo -e "${RED}ERROR: SSH key not found at $SSH_KEY_PATH${NC}"
    exit 1
fi

# Function to run commands on EC2
run_remote() {
    ssh -i "$SSH_KEY_PATH" "$EC2_USER@$EC2_HOST" "$@"
}

# Function to copy files to EC2
copy_to_ec2() {
    scp -i "$SSH_KEY_PATH" "$1" "$EC2_USER@$EC2_HOST:$2"
}

echo ""
echo -e "${YELLOW}Step 1: Testing SSH connection...${NC}"
if run_remote "echo 'SSH connection successful'"; then
    echo -e "${GREEN}✓ SSH connection successful${NC}"
else
    echo -e "${RED}✗ SSH connection failed${NC}"
    echo "Please check:"
    echo "  1. EC2_HOST is correct"
    echo "  2. SSH_KEY_PATH is correct"
    echo "  3. Security group allows SSH from your IP"
    exit 1
fi

echo ""
echo -e "${YELLOW}Step 2: Updating system packages...${NC}"
run_remote "sudo apt update && sudo apt upgrade -y"
echo -e "${GREEN}✓ System updated${NC}"

echo ""
echo -e "${YELLOW}Step 3: Installing Node.js and npm...${NC}"
run_remote "curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && sudo apt-get install -y nodejs"
echo -e "${GREEN}✓ Node.js installed${NC}"

echo ""
echo -e "${YELLOW}Step 4: Installing PM2...${NC}"
run_remote "sudo npm install -g pm2"
echo -e "${GREEN}✓ PM2 installed${NC}"

echo ""
echo -e "${YELLOW}Step 5: Installing and configuring Nginx...${NC}"
run_remote "sudo apt-get install -y nginx && sudo systemctl start nginx && sudo systemctl enable nginx"
echo -e "${GREEN}✓ Nginx installed and started${NC}"

echo ""
echo -e "${YELLOW}Step 6: Cloning repository...${NC}"
run_remote "rm -rf $DEPLOY_PATH && git clone $GITHUB_REPO $DEPLOY_PATH"
echo -e "${GREEN}✓ Repository cloned${NC}"

echo ""
echo -e "${YELLOW}Step 7: Installing application dependencies...${NC}"
run_remote "cd $DEPLOY_PATH/addisnest_mobile_and_web_app-master && npm install"
echo -e "${GREEN}✓ Dependencies installed${NC}"

echo ""
echo -e "${YELLOW}Step 8: Setting up environment variables...${NC}"
echo -e "${YELLOW}Please manually configure .env file on EC2:${NC}"
echo "  1. SSH into your EC2: ssh -i $SSH_KEY_PATH $EC2_USER@$EC2_HOST"
echo "  2. Edit .env: nano $DEPLOY_PATH/addisnest_mobile_and_web_app-master/.env"
echo "  3. Set NODE_ENV=production and configure your MongoDB URI and other secrets"
echo ""
read -p "Press Enter once you've configured the .env file..."

echo ""
echo -e "${YELLOW}Step 9: Starting application with PM2...${NC}"
run_remote "cd $DEPLOY_PATH/addisnest_mobile_and_web_app-master && pm2 delete $APP_NAME 2>/dev/null || true && pm2 start server.js --name $APP_NAME"
run_remote "pm2 startup"
run_remote "pm2 save"
echo -e "${GREEN}✓ Application started with PM2${NC}"

echo ""
echo -e "${YELLOW}Step 10: Configuring Nginx reverse proxy...${NC}"

# Create Nginx configuration
cat > /tmp/nginx-config << EOF
server {
    listen 80;
    server_name $EC2_HOST;

    location / {
        proxy_pass http://localhost:$APP_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

copy_to_ec2 "/tmp/nginx-config" "/tmp/addisnest-nginx"
run_remote "sudo mv /tmp/addisnest-nginx /etc/nginx/sites-available/addisnest && sudo ln -sf /etc/nginx/sites-available/addisnest /etc/nginx/sites-enabled/addisnest && sudo rm -f /etc/nginx/sites-enabled/default && sudo nginx -t && sudo systemctl restart nginx"
rm /tmp/nginx-config
echo -e "${GREEN}✓ Nginx configured${NC}"

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Deployment Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "Your application should now be accessible at:"
echo -e "${GREEN}http://$EC2_HOST${NC}"
echo ""
echo "Useful commands:"
echo "  - Check app status: ssh -i $SSH_KEY_PATH $EC2_USER@$EC2_HOST 'pm2 status'"
echo "  - View app logs: ssh -i $SSH_KEY_PATH $EC2_USER@$EC2_HOST 'pm2 logs $APP_NAME'"
echo "  - Restart app: ssh -i $SSH_KEY_PATH $EC2_USER@$EC2_HOST 'pm2 restart $APP_NAME'"
echo ""
