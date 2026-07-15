# 🚀 Deploy Your Frontend to Vercel

## Overview

Your frontend is a **Next.js React application** that's already configured to call your backend API. Now we need to deploy it to Vercel so visitors can see your actual website UI.

---

## What You Have

✅ Frontend: Next.js React app  
✅ Backend: Deployed on Vercel (running)  
✅ Database: Supabase PostgreSQL (configured)  
✅ Frontend Environment Variables: Ready  

**What's missing:** Deploy the frontend to Vercel

---

## Step 1: Create Frontend Environment File

I've already created `.env.local` in the frontend folder with:

```
NEXT_PUBLIC_API_URL=https://merelosjeff-portfolio-backend.vercel.app
NEXT_PUBLIC_SITE_URL=https://merelosjeff-portfolio.vercel.app
NEXT_PUBLIC_SITE_NAME=Jeff Developer
NEXT_PUBLIC_GITHUB_USERNAME=jeffdev
```

---

## Step 2: Commit Changes

Commit the frontend environment file to GitHub:

```bash
cd c:\JeffCV
git add frontend/.env.local
git commit -m "Add frontend environment configuration for production"
git push
```

---

## Step 3: Deploy Frontend on Vercel

### Option A: Automatic Deployment (Recommended)

If you already have Vercel connected to GitHub:

1. Go to https://vercel.com/dashboard
2. **Look for your portfolio project**
3. If it's set up for the whole repo:
   - Vercel will detect that frontend changed
   - It may auto-deploy, or you can manually trigger a redeploy
4. **If you don't have a frontend project on Vercel yet:**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Select "frontend" folder as the root directory
   - Click Deploy

### Option B: Manual Deployment

1. Go to https://vercel.com/dashboard
2. Click **Add New** → **Project**
3. Click **Import Git Repository**
4. Select your **merelosjeff-portfolio** repository
5. Under "Root Directory", select **frontend** (important!)
6. Click **Deploy**

---

## Step 4: Set Environment Variables on Vercel (for Frontend)

1. In your Vercel frontend project
2. Click **Settings** → **Environment Variables**
3. Add these variables (for Production, Preview, Development):

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_API_URL` | `https://merelosjeff-portfolio-backend.vercel.app` |
| `NEXT_PUBLIC_SITE_URL` | `https://merelosjeff-portfolio.vercel.app` |
| `NEXT_PUBLIC_SITE_NAME` | `Jeff Developer` |
| `NEXT_PUBLIC_GITHUB_USERNAME` | `jeffdev` |

Note: These start with `NEXT_PUBLIC_` which means they're exposed to the browser (this is OK for public URLs)

---

## Step 5: Trigger Redeploy

After setting environment variables:

1. Go to **Deployments**
2. Click the three dots on the latest deployment
3. Click **Redeploy**
4. Wait 2-3 minutes for deployment to complete

---

## Step 6: Test Your Website

Once deployment is complete, you'll get a URL like:

```
https://your-project.vercel.app
```

Or if you have a custom domain:

```
https://yourportfolio.com
```

**Test these pages:**
- ✅ Home page - Should show your profile, hero section
- ✅ About page - Your bio and information
- ✅ Projects page - Your projects from Supabase
- ✅ Skills page - Your skills with categories
- ✅ Blog page - Your blog posts
- ✅ Contact page - Contact form (should submit to backend)
- ✅ Experience page - Your work/education history
- ✅ Certifications page - Your certifications
- ✅ Resume page - Your CV

---

## ⚠️ Important: Root Directory Selection

When creating the Vercel project, you **MUST** select **"frontend"** as the root directory, not the root of the repository.

This tells Vercel to:
- Build from: `frontend/` folder
- Use: `frontend/package.json`
- Deploy: The Next.js app from `frontend/` folder

---

## 🆘 If Frontend Still Shows Error

### Check These:

1. **Vercel Logs**
   - Dashboard → Project → Deployments → Latest → Logs
   - Look for build or runtime errors

2. **Frontend Environment Variables**
   - Make sure `NEXT_PUBLIC_API_URL` is set to your backend URL
   - Should be: `https://merelosjeff-portfolio-backend.vercel.app`

3. **Backend is Running**
   - Test: https://merelosjeff-portfolio-backend.vercel.app/health
   - Should return: `{"status":"ok","timestamp":"..."}`

4. **CORS Configuration**
   - Backend should allow requests from your frontend domain
   - Check `CORS_ORIGIN` environment variable on backend

5. **Build Command**
   - Vercel should auto-detect Next.js
   - Build command should be: `next build`
   - Start command should be: `next start`

---

## 📊 After Deployment

Your architecture will be:

```
┌──────────────────────────────────┐
│  Your Portfolio Website (UI)     │
│  https://your-domain.vercel.app  │
│  (Frontend - Next.js on Vercel)  │
└──────────────┬───────────────────┘
               │ API calls (axios)
               │
┌──────────────▼────────────────────────────┐
│   Backend API                             │
│ https://merelosjeff-portfolio-backend... │
│  (Backend - Express on Vercel)           │
└──────────────┬────────────────────────────┘
               │ Database queries
               │
┌──────────────▼──────────┐
│  Supabase PostgreSQL    │
│  (Your data)            │
└─────────────────────────┘
```

---

## ✅ Deployment Checklist

- [ ] `.env.local` created in frontend folder
- [ ] Git add, commit, push changes
- [ ] Frontend project created on Vercel
- [ ] Root directory set to "frontend"
- [ ] Environment variables set on Vercel
- [ ] Deployment completed (green checkmark)
- [ ] Home page loads without errors
- [ ] API calls work (data displays)
- [ ] Contact form can submit
- [ ] All pages load correctly

---

## 🎯 What Happens Next

Once deployed:

1. **Visitors can access your portfolio** at your domain
2. **Frontend calls your backend API** for data
3. **Backend queries Supabase** for information
4. **Data displays beautifully** in your UI
5. **Contact form submits** to your backend
6. **Everything is live** and production-ready

---

## 📞 Quick Links

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Your Backend API:** https://merelosjeff-portfolio-backend.vercel.app
- **Your Backend Root:** https://merelosjeff-portfolio-backend.vercel.app/
- **Supabase Dashboard:** https://app.supabase.com

---

## 🚀 Summary

1. Commit `.env.local` to GitHub
2. Create frontend project on Vercel (select "frontend" folder)
3. Set environment variables on Vercel
4. Wait for deployment (2-3 minutes)
5. Visit your domain to see your website UI

**That's it!** Your portfolio will be live with your beautiful UI displaying your data from Supabase! ✨
