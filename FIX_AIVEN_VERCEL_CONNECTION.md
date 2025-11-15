# Fix Aiven Connection with Vercel

## Problem
Your Vercel deployment is connecting to Railway instead of Aiven. This is because the `DATABASE_URL` environment variable in Vercel is set to a Railway connection string.

## Solution: Update Vercel Environment Variables

### Step 1: Get Your Aiven Connection String

1. Go to https://console.aiven.io
2. Log in to your account
3. Select your project (e.g., `streamflix-backend`)
4. Click on your MySQL service (e.g., `streamflix-mysql`)
5. Go to the **"Overview"** tab
6. Scroll to **"Connection information"** section
7. Click **"Show credentials"** or **"Copy connection string"**

You'll see:
- **Host**: `your-service-xxx.a.aivencloud.com`
- **Port**: `12345` (or similar)
- **Database name**: `defaultdb`
- **User**: `avnadmin`
- **Password**: (click "Show" to reveal)

### Step 2: Build Your Aiven Connection String

Format:
```
mysql://avnadmin:YOUR_PASSWORD@YOUR_HOST:YOUR_PORT/defaultdb?sslmode=REQUIRED
```

Example:
```
mysql://avnadmin:mySecurePass123@streamflix-mysql-abc123.a.aivencloud.com:12345/defaultdb?sslmode=REQUIRED
```

**⚠️ IMPORTANT**: 
- Must include `?sslmode=REQUIRED` at the end
- Replace `YOUR_PASSWORD`, `YOUR_HOST`, and `YOUR_PORT` with your actual values

### Step 3: Update Vercel Environment Variables

1. Go to https://vercel.com/dashboard
2. Select your **backend project**
3. Go to **Settings** → **Environment Variables**
4. Find the `DATABASE_URL` variable
5. Click on it to edit
6. **Replace the Railway connection string** with your Aiven connection string
7. Make sure it's set for **Production**, **Preview**, and **Development** environments
8. Click **Save**

### Step 4: Verify Other Environment Variables

While you're in Vercel Settings → Environment Variables, make sure you have:

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | **Aiven MySQL connection string** (not Railway!) | `mysql://avnadmin:pass@host:port/defaultdb?sslmode=REQUIRED` |
| `JWT_SECRET` | Random secret (min 16 chars) | `your-secret-key-here` |
| `JWT_EXPIRES_IN` | Token expiry | `1h` |
| `REFRESH_TOKEN_TTL_DAYS` | Refresh token expiry | `30` |
| `NODE_ENV` | Environment | `production` |
| `FRONTEND_URL` | Your frontend URL | `https://your-frontend.vercel.app` |
| `RAZORPAY_KEY_SECRET` | Razorpay secret (if using) | `your-razorpay-secret` |

### Step 5: Redeploy Your Backend

After updating the environment variable:

1. Go to **Deployments** tab in Vercel
2. Click **"Redeploy"** on the latest deployment
3. Or push a new commit to trigger a new deployment

### Step 6: Test the Connection

1. Wait for deployment to complete
2. Test the health endpoint:
   ```bash
   curl https://your-backend.vercel.app/healthz
   ```
   Should return: `{"status":"ok"}`

3. Check Vercel deployment logs:
   - Go to **Deployments** → Click on latest deployment → **Logs**
   - Look for any database connection errors
   - Should see successful Prisma client generation

### Step 7: Run Database Migrations (If Needed)

If your Aiven database is new or doesn't have tables yet:

1. **Option A: Run locally** (Recommended)
   ```bash
   cd backend
   # Create .env file with your Aiven connection string
   echo 'DATABASE_URL="mysql://avnadmin:PASSWORD@HOST:PORT/defaultdb?sslmode=REQUIRED"' > .env
   npm install
   npx prisma migrate deploy
   ```

2. **Option B: Add to Vercel build command**
   - Go to Vercel Settings → General
   - Update **Build Command** to:
     ```
     npm run build && npm run prisma:generate && npx prisma migrate deploy
     ```
   - Redeploy

## Troubleshooting

### Still seeing Railway connection?
- ✅ Double-check `DATABASE_URL` in Vercel (make sure you saved it)
- ✅ Make sure it's set for the correct environment (Production/Preview/Development)
- ✅ Clear browser cache and check again
- ✅ Redeploy after updating the variable

### Connection refused errors?
- ✅ Verify Aiven service is running (check Aiven dashboard)
- ✅ Check that `?sslmode=REQUIRED` is in the connection string
- ✅ Verify firewall rules in Aiven allow connections from `0.0.0.0/0`

### Authentication failed?
- ✅ Verify username is `avnadmin`
- ✅ Check password is correct (no extra spaces)
- ✅ Try resetting password in Aiven dashboard

### Database not found?
- ✅ Use `defaultdb` as database name
- ✅ Or create a new database in Aiven console

## Quick Checklist

- [ ] Got Aiven connection string from Aiven console
- [ ] Built connection string with `?sslmode=REQUIRED`
- [ ] Updated `DATABASE_URL` in Vercel (replaced Railway string)
- [ ] Set for all environments (Production, Preview, Development)
- [ ] Redeployed backend
- [ ] Tested health endpoint
- [ ] Checked deployment logs for errors
- [ ] Ran migrations if needed

## Need Help?

If you're still having issues:
1. Check Vercel deployment logs for specific error messages
2. Verify Aiven service status in Aiven dashboard
3. Test connection locally first with `.env` file
4. Compare your connection string format with the example above

