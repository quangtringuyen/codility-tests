# 🔑 Password Recovery Quick Guide

## Forgot Your Password?

Don't worry! Here's how to recover access to your Codility Training Tracker account.

---

## 🚀 Quick Recovery (3 Steps)

### **For Local Installation**

```bash
# Step 1: Run the password reset tool
python reset_password.py

# Step 2: Choose option 2 (Quick reset admin)
# Type: 2

# Step 3: Confirm
# Type: y

# ✅ Done! Login with:
# Username: admin
# Password: admin123
```

### **For Docker/NAS Deployment**

```bash
# Step 1: SSH into your NAS
ssh admin@YOUR_NAS_IP

# Step 2: Navigate to project
cd /volume1/docker/codility-tracker

# Step 3: Run reset tool
sudo docker-compose exec web python reset_password.py

# Step 4: Choose option 2
# Type: 2

# Step 5: Confirm
# Type: y

# ✅ Done! Login with default password
```

---

## 📋 Recovery Options

### **Option 1: Interactive Reset** (Recommended)

**Use when:** You want to set a custom password immediately

```bash
python reset_password.py
# Choose: 1
# Select user
# Enter new password
# Confirm password
# ✅ Done!
```

### **Option 2: Quick Admin Reset** (Fast)

**Use when:** You need immediate access

```bash
python reset_password.py
# Choose: 2
# Confirm: y
# ✅ Admin password reset to: admin123
```

### **Option 3: Python One-Liner** (Advanced)

**Use when:** You're comfortable with command line

```bash
python -c "from app import app, db, User; app.app_context().push(); u = User.query.filter_by(username='admin').first(); u.set_password('newpass'); db.session.commit(); print('Password reset to: newpass')"
```

---

## 🔧 Troubleshooting

### Problem: "Module not found"

```bash
# Solution: Activate virtual environment
source venv/bin/activate
python reset_password.py
```

### Problem: "Database not found"

```bash
# Solution: Check you're in the right directory
pwd
# Should be: /path/to/codility-tests

# Or for Docker:
cd /volume1/docker/codility-tracker
```

### Problem: "Permission denied"

```bash
# Solution: Use sudo (for Docker)
sudo docker-compose exec web python reset_password.py
```

---

## 🎯 Example Session

Here's what a successful password reset looks like:

```bash
$ python reset_password.py

============================================================
🔐 Password Reset Tool
============================================================

Choose an option:
  1. Reset any user's password (interactive)
  2. Quick reset admin to default (admin123)
  3. List all users
  q. Quit
============================================================

Your choice: 2

⚠️  Quick Reset to Default Password
============================================================
This will reset the 'admin' account password to: admin123
============================================================

Proceed? (y/N): y

✅ Admin password reset to default!

   Username: admin
   Password: admin123

   ⚠️  Change this password after login!
   Login at: http://localhost:8089/login
```

---

## 🛡️ Security Tips

After recovering access:

1. ✅ **Change Password Immediately**
   - Login with recovered password
   - Run reset tool again (option 1)
   - Set a strong new password

2. ✅ **Create Backup Admin**
   - Run: `python create_admin.py`
   - Create a second admin account
   - Different person or backup account

3. ✅ **Use Password Manager**
   - Store passwords securely
   - Enable auto-fill
   - Never lose access again

4. ✅ **Document Recovery Steps**
   - Save this guide somewhere accessible
   - Know how to SSH to your NAS
   - Practice recovery process

---

## 📞 Need More Help?

- **Full Documentation**: See [AUTHENTICATION.md](AUTHENTICATION.md#password-recovery)
- **All Features**: See [FEATURES_SUMMARY.md](FEATURES_SUMMARY.md)
- **Deployment Guide**: See [DEPLOYMENT.md](DEPLOYMENT.md)

---

## ⚡ Quick Commands Reference

| Task | Command |
|------|---------|
| **Reset password (interactive)** | `python reset_password.py` → `1` |
| **Quick admin reset** | `python reset_password.py` → `2` |
| **List all users** | `python reset_password.py` → `3` |
| **Docker reset** | `sudo docker-compose exec web python reset_password.py` |
| **Create new admin** | `python create_admin.py` |
| **Login page** | `http://localhost:8089/login` |

---

## 🎓 Prevention Tips

**Never forget your password again:**

1. Use a password manager (1Password, Bitwarden, LastPass)
2. Write it down and store securely
3. Create multiple admin accounts
4. Test password reset before you need it
5. Document your recovery process

---

**Remember:** Password recovery requires SSH/terminal access to your server. This is a security feature, not a bug! 🔐

---

*Last Updated: November 18, 2025*
