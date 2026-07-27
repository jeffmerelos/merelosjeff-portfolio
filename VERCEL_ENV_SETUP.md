# Vercel Environment Variables Setup

## Problem
Your contact form is still trying to reach `localhost:5000` because the Vercel deployments don't have the correct environment variables set.

## Solution: Set Environment Variables on Vercel

### For Frontend (merelosjeff-portfolio.vercel.app)

1. Go to: https://vercel.com/dashboard
2. Select your frontend project: `merelosjeff-portfolio`
3. Go to: **Settings → Environment Variables**
4. Add these variables:

```
NEXT_PUBLIC_API_URL = https://merelosjeff-portfolio-backend.vercel.app
NEXT_PUBLIC_SITE_URL = https://merelosjeff-portfolio.vercel.app
NEXT_PUBLIC_SITE_NAME = Jeff Developer
NEXT_PUBLIC_GITHUB_USERNAME = jeffdev
```

5. Click "Save"
6. Redeploy: Go to **Deployments** → Click the latest deployment → **Redeploy**

### For Backend (merelosjeff-portfolio-backend.vercel.app)

1. Go to: https://vercel.com/dashboard
2. Select your backend project: `merelosjeff-portfolio-backend`
3. Go to: **Settings → Environment Variables**
4. Add these variables:

```
PORT = 5000
NODE_ENV = production
SUPABASE_URL = https://ulgcfvvtxqzpodlzpdth.supabase.co
SUPABASE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVsZ2NmdnZ0eHF6cG9kbHpwZHRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQwNzk3MDQsImV4cCI6MjA5OTY1NTcwNH0.xKL-tl_PxPPCEB1d0TSAJKougCfBro7pB9Ia-07j95w
JWT_SECRET = 4ea400f4493cb7ce87ce940f250696979cc93b10f4e3ab3ac0289c204f9b94d5
CORS_ORIGIN = https://merelosjeff-portfolio.vercel.app
EMAIL_HOST = smtp.gmail.com
EMAIL_PORT = 587
EMAIL_SECURE = false
EMAIL_USER = merelosjeft@gmail.com
EMAIL_PASS = oxyv typf oxru xzrg
EMAIL_FROM = merelosjeft@gmail.com
EMAIL_TO = jeffmerelos.coredev@gmail.com
RATE_LIMIT_WINDOW_MS = 900000
RATE_LIMIT_MAX = 100
CONTACT_RATE_LIMIT_MAX = 5
GITHUB_TOKEN = 
GITHUB_USERNAME = jeffdev
```

5. Click "Save"
6. Redeploy: Go to **Deployments** → Click the latest deployment → **Redeploy**

## Step-by-Step Screenshots Guide

### Step 1: Open Vercel Dashboard
- Go to https://vercel.com
- Sign in with your GitHub account
- You should see your projects listed

### Step 2: Select Frontend Project
- Click on: `merelosjeff-portfolio`
- This is your frontend project

### Step 3: Navigate to Environment Variables
- Click on: **Settings** (top menu)
- Click on: **Environment Variables** (left sidebar)

### Step 4: Add Variables
- Click: **+ Add New**
- For each variable:
  - Name: `NEXT_PUBLIC_API_URL`
  - Value: `https://merelosjeff-portfolio-backend.vercel.app`
  - Select: **All** (for all environments)
  - Click: **Save**

### Step 5: Redeploy Frontend
- Go back to **Deployments**
- Find the latest deployment
- Click the **3-dot menu** on the right
- Click: **Redeploy**
- Wait for deployment to complete (usually 2-5 minutes)

### Step 6: Repeat for Backend
- Repeat steps 2-5 but select: `merelosjeff-portfolio-backend`
- Add all the backend environment variables from above
- Redeploy

## Why This Fixes the Issue

**Before:**
- Frontend on Vercel tries to connect to `localhost:5000` (hardcoded fallback)
- Connection fails because localhost doesn't exist on Vercel
- User sees "Network Error"

**After:**
- Frontend reads `NEXT_PUBLIC_API_URL` from environment variables
- Frontend connects to `https://merelosjeff-portfolio-backend.vercel.app`
- Backend receives request and processes it
- Message is saved to database successfully

## Verification

After redeploying, test:

1. Go to: https://merelosjeff-portfolio.vercel.app/contact
2. Fill out the form:
   - Name: Test Name
   - Email: test@example.com
   - Subject: Test Subject
   - Message: This is a test message to verify the connection works
3. Click "Send Message"
4. Expected: ✅ Success message appears
5. Check Supabase: new row in `contact_messages` table

## Important Notes

⚠️ **Don't share your secrets!**
- SUPABASE_KEY is sensitive
- EMAIL_PASS is sensitive
- These should only be set on Vercel, not in public code

✅ **Environment Variable Propagation**
- Changes to environment variables on Vercel don't take effect until you redeploy
- You MUST redeploy after adding/changing environment variables

✅ **Production vs Preview**
- Recommended: Set variables for **All** environments
- This ensures both production and preview deployments work

## Troubleshooting

**Still getting "Network Error"?**
1. Verify you set `NEXT_PUBLIC_API_URL` correctly on Vercel
2. Make sure you clicked **Redeploy** after adding variables
3. Wait a few minutes for deployment to complete
4. Clear your browser cache (Ctrl+Shift+Delete)
5. Try again

**How to check if variables are set?**
1. Vercel Dashboard → Your Project → Settings → Environment Variables
2. You should see all the variables listed there

**Variables showing in .env.local but not working on Vercel?**
- `.env.local` is only for local development
- Vercel doesn't read your local files
- You MUST set them in Vercel dashboard

## Quick Checklist

Frontend Setup:
- [ ] Navigate to frontend project on Vercel
- [ ] Go to Settings → Environment Variables
- [ ] Add `NEXT_PUBLIC_API_URL = https://merelosjeff-portfolio-backend.vercel.app`
- [ ] Click Save
- [ ] Go to Deployments
- [ ] Click Redeploy on latest deployment
- [ ] Wait for deployment to complete (2-5 minutes)
- [ ] Test the form

Backend Setup:
- [ ] Navigate to backend project on Vercel
- [ ] Go to Settings → Environment Variables
- [ ] Add all backend variables (from list above)
- [ ] Click Save
- [ ] Go to Deployments
- [ ] Click Redeploy on latest deployment
- [ ] Wait for deployment to complete

Testing:
- [ ] Go to https://merelosjeff-portfolio.vercel.app/contact
- [ ] Fill form with valid data
- [ ] Submit
- [ ] See success message ✅
- [ ] Check Supabase for saved message

All checked? Contact form should now work! 🎉
