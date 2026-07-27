# 🚀 Vercel Setup - Quick Fix (10 Minutes)

## The Problem
Contact form shows "Network Error" on Vercel production because:
- ❌ Backend CORS doesn't accept Vercel frontend URL
- ❌ 10-second timeout too short for cold starts
- ❌ Environment variables not set in Vercel

## The Solution
We fixed the code. Now you need to configure Vercel.

---

## Step 1: Set Backend Environment Variables (3 min)

1. Go to https://vercel.com/dashboard
2. Click on your **backend** project
3. Go to **Settings** tab
4. Click **Environment Variables**
5. Add these variables (set Production to ON for each):

```
SUPABASE_URL = [Your Supabase URL]
SUPABASE_KEY = [Your Supabase Anon Key]
EMAIL_USER = [Your Gmail]
EMAIL_PASS = [Your App Password]
EMAIL_FROM = [Your Gmail]
EMAIL_TO = [Email to receive messages]
NODE_ENV = production
```

**Where to find these:**
- Supabase: Project settings → API
- Gmail app password: https://support.google.com/accounts/answer/185833

---

## Step 2: Redeploy Backend (2 min)

1. Stay in backend Vercel project
2. Go to **Deployments** tab
3. Click "..." on the latest deployment
4. Click **Redeploy**
5. Wait for deployment to complete

---

## Step 3: Deploy Frontend (2 min)

```bash
git add frontend/
git commit -m "fix: enhance error handling and timeout"
git push origin main
```

Wait for Vercel to auto-deploy frontend.

---

## Step 4: Test (3 min)

1. Go to https://merelosjeff-portfolio-frontend.vercel.app/contact
2. Open DevTools (F12 → Console)
3. Fill out form and submit
4. Look for this in console:
   ```
   📧 Sending contact form: {name: '...', email: '...'}
   ✅ Contact response: {success: true, ...}
   ```
5. Should see success toast message
6. Check Supabase - new message should appear

---

## What If Still Getting Network Error?

Open DevTools Console and look for:

**"Request timeout"**
- Backend starting up (cold start)
- Wait 30 seconds and try again
- If persists: Check backend Vercel logs

**"Network error"**
- CORS issue
- Backend environment variables not set
- Redeploy backend after setting variables

**"ERR_NETWORK"**
- Can't reach backend URL
- Verify backend URL is correct
- Check backend health: https://your-backend-vercel-url/health

---

## Verification

✅ Backend health check works:
```bash
curl https://merelosjeff-portfolio-backend.vercel.app/health
# Should return: {"status":"ok"}
```

✅ Form submits successfully:
- Console shows "Contact response: {success: true}"
- Toast shows "Message sent!"
- No red error toast

✅ Message saved to database:
- Go to Supabase dashboard
- Check contact_messages table
- New row appeared with your data

---

## Code Changes Made

### Backend (server.js)
- ✅ CORS now accepts Vercel frontend URL
- ✅ Accepts multiple frontend domains
- ✅ Better error logging

### Frontend (api.ts)
- ✅ Timeout increased to 30 seconds
- ✅ Better error handling
- ✅ Response interceptor for debugging

### Frontend (contact/page.tsx)
- ✅ Specific error type detection
- ✅ Better error messages
- ✅ API URL logging

---

## Timeline

| Task | Time |
|------|------|
| Set env vars in Vercel | 3 min |
| Redeploy backend | 2 min |
| Deploy frontend | 2 min |
| Test | 3 min |
| **TOTAL** | **~10 min** |

---

## After This Fix

Your contact form will:
✅ Accept messages from Vercel frontend
✅ Save messages to Supabase database
✅ Send confirmation emails
✅ Show success messages to users
✅ Handle errors gracefully

---

## Questions?

Check browser console (F12) for detailed error messages. They're very specific now:
- Shows exact error type
- Shows network status
- Shows API response
- Helps identify the issue

Need help? The console will tell you exactly what's wrong.

**Good luck! 🚀**
