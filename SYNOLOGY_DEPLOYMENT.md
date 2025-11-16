# Deploy to Synology NAS - Complete Guide

This guide will help you deploy the Codility Training Tracker on your Synology NAS with PostgreSQL.

## Why Synology NAS?

**Advantages:**
- ✅ You own the hardware - no expiring databases!
- ✅ Runs 24/7 on your local network
- ✅ Full control over your data
- ✅ Free PostgreSQL (no 30-day expiration like Render)
- ✅ Access from any device on your network

**Requirements:**
- Synology NAS with DSM 7.0 or higher
- Docker package installed on NAS
- Basic familiarity with SSH/terminal

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Method 1: Docker Compose (Recommended)](#method-1-docker-compose-recommended)
3. [Method 2: Container Manager GUI](#method-2-container-manager-gui)
4. [Method 3: Python Package on NAS](#method-3-python-package-on-nas)
5. [Accessing Your App](#accessing-your-app)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### 1. Install Docker on Synology

1. Open **Package Center** on your Synology DSM
2. Search for "Container Manager" (formerly Docker)
3. Click **Install**
4. Wait for installation to complete

### 2. Enable SSH (Optional, for advanced setup)

1. Go to **Control Panel** → **Terminal & SNMP**
2. Check "Enable SSH service"
3. Port: 22 (default)
4. Click **Apply**

### 3. Create Shared Folder for App

1. Go to **Control Panel** → **Shared Folder**
2. Click **Create** → **Create shared folder**
3. Name: `codility-tracker`
4. Click **OK**

---

## Method 1: Docker Compose (Recommended)

This is the easiest and most professional approach.

### Step 1: Connect via SSH

```bash
# From your computer, connect to your NAS
ssh your-username@your-nas-ip
# Example: ssh admin@192.168.1.100
```

### Step 2: Create Project Directory

```bash
# Create directory for your app
sudo mkdir -p /volume1/docker/codility-tracker
cd /volume1/docker/codility-tracker

# Create necessary subdirectories
sudo mkdir -p postgres_data
```

### Step 3: Upload Your Code

**Option A: Using Git**
```bash
# If git is installed on your NAS
git clone https://github.com/yourusername/codility-tracker.git app
cd app
```

**Option B: Manual Upload**
- Use File Station to upload your project files to `/volume1/docker/codility-tracker/app/`
- Or use SFTP client (like FileZilla) to upload files

### Step 4: Create Dockerfile

Create `Dockerfile` in `/volume1/docker/codility-tracker/app/`:

```dockerfile
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 5000

# The CMD will be overridden by docker-compose
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]
```

### Step 5: Create Docker Compose File

Create `docker-compose.yml` in `/volume1/docker/codility-tracker/`:

```yaml
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    container_name: codility-postgres
    restart: always
    environment:
      POSTGRES_DB: codility_tracker
      POSTGRES_USER: codility_user
      POSTGRES_PASSWORD: change_this_secure_password_123
    volumes:
      - ./postgres_data:/var/lib/postgresql/data
    networks:
      - codility-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U codility_user"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Flask Web Application
  web:
    build:
      context: ./app
      dockerfile: Dockerfile
    container_name: codility-web
    restart: always
    working_dir: /app
    command: >
      sh -c "python -c 'from app import app, db; app.app_context().push(); db.create_all()' &&
             gunicorn --bind 0.0.0.0:5000 --workers 2 app:app"
    environment:
      DATABASE_URL: postgresql://codility_user:change_this_secure_password_123@postgres:5432/codility_tracker
      SECRET_KEY: generate_a_random_secret_key_here
      FLASK_ENV: production
    volumes:
      - ./app:/app
    ports:
      - "5000:5000"
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - codility-network

networks:
  codility-network:
    driver: bridge

volumes:
  postgres_data:
```

### Step 6: Generate Secret Key

```bash
# Generate a secure secret key
python3 -c 'import secrets; print(secrets.token_hex(32))'
# Copy the output and replace "generate_a_random_secret_key_here" in docker-compose.yml
```

### Step 7: Build and Start the Application

```bash
cd /volume1/docker/codility-tracker

# Build the containers (first time or after code changes)
sudo docker-compose build

# Start the application
sudo docker-compose up -d
```

### Step 8: Check Status

```bash
# Check if containers are running
sudo docker-compose ps

# View logs
sudo docker-compose logs -f web
sudo docker-compose logs -f postgres

# If you see "ModuleNotFoundError: No module named 'psycopg2'",
# the build didn't complete. Check build logs:
sudo docker-compose logs web
```

### Step 9: Access Your App

Open browser and go to: `http://your-nas-ip:5000`
Example: `http://192.168.1.100:5000`

---

## Method 2: Container Manager GUI

Use Synology's graphical interface (easier for beginners).

### Step 1: Create PostgreSQL Container

1. Open **Container Manager** app
2. Go to **Registry** tab
3. Search for "postgres"
4. Download `postgres:15-alpine`
5. After download, go to **Image** tab
6. Select postgres image → **Launch**
7. Configure:
   - Container name: `codility-postgres`
   - Click **Advanced Settings**
   - **Volume** tab → Add folder:
     - File/Folder: Create folder `/docker/codility-tracker/postgres_data`
     - Mount path: `/var/lib/postgresql/data`
   - **Environment** tab → Add variables:
     - `POSTGRES_DB` = `codility_tracker`
     - `POSTGRES_USER` = `codility_user`
     - `POSTGRES_PASSWORD` = `your_secure_password`
   - **Network** tab → Check "Use the same network as Docker Host"
   - Click **Apply**

### Step 2: Create Python Web Container

1. In **Registry**, search for "python"
2. Download `python:3.11-slim`
3. Go to **Image** tab
4. Select python image → **Launch**
5. Configure:
   - Container name: `codility-web`
   - Click **Advanced Settings**
   - **Volume** tab → Add folder:
     - File/Folder: `/docker/codility-tracker/app` (upload your code here first)
     - Mount path: `/app`
   - **Port Settings** tab:
     - Local Port: `5000`
     - Container Port: `5000`
     - Type: TCP
   - **Environment** tab → Add variables:
     - `DATABASE_URL` = `postgresql://codility_user:your_secure_password@172.17.0.1:5432/codility_tracker`
     - `SECRET_KEY` = (generate using Python command above)
     - `FLASK_ENV` = `production`
   - **Execution Command** tab:
     - Command: `/bin/sh`
     - Entrypoint: `-c "cd /app && pip install -r requirements.txt && python -c 'from app import app, db; app.app_context().push(); db.create_all()' && gunicorn --bind 0.0.0.0:5000 app:app"`
   - Click **Apply**

### Step 3: Start Containers

1. Go to **Container** tab
2. Start `codility-postgres` first
3. Wait 10 seconds
4. Start `codility-web`

---

## Method 3: Python Package on NAS

Install Python directly on your NAS (without Docker).

### Step 1: Install Python

1. Open **Package Center**
2. Search for "Python 3.11" or latest version
3. Click **Install**

### Step 2: Install PostgreSQL

1. In Package Center, search for "PostgreSQL"
2. Install "PostgreSQL 14" or latest
3. After installation, open PostgreSQL
4. Create database:
   - Database name: `codility_tracker`
   - User: `codility_user`
   - Password: Set a secure password

### Step 3: Upload Your Application

1. Use File Station to upload your project to `/volume1/web/codility-tracker/`
2. Or use SSH/SFTP

### Step 4: Install Dependencies via SSH

```bash
# SSH into your NAS
ssh your-username@your-nas-ip

# Navigate to your app
cd /volume1/web/codility-tracker

# Install dependencies
python3 -m pip install -r requirements.txt

# Create database tables
python3 -c 'from app import app, db; app.app_context().push(); db.create_all()'
```

### Step 5: Create Environment Variables

Create `.env` file in your app directory:

```bash
DATABASE_URL=postgresql://codility_user:your_password@localhost:5432/codility_tracker
SECRET_KEY=your_generated_secret_key
FLASK_ENV=production
```

### Step 6: Create Startup Script

Create `/volume1/web/codility-tracker/start.sh`:

```bash
#!/bin/bash
cd /volume1/web/codility-tracker
source .env
gunicorn --bind 0.0.0.0:5000 --workers 2 app:app
```

Make it executable:
```bash
chmod +x start.sh
```

### Step 7: Create Task in Task Scheduler

1. Go to **Control Panel** → **Task Scheduler**
2. Click **Create** → **Triggered Task** → **User-defined script**
3. General tab:
   - Task name: `Start Codility Tracker`
   - User: root
   - Event: Boot-up
4. Task Settings tab:
   - User-defined script: `/volume1/web/codility-tracker/start.sh`
5. Click **OK**

---

## Accessing Your App

### Local Network Access

```
http://your-nas-ip:5000
Example: http://192.168.1.100:5000
```

### Access from Outside Your Home (Optional)

**Option 1: Synology QuickConnect**
1. Enable QuickConnect in **Control Panel** → **QuickConnect**
2. Set up port forwarding for port 5000
3. Access via: `http://your-quickconnect-id.quickconnect.to:5000`

**Option 2: Reverse Proxy (Recommended)**
1. Install "Web Station" package
2. Go to **Control Panel** → **Login Portal** → **Advanced** → **Reverse Proxy**
3. Click **Create**
4. Configure:
   - Source:
     - Protocol: HTTP
     - Hostname: your-nas-domain.com
     - Port: 80
   - Destination:
     - Protocol: HTTP
     - Hostname: localhost
     - Port: 5000

**Option 3: Tailscale VPN (Most Secure)**
1. Install Tailscale on NAS and your devices
2. Access via Tailscale IP without exposing to internet

---

## Database Backup

### Automated PostgreSQL Backup

Create backup script `/volume1/docker/codility-tracker/backup.sh`:

```bash
#!/bin/bash
BACKUP_DIR="/volume1/docker/codility-tracker/backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Docker method
docker exec codility-postgres pg_dump -U codility_user codility_tracker > $BACKUP_DIR/backup_$DATE.sql

# Keep only last 30 backups
ls -t $BACKUP_DIR/backup_*.sql | tail -n +31 | xargs rm -f

echo "Backup completed: backup_$DATE.sql"
```

Make executable and schedule:
```bash
chmod +x backup.sh
```

Add to Task Scheduler to run daily at 2 AM.

---

## Troubleshooting

### Container won't start

```bash
# Check logs
sudo docker-compose logs -f web
sudo docker-compose logs -f postgres

# Restart containers
sudo docker-compose restart
```

### Can't connect to database

```bash
# Check if PostgreSQL is running
sudo docker exec codility-postgres pg_isready -U codility_user

# Test connection manually
sudo docker exec -it codility-postgres psql -U codility_user -d codility_tracker
```

### Port 5000 already in use

Change port in docker-compose.yml:
```yaml
ports:
  - "8080:5000"  # Use port 8080 instead
```

### Permission errors

```bash
# Fix ownership
sudo chown -R $(whoami):users /volume1/docker/codility-tracker
```

### Web container crashes on startup

```bash
# Check if requirements.txt is present
ls -la /volume1/docker/codility-tracker/app/requirements.txt

# Manually install dependencies
sudo docker exec -it codility-web bash
pip install -r /app/requirements.txt
exit
```

### ModuleNotFoundError: No module named 'psycopg2'

This is the most common error! It occurs when the Docker container doesn't have PostgreSQL dependencies installed.

**Root Cause:**
The base python image doesn't include build tools needed for psycopg2.

**SOLUTION: Rebuild using the Dockerfile**

```bash
cd /volume1/docker/codility-tracker

# Stop and remove containers
sudo docker-compose down

# Rebuild with proper Dockerfile (includes psycopg2)
sudo docker-compose build --no-cache

# Start containers
sudo docker-compose up -d

# Verify psycopg2 is installed
sudo docker exec codility-web python -c "import psycopg2; print('✓ psycopg2 installed successfully!')"
```

**What the Dockerfile does:**
- Installs system dependencies (gcc, libpq-dev, postgresql-client)
- Installs all Python packages from requirements.txt
- Creates a properly built image with everything pre-installed

**Make sure you have these files:**
1. `Dockerfile` in `/volume1/docker/codility-tracker/app/`
2. `docker-compose.yml` updated to use `build` instead of `image`

**Alternative: Use SQLite (no PostgreSQL needed)**
If you want to avoid PostgreSQL complexity:
```yaml
# In docker-compose.yml, change environment:
environment:
  DATABASE_URL: sqlite:///codility_progress.db
```

Then you don't need psycopg2 at all!

---

## Updating Your Application

### Docker Compose Method

```bash
cd /volume1/docker/codility-tracker

# Pull latest code
cd app
git pull  # or re-upload files manually

# Restart containers
cd ..
sudo docker-compose restart web
```

### View Logs

```bash
# Real-time logs
sudo docker-compose logs -f web

# Last 100 lines
sudo docker-compose logs --tail=100 web
```

---

## Performance Optimization

### 1. Increase Workers

Edit docker-compose.yml:
```yaml
command: gunicorn --bind 0.0.0.0:5000 --workers 4 app:app
```

### 2. Add PostgreSQL Tuning

Create `postgresql.conf` and mount it:
```yaml
volumes:
  - ./postgres_data:/var/lib/postgresql/data
  - ./postgresql.conf:/etc/postgresql/postgresql.conf
```

### 3. Monitor Resources

In Container Manager:
- Check CPU and memory usage
- Adjust container resource limits if needed

---

## Security Best Practices

1. **Change default passwords** in docker-compose.yml
2. **Use strong SECRET_KEY** (32+ random characters)
3. **Don't expose to internet** unless using HTTPS
4. **Regular backups** (automated daily)
5. **Update Docker images** periodically
6. **Use firewall** to restrict port 5000 access

---

## Comparison: Synology vs Cloud Hosting

| Feature | Synology NAS | PythonAnywhere | Render |
|---------|--------------|----------------|--------|
| **Cost** | ✅ Free (you own NAS) | ✅ Free | ✅ Free |
| **Database Expiration** | ✅ Never | ✅ Never | ❌ 30 days |
| **Always On** | ✅ Yes (24/7) | ✅ Yes | ⚠️ Sleeps after 15min |
| **Your Data** | ✅ Full control | ❌ On their servers | ❌ On their servers |
| **Setup Difficulty** | ⭐⭐⭐ Medium | ⭐⭐⭐⭐ Easy | ⭐⭐⭐⭐⭐ Very Easy |
| **Internet Access** | ⚠️ Requires setup | ✅ Automatic | ✅ Automatic |
| **Performance** | ✅ Your NAS speed | ⭐⭐⭐ | ⭐⭐⭐⭐ |

---

## Next Steps

1. Choose your deployment method (Docker Compose recommended)
2. Follow the step-by-step instructions
3. Set up automated backups
4. (Optional) Configure remote access
5. Start your 8-week Codility training!

---

## Need Help?

- Synology Community Forum: https://community.synology.com
- Docker Documentation: https://docs.docker.com
- Flask + PostgreSQL: See main DEPLOYMENT.md

---

**Congratulations!** You now have a self-hosted Codility Training Tracker with:
- ✅ PostgreSQL that never expires
- ✅ Full data control
- ✅ 24/7 availability
- ✅ No monthly costs

Last Updated: January 2025
