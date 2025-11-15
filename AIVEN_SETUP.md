# Aiven MySQL Setup Guide

## Step-by-Step: Connect Backend to Aiven MySQL

### Step 1: Create Aiven Account & Project

1. Go to https://console.aiven.io/signup
2. Sign up or log in
3. Click **"Create project"**
4. Name: `streamflix-backend`
5. Click **"Create project"**

### Step 2: Create MySQL Service

1. Click **"Create service"**
2. Service type: **MySQL**
3. Cloud provider: Choose one (AWS, GCP, Azure)
4. Region: Choose closest to you
5. Plan: Start with **Free** tier (1GB RAM) for testing
6. Service name: `streamflix-mysql`
7. Click **"Create service"**

⏳ Wait 2-3 minutes for service to be created...

### Step 3: Get Connection Details

1. Click on your MySQL service
2. Go to **"Overview"** tab
3. Scroll to **"Connection information"** section
4. Click **"Show credentials"** (or click "Copy connection string")

**You'll see:**
- Host: `streamflix-mysql-abc123.a.aivencloud.com`
- Port: `12345` (varies)
- Database name: `defaultdb`
- User: `avnadmin`
- Password: (click "Show" to reveal)

### Step 4: Build Connection String

Format:
```
mysql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=REQUIRED
```

Example:
```
mysql://avnadmin:mySecurePass123@streamflix-mysql-abc123.a.aivencloud.com:12345/defaultdb?sslmode=REQUIRED
```

**⚠️ IMPORTANT:** Must include `?sslmode=REQUIRED` at the end for SSL connection!

---

## Step 5: Test Connection Locally

1. Create `.env` file in `backend/`:
   ```env
   DATABASE_URL="mysql://avnadmin:PASSWORD@HOST:PORT/defaultdb?sslmode=REQUIRED"
   JWT_SECRET="your-secret-key-min-16-chars"
   ```

2. Test connection:
   ```bash
   cd backend
   npm install
   npm run prisma:generate
   npx prisma db pull  # Test connection
   ```

3. Run migrations:
   ```bash
   npx prisma migrate deploy
   ```

4. Seed database (optional):
   ```bash
   npm run prisma:seed
   ```

---

## Step 6: Configure Vercel Environment Variables

When deploying to Vercel:

1. Go to Vercel Dashboard → Your Backend Project
2. Settings → Environment Variables
3. Add:

| Name | Value | Environment |
|------|-------|-------------|
| `DATABASE_URL` | Your Aiven connection string | All |
| `JWT_SECRET` | Random secret (16+ chars) | All |
| `JWT_EXPIRES_IN` | `1h` | All |
| `REFRESH_TOKEN_TTL_DAYS` | `30` | All |
| `RAZORPAY_KEY_SECRET` | Your Razorpay secret | All |
| `FRONTEND_URL` | `https://grab-show.vercel.app` | Production |
| `NODE_ENV` | `production` | Production |

---

## Troubleshooting

### Connection Refused
- ✅ Check `?sslmode=REQUIRED` is in connection string
- ✅ Verify Aiven service is running
- ✅ Check firewall rules (should allow `0.0.0.0/0`)

### SSL Certificate Error
- ✅ Make sure `sslmode=REQUIRED` is included
- ✅ Some clients need `ssl=true` instead

### Authentication Failed
- ✅ Verify username is `avnadmin`
- ✅ Check password is correct (no spaces)
- ✅ Try resetting password in Aiven dashboard

### Database Not Found
- ✅ Use `defaultdb` as database name
- ✅ Or create a new database in Aiven console

---

## Quick Reference

**Connection String Template:**
```
mysql://avnadmin:YOUR_PASSWORD@YOUR_HOST:YOUR_PORT/defaultdb?sslmode=REQUIRED
```

**Find in Aiven:**
- Dashboard → Service → Overview → Connection information

**Test Locally:**
```bash
DATABASE_URL="mysql://..." npx prisma db pull
```

**Run Migrations:**
```bash
npx prisma migrate deploy
```

