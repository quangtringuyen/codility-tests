#!/usr/bin/env python3
"""
Password Reset Tool for Codility Training Tracker

This script allows you to reset a user's password manually.
Useful when you forget your password and need to recover access.

Usage:
    python reset_password.py

The script will:
1. Show all users in the database
2. Let you select which user to reset
3. Prompt for new password
4. Update the password with proper hashing
"""

from app import app, db, User
from getpass import getpass

def list_users():
    """Display all users in the database"""
    users = User.query.all()

    if not users:
        print("❌ No users found in database!")
        print("   Run 'python create_admin.py' to create an admin user.")
        return []

    print("\n" + "="*60)
    print("📋 Users in Database")
    print("="*60)

    for idx, user in enumerate(users, 1):
        admin_badge = "👑 ADMIN" if user.is_admin else "👤 USER"
        print(f"\n{idx}. {user.username}")
        print(f"   Status: {admin_badge}")
        print(f"   Created: {user.created_at}")

    print("\n" + "="*60)
    return users

def reset_password():
    """Interactive password reset"""
    with app.app_context():
        print("\n🔐 Password Reset Tool")
        print("="*60)

        # List all users
        users = list_users()

        if not users:
            return

        # Select user
        while True:
            try:
                choice = input(f"\nSelect user number (1-{len(users)}) or 'q' to quit: ").strip()

                if choice.lower() == 'q':
                    print("\n👋 Exiting...")
                    return

                user_idx = int(choice) - 1

                if 0 <= user_idx < len(users):
                    selected_user = users[user_idx]
                    break
                else:
                    print(f"❌ Invalid choice. Please enter 1-{len(users)}")

            except ValueError:
                print("❌ Invalid input. Please enter a number.")

        # Confirm selection
        print(f"\n✓ Selected user: {selected_user.username}")
        confirm = input("  Reset password for this user? (y/N): ").strip().lower()

        if confirm != 'y':
            print("\n❌ Password reset cancelled.")
            return

        # Get new password
        print("\n🔑 Enter new password")
        print("   (Password strength requirements: minimum 6 characters recommended)")

        while True:
            password1 = getpass("   New password: ")

            if len(password1) < 6:
                print("   ⚠️  Password too short. Use at least 6 characters.")
                continue

            password2 = getpass("   Confirm password: ")

            if password1 != password2:
                print("   ❌ Passwords don't match. Try again.\n")
                continue

            break

        # Update password
        try:
            selected_user.set_password(password1)
            db.session.commit()

            print("\n" + "="*60)
            print("✅ Password reset successfully!")
            print("="*60)
            print(f"\n   Username: {selected_user.username}")
            print(f"   New password: {'*' * len(password1)}")
            print(f"\n   You can now login at: http://localhost:8089/login")
            print("="*60)

        except Exception as e:
            db.session.rollback()
            print(f"\n❌ Error resetting password: {str(e)}")

def quick_reset_admin():
    """Quick reset for admin user to default password"""
    with app.app_context():
        admin = User.query.filter_by(username='admin').first()

        if not admin:
            print("❌ Admin user not found!")
            print("   Run 'python create_admin.py' first.")
            return

        print("\n⚠️  Quick Reset to Default Password")
        print("="*60)
        print("This will reset the 'admin' account password to: admin123")
        print("="*60)

        confirm = input("\nProceed? (y/N): ").strip().lower()

        if confirm == 'y':
            admin.set_password('admin123')
            db.session.commit()

            print("\n✅ Admin password reset to default!")
            print("\n   Username: admin")
            print("   Password: admin123")
            print("\n   ⚠️  Change this password after login!")
            print("   Login at: http://localhost:8089/login")
        else:
            print("\n❌ Reset cancelled.")

def main():
    """Main menu"""
    print("\n" + "="*60)
    print("🔐 Password Reset Tool")
    print("="*60)
    print("\nChoose an option:")
    print("  1. Reset any user's password (interactive)")
    print("  2. Quick reset admin to default (admin123)")
    print("  3. List all users")
    print("  q. Quit")
    print("="*60)

    choice = input("\nYour choice: ").strip().lower()

    if choice == '1':
        reset_password()
    elif choice == '2':
        quick_reset_admin()
    elif choice == '3':
        with app.app_context():
            list_users()
    elif choice == 'q':
        print("\n👋 Goodbye!")
    else:
        print("\n❌ Invalid choice!")
        main()

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n👋 Interrupted. Goodbye!")
    except Exception as e:
        print(f"\n❌ Unexpected error: {str(e)}")
