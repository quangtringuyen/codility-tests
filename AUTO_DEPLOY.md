# 🚀 Auto-Deployment Guide

This guide explains how to set up automatic deployment for your Codility Training Tracker. When you pull new code from Git, the application will automatically rebuild and restart.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Quick Setup](#quick-setup)
3. [How It Works](#how-it-works)
4. [Deployment Scripts](#deployment-scripts)
5. [Git Hooks](#git-hooks)
6. [Testing](#testing)
7. [Troubleshooting](#troubleshooting)
8. [Manual Deployment](#manual-deployment)

---

## Overview

The auto-deployment system consists of three components:

1. **deploy.sh** - Main deployment script (handles Docker or local)
2. **git-hooks/post-merge** - Git hook that triggers on `git pull`
3. **setup-auto-deploy.sh** - One-time setup script

### Supported Deployment Types

- **Docker** - Detects docker-compose.yml, rebuilds containers
- **Local** - Detects virtualenv, restarts Python app

---

## Quick Setup

### One-Time Installation

```bash
# 1. Make setup script executable
chmod +x setup-auto-deploy.sh

# 2. Run setup
./setup-auto-deploy.sh
```

That's it! Auto-deployment is now active.

### What the Setup Does

1. Makes `deploy.sh` executable
2. Copies `git-hooks/post-merge` to `.git/hooks/`
3. Sets proper permissions on Git hooks
4. Displays instructions

---

## How It Works

### Workflow

```
┌─────────────────┐
│  git pull       │
│  origin main    │
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│  Git post-merge hook    │
│  triggers automatically │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  Check changed files    │
│  (.py, templates, etc)  │
└────────┬────────────────┘
         │
         ▼
    ┌────────┐
    │Deploy? │
    └───┬────┘
        │
    ────┼────
    │        │
   YES      NO
    │        │
    ▼        ▼
┌──────┐  Exit
│Run   │
│deploy│
│.sh   │
└──────┘
    │
    ▼
┌─────────────────┐
│ Docker or Local │
│   Deployment    │
└─────────────────┘
    │
    ▼
┌─────────────────┐
│ App Restarted   │
│   ✅ Done!      │
└─────────────────┘
```

### Trigger Conditions

Auto-deployment runs when:
- On `main` or `master` branch
- Changes detected in:
  - Python files (*.py)
  - Templates (templates/*)
  - Static files (static/*)
  - Requirements (requirements.txt)
  - Docker config (docker-compose.yml, Dockerfile)

### What Gets Deployed

**Docker Deployment:**
1. Stops containers
2. Rebuilds images (--no-cache)
3. Starts containers
4. Shows container status

**Local Deployment:**
1. Activates virtualenv
2. Installs dependencies
3. Creates database tables
4. Restarts Python app

---

## Deployment Scripts

### deploy.sh

Main deployment script with automatic environment detection.

**Location:** `/deploy.sh`

**Usage:**
```bash
# Automatic deployment (detects Docker or local)
./deploy.sh

# Force Docker deployment
./deploy.sh docker

# Force local deployment
./deploy.sh local
```

**Features:**
- ✅ Auto-detects deployment type
- ✅ Colored output for status
- ✅ Error handling with rollback
- ✅ Database migration support
- ✅ Logs all actions

**Example Output:**
```
============================================================
🚀 Deployment Script
============================================================

Detected deployment type: docker

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🐳 Deploying with Docker
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ Containers stopped
✓ Images built successfully
✓ Containers started

✅ Deployment successful!
```

---

## Git Hooks

### post-merge Hook

Automatically runs after `git pull` or `git merge`.

**Location:** `git-hooks/post-merge`

**What It Does:**
1. Checks current branch (only main/master)
2. Gets list of changed files
3. Determines if deployment needed
4. Runs `deploy.sh` if needed

**Smart Detection:**

```bash
# Triggers deployment
git pull  # Changes to app.py
git pull  # Changes to requirements.txt
git pull  # Changes to templates/base.html

# Does NOT trigger deployment
git pull  # Only README.md changed
git pull  # Only .gitignore changed
```

**Branch Protection:**
- Only runs on `main` or `master` branch
- Other branches are skipped automatically

---

## Testing

### Test Auto-Deployment

#### 1. Make a Test Change

```bash
# Edit a file to test
echo "# Test deployment" >> README.md
git add README.md
git commit -m "Test auto-deploy"
```

#### 2. Push to Remote

```bash
git push origin main
```

#### 3. Pull on Deployment Server

```bash
# On your NAS or server
cd /volume1/docker/codility-tracker
git pull origin main
```

**Expected Output:**
```
remote: Counting objects: 3, done.
remote: Compressing objects: 100% (2/2), done.
remote: Total 3 (delta 1), reused 0 (delta 0)
Unpacking objects: 100% (3/3), done.
From https://github.com/user/repo
   a7fa7bd..bd29959  main       -> origin/main
Updating a7fa7bd..bd29959
Fast-forward
 README.md | 1 +

🚀 Auto-Deployment Triggered
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Files changed:
  README.md

ℹ️  No deployment needed (only docs changed)
```

#### 4. Test Actual Deployment

```bash
# Make a code change
echo "# Version 2.0.1" >> app.py
git add app.py
git commit -m "Update version"
git push origin main

# On server
git pull origin main
```

**Expected Output:**
```
🚀 Auto-Deployment Triggered
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Files changed:
  app.py

✓ Code changes detected
  Running deployment...

============================================================
🚀 Deployment Script
============================================================
[... deployment proceeds ...]
```

---

## Troubleshooting

### Hook Not Running

**Problem:** Git pull doesn't trigger deployment

**Solutions:**

```bash
# 1. Check if hook is installed
ls -la .git/hooks/post-merge

# 2. Check permissions
chmod +x .git/hooks/post-merge

# 3. Verify hook content
cat .git/hooks/post-merge

# 4. Re-run setup
./setup-auto-deploy.sh
```

### Deployment Fails

**Problem:** Hook runs but deployment fails

**Solutions:**

```bash
# 1. Check deploy.sh permissions
chmod +x deploy.sh

# 2. Run manually to see errors
./deploy.sh

# 3. Check Docker is running (for Docker deployments)
docker ps

# 4. Check virtualenv exists (for local deployments)
ls -la venv/
```

### Wrong Deployment Type

**Problem:** Deploying with wrong method

**Solutions:**

```bash
# Force specific deployment type
./deploy.sh docker    # Force Docker
./deploy.sh local     # Force local

# Or edit deploy.sh to set default:
DEPLOY_TYPE="docker"  # At top of file
```

### Branch Issues

**Problem:** Hook runs on wrong branch

**Solution:**

The hook only runs on `main` or `master`. To change:

```bash
# Edit .git/hooks/post-merge
BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [[ "$BRANCH" != "main" && "$BRANCH" != "develop" ]]; then
    exit 0
fi
```

### Logs and Debugging

**View deployment logs:**

```bash
# Docker logs
docker-compose logs -f web

# Local deployment logs
tail -f app.log

# Git hook logs
# Add to post-merge hook:
bash deploy.sh >> deploy.log 2>&1
```

---

## Manual Deployment

### When to Deploy Manually

- Testing deployment process
- First-time setup
- Debugging issues
- Deploying specific branch

### Docker Deployment

```bash
# Full rebuild
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Or use deploy script
./deploy.sh docker
```

### Local Deployment

```bash
# Activate virtualenv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Restart app
pkill -f "python app.py"
nohup python app.py > app.log 2>&1 &

# Or use deploy script
./deploy.sh local
```

---

## Advanced Configuration

### Custom Deployment Commands

Edit `deploy.sh` to add custom steps:

```bash
# Before deployment
function pre_deploy() {
    echo "Running pre-deployment tasks..."
    # Your custom commands
}

# After deployment
function post_deploy() {
    echo "Running post-deployment tasks..."
    # Your custom commands
}
```

### Notifications

Add notifications to deployment:

```bash
# Add to deploy.sh after successful deployment

# Slack notification
curl -X POST -H 'Content-type: application/json' \
  --data '{"text":"Deployment successful!"}' \
  YOUR_SLACK_WEBHOOK_URL

# Email notification
echo "Deployment complete" | mail -s "Deploy Success" you@example.com
```

### Multiple Environments

Create environment-specific deployment:

```bash
# deploy-staging.sh
export FLASK_ENV=staging
docker-compose -f docker-compose.staging.yml up -d

# deploy-production.sh
export FLASK_ENV=production
docker-compose -f docker-compose.production.yml up -d
```

---

## Security Considerations

### Git Hook Security

- Hooks run with your user permissions
- Never commit sensitive data to trigger deployment
- Review changed files before pulling

### Deployment Security

- Deploy script stops/starts services (ensure proper permissions)
- Docker deployment rebuilds images (may take time)
- Local deployment kills running processes

### Best Practices

1. **Test in staging first**
   ```bash
   git checkout staging
   git pull
   # Verify deployment works
   git checkout main
   ```

2. **Use feature branches**
   ```bash
   git checkout -b feature/new-feature
   # Make changes, test locally
   git checkout main
   git merge feature/new-feature
   git push
   ```

3. **Monitor deployments**
   ```bash
   # Watch logs during deployment
   docker-compose logs -f
   # Or for local
   tail -f app.log
   ```

4. **Have rollback plan**
   ```bash
   # Keep previous version tagged
   git tag v1.0.0
   git push --tags

   # Rollback if needed
   git checkout v1.0.0
   ./deploy.sh
   ```

---

## Comparison: Auto vs Manual Deployment

| Aspect | Auto-Deployment | Manual Deployment |
|--------|----------------|-------------------|
| **Speed** | Instant on pull | Manual steps required |
| **Consistency** | Always same process | May vary |
| **Error-prone** | Automated checks | Human error possible |
| **Control** | Automatic | Full control |
| **Best for** | Production, regular updates | Testing, debugging |

---

## FAQ

### Does this work with GitHub webhooks?

The current setup uses Git hooks (client-side). For server-side webhooks:
- See webhook implementation in separate guide
- Requires exposing server endpoint
- More complex but truly automated

### Can I disable auto-deployment temporarily?

```bash
# Disable
mv .git/hooks/post-merge .git/hooks/post-merge.disabled

# Re-enable
mv .git/hooks/post-merge.disabled .git/hooks/post-merge
```

### Will deployment run on every git pull?

Only if files that require deployment changed:
- ✅ Python code, templates, static files → Deploy
- ❌ README, docs, comments only → Skip

### What happens if deployment fails?

- Deployment stops with error message
- Previous version keeps running
- Check logs for error details
- Fix issue and run manually

### Can I customize which files trigger deployment?

Yes! Edit `.git/hooks/post-merge`:

```bash
# Add your patterns
if echo "$changed_files" | grep -qE '\.js$|\.css$'; then
    should_deploy=true
fi
```

---

## Summary

**Setup Steps:**
1. Run `./setup-auto-deploy.sh`
2. Test with `git pull origin main`
3. Monitor deployment logs

**Key Files:**
- `deploy.sh` - Main deployment script
- `.git/hooks/post-merge` - Git hook (auto-installed)
- `setup-auto-deploy.sh` - One-time setup

**Advantages:**
- ✅ Automatic deployment on pull
- ✅ Smart file detection
- ✅ Supports Docker and local
- ✅ Error handling
- ✅ Branch protection

**Best For:**
- Production servers
- Regular updates
- Team deployments
- CI/CD workflows

---

## Next Steps

1. ✅ Run setup script
2. ✅ Test deployment
3. ✅ Configure notifications (optional)
4. ✅ Set up staging environment (optional)
5. ✅ Document your workflow

---

**Need Help?**
- Check [DEPLOYMENT.md](DEPLOYMENT.md) for general deployment
- Check [README.md](README.md) for setup instructions
- Check logs: `docker-compose logs` or `tail -f app.log`

---

*Last Updated: November 18, 2025*
*Version: 1.0.0 (Initial Auto-Deploy)*
