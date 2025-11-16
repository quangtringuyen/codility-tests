# The TRUTH About Free Hosting in 2025

## Critical Update: Render PostgreSQL Expires!

**IMPORTANT**: Render's free PostgreSQL databases **expire after 30 days** and are **permanently deleted** after a 14-day grace period. This was not clearly documented in many tutorials.

## What's Actually Free in 2025?

### ✅ Truly Free Forever (No Expiration, No Credit Card)

**1. PythonAnywhere** - **RECOMMENDED**
- ✅ Free web hosting forever
- ✅ SQLite database forever (no expiration)
- ✅ No credit card required
- ✅ Instant startup (no cold start)
- ❌ Manual deployment (no auto-deploy from GitHub)
- ❌ SQLite only (no PostgreSQL on free tier)

**Verdict**: Best for long-term projects like this 8-week training tracker.

---

**2. Render with SQLite + Persistent Disk**
- ✅ Free web hosting forever
- ✅ SQLite persists with disk mount
- ✅ Auto-deploy from GitHub
- ✅ No credit card required
- ❌ Sleeps after 15 min (~30 sec cold start)
- ⚠️ PostgreSQL expires in 30 days (don't use free PostgreSQL!)

**Verdict**: Good if you want GitHub auto-deploy, but must use SQLite.

---

**3. Fly.io**
- ✅ Free tier with 3GB storage
- ✅ PostgreSQL that doesn't expire
- ✅ Fast cold starts (~5 sec)
- ⚠️ **Requires credit card** for verification (but no charges)
- ❌ CLI-based (more complex setup)

**Verdict**: Good for developers comfortable with CLI, requires credit card.

---

### ❌ NOT Free or Has Major Limitations

**Railway**
- ❌ Removed free tier in 2023
- $5 one-time trial credit (expires in 30 days)
- After trial: $5/month minimum
- Services shut down without payment

**Heroku**
- ❌ Removed all free tiers in November 2022
- Minimum: $5/month for web dyno + $5/month for database
- Total: ~$10/month minimum

**Render PostgreSQL**
- ❌ Expires after 30 days
- ❌ Deleted after 14-day grace period
- ❌ No backups on free tier
- Email warnings before deletion

---

## Comparison Table: What ACTUALLY Works

| Platform | Web Hosting | Database | Expiration | Credit Card | Best For |
|----------|-------------|----------|------------|-------------|----------|
| **PythonAnywhere** | ✅ Free forever | ✅ SQLite forever | ❌ Never | ❌ No | **8-week training** |
| **Render** | ✅ Free forever | ⚠️ SQLite OK, PostgreSQL 30 days | Web: Never, DB: 30 days | ❌ No | Auto-deploy fans |
| **Fly.io** | ✅ Free tier | ✅ PostgreSQL forever | ❌ Never | ✅ Required | Developers |
| **Railway** | ❌ Trial only | ❌ Paid | 30 days | ✅ Required | Paid projects |
| **Heroku** | ❌ Paid | ❌ Paid | N/A | ✅ Required | Enterprise |

---

## Recommendation for Codility Training Tracker

### 🏆 Use PythonAnywhere

**Why?**
1. ✅ You'll use it for 8 weeks (56 days) - longer than Render's 30-day PostgreSQL limit
2. ✅ Your progress data will be safe forever (no database expiration)
3. ✅ No credit card required
4. ✅ No surprises or hidden limitations
5. ✅ SQLite works perfectly fine for a single-user training tracker

**Trade-offs:**
- Manual deployment (no auto-deploy from GitHub)
- SQLite instead of PostgreSQL (but this app works fine with both!)

### Alternative: Render with SQLite

If you really want GitHub auto-deploy:
- Use Render for web hosting ✅
- **Do NOT use Render's PostgreSQL** ❌
- Use SQLite with persistent disk instead ✅
- Your database will persist forever ✅

---

## The Render PostgreSQL Problem

### What Happens:

1. **Day 1-30**: Everything works fine
2. **Day 30**: You get email warning
3. **Day 31-44**: 14-day grace period
4. **Day 45**: **Database permanently deleted** - all your progress gone!

### How to Avoid:

**Option 1**: Use PythonAnywhere instead (recommended)

**Option 2**: Use Render with SQLite + Persistent Disk:
```yaml
# In Render dashboard:
# Add a Disk to your web service
# Mount path: /opt/render/project/src
# Set DATABASE_URL to: sqlite:///codility_progress.db
```

**Option 3**: Accept the 30-day limit (not recommended for 8-week program!)

---

## What Changed from Old Tutorials

Many 2023 tutorials say:
- ✅ "Render has free PostgreSQL" - **TRUE but expires in 30 days!**
- ✅ "Railway is free" - **WAS TRUE, now paid ($5/month)**
- ✅ "Heroku has free tier" - **WAS TRUE until Nov 2022**

Updated 2025 reality:
- ⚠️ Render PostgreSQL expires after 30 days (changed to 30 from 90 in 2024)
- ❌ Railway removed free tier in 2023
- ❌ Heroku removed free tier in 2022
- ✅ PythonAnywhere still free (and always has been!)

---

## Migration Guide

### If you already deployed to Render with PostgreSQL:

**Before Day 30:**
1. Export your database data
2. Switch to SQLite with persistent disk
3. Import your data

**OR**

1. Migrate to PythonAnywhere
2. Much simpler for long-term use

### If you're starting fresh:

Just use **PythonAnywhere** from the beginning. It's the most reliable free option for a project lasting 8+ weeks.

---

## Bottom Line

**For the Codility Training Tracker (8-week duration):**

1. **Best choice**: PythonAnywhere
   - Free forever
   - Database never expires
   - Perfect for 8-week training

2. **Second choice**: Render with SQLite + Persistent Disk
   - If you need GitHub auto-deploy
   - Don't use PostgreSQL!

3. **Advanced choice**: Fly.io
   - If you have a credit card and like CLI tools

**Avoid**: Railway (paid), Heroku (paid), Render PostgreSQL (expires)

---

## Files Updated

- ✅ `DEPLOYMENT.md` - Complete rewrite with accurate information
- ✅ `README.md` - Updated to recommend PythonAnywhere
- ✅ `QUICKSTART.md` - Corrected deployment instructions
- ✅ `DEPLOYMENT_TRUTH_2025.md` - This file

**Key message**: Don't trust old tutorials. Hosting landscape changed dramatically in 2022-2024.

---

Last Updated: January 2025

**Thank you** for catching the Render PostgreSQL expiration issue! This is critical information that many developers miss.
