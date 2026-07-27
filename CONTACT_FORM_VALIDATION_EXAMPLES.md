# Contact Form - Validation Examples & Error Messages

## What Users Will See

### Scenario 1: Submitting with Empty Fields

**User Input:**
- Name: [empty]
- Email: [empty]
- Subject: [empty]
- Message: [empty]

**Errors Displayed:**
```
Name: ⚠️ Name is required

Email: ⚠️ Email is required

Message: ⚠️ Message is required
```

**Button State:** Cannot submit (Submit button might be disabled or form blocked)

---

### Scenario 2: Invalid Email Format

**User Input:**
```
Name: John Developer
Email: john.developer      ← No @ symbol, not a valid email
Subject: Project Discussion
Message: I'm interested in working on your project. Please let me know your availability.
```

**Error Displayed:**
```
Email: ⚠️ Please enter a valid email address (e.g., name@example.com)
```

**User Action:** Email field shows in red/pink color
- User deletes "john.developer"
- Types "john.developer@company.com"
- **Error disappears immediately** ✓

---

### Scenario 3: Email Too Short/Not Valid

**User Input:**
```
Email: user@   ← Missing domain name
```

**Error Displayed:**
```
Email: ⚠️ Please enter a valid email address (e.g., name@example.com)
```

**What's Wrong:**
- Must have domain name after @
- Must have domain extension (.com, .org, etc.)

**Valid Examples:**
- user@gmail.com ✓
- user@company.co.uk ✓
- user123@test.org ✓

---

### Scenario 4: Message Too Short

**User Input:**
```
Name: Jane Smith
Email: jane@example.com
Subject: Quick question
Message: Hi    ← Only 2 characters
```

**Error Displayed:**
```
Message: ⚠️ Message must be at least 20 characters

Character Count: 4/5000
```

**Solution:**
- Expand message to at least 20 characters
- Character counter shows progress

---

### Scenario 5: Message Too Long

**User Input:**
```
Message: [A very long message with over 5000 characters...]
```

**Error Displayed:**
```
Message: ⚠️ Message must be 5000 characters or fewer

Character Count: 5247/5000   ← Shown in red
```

**Solution:**
- Delete some content
- Get back under 5000 characters

---

### Scenario 6: Name Too Long

**User Input:**
```
Name: [Extremely long name with 200+ characters that exceeds the limit...]
```

**Error Displayed:**
```
Name: ⚠️ Name must be 150 characters or fewer
```

---

### Scenario 7: Subject Too Long

**User Input:**
```
Subject: [Very long subject line with 300+ characters...]
```

**Error Displayed:**
```
Subject: ⚠️ Subject must be 255 characters or fewer
```

---

### Scenario 8: All Fields Valid - Successful Submission ✅

**User Input:**
```
Name: Jefferson Developer
Email: jeff@example.com
Subject: Project Inquiry
Message: I'm interested in discussing your available services for a web development project. 
         Please let me know your rates and timeline. Thank you!
```

**Process:**
1. User clicks "Send Message"
2. Button shows: "Sending..." (loading state)
3. Backend receives, validates, and saves message
4. Backend responds with success

**Success Message Displayed:**
```
✅ Message sent successfully! I'll get back to you within 24–48 hours.
```

**What Happens:**
- Message saves to database
- Form clears automatically
- User can send another message if needed

---

### Scenario 9: Backend Not Running

**User Input:** Valid data, clicks submit

**Error Displayed:**
```
❌ Failed to send message. Please try again or email me directly.
```

**Cause:** Backend server (localhost:5000) is not running

**Solution:**
1. Open terminal
2. Navigate to `/backend` folder
3. Run: `npm run dev`
4. Wait for: "🚀 Backend API running on http://localhost:5000"
5. Try submitting again

---

### Scenario 10: Real-Time Email Validation

**As User Types:**

```
Step 1: Type "john"
No error yet (field is optional until complete)

Step 2: Type "john@"
Error appears: ⚠️ Please enter a valid email address

Step 3: Type "john@example"
Error still shows: ⚠️ Please enter a valid email address

Step 4: Type "john@example.com"
✅ Error disappears - valid email!
```

This happens **while they're typing**, giving real-time feedback.

---

## Email Validation Rules

### ✅ VALID FORMATS (No Error)

These will be accepted and no error will show:

```
john@example.com
jane.doe@company.co.uk
user123@test.org
first.last@domain.name
a@b.co
user+tag@domain.com
```

### ❌ INVALID FORMATS (Shows Error)

These will show the error message:

```
notanemail           ← No @ symbol
user@                ← No domain
@example.com         ← No local part
user @example.com    ← Space in email
user@.com            ← No domain name
user@domain          ← No extension (.com, .org, etc.)
spaces in@email.com  ← Spaces in local part
```

---

## Field Length Limits

### Name Field
- **Minimum:** 1 character (required)
- **Maximum:** 150 characters
- **Error if:** Empty or over 150 chars

### Email Field
- **Format:** Must be valid email (e.g., name@domain.com)
- **Maximum:** 150 characters
- **Error if:** Empty, invalid format, or over 150 chars

### Subject Field
- **Minimum:** None (optional)
- **Maximum:** 255 characters
- **Error if:** Over 255 chars

### Message Field
- **Minimum:** 20 characters (required)
- **Maximum:** 5000 characters
- **Error if:** Empty, under 20 chars, or over 5000 chars
- **Display:** Character counter (123/5000)

---

## Error Clearing Behavior

### When Errors Appear
- User tries to submit with invalid data
- Errors appear below each invalid field in red/pink
- Submit is blocked

### When Errors Clear
- User starts typing in a field with an error
- Error clears automatically (for real-time feedback)
- **Most helpful for email field** - validates as they type

### Manual Fix Required
1. See error message
2. Correct the field
3. Error clears automatically
4. Try submitting again

---

## Success vs Error Messages

### Success Message (Green ✅)
```
✅ Message sent successfully! I'll get back to you within 24–48 hours.
```

**Appearance:**
- Green background
- Green text
- Checkmark icon
- Forms auto-resets

### Error Message (Red/Pink ❌)
```
❌ Failed to send message. Please try again or email me directly.
```

**Appearance:**
- Pink/red background
- Pink/red text
- Error icon
- Form stays visible (user can retry)

---

## Character Counter Example

**Message Field View:**
```
┌─────────────────────────────────────────────┐
│ Your message here...                        │
│ [shows counter in real-time as user types] │
└─────────────────────────────────────────────┘
                    142/5000 ← Right aligned

User types more... counter updates:
                    243/5000

User approaches limit:
                    4987/5000 ← Still under limit

User exceeds limit:
                    5247/5000 ← Shows in RED
Error: "Message must be 5000 characters or fewer"
```

---

## Submission Flow Visual

```
┌─────────────────────────────────────────────┐
│  CONTACT FORM                               │
├─────────────────────────────────────────────┤
│  Name: Jefferson        ← Valid            │
│  Email: jeff@examp      ← Real-time check  │
│  ⚠️ Invalid format!                          │
│                                             │
│  Fix: jeff@example.com ← User corrects     │
│  ✅ Error gone!                             │
│                                             │
│  Subject: Inquiry       ← Valid            │
│  Message: [content]     ← 245/5000         │
│                                             │
│  [Send Message] ← Clickable                │
└─────────────────────────────────────────────┘
```

**After Click:**
```
[Sending...] ← Button disabled, shows loading state
   ↓
Backend processes...
   ↓
✅ Success message appears
Form resets
```

---

## Copy-Paste Valid Email Examples

If users want to test with real emails, these formats work:

```
testing@gmail.com
admin@company.com
user.name@example.org
john.doe@test.co.uk
jane+tag@domain.com
support123@website.net
```

All of these will pass validation! ✅

---

## Summary for Users

| What User Does | What They See |
|---|---|
| Type invalid email | Red error appears immediately |
| Correct the email | Error clears automatically |
| Submit with empty fields | Error under each empty field |
| Message too short | Error: "Must be at least 20 characters" |
| Message too long | Error: "Must be 5000 characters or fewer" |
| Valid submission | ✅ Success message & form resets |
| Backend not running | ❌ Network error message |

---

## Testing All Validations

**Checklist for QA:**

- [ ] Empty Name → Shows error
- [ ] Empty Email → Shows error
- [ ] Empty Message → Shows error
- [ ] Invalid Email format → Shows error
- [ ] Email too long (150+ chars) → Shows error
- [ ] Name too long (150+ chars) → Shows error
- [ ] Subject too long (255+ chars) → Shows error
- [ ] Message too short (< 20 chars) → Shows error
- [ ] Message too long (> 5000 chars) → Shows error
- [ ] Valid data → Success message
- [ ] Email validation in real-time → Errors/clears as typed
- [ ] Backend down → Network error

All passing? ✅ Form is fully validated!

---

## Notes for Developers

The validation happens in this order:

1. **Real-time validation** (as user types) - Email field only
2. **Client-side validation** (before submit) - All fields
3. **Server-side validation** (backend checks) - All fields
4. **Database save** - Final confirmation

This triple-check ensures data quality and security! 🔒
