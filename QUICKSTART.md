# 🚀 Quickstart: Supabase Migration

**TL;DR** - Get your app running in 5 minutes

---

## Step 1: Get Supabase Credentials (2 min)

1. Go to https://app.supabase.com
2. Find your project
3. Copy these from **Settings → API**:
   - `Project URL` (e.g., `https://xxx.supabase.co`)
   - `anon` key

---

## Step 2: Create Database (1 min)

1. In Supabase, click **SQL Editor**
2. Click **New Query**
3. Copy all content from: `database/supabase-schema.sql`
4. Paste it → Click **Run**
5. Wait ✓

---

## Step 3: Setup Backend (2 min)

**Terminal:**
```bash
cd backend
npm install
```

**Create `.env` file in `backend/` folder:**
```
SUPABASE_URL=https://your-url.supabase.co
SUPABASE_KEY=your-anon-key
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=your-email@gmail.com
EMAIL_TO=your-email@gmail.com
```

---

## Step 4: Run Backend

**Terminal:**
```bash
npm run dev
```

**Expected output:**
```
✅ Supabase PostgreSQL connected
🚀 Backend API running on http://localhost:5000
```

---

## Step 5: Test

**Browser or Terminal:**
```bash
# Health check
curl http://localhost:5000/health

# Get data
curl http://localhost:5000/api/profile
curl http://localhost:5000/api/skills
curl http://localhost:5000/api/projects
```

---

## ✅ Done!

Your app is now using Supabase PostgreSQL!

---

## 📚 More Info

- **Setup Details:** `SUPABASE_SETUP_CHECKLIST.md`
- **Full Migration Guide:** `MIGRATION_GUIDE.md`
- **All Changes:** `CHANGES_COMPLETE.md`

---

## 🆘 Issues?

Check troubleshooting in `MIGRATION_GUIDE.md` or `SUPABASE_SETUP_CHECKLIST.md`
