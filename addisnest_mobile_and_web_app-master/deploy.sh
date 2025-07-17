#!/bin/bash
set -e

echo "Changing ownership to ubuntu..."
sudo chown -R ubuntu:ubuntu /home/ubuntu/addisnest_mobile_and_web_app/

echo "Installing dependencies..."
npm install

echo "Building frontend..."
npm run build

echo "Changing ownership of dist and uploads to www-data..."
sudo chown -R www-data:www-data /home/ubuntu/addisnest_mobile_and_web_app/dist
sudo chown -R www-data:www-data /home/ubuntu/addisnest_mobile_and_web_app/uploads

echo "Restarting server..."
pm2 restart server --update-env || pm2 start server.js --name server --update-env

echo "Deployment complete!"
