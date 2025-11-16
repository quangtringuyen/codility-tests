#!/usr/bin/env python
"""Test script to verify the application setup"""

import sys
from app import app, db

def test_database():
    """Test database creation and basic operations"""
    print("Testing database setup...")

    with app.app_context():
        try:
            # Create tables
            db.create_all()
            print("✓ Database tables created successfully")

            # Test data models
            from app import DayProgress, TaskProgress
            print("✓ Models imported successfully")

            # Test adding a record
            test_day = DayProgress(week=1, day=1, completed=False)
            db.session.add(test_day)
            db.session.commit()
            print("✓ Test record added successfully")

            # Test querying
            result = DayProgress.query.filter_by(week=1, day=1).first()
            if result:
                print("✓ Test record retrieved successfully")

            # Clean up test record
            db.session.delete(result)
            db.session.commit()
            print("✓ Test record deleted successfully")

            print("\n✅ All database tests passed!")
            return True

        except Exception as e:
            print(f"\n❌ Database test failed: {e}")
            return False

def test_routes():
    """Test basic routes"""
    print("\nTesting routes...")

    with app.test_client() as client:
        try:
            # Test index route
            response = client.get('/')
            if response.status_code == 200:
                print("✓ Index route works")
            else:
                print(f"✗ Index route failed with status {response.status_code}")
                return False

            # Test week view route
            response = client.get('/week/1')
            if response.status_code == 200:
                print("✓ Week view route works")
            else:
                print(f"✗ Week view failed with status {response.status_code}")
                return False

            print("\n✅ All route tests passed!")
            return True

        except Exception as e:
            print(f"\n❌ Route test failed: {e}")
            return False

if __name__ == '__main__':
    print("=" * 50)
    print("Codility Training Tracker - Test Suite")
    print("=" * 50 + "\n")

    db_test = test_database()
    route_test = test_routes()

    if db_test and route_test:
        print("\n" + "=" * 50)
        print("✅ ALL TESTS PASSED!")
        print("=" * 50)
        print("\nYou can now run the app with: python app.py")
        sys.exit(0)
    else:
        print("\n" + "=" * 50)
        print("❌ SOME TESTS FAILED")
        print("=" * 50)
        sys.exit(1)
