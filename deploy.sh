#!/bin/bash
# Auto-deployment script for Codility Training Tracker
# This script rebuilds and restarts the application after code changes

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Print banner
echo ""
echo "============================================================"
echo "🚀 Codility Training Tracker - Auto Deploy"
echo "============================================================"
echo ""

# Check if running in Docker environment
if [ -f "docker-compose.yml" ]; then
    DEPLOY_TYPE="docker"
    print_info "Detected Docker deployment"
elif [ -d "venv" ] || [ -n "$VIRTUAL_ENV" ]; then
    DEPLOY_TYPE="local"
    print_info "Detected local deployment"
else
    print_warning "Deployment type unclear, assuming local"
    DEPLOY_TYPE="local"
fi

# Function to deploy with Docker
deploy_docker() {
    print_info "Starting Docker deployment..."

    # Check if docker-compose is available
    if ! command -v docker-compose &> /dev/null; then
        print_error "docker-compose not found!"
        exit 1
    fi

    # Stop containers gracefully
    print_info "Stopping containers..."
    docker-compose stop

    # Pull latest images if needed
    print_info "Pulling latest base images..."
    docker-compose pull --ignore-pull-failures || true

    # Rebuild containers
    print_info "Rebuilding containers..."
    docker-compose build --no-cache

    # Start containers
    print_info "Starting containers..."
    docker-compose up -d

    # Wait for services to be healthy
    print_info "Waiting for services to start..."
    sleep 5

    # Check container status
    print_info "Checking container status..."
    docker-compose ps

    # Show logs
    print_info "Recent logs:"
    docker-compose logs --tail=20

    print_success "Docker deployment complete!"
}

# Function to deploy locally
deploy_local() {
    print_info "Starting local deployment..."

    # Activate virtual environment if it exists
    if [ -d "venv" ]; then
        print_info "Activating virtual environment..."
        source venv/bin/activate
    fi

    # Install/update dependencies
    print_info "Installing dependencies..."
    pip install -r requirements.txt --quiet

    # Run database migrations
    print_info "Running database migrations..."
    python -c "from app import app, db; app.app_context().push(); db.create_all(); print('✓ Database updated')"

    # Check if application is running
    if pgrep -f "python app.py" > /dev/null; then
        print_info "Restarting application..."
        pkill -f "python app.py"
        sleep 2
    fi

    # Start application in background
    print_info "Starting application..."
    nohup python app.py > app.log 2>&1 &
    APP_PID=$!

    # Wait a moment for startup
    sleep 3

    # Check if app started successfully
    if ps -p $APP_PID > /dev/null; then
        print_success "Application started (PID: $APP_PID)"
    else
        print_error "Application failed to start. Check app.log for details."
        exit 1
    fi

    print_success "Local deployment complete!"
}

# Main deployment logic
case $DEPLOY_TYPE in
    docker)
        deploy_docker
        ;;
    local)
        deploy_local
        ;;
    *)
        print_error "Unknown deployment type: $DEPLOY_TYPE"
        exit 1
        ;;
esac

# Final success message
echo ""
echo "============================================================"
print_success "Deployment successful! 🎉"
echo "============================================================"
echo ""

# Show access information
if [ "$DEPLOY_TYPE" = "docker" ]; then
    print_info "Access your application at: http://localhost:8089"
else
    print_info "Access your application at: http://localhost:5000"
fi

echo ""
print_info "To view logs:"
if [ "$DEPLOY_TYPE" = "docker" ]; then
    echo "  docker-compose logs -f"
else
    echo "  tail -f app.log"
fi

echo ""
