# ⚡ Frontend Deployment - Quick Start (5 Minutes)

## Your Goal
Deploy your Next.js frontend website to Vercel so visitors see your portfolio UI (not JSON).

---

## What You Have Ready

✅ Backend API running on Vercel  
✅ Database connected to Supabase  
✅ Frontend environment variables configured  
✅ Frontend Next.js app ready to deploy  

---

## 5-Minute Action Plan

### Step 1: Go to Vercel (30 seconds)

Visit: https://vercel.com/dashboard

---

### Step 2: Create New Frontend Project (2 minutes)

**If you don't have a frontend project yet:**

1. Click **Add New** → **Project**
2. Click **Import Git Repository**
3. Find and select: **merelosjeff-portfolio**
4. Under **Root Directory**: Select **frontend** ← (Important!)
5. Click **Deploy**

**If you already have a frontend project:**

1. Open your frontend project
2. Go to **Deployments**
3. Click the three dots on latest deployment
4. Click **Redeploy**

---

### Step 3: Set Environment Variables (2 minutes)

1. In your Vercel project, click **Settings**
2. Click **Environment Variables**
3. Add these 4 variables (for all: Production, Preview, Development):

```
NEXT_PUBLIC_API_URL = https://merelosjeff-portfolio-backend.vercel.app
NEXT_PUBLIC_SITE_URL = https://merelosjeff-portfolio.vercel.app
NEXT_PUBLIC_SITE_NAME = Jeff Developer
NEXT_PUBLIC_GITHUB_USERNAME = jeffdev
```

4. Click **Save**

---

### Step 4: Wait for Deployment (1-2 minutes)

1. Go to **Deployments** tab
2. Wait for green checkmark ✅
3. Click the deployment to see your live site

---

### Step 5: Test Your Website

Click the deployment URL or visit your domain. You should see:

✅ Your portfolio homepage  
✅ Your profile information  
✅ Your projects, skills, experience  
✅ Contact form, blog, testimonials  
✅ Everything from your database  

---

## 📋 Common Mistakes to Avoid

❌ **Don't:** Leave "Root Directory" as root (must select "frontend")  
❌ **Don't:** Forget to set environment variables  
❌ **Don't:** Use http:// (must be https://)  
❌ **Don't:** Use localhost URLs in production  

---

## 🆘 If It Shows Error

### Error: "Module not found"
→ Root Directory is wrong (should be "frontend")

### Error: "Cannot find API"
→ Check `NEXT_PUBLIC_API_URL` environment variable is set correctly

### Error: Data not loading
→ Backend might be down - test: https://merelosjeff-portfolio-backend.vercel.app/health

### Error: Build failed
→ Check Vercel logs for details (Deployments → Latest → Logs)

---

## 📊 Your Final Architecture

```
Your Domain (or vercel.app URL)
    ↓
Next.js Frontend (Vercel)
    ↓ (API calls)
Express Backend (Vercel) 
    ↓ (Database queries)
Supabase PostgreSQL
```

---

## ✅ You're Done When

- ✅ Vercel deployment shows green checkmark
- ✅ Your website URL is live and accessible
- ✅ Homepage displays your profile
- ✅ Projects, skills, experience show correctly
- ✅ Contact form works
- ✅ No console errors

---

## 🎉 That's It!

Your portfolio is now live on the web with:
- Beautiful UI showing your profile
- Real data from Supabase
- Contact form that works
- All pages functional

**Visit your site now!** Your portfolio is live! 🚀

---

**For detailed instructions:** See `DEPLOY_FRONTEND_TO_VERCEL.md`
