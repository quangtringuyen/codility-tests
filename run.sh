#!/bin/bash

# Codility Training Tracker - Run Script

echo "🚀 Starting Codility Training Tracker..."

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📚 Installing dependencies..."
pip install -q -r requirements.txt

# Create .env if it doesn't exist
if [ ! -f ".env" ]; then
    echo "⚙️  Creating .env file..."
    cp .env.example .env
fi

# Run the app
echo "✅ Starting Flask application..."
echo "📱 Open http://localhost:5000 in your browser"
echo ""
python app.py
