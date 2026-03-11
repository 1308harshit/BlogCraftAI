# 🧪 BlogCraft AI - Manual Testing Guide

## Quick Testing Steps (5 minutes)

### Prerequisites
- Dev server running: `npm run dev`
- Browser open: http://localhost:3001

---

## Test 1: Landing Page (30 seconds)

1. Open http://localhost:3001
2. Check:
   - ✅ Hero section loads
   - ✅ "BlogCraft AI" title visible
   - ✅ "Generate Google-optimized blog posts in 60 seconds with Groq AI" text
   - ✅ "Try Free Demo" button works
   - ✅ Features section shows 4 features
   - ✅ Pricing section displays plans
   - ✅ Footer has links

**Expected**: Clean, professional landing page

---

## Test 2: Blog Generator (2 minutes)

1. Click "Try Free Demo" or go to http://localhost:3001/generator
2. Enter topic: "How to Start a SaaS Business"
3. Enter keywords: "SaaS, startup, business, revenue"
4. Click "Generate Article"
5. Wait 1-2 seconds
6. Check:
   - ✅ Loading spinner appears
   - ✅ Article generates successfully
   - ✅ Article has proper structure (title, headings, content)
   - ✅ Article is 800+ words
   - ✅ "Copy to Clipboard" button works
   - ✅ Can generate multiple articles

**Expected**: High-quality, SEO-optimized blog post in < 2 seconds

---

## Test 3: Usage Limits (1 minute)

1. Stay on generator page
2. Generate 3 articles with different topics
3. Try to generate 4th article
4. Check:
   - ✅ First 3 articles generate successfully
   - ✅ 4th article shows limit message (if using userId)
   - ✅ Message suggests upgrading

**Expected**: Free tier limited to 3 articles per user

---

## Test 4: User Signup (1 minute)

1. Go to http://localhost:3001/signup
2. Enter:
   - Name: "Test User"
   - Email: "test@example.com"
   - Password: "TestPass123!"
3. Click "Create Account"
4. Check:
   - ✅ Form submits
   - ✅ Success message appears (or redirects to dashboard)
   - ✅ No errors in console

**Expected**: Account created successfully (demo mode)

---

## Test 5: Dashboard (30 seconds)

1. Go to http://localhost:3001/dashboard
2. Check:
   - ✅ Dashboard page loads
   - ✅ Shows user stats
   - ✅ Shows recent articles (if any)
   - ✅ Navigation works

**Expected**: Clean dashboard interface

---

## Test 6: Legal Pages (30 seconds)

1. Go to http://localhost:3001/terms
2. Check Terms of Service page loads
3. Go to http://localhost:3001/privacy
4. Check Privacy Policy page loads
5. Check:
   - ✅ Both pages have content
   - ✅ Proper formatting
   - ✅ Footer links work

**Expected**: Complete legal pages

---

## Test 7: Responsive Design (30 seconds)

1. Open browser DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test on:
   - Mobile (375px)
   - Tablet (768px)
   - Desktop (1920px)
4. Check:
   - ✅ Layout adapts properly
   - ✅ Buttons are clickable
   - ✅ Text is readable
   - ✅ No horizontal scroll

**Expected**: Works on all screen sizes

---

## Test 8: API Endpoints (Optional - 2 minutes)

### Using Browser Console (F12)

**Test Generate API:**
```javascript
fetch('http://localhost:3001/api/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    topic: 'AI in Healthcare',
    keywords: 'AI, healthcare, technology',
    userId: 'test-user-123'
  })
})
.then(r => r.json())
.then(d => console.log(d))
```

**Test User API:**
```javascript
fetch('http://localhost:3001/api/user?userId=test-123')
.then(r => r.json())
.then(d => console.log(d))
```

**Expected**: JSON responses with data

---

## Test 9: Error Handling (1 minute)

1. Go to generator
2. Try to generate without topic
3. Try to generate with very long topic (1000+ chars)
4. Check:
   - ✅ Validation messages appear
   - ✅ No crashes
   - ✅ Helpful error messages

**Expected**: Graceful error handling

---

## Test 10: Performance (30 seconds)

1. Open DevTools → Network tab
2. Reload homepage
3. Check:
   - ✅ Page loads in < 2 seconds
   - ✅ No failed requests
   - ✅ Images load properly
4. Generate article
5. Check:
   - ✅ Article generates in < 3 seconds
   - ✅ No console errors

**Expected**: Fast, smooth performance

---

## 🐛 Common Issues & Fixes

### Issue: "Cannot connect to server"
**Fix**: Run `npm run dev` in terminal

### Issue: "API key not found"
**Fix**: Check `.env.local` has `GROQ_API_KEY`

### Issue: "Module not found"
**Fix**: Run `npm install`

### Issue: Articles not generating
**Fix**: Check console for errors, verify Groq API key

### Issue: Styling looks broken
**Fix**: Clear browser cache, restart dev server

---

## ✅ Testing Checklist

Copy this checklist for each test session:

```
[ ] Landing page loads correctly
[ ] Hero section displays properly
[ ] Features section shows all 4 features
[ ] Pricing section displays plans
[ ] Generator page accessible
[ ] Can generate blog articles
[ ] Articles are high quality (800+ words)
[ ] Generation takes < 3 seconds
[ ] Copy to clipboard works
[ ] Usage limits enforced (3 free articles)
[ ] Signup form works
[ ] Dashboard loads
[ ] Terms page loads
[ ] Privacy page loads
[ ] Responsive on mobile
[ ] Responsive on tablet
[ ] No console errors
[ ] No broken images
[ ] All links work
[ ] Footer displays correctly
```

---

## 📊 Expected Results Summary

| Test | Expected Time | Expected Result |
|------|--------------|-----------------|
| Landing Page | 30s | Clean, professional UI |
| Blog Generator | 2min | Article in < 2 seconds |
| Usage Limits | 1min | Limit at 3 articles |
| User Signup | 1min | Account created |
| Dashboard | 30s | Stats displayed |
| Legal Pages | 30s | Complete content |
| Responsive | 30s | Works on all sizes |
| API Endpoints | 2min | JSON responses |
| Error Handling | 1min | Graceful errors |
| Performance | 30s | Fast loading |

**Total Testing Time**: ~10 minutes

---

## 🎯 Success Criteria

**Pass**: All tests complete without critical errors
**Partial Pass**: Minor UI issues but core functionality works
**Fail**: Cannot generate articles or major crashes

---

## 📝 Bug Report Template

If you find issues, report them like this:

```
**Bug**: [Short description]
**Steps to Reproduce**:
1. Go to...
2. Click on...
3. See error...

**Expected**: [What should happen]
**Actual**: [What actually happened]
**Browser**: Chrome/Firefox/Safari
**Screenshot**: [If applicable]
```

---

## 🚀 Quick Start Command

```bash
# Start dev server
npm run dev

# Open browser
# Go to: http://localhost:3001

# Start testing!
```

---

**Happy Testing! 🎉**

*Last Updated: March 11, 2026*
