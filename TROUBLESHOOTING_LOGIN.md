# Login Troubleshooting Guide

If you're unable to login at first login, follow these steps to diagnose and fix the issue.

---

## 🔍 Quick Diagnosis

Run this command to check your setup:

```bash
# Check if all components are ready
echo "=== Login Setup Check ===" && \
echo "" && \
echo "1. Virtual environment:" && \
test -d venv && echo "   ✓ venv exists" || echo "   ✗ venv missing - Run: python -m venv venv" && \
echo "" && \
echo "2. Dependencies installed:" && \
test -f venv/bin/flask && echo "   ✓ Flask installed" || echo "   ✗ Flask missing - Run: pip install -r requirements.txt" && \
echo "" && \
echo "3. Database exists:" && \
test -f codility_progress.db && echo "   ✓ Database exists" || echo "   ✗ Database missing - Run app.py to create" && \
echo "" && \
echo "4. Admin user created:" && \
test -f codility_progress.db && echo "   ? Run create_admin.py to verify" || echo "   ✗ No database yet"
```

---

## 🛠️ Fix Steps

### Step 1: Install Dependencies

```bash
# Activate virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install all requirements
pip install -r requirements.txt
```

**Expected output:**
```
Successfully installed Flask-3.0.0 Flask-Login-0.6.3 ...
```

---

### Step 2: Create Database

```bash
# Run the app once to create database
python app.py
```

This will:
- Create `codility_progress.db` file
- Set up all database tables
- Start the web server

**Press Ctrl+C** to stop the server after it starts.

**Expected output:**
```
 * Creating database tables...
 * Running on http://127.0.0.1:5000
```

---

### Step 3: Create Admin User

```bash
python create_admin.py
```

**Expected output:**
```
✓ Admin user created successfully!

  Credentials:
  Username: admin
  Password: admin123

  ⚠️  IMPORTANT: Change this password after first login!
  🔗 Login at: http://localhost:5000/login
```

**If admin already exists:**
```
✓ Admin user already exists
  Username: admin
  Created: 2025-11-18 12:34:56

  Reset password to 'admin123'? (y/N): y
✓ Password reset successfully!
```

---

### Step 4: Verify Setup

```bash
# Check database file exists
ls -lh codility_progress.db

# Check users in database
python -c "from app import app, db, User; \
app.app_context().push(); \
users = User.query.all(); \
print(f'Users: {len(users)}'); \
[print(f'  - {u.username} (admin={u.is_admin})') for u in users]"
```

**Expected output:**
```
-rw-r--r--  1 user  staff   24K Nov 18 12:34 codility_progress.db

Users: 1
  - admin (admin=True)
```

---

### Step 5: Test Login

1. **Start the application:**
   ```bash
   python app.py
   ```

2. **Open browser:**
   ```
   http://localhost:5000/login
   ```

3. **Login with:**
   - Username: `admin`
   - Password: `admin123`

4. **Expected result:**
   - ✅ "Logged in successfully!" flash message
   - ✅ Redirected to dashboard
   - ✅ Username shown in navigation bar
   - ✅ "Logout" link appears

---

## 🐛 Common Issues

### Issue 1: "Invalid username or password"

**Cause**: Admin user not created or wrong credentials

**Fix:**
```bash
# Reset admin password
python create_admin.py
# Choose 'y' when asked to reset password

# Or use reset_password.py
python reset_password.py
# Choose option 2 for quick admin reset
```

---

### Issue 2: "ModuleNotFoundError: No module named 'flask'"

**Cause**: Dependencies not installed

**Fix:**
```bash
source venv/bin/activate
pip install -r requirements.txt
```

**Verify:**
```bash
pip list | grep -i flask
```

**Expected:**
```
Flask                3.0.0
Flask-Login          0.6.3
Flask-SQLAlchemy     3.1.1
```

---

### Issue 3: Database file doesn't exist

**Cause**: Application not run yet

**Fix:**
```bash
# Run app.py once to create database
python app.py
# Press Ctrl+C after server starts

# Verify database created
ls -lh codility_progress.db
```

---

### Issue 4: "User table doesn't exist"

**Cause**: Database created but tables not initialized

**Fix:**
```bash
python -c "from app import app, db; \
app.app_context().push(); \
db.create_all(); \
print('✓ Database tables created')"
```

---

### Issue 5: Login page doesn't load

**Cause**: Template file missing or Flask not running

**Fix:**
```bash
# Check template exists
ls -la templates/login.html

# Check Flask is running
curl http://localhost:5000/login
# or open in browser
```

---

### Issue 6: Login succeeds but edit button doesn't appear

**Cause**: User is not an admin

**Fix:**
```bash
python -c "from app import app, db, User; \
app.app_context().push(); \
user = User.query.filter_by(username='admin').first(); \
print(f'Admin status: {user.is_admin}'); \
if not user.is_admin: \
    user.is_admin = True; \
    db.session.commit(); \
    print('✓ Admin status fixed')"
```

---

### Issue 7: Password forgotten

**Solutions:**

**Option 1 - Quick reset to default:**
```bash
python reset_password.py
# Choose option 2: Quick reset admin to default (admin123)
```

**Option 2 - Interactive reset:**
```bash
python reset_password.py
# Choose option 1: Reset any user's password (interactive)
# Follow prompts to select user and set new password
```

**Option 3 - Direct Python:**
```bash
python -c "from app import app, db, User; \
app.app_context().push(); \
admin = User.query.filter_by(username='admin').first(); \
admin.set_password('admin123'); \
db.session.commit(); \
print('✓ Password reset to admin123')"
```

---

## 🔐 Password Security

### Check Password Hash

```bash
python -c "from app import app, db, User; \
app.app_context().push(); \
user = User.query.filter_by(username='admin').first(); \
print(f'Username: {user.username}'); \
print(f'Password hash: {user.password_hash[:50]}...')"
```

**Expected:**
```
Username: admin
Password hash: pbkdf2:sha256:260000$randomsalt$randomhash...
```

### Test Password Verification

```bash
python -c "from app import app, db, User; \
app.app_context().push(); \
user = User.query.filter_by(username='admin').first(); \
print('Testing password: admin123'); \
print(f'Valid: {user.check_password(\"admin123\")}')"
```

**Expected:**
```
Testing password: admin123
Valid: True
```

---

## 📋 Complete Setup Checklist

- [ ] Virtual environment created (`venv/` exists)
- [ ] Dependencies installed (`pip install -r requirements.txt`)
- [ ] Database created (`codility_progress.db` exists)
- [ ] Database tables initialized (run `app.py` once)
- [ ] Admin user created (`python create_admin.py`)
- [ ] Can access login page (`http://localhost:5000/login`)
- [ ] Can login with admin/admin123
- [ ] Redirected to dashboard after login
- [ ] Username shows in navigation
- [ ] Edit button appears on lesson pages

---

## 🚀 Fresh Start Script

If all else fails, here's a complete fresh start:

```bash
#!/bin/bash
# Fresh setup script

echo "=== Fresh Login Setup ==="

# 1. Clean old database (CAUTION: Deletes all data!)
echo "Removing old database..."
rm -f codility_progress.db

# 2. Activate virtualenv
echo "Activating virtualenv..."
source venv/bin/activate

# 3. Ensure dependencies installed
echo "Installing dependencies..."
pip install -r requirements.txt --quiet

# 4. Create database tables
echo "Creating database tables..."
python -c "from app import app, db; app.app_context().push(); db.create_all(); print('✓ Tables created')"

# 5. Create admin user
echo "Creating admin user..."
python create_admin.py

# 6. Verify setup
echo ""
echo "=== Verification ==="
python -c "from app import app, db, User; \
app.app_context().push(); \
users = User.query.all(); \
print(f'Total users: {len(users)}'); \
[print(f'  ✓ {u.username} (admin={u.is_admin})') for u in users]"

echo ""
echo "=== Setup Complete ==="
echo "Start server: python app.py"
echo "Login at: http://localhost:5000/login"
echo "Credentials: admin / admin123"
```

**Save as:** `fresh_setup.sh`

**Run:**
```bash
chmod +x fresh_setup.sh
./fresh_setup.sh
```

---

## 🔍 Debug Mode

### Enable Debug Logging

Edit `app.py` and add after `app = Flask(__name__)`:

```python
import logging
logging.basicConfig(level=logging.DEBUG)
app.logger.setLevel(logging.DEBUG)
```

Then in the login route, add debug prints:

```python
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')

        app.logger.debug(f"Login attempt: {username}")

        user = User.query.filter_by(username=username).first()
        app.logger.debug(f"User found: {user is not None}")

        if user:
            password_valid = user.check_password(password)
            app.logger.debug(f"Password valid: {password_valid}")

        # ... rest of login code
```

Restart the app and watch console for debug messages.

---

## 📞 Still Having Issues?

If you've tried all the above and still can't login:

1. **Check Python version:**
   ```bash
   python --version  # Should be 3.8+
   ```

2. **Check Flask-Login installation:**
   ```bash
   pip show Flask-Login
   ```

3. **Check browser console:**
   - Open browser DevTools (F12)
   - Check Console tab for JavaScript errors
   - Check Network tab for failed requests

4. **Check app logs:**
   - Look at terminal where `python app.py` is running
   - Check for error messages

5. **Verify file permissions:**
   ```bash
   ls -la codility_progress.db
   # Should be readable/writable
   ```

---

## 📚 Related Documentation

- [AUTHENTICATION.md](AUTHENTICATION.md) - Complete authentication guide
- [PASSWORD_RECOVERY.md](PASSWORD_RECOVERY.md) - Password recovery methods
- [README.md](README.md) - Setup instructions

---

*Last Updated: November 18, 2025*
*Version: 1.0.0*
