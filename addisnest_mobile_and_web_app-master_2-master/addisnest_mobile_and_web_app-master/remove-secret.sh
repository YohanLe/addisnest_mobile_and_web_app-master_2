#!/bin/sh
sed -i "s/SENDGRID_API_KEY: process.env.SENDGRID_API_KEY || 'YOUR_SENDGRID_API_KEY'/SENDGRID_API_KEY: process.env.SENDGRID_API_KEY/g" restart-server-production.js
