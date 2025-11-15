# Complete Vercel Deployment Guide

## Step 1: Deploy Backend to Vercel

### 1.1 Go to Vercel Dashboard
1. Visit: https://vercel.com/dashboard
2. Click **"Add New Project"**
3. Click **"Import Git Repository"**
4. If you haven't connected GitHub yet, click **"Configure GitHub App"** and authorize Vercel
5. Search for: `-streamflix-backend`
6. Click **"Import"**

### 1.2 Configure Project Settings

**Root Directory**: Leave blank (or set to `/` if it asks)

**Framework Preset**: Other

**Build Command**: 
```
npm run vercel-build
```

**Install Command**:
```
npm install
```

**Output Directory**: Leave blank

**Development Command**: Leave blank (or `npm run dev`)

### 1.3 Add Environment Variables

Click **"Environment Variables"** and add:

| Name | Value | Environment |
|------|-------|-------------|
| `DATABASE_URL` | Your Aiven MySQL connection string (with `?sslmode=REQUIRED`) | Production, Preview, Development |
| `JWT_SECRET` | Random secret (16+ characters, e.g., `your-super-secret-jwt-key-here-12345`) | All |
| `JWT_EXPIRES_IN` | `1h` | All |
| `REFRESH_TOKEN_TTL_DAYS` | `30` | All |
| `RAZORPAY_KEY_SECRET` | Your Razorpay secret key | All |
| `FRONTEND_URL` | `https://grab-show.vercel.app` | Production |
| `NODE_ENV` | `production` | Production |
| `PRISMA_CLI_BINARY_TARGETS` | `rhel-openssl-1.0.x` | All |

### 1.4 Deploy

Click **"Deploy"** and wait for deployment to complete.

### 1.5 Get Your Backend URL

After deployment, Vercel will give you a URL like:
```
https://-streamflix-backend.vercel.app
```
or
```
https://-streamflix-backend-[hash].vercel.app
```

**Copy this URL!** You'll need it for the frontend.

---

## Step 2: Verify Backend is Working

### Test Health Endpoint

Open your browser and visit:
```
https://your-backend-url.vercel.app/healthz
```

You should see:
```json
{"status":"ok","timestamp":"..."}
```

### Test Database Connection

The backend will automatically run Prisma migrations on first deploy. Check the deployment logs to ensure:
- ✅ Build completed successfully
- ✅ Prisma Client generated
- ✅ No database connection errors

---

## Step 3: Update Frontend to Use Backend

### Method 1: Vercel Environment Variable (Recommended)

1. Go to your **frontend project** on Vercel: `grab-show`
2. Click **Settings** → **Environment Variables**
3. Click **"Add New"**
4. Enter:
   - **Key**: `API_BASE_URL`
   - **Value**: `https://your-backend-url.vercel.app` (from Step 1.5)
   - **Environment**: Production, Preview, Development (select all)
5. Click **"Save"**
6. **Redeploy**: Go to **Deployments** → Click **⋯** on latest deployment → **Redeploy**

### Method 2: Update HTML Meta Tag

1. Edit `flutter_demo/web/index.html`:
   ```html
   <meta name="api-base-url" content="https://your-backend-url.vercel.app">
   ```

2. Rebuild and redeploy:
   ```bash
   cd flutter_demo
   flutter build web --release
   cd build/web
   vercel --prod
   ```

---

## Step 4: Test Login

1. Visit: https://grab-show.vercel.app
2. Try to login with:
   - Email: `admin@developer.com`
   - Password: `Admin@123`
3. Check browser console (F12) - should see API calls to your Vercel backend URL

---

## Troubleshooting

### Backend Deployment Fails

1. **Check build logs** in Vercel dashboard
2. **Verify environment variables** are set correctly
3. **Check DATABASE_URL format** - should include `?sslmode=REQUIRED`
4. **Ensure Prisma migrations** are included in repository

### Frontend Still Shows localhost:5000

1. **Verify environment variable** `API_BASE_URL` is set in frontend Vercel project
2. **Redeploy frontend** after adding environment variable
3. **Check browser console** - should show requests to Vercel backend

### Database Connection Errors

1. **Verify Aiven connection string** in backend environment variables
2. **Check Aiven firewall** - should allow Vercel IPs (usually already allowed)
3. **Verify SSL is enabled** in connection string (`?sslmode=REQUIRED`)

### CORS Errors

If you see CORS errors:
1. Check `backend/src/app.ts` - should allow `*.vercel.app` origins
2. Verify `FRONTEND_URL` is set correctly in backend environment variables

---

## Summary

✅ **Backend**: Deployed to Vercel → Connected to Aiven MySQL
✅ **Frontend**: Deployed to Vercel → Points to Backend URL
✅ **Database**: Aiven MySQL (already configured)

**Your complete stack is now live! 🚀**

