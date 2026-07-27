# Contact Form Fix - Complete Guide

## Problem Summary
The contact form wasn't working due to three main issues:
1. **Backend server not running** - causing `net::ERR_CONNECTION_REFUSED` on port 5000
2. **Missing contact page** - `/contact` route didn't exist in the frontend
3. **No email validation** - frontend wasn't validating email format before submission

## What I've Fixed

### ✅ 1. Created Contact Page (`/frontend/src/app/contact/page.tsx`)
A fully functional contact form with:
- **Form fields**: Name, Email, Subject, Message
- **Client-side validation** including:
  - Required field checks
  - Email format validation using regex pattern
  - Character length limits (matching backend validation)
  - Real-time email validation as user types
- **Error messages** that clear when user corrects the field
- **Character counter** for message field (0/5000)
- **Status messages** for success/error feedback
- **Loading state** while submitting
- **Alternative contact methods** displayed below the form

### ✅ 2. Email Validation
Frontend email regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`

This validates:
- At least one character before @
- @ symbol present
- At least one character after @ and before .
- At least one character after the dot (domain extension)

Examples that pass:
- `user@example.com` ✓
- `name.lastname@company.co.uk` ✓
- `test123@test.org` ✓

Examples that fail:
- `invalid.email` ✗ (no @)
- `user@` ✗ (no domain)
- `@example.com` ✗ (no local part)
- `user@.com` ✗ (no domain name)

### ✅ 3. Backend Validation
The backend (`/backend/src/routes/contact.js`) already has validation:
```javascript
body('email')
  .trim()
  .notEmpty().withMessage('Email is required')
  .isEmail().withMessage('Please provide a valid email address')
  .normalizeEmail(),
```

## How to Get the Contact Form Working

### Step 1: Start the Backend Server
In your terminal, navigate to the backend folder and start the development server:

```bash
cd backend
npm install  # If dependencies aren't installed
npm run dev
```

You should see:
```
🚀 Backend API running on http://localhost:5000
   Health: http://localhost:5000/health
   Env:    development
```

### Step 2: Start the Frontend Server (in a separate terminal)
```bash
cd frontend
npm run dev
```

### Step 3: Test the Contact Form
1. Open http://localhost:3000/contact
2. Try submitting with invalid data:
   - Empty fields → Shows required field errors
   - Invalid email (e.g., "notanemail") → Shows email validation error
   - Message too short (< 20 chars) → Shows length error
3. Fill out correctly and submit → Should see success message
4. Message will be saved to `contact_messages` table in Supabase

## Form Validation Flow

```
User enters data
       ↓
Real-time field validation (as they type)
       ↓
User clicks "Send Message"
       ↓
Full form validation
       ↓
Send to backend (/api/contact)
       ↓
Backend validation (express-validator)
       ↓
Save to database (contact_messages table)
       ↓
Send notification & auto-reply emails
       ↓
Return success message
```

## Database Schema
The message is saved to `contact_messages` table with:
```sql
{
  id: SERIAL (auto-generated)
  name: VARCHAR(150)
  email: VARCHAR(150)
  subject: VARCHAR(255) [nullable]
  message: TEXT
  ip_address: VARCHAR(45) [auto-captured]
  status: VARCHAR(20) [default: 'unread']
  created_at: TIMESTAMP [auto-set]
  read_at: TIMESTAMP [nullable]
}
```

## Error Handling

### Frontend Errors (Client-side)
- **Network Error**: Shown when backend is not running
  - Solution: Make sure backend server is running (`npm run dev`)
- **Validation Errors**: Shown for each invalid field
  - Solution: User corrects the input and field error clears

### Backend Errors (Server-side)
- **Database Error**: Shown if insert fails
  - Solution: Check Supabase connection and verify .env variables
- **Email Error**: Non-blocking (message still saves)
  - The message is saved to DB even if emails fail to send

## Environment Variables

### Backend (.env)
Required for contact form to work:
```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
EMAIL_USER=your_gmail
EMAIL_PASS=your_app_password
EMAIL_TO=where_to_send_notifications
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000  (for local development)
```

For production, update to your deployed backend URL.

## Testing the Complete Flow

### Test Case 1: Invalid Email
1. Go to /contact
2. Enter: Name = "Test", Email = "notanemail", Message = "This is a test message for validation"
3. Expected: Email field shows red error: "Please enter a valid email address (e.g., name@example.com)"
4. Fix email to "test@example.com"
5. Expected: Error disappears automatically

### Test Case 2: Message Too Short
1. Enter: Message = "Too short"
2. Try to submit
3. Expected: Shows "Message must be at least 20 characters"

### Test Case 3: Valid Submission
1. Fill all required fields correctly
2. Click "Send Message"
3. Expected: Success message appears
4. Form clears
5. Check Supabase console → new row in contact_messages table

## Troubleshooting

| Problem | Cause | Solution |
|---------|-------|----------|
| `net::ERR_CONNECTION_REFUSED` | Backend not running | Run `npm run dev` in /backend |
| Form won't submit | Validation errors | Check red error messages under each field |
| Email validation fails | Invalid email format | Use format: name@domain.com |
| Message not saving | Database error | Check .env variables and Supabase connection |
| Emails not sending | Mail service issue | Check EMAIL_* env variables are correct |

## Files Modified/Created

```
Created:
- /frontend/src/app/contact/page.tsx (new contact form page)

Existing (no changes needed):
- /backend/src/routes/contact.js (already working)
- /frontend/src/lib/api.ts (sendContactMessage function already exists)
- /backend/src/server.js (route already registered)
```

## Next Steps

1. ✅ Backend server must be running
2. ✅ Frontend contact page is now ready
3. ✅ Email validation implemented
4. Ready to test!

Start with the "How to Get the Contact Form Working" section above.
