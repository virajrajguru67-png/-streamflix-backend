# Deploy Backend to Render.com (Recommended Alternative)

Render is easy to use, offers a free tier, and supports MySQL via external services.

## 🚀 Quick Deploy: Render.com (5 minutes)

### Step 1: Push Code to GitHub

```bash
cd backend
git init  # if not already a git repo
git add .
git commit -m "Ready for deployment"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### Step 2: Sign Up for Render

1. Go to https://render.com
2. Click **"Get Started"**
3. Sign up with GitHub (easiest option)
4. Authorize Render to access your repositories

### Step 3: Create Web Service

1. In Render Dashboard, click **"New +"**
2. Select **"Web Service"**
3. Click **"Connect account"** if not already connected
4. Select your repository
5. Render will auto-detect it's a Node.js app

### Step 4: Configure Web Service

Fill in the details:

- **Name**: `streamflix-backend` (or your choice)
- **Environment**: `Node`
- **Region**: Choose closest to you
- **Branch**: `main` (or your main branch)
- **Root Directory**: `backend` (if repo is monorepo, otherwise leave empty)
- **Runtime**: `Node 20` (or latest)
- **Build Command**: 
  ```bash
  npm install && npm run build && npm run prisma:generate
  ```
- **Start Command**: 
  ```bash
  npm run prisma:migrate:deploy && npm start
  ```
- **Plan**: `Free` (or choose paid plan for better performance)

### Step 5: Add Environment Variables

Scroll down to **"Environment Variables"** section → Click **"Add Environment Variable"**

Add these variables one by one:

```bash
# Required
NODE_ENV=production
PORT=10000
JWT_SECRET=<Generate a random secret: openssl rand -base64 32>
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_TTL_DAYS=30

# Database (see Step 6)
DATABASE_URL=mysql://...

# Your Vercel frontend
FRONTEND_URL=https://grab-show.vercel.app

# Razorpay
RAZORPAY_KEY_SECRET=your_razorpay_secret_key_here

# Optional - SMTP for emails
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM_EMAIL=noreply@streamflix.com
SMTP_FROM_NAME=StreamFlix Tickets
```

### Step 6: Setup MySQL Database

Render doesn't offer MySQL on free tier, so use one of these options:

#### Option A: PlanetScale (Recommended - Free MySQL)

1. Go to https://planetscale.com
2. Sign up with GitHub
3. Create a new database
4. Get connection string (Format: `mysql://username:password@host:port/database?sslaccept=strict`)
5. Copy it and paste as `DATABASE_URL` in Render environment variables

#### Option B: Use Render PostgreSQL (Requires schema update)

1. In Render Dashboard, click **"New +"** → **"PostgreSQL"**
2. Select **"Free"** plan
3. Wait for database to be created
4. Copy the **"Internal Database URL"** or **"External Database URL"**
5. Update your `DATABASE_URL` in environment variables

**Note**: If using PostgreSQL, you may need to update Prisma schema:
```prisma
datasource db {
  provider = "postgresql"  // Change from "mysql"
  url      = env("DATABASE_URL")
}
```

### Step 7: Deploy

1. Scroll down and click **"Create Web Service"**
2. Render will start building and deploying
3. Watch the logs - it usually takes 3-5 minutes
4. Wait for status to show **"Live"**

### Step 8: Get Your Backend URL

1. Once deployed, Render gives you a URL like:
   - `https://streamflix-backend.onrender.com`
2. Copy this URL - **This is your backend API URL!** ✅

### Step 9: Run Database Migrations

After first deployment:

1. Go to your service → **"Shell"** tab
2. Run these commands:
   ```bash
   npm run prisma:migrate:deploy
   npm run prisma:seed
   ```

Or add to start command (already included above).

### Step 10: Update Frontend

1. Go to Vercel: https://vercel.com/your-username/grab-show
2. **Settings** → **Environment Variables**
3. Add/Update: `API_BASE_URL` = `https://streamflix-backend.onrender.com`
4. Click **"Save"**
5. Go to **"Deployments"** → Click **"Redeploy"** on latest deployment

### Step 11: Test

1. Visit your backend health endpoint:
   ```
   https://streamflix-backend.onrender.com/healthz
   ```
   Should return: `{"status":"ok"}`

2. Test your frontend:
   - Visit your Vercel URL
   - Try logging in - it should work! ✅

---

## 🎯 Important Notes

### Free Tier Limitations
- Render free tier has **spinning down** - first request after idle may be slow (~30 seconds)
- Consider upgrading to paid plan for production

### Database Options
- **PlanetScale**: Free MySQL, perfect for your setup ✅
- **Render PostgreSQL**: Free, but requires schema changes
- **Other options**: Supabase, Neon (both PostgreSQL)

### Custom Domain
- Free tier doesn't support custom domains
- Paid plan ($7/month) supports custom domains

---

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Render account created
- [ ] Web service created
- [ ] MySQL database setup (PlanetScale or other)
- [ ] Environment variables configured
- [ ] Build command set: `npm install && npm run build && npm run prisma:generate`
- [ ] Start command set: `npm run prisma:migrate:deploy && npm start`
- [ ] Service deployed successfully
- [ ] Migrations run successfully
- [ ] Backend URL obtained
- [ ] Health check works: `/healthz` returns `{"status":"ok"}`
- [ ] Frontend `API_BASE_URL` updated in Vercel
- [ ] Frontend redeployed
- [ ] Login tested and working! ✅

---

## 🐛 Troubleshooting

### Build fails
- Check build logs in Render dashboard
- Ensure `build` script exists in `package.json`
- Verify all dependencies are in `dependencies` (not `devDependencies`)

### Database connection fails
- Verify `DATABASE_URL` is correct
- Check database service is running
- Ensure database allows connections from Render's IPs

### Service won't start
- Check logs in Render dashboard
- Verify `start` command is correct
- Ensure `PORT` environment variable is set (Render uses `PORT` automatically)

### Migrations not running
- Add `npm run prisma:migrate:deploy` to start command
- Or run manually via Shell tab

---

**Need help?** Check Render logs or visit Render's documentation: https://render.com/docs

