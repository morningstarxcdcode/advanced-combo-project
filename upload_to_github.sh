#!/bin/bash

# Script to upload advanced-combo-project to GitHub repository

REPO_NAME="advanced-combo-project"
GITHUB_USER="morningstarxcdcode"
GITHUB_URL="https://github.com/$GITHUB_USER/$REPO_NAME.git"

echo "Initializing git repository..."
git init

echo "Adding all files..."
git add .

echo "Committing changes..."
git commit -m "Initial commit of advanced combo project"

echo "Adding remote repository..."
git remote add origin $GITHUB_URL

echo "Setting branch to main..."
git branch -M main

echo "Pushing to GitHub..."
git push -u origin main

echo "Upload complete."
