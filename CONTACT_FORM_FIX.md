# Contact Form Email Fix - Deployment Guide

## Issues Identified & Fixed

### 1. ✅ Email Configuration (FIXED)
**Problem**: Backend `.env.production` had correct `EMAIL_*` variables
**Status**: Already configured correctly in production file

### 2. ✅ CORS Configuration (FIXED)
**Problem**: Backend wasn't allowing requests from your ngrok URL
**Fix Applied**: 
- Added `FRONTEND_URL=https://stoke-timothy-collar.ngrok-free.dev` to backend `.env.production`
- Updated `server.js` to include ngrok URL in allowed origins
- Added `ngrok-skip-browser-warning` header support

### 3. ✅ API Client Configuration (FIXED)
**Problem**: Frontend wasn't sending proper ngrok headers
**Fix Applied**: Added `'ngrok-skip-browser-warning': 'true'` to API client headers

---

## Current Configuration

### Backend `.env.production`
```env
# Email Configuration (✓ CORRECT)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=merelosjeft@gmail.com
EMAIL_PASS=oxyv typf oxru xzrg
EMAIL_FROM=merelosjeft@gmail.com
EMAIL_TO=jeffmerelos.coredev@gmail.com

# CORS Configuration (✓ FIXED)
CORS_ORIGIN=https://merelosjeff-portfolio.vercel.app
FRONTEND_URL=https://stoke-timothy-collar.ngrok-free.dev
```

### Frontend `.env.production`
```env
NEXT_PUBLIC_API_URL=https://merelosjeff-portfolio-backend.vercel.app
NEXT_PUBLIC_SITE_URL=https://merelosjeff-portfolio.vercel.app
```

---

## Deployment Steps

### For Development (ngrok tunnel):

1. **Start Backend with Production Env**:
   ```bash
   cd c:\JeffCV\backend
   $env:NODE_ENV="production"; node src/server.js
   ```

2. **Start Frontend**:
   ```bash
   cd c:\JeffCV\frontend
   npm run dev
   ```

3. **Test the Contact Form**:
   - Go to https://stoke-timothy-collar.ngrok-free.dev/contact
   - Fill out the form
   - Submit and check for success

### For Vercel Deployment:

#### Backend Deployment:
1. Go to Vercel Dashboard > Your Backend Project > Settings > Environment Variables
2. Ensure these variables are set:
   ```
   NODE_ENV=production
   SUPABASE_URL=https://ulgcfvvtxqzpodlzpdth.supabase.co
   SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVsZ2NmdnZ0eHF6cG9kbHpwZHRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQwNzk3MDQsImV4cCI6MjA5OTY1NTcwNH0.xKL-tl_PxPPCEB1d0TSAJKougCfBro7pB9Ia-07j95w
   
   # Email Config
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_SECURE=false
   EMAIL_USER=merelosjeft@gmail.com
   EMAIL_PASS=oxyv typf oxru xzrg
   EMAIL_FROM=merelosjeft@gmail.com
   EMAIL_TO=jeffmerelos.coredev@gmail.com
   
   # CORS
   CORS_ORIGIN=https://merelosjeff-portfolio.vercel.app
   FRONTEND_URL=https://merelosjeff-portfolio.vercel.app
   
   # Security
   SESSION_SECRET=4ea400f4493cb7ce87ce940f250696979cc93b10f4e3ab3ac0289c204f9b94d5
   TOTP_ENCRYPTION_KEY=wxyz7890abcd1234efgh5678ijkl9012mnop3456qrst7890uvwx
   CSRF_SECRET=csrf9876qwer5432tyui1098asdf3456zxcv9012bnmq3456wert
   
   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX=100
   CONTACT_RATE_LIMIT_MAX=5
   ```

3. Deploy backend:
   ```bash
   cd c:\JeffCV\backend
   git add .
   git commit -m "fix: Add email configuration and CORS for contact form"
   git push
   ```

#### Frontend Deployment:
1. Go to Vercel Dashboard > Your Frontend Project > Settings > Environment Variables
2. Ensure these variables are set:
   ```
   NEXT_PUBLIC_API_URL=https://merelosjeff-portfolio-backend.vercel.app
   NEXT_PUBLIC_SITE_URL=https://merelosjeff-portfolio.vercel.app
   NEXT_PUBLIC_ADMIN_ROUTE_PREFIX=/admin-portal
   NEXT_PUBLIC_SITE_NAME=Jeff Developer
   NEXT_PUBLIC_GITHUB_USERNAME=jeffdev
   ```

3. Deploy frontend:
   ```bash
   cd c:\JeffCV\frontend
   git add .
   git commit -m "fix: Add ngrok header for contact form API calls"
   git push
   ```

---

## Testing Checklist

After deployment, test these scenarios:

- [ ] Open contact form at `/contact`
- [ ] Fill in all required fields (name, email, message)
- [ ] Submit the form
- [ ] Check for success message: "Message sent successfully! I'll get back to you within 24–48 hours."
- [ ] Verify email received at `jeffmerelos.coredev@gmail.com`
- [ ] Verify auto-reply sent to the submitter's email
- [ ] Check Supabase `contact_messages` table for the new entry

---

## Troubleshooting

### If you still get "Network Error":

1. **Check Backend is Running**:
   ```bash
   # For ngrok:
   curl https://stoke-timothy-collar.ngrok-free.dev/health
   
   # For production:
   curl https://merelosjeff-portfolio-backend.vercel.app/health
   ```
   Should return: `{"status":"ok","timestamp":"..."}`

2. **Check CORS in Browser Console**:
   - Open DevTools > Network tab
   - Submit form
   - Look for the `/api/contact` request
   - Check if it's a CORS error or connection error

3. **Verify Email Credentials**:
   - Make sure Gmail App Password is correct: `oxyv typf oxru xzrg`
   - Ensure 2FA is enabled on the Gmail account
   - Verify "Less Secure Apps" is not blocking (should use App Password instead)

4. **Check Backend Logs**:
   ```bash
   # If running locally:
   cd c:\JeffCV\backend
   node src/server.js
   
   # Watch for console output when submitting form
   ```

5. **Test Email Sending Directly**:
   Create a test file `c:\JeffCV\backend\test-email.js`:
   ```javascript
   require('dotenv').config({ path: '.env.production' });
   const { sendContactEmail } = require('./src/config/mailer');
   
   sendContactEmail({
     name: 'Test User',
     email: 'test@example.com',
     subject: 'Test Email',
     message: 'This is a test message from the contact form.'
   })
   .then(() => console.log('✅ Email sent!'))
   .catch(err => console.error('❌ Error:', err));
   ```
   
   Run it:
   ```bash
   cd c:\JeffCV\backend
   node test-email.js
   ```

### Common Error Messages:

- **"Network Error"** = Frontend can't reach backend (check API URL)
- **"CORS not allowed"** = Origin not in allowed list (check server.js CORS config)
- **"Invalid login"** = Email credentials wrong (check EMAIL_USER and EMAIL_PASS)
- **"Connection timeout"** = SMTP server not reachable (check EMAIL_HOST and EMAIL_PORT)

---

## Files Modified

1. ✅ `backend\.env.production` - Added FRONTEND_URL and fixed CORS_ORIGIN
2. ✅ `backend\src\server.js` - Added ngrok URL to CORS, added ngrok header support
3. ✅ `frontend\src\lib\api.ts` - Added ngrok-skip-browser-warning header
4. ✅ `backend\.env.local` - Added EMAIL_* variables (for local development)

---

## Next Steps

1. **Deploy the changes** to both frontend and backend on Vercel
2. **Test the contact form** on production
3. **Monitor emails** to ensure they're being sent
4. **Check Supabase** to verify messages are being saved to database

If you continue to have issues, check the Vercel function logs for your backend deployment.
