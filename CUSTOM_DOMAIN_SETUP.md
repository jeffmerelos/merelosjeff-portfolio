# 🌐 Setup Custom Domain for Your Portfolio

## Problem

Your portfolio on `merelosjeff-portfolio.vercel.app` requires Vercel login to view.

Your friends can't access it without a Vercel account! 😞

## Solution

Connect a **custom domain** to your Vercel project so anyone can access it without logging in.

**Example:** Instead of `merelosjeff-portfolio.vercel.app`, you'll have:
```
https://yourportfolio.com
https://jeffdev.com
https://yourname.dev
```

---

## Step 1: Get a Domain Name

You need to buy a domain. Here are popular registrars:

### Option A: Buy Cheap Domain
- **Namecheap** - https://www.namecheap.com (usually $8-12/year)
- **GoDaddy** - https://www.godaddy.com ($10-15/year)
- **Google Domains** - https://domains.google (varies)
- **Porkbun** - https://porkbun.com (affordable)

**Recommended:** `.dev`, `.com`, or `.io` domains

**Examples:**
- `jeffdev.com`
- `jeff-developer.dev`
- `yourname.io`
- `portfolio.dev`

---

## Step 2: Add Domain to Vercel

### 2A: Go to Vercel Project Settings

1. Visit: https://vercel.com/dashboard
2. Click your frontend project: `merelosjeff-portfolio`
3. Click **Settings** tab
4. Click **Domains** in left menu

### 2B: Add Your Domain

1. Click **Add Domain**
2. Enter your domain name (e.g., `jeffdev.com`)
3. Click **Add**

Vercel will show you DNS configuration options.

---

## Step 3: Point Domain to Vercel

You have **two options:**

### Option 1: Change Nameservers (Easiest)

Vercel will provide nameservers. Point your domain's nameservers to Vercel:

1. In Vercel, you'll see nameservers (usually 4 of them)
2. Go to your domain registrar (Namecheap, GoDaddy, etc.)
3. Login to your account
4. Find **DNS** or **Nameservers** settings
5. Replace existing nameservers with Vercel's nameservers
6. Save changes

**Wait 24-48 hours for DNS to propagate.**

### Option 2: Add DNS Records (More Control)

If you want to keep current nameservers:

1. In Vercel, click **Add DNS Record**
2. Vercel will show required DNS records:
   - CNAME records
   - A records
   - TXT records
3. Go to your domain registrar
4. Add these DNS records
5. Save

**Wait 24-48 hours for DNS to propagate.**

---

## Step 4: Wait for Verification

Vercel will verify the domain connection:

1. **Status:** Initially shows "Pending"
2. **Wait:** 24-48 hours
3. **Result:** Status changes to ✅ "Valid"

Once verified, your domain works!

---

## Step 5: Test Your Domain

Once DNS propagates:

1. Visit your domain: `https://yourportfolio.com`
2. You should see your portfolio
3. No login required ✅
4. Anyone can access it ✅
5. HTTPS is automatically enabled ✅ (Vercel provides free SSL certificate)

---

## Complete Example

### Before:
```
https://merelosjeff-portfolio.vercel.app/
❌ Requires Vercel login
❌ Shows Vercel branding
```

### After:
```
https://jeffdev.com/
✅ Public access (no login!)
✅ Your own branding
✅ Professional appearance
✅ HTTPS secured
```

---

## Detailed Step-by-Step (Using Namecheap)

### Get Domain:

1. Go to https://www.namecheap.com
2. Search for desired domain
3. Add to cart and checkout
4. Complete purchase
5. You now own the domain!

### Configure in Vercel:

1. Go to https://vercel.com/dashboard
2. Select your project
3. Settings → Domains
4. Add Domain → Enter your domain → Add

### Point Domain to Vercel:

1. Vercel shows you nameservers to use
2. Go to Namecheap dashboard
3. Find your domain
4. Click **Manage**
5. Go to **Nameservers** section
6. Select **Custom Nameservers**
7. Enter Vercel's nameservers (usually 4)
8. Save changes

### Wait for DNS:

1. DNS propagation: 24-48 hours
2. Check status in Vercel dashboard
3. Once "Valid" ✅, domain is ready

### Test:

```
https://yourdomain.com/  → Your portfolio!
```

---

## FAQ

**Q: Why do I need a custom domain?**
A: `vercel.app` subdomains require Vercel account login. Custom domains are public and anyone can access.

**Q: How much does a domain cost?**
A: Usually $8-15/year depending on extension (.com, .dev, .io, etc.)

**Q: How long until domain works?**
A: 24-48 hours for DNS to propagate globally.

**Q: Is HTTPS free?**
A: Yes! Vercel provides free SSL certificates for all custom domains.

**Q: Can I use subdomain?**
A: Yes! You can use `portfolio.example.com` if you already own `example.com`.

**Q: What if I already own a domain?**
A: Great! Just add it to Vercel and point nameservers/DNS records to Vercel.

**Q: Can I have multiple domains?**
A: Yes, you can add multiple domains to one Vercel project.

---

## Quick Checklist

- [ ] Decide on domain name
- [ ] Check domain availability
- [ ] Purchase domain from registrar
- [ ] Go to Vercel project settings
- [ ] Click Domains
- [ ] Add your domain
- [ ] Copy Vercel nameservers/DNS records
- [ ] Go to domain registrar
- [ ] Update nameservers or DNS records
- [ ] Wait 24-48 hours
- [ ] Check Vercel dashboard - should show ✅ Valid
- [ ] Visit your domain
- [ ] See portfolio working publicly!
- [ ] Share link with friends
- [ ] They can access without login ✅

---

## After Domain is Live

### Share Your Portfolio

Now you can share with confidence:
- Send to employers: `https://yourdomain.com`
- Add to LinkedIn: `https://yourdomain.com`
- Add to resume: `https://yourdomain.com`
- Add to social media: `https://yourdomain.com`

### No More Vercel Login Required! ✅

Anyone can visit your portfolio without:
- Vercel account
- GitHub account
- Any special login
- Just click and view!

---

## Recommended Domains

Professional extensions for tech portfolios:

| Extension | Cost | Professional |
|-----------|------|--------------|
| `.dev` | $12/year | ⭐⭐⭐⭐⭐ Best for developers |
| `.com` | $8-10/year | ⭐⭐⭐⭐ Most recognizable |
| `.io` | $35/year | ⭐⭐⭐⭐ Tech-friendly |
| `.co` | $10-15/year | ⭐⭐⭐ Modern alternative |

**Examples:**
- `jeffdev.dev` - Professional
- `your-name.dev` - Clean
- `portfolio.dev` - Clear purpose
- `john-developer.com` - Classic

---

## Support

If you need help:

1. **Vercel Domain Setup:** https://vercel.com/docs/concepts/projects/domains
2. **Namecheap DNS Guide:** https://www.namecheap.com/support/
3. **DNS Propagation Checker:** https://www.whatsmydns.net/

---

## Summary

**Current:** `merelosjeff-portfolio.vercel.app` (requires Vercel login)

**Goal:** `yourportfolio.com` (public, no login needed)

**Steps:**
1. Buy domain ($8-15/year)
2. Add to Vercel (Settings → Domains)
3. Point domain to Vercel (update nameservers)
4. Wait 24-48 hours
5. Done! Public portfolio!

---

**Ready to make your portfolio public?** 🚀

1. Pick a domain
2. Buy it
3. Add to Vercel
4. Wait for DNS
5. Share link!
