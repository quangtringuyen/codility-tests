# Deployment Guide

This guide provides detailed instructions for deploying the Codility Training Tracker to various hosting platforms.

## 🏠 Synology NAS Deployment - **RECOMMENDED FOR LOCAL HOSTING**

**For complete control and privacy, deploy on your Synology NAS using Docker.** Perfect for local network access with no expiration or data limits.

## Table of Contents
1. [Synology NAS with Docker](#synology-nas-with-docker) - **RECOMMENDED FOR LOCAL** - Full control, no limits
2. [PythonAnywhere](#pythonanywhere) - **RECOMMENDED FOR CLOUD** - Truly free forever with SQLite
3. [Render](#render) - Free web hosting (PostgreSQL expires in 30 days, use SQLite)
4. [Fly.io](#flyio) - Free tier available (requires credit card)
5. [Railway](#railway) - **PAID** ($5/month minimum after trial)
6. [Heroku](#heroku) - **PAID** (No free tier as of Nov 2022)
7. [General Tips](#general-tips)

---

## Synology NAS with Docker

**Complete local hosting with Docker - Full control and privacy**

Deploy the Codility Training Tracker on your Synology NAS with Docker Compose for a robust, persistent, and private development environment.

### 🎉 What's New in This Version

This deployment includes all the latest features:

#### ✨ **Interactive Features**
- **Dark Mode Toggle** - Theme switcher with localStorage persistence
- **Reading Progress Bar** - Visual scroll indicator at the top of lessons
- **Copy Code Buttons** - One-click copying from code blocks in lessons
- **Previous/Next Navigation** - Seamless navigation between lessons
- **Lesson Completion Tracking** - Mark lessons as complete with progress saved

#### 💻 **TypeScript Playground**
- **Standalone Playground** - Full-page TypeScript editor (`/playground`)
- **Sidebar Playground** - Toggleable code editor beside lessons
- **Monaco Editor** - VS Code's editor with IntelliSense and syntax highlighting
- **8 Code Templates** - Pre-built patterns (arrays, stacks, hashmaps, etc.)
- **Live Execution** - Run TypeScript code directly in the browser
- **Keyboard Shortcuts** - Ctrl/Cmd + E to toggle sidebar playground

#### 📚 **Comprehensive Content**
- **10 Lesson Files** - 8 weeks + overview + cheat sheet
- **120KB of Content** - Detailed explanations, examples, challenges, and solutions
- **Markdown Rendering** - Beautiful lesson display with syntax highlighting

#### ✏️ **Edit & Authentication (NEW!)**
- **Secure Login System** - Password-protected access for editing
- **Admin-Only Editing** - Edit lessons directly from web interface
- **Flash Messages** - Visual feedback for all actions
- **Session Management** - Persistent login with "remember me"
- **Default Admin Account** - Quick setup with `admin` / `admin123`

### Prerequisites

1. **Synology NAS** with DSM 7.0 or later
2. **Docker package** installed from Package Center
3. **SSH access** enabled (Control Panel → Terminal & SNMP → Enable SSH)
4. **File Station** access or SCP/SFTP client

### Step 1: Upload Files to NAS

Choose one of the following methods to upload your project:

#### **Option A: Using File Station (Easiest)**

1. Open **File Station** on your NAS
2. Navigate to `/docker/` (or create it if it doesn't exist)
3. Create a new folder: `codility-tracker`
4. Upload all project files:
   - `app.py`
   - `requirements.txt`
   - `Dockerfile`
   - `docker-compose.yml`
   - `.env` (create from `.env.example`)
   - `templates/` folder
   - `static/` folder
   - `lessons/` folder

#### **Option B: Using SCP (Command Line)**

From your local machine:
```bash
# Replace YOUR_NAS_IP with your NAS IP address
scp -r /path/to/codility-tests/ admin@YOUR_NAS_IP:/volume1/docker/codility-tracker/
```

#### **Option C: Using rsync (Advanced)**

```bash
# More efficient for updates
rsync -avz --progress /path/to/codility-tests/ admin@YOUR_NAS_IP:/volume1/docker/codility-tracker/
```

### Step 2: Configure Environment Variables

1. **Create `.env` file** from `.env.example`:

SSH into your NAS:
```bash
ssh admin@YOUR_NAS_IP
cd /volume1/docker/codility-tracker
cp .env.example .env
nano .env  # or use vi
```

2. **Edit `.env` with your credentials**:

```env
# PostgreSQL Database Configuration
POSTGRES_USER=admin
POSTGRES_PASSWORD=YourSecurePassword123
POSTGRES_DB=codility_tracker

# Flask Configuration
SECRET_KEY=your-generated-secret-key-here
FLASK_ENV=production

# Database Connection (encode @ as %40 in password)
DATABASE_URL=postgresql://admin:YourSecurePassword123@postgres:5432/codility_tracker
```

3. **Generate a secure SECRET_KEY**:

```bash
python3 -c 'import secrets; print(secrets.token_hex(32))'
```

Copy the output and paste it as your `SECRET_KEY` in `.env`.

### Step 3: Verify File Structure

Ensure your directory structure looks like this:

```
/volume1/docker/codility-tracker/
├── app.py
├── requirements.txt
├── Dockerfile
├── docker-compose.yml
├── .env
├── .env.example
├── SYNOLOGY_DEPLOYMENT.md
├── PLAYGROUND_GUIDE.md
├── templates/
│   ├── base.html
│   ├── index.html
│   ├── lessons_index.html
│   ├── lesson_view.html
│   └── playground.html
├── static/
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── app.js
│       ├── playground.js
│       └── lesson-playground.js
└── lessons/
    ├── README.md
    ├── CHEAT_SHEET.md
    ├── week1-foundations.md
    ├── week2-prefix-sums.md
    ├── week3-sorting.md
    ├── week4-stacks-queues.md
    ├── week5-leader-max-slice.md
    ├── week6-prime-numbers.md
    ├── week7-dynamic-programming.md
    └── week8-final-mocks.md
```

### Step 4: Deploy with Docker Compose

1. **SSH into your NAS**:
```bash
ssh admin@YOUR_NAS_IP
```

2. **Navigate to project directory**:
```bash
cd /volume1/docker/codility-tracker
```

3. **Build and start containers**:
```bash
sudo docker-compose up -d --build
```

This will:
- Build the Flask application Docker image
- Pull PostgreSQL 15-alpine image
- Create and start both containers
- Set up networking between containers
- Create persistent volumes for database data

### Step 5: Verify Deployment

1. **Check container status**:
```bash
sudo docker-compose ps
```

You should see:
```
NAME                           STATUS
codility-tracker-postgres-1    Up (healthy)
codility-tracker-web-1         Up
```

2. **View logs**:
```bash
# All logs
sudo docker-compose logs

# Just web app logs
sudo docker-compose logs web

# Follow logs in real-time
sudo docker-compose logs -f
```

3. **Access the application**:

Open your browser and navigate to:
- **From local network**: `http://YOUR_NAS_IP:8089`
- **From NAS**: `http://localhost:8089`

### Step 6: Test New Features

#### **1. Dashboard**
- Navigate to `http://YOUR_NAS_IP:8089/`
- Should see the main dashboard with 8 weeks

#### **2. Lessons**
- Click "Lessons" in navigation
- You should see all 10 lesson files
- Click on any lesson to view
- Test features:
  - ✅ Dark mode toggle (top-right)
  - ✅ Reading progress bar (top)
  - ✅ Copy code buttons (in code blocks)
  - ✅ Previous/Next navigation (bottom)
  - ✅ Mark lesson as complete (checkbox)

#### **3. Standalone Playground**
- Click "Playground" in navigation
- Monaco Editor should load (VS Code-like editor)
- Try loading a template from dropdown
- Write some TypeScript code:
  ```typescript
  function solution(A: number[]): number {
      console.log("Input:", A);
      return A.length;
  }

  console.log(solution([1, 2, 3, 4, 5]));
  ```
- Click "▶ Run Code" or press Ctrl/Cmd + S
- Output should appear in right panel

#### **4. Sidebar Playground (NEW!)**
- Go to any lesson
- Click the floating **💻 Code** button (bottom-right)
- Sidebar should slide in from right
- Test features:
  - ✅ Monaco Editor loads
  - ✅ Template selector works
  - ✅ Run button executes code
  - ✅ Code persists when you navigate away
  - ✅ Keyboard shortcut: Ctrl/Cmd + E toggles sidebar
  - ✅ Close button works
  - ✅ Responsive on mobile (full-screen overlay)

#### **5. Authentication & Editing (NEW!)**

**Setup Admin Account:**
```bash
# SSH into your NAS
ssh admin@YOUR_NAS_IP
cd /volume1/docker/codility-tracker

# Create admin user
sudo docker-compose exec web python create_admin.py
```

This creates the default admin account:
- Username: `admin`
- Password: `admin123`
- ⚠️ **IMPORTANT**: Change this password after first login!

**Test Authentication:**
1. Navigate to `http://YOUR_NAS_IP:8089/login`
2. Login with credentials:
   - Username: `admin`
   - Password: `admin123`
3. You should see:
   - ✅ "Logged in successfully!" flash message
   - ✅ Username displayed in navigation bar
   - ✅ "Logout" link appears

**Test Editing:**
1. While logged in, go to any lesson
2. You should see:
   - ✅ **✏️ Edit** button appears (bottom-right, next to Code button)
3. Click the Edit button:
   - ✅ Lesson content changes to editor mode
   - ✅ Toolbar with Save/Cancel buttons appears
4. Make a small change
5. Click "💾 Save" or press Ctrl/Cmd + S:
   - ✅ "Saving..." status appears
   - ✅ "✓ Saved successfully!" message appears
   - ✅ Page reloads with updated content

**Test Logout:**
1. Click "Logout" in navigation
2. You should see:
   - ✅ "Logged out successfully!" flash message
   - ✅ Edit button no longer visible on lessons
   - ✅ "Login" link appears in navigation

**Security Test:**
1. Log out if logged in
2. Try to access edit functionality without login:
   - Edit button should not appear
   - Direct API calls should return 403 Forbidden
3. This confirms edit protection is working ✅

### Common Issues and Troubleshooting

#### **Issue 1: Port 5433 Already in Use**

If you have PostgreSQL running locally on your NAS:

```bash
# Check what's using port 5433
sudo netstat -tulpn | grep 5433

# Option 1: Change port in docker-compose.yml
ports:
  - "5434:5432"  # Use 5434 instead

# Option 2: Stop local PostgreSQL
sudo systemctl stop postgresql
```

#### **Issue 2: Permission Denied**

```bash
# Make sure you're using sudo for docker commands
sudo docker-compose up -d --build

# Or add your user to docker group
sudo synogroup --add docker admin
# Log out and back in
```

#### **Issue 3: Monaco Editor Not Loading**

If the playground shows a blank editor:

1. **Check browser console** (F12 → Console)
2. **Common causes**:
   - CDN blocked (check firewall)
   - JavaScript errors (check console)
   - Browser compatibility (use Chrome/Edge/Firefox)

3. **Verify CDN access**:
   - The app loads Monaco from: `https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/`
   - Ensure your NAS can access the internet

#### **Issue 4: Database Connection Failed**

```bash
# Check PostgreSQL container is healthy
sudo docker-compose ps

# If postgres is not healthy, check logs
sudo docker-compose logs postgres

# Common fix: Ensure DATABASE_URL uses correct password encoding
# If password has @ symbol, encode it as %40
```

#### **Issue 5: Containers Won't Start**

```bash
# Stop all containers
sudo docker-compose down

# Remove volumes (⚠️ This deletes database data!)
sudo docker-compose down -v

# Rebuild from scratch
sudo docker-compose up -d --build

# Check logs for specific errors
sudo docker-compose logs -f
```

#### **Issue 6: Code Changes Not Reflecting**

```bash
# Rebuild the web container
sudo docker-compose up -d --build web

# Or rebuild everything
sudo docker-compose down
sudo docker-compose up -d --build
```

### Managing Your Deployment

#### **Start Containers**
```bash
sudo docker-compose start
```

#### **Stop Containers**
```bash
sudo docker-compose stop
```

#### **Restart Containers**
```bash
sudo docker-compose restart
```

#### **Update Code**
```bash
# Upload new files via File Station or SCP
# Then rebuild:
sudo docker-compose up -d --build
```

#### **View Logs**
```bash
# All services
sudo docker-compose logs -f

# Specific service
sudo docker-compose logs -f web
sudo docker-compose logs -f postgres
```

#### **Access Database**
```bash
# Connect to PostgreSQL container
sudo docker-compose exec postgres psql -U admin -d codility_tracker

# Run SQL commands
SELECT * FROM tasks;
\q  # quit
```

#### **Backup Database**
```bash
# Backup to SQL file
sudo docker-compose exec postgres pg_dump -U admin codility_tracker > backup.sql

# Restore from backup
sudo docker-compose exec -T postgres psql -U admin codility_tracker < backup.sql
```

### Security Considerations

1. **Change Default Credentials**
   - Update `POSTGRES_PASSWORD` in `.env`
   - Generate new `SECRET_KEY`

2. **Firewall Rules**
   - Port 8089 is exposed for web access
   - Port 5433 is only accessible to Docker network (not externally exposed)

3. **HTTPS (Optional)**
   - Use Synology's reverse proxy for HTTPS
   - Control Panel → Application Portal → Reverse Proxy
   - Add rule: `https://yournas.local` → `http://localhost:8089`

4. **Network Access**
   - By default, accessible only on local network
   - For internet access, configure port forwarding (not recommended for dev environments)

### Auto-Start on NAS Reboot

Docker containers will automatically restart unless stopped manually. This is configured in `docker-compose.yml`:

```yaml
restart: unless-stopped
```

To verify:
```bash
sudo docker-compose ps
# Should show containers running after NAS reboot
```

### Monitoring

#### **Check Container Health**
```bash
sudo docker-compose ps
```

#### **Monitor Resource Usage**
```bash
sudo docker stats
```

#### **View Container Details**
```bash
sudo docker inspect codility-tracker-web-1
```

### Updating to Latest Version

#### **Option 1: Manual Update**

1. **Pull latest code**:
```bash
cd /volume1/docker/codility-tracker
# If using Git:
git pull

# If manual upload:
# Upload new files via File Station/SCP
```

2. **Rebuild and restart**:
```bash
sudo docker-compose down
sudo docker-compose up -d --build
```

3. **Verify**:
```bash
sudo docker-compose logs -f web
```

#### **Option 2: Auto-Deployment (Recommended)** 🚀

Set up automatic deployment so pulling code updates automatically rebuilds and restarts your app!

**Quick Setup:**
```bash
cd /volume1/docker/codility-tracker

# One-time setup
./setup-auto-deploy.sh

# Test it
git pull origin main
# 🎉 App automatically rebuilds and restarts!
```

**What It Does:**
- Installs Git post-merge hook
- Detects code changes on `git pull`
- Automatically runs deployment script
- Rebuilds Docker containers
- Restarts application
- No manual intervention needed!

**For complete auto-deployment guide, see:** [AUTO_DEPLOY.md](AUTO_DEPLOY.md)

**Features:**
- ✅ Automatic on `git pull`
- ✅ Smart file detection (only deploys when needed)
- ✅ Supports Docker and local deployments
- ✅ Error handling and logging
- ✅ Branch protection (only main/master)

### Quick Command Reference

```bash
# Start everything
sudo docker-compose up -d --build

# Stop everything
sudo docker-compose down

# View logs
sudo docker-compose logs -f

# Restart after code changes
sudo docker-compose restart web

# Full rebuild
sudo docker-compose down && sudo docker-compose up -d --build

# Database backup
sudo docker-compose exec postgres pg_dump -U admin codility_tracker > backup.sql

# Access PostgreSQL
sudo docker-compose exec postgres psql -U admin -d codility_tracker
```

### Accessing from Mobile/Other Devices

Once deployed on your NAS, you can access the tracker from any device on your local network:

1. **Find your NAS IP** (e.g., `192.168.1.100`)
2. **Open browser** on phone/tablet/laptop
3. **Navigate to**: `http://192.168.1.100:8089`
4. **Enjoy all features**:
   - Responsive design works on all screen sizes
   - Sidebar playground becomes full-screen on mobile
   - Dark mode syncs via localStorage
   - Lesson progress tracked per device

---

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
