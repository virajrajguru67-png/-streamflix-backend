# Quick Start: Deploy Backend to Vercel with Aiven

## 🚀 Quick Setup (5 minutes)

### Step 1: Create Aiven MySQL Database (2 minutes)

1. Go to https://console.aiven.io/signup
2. Sign up/login
3. Create new project: "streamflix-backend"
4. Click **"Create service"** → Select **"MySQL"**
5. Choose free tier plan
6. Select region closest to you
7. Click **"Create service"**
8. Wait 2-3 minutes

### Step 2: Get Aiven Connection String (1 minute)

1. Click on your MySQL service
2. Go to **"Overview"** tab
3. Scroll to **"Connection information"**
4. Click **"Show credentials"**
5. Copy the connection string or build it:

**Format:**
```
mysql://avnadmin:YOUR_PASSWORD@YOUR_HOST:PORT/defaultdb?sslmode=REQUIRED
```

**Example:**
```
mysql://avnadmin:abc123XYZ@streamflix-mysql-xyz.a.aivencloud.com:12345/defaultdb?sslmode=REQUIRED
```

**Important:** Must include `?sslmode=REQUIRED` at the end!

### Step 3: Deploy to Vercel (2 minutes)

#### Option A: Via GitHub (Recommended)

1. **Push backend to GitHub**:
   ```bash
   cd backend
   git init
   git add .
   git commit -m "Ready for Vercel deployment"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Import to Vercel**:
   - Go to https://vercel.com/dashboard
   - Click **"Add New Project"**
   - Click **"Import Git Repository"**
   - Select your backend repository
   - Click **"Import"**

3. **Configure Project**:
   - **Framework Preset**: Other
   - **Root Directory**: Leave blank (or `backend` if repo root is parent)
   - **Build Command**: `npm run vercel-build`
   - **Install Command**: `npm install`
   - **Output Directory**: Leave blank

4. **Add Environment Variables** (Click "Environment Variables"):
   
   | Name | Value | Environment |
   |------|-------|-------------|
   | `DATABASE_URL` | Your Aiven connection string (with `?sslmode=REQUIRED`) | All |
   | `JWT_SECRET` | Random string (min 16 chars), e.g., `mySecretKey123456789` | All |
   | `JWT_EXPIRES_IN` | `1h` | All |
   | `REFRESH_TOKEN_TTL_DAYS` | `30` | All |
   | `RAZORPAY_KEY_SECRET` | Your Razorpay secret key | All |
   | `FRONTEND_URL` | `https://grab-show.vercel.app` | Production |
   | `NODE_ENV` | `production` | Production |

5. **Click "Deploy"**

#### Option B: Via Vercel CLI

```bash
cd backend
vercel login
vercel --prod
```

Add environment variables in Vercel dashboard after deployment.

### Step 4: Run Database Migrations

After deployment:

1. **Get Aiven connection string** (from Step 2)

2. **Run migrations locally** (connect to Aiven):
   ```bash
   cd backend
   # Create .env file with Aiven connection string
   echo 'DATABASE_URL="mysql://avnadmin:PASSWORD@HOST:PORT/defaultdb?sslmode=REQUIRED"' > .env
   
   # Install dependencies
   npm install
   
   # Run migrations
   npx prisma migrate deploy
   
   # Seed database (optional)
   npm run prisma:seed
   ```

3. **Or add to Vercel build command**:
   ```
   npm run vercel-build && npx prisma migrate deploy
   ```

### Step 5: Update Frontend API URL

1. **Get your backend URL** from Vercel (e.g., `https://streamflix-backend.vercel.app`)

2. **Update frontend environment variable**:
   - Go to your **frontend project** on Vercel
   - Settings → Environment Variables
   - Add/Update: `API_BASE_URL` = `https://streamflix-backend.vercel.app`
   - Redeploy frontend

3. **Or update HTML meta tag**:
   - Edit `flutter_demo/web/index.html`
   - Update: `<meta name="api-base-url" content="https://your-backend.vercel.app">`
   - Rebuild and redeploy

---

## ✅ Testing

### Test Backend:
```bash
curl https://your-backend.vercel.app/healthz
```
Should return: `{"status":"ok"}`

### Test Frontend Login:
1. Visit `https://grab-show.vercel.app`
2. Try to login
3. Should work! 🎉

---

## 🔧 Troubleshooting

### Database Connection Failed
- ✅ Check `DATABASE_URL` includes `?sslmode=REQUIRED`
- ✅ Verify Aiven service is running
- ✅ Check Aiven firewall allows connections (should be `0.0.0.0/0`)

### Prisma Errors
- ✅ Run `npm run prisma:generate` locally
- ✅ Check `DATABASE_URL` format is correct
- ✅ Run migrations: `npx prisma migrate deploy`

### CORS Errors
- ✅ Backend CORS already configured for `*.vercel.app`
- ✅ Check frontend URL matches your Vercel domain

---

## 📝 Environment Variables Summary

**Required:**
- `DATABASE_URL` - Aiven MySQL connection string
- `JWT_SECRET` - Random secret (16+ chars)

**Optional but Recommended:**
- `JWT_EXPIRES_IN` - Token expiry (`1h`)
- `REFRESH_TOKEN_TTL_DAYS` - Refresh token expiry (`30`)
- `RAZORPAY_KEY_SECRET` - Razorpay secret key
- `FRONTEND_URL` - Frontend URL for CORS/emails

---

## 🎯 Next Steps

1. ✅ Backend deployed to Vercel
2. ✅ Connected to Aiven MySQL
3. ✅ Frontend connected to backend
4. ✅ Test login
5. ✅ Configure Razorpay in Admin Settings
6. ✅ Add Razorpay URL to Razorpay dashboard

**Your backend will be live at:** `https://your-project.vercel.app`

