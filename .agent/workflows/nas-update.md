---
description: Quick update workflow for pulling and deploying changes to NAS
---

# Quick Update to NAS using Git Pull

Use this workflow when you've made changes to your code and want to deploy them to your NAS.

## Prerequisites
- ✅ You're already SSH'd into your NAS
- ✅ Git repository is set up on NAS at `/volume1/docker/codility-tracker`
- ✅ Changes are committed and pushed to your git remote

## Update Workflow

### 1. Commit and Push Local Changes (on your Mac)

```bash
# In your local project directory
cd /Users/tringuyen/dev/code/codility-tests

# Check what changed
git status

# Add changes
git add .

# Commit with message
git commit -m "Description of your changes"

# Push to remote
git push origin main
```

### 2. Pull and Deploy on NAS (already SSH'd in)

```bash
# Navigate to project directory
cd /volume1/docker/codility-tracker

# Pull latest changes
git pull origin main

# Check if you need to rebuild
# - If only Python code changed: just restart
# - If requirements.txt, Dockerfile, or docker-compose.yml changed: rebuild

# Option A: Quick restart (code changes only)
sudo docker-compose restart web

# Option B: Full rebuild (dependency/config changes)
sudo docker-compose down
sudo docker-compose build
sudo docker-compose up -d
```

### 3. Verify Deployment

```bash
# Check container status
sudo docker-compose ps

# Watch logs
sudo docker-compose logs -f web

# Press Ctrl+C to exit logs
```

### 4. Test in Browser

Open: `http://192.168.1.7:8089`

## One-Liner Update Commands

### For code-only changes:
```bash
cd /volume1/docker/codility-tracker && git pull origin main && sudo docker-compose restart web
```

### For full rebuild:
```bash
cd /volume1/docker/codility-tracker && git pull origin main && sudo docker-compose down && sudo docker-compose build && sudo docker-compose up -d
```

## Troubleshooting

### Git Pull Fails with "uncommitted changes"

```bash
# Stash local changes (if any)
git stash

# Pull
git pull origin main

# If needed, reapply stashed changes
git stash pop
```

### Port Already in Use

```bash
# Stop containers first
sudo docker-compose down

# Then rebuild and start
sudo docker-compose build
sudo docker-compose up -d
```

### Check What Changed

```bash
# View recent commits
git log --oneline -5

# See what files changed
git diff HEAD~1 HEAD --name-only
```

---

**Quick Reference:**
- Your NAS IP: `192.168.1.7`
- Application Port: `8089`
- Project Path: `/volume1/docker/codility-tracker`
