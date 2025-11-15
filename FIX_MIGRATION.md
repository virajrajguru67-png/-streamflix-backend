# Fix Failed Migration - Step by Step

The migration partially applied - some tables were created before it failed. We need to clean up and rerun.

## Option 1: Mark Migration as Applied (If Tables Are Correct)

If the tables from `20251111054336_admin_crud` migration already exist and are correctly structured:

```bash
npx prisma migrate resolve --applied 20251111054336_admin_crud
```

Then continue with remaining migrations:
```bash
npx prisma migrate deploy
```

## Option 2: Reset Database (Development Only - Will Delete All Data!)

**⚠️ WARNING: This will delete ALL data in the database!**

```bash
npx prisma migrate reset
```

Then apply all migrations:
```bash
npx prisma migrate deploy
```

## Option 3: Manual Fix (Recommended for Production)

If you need to keep data:

1. Check which tables exist:
```bash
# Connect to your database and run:
SHOW TABLES;
```

2. If `Movie`, `PlatformSettings`, etc. tables exist:
   - Check if they have the correct structure
   - If `address` column has a default value, remove it:
   
   ```sql
   ALTER TABLE PlatformSettings MODIFY COLUMN address TEXT NULL;
   ```

3. Then mark migration as applied:
```bash
npx prisma migrate resolve --applied 20251111054336_admin_crud
```

4. Continue with remaining migrations:
```bash
npx prisma migrate deploy
```

## Quick Fix (Recommended)

Since you're setting up a new Aiven database, the easiest is to reset:

```bash
# This will drop all tables and recreate them
npx prisma migrate reset

# Then seed if needed
npm run prisma:seed
```

---

**Which option should we use?**
- Development/New database → Option 2 (Reset)
- Production with data → Option 3 (Manual Fix)

