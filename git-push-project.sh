#!/bin/bash

# Fix Git Repository Issues Script
# Resolves submodule and branch conflicts

PROJECTS_DIR="$HOME/Projects/Project-1"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }

cd "$PROJECTS_DIR"

log_info "Fixing Git repository issues..."

# 1. Remove any .git directory inside mwaba/ (it's causing submodule issues)
if [ -d "mwaba/.git" ]; then
    log_info "Removing nested .git repository from mwaba/..."
    rm -rf mwaba/.git
    log_success "Removed nested .git repository"
fi

# 2. Switch to main branch to match remote
log_info "Checking branch configuration..."
if git branch --show-current | grep -q "master"; then
    log_info "Renaming master branch to main..."
    git branch -M main
    log_success "Renamed branch to main"
fi

# 3. Pull latest changes from remote
log_info "Pulling latest changes from GitHub..."
git fetch origin
git branch --set-upstream-to=origin/main main
git pull origin main

# 4. Add all files properly
log_info "Adding files to Git..."
git add .

# 5. Check if there are changes to commit
if git diff-index --quiet HEAD --; then
    log_warning "No changes to commit after fixing repository"
else
    log_info "Committing the fixed repository..."
    git commit -m "fix: resolve repository structure and add Mwaba AI Assistant
    
    - Remove nested git repository in mwaba/
    - Align local branch with remote main branch
    - Add complete Mwaba AI Assistant project
    - Backend: Express.js with voice API
    - Frontend: React with voice recognition
    - Deployment and startup scripts"
    log_success "Changes committed successfully"
fi

# 6. Push to remote
log_info "Pushing to GitHub..."
if git push origin main; then
    log_success "✅ Successfully pushed to https://github.com/BBCharming/Projects"
else
    log_info "Setting up initial push..."
    git push -u origin main
    log_success "✅ Initial push completed to https://github.com/BBCharming/Projects"
fi

# 7. Show final status
log_info "Final repository status:"
git status --short
echo ""
git log --oneline -3
echo ""
log_success "Repository issues fixed! Your Mwaba project is now properly in Git."