# Deployment Guide

This guide provides detailed instructions for deploying the Codility Training Tracker to various hosting platforms.

## Recommended Platform: PythonAnywhere (Truly Free Forever!)

**For truly free hosting with persistent database, we recommend PythonAnywhere.** Render's PostgreSQL expires after 30 days. Railway and Heroku removed their free tiers.

## Table of Contents
1. [PythonAnywhere](#pythonanywhere) - **RECOMMENDED** - Truly free forever with SQLite
2. [Render](#render) - Free web hosting (PostgreSQL expires in 30 days, use SQLite)
3. [Fly.io](#flyio) - Free tier available (requires credit card)
4. [Railway](#railway) - **PAID** ($5/month minimum after trial)
5. [Heroku](#heroku) - **PAID** (No free tier as of Nov 2022)
6. [General Tips](#general-tips)

---

## Render

**Best free web hosting, but PostgreSQL expires after 30 days**

Render provides free web hosting with auto-deploy from GitHub. However, their free PostgreSQL databases expire after 30 days and are deleted after a 14-day grace period.

### ⚠️ Important Limitations

- **Web Service**: Free forever, sleeps after 15 min inactivity
- **PostgreSQL Database**: **EXPIRES AFTER 30 DAYS** and gets **DELETED** after 14-day grace period
- **No backups** on free PostgreSQL tier

**Recommendation**: Use Render for web hosting, but use **SQLite** instead of PostgreSQL to avoid database expiration.

### Option 1: Render with SQLite (Recommended for Free Users)

Since PostgreSQL expires, use SQLite for truly persistent free hosting:

1. **Sign up at [render.com](https://render.com)**

2. **Create a Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Name: `codility-tracker`

3. **Configure Build Settings**
   - **Environment**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`
   - **Plan**: Free

4. **Set Environment Variables**
   - `SECRET_KEY`: Generate with `python -c 'import secrets; print(secrets.token_hex(32))'`
   - `FLASK_ENV`: `production`
   - `DATABASE_URL`: `sqlite:///codility_progress.db` (SQLite, no expiration)

5. **Add Persistent Disk** (Critical for SQLite!)
   - In service settings, add a "Disk"
   - Mount path: `/opt/render/project/src`
   - This ensures your SQLite database persists across deploys

6. **Deploy**
   - Click "Create Web Service"
   - Wait 3-5 minutes for deployment

### Option 2: Render with PostgreSQL (Only for 8-week duration)

Only use if you'll finish your training in 30 days or willing to recreate DB monthly:

1. Create PostgreSQL database (Free tier) - **Expires in 30 days!**
2. Follow steps above but use PostgreSQL DATABASE_URL
3. **Set calendar reminder** to backup data before 30-day expiration

### Important Notes
- **Free tier sleeps after 15 minutes of inactivity** (~30 sec wake time)
- **SQLite is better for free tier** - no expiration, persistent
- Auto-deploys on every GitHub push to main branch
- **No credit card required**

### Troubleshooting Render
- View logs: Click "Logs" tab in dashboard
- Check build: Click "Events" tab
- Manual deploy: Click "Manual Deploy" → "Deploy latest commit"

---

## PythonAnywhere

**Free tier with SQLite - Good for simple deployments**

PythonAnywhere is ideal for Python web apps with a generous free tier.

### Prerequisites
- PythonAnywhere account (sign up free)

### Steps

1. **Sign up at [pythonanywhere.com](https://www.pythonanywhere.com)**

2. **Upload your code**

   **Option A: Using Git (Recommended)**
   ```bash
   git clone https://github.com/yourusername/codility-tracker.git
   cd codility-tracker
   ```

   **Option B: Upload files**
   - Use the Files tab to upload your project

3. **Create virtual environment**
   ```bash
   mkvirtualenv --python=/usr/bin/python3.10 codility-env
   cd ~/codility-tracker
   pip install -r requirements.txt
   ```

4. **Create Web App**
   - Go to "Web" tab
   - Click "Add a new web app"
   - Choose "Manual configuration"
   - Select Python 3.10

5. **Configure WSGI file**
   - Click on WSGI configuration file link
   - Replace contents with:
   ```python
   import sys
   import os

   # Add your project directory to the sys.path
   project_home = '/home/yourusername/codility-tracker'
   if project_home not in sys.path:
       sys.path.insert(0, project_home)

   # Set environment variables
   os.environ['DATABASE_URL'] = 'sqlite:///codility_progress.db'
   os.environ['SECRET_KEY'] = 'your-secret-key-here'
   os.environ['FLASK_ENV'] = 'production'

   # Import Flask app
   from app import app as application
   ```

6. **Set up Virtual Environment**
   - In Web tab, set virtualenv path to: `/home/yourusername/.virtualenvs/codility-env`

7. **Reload the web app**
   - Click "Reload" button

8. **Access your app**
   - Your app will be at: `yourusername.pythonanywhere.com`

### Note on Database
- Free tier uses **SQLite** (works fine for this app)
- For PostgreSQL, upgrade to paid tier ($5/month)
- **No credit card required for free tier**

---

## Fly.io

**Free tier with PostgreSQL - Developer-friendly**

Fly.io offers a generous free tier with PostgreSQL support.

### Prerequisites
- Fly.io account
- Fly CLI installed

### Steps

1. **Install Fly CLI**
   ```bash
   # Mac
   brew install flyctl

   # Linux
   curl -L https://fly.io/install.sh | sh

   # Windows
   powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
   ```

2. **Login to Fly**
   ```bash
   fly auth login
   ```

3. **Launch your app**
   ```bash
   fly launch
   ```
   - Choose app name
   - Select region closest to you
   - Say "Yes" to PostgreSQL database
   - Say "No" to Redis

4. **Set environment variables**
   ```bash
   fly secrets set SECRET_KEY=$(python -c 'import secrets; print(secrets.token_hex(32))')
   fly secrets set FLASK_ENV=production
   ```

5. **Deploy**
   ```bash
   fly deploy
   ```

### Free Tier Limits
- 3 VMs with 256MB RAM each
- 3GB persistent storage
- 160GB outbound data transfer
- **No credit card required**

---

## Railway

**IMPORTANT: Railway is NO LONGER FREE**

Railway removed their free tier in 2023. Current pricing:

### Pricing (2025)
- **Trial**: $5 one-time credit (expires in 30 days)
- **After trial**: Services shut down unless you upgrade
- **Hobby plan**: $5/month minimum (includes $5 usage credit)

### Steps (If you choose to pay)

1. **Sign up at [railway.app](https://railway.app)**

2. **Add payment method** (required after trial)

3. **Create a new project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

4. **Add PostgreSQL database**
   - Click "New" → "Database" → "PostgreSQL"
   - Railway automatically sets DATABASE_URL

5. **Set environment variables**
   - Go to your web service
   - Click "Variables" tab
   - Add:
     - `SECRET_KEY`: Generate with `python -c 'import secrets; print(secrets.token_hex(32))'`
     - `FLASK_ENV`: `production`

6. **Deploy**
   - Railway automatically deploys
   - Auto-redeploys on GitHub push

---

## Heroku

**IMPORTANT: Heroku is NO LONGER FREE**

Heroku eliminated all free tiers in November 2022.

### Current Pricing
- **Eco dynos**: $5/month (sleeps after inactivity)
- **Basic dynos**: $7/month (doesn't sleep)
- **Postgres**: $5/month minimum

### Heroku Deployment Steps

1. **Install Heroku CLI and login**
   ```bash
   heroku login
   ```

2. **Create a new Heroku app**
   ```bash
   heroku create codility-tracker-yourname
   ```

3. **Add PostgreSQL database**
   ```bash
   heroku addons:create heroku-postgresql:essential-0  # $5/month
   ```

4. **Set environment variables**
   ```bash
   heroku config:set SECRET_KEY=$(python -c 'import secrets; print(secrets.token_hex(32))')
   heroku config:set FLASK_ENV=production
   ```

5. **Deploy to Heroku**
   ```bash
   git push heroku main
   ```

6. **Open your app**
   ```bash
   heroku open
   ```

---

## General Tips

### Database Migrations
When you update your models, remember to:
```python
from app import app, db
with app.app_context():
    db.create_all()
```

### Security Best Practices
1. **Never commit secrets**: Use environment variables
2. **Generate strong SECRET_KEY**:
   ```python
   python -c 'import secrets; print(secrets.token_hex(32))'
   ```
3. **Use HTTPS**: Most platforms provide this automatically
4. **Set FLASK_ENV=production**: Disables debug mode

### Environment Variables Checklist
- `DATABASE_URL`: Database connection string
- `SECRET_KEY`: Random secret for sessions
- `FLASK_ENV`: Set to 'production'

### Monitoring Your App
- Check application logs regularly
- Monitor database size (free tiers have limits)
- Set up uptime monitoring (UptimeRobot, etc.)

### Cost Comparison (2025)

| Platform | Free Tier | Database Persistence | Notes |
|----------|-----------|---------------------|-------|
| **PythonAnywhere** | ✅ Yes | ✅ SQLite forever | **BEST FREE OPTION** - No expiration |
| **Render** | ✅ Yes | ⚠️ SQLite (with disk) OR PostgreSQL (30 days) | App sleeps after 15min, PostgreSQL expires! |
| **Fly.io** | ✅ Yes | ✅ PostgreSQL forever | Requires credit card verification |
| **Railway** | ❌ Trial only | ✅ Paid | $5/month after $5 trial credit expires |
| **Heroku** | ❌ No | ❌ Paid | Minimum $5/month for dynos + $5 for DB |

### Database Backups
- Heroku: `heroku pg:backups:capture`
- Export SQLite: Copy the `.db` file
- Railway/Render: Use their dashboard tools

### Custom Domains
All platforms support custom domains:
- Usually requires DNS CNAME record
- Some platforms require paid tier for custom domains

---

## Need Help?

If you encounter issues:
1. Check platform-specific logs
2. Verify all environment variables are set
3. Ensure database is properly connected
4. Check Python version compatibility
5. Review application logs for errors

## Platform Comparison (Updated 2025)

| Feature | PythonAnywhere | Render | Fly.io | Railway | Heroku |
|---------|----------------|--------|--------|---------|--------|
| **Truly Free Forever** | ✅ Yes | ⚠️ Web only | ✅ Yes | ❌ Trial only | ❌ No |
| **Database Persistence** | ✅ SQLite forever | ⚠️ PostgreSQL 30 days only | ✅ PostgreSQL forever | ✅ Paid | ✅ Paid |
| **Auto-deploy from GitHub** | ❌ Manual | ✅ Yes | ⚠️ CLI | ✅ Yes | ✅ Yes |
| **Cold Start Time** | Instant | ~30 sec | ~5 sec | Instant | Instant |
| **Credit Card Required** | ❌ No | ❌ No | ✅ Yes | ✅ After trial | ✅ Yes |
| **Ease of Use** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Best For** | Long-term free hosting | Short-term projects | Developers | Paid projects | Enterprise |

### Recommendations

**🏆 Best Overall Free Option: PythonAnywhere**
- No credit card required
- SQLite database persists forever (no expiration!)
- Perfect for 8-week training plan
- Free tier never expires
- Ideal for beginners

**🥈 Runner Up: Render (with SQLite + Persistent Disk)**
- Auto-deploys from GitHub
- Use SQLite with persistent disk (NOT PostgreSQL)
- PostgreSQL free tier expires after 30 days
- Good if you want GitHub auto-deploy

**🥉 Advanced Option: Fly.io**
- PostgreSQL that doesn't expire
- Requires credit card for verification
- CLI-based (for developers)
- Fast cold starts
