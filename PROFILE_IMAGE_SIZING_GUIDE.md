# Profile Image Sizing Guide

## Overview

This guide explains how to adjust the profile picture sizing on the Home page (Hero Section) and About page. The profile image is now set to **CV attire.png** and uses centered, through-the-circle styling for a polished look.

---

## Current Configuration

### Image File
- **Location**: `frontend/public/images/CV attire.png`
- **Used on**: Home page (Hero Section) & About page (sidebar)
- **Styling**: `object-cover object-center` for perfect centering

---

## Adjusting Image Sizes

### About Page (Sidebar Profile Card)

**File**: `frontend/src/app/about/page.tsx` (around line 100)

**Current size**: `w-32 h-32` (128px × 128px)

#### To Change Size:

```jsx
// Current code:
<div className="w-32 h-32 mx-auto mb-4 rounded-full ...">
  <img src="/images/CV attire.png" className="w-full h-full object-cover object-center" />
</div>
```

#### Size Options:

| Size Class | Pixels | Use Case |
|-----------|--------|----------|
| `w-24 h-24` | 96px | Compact, minimal space |
| `w-28 h-28` | 112px | Small sidebar |
| `w-32 h-32` | 128px | **Current (recommended)** |
| `w-36 h-36` | 144px | More prominent |
| `w-40 h-40` | 160px | Very prominent |
| `w-48 h-48` | 192px | Large/full attention |

#### Example - Make It Larger:
```jsx
<div className="w-40 h-40 mx-auto mb-4 rounded-full ...">
  <img src="/images/CV attire.png" className="w-full h-full object-cover object-center" />
</div>
```

---

### Home Page (Hero Section - Circular Profile)

**File**: `frontend/src/components/sections/HeroSection.tsx` (around line 122)

**Current setup**:
```jsx
<div className="absolute inset-2 rounded-full bg-bg-panel border border-neon-pink/50 overflow-hidden shadow-neon-pink-lg flex items-center justify-center">
  <img src="/images/CV attire.png" className="w-full h-full object-cover object-center" />
</div>
```

**Parent Circle**: `w-96 h-96` (384px × 384px)

#### To Change Size:

The hero image size is controlled by the **parent container** (`w-96 h-96`). Adjust these classes:

| Size Class | Pixels | Use Case |
|-----------|--------|----------|
| `w-80 h-80` | 320px | Smaller, more subtle |
| `w-88 h-88` | 352px | Slightly smaller |
| `w-96 h-96` | 384px | **Current (recommended)** |
| `w-[416px] h-[416px]` | 416px | Slightly larger |
| `w-screen h-screen` | 100% | Full screen (extreme) |

#### Example - Make It Smaller:
```jsx
<div className="w-80 h-80 rounded-full relative ...">
  {/* Inner circle with image stays the same */}
  <div className="absolute inset-2 rounded-full ...">
    <img ... />
  </div>
</div>
```

#### The Ring Layout:

The hero profile has two circles:
1. **Outer circle**: `w-96 h-96` - The main container
2. **Inner circle**: `inset-2 rounded-full` - Adds 8px padding (the gradient ring effect)

The `inset-2` value creates the gradient ring between outer and inner circles.

---

## Image Styling Explained

### Current Image Classes

```jsx
className="w-full h-full object-cover object-center"
```

**Breakdown**:
- `w-full h-full` - Image fills entire container
- `object-cover` - Image crops to fill circle without distortion
- `object-center` - Centers the image (ensures face is centered)

### Advanced Adjustments

If the face positioning needs adjustment, you can use:

```jsx
// Move image up (for lower face position in photo)
className="w-full h-full object-cover object-top"

// Move image down (for higher face position in photo)
className="w-full h-full object-cover object-bottom"

// Move image left or right
// Note: CSS object-position may need inline styles:
className="w-full h-full object-cover"
style={{ objectPosition: '40% 50%' }} // 40% from left, 50% from top
```

---

## Complete Example - Adjusting Both Pages

### About Page - Larger Profile Picture

**Before**:
```jsx
<div className="w-32 h-32 mx-auto mb-4 rounded-full ...">
  <img src="/images/CV attire.png" className="w-full h-full object-cover object-center" />
</div>
```

**After (40% larger)**:
```jsx
<div className="w-40 h-40 mx-auto mb-4 rounded-full ...">
  <img src="/images/CV attire.png" className="w-full h-full object-cover object-center" />
</div>
```

### Home Page - Smaller Hero Circle

**Before**:
```jsx
<div className="w-96 h-96 rounded-full relative ...">
  <div className="absolute inset-2 rounded-full ...">
    <img src="/images/CV attire.png" className="w-full h-full object-cover object-center" />
  </div>
</div>
```

**After (smaller)**:
```jsx
<div className="w-80 h-80 rounded-full relative ...">
  <div className="absolute inset-2 rounded-full ...">
    <img src="/images/CV attire.png" className="w-full h-full object-cover object-center" />
  </div>
</div>
```

---

## Responsive Sizing (Mobile/Desktop)

For responsive sizes that change based on screen size:

### About Page - Responsive
```jsx
<div className="w-32 md:w-40 h-32 md:h-40 mx-auto mb-4 rounded-full ...">
  <img ... />
</div>
```
- Mobile: 128px
- Desktop (md+): 160px

### Home Page - Responsive
```jsx
<div className="w-72 md:w-96 h-72 md:h-96 rounded-full relative ...">
  <div className="absolute inset-2 rounded-full ...">
    <img ... />
  </div>
</div>
```
- Mobile: 288px
- Desktop (md+): 384px

---

## Tailwind Breakpoints Reference

```
sm: 640px   (small screens)
md: 768px   (tablets, small desktops)
lg: 1024px  (medium desktops)
xl: 1280px  (large desktops)
2xl: 1536px (extra large)
```

---

## Quick Reference - All Size Options

### Tailwind Width/Height Classes

```
w-20  h-20   = 80px
w-24  h-24   = 96px
w-28  h-28   = 112px
w-32  h-32   = 128px ← About page current
w-36  h-36   = 144px
w-40  h-40   = 160px
w-44  h-44   = 176px
w-48  h-48   = 192px
w-52  h-52   = 208px
w-56  h-56   = 224px
w-60  h-60   = 240px
w-64  h-64   = 256px
w-72  h-72   = 288px
w-80  h-80   = 320px
w-88  h-88   = 352px
w-96  h-96   = 384px ← Home page current
```

---

## How to Apply Changes

1. **Open the file** in your editor
2. **Find the image container** (look for `w-32 h-32` or `w-96 h-96`)
3. **Replace the size classes** with your desired size
4. **Save the file**
5. **Test locally**: Run `npm run dev` and check at http://localhost:3000
6. **Commit and push**: When happy with the changes

---

## Troubleshooting

### Image looks stretched or compressed
- ✅ Already handled with `object-cover` - keeps aspect ratio

### Image is off-center
- ✅ Use `object-center` (already applied)
- 🔧 If still off, use `object-position` CSS property

### Size changes don't appear
- ✅ Clear browser cache (Ctrl+Shift+Delete)
- ✅ Rebuild: `npm run build`

### Different sizes on mobile vs desktop
- ✅ Use responsive classes: `w-32 md:w-40`

---

## Files to Modify

| Page | File | Line # | Class to Change |
|------|------|--------|-----------------|
| About (sidebar) | `src/app/about/page.tsx` | ~100 | `w-32 h-32` |
| Home (hero) | `src/components/sections/HeroSection.tsx` | ~122 | `w-96 h-96` |

---

## Image Properties

**Current Image**: CV attire.png
- **Format**: PNG (transparent background)
- **Location**: `frontend/public/images/CV attire.png`
- **Styling**: Centered, through-circle with gradient ring
- **Pages**: Home page + About page

---

## Notes

- The image uses `object-cover` and `object-center` for perfect centering
- The gradient ring effect on the home page is created by the `inset-2` padding
- All sizes are relative to Tailwind's default spacing scale
- Changes apply immediately after file save during development

---

**Last Updated**: 2026-07-28  
**Image Version**: CV attire.png
