# Deploy Backend to Vercel with Aiven MySQL

This guide will help you deploy your Express backend to Vercel and connect it to an Aiven MySQL database.

## Prerequisites

1. Vercel account: https://vercel.com/signup
2. Aiven account: https://console.aiven.io/signup
3. Git repository for your backend (GitHub, GitLab, or Bitbucket)

---

## Step 1: Set Up Aiven MySQL Database

### 1.1 Create Aiven Account & Project
1. Go to https://console.aiven.io/signup
2. Sign up or log in
3. Create a new project (e.g., "streamflix-backend")

### 1.2 Create MySQL Service
1. Click **"Create service"**
2. Select **"MySQL"**
3. Choose a plan (Free tier available for testing)
4. Select cloud provider and region (choose closest to you)
5. Service name: `streamflix-mysql`
6. Click **"Create service"**

Wait 2-3 minutes for the service to be created.

### 1.3 Get Connection Details
1. Go to your MySQL service dashboard
2. Click on **"Overview"** tab
3. Find **"Connection information"** section
4. Copy the following:
   - **Host**: Something like `your-service.a.aivencloud.com`
   - **Port**: Usually `12345` or similar
   - **Database name**: Usually `defaultdb`
   - **User**: Usually `avnadmin`
   - **Password**: Click "Show" to reveal

### 1.4 Format Connection String
Create a MySQL connection string:
```
mysql://avnadmin:YOUR_PASSWORD@YOUR_HOST:PORT/defaultdb?sslmode=REQUIRED
```

Example:
```
mysql://avnadmin:mySecurePassword123@streamflix-mysql-abc123.a.aivencloud.com:12345/defaultdb?sslmode=REQUIRED
```

**Important**: Add `?sslmode=REQUIRED` at the end for SSL connection.

---

## Step 2: Deploy Backend to Vercel

### 2.1 Install Vercel CLI (Optional)
```bash
npm install -g vercel
```

### 2.2 Prepare Backend for Vercel

The backend is already configured with:
- ✅ `api/index.ts` - Vercel serverless function wrapper
- ✅ `vercel.json` - Vercel configuration
- ✅ Express app ready for serverless

### 2.3 Deploy via GitHub (Recommended)

1. **Push backend to GitHub**:
   ```bash
   cd backend
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Connect to Vercel**:
   - Go to https://vercel.com/dashboard
   - Click **"Add New Project"**
   - Click **"Import Git Repository"**
   - Select your backend repository
   - Click **"Import"**

3. **Configure Project**:
   - **Framework Preset**: Other
   - **Root Directory**: `backend` (if repo root is parent folder) or leave blank if repo root is backend folder
   - **Build Command**: `npm run build && npm run prisma:generate`
   - **Output Directory**: Leave blank (not needed for serverless)
   - **Install Command**: `npm install`

4. **Add Environment Variables**:
   Click **"Environment Variables"** and add:

   | Name | Value | Environment |
   |------|-------|-------------|
   | `DATABASE_URL` | Your Aiven connection string | Production, Preview, Development |
   | `JWT_SECRET` | A random secret string (min 16 chars) | Production, Preview, Development |
   | `JWT_EXPIRES_IN` | `1h` | Production, Preview, Development |
   | `REFRESH_TOKEN_TTL_DAYS` | `30` | Production, Preview, Development |
   | `RAZORPAY_KEY_SECRET` | Your Razorpay secret key | Production, Preview, Development |
   | `NODE_ENV` | `production` | Production |
   | `FRONTEND_URL` | Your Vercel frontend URL (e.g., `https://grab-show.vercel.app`) | Production, Preview |

   Example `DATABASE_URL`:
   ```
   mysql://avnadmin:password@host:port/defaultdb?sslmode=REQUIRED
   ```

5. **Click "Deploy"**

### 2.4 Deploy via Vercel CLI (Alternative)

```bash
cd backend
vercel login
vercel --prod
```

When prompted, add environment variables or set them later in Vercel dashboard.

---

## Step 3: Run Prisma Migrations on Aiven

After deployment, you need to run Prisma migrations to create database tables.

### Option 1: Run Migrations Locally (Connect to Aiven)

1. **Set local DATABASE_URL**:
   Create `.env` file in `backend/`:
   ```env
   DATABASE_URL="mysql://avnadmin:YOUR_PASSWORD@YOUR_HOST:PORT/defaultdb?sslmode=REQUIRED"
   ```

2. **Run migrations**:
   ```bash
   cd backend
   npm install
   npx prisma migrate deploy
   ```

3. **Seed database** (optional):
   ```bash
   npm run prisma:seed
   ```

### Option 2: Use Vercel Build Command

Add migration step to Vercel build command:
```
npm run build && npm run prisma:generate && npx prisma migrate deploy
```

**Note**: Make sure `DATABASE_URL` is set in Vercel environment variables.

---

## Step 4: Update Frontend to Use Backend URL

### 4.1 Get Your Backend URL

After deployment, Vercel will give you a URL like:
```
https://your-backend-project.vercel.app
```

### 4.2 Update Frontend Environment Variable

1. Go to your **frontend project** on Vercel
2. Go to **Settings** → **Environment Variables**
3. Add/Update:
   - **Name**: `API_BASE_URL`
   - **Value**: `https://your-backend-project.vercel.app`
   - **Environment**: Production, Preview, Development

### 4.3 Rebuild Frontend

1. Go to **Deployments** tab
2. Click **"Redeploy"** on latest deployment
3. Or push a new commit to trigger rebuild

---

## Step 5: Test Your Deployment

### 5.1 Test Backend Health Check
```bash
curl https://your-backend-project.vercel.app/healthz
```

Should return: `{"status":"ok"}`

### 5.2 Test Frontend Login
1. Visit your frontend URL: `https://grab-show.vercel.app`
2. Try to login
3. Check browser console for any errors

---

## Troubleshooting

### Issue: Database Connection Failed
**Solution**:
- Check `DATABASE_URL` format in Vercel environment variables
- Ensure `?sslmode=REQUIRED` is added to connection string
- Verify Aiven service is running
- Check Aiven firewall rules (should allow connections from anywhere: `0.0.0.0/0`)

### Issue: Prisma Client Not Generated
**Solution**:
- Add `npm run prisma:generate` to Vercel build command
- Or run locally and commit `node_modules/.prisma` folder

### Issue: Migrations Not Running
**Solution**:
- Add `npx prisma migrate deploy` to build command
- Or run migrations manually locally with Aiven connection string

### Issue: CORS Errors
**Solution**:
- Backend CORS is already configured for `*.vercel.app` domains
- Check that frontend URL is in allowed origins

---

## Quick Reference

### Aiven MySQL Connection String Format:
```
mysql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=REQUIRED
```

### Vercel Environment Variables Needed:
- `DATABASE_URL` - Aiven MySQL connection string
- `JWT_SECRET` - Random secret (min 16 chars)
- `JWT_EXPIRES_IN` - Token expiry (e.g., `1h`)
- `REFRESH_TOKEN_TTL_DAYS` - Refresh token expiry (e.g., `30`)
- `RAZORPAY_KEY_SECRET` - Razorpay secret key
- `FRONTEND_URL` - Your frontend Vercel URL

### Vercel Build Command:
```
npm run build && npm run prisma:generate
```

### Run Migrations Locally:
```bash
DATABASE_URL="mysql://..." npx prisma migrate deploy
```

---

## Next Steps

1. ✅ Set up Aiven MySQL
2. ✅ Deploy backend to Vercel
3. ✅ Run Prisma migrations
4. ✅ Update frontend API URL
5. ✅ Test login functionality
6. ✅ Configure Razorpay keys in Admin Settings
7. ✅ Add Razorpay URL to Razorpay dashboard

---

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check Aiven service status
3. Verify environment variables are set correctly
4. Test database connection locally first

