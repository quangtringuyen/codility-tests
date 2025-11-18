# 🔐 Authentication System Guide

Complete guide to the authentication system in Codility Training Tracker.

## 📋 Overview

The authentication system protects edit functionality and ensures only authorized users can modify lesson content. It uses Flask-Login for session management and Werkzeug for password hashing.

## 🎯 Features

### **User Authentication**
- Secure login/logout functionality
- Session-based authentication
- Password hashing with Werkzeug
- "Remember me" functionality

### **Role-Based Access Control**
- **Admin Users**: Can edit lessons and manage content
- **Regular Users**: Can view all content but cannot edit (future feature)

### **Protected Routes**
- Edit lesson endpoint requires admin authentication
- Save lesson endpoint requires admin authentication
- Other routes remain publicly accessible

## 🚀 Quick Start

### **Step 1: Install Dependencies**

The authentication system requires additional packages:

```bash
pip install Flask-Login==0.6.3 werkzeug==3.0.1
```

Or install from requirements.txt:
```bash
pip install -r requirements.txt
```

### **Step 2: Create Admin User**

Run the setup script to create the default admin account:

```bash
python create_admin.py
```

This creates:
- Username: `admin`
- Password: `admin123`
- Admin privileges: `True`

### **Step 3: Login**

1. Navigate to `http://localhost:8089/login`
2. Enter credentials:
   - Username: `admin`
   - Password: `admin123`
3. Click "Login"

### **Step 4: Change Default Password** (IMPORTANT!)

⚠️ **Security Warning**: The default password is publicly known. Change it immediately!

#### **Method 1: Using Password Reset Tool (Recommended)**

```bash
python reset_password.py
```

Then:
1. Choose option 1 (Reset any user's password)
2. Select the admin user
3. Enter your new secure password
4. Confirm the password

#### **Method 2: Using Python Console**

```python
from app import app, db, User

with app.app_context():
    admin = User.query.filter_by(username='admin').first()
    admin.set_password('your-new-secure-password')
    db.session.commit()
    print("Password changed successfully!")
```

## 🔧 How It Works

### **User Model**

Located in [app.py](app.py:24):

```python
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, password):
        """Hash and store password"""
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        """Verify password against hash"""
        return check_password_hash(self.password_hash, password)
```

**Fields:**
- `id` - Primary key
- `username` - Unique username (required)
- `password_hash` - Hashed password (never stored in plain text)
- `is_admin` - Boolean flag for admin privileges
- `created_at` - Account creation timestamp

### **Admin Required Decorator**

Located in [app.py](app.py:59):

```python
def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not current_user.is_authenticated or not current_user.is_admin:
            return jsonify({'success': False, 'error': 'Admin access required'}), 403
        return f(*args, **kwargs)
    return decorated_function
```

**Usage:**
```python
@app.route('/api/save_lesson', methods=['POST'])
@admin_required
def save_lesson():
    # Only admins can access this route
    ...
```

### **Login Route**

Located in [app.py](app.py:424):

```python
@app.route('/login', methods=['GET', 'POST'])
def login():
    """User login"""
    if current_user.is_authenticated:
        return redirect(url_for('index'))

    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')

        user = User.query.filter_by(username=username).first()

        if user and user.check_password(password):
            login_user(user, remember=True)
            flash('Logged in successfully!', 'success')
            next_page = request.args.get('next')
            return redirect(next_page or url_for('index'))
        else:
            flash('Invalid username or password', 'error')

    return render_template('login.html')
```

**Features:**
- Redirects if already logged in
- Validates credentials
- Uses "remember me" for persistent sessions
- Flash messages for feedback
- Supports `?next=` redirect parameter

### **Logout Route**

Located in [app.py](app.py:446):

```python
@app.route('/logout')
@login_required
def logout():
    """User logout"""
    logout_user()
    flash('Logged out successfully!', 'success')
    return redirect(url_for('index'))
```

### **Protected Edit Endpoints**

```python
@app.route('/api/save_lesson', methods=['POST'])
@admin_required
def save_lesson():
    """Save edited lesson content - Admin only"""
    ...
```

**Security:**
- Returns 403 if not authenticated
- Returns 403 if not admin
- Validates lesson file path
- Prevents directory traversal

## 🎨 UI Integration

### **Navigation Bar**

The navigation shows different options based on login state:

**Logged Out:**
```html
<a href="{{ url_for('login') }}">Login</a>
```

**Logged In:**
```html
<span class="nav-user">👤 {{ current_user.username }}</span>
<a href="{{ url_for('logout') }}">Logout</a>
```

### **Edit Button Visibility**

The edit button only appears for admin users:

```html
{% if current_user.is_authenticated and current_user.is_admin %}
<button id="toggleEditBtn" class="toggle-edit-btn">
    <span class="edit-icon">✏️</span>
    <span class="edit-text">Edit</span>
</button>
{% endif %}
```

### **Flash Messages**

Success and error messages appear at the top of pages:

```html
{% with messages = get_flashed_messages(with_categories=true) %}
    {% if messages %}
        <div class="flash-messages">
            {% for category, message in messages %}
                <div class="flash-message flash-{{ category }}">
                    <span>{{ message }}</span>
                    <button class="flash-close" onclick="this.parentElement.remove()">✕</button>
                </div>
            {% endfor %}
        </div>
    {% endif %}
{% endwith %}
```

**Message Types:**
- `success` - Green background
- `error` - Red background
- `info` - Blue background
- `warning` - Orange background

## 📊 Database Schema

### **User Table**

```sql
CREATE TABLE user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(80) NOT NULL UNIQUE,
    password_hash VARCHAR(200) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Example Data:**
```sql
INSERT INTO user (username, password_hash, is_admin, created_at)
VALUES ('admin', 'pbkdf2:sha256:...', TRUE, '2025-11-18 10:00:00');
```

## 🔒 Security Features

### **1. Password Hashing**

Passwords are never stored in plain text:

```python
# When setting password
user.set_password('mypassword')
# Stores: pbkdf2:sha256:260000$abc123def...

# When checking password
user.check_password('mypassword')  # True
user.check_password('wrongpass')   # False
```

**Algorithm:** PBKDF2 with SHA256
**Iterations:** 260,000 (werkzeug default)
**Salt:** Automatically generated per password

### **2. Session Management**

- Sessions use Flask's SECRET_KEY for signing
- Cookies are HttpOnly (not accessible via JavaScript)
- "Remember me" extends session duration
- Automatic session expiry

### **3. Input Validation**

```python
# Prevent directory traversal
if '..' in lesson_file or not lesson_file.endswith('.md'):
    return jsonify({'error': 'Invalid lesson file'}), 400
```

### **4. CSRF Protection**

Flask-WTF can be added for CSRF tokens (optional enhancement):

```python
# Future enhancement
from flask_wtf import CSRFProtect
csrf = CSRFProtect(app)
```

## 🛠️ Administration Tasks

### **Create New Admin User**

```python
from app import app, db, User

with app.app_context():
    new_admin = User(username='newadmin', is_admin=True)
    new_admin.set_password('secure-password')
    db.session.add(new_admin)
    db.session.commit()
    print("Admin user created!")
```

### **Reset User Password**

```python
from app import app, db, User

with app.app_context():
    user = User.query.filter_by(username='admin').first()
    if user:
        user.set_password('new-password')
        db.session.commit()
        print("Password reset!")
    else:
        print("User not found")
```

### **List All Users**

```python
from app import app, db, User

with app.app_context():
    users = User.query.all()
    for user in users:
        print(f"Username: {user.username}")
        print(f"  Admin: {user.is_admin}")
        print(f"  Created: {user.created_at}")
        print()
```

### **Remove Admin Privileges**

```python
from app import app, db, User

with app.app_context():
    user = User.query.filter_by(username='someuser').first()
    if user:
        user.is_admin = False
        db.session.commit()
        print("Admin privileges removed")
```

### **Delete User**

```python
from app import app, db, User

with app.app_context():
    user = User.query.filter_by(username='olduser').first()
    if user:
        db.session.delete(user)
        db.session.commit()
        print("User deleted")
```

## 🐛 Troubleshooting

### **Issue: Can't Login**

**Symptom:** Login page shows "Invalid username or password"

**Solutions:**
1. Verify admin user exists:
   ```bash
   python create_admin.py
   ```

2. Check credentials:
   - Default username: `admin`
   - Default password: `admin123`

3. Reset password:
   ```python
   python create_admin.py
   # Choose 'y' to reset password
   ```

### **Issue: Edit Button Not Showing**

**Symptom:** Edit button doesn't appear on lesson pages

**Solutions:**
1. Verify you're logged in (check for username in navbar)
2. Verify user has admin privileges:
   ```python
   from app import app, db, User
   with app.app_context():
       user = User.query.filter_by(username='admin').first()
       print(f"Is admin: {user.is_admin}")
   ```

3. Check browser console for JavaScript errors

### **Issue: "403 Forbidden" When Saving**

**Symptom:** Save button shows "Admin access required" error

**Solutions:**
1. Confirm you're logged in as admin
2. Check session hasn't expired (log out and log back in)
3. Verify `is_admin` flag in database

### **Issue: Flash Messages Not Appearing**

**Symptom:** No success/error messages after login/logout

**Solutions:**
1. Check that base.html includes flash message template
2. Verify CSS is loaded correctly
3. Check browser developer tools for styling issues

### **Issue: Database Errors**

**Symptom:** "Table user doesn't exist" or similar

**Solutions:**
1. Run database migrations:
   ```python
   from app import app, db
   with app.app_context():
       db.create_all()
   ```

2. If using Docker, rebuild containers:
   ```bash
   docker-compose down
   docker-compose up -d --build
   ```

## 📝 Usage Examples

### **Example 1: Admin Workflow**

1. **Login**
   - Navigate to `/login`
   - Enter admin credentials
   - Redirected to dashboard

2. **Edit Lesson**
   - Go to any lesson
   - Click ✏️ Edit button (visible only to admins)
   - Make changes
   - Save with Ctrl/Cmd + S

3. **Logout**
   - Click "Logout" in navigation
   - Redirected to homepage

### **Example 2: Access Control**

```python
# Try to access edit endpoint without login
response = requests.post('/api/save_lesson', json={...})
# Returns: 403 Forbidden

# Login as admin
session = requests.Session()
session.post('/login', data={'username': 'admin', 'password': 'admin123'})

# Now can access edit endpoint
response = session.post('/api/save_lesson', json={...})
# Returns: 200 OK
```

### **Example 3: Creating Multiple Users**

```python
from app import app, db, User

with app.app_context():
    # Create admin
    admin = User(username='admin', is_admin=True)
    admin.set_password('admin-password')
    db.session.add(admin)

    # Create editor (admin)
    editor = User(username='editor', is_admin=True)
    editor.set_password('editor-password')
    db.session.add(editor)

    # Create viewer (future feature - no admin)
    # viewer = User(username='viewer', is_admin=False)
    # viewer.set_password('viewer-password')
    # db.session.add(viewer)

    db.session.commit()
    print("Users created!")
```

## 🔑 Password Recovery

### **Forgot Password? Here's How to Recover**

Since this is a self-hosted application (typically on NAS without email), we provide a **manual password reset tool** instead of email-based recovery.

#### **Option 1: Password Reset Tool** (Recommended)

Use the interactive password reset script:

```bash
python reset_password.py
```

**Interactive Menu:**
```
🔐 Password Reset Tool
============================================================
Choose an option:
  1. Reset any user's password (interactive)
  2. Quick reset admin to default (admin123)
  3. List all users
  q. Quit
============================================================
```

#### **Detailed Steps:**

**Method A: Interactive Reset (Secure)**

1. Run the reset tool:
   ```bash
   python reset_password.py
   ```

2. Choose option `1` (Reset any user's password)

3. You'll see all users:
   ```
   📋 Users in Database
   ============================================================

   1. admin
      Status: 👑 ADMIN
      Created: 2025-11-18 10:00:00

   2. editor
      Status: 👑 ADMIN
      Created: 2025-11-18 11:00:00
   ============================================================
   ```

4. Select user number (e.g., `1` for admin)

5. Confirm the selection (`y`)

6. Enter new password (minimum 6 characters)

7. Confirm password

8. Success! You can now login with the new password

**Method B: Quick Admin Reset (Fast)**

If you just need to reset the admin account to default:

1. Run the reset tool:
   ```bash
   python reset_password.py
   ```

2. Choose option `2` (Quick reset admin to default)

3. Confirm (`y`)

4. Admin password is now reset to: `admin123`

5. Login and change it again!

#### **Option 2: Docker Environment**

If deployed with Docker:

```bash
# SSH into your NAS
ssh admin@YOUR_NAS_IP

# Navigate to project directory
cd /volume1/docker/codility-tracker

# Run password reset inside container
sudo docker-compose exec web python reset_password.py
```

Follow the interactive prompts as above.

#### **Option 3: Manual Database Update**

For advanced users, directly update via Python:

```bash
# Start Python shell
python

# Then run:
>>> from app import app, db, User
>>> with app.app_context():
...     user = User.query.filter_by(username='admin').first()
...     user.set_password('new-secure-password')
...     db.session.commit()
...     print("Password updated!")
```

Or as a one-liner:

```bash
python -c "from app import app, db, User; app.app_context().push(); u = User.query.filter_by(username='admin').first(); u.set_password('newpass'); db.session.commit(); print('Done!')"
```

#### **Option 4: Database Direct Access**

**Last resort** - direct database manipulation:

**For SQLite:**
```bash
sqlite3 codility_progress.db
```

**For PostgreSQL:**
```bash
# If using Docker
docker-compose exec postgres psql -U admin -d codility_tracker

# Then in psql:
SELECT id, username, is_admin FROM "user";
-- Note: You can't easily set passwords this way due to hashing
-- Use Python methods above instead
```

### **Recovery Workflow Flowchart**

```
Forgot Password?
        ↓
Do you have SSH/terminal access?
        ↓
    Yes → Run: python reset_password.py
        ↓
    Choose option 1 or 2
        ↓
    Follow interactive prompts
        ↓
    ✓ Password reset!
        ↓
    Login with new password

        ↓
    No → Contact system administrator
        ↓
    Admin runs reset tool
        ↓
    ✓ Password reset!
```

### **Security Considerations**

⚠️ **Important Security Notes:**

1. **Physical Access Required**: Password reset requires terminal/SSH access to the server
   - This is intentional for security
   - Prevents unauthorized password resets
   - Similar to server admin privileges

2. **No Email Recovery**:
   - Email-based recovery not implemented (self-hosted environment)
   - Would require SMTP configuration
   - Manual reset is more appropriate for NAS deployment

3. **Audit Trail**:
   - Password resets are not logged (future enhancement)
   - Consider manually noting password changes

4. **Multiple Admins**:
   - Create multiple admin accounts
   - If one forgets password, another can help
   - Better than single point of failure

### **Preventing Lockout**

**Best Practices:**

1. ✅ **Create Multiple Admin Accounts**
   ```bash
   python create_admin.py
   # Create accounts for multiple people
   ```

2. ✅ **Document Passwords Securely**
   - Use a password manager
   - Store encrypted backups
   - Keep recovery information safe

3. ✅ **Test Password Reset Process**
   - Practice resetting passwords
   - Ensure you know how to use the tool
   - Verify SSH access works

4. ✅ **Regular Backups**
   - Backup the database regularly
   - Keep database credentials documented
   - Test restore procedures

### **Common Issues**

#### **Issue: Can't Run reset_password.py**

**Error:** `ModuleNotFoundError: No module named 'app'`

**Solution:**
```bash
# Ensure you're in the project directory
cd /path/to/codility-tests

# Activate virtual environment if used
source venv/bin/activate

# Run script
python reset_password.py
```

#### **Issue: Database Not Found**

**Error:** `Database file not found`

**Solution:**
```bash
# Check database exists
ls -la *.db

# Or for PostgreSQL, check it's running
docker-compose ps
```

#### **Issue: Permission Denied (Docker)**

**Error:** `Permission denied`

**Solution:**
```bash
# Use sudo for docker-compose
sudo docker-compose exec web python reset_password.py
```

#### **Issue: User Not Found**

**Error:** `Admin user not found`

**Solution:**
```bash
# Create admin user first
python create_admin.py

# Or inside Docker
sudo docker-compose exec web python create_admin.py
```

### **Example Recovery Session**

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

Your choice: 1

============================================================
📋 Users in Database
============================================================

1. admin
   Status: 👑 ADMIN
   Created: 2025-11-18 10:00:00
============================================================

Select user number (1-1) or 'q' to quit: 1

✓ Selected user: admin
  Reset password for this user? (y/N): y

🔑 Enter new password
   (Password strength requirements: minimum 6 characters recommended)
   New password: ******
   Confirm password: ******

============================================================
✅ Password reset successfully!
============================================================

   Username: admin
   New password: ******

   You can now login at: http://localhost:8089/login
============================================================
```

## 🔄 Future Enhancements

Potential improvements to the authentication system:

- [ ] **User Registration**: Allow self-service account creation
- [ ] **Password Change Page**: Web interface for changing passwords
- [ ] **Email Verification**: Verify email addresses on signup
- [x] **Password Reset**: Manual reset tool with interactive CLI ✓
- [ ] **Email-Based Password Reset**: Token-based recovery via email (requires SMTP)
- [ ] **Security Questions**: Alternative recovery method
- [ ] **Two-Factor Authentication**: TOTP-based 2FA
- [ ] **User Roles**: More granular permissions (editor, viewer, admin)
- [ ] **Activity Logging**: Track login attempts and edits
- [ ] **Session Management**: View and revoke active sessions
- [ ] **Password Requirements**: Enforce strong password policies
- [ ] **Account Lockout**: Prevent brute force attacks
- [ ] **CSRF Protection**: Add Flask-WTF CSRF tokens
- [ ] **API Keys**: Token-based authentication for API access
- [ ] **Password History**: Prevent reusing old passwords
- [ ] **Password Expiry**: Force periodic password changes

## 📚 Files Modified/Created

### **New Files**
1. [create_admin.py](create_admin.py:1) - Admin user creation script
2. [templates/login.html](templates/login.html:1) - Login page
3. [AUTHENTICATION.md](AUTHENTICATION.md:1) - This documentation

### **Modified Files**
1. [app.py](app.py:1) - Added User model, auth routes, decorators
2. [requirements.txt](requirements.txt:1) - Added Flask-Login, Werkzeug
3. [templates/base.html](templates/base.html:1) - Added login/logout links, flash messages
4. [templates/lesson_view.html](templates/lesson_view.html:13) - Conditional edit button
5. [static/css/style.css](static/css/style.css:139) - Flash message and user nav styles

## 🎓 Best Practices

### **Security**
1. ✅ Always hash passwords (never store plain text)
2. ✅ Use strong SECRET_KEY (generate with `secrets.token_hex(32)`)
3. ✅ Change default admin password immediately
4. ✅ Use HTTPS in production
5. ✅ Keep dependencies updated
6. ✅ Validate all user inputs
7. ✅ Use environment variables for secrets

### **User Management**
1. ✅ Create unique usernames for each person
2. ✅ Use strong, unique passwords
3. ✅ Grant admin only when necessary
4. ✅ Remove accounts when no longer needed
5. ✅ Regularly audit user accounts
6. ✅ Monitor login activity

### **Development**
1. ✅ Test authentication flows thoroughly
2. ✅ Handle edge cases (expired sessions, etc.)
3. ✅ Provide clear error messages
4. ✅ Log authentication events
5. ✅ Use decorators for protected routes
6. ✅ Keep authentication logic separate

## 📊 Summary

The authentication system provides:

✅ **Secure Login** - Password hashing, session management
✅ **Access Control** - Admin-only edit functionality
✅ **User Interface** - Login page, navigation integration
✅ **Flash Messages** - Success/error feedback
✅ **Easy Setup** - One-command admin creation
✅ **Documentation** - Complete usage guide

**Default Credentials:**
- Username: `admin`
- Password: `admin123`
- ⚠️ **Change immediately after first login!**

**Quick Start:**
```bash
# Install dependencies
pip install -r requirements.txt

# Create admin user
python create_admin.py

# Run application
python app.py

# Login at http://localhost:8089/login
```

Happy authenticating! 🔐
