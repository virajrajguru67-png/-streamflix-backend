# Create New GitHub Repository for Backend

Follow these steps to create a new GitHub repository with only backend files:

## Step 1: Create New Repository on GitHub

1. Go to https://github.com/new
2. **Repository name**: `streamflix-backend` (or your preferred name)
3. **Description**: "StreamFlix Backend API - Express.js backend for movie booking platform"
4. **Visibility**: Private (or Public)
5. **DO NOT** initialize with README, .gitignore, or license
6. Click **"Create repository"**

## Step 2: Remove Old Remote (if exists)

```bash
cd backend
git remote remove origin
```

## Step 3: Add All Backend Files

```bash
# Make sure you're in the backend directory
cd backend

# Add all files
git add .

# Commit
git commit -m "Initial commit: StreamFlix backend API"
```

## Step 4: Connect to New GitHub Repository

```bash
# Replace YOUR_USERNAME and REPO_NAME with your actual values
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

## Step 5: Deploy to Vercel

1. Go to https://vercel.com/dashboard
2. Click **"Add New Project"**
3. Click **"Import Git Repository"**
4. Select your new repository
5. Configure:
   - **Root Directory**: Leave blank (or set to `/` if it asks)
   - **Framework Preset**: Other
   - **Build Command**: `npm run vercel-build`
   - **Install Command**: `npm install`
6. **Add Environment Variables**:
   - `DATABASE_URL` = Your Aiven MySQL connection string
   - `JWT_SECRET` = Random secret (16+ characters)
   - `JWT_EXPIRES_IN` = `1h`
   - `REFRESH_TOKEN_TTL_DAYS` = `30`
   - `RAZORPAY_KEY_SECRET` = Your Razorpay secret
   - `FRONTEND_URL` = `https://grab-show.vercel.app`
   - `NODE_ENV` = `production`
7. Click **"Deploy"**

## Step 6: Get Backend URL

After deployment, Vercel will give you a URL like:
```
https://your-backend-project.vercel.app
```

## Step 7: Update Frontend

Go to your frontend project on Vercel and add environment variable:
- `API_BASE_URL` = `https://your-backend-project.vercel.app`

---

## Quick Commands

```bash
# 1. Remove old remote
git remote remove origin

# 2. Add new remote (replace with your URL)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# 3. Push
git branch -M main
git push -u origin main
```

Done! 🎉

