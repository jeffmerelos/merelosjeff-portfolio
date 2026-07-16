# Contact Form Setup & Testing Checklist ✓

## Pre-Setup Checklist

- [ ] You have your Supabase project URL and anon key
- [ ] You have access to an email account (Gmail recommended) with app-specific password generated
- [ ] You know the email address that should receive contact messages
- [ ] Backend and frontend Node.js dependencies are installed (`npm install` already run)

---

## Setup Checklist

### Step 1: Update backend/.env
- [ ] Open file: `backend/.env`
- [ ] Replace `SUPABASE_URL` with your actual Supabase project URL
- [ ] Replace `SUPABASE_KEY` with your actual Supabase anon key
- [ ] Replace `EMAIL_USER` with your email address
- [ ] Replace `EMAIL_PASS` with your Gmail app-specific password
- [ ] Replace `EMAIL_FROM` with your email address
- [ ] Replace `EMAIL_TO` with the email that should receive messages
- [ ] Keep `CORS_ORIGIN=http://localhost:3000` for local testing
- [ ] Save the file

**Gmail Users**: Generate app-specific password at https://support.google.com/accounts/answer/185833

### Step 2: Verify Database
- [ ] Go to your Supabase dashboard
- [ ] Check that `contact_messages` table exists
- [ ] Verify table columns match the schema (name, email, subject, message, ip_address, status, created_at)
- [ ] Verify your anon key has SELECT and INSERT permissions on this table

### Step 3: Start Backend Server
- [ ] Open PowerShell/Terminal
- [ ] Navigate to `backend` folder: `cd c:\JeffCV\backend`
- [ ] Run: `npm run dev`
- [ ] ✅ You should see: `✅ Supabase PostgreSQL connected`
- [ ] Note the port (usually 5000): `🚀 Backend API running on http://localhost:5000`
- [ ] Leave this terminal open

### Step 4: Start Frontend Server
- [ ] Open new PowerShell/Terminal window
- [ ] Navigate to `frontend` folder: `cd c:\JeffCV\frontend`
- [ ] Run: `npm run dev`
- [ ] ✅ You should see: `▲ Ready in XXXms`
- [ ] Note the port (usually 3000): `http://localhost:3000`
- [ ] Leave this terminal open

---

## Testing Checklist

### Test 1: Valid Email Submission
- [ ] Open browser to http://localhost:3000/contact
- [ ] Enter Name: "Test User"
- [ ] Enter Email: "test@example.com"
- [ ] Enter Subject: "Test Subject"
- [ ] Enter Message: "This is a test message with at least 20 characters to verify the contact form works correctly."
- [ ] ✅ Email field should show green "✓ Valid email format"
- [ ] ✅ Send Message button should be enabled
- [ ] Click "Send Message"
- [ ] ✅ Console (F12 → Console) should show:
  ```
  📧 Sending contact form: {name: 'Test User', email: 'test@example.com', subject: 'Test Subject'}
  ✅ Contact response: {success: true, message: "Message received! I'll get back to you within 24–48 hours.", data: {...}}
  ```
- [ ] ✅ Toast notification should appear: "Message sent! I'll be in touch within 48 hours."
- [ ] ✅ Form fields should clear/reset
- [ ] ✅ Backend console should show:
  ```
  📧 Processing contact form submission: {name: 'Test User', email: 'test@example.com', subject: 'Test Subject'}
  ✅ Message saved to database: [...]
  📨 Sending contact email notification...
  ✅ Contact email sent successfully
  📨 Sending auto-reply to user...
  ✅ Auto-reply sent successfully
  ```

### Test 2: Invalid Email Detection
- [ ] Open http://localhost:3000/contact in a fresh form
- [ ] Enter Name: "Test User"
- [ ] Enter Email: "invalid-email"
- [ ] Start typing in Email field
- [ ] ✅ Should see red error: "✗ Please enter a valid email address"
- [ ] ✅ Email input should have pink border
- [ ] ✅ Send Message button should be disabled/grayed out
- [ ] Fix email to "test@example.com"
- [ ] ✅ Should immediately show green: "✓ Valid email format"
- [ ] ✅ Error message disappears
- [ ] ✅ Send Message button re-enables

### Test 3: Message Too Short
- [ ] Enter Name: "Test User"
- [ ] Enter Email: "test@example.com"
- [ ] Enter Message: "Short" (only 5 characters)
- [ ] ✅ Should show error: "✗ Message must be at least 20 characters"
- [ ] ✅ Send Message button should be disabled
- [ ] Add more text to reach 20+ characters
- [ ] ✅ Error disappears and button enables

### Test 4: Database Entry Verification
- [ ] After successful submission in Test 1
- [ ] Go to Supabase dashboard
- [ ] Navigate to `contact_messages` table
- [ ] ✅ You should see a new row with:
  - `name`: "Test User"
  - `email`: "test@example.com"
  - `subject`: "Test Subject"
  - `message`: Your test message
  - `status`: "unread"
  - `created_at`: Recent timestamp

### Test 5: Rate Limiting
- [ ] After Test 1 was successful
- [ ] Rapidly click "Send Message" 5+ times in quick succession
- [ ] ✅ After 5 submissions, you should see error:
  "Too many messages sent. Please wait a while and try again."
- [ ] ⏱️ Wait 15 minutes (or check that rate limit window works)
- [ ] ✅ Form should work again

### Test 6: Honeypot (Spam Protection)
- [ ] Open browser DevTools (F12 → Console)
- [ ] Paste this JavaScript to manually fill the honeypot:
  ```javascript
  document.querySelector('[tabindex="-1"]').value = "spam";
  ```
- [ ] Fill out rest of form normally
- [ ] Click "Send Message"
- [ ] ✅ Nothing should happen (form silently rejected)
- [ ] ✅ Console should not show submission logs

---

## Email Testing Checklist

### Test 7: Contact Notification Email
- [ ] After successful submission in Test 1
- [ ] Check your EMAIL_TO email inbox
- [ ] ✅ You should receive an email from "Portfolio Contact" with:
  - Subject: "[Portfolio Contact] Test Subject"
  - Contains: Name, Email, Subject, Message
  - Contains: Timestamp of submission
  - Styled HTML email

### Test 8: Auto-Reply Email
- [ ] After successful submission in Test 1
- [ ] Check your test@example.com inbox
- [ ] ✅ You should receive an email from "Jeff Developer" with:
  - Subject: "Thanks for reaching out, Test User!"
  - Confirms message was received
  - States "I'll get back to you within 24–48 hours"
  - Contains: Auto-reply confirmation

---

## Troubleshooting Checklist

If any test fails, work through this:

### Backend Not Starting
- [ ] Check if port 5000 is already in use
- [ ] Try: `netstat -ano | findstr :5000`
- [ ] If in use, change PORT in .env to different port (e.g., 5001)
- [ ] Check backend/.env credentials are correct
- [ ] Check Supabase connection: Can you access Supabase dashboard?

### Email Validation Not Working
- [ ] Check browser console (F12 → Console)
- [ ] Verify Zod schema is present in page.tsx
- [ ] Try typing an obviously invalid email (e.g., "test")
- [ ] Should immediately show error message
- [ ] Try typing valid email (e.g., "test@example.com")
- [ ] Should immediately show "✓ Valid email format"

### Form Submission Fails
- [ ] Check browser console for error message (F12 → Console)
- [ ] Check backend console for processing logs
- [ ] Look for ❌ error indicators in logs
- [ ] Note the error message exactly
- [ ] Check backend/.env credentials against error message

### CORS Error in Browser
- [ ] Check browser console (F12 → Console)
- [ ] Look for "CORS" error message
- [ ] Check frontend is running on http://localhost:3000
- [ ] Check backend/.env has: `CORS_ORIGIN=http://localhost:3000`
- [ ] Restart both frontend and backend servers

### Database Entries Not Appearing
- [ ] Go to Supabase dashboard → contact_messages table
- [ ] Refresh the page (F5)
- [ ] Check if table is empty or has old entries
- [ ] Verify you're looking at the correct table
- [ ] Check that your anon key has SELECT permissions

### Emails Not Arriving
- [ ] Check that EMAIL_PASS is app-specific password (not regular password)
- [ ] For Gmail, check spam folder
- [ ] Verify EMAIL_USER and EMAIL_TO are correct
- [ ] Check backend console for email sending logs
- [ ] Form still succeeds even if email fails (message saved to DB)

---

## Verification Summary

After all tests pass, you should have:

- ✅ Form validates emails in real-time
- ✅ Invalid emails prevent submission
- ✅ Valid emails submit successfully
- ✅ Console shows detailed logging
- ✅ Messages save to database
- ✅ Notifications appear to user
- ✅ Confirmation emails sent to contact
- ✅ Auto-reply sent to user
- ✅ Rate limiting prevents spam
- ✅ Honeypot blocks bot submissions

---

## Ready for Production?

Once all tests pass locally, you're ready to deploy:

1. [ ] Create production Supabase project (if different from dev)
2. [ ] Generate new Supabase URL and anon key for production
3. [ ] Set environment variables in Vercel dashboard
4. [ ] Update CORS_ORIGIN to production frontend URL
5. [ ] Deploy backend to Vercel
6. [ ] Deploy frontend to Vercel
7. [ ] Test contact form on production URL
8. [ ] Verify database entries in production
9. [ ] Check if production emails arrive

---

## Documentation Files

For reference, see these files in the project root:

- **CONTACT_FORM_QUICK_START.txt** - Quick 5-minute setup guide
- **CONTACT_FIX_IMPLEMENTATION.md** - Detailed implementation guide
- **CONTACT_FORM_FIXES_APPLIED.md** - Explanation of all fixes
- **CONTACT_FORM_FIX_SUMMARY.txt** - Complete summary of changes
- **This file (CONTACT_FORM_CHECKLIST.md)** - Step-by-step testing guide

---

**Last Updated:** July 16, 2026
**Status:** Ready for testing
**Support:** Check console logs for detailed debugging information
