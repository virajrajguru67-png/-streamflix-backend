# 🚀 Deploy to Vercel NOW - Step by Step

## ✅ Repository Status
✅ Your backend is now at: https://github.com/virajrajguru67-png/-streamflix-backend.git
✅ All files are committed and pushed

---

## Step 1: Get Your Aiven Database Connection String

1. Go to: https://console.aiven.io/
2. Login to your account
3. Select your **MySQL service**
4. Click on **"Overview"** tab
5. Find **"Connection information"** section
6. Look for **"Connection string (Prisma)"** or copy these values:
   - Host
   - Port
   - Database name
   - User
   - Password

**Your connection string should look like:**
```
mysql://avnadmin:YOUR_PASSWORD@HOST:PORT/DATABASE_NAME?sslmode=REQUIRED
```

**Example:**
```
mysql://avnadmin:ABC123xyz@mysql-1122aad5-virajrajguru67-55a0.k.aivencloud.com:11999/defaultdb?sslmode=REQUIRED
```

📝 **Copy this connection string** - you'll need it in Step 3!

---

## Step 2: Deploy Backend to Vercel

### 2.1 Import Repository

1. Go to: https://vercel.com/dashboard
2. Click **"Add New Project"** (top right)
3. Click **"Import Git Repository"**
4. If GitHub is not connected:
   - Click **"Configure GitHub App"**
   - Authorize Vercel
   - Grant access to repositories
5. Search for: `-streamflix-backend`
6. Click **"Import"** next to your repository

### 2.2 Configure Project

**Project Name**: `streamflix-backend` (or leave default)

**Root Directory**: Leave blank (or click "Edit" and set to `/`)

**Framework Preset**: **Other**

**Build and Output Settings** (click "Override"):
- **Build Command**: `npm run vercel-build`
- **Install Command**: `npm install`
- **Output Directory**: Leave blank
- **Development Command**: Leave blank

### 2.3 Add Environment Variables

Click **"Environment Variables"** and add these one by one:

#### Required Variables:

1. **DATABASE_URL**
   - Value: Your Aiven connection string (from Step 1)
   - Example: `mysql://avnadmin:PASSWORD@HOST:PORT/defaultdb?sslmode=REQUIRED`
   - Environment: ✅ Production ✅ Preview ✅ Development

2. **JWT_SECRET**
   - Value: Generate a random secret (at least 16 characters)
   - Example: `your-super-secret-jwt-key-12345-change-me`
   - Environment: ✅ All

3. **JWT_EXPIRES_IN**
   - Value: `1h`
   - Environment: ✅ All

4. **REFRESH_TOKEN_TTL_DAYS**
   - Value: `30`
   - Environment: ✅ All

5. **RAZORPAY_KEY_SECRET**
   - Value: Your Razorpay secret key (from Razorpay dashboard)
   - Environment: ✅ All

6. **FRONTEND_URL**
   - Value: `https://grab-show.vercel.app`
   - Environment: ✅ Production only

7. **NODE_ENV**
   - Value: `production`
   - Environment: ✅ Production only

8. **PRISMA_CLI_BINARY_TARGETS**
   - Value: `rhel-openssl-1.0.x`
   - Environment: ✅ All

### 2.4 Deploy!

1. Click **"Deploy"** button (bottom right)
2. Wait for deployment (takes 2-3 minutes)
3. Watch the build logs

### 2.5 Get Your Backend URL

After deployment succeeds, you'll see:
- ✅ **Production**: `https://-streamflix-backend.vercel.app` (or similar)
- 📝 **Copy this URL!** You need it for Step 3.

---

## Step 3: Update Frontend to Use Backend

### 3.1 Set Environment Variable in Frontend

1. Go to: https://vercel.com/dashboard
2. Find your **frontend project** (`grab-show`)
3. Click **Settings** → **Environment Variables**
4. Click **"Add New"**
5. Enter:
   - **Key**: `API_BASE_URL`
   - **Value**: Your backend URL from Step 2.5
     - Example: `https://-streamflix-backend.vercel.app`
   - **Environment**: ✅ Production ✅ Preview ✅ Development
6. Click **"Save"**

### 3.2 Redeploy Frontend

1. Go to **Deployments** tab
2. Click **⋯** (three dots) on the latest deployment
3. Click **"Redeploy"**
4. Select **"Use existing Build Cache"** or **"Rebuild"**
5. Click **"Redeploy"**
6. Wait for deployment to complete

---

## Step 4: Test Everything! 🎉

### Test Backend

1. Open browser and visit: `https://your-backend-url.vercel.app/healthz`
2. You should see:
   ```json
   {"status":"ok","timestamp":"..."}
   ```

### Test Frontend Login

1. Visit: https://grab-show.vercel.app
2. Click **"Sign In"**
3. Enter:
   - Email: `admin@developer.com`
   - Password: `Admin@123`
4. Click **"Sign in"**
5. Should login successfully! ✅

### Check Browser Console

1. Open browser DevTools (F12)
2. Go to **Network** tab
3. Try to login
4. You should see requests to: `https://your-backend-url.vercel.app/auth/login`
5. ✅ Success = 200 status code

---

## Troubleshooting

### ❌ Backend deployment fails

1. **Check build logs** in Vercel
2. **Verify DATABASE_URL** format (must include `?sslmode=REQUIRED`)
3. **Check environment variables** are all set
4. **Ensure migrations are pushed** to GitHub

### ❌ Frontend still shows localhost:5000

1. **Verify `API_BASE_URL`** is set in frontend Vercel project
2. **Redeploy frontend** after adding environment variable
3. **Clear browser cache** (Ctrl+Shift+Del)

### ❌ Database connection error

1. **Check Aiven connection string** format
2. **Verify SSL is enabled** (`?sslmode=REQUIRED`)
3. **Check Aiven service is running** in console

### ❌ CORS error

1. **Verify `FRONTEND_URL`** is set in backend environment variables
2. **Check backend CORS config** allows `*.vercel.app` domains

---

## ✅ Success Checklist

- [ ] Backend deployed to Vercel
- [ ] Backend URL is working (`/healthz` returns OK)
- [ ] Frontend environment variable `API_BASE_URL` is set
- [ ] Frontend redeployed
- [ ] Login works on https://grab-show.vercel.app
- [ ] Browser console shows API calls to Vercel backend

---

## 🎯 What's Next?

Your complete stack is now live:
- ✅ **Frontend**: https://grab-show.vercel.app
- ✅ **Backend**: https://your-backend-url.vercel.app
- ✅ **Database**: Aiven MySQL

**You're all set! 🚀**

