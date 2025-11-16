# Deployment Options Update (2025)

## Important Changes

The hosting landscape has changed significantly. This document clarifies what's truly free vs paid in 2025.

## Summary: What's Actually FREE?

### ✅ Truly Free Options (No Credit Card Required)

1. **Render.com** - **RECOMMENDED**
   - Free PostgreSQL database included
   - Auto-deploy from GitHub
   - Limitation: Sleeps after 15 min of inactivity (~30 sec cold start)
   - Perfect for personal projects like this tracker

2. **PythonAnywhere**
   - Free tier available
   - Limitation: SQLite only (no PostgreSQL on free tier)
   - Manual deployment (no auto-deploy)
   - Great for beginners

3. **Fly.io**
   - Free tier with 3GB storage
   - PostgreSQL included
   - CLI-based deployment
   - Good for developers

### ❌ NOT Free Anymore

1. **Railway**
   - **Changed in 2023**: Removed free tier
   - Trial: $5 one-time credit (expires in 30 days)
   - After trial: $5/month minimum
   - Previously recommended, now paid-only

2. **Heroku**
   - **Changed in Nov 2022**: Eliminated all free tiers
   - Minimum: $5/month for dynos + $5/month for database
   - Total: ~$10/month minimum

## Updated Recommendations

### For This Codility Training Tracker:

**🏆 Best Choice: PythonAnywhere**

Why?
- Completely free (no credit card)
- SQLite database **never expires**
- Perfect for 8-week training (56 days)
- Free tier lasts forever
- No database deletion surprises

**🥈 Second Choice: Render with SQLite + Persistent Disk**

Why?
- Auto-deploys from GitHub
- Free web hosting
- **IMPORTANT**: Do NOT use Render's PostgreSQL (expires in 30 days!)
- Use SQLite with persistent disk instead
- App sleeps after 15 min (~30 sec wake time)

**⚠️ CRITICAL WARNING**: Render's free PostgreSQL databases expire after 30 days and are permanently deleted. Since this training program takes 8 weeks (56 days), you'd lose all your progress if you used Render PostgreSQL!

### Quick Deployment to PythonAnywhere

```bash
# 1. Sign up at pythonanywhere.com (free)
# 2. Open a Bash console
# 3. Clone your code
git clone your-github-repo-url
cd codility-tests

# 4. Create virtual environment
mkvirtualenv --python=/usr/bin/python3.10 codility-env
pip install -r requirements.txt

# 5. Create web app via dashboard
# - Go to Web tab → Add new web app
# - Choose Manual configuration, Python 3.10
# - Configure WSGI file (see DEPLOYMENT.md for details)

# 6. Done! Your database persists forever.
```

### Quick Deployment to Render (with SQLite)

```bash
# 1. Push to GitHub
git init
git add .
git commit -m "Initial commit"
git push -u origin main

# 2. Go to render.com
# 3. Create Web Service from GitHub
# 4. Add Persistent Disk:
#    - Mount path: /opt/render/project/src
# 5. Set environment variables:
#    - DATABASE_URL: sqlite:///codility_progress.db
#    - SECRET_KEY: (generate new one)
# 6. Deploy!
# DO NOT create PostgreSQL database - it expires!
```

## Cost Comparison Table

| Platform | Setup Cost | Monthly Cost | Database Persistence | Credit Card | Best For |
|----------|-----------|--------------|---------------------|-------------|----------|
| **PythonAnywhere** | $0 | $0 | ✅ SQLite forever | ❌ No | **8-week training** |
| **Render** | $0 | $0 | ⚠️ PostgreSQL 30 days, SQLite forever | ❌ No | **Short projects** |
| **Fly.io** | $0 | $0 | ✅ PostgreSQL forever | ✅ Required | **Developers** |
| **Railway** | $5 trial | $5/month | ✅ Paid | ✅ Required | Paid projects |
| **Heroku** | $0 | $10/month | ✅ Paid | ✅ Required | Enterprise |

## Migration Guide

If you were planning to use Railway or Heroku based on older documentation:

### Switch to PythonAnywhere Instead

PythonAnywhere is now the best truly free option:
- ✅ Free tier forever
- ✅ SQLite database that never expires
- ✅ Perfect for 8-week training program
- ✅ No credit card required
- ✅ Instant startup (no cold start delays)

### What About Render?

Render looked promising but has a critical flaw:
- ✅ Free web hosting
- ✅ GitHub auto-deploy
- ❌ **PostgreSQL expires after 30 days!**
- ⚠️ Must use SQLite with persistent disk instead

**For an 8-week program (56 days)**, Render's PostgreSQL would expire and delete all your data mid-training!

### Why PythonAnywhere Over Render?

**PythonAnywhere advantages:**
- Database never expires (critical for 8+ week training)
- Instant startup (no cold start wait)
- Simpler setup for beginners
- No surprises or hidden limitations

**Render advantages:**
- Auto-deploy from GitHub (PythonAnywhere is manual)
- More modern interface

**Verdict**: For a training tracker you'll use for 8 weeks, PythonAnywhere's reliability wins.

## What Changed in the Documentation

### Files Updated:
1. ✅ `DEPLOYMENT.md` - Complete rewrite with accurate 2025 info
2. ✅ `README.md` - Updated deployment section
3. ✅ `QUICKSTART.md` - Updated quick deployment guide
4. ✅ Added this file for clarity

### Key Changes:
- **PythonAnywhere moved to #1 recommended** (was #2)
- **Render downgraded due to PostgreSQL 30-day expiration**
- **Railway marked as PAID** (was free until 2023)
- **Heroku marked as PAID** (was free until 2022)
- Added **critical warning** about Render PostgreSQL expiration
- Added **Fly.io** as alternative (requires credit card)
- Added cost comparison tables
- Clarified "free tier" vs "trial" vs "paid" vs "expires"

## Bottom Line

**For this Codility Training Tracker, use PythonAnywhere - it's truly free forever with no database expiration.**

No credit card required, no surprise database deletions, and your 8 weeks of progress data will be safe. While Render offers auto-deploy from GitHub, its PostgreSQL expiring after 30 days makes it unsuitable for an 8-week training program.

**Critical lesson**: "Free" doesn't always mean "free forever" - always check for expiration policies!

---

Last Updated: January 2025
