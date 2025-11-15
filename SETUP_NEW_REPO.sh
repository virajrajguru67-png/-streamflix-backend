#!/bin/bash
# Script to set up new GitHub repository for backend

echo "🚀 Setting up new GitHub repository for StreamFlix Backend"
echo ""

# Step 1: Remove old remote (if exists)
echo "Step 1: Removing old remote..."
git remote remove origin 2>/dev/null || echo "No old remote found"
echo "✅ Done"
echo ""

# Step 2: Show current status
echo "Step 2: Current git status..."
git status --short
echo ""

# Step 3: Instructions
echo "📝 Next steps:"
echo ""
echo "1. Create a new repository on GitHub:"
echo "   https://github.com/new"
echo ""
echo "2. Name it: streamflix-backend (or your preferred name)"
echo ""
echo "3. After creating, run these commands:"
echo ""
echo "   git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "4. Then deploy to Vercel using the new repository!"
echo ""

