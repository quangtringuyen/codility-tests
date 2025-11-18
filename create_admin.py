#!/usr/bin/env python3
"""
Create default admin user for Codility Training Tracker

Run this script to create the default admin account:
    python create_admin.py

Default credentials:
    Username: admin
    Password: admin123

⚠️ IMPORTANT: Change the default password after first login!
"""

from app import app, db, User

def create_admin():
    with app.app_context():
        # Create all tables
        db.create_all()

        # Check if admin user already exists
        existing_admin = User.query.filter_by(username='admin').first()

        if existing_admin:
            print("✓ Admin user already exists")
            print(f"  Username: {existing_admin.username}")
            print(f"  Created: {existing_admin.created_at}")

            # Ask if we should reset the password
            reset = input("\n  Reset password to 'admin123'? (y/N): ")
            if reset.lower() == 'y':
                existing_admin.set_password('admin123')
                db.session.commit()
                print("✓ Password reset successfully!")
            else:
                print("  Password unchanged")
        else:
            # Create new admin user
            admin = User(username='admin', is_admin=True)
            admin.set_password('admin123')

            db.session.add(admin)
            db.session.commit()

            print("✓ Admin user created successfully!")
            print("\n  Credentials:")
            print("  Username: admin")
            print("  Password: admin123")
            print("\n  ⚠️  IMPORTANT: Change this password after first login!")
            print("  🔗 Login at: http://localhost:8089/login")

if __name__ == '__main__':
    create_admin()
