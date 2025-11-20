#!/bin/bash
# Quick status check for login setup

echo "======================================"
echo "🔍 Login Setup Status Check"
echo "======================================"
echo ""

# Check venv
if [ -d "venv" ]; then
    echo "✓ Virtual environment exists"
else
    echo "✗ Virtual environment missing"
    echo "  Fix: python -m venv venv"
fi

# Check Flask
if ./venv/bin/pip show Flask >/dev/null 2>&1; then
    echo "✓ Flask installed"
else
    echo "✗ Flask not installed"
    echo "  Fix: pip install -r requirements.txt"
fi

# Check database
if [ -f "instance/codility_progress.db" ]; then
    DB_SIZE=$(ls -lh instance/codility_progress.db | awk '{print $5}')
    echo "✓ Database exists (${DB_SIZE})"

    # Check for admin user
    ADMIN_COUNT=$(sqlite3 instance/codility_progress.db "SELECT COUNT(*) FROM user WHERE username='admin';" 2>/dev/null)
    if [ "$ADMIN_COUNT" = "1" ]; then
        echo "✓ Admin user exists"

        # Show admin details
        echo ""
        echo "Admin User Details:"
        sqlite3 instance/codility_progress.db "SELECT '  Username: ' || username, '  Admin: ' || is_admin, '  Created: ' || created_at FROM user WHERE username='admin';" 2>/dev/null
    else
        echo "✗ Admin user not found"
        echo "  Fix: python create_admin.py"
    fi
else
    echo "✗ Database not found"
    echo "  Fix: python create_admin.py (creates DB and admin)"
fi

echo ""
echo "======================================"
echo "🚀 Ready to Login?"
echo "======================================"

if [ -f "instance/codility_progress.db" ] && [ "$ADMIN_COUNT" = "1" ]; then
    echo ""
    echo "✅ YES! You're ready to login"
    echo ""
    echo "Next steps:"
    echo "  1. Run: ./run_local.sh"
    echo "  2. Open: http://localhost:5000/login"
    echo "  3. Login with:"
    echo "     Username: admin"
    echo "     Password: admin123"
else
    echo ""
    echo "❌ Not quite ready"
    echo ""
    echo "Run this to fix:"
    echo "  ./venv/bin/pip install -r requirements.txt"
    echo "  ./venv/bin/python create_admin.py"
fi

echo ""
