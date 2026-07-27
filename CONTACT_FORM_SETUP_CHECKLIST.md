# Contact Form Setup Checklist ✓

## What's Been Done ✅

- [x] Created `/frontend/src/app/contact/page.tsx` with full contact form
- [x] Implemented email validation (frontend)
- [x] Added form validation for all fields
- [x] Real-time error clearing as user types
- [x] Character counter for message field
- [x] Success/error message display
- [x] Backend contact route already exists and working
- [x] Database schema verified

## Before You Can Use It

### Backend Setup (REQUIRED)

1. **Navigate to backend folder**
   ```bash
   cd backend
   ```

2. **Install dependencies** (if not already done)
   ```bash
   npm install
   ```

3. **Verify .env file exists** with these variables:
   ```
   PORT=5000
   NODE_ENV=development
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_key
   EMAIL_USER=your_gmail_address
   EMAIL_PASS=your_gmail_app_password
   EMAIL_TO=where_to_send_notifications
   ```

4. **Start the backend server**
   ```bash
   npm run dev
   ```
   
   ✅ You should see:
   ```
   🚀 Backend API running on http://localhost:5000
      Health: http://localhost:5000/health
      Env:    development
   ```

### Frontend Setup

1. **In a NEW terminal, navigate to frontend**
   ```bash
   cd frontend
   ```

2. **Verify .env.local has**
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

3. **Start the frontend**
   ```bash
   npm run dev
   ```

## Testing the Contact Form

### Test Case 1: Invalid Email
1. Go to: `http://localhost:3000/contact`
2. Enter:
   - Name: `John Doe`
   - Email: `invalid-email` (no @ symbol)
   - Subject: `Test`
   - Message: `This is a test message with more than 20 characters`
3. Expected: Email field shows error in red
4. Fix email to `john@example.com`
5. Expected: Error disappears immediately

### Test Case 2: Message Too Short
1. Enter Message: `Too short`
2. Try to submit
3. Expected: Shows "Message must be at least 20 characters"

### Test Case 3: Valid Submission ✅
1. Fill form with valid data:
   - Name: `Your Name`
   - Email: `your.email@example.com`
   - Subject: `Inquiry about services`
   - Message: `I'm interested in discussing a potential project. Please let me know your availability.`
2. Click "Send Message"
3. Expected: Success message appears
4. Form resets
5. Check Supabase console → new row in `contact_messages` table

### Test Case 4: All Required Fields
Try submitting with each field empty:
1. Empty Name → Shows "Name is required"
2. Empty Email → Shows "Email is required"
3. Empty Message → Shows "Message is required"
4. All pass validation → Message sends ✓

## What Happens When You Submit

```
Form → Frontend Validation
         ↓
         [All valid?]
         ↓
         Send POST to /api/contact
         ↓
         Backend Validation
         ↓
         Save to Supabase (contact_messages table)
         ↓
         Send notification email (optional)
         ↓
         Return success response
         ↓
         Display success message to user
```

## Email Format Validation

The form accepts email addresses in this format:
- `local@domain.com`
- `first.last@company.co.uk`
- `user123@test.org`

It rejects:
- `missing@domain` (incomplete domain)
- `nope.email` (no @ symbol)
- `@domain.com` (no local part)
- `spaces in@email.com` (spaces)

## If Something Goes Wrong

### Backend Won't Start
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solution**: Check .env file has correct `SUPABASE_URL` and `SUPABASE_KEY`

### "Network Error" on submit
```
Failed to send message. Please try emailing directly.
```
**Solution**: Make sure backend is running: `npm run dev` in the backend folder

### Email validation keeps failing
**Solution**: Make sure you're using format: `name@domain.com` (must have @ and a dot)

### Message not appearing in database
1. Check Supabase console: https://app.supabase.com
2. Navigate to: Tables → contact_messages
3. Refresh the page
4. New row should appear when you submit

## Servers Needed

You need TWO terminal windows running:

**Terminal 1 - Backend (Port 5000)**
```bash
cd backend && npm run dev
```

**Terminal 2 - Frontend (Port 3000)**
```bash
cd frontend && npm run dev
```

Both must be running for the contact form to work!

## Features Included

✅ **Email Validation**
- Real-time as-you-type validation
- Regex pattern matching
- Clear error messages

✅ **Form Validation**
- Required field checks
- Length limits (matching backend)
- Character counter
- Error clearing on input

✅ **User Experience**
- Loading state while submitting
- Success/error feedback
- Alternative contact methods displayed
- Form reset after successful submission

✅ **Security**
- Server-side validation (backend)
- Express-validator
- Rate limiting on contact endpoint
- Honeypot field for bot protection

## Ready to Go! 🚀

1. Start backend: `npm run dev` (in /backend)
2. Start frontend: `npm run dev` (in /frontend)
3. Visit: http://localhost:3000/contact
4. Try the form!

Any issues? Check the error messages or see the troubleshooting section in `CONTACT_FIX_GUIDE.md`
