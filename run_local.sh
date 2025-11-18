#!/bin/bash
# Run Codility Training Tracker locally with SQLite

# Unset DATABASE_URL to use SQLite instead of PostgreSQL
unset DATABASE_URL

# Activate virtual environment
source venv/bin/activate

# Set Flask environment to development for local use
export FLASK_ENV=development
export DATABASE_URL=sqlite:///codility_progress.db

# Run the Flask application
python app.py
