#!/bin/bash
# Setup script for auto-deployment
# This script configures Git hooks and permissions

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo ""
echo "============================================================"
echo "🔧 Auto-Deploy Setup"
echo "============================================================"
echo ""

# Check if Git repository
if [ ! -d ".git" ]; then
    echo "❌ Not a Git repository. Run 'git init' first."
    exit 1
fi

echo -e "${BLUE}ℹ️  Setting up auto-deployment...${NC}"
echo ""

# Make deploy script executable
if [ -f "deploy.sh" ]; then
    chmod +x deploy.sh
    echo "✓ Made deploy.sh executable"
else
    echo "⚠️  deploy.sh not found"
fi

# Create .git/hooks directory if it doesn't exist
mkdir -p .git/hooks

# Copy post-merge hook
if [ -f "git-hooks/post-merge" ]; then
    cp git-hooks/post-merge .git/hooks/post-merge
    chmod +x .git/hooks/post-merge
    echo "✓ Installed post-merge hook"
else
    echo "⚠️  git-hooks/post-merge not found"
fi

# Copy post-checkout hook (optional)
if [ -f "git-hooks/post-checkout" ]; then
    cp git-hooks/post-checkout .git/hooks/post-checkout
    chmod +x .git/hooks/post-checkout
    echo "✓ Installed post-checkout hook"
fi

echo ""
echo -e "${GREEN}✅ Auto-deploy setup complete!${NC}"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "How it works:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. When you run 'git pull', the post-merge hook triggers"
echo "2. The hook checks which files changed"
echo "3. If code/config files changed, it runs deploy.sh"
echo "4. Your application automatically rebuilds and restarts"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Test it:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  git pull origin main"
echo "  # Auto-deployment will run automatically!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Manual deployment:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  ./deploy.sh"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
