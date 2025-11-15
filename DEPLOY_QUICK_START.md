# Quick Start: Deploy Backend in 5 Minutes 🚀

## Option 1: Railway (Easiest - Recommended)

### Step 1: Push Code to GitHub
```bash
cd backend
git init  # if not already
git add .
git commit -m "Ready for deployment"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### Step 2: Deploy on Railway
1. Go to https://railway.app → Login with GitHub
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your repository
4. Railway auto-detects Node.js ✅

### Step 3: Add Database
1. In Railway project, click **"+ New"** → **"Database"** → **"Add MySQL"**
2. Railway creates database automatically ✅

### Step 4: Add Environment Variables
Click your service → **"Variables"** tab → Add these:

```bash
# Required
JWT_SECRET=your-random-secret-here  # Generate: openssl rand -base64 32
DATABASE_URL=mysql://...  # Railway auto-generates this - copy from MySQL service
NODE_ENV=production
PORT=5000

# Your Vercel frontend
FRONTEND_URL=https://grab-show.vercel.app

# Razorpay
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Optional - SMTP for emails
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Step 5: Deploy & Get URL
1. Railway automatically builds and deploys
2. Go to **"Settings"** → **"Domains"**
3. Copy your URL: `https://your-service.railway.app`
4. **This is your backend API URL!** ✅

### Step 6: Run Migrations
1. Click **"Variables"** tab → Click **"Deploy"** button (refresh)
2. Check logs - migrations run automatically
3. Or manually: In service → **"Deployments"** → Click latest → **"Run Command"** → 
   ```bash
   npm run prisma:migrate:deploy && npm run prisma:seed
   ```

### Step 7: Update Frontend
1. Go to Vercel: https://vercel.com/your-username/grab-show
2. **Settings** → **Environment Variables**
3. Add: `API_BASE_URL` = `https://your-service.railway.app`
4. **Save** → **Redeploy** your frontend
5. Done! ✅

---

## Option 2: Render.com

1. Go to https://render.com → Sign up with GitHub
2. **"New +"** → **"Web Service"** → Connect GitHub repo
3. Configure:
   - **Root Directory**: `backend` (if repo is monorepo)
   - **Build Command**: `npm install && npm run build && npm run prisma:generate`
   - **Start Command**: `npm run prisma:migrate:deploy && npm start`
4. Add environment variables (same as Railway)
5. **"New +"** → **"PostgreSQL"** (or use PlanetScale for MySQL)
6. Deploy and get URL
7. Update frontend `API_BASE_URL`

---

## ⚡ Super Quick: Use Existing Deployment

If you just want to test quickly, you can also:

1. **Keep backend on localhost** and use **ngrok**:
   ```bash
   ngrok http 5000
   ```
   Use the ngrok HTTPS URL as your `API_BASE_URL` in Vercel

2. **Or use a tunnel service** like localtunnel:
   ```bash
   npx localtunnel --port 5000
   ```

**Note**: These are temporary - use Railway/Render for production! ✅

---

## 🎯 After Deployment Checklist

- [ ] Backend deployed and running
- [ ] Database migrations completed
- [ ] Backend URL obtained (e.g., `https://xxx.railway.app`)
- [ ] Test backend: `curl https://xxx.railway.app/healthz` → Should return `{"status":"ok"}`
- [ ] `API_BASE_URL` set in Vercel environment variables
- [ ] Frontend redeployed on Vercel
- [ ] Login tested and working! ✅

---

## 📞 Need Help?

- Check Railway/Render logs for errors
- Verify all environment variables are set
- Test backend health endpoint
- Check frontend browser console for API errors

