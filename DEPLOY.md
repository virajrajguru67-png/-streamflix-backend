# Deploy Backend to Production

This guide will help you deploy your backend to make it accessible from your Vercel-hosted frontend.

## 🚀 Quick Deploy: Railway (Recommended - 5 minutes)

Railway is the easiest option and offers free tier.

### Step 1: Prepare Your Repository

1. **Push your backend code to GitHub** (if not already):
   ```bash
   cd backend
   git init  # if not already a git repo
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/your-username/your-repo.git
   git push -u origin main
   ```

### Step 2: Deploy to Railway

1. **Sign up for Railway**: Go to https://railway.app
   - Click "Login" → "Sign up with GitHub"
   - Authorize Railway to access your GitHub account

2. **Create a New Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository (or create a new one for backend)

3. **Add MySQL Database**:
   - In your Railway project, click "+ New"
   - Select "Database" → "Add MySQL"
   - Railway will automatically create a MySQL database

4. **Configure Environment Variables**:
   - Click on your service → "Variables" tab
   - Add the following variables:

   ```
   NODE_ENV=production
   PORT=5000
   DATABASE_URL=<Railway will auto-generate this, or use the MySQL service URL>
   JWT_SECRET=<Generate a random secret: openssl rand -base64 32>
   JWT_EXPIRES_IN=1h
   REFRESH_TOKEN_TTL_DAYS=30
   FRONTEND_URL=https://grab-show.vercel.app
   RAZORPAY_KEY_SECRET=your_razorpay_secret_key
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   SMTP_FROM_EMAIL=noreply@streamflix.com
   SMTP_FROM_NAME=StreamFlix Tickets
   ```

5. **Link Database to Service**:
   - In your service, go to "Variables" tab
   - Railway should auto-inject `DATABASE_URL` from the MySQL service
   - If not, copy the MySQL connection string from the database service and paste it as `DATABASE_URL`

6. **Deploy**:
   - Railway will automatically detect Node.js and start building
   - Wait for deployment to complete (usually 2-3 minutes)
   - Check the logs to ensure it's running

7. **Get Your Backend URL**:
   - Click on your service → "Settings" → "Domains"
   - Railway will assign a domain like: `your-service.railway.app`
   - Or create a custom domain
   - Copy this URL - this is your backend API URL!

### Step 3: Run Database Migrations

1. **Via Railway CLI** (if you have it installed):
   ```bash
   railway login
   railway link
   railway run npm run prisma:migrate deploy
   railway run npm run prisma:seed
   ```

2. **Or via Railway Dashboard**:
   - Go to your service → "Deployments"
   - Find the latest deployment
   - Click "..." → "View Logs"
   - The migrations should run automatically from the start command

### Step 4: Update Frontend API URL

1. **Update Vercel Environment Variable**:
   - Go to your Vercel project: https://vercel.com/your-username/grab-show
   - Settings → Environment Variables
   - Add/Update: `API_BASE_URL` = `https://your-service.railway.app`
   - Save and redeploy

2. **Or Update HTML Meta Tag** (Alternative):
   - Edit `flutter_demo/web/index.html`
   - Update: `<meta name="api-base-url" content="https://your-service.railway.app">`
   - Rebuild and redeploy

---

## 🔄 Alternative: Render.com

### Step 1: Sign Up
1. Go to https://render.com
2. Sign up with GitHub

### Step 2: Create Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Select your backend directory
4. Configure:
   - **Name**: streamflix-backend
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build && npm run prisma:generate`
   - **Start Command**: `npm run prisma:migrate deploy && npm start`
   - **Plan**: Free

### Step 3: Add Environment Variables
Add the same environment variables as Railway above.

### Step 4: Create PostgreSQL Database
1. Click "New +" → "PostgreSQL"
2. Render provides free PostgreSQL (your code uses MySQL, so you may need to adjust DATABASE_URL format)

### Step 5: Deploy
- Render will automatically deploy
- Get your service URL from the dashboard

---

## 📝 Important Notes

### Database Setup
- **Railway**: Supports MySQL natively - perfect for your setup
- **Render**: Uses PostgreSQL - you may need to update your Prisma schema or use a MySQL service like PlanetScale

### Environment Variables Checklist
Make sure to set:
- ✅ `DATABASE_URL` - Database connection string
- ✅ `JWT_SECRET` - A secure random string (use `openssl rand -base64 32`)
- ✅ `FRONTEND_URL` - Your Vercel frontend URL
- ✅ `RAZORPAY_KEY_SECRET` - Your Razorpay secret key
- ✅ Other optional variables (SMTP, etc.)

### After Deployment

1. **Test Your Backend**:
   ```bash
   curl https://your-backend-url.railway.app/healthz
   ```
   Should return: `{"status":"ok"}`

2. **Update Frontend**:
   - Set `API_BASE_URL` in Vercel environment variables
   - Redeploy frontend

3. **Test Login**:
   - Visit your Vercel URL
   - Try logging in - it should work!

---

## 🐛 Troubleshooting

### Backend won't start
- Check logs in Railway/Render dashboard
- Ensure all environment variables are set
- Verify `DATABASE_URL` is correct

### Database connection fails
- Verify `DATABASE_URL` format: `mysql://user:password@host:port/database`
- Check if database service is running
- Ensure migrations have run: `npm run prisma:migrate deploy`

### CORS errors
- Backend CORS is already configured to allow `*.vercel.app` domains
- If still having issues, check the backend logs

### Still having issues?
- Check Railway/Render logs for specific error messages
- Verify all environment variables are set correctly
- Make sure database is accessible

---

## 🎯 Quick Checklist

- [ ] Backend code pushed to GitHub
- [ ] Railway/Render account created
- [ ] Project created and linked to GitHub
- [ ] Database service added
- [ ] Environment variables configured
- [ ] Backend deployed successfully
- [ ] Migrations run successfully
- [ ] Backend URL obtained
- [ ] Frontend `API_BASE_URL` updated
- [ ] Frontend redeployed
- [ ] Login tested and working

---

**Need Help?** Check the logs in your deployment platform's dashboard for specific error messages.

