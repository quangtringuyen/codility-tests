# 🚀 Auto-Deployment Quick Start

**Get automatic deployment in under 2 minutes!**

---

## What Is This?

Auto-deployment automatically rebuilds and restarts your app when you run `git pull`. No manual steps needed!

**Perfect for:**
- Synology NAS deployments
- Local development servers
- Production servers with Git access

---

## ⚡ Quick Setup (2 minutes)

### 1. Run Setup Script

```bash
cd /path/to/codility-tracker
./setup-auto-deploy.sh
```

**Output:**
```
============================================================
🔧 Auto-Deploy Setup
============================================================

✓ Made deploy.sh executable
✓ Installed post-merge hook

✅ Auto-deploy setup complete!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Test it:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  git pull origin main
  # Auto-deployment will run automatically!
```

### 2. Done! ✅

That's it. Auto-deployment is now active.

---

## 🎯 How It Works

```
┌──────────────┐
│  git pull    │
│  origin main │
└──────┬───────┘
       │
       ▼
┌─────────────────┐
│  Git hook runs  │
│  automatically  │
└──────┬──────────┘
       │
       ▼
┌──────────────────┐     YES     ┌──────────────┐
│ Code changed?    │────────────>│ Run deploy.sh│
└──────┬───────────┘             └──────┬───────┘
       │ NO                             │
       ▼                                ▼
    Skip                         ┌─────────────┐
                                 │ App rebuilt │
                                 │ & restarted │
                                 └─────────────┘
```

---

## 🧪 Test It

```bash
# Make a small change via GitHub web UI or another clone
# Then pull:

git pull origin main
```

**Expected Output:**

```
🚀 Auto-Deployment Triggered
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Files changed:
  app.py
  templates/base.html

✓ Code changes detected
  Running deployment...

============================================================
🚀 Deployment Script
============================================================

Detected deployment type: docker

✓ Containers stopped
✓ Images built successfully
✓ Containers started

✅ Deployment successful!
```

---

## 📋 What Triggers Auto-Deploy?

**YES - Deploys automatically:**
- ✅ Python files (*.py)
- ✅ Templates (templates/*)
- ✅ Static files (static/*)
- ✅ Requirements (requirements.txt)
- ✅ Docker config (docker-compose.yml, Dockerfile)

**NO - Skips deployment:**
- ❌ Documentation (*.md, docs/)
- ❌ Git files (.gitignore, .git/)
- ❌ Other non-code changes

---

## 🛠️ Files Created

The setup script creates/configures these files:

```
your-project/
├── deploy.sh              # Main deployment script
├── setup-auto-deploy.sh   # One-time setup script
├── git-hooks/
│   └── post-merge         # Git hook template
└── .git/hooks/
    └── post-merge         # Installed Git hook (created by setup)
```

---

## 💡 Common Commands

```bash
# Setup auto-deployment
./setup-auto-deploy.sh

# Manual deployment
./deploy.sh

# Force Docker deployment
./deploy.sh docker

# Force local deployment
./deploy.sh local

# Disable auto-deploy (temporary)
mv .git/hooks/post-merge .git/hooks/post-merge.disabled

# Re-enable
mv .git/hooks/post-merge.disabled .git/hooks/post-merge

# Check if hook exists
ls -la .git/hooks/post-merge
```

---

## 🔍 Troubleshooting

### Auto-deploy not running?

```bash
# 1. Check hook exists and is executable
ls -la .git/hooks/post-merge

# 2. Make it executable if needed
chmod +x .git/hooks/post-merge

# 3. Test hook manually
bash .git/hooks/post-merge
```

### Deployment fails?

```bash
# 1. Check deploy.sh is executable
chmod +x deploy.sh

# 2. Run manually to see errors
./deploy.sh

# 3. Check Docker (if using Docker)
docker ps
docker-compose logs
```

### Only want to deploy on specific changes?

Edit `.git/hooks/post-merge` and modify the file detection patterns.

---

## 📚 Full Documentation

- [AUTO_DEPLOY.md](AUTO_DEPLOY.md) - Complete guide with all features
- [AUTO_DEPLOY_TEST.md](AUTO_DEPLOY_TEST.md) - Testing procedures
- [DEPLOYMENT.md](DEPLOYMENT.md) - General deployment guide

---

## ⚙️ Configuration

### Change Deployment Type

Edit `deploy.sh` and set default:

```bash
# Force specific deployment type
DEPLOY_TYPE="docker"  # or "local"
```

### Customize File Patterns

Edit `.git/hooks/post-merge`:

```bash
# Add custom patterns to trigger deployment
if echo "$changed_files" | grep -qE '\.json$|\.yaml$'; then
    should_deploy=true
fi
```

### Add Notifications

Edit `deploy.sh` to add notifications after deployment:

```bash
# At end of deploy_docker() or deploy_local()
curl -X POST YOUR_WEBHOOK_URL \
  -H 'Content-Type: application/json' \
  -d '{"text":"Deployment complete!"}'
```

---

## 🎓 Best Practices

### 1. Test First
Always test auto-deployment in development before using in production.

### 2. Monitor Deployments
Watch the first few auto-deployments to ensure they work correctly:

```bash
# Docker
docker-compose logs -f

# Local
tail -f app.log
```

### 3. Have Rollback Plan
Keep previous version tagged:

```bash
git tag v1.0.0
git push --tags

# Rollback if needed
git checkout v1.0.0
./deploy.sh
```

### 4. Branch Protection
Hook only runs on `main`/`master` branches by default. Test on feature branches, merge to main to deploy.

---

## 🔒 Security Notes

- Git hooks run with your user permissions
- Review changed files before pulling
- Never commit sensitive data that triggers deployment
- Use environment variables for secrets (`.env` file)

---

## ✅ Quick Checklist

After setup, verify:

- [ ] Setup script ran without errors
- [ ] `.git/hooks/post-merge` exists and is executable
- [ ] `deploy.sh` is executable
- [ ] Test `git pull` triggers auto-deployment
- [ ] Application restarts successfully
- [ ] No errors in logs

---

## 🚦 Status Indicators

**During `git pull`:**

```
✓  Git hook triggered
✓  File changes detected
✓  Deployment script started
✓  Containers stopped (Docker only)
✓  Images rebuilt (Docker only)
✓  Containers started (Docker only)
✓  Dependencies installed (Local only)
✓  Application restarted
✅ Deployment successful!
```

**Skipped deployment:**

```
ℹ️  No deployment needed (only docs changed)
```

---

## 💬 Getting Help

If you encounter issues:

1. **Check logs**: Look at deployment output carefully
2. **Test manually**: Run `./deploy.sh` to see detailed errors
3. **Verify setup**: Re-run `./setup-auto-deploy.sh`
4. **Review docs**: See [AUTO_DEPLOY.md](AUTO_DEPLOY.md)

---

## 🎉 You're Ready!

Auto-deployment is now set up. Every time you `git pull` new code changes, your app will automatically rebuild and restart.

**Happy deploying!** 🚀

---

*Last Updated: November 18, 2025*
*Version: 1.0.0*
