# 🔧 Vercel Deployment Fix

## Problem
Your Vercel deployment was crashing with `FUNCTION_INVOCATION_FAILED` error because:

1. **Credentials were hardcoded** in code (security issue & won't work on Vercel)
2. **Missing environment variables** on Vercel
3. **Server wasn't properly configured** for serverless functions

## ✅ What I Fixed

### 1. Fixed `database.js`
- ❌ Removed hardcoded Supabase credentials
- ✅ Now uses environment variables: `SUPABASE_URL` and `SUPABASE_KEY`
- ✅ Won't crash if credentials are missing (will just log a warning)

### 2. Fixed `server.js`
- ❌ Removed `.listen()` that doesn't work on Vercel
- ✅ Now exports the Express app for Vercel serverless functions
- ✅ Only calls `.listen()` in local development

### 3. Created `vercel.json`
- ✅ Proper Vercel configuration for Node.js
- ✅ Routes all traffic to Express server
- ✅ Sets production environment

## 🚀 What You Need to Do Now

### Step 1: Set Environment Variables on Vercel

1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Add these two variables:

   **Variable 1:**
   - Name: `SUPABASE_URL`
   - Value: `https://ulgcfvvtxqzpodlzpdth.supabase.co`
   - Environments: Production, Preview, Development

   **Variable 2:**
   - Name: `SUPABASE_KEY`
   - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVsZ2NmdnZ0eHF6cG9kbHpwZHRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQwNzk3MDQsImV4cCI6MjA5OTY1NTcwNH0.xKL-tl_PxPPCEB1d0TSAJKougCfBro7pB9Ia-07j95w`
   - Environments: Production, Preview, Development

4. Click **Save**

### Step 2: Redeploy on Vercel

**Option A: Automatic (Recommended)**
1. Commit and push the changes to GitHub
2. Vercel will automatically redeploy

**Option B: Manual Redeploy**
1. In Vercel dashboard, go to **Deployments**
2. Click the three dots on the latest deployment
3. Click **Redeploy**

### Step 3: Test Your Backend

Wait a few minutes for the deployment to complete, then test:

```bash
# Test health endpoint
curl https://merelosjeff-portfolio-backend.vercel.app/health

# Test API
curl https://merelosjeff-portfolio-backend.vercel.app/api/profile
curl https://merelosjeff-portfolio-backend.vercel.app/api/skills
```

## ⚠️ Important Security Note

**Do NOT commit credentials to git!** The credentials were hardcoded in your file. I've fixed this, but remember:

- ✅ Use environment variables on Vercel
- ✅ Keep sensitive data in `.env` (gitignored locally)
- ❌ Never hardcode API keys in source code
- ❌ Never commit `.env` to git

## 🆘 If It Still Doesn't Work

### Check Vercel Logs
1. Go to your Vercel project dashboard
2. Click **Deployments**
3. Click the latest deployment
4. Click **Function Logs**
5. Look for any errors

### Common Issues

**Issue: "Missing Supabase credentials" error**
- Solution: Double-check environment variables are set on Vercel
- Make sure values are copied correctly (no extra spaces)

**Issue: "Cannot find module @supabase/supabase-js"**
- Solution: Make sure you ran `npm install` locally before pushing
- The `node_modules` shouldn't be in git, but package-lock.json should be

**Issue: Still getting 500 error**
- Check Vercel logs for the exact error
- Make sure your Supabase database is accessible
- Try testing the Supabase connection locally

### Test Locally First
Before deploying again, test locally:

```bash
cd backend

# Create .env with your credentials
echo "SUPABASE_URL=https://ulgcfvvtxqzpodlzpdth.supabase.co" > .env
echo "SUPABASE_KEY=your-key-here" >> .env
echo "NODE_ENV=production" >> .env

# Install dependencies
npm install

# Start server
npm start  # Use npm start (not npm run dev) to test production build
```

## 📊 Before vs After

### Before (Broken)
```javascript
// database.js - WRONG ❌
const supabaseUrl = 'https://ulgcfvvtxqzpodlzpdth.supabase.co'  // Hardcoded!
const supabaseKey = 'eyJ...'  // Hardcoded!

// server.js - WRONG ❌
app.listen(PORT, () => {  // Doesn't work on Vercel
  console.log('Server running');
});
```

### After (Fixed)
```javascript
// database.js - CORRECT ✅
const supabaseUrl = process.env.SUPABASE_URL  // From env vars
const supabaseKey = process.env.SUPABASE_KEY  // From env vars

// server.js - CORRECT ✅
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {  // Only for local dev
    console.log('Server running');
  });
}
module.exports = app;  // Exported for serverless
```

## ✅ Deployment Checklist

- [ ] Environment variables set on Vercel (SUPABASE_URL, SUPABASE_KEY)
- [ ] Code pushed to GitHub
- [ ] Vercel redeploy triggered
- [ ] Wait 2-3 minutes for deployment
- [ ] Test `/health` endpoint
- [ ] Test `/api/profile` endpoint
- [ ] Check Vercel logs if errors occur

## 🎯 Next Steps

1. Set environment variables on Vercel (Step 1 above)
2. Commit and push changes: `git add . && git commit -m "Fix Vercel deployment" && git push`
3. Wait for Vercel to redeploy automatically
4. Test the endpoints above

## 📞 Need Help?

- **Vercel Docs:** https://vercel.com/docs
- **Check logs:** Your Vercel dashboard → Deployments → Latest → Function Logs
- **Test locally first:** `npm start` in backend folder

---

**Status:** ✅ Ready to redeploy

Your backend should now work on Vercel! 🚀
