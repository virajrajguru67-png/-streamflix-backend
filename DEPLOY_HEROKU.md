# Deploy Backend to Heroku

Heroku is a popular platform that offers easy deployment with PostgreSQL databases.

## 🚀 Quick Deploy: Heroku (5 minutes)

### Step 1: Install Heroku CLI

**Windows:**
- Download: https://devcenter.heroku.com/articles/heroku-cli
- Or use: `choco install heroku-cli` (with Chocolatey)
- Or: `winget install Heroku.HerokuCLI`

**Mac:**
```bash
brew tap heroku/brew && brew install heroku
```

**Linux:**
```bash
curl https://cli-assets.heroku.com/install.sh | sh
```

### Step 2: Login to Heroku

```bash
heroku login
```

This opens a browser - click "Log in" to authenticate.

### Step 3: Create Heroku App

```bash
cd backend
heroku create streamflix-backend
```

This creates an app and gives you a URL like: `https://streamflix-backend.herokuapp.com`

### Step 4: Add MySQL Add-on

Heroku offers PostgreSQL by default, but for MySQL:

**Option A: Use ClearDB (MySQL on Heroku)**
```bash
heroku addons:create cleardb:ignite --app streamflix-backend
```

**Option B: Use JawsDB (MySQL on Heroku)**
```bash
heroku addons:create jawsdb:kitefin --app streamflix-backend
```

Then get connection string:
```bash
heroku config:get DATABASE_URL --app streamflix-backend
```

### Step 5: Configure Environment Variables

```bash
# Set all environment variables
heroku config:set NODE_ENV=production --app streamflix-backend
heroku config:set JWT_SECRET=$(openssl rand -base64 32) --app streamflix-backend
heroku config:set JWT_EXPIRES_IN=1h --app streamflix-backend
heroku config:set REFRESH_TOKEN_TTL_DAYS=30 --app streamflix-backend
heroku config:set FRONTEND_URL=https://grab-show.vercel.app --app streamflix-backend
heroku config:set RAZORPAY_KEY_SECRET=your_razorpay_secret --app streamflix-backend

# Optional SMTP
heroku config:set SMTP_HOST=smtp.gmail.com --app streamflix-backend
heroku config:set SMTP_PORT=587 --app streamflix-backend
heroku config:set SMTP_SECURE=false --app streamflix-backend
heroku config:set SMTP_USER=your-email@gmail.com --app streamflix-backend
heroku config:set SMTP_PASS=your-app-password --app streamflix-backend
```

**Note**: `DATABASE_URL` is automatically set by the add-on.

### Step 6: Create Procfile

Create `backend/Procfile` (no extension):
```
web: npm run prisma:migrate:deploy && npm start
release: npm run prisma:migrate:deploy
```

### Step 7: Deploy

```bash
# If not already a git repo
git init
git add .
git commit -m "Initial commit"

# Deploy to Heroku
heroku git:remote -a streamflix-backend
git push heroku main
```

### Step 8: Run Migrations

```bash
heroku run npm run prisma:migrate:deploy --app streamflix-backend
heroku run npm run prisma:seed --app streamflix-backend
```

### Step 9: Get Your Backend URL

```bash
heroku open --app streamflix-backend
```

Or check: `https://streamflix-backend.herokuapp.com`

### Step 10: Update Frontend

1. Go to Vercel: https://vercel.com/your-username/grab-show
2. **Settings** → **Environment Variables**
3. Add: `API_BASE_URL` = `https://streamflix-backend.herokuapp.com`
4. Save and redeploy

---

## 🎯 Important Notes

### Free Tier
- Heroku no longer offers free tier (discontinued in Nov 2022)
- Requires paid plan starting at $5/month
- **Consider Render instead if you want free tier**

### Database
- ClearDB/JawsDB free tier has limited connections
- Consider PostgreSQL (free on Heroku) and update Prisma schema

---

**Alternative**: Use Render.com for free tier deployment (see DEPLOY_RENDER.md)

