#!/bin/bash

# Codility Tracker - Development Startup Script

echo "🚀 Starting Codility Tracker Development Environment"
echo ""

# Check if we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check dependencies
echo "📋 Checking dependencies..."

if ! command_exists node; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

if ! command_exists npm; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

if ! command_exists python3; then
    echo "❌ Python 3 is not installed. Please install Python 3.8+ first."
    exit 1
fi

echo "✅ All dependencies found"
echo ""

# Install frontend dependencies if needed
if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
    echo "✅ Frontend dependencies installed"
    echo ""
fi

# Create .env for frontend if it doesn't exist
if [ ! -f "frontend/.env" ]; then
    echo "📝 Creating frontend .env file..."
    cp frontend/.env.example frontend/.env
    echo "✅ Frontend .env created"
    echo ""
fi

# Start backend
echo "🐍 Starting Flask backend..."
python3 app.py &
BACKEND_PID=$!
echo "✅ Backend started (PID: $BACKEND_PID)"
echo ""

# Wait a moment for backend to start
sleep 2

# Start frontend
echo "⚛️  Starting React frontend..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..
echo "✅ Frontend started (PID: $FRONTEND_PID)"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 Development environment is ready!"
echo ""
echo "📍 Frontend: http://localhost:5173"
echo "📍 Backend:  http://localhost:8089"
echo ""
echo "Press Ctrl+C to stop both servers"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Trap Ctrl+C and kill both processes
trap "echo ''; echo '🛑 Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT

# Wait for both processes
wait
