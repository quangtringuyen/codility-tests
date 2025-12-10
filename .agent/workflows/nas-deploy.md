---
description: Deploy application to Synology NAS using Docker Compose
---

# Deploy to Synology NAS - Quick Guide

This workflow walks you through deploying the Codility Training Tracker to your Synology NAS using Docker Compose (the recommended method).

## Prerequisites

Before starting, make sure you have:
- ✅ Synology NAS with DSM 7.0 or higher
- ✅ Container Manager (Docker) installed on your NAS
- ✅ SSH access enabled on your NAS
- ✅ Your NAS IP address (e.g., 192.168.1.100)

## Step-by-Step Deployment

### 1. Enable SSH on Your NAS (if not already enabled)

1. Log into your Synology DSM web interface
2. Go to **Control Panel** → **Terminal & SNMP**
3. Check "Enable SSH service"
4. Click **Apply**

### 2. Connect to Your NAS via SSH

From your local machine (Mac):
```bash
ssh your-username@your-nas-ip
```
Example: `ssh admin@192.168.1.100`

### 3. Create Project Directory on NAS

```bash
sudo mkdir -p /volume1/docker/codility-tracker
cd /volume1/docker/codility-tracker
```

### 4. Transfer Your Project Files to NAS

**Option A: Using Git (Recommended)**
```bash
# From NAS SSH session
# First, make sure you have the repository URL
# If you haven't pushed to GitHub yet, do that first from your Mac

# Clone the repository
cd /volume1/docker
git clone https://github.com/yourusername/codility-tests.git codility-tracker
cd codility-tracker
```

**Option B: Using SCP (One-time setup)**
```bash
# From your local machine (not from NAS SSH)
cd /Users/tringuyen/dev/code/codility-tests
scp -r . your-username@your-nas-ip:/volume1/docker/codility-tracker/

# Then initialize git on NAS for future updates
# SSH to NAS and run:
cd /volume1/docker/codility-tracker
git init
git remote add origin https://github.com/yourusername/codility-tests.git
```

**Option C: Using Synology File Station (Not recommended for updates)**
- Open File Station on your NAS
- Navigate to `/docker/codility-tracker/`
- Drag and drop your project files

### 5. Verify Files Are Uploaded

```bash
# From NAS SSH
cd /volume1/docker/codility-tracker
ls -la
# You should see: app.py, docker-compose.yml, Dockerfile, requirements.txt, etc.
```

### 6. Create/Update Environment Variables

Edit the `.env` file with secure values:
```bash
nano .env
```

Make sure these variables are set:
```
POSTGRES_DB=codility_tracker
POSTGRES_USER=codility_user
POSTGRES_PASSWORD=your_secure_password_here

DATABASE_URL=postgresql://codility_user:your_secure_password_here@postgres:5432/codility_tracker
SECRET_KEY=your_secret_key_here
FLASK_ENV=production
```

**Generate a secure SECRET_KEY:**
```bash
python3 -c 'import secrets; print(secrets.token_hex(32))'
```
Copy the output and paste it as your SECRET_KEY.

Press `Ctrl+X`, then `Y`, then `Enter` to save.

### 7. Build and Start the Application

```bash
# Build the Docker images
sudo docker-compose build

# Start the containers in detached mode
sudo docker-compose up -d
```

### 8. Check Container Status

```bash
# Check if containers are running
sudo docker-compose ps

# You should see:
# - codility-postgres (Up)
# - codility-web (Up)
```

### 9. View Logs (Optional)

```bash
# View web application logs
sudo docker-compose logs -f web

# View PostgreSQL logs
sudo docker-compose logs -f postgres

# Press Ctrl+C to exit log view
```

### 10. Access Your Application

Open a web browser and navigate to:
```
http://your-nas-ip:8089
```

Example: `http://192.168.1.100:8089`

## Common Issues & Solutions

### Container Won't Start

```bash
# Restart containers
sudo docker-compose restart

# View detailed logs
sudo docker-compose logs --tail=100
```

### Port Already in Use

Edit `docker-compose.yml` and change the port:
```yaml
ports:
  - "8090:5000"  # Use a different port
```

### Database Connection Error

```bash
# Check if PostgreSQL is ready
sudo docker exec codility-postgres pg_isready -U codility_user

# Restart just the web container
sudo docker-compose restart web
```

### Module/Dependency Errors

```bash
# Rebuild without cache
sudo docker-compose down
sudo docker-compose build --no-cache
sudo docker-compose up -d
```

## Updating Your Application

### Method 1: Using Git Pull (Recommended)

```bash
# 1. SSH to your NAS
ssh your-username@your-nas-ip

# 2. Navigate to project directory
cd /volume1/docker/codility-tracker

# 3. Pull latest changes
git pull origin main  # or 'master' depending on your branch

# 4. Rebuild and restart containers
sudo docker-compose down
sudo docker-compose build
sudo docker-compose up -d

# 5. Verify deployment
sudo docker-compose ps
sudo docker-compose logs -f web
```

### Method 2: Manual File Transfer

```bash
# 1. Copy updated files to NAS (using scp or File Station)
scp -r . your-username@your-nas-ip:/volume1/docker/codility-tracker/

# 2. Rebuild and restart
ssh your-username@your-nas-ip
cd /volume1/docker/codility-tracker
sudo docker-compose down
sudo docker-compose build
sudo docker-compose up -d
```

### Quick Update (No rebuild needed)

If you only changed Python files (no new dependencies):
```bash
cd /volume1/docker/codility-tracker
git pull origin main
sudo docker-compose restart web
```

**Note:** Always rebuild if you:
- Modified `requirements.txt`
- Changed `Dockerfile`
- Updated `docker-compose.yml`

## Stopping the Application

```bash
cd /volume1/docker/codility-tracker

# Stop containers
sudo docker-compose stop

# Stop and remove containers (but keep data)
sudo docker-compose down
```

## Backup Your Database

Create a backup:
```bash
sudo docker exec codility-postgres pg_dump -U codility_user codility_tracker > backup_$(date +%Y%m%d).sql
```

Restore from backup:
```bash
sudo docker exec -i codility-postgres psql -U codility_user codility_tracker < backup_20250101.sql
```

## Next Steps

- ✅ Set up automated daily backups using Task Scheduler
- ✅ Configure reverse proxy for HTTPS (optional)
- ✅ Set up QuickConnect for external access (optional)
- ✅ Monitor resource usage in Container Manager

For more advanced configurations, see `SYNOLOGY_DEPLOYMENT.md`.

---

**You're all set!** Your application is now running 24/7 on your NAS with persistent PostgreSQL storage.
