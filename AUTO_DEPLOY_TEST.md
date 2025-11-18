# Auto-Deployment Testing Guide

This document provides step-by-step instructions for testing the auto-deployment system.

## 🧪 Test Checklist

Before deploying to production, verify that auto-deployment works correctly.

---

## Test 1: Setup Script

**Objective**: Verify setup script installs Git hooks correctly

### Steps:

```bash
# 1. Run setup script
./setup-auto-deploy.sh

# 2. Verify Git hook was installed
ls -la .git/hooks/post-merge

# 3. Check hook is executable
test -x .git/hooks/post-merge && echo "✓ Hook is executable" || echo "✗ Hook is NOT executable"

# 4. Verify hook content
cat .git/hooks/post-merge | head -5
```

### Expected Results:
- ✅ Script completes without errors
- ✅ `.git/hooks/post-merge` exists
- ✅ Hook is executable (permissions: `-rwxr-xr-x`)
- ✅ Hook contains proper bash shebang (`#!/bin/bash`)

---

## Test 2: Deployment Detection

**Objective**: Verify deploy.sh correctly detects deployment type

### Steps:

```bash
# Test deployment type detection
./deploy.sh
```

### Expected Results:

**If docker-compose.yml exists:**
```
Detected deployment type: docker
```

**If venv/ exists:**
```
Detected deployment type: local
```

**Manual override test:**
```bash
# Force Docker
./deploy.sh docker

# Force local
./deploy.sh local
```

---

## Test 3: Git Hook Trigger (Dry Run)

**Objective**: Verify Git hook detects file changes correctly

### Test 3a: Changes that SHOULD trigger deployment

```bash
# Create a test branch
git checkout -b test-auto-deploy

# Test 1: Python file change
echo "# Test change" >> app.py
git add app.py
git commit -m "Test: Python file change"

# Simulate post-merge hook manually
bash .git/hooks/post-merge
# Expected: "✓ Code changes detected - Running deployment..."
```

**Files that SHOULD trigger deployment:**
- ✅ `*.py` files (app.py, create_admin.py, etc.)
- ✅ `requirements.txt`
- ✅ `templates/` directory
- ✅ `static/` directory
- ✅ `docker-compose.yml`
- ✅ `Dockerfile`

### Test 3b: Changes that should NOT trigger deployment

```bash
# Test 2: Documentation change
echo "# Test" >> README.md
git add README.md
git commit -m "Test: Doc change"

# Simulate post-merge hook
bash .git/hooks/post-merge
# Expected: "ℹ️  No deployment needed (only docs changed)"
```

**Files that should NOT trigger deployment:**
- ❌ `README.md`
- ❌ `*.md` documentation files
- ❌ `.gitignore`
- ❌ Comments in code

### Cleanup:
```bash
# Reset test changes
git checkout main
git branch -D test-auto-deploy
git checkout app.py
```

---

## Test 4: Branch Protection

**Objective**: Verify hook only runs on main/master branches

### Steps:

```bash
# 1. Create feature branch
git checkout -b feature/test

# 2. Make a change
echo "# Test" >> test.txt
git add test.txt
git commit -m "Test change"

# 3. Manually trigger hook
bash .git/hooks/post-merge

# Expected: Hook should exit early (no deployment)

# 4. Switch to main branch
git checkout main

# 5. Trigger hook again
bash .git/hooks/post-merge

# Expected: Hook should check for changes and deploy if needed

# Cleanup
git branch -D feature/test
rm -f test.txt
```

### Expected Results:
- ✅ Hook skips deployment on non-main/master branches
- ✅ Hook runs deployment on main/master branches

---

## Test 5: Full Integration Test (Local Development)

**Objective**: Test complete workflow from git pull to deployment

### Prerequisites:
- Must have a remote repository configured
- Must be on main/master branch

### Steps:

```bash
# 1. Ensure you're on main branch
git checkout main

# 2. Make a small change remotely (via GitHub web UI)
# Or from another clone:
# - Edit README.md
# - Commit and push

# 3. Pull changes
git pull origin main

# 4. Observe auto-deployment
# Expected:
# - Post-merge hook triggers
# - Deployment script runs
# - Application restarts

# 5. Verify application is running
# Docker:
docker-compose ps

# Local:
ps aux | grep "python app.py"
```

### Expected Results:
- ✅ Git pull succeeds
- ✅ Post-merge hook triggers automatically
- ✅ Deployment script executes
- ✅ Application restarts successfully
- ✅ No errors in deployment logs

---

## Test 6: Docker Deployment (If Available)

**Objective**: Test Docker-specific deployment

### Prerequisites:
- Docker and docker-compose installed
- docker-compose.yml present

### Steps:

```bash
# 1. Force Docker deployment
./deploy.sh docker

# 2. Watch deployment progress
# Expected output:
# - "Stopping containers..."
# - "Building images..."
# - "Starting containers..."
# - "✅ Deployment successful!"

# 3. Verify containers are running
docker-compose ps

# 4. Check logs for errors
docker-compose logs web | tail -20

# 5. Test application accessibility
curl http://localhost:8089
```

### Expected Results:
- ✅ Containers stop successfully
- ✅ Images rebuild without errors
- ✅ Containers start successfully
- ✅ Web container is healthy
- ✅ Application responds to requests

---

## Test 7: Local Deployment (If Available)

**Objective**: Test local virtualenv deployment

### Prerequisites:
- Python virtualenv exists at `venv/`
- requirements.txt present

### Steps:

```bash
# 1. Force local deployment
./deploy.sh local

# 2. Watch deployment progress
# Expected output:
# - "Activating virtualenv..."
# - "Installing dependencies..."
# - "Creating database tables..."
# - "Restarting application..."
# - "✅ Deployment successful!"

# 3. Verify app is running
ps aux | grep "python app.py"

# 4. Check logs
tail -20 app.log

# 5. Test application
curl http://localhost:5000
```

### Expected Results:
- ✅ Virtualenv activates
- ✅ Dependencies install successfully
- ✅ Database tables created
- ✅ Old process killed
- ✅ New process started
- ✅ Application responds to requests

---

## Test 8: Error Handling

**Objective**: Verify deployment handles errors gracefully

### Test 8a: Syntax Error in Python Code

```bash
# 1. Introduce syntax error
echo "def broken_function(" >> app.py
git add app.py
git commit -m "Test: Syntax error"

# 2. Trigger deployment
./deploy.sh

# Expected: Deployment should fail gracefully with error message

# 3. Fix and verify
git checkout app.py
./deploy.sh
```

### Test 8b: Missing Dependency

```bash
# 1. Remove a package temporarily
echo "nonexistent-package==1.0.0" >> requirements.txt
git add requirements.txt
git commit -m "Test: Missing package"

# 2. Trigger deployment
./deploy.sh

# Expected: Clear error about missing package

# 3. Fix
git checkout requirements.txt
./deploy.sh
```

### Expected Results:
- ✅ Errors are caught and reported clearly
- ✅ Deployment stops on error (doesn't continue)
- ✅ Error messages are helpful
- ✅ Previous version keeps running (for Docker)

---

## Test 9: Performance Test

**Objective**: Measure deployment time

### Steps:

```bash
# Time the deployment
time ./deploy.sh

# Or more detailed:
date && ./deploy.sh && date
```

### Expected Results:
- **Docker deployment**: 30-90 seconds (rebuild + restart)
- **Local deployment**: 5-15 seconds (install + restart)

---

## Test 10: Disable/Re-enable Hook

**Objective**: Verify hook can be disabled temporarily

### Steps:

```bash
# 1. Disable hook
mv .git/hooks/post-merge .git/hooks/post-merge.disabled

# 2. Pull changes
git pull origin main
# Expected: No auto-deployment

# 3. Re-enable hook
mv .git/hooks/post-merge.disabled .git/hooks/post-merge

# 4. Pull again
git pull origin main
# Expected: Auto-deployment resumes
```

---

## 🏁 Final Validation Checklist

Before considering auto-deployment production-ready:

- [ ] Setup script runs without errors
- [ ] Git hook installs correctly with proper permissions
- [ ] Hook detects Python/template/static changes
- [ ] Hook ignores documentation-only changes
- [ ] Hook respects branch protection (main/master only)
- [ ] Docker deployment works (if applicable)
- [ ] Local deployment works (if applicable)
- [ ] Errors are handled gracefully
- [ ] Application restarts successfully
- [ ] No data loss during deployment
- [ ] Deployment completes in reasonable time
- [ ] Hook can be disabled/re-enabled

---

## 📊 Test Results Template

Use this template to record your test results:

```markdown
## Auto-Deployment Test Results

**Date**: [Date]
**Tester**: [Name]
**Environment**: [Docker/Local/Both]

| Test | Status | Notes |
|------|--------|-------|
| Setup Script | ✅/❌ | |
| Deployment Detection | ✅/❌ | |
| File Change Detection | ✅/❌ | |
| Branch Protection | ✅/❌ | |
| Full Integration | ✅/❌ | |
| Docker Deployment | ✅/❌/N/A | |
| Local Deployment | ✅/❌/N/A | |
| Error Handling | ✅/❌ | |
| Performance | ✅/❌ | Time: ___ seconds |
| Disable/Re-enable | ✅/❌ | |

**Overall Status**: ✅ PASS / ❌ FAIL

**Issues Found**:
-

**Action Items**:
-
```

---

## 🐛 Common Issues and Solutions

### Issue: Hook not executing

**Symptoms**: Git pull succeeds but no deployment
**Solution**:
```bash
# Check hook exists and is executable
ls -la .git/hooks/post-merge
chmod +x .git/hooks/post-merge
```

### Issue: Deployment fails with "command not found"

**Symptoms**: Hook runs but deploy.sh not found
**Solution**:
```bash
# Make deploy.sh executable
chmod +x deploy.sh

# Or use absolute path in hook
PWD=$(pwd)
bash "$PWD/deploy.sh"
```

### Issue: Docker deployment fails

**Symptoms**: Containers don't restart
**Solution**:
```bash
# Check Docker is running
docker ps

# Check docker-compose syntax
docker-compose config

# View detailed errors
docker-compose logs
```

### Issue: Local deployment - app doesn't restart

**Symptoms**: Old process still running
**Solution**:
```bash
# Manually kill old process
pkill -f "python app.py"

# Check if virtualenv exists
ls -la venv/

# Verify app.py exists
ls -la app.py
```

---

## 📝 Quick Test Commands

```bash
# Full test suite (run all at once)
# WARNING: Only run in development environment!

# Setup
./setup-auto-deploy.sh

# Test scripts syntax
bash -n deploy.sh && echo "✓ deploy.sh OK"
bash -n .git/hooks/post-merge && echo "✓ post-merge OK"

# Test deployment detection
./deploy.sh

# Test hook manually
bash .git/hooks/post-merge

# Verify application
# Docker:
docker-compose ps && docker-compose logs web | tail -10

# Local:
ps aux | grep "python app.py" && tail -10 app.log
```

---

## 🎓 Best Practices

1. **Always test in development first**
   - Never test auto-deployment directly in production
   - Use a staging branch/environment

2. **Monitor first few deployments**
   - Watch logs during initial deployments
   - Verify application health after each deploy

3. **Have rollback plan**
   - Keep previous version tagged
   - Know how to disable hook quickly
   - Maintain database backups

4. **Document your workflow**
   - Note any custom modifications
   - Keep test results
   - Update this guide with lessons learned

5. **Regular testing**
   - Test auto-deployment monthly
   - Verify after system updates
   - Re-test after Git upgrades

---

**Ready for Production?**

If all tests pass ✅, your auto-deployment is ready for production use!

See [AUTO_DEPLOY.md](AUTO_DEPLOY.md) for usage documentation.

---

*Last Updated: November 18, 2025*
*Version: 1.0.0 (Initial Test Guide)*
