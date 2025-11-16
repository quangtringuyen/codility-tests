# Deployment Guide

This guide provides detailed instructions for deploying the Codility Training Tracker to various hosting platforms.

## Table of Contents
1. [Heroku](#heroku)
2. [Railway](#railway)
3. [Render](#render)
4. [PythonAnywhere](#pythonanywhere)
5. [General Tips](#general-tips)

---

## Heroku

Heroku is a popular platform-as-a-service (PaaS) that makes deployment simple.

### Prerequisites
- Heroku account (free tier available)
- Heroku CLI installed
- Git installed

### Steps

1. **Login to Heroku**
   ```bash
   heroku login
   ```

2. **Create a new Heroku app**
   ```bash
   heroku create codility-tracker-yourname
   ```

3. **Add PostgreSQL database**
   ```bash
   heroku addons:create heroku-postgresql:hobby-dev
   ```

4. **Set environment variables**
   ```bash
   heroku config:set SECRET_KEY=$(python -c 'import secrets; print(secrets.token_hex(32))')
   heroku config:set FLASK_ENV=production
   ```

5. **Initialize Git (if not already done)**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

6. **Deploy to Heroku**
   ```bash
   git push heroku main
   ```
   (If your branch is named 'master', use `git push heroku master`)

7. **Open your app**
   ```bash
   heroku open
   ```

### Troubleshooting Heroku
- View logs: `heroku logs --tail`
- Check app status: `heroku ps`
- Restart app: `heroku restart`

---

## Railway

Railway offers modern deployment with automatic GitHub integration.

### Prerequisites
- Railway account
- GitHub account
- Code pushed to GitHub repository

### Steps

1. **Sign up at [railway.app](https://railway.app)**

2. **Create a new project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Add PostgreSQL database**
   - In your project dashboard
   - Click "New" → "Database" → "PostgreSQL"
   - Railway automatically sets DATABASE_URL

4. **Set environment variables**
   - Go to your web service
   - Click "Variables" tab
   - Add:
     - `SECRET_KEY`: Generate with `python -c 'import secrets; print(secrets.token_hex(32))'`
     - `FLASK_ENV`: `production`

5. **Deploy**
   - Railway automatically deploys on push to main branch
   - Click on the generated URL to view your app

### Automatic Deployments
Railway automatically redeploys when you push to GitHub.

---

## Render

Render provides free hosting with PostgreSQL databases.

### Prerequisites
- Render account
- GitHub account
- Code pushed to GitHub repository

### Steps

1. **Sign up at [render.com](https://render.com)**

2. **Create a Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Give it a name

3. **Configure Build Settings**
   - **Environment**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`

4. **Create PostgreSQL Database**
   - Click "New +" → "PostgreSQL"
   - Choose free tier
   - Note the Internal Database URL

5. **Set Environment Variables**
   In your Web Service settings, add:
   - `DATABASE_URL`: (copy from PostgreSQL internal URL)
   - `SECRET_KEY`: Generate with `python -c 'import secrets; print(secrets.token_hex(32))'`
   - `FLASK_ENV`: `production`

6. **Deploy**
   - Click "Create Web Service"
   - Render automatically builds and deploys
   - Access via the provided URL

### Automatic Deployments
Render auto-deploys on commits to main branch.

---

## PythonAnywhere

PythonAnywhere is ideal for Python web apps with free tier available.

### Prerequisites
- PythonAnywhere account

### Steps

1. **Sign up at [pythonanywhere.com](https://www.pythonanywhere.com)**

2. **Upload your code**

   **Option A: Using Git**
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
PythonAnywhere free tier uses SQLite. For PostgreSQL, upgrade to paid tier.

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

### Cost Optimization
All platforms mentioned offer free tiers suitable for this app:
- **Heroku**: 550-1000 free dyno hours/month
- **Railway**: $5 free credit/month
- **Render**: Free tier with limitations
- **PythonAnywhere**: Free tier with 512MB storage

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

## Platform Comparison

| Feature | Heroku | Railway | Render | PythonAnywhere |
|---------|--------|---------|--------|----------------|
| Free Tier | ✓ | ✓ | ✓ | ✓ |
| Auto-deploy from GitHub | ✓ | ✓ | ✓ | ✗ |
| Free PostgreSQL | ✓ | ✓ | ✓ | ✗ (paid only) |
| Custom Domain | ✓ (paid) | ✓ | ✓ | ✓ (paid) |
| Ease of Use | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |

**Recommendation**: For beginners, start with **Railway** or **Render** for easiest deployment.
