#!/bin/bash

# =============================================================================
# AddisNest EC2 Update Script
# =============================================================================
# This script updates your running EC2 instance with the latest code changes
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
APP_NAME="addisnest-app"                 # PM2 process name
DEPLOY_PATH="/home/ubuntu/addisnest/addisnest_mobile_and_web_app-master"

# =============================================================================
# DO NOT EDIT BELOW THIS LINE
# =============================================================================

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}AddisNest EC2 Update Script${NC}"
echo -e "${GREEN}========================================${NC}"

# Check if configuration is set
if [ "$EC2_HOST" = "YOUR_EC2_PUBLIC_IP" ]; then
    echo -e "${RED}ERROR: Please configure your EC2_HOST in this script${NC}"
    exit 1
fi

# Function to run commands on EC2
run_remote() {
    ssh -i "$SSH_KEY_PATH" "$EC2_USER@$EC2_HOST" "$@"
}

echo ""
echo -e "${YELLOW}Step 1: Pushing local changes to GitHub...${NC}"
cd addisnest_mobile_and_web_app-master
git add .
git commit -m "Update email subject: Added 'Addisnest' prefix to property tour request emails"
git push origin main || git push origin master
cd ..
echo -e "${GREEN}✓ Changes pushed to GitHub${NC}"

echo ""
echo -e "${YELLOW}Step 2: Pulling latest changes on EC2...${NC}"
run_remote "cd $DEPLOY_PATH && git pull origin main || git pull origin master"
echo -e "${GREEN}✓ Latest changes pulled${NC}"

echo ""
echo -e "${YELLOW}Step 3: Installing any new dependencies...${NC}"
run_remote "cd $DEPLOY_PATH && npm install"
echo -e "${GREEN}✓ Dependencies updated${NC}"

echo ""
echo -e "${YELLOW}Step 4: Restarting application...${NC}"
run_remote "pm2 restart $APP_NAME"
echo -e "${GREEN}✓ Application restarted${NC}"

echo ""
echo -e "${YELLOW}Step 5: Checking application status...${NC}"
run_remote "pm2 status"

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Update Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "You can check the logs with:"
echo -e "${YELLOW}ssh -i $SSH_KEY_PATH $EC2_USER@$EC2_HOST 'pm2 logs $APP_NAME'${NC}"
echo ""
