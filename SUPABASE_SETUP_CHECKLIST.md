# Supabase Setup Checklist ✓

## Pre-Migration Checklist

- [ ] Back up your MySQL database from XAMPP
- [ ] Have your Supabase project URL and anon key ready
- [ ] Node.js v14+ installed
- [ ] npm or yarn available

## Step-by-Step Setup

### Step 1: Supabase Project Setup
- [ ] Log in to [Supabase](https://app.supabase.com)
- [ ] Copy your **Project URL** (looks like: `https://ulgcfvvtxqzpodlzpdth.supabase.co`)
  - Location: Settings → General
- [ ] Copy your **Anon Key** (public key for client access)
  - Location: Settings → API → `anon` key
- [ ] Copy the key to a safe place (we'll use it soon)

### Step 2: Create Database Schema
- [ ] In Supabase Dashboard, go to **SQL Editor**
- [ ] Click **New Query**
- [ ] Open the file: `database/supabase-schema.sql`
- [ ] Copy all the SQL code
- [ ] Paste into the Supabase SQL Editor
- [ ] Click **Run** button
- [ ] Wait for completion ✓

### Step 3: Verify Schema Created
- [ ] In Supabase Dashboard, go to **Tables**
- [ ] Verify you can see these tables:
  - [ ] profile
  - [ ] projects
  - [ ] blog_posts
  - [ ] skills
  - [ ] experience
  - [ ] certifications
  - [ ] contact_messages
  - [ ] testimonials
  - [ ] project_images
  - [ ] project_technologies
  - [ ] site_settings

### Step 4: Migrate Your Data (if you have existing data)

#### Option A: CSV Import (Simple Tables)
- [ ] Export each table from MySQL as CSV
- [ ] In Supabase, go to **Tables**
- [ ] Click the table, then **Import data** → **CSV**
- [ ] Upload your CSV file
- [ ] Map columns if needed, then import

#### Option B: Manual Entry
- [ ] Use Supabase Studio table editor
- [ ] Add your profile data
- [ ] Add your skills
- [ ] Add your projects, etc.

#### Option C: Data Migration Script (Advanced)
- [ ] Use a tool like DBeaver or MySQL Workbench
- [ ] Export from MySQL in SQL format
- [ ] Adjust SQL syntax for PostgreSQL
- [ ] Import to Supabase

### Step 5: Backend Configuration

#### Create `.env` File
- [ ] Go to `backend/` folder
- [ ] Create a new file called `.env`
- [ ] Copy contents from `.env.example`
- [ ] Update these values:
  ```
  SUPABASE_URL=https://your-project-url.supabase.co
  SUPABASE_KEY=your-anon-key-here
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

#### Install Dependencies
- [ ] Open terminal/cmd in `backend/` folder
- [ ] Run: `npm install`
- [ ] Wait for completion

### Step 6: Start Backend
- [ ] In terminal, run: `npm run dev`
- [ ] You should see:
  ```
  ✅ Supabase PostgreSQL connected
  🚀 Backend API running on http://localhost:5000
  ```
- [ ] If you see errors, check the troubleshooting section below

### Step 7: Test Connection
- [ ] Open browser, go to: `http://localhost:5000/health`
- [ ] You should see: `{"status":"ok","timestamp":"..."}`
- [ ] Test API endpoints:
  - [ ] `http://localhost:5000/api/profile`
  - [ ] `http://localhost:5000/api/skills`
  - [ ] `http://localhost:5000/api/projects`
  - [ ] `http://localhost:5000/api/blog`

### Step 8: Frontend Update (if needed)
- [ ] Frontend already has Supabase config in `supabase.js`
- [ ] No changes needed for frontend - it already uses Supabase
- [ ] Just make sure backend is running for API calls

## Connection Strings

### Your Credentials (Save Somewhere Safe)
```
SUPABASE_URL: ___________________________
SUPABASE_KEY: ___________________________
```

## Troubleshooting

### ❌ "Missing Supabase credentials"
**Solution:**
1. Check `.env` file exists in `backend/` folder
2. Make sure `SUPABASE_URL` and `SUPABASE_KEY` are filled in
3. Restart the backend: `npm run dev`

### ❌ "Supabase connection failed"
**Check these:**
1. Are your credentials correct? (Copy from Supabase dashboard again)
2. Is Supabase service running? (Check https://status.supabase.com)
3. Did you import the schema? (Check Tables in Supabase)
4. Is your network working? (Try `ping google.com`)

### ❌ API returns empty results
**Possible issues:**
1. Data hasn't been migrated yet
2. Table names are wrong
3. Row Level Security is blocking access

**Solution:**
1. Check Supabase Studio - does your table have data?
2. Go to Supabase → RLS → Check if RLS is enabled
3. If RLS is on, create policies:
   - `SELECT` - Allow public access
   - `INSERT` - Allow for contact_messages

### ❌ CORS Error in frontend
**Solution:**
1. Make sure backend `.env` has correct `CORS_ORIGIN`
2. For localhost: `CORS_ORIGIN=http://localhost:3000`
3. For production: `CORS_ORIGIN=https://yourdomain.com`

### ❌ "Port 5000 is already in use"
**Solution:**
1. Kill the process using port 5000, or
2. Change PORT in `.env` to 5001: `PORT=5001`
3. Restart backend

## Quick Commands Reference

```bash
# Install dependencies
cd backend
npm install

# Start development server
npm run dev

# Test connection
curl http://localhost:5000/health

# Get all profiles
curl http://localhost:5000/api/profile

# Get all skills
curl http://localhost:5000/api/skills

# Get all projects
curl http://localhost:5000/api/projects

# Get published blog posts
curl http://localhost:5000/api/blog

# Submit contact form
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","message":"Hello world"}'
```

## Important Security Notes

⚠️ **DO NOT:**
- [ ] Commit `.env` file to git (it's in `.gitignore`)
- [ ] Share your `SUPABASE_KEY` publicly
- [ ] Use your service role key in frontend (only anon key)

✅ **DO:**
- [ ] Keep credentials in `.env` file
- [ ] Use `.env` for local development
- [ ] Set environment variables in production (Vercel, Netlify, etc.)
- [ ] Rotate keys periodically in Supabase dashboard

## Performance Tips

1. **Enable Indexes** - Already done in schema ✓
2. **Use RLS** - For production, enable Row Level Security
3. **Monitor Queries** - Check Supabase logs for slow queries
4. **Cache Results** - Use Redis if needed

## Next Steps After Setup

1. ✓ Test all API endpoints
2. ✓ Verify data is showing correctly
3. [ ] Deploy backend to production (Render, Heroku, AWS, etc.)
4. [ ] Deploy frontend (Vercel, Netlify, etc.)
5. [ ] Set up monitoring/logging
6. [ ] Configure custom domain (optional)

## Need Help?

- 📚 [Supabase Docs](https://supabase.com/docs)
- 🐛 [Supabase GitHub Issues](https://github.com/supabase/supabase/issues)
- 💬 [Supabase Discord Community](https://discord.supabase.com)
- 📖 [PostgreSQL Docs](https://www.postgresql.org/docs/)

---

**Status:** Ready to go! 🚀

Once you complete these steps, your application will be fully connected to Supabase PostgreSQL.
