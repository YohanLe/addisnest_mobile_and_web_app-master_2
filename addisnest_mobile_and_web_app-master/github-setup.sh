#!/bin/bash

# GitHub repository setup script
# This script helps initialize a Git repository and push to GitHub

echo "=== GitHub Repository Setup ==="
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "Error: Git is not installed. Please install Git first."
    exit 1
fi

# Initialize Git repository if it doesn't exist
if [ ! -d .git ]; then
    echo "Initializing Git repository..."
    git init
    echo "Git repository initialized."
else
    echo "Git repository already exists."
fi

# Check if remote origin exists
if git remote | grep -q "origin"; then
    echo "Remote 'origin' already exists."
    REMOTE_URL=$(git remote get-url origin)
    echo "Current remote URL: $REMOTE_URL"
    
    read -p "Do you want to update the remote URL? (y/n): " update_remote
    if [ "$update_remote" = "y" ] || [ "$update_remote" = "Y" ]; then
        read -p "Enter your GitHub username: " github_username
        read -p "Enter your repository name: " repo_name
        git remote set-url origin "https://github.com/$github_username/$repo_name.git"
        echo "Remote URL updated to: https://github.com/$github_username/$repo_name.git"
    fi
else
    # Set up remote origin
    read -p "Enter your GitHub username: " github_username
    read -p "Enter your repository name: " repo_name
    git remote add origin "https://github.com/$github_username/$repo_name.git"
    echo "Remote origin added: https://github.com/$github_username/$repo_name.git"
fi

# Stage files
echo ""
echo "Staging files..."
git add .
echo "Files staged."

# Commit changes
echo ""
read -p "Enter commit message (default: 'Initial commit'): " commit_message
commit_message=${commit_message:-"Initial commit"}
git commit -m "$commit_message"
echo "Changes committed."

# Push to GitHub
echo ""
echo "You'll need to create a repository on GitHub before pushing."
echo "Go to https://github.com/new to create a new repository."
echo "Make sure to name it: $repo_name"
echo "DO NOT initialize the repository with README, .gitignore, or license files."
echo ""
read -p "Have you created the repository on GitHub? (y/n): " repo_created

if [ "$repo_created" = "y" ] || [ "$repo_created" = "Y" ]; then
    echo "Pushing to GitHub..."
    git push -u origin master || git push -u origin main
    echo "Push completed."
    echo ""
    echo "Your repository is now available at: https://github.com/$github_username/$repo_name"
else
    echo "Please create the repository on GitHub before pushing."
    echo "When ready, run the following command to push your code:"
    echo "git push -u origin master"
    echo ""
fi

echo ""
echo "=== GitHub Setup Complete ==="
