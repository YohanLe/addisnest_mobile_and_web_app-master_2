#!/bin/bash

echo "==================================================="
echo "       Deploying Addinest to Netlify"
echo "==================================================="
echo ""

# Check if netlify CLI is installed
if ! command -v netlify &> /dev/null
then
    echo "Netlify CLI not found. Installing..."
    npm install -g netlify-cli
    
    if [ $? -ne 0 ]; then
        echo "Failed to install Netlify CLI. Please install it manually with:"
        echo "npm install -g netlify-cli"
        exit 1
    fi
fi

echo ""
echo "Deploying to Netlify..."
echo ""
echo "NOTE: When prompted, choose the \"dist\" directory as the publish directory."
echo ""

# Deploy to Netlify
netlify deploy --prod

if [ $? -ne 0 ]; then
    echo ""
    echo "Deployment failed. Please check the error messages above."
    exit 1
fi

echo ""
echo "==================================================="
echo "Deployment completed successfully!"
echo ""
echo "Next Steps:"
echo "1. Visit the Netlify URL provided above to verify your site"
echo "2. Connect your custom domain (addisnest.com) in the Netlify dashboard:"
echo "   - Go to Site settings > Domain management > Add custom domain"
echo "==================================================="
