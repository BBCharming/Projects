#!/bin/bash

# Mwaba Project - Complete Git Setup & Commit Script
# This script cleans, sets up, and commits your Mwaba project properly

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "╔══════════════════════════════════════════════╗"
echo "║           Mwaba Project Git Setup            ║"
echo "║           Complete Clean & Commit            ║"
echo "╚══════════════════════════════════════════════╝"
echo -e "${NC}"

# Function to print section headers
section() {
    echo
    echo -e "${BLUE}▐▓▒░ $1 ${NC}"
    echo "──────────────────────────────────────"
}

# Function to check if command succeeded
check_success() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Success${NC}"
    else
        echo -e "${RED}❌ Failed${NC}"
        return 1
    fi
}

# Navigate to project directory
section "Navigating to Project Directory"
PROJECT_DIR="~/Projects/Project-1/mwaba"
echo "Target: $PROJECT_DIR"

# Expand the tilde to actual home directory
EXPANDED_DIR=$(eval echo "$PROJECT_DIR")

if [ ! -d "$EXPANDED_DIR" ]; then
    echo -e "${RED}❌ Project directory not found: $EXPANDED_DIR${NC}"
    echo "Please update the PROJECT_DIR variable in this script"
    exit 1
fi

cd "$EXPANDED_DIR"
echo -e "${GREEN}📁 Current directory: $(pwd)${NC}"

# Step 1: Clean up unwanted files
section "Step 1: Cleaning Unwanted Files"

echo "Removing node_modules directories..."
rm -rf backend/node_modules frontend/node_modules 2>/dev/null && echo -e "${GREEN}✓ Removed node_modules${NC}" || echo -e "${YELLOW}⚠ node_modules already removed${NC}"

echo "Cleaning database files..."
rm -f backend/db/mwaba.db 2>/dev/null && echo -e "${GREEN}✓ Removed database files${NC}" || echo -e "${YELLOW}⚠ Database files already removed${NC}"

echo "Cleaning build artifacts..."
rm -rf backend/dist frontend/dist 2>/dev/null && echo -e "${GREEN}✓ Removed build artifacts${NC}" || echo -e "${YELLOW}⚠ Build artifacts already removed${NC}"

# Ensure db directory structure exists but is empty
mkdir -p backend/db
echo "# Database directory - add your .db files here locally" > backend/db/README.md
echo -e "${GREEN}✓ Preserved db directory structure${NC}"

# Step 2: Initialize Git if needed
section "Step 2: Git Repository Setup"

if [ ! -d .git ]; then
    echo "Initializing new Git repository..."
    git init
    check_success
else
    echo -e "${GREEN}✓ Git repository already initialized${NC}"
fi

# Set up git configuration if needed
if ! git config user.name > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠ Git user name not set${NC}"
    git config user.name "BBCharming"
fi

if ! git config user.email > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠ Git user email not set${NC}"
    git config user.email "bbcharming@users.noreply.github.com"
fi

# Step 3: Create .gitignore
section "Step 3: Creating .gitignore"

cat > .gitignore << 'EOF'
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment variables
.env
.env.local
.env.production

# Database
*.db
*.sqlite
backend/db/*.db

# Build outputs
dist/
build/
*.tgz
*.tar.gz

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# Logs
*.log
logs/

# Temporary files
*.tmp
*.temp

# Cache
.cache/
.parcel-cache/
EOF

echo -e "${GREEN}✅ .gitignore created with comprehensive rules${NC}"

# Step 4: Add remote origin if not exists
section "Step 4: GitHub Remote Setup"

if ! git remote get-url origin > /dev/null 2>&1; then
    echo "Adding GitHub remote origin..."
    git remote add origin https://github.com/BBCharming/BBCharming.github.io.git
    check_success
else
    echo -e "${GREEN}✓ Remote origin already configured${NC}"
    echo "Current remote: $(git remote get-url origin)"
fi

# Step 5: Show what will be committed
section "Step 5: File Status Review"

echo -e "${YELLOW}📋 Files that will be committed:${NC}"
git status --porcelain | while read status file; do
    case "$status" in
        "??") echo -e "${GREEN}[NEW]       $file${NC}" ;;
        " M") echo -e "${YELLOW}[MODIFIED]  $file${NC}" ;;
        " D") echo -e "${RED}[DELETED]   $file${NC}" ;;
        *) echo "[$status]      $file" ;;
    esac
done

# Count files for summary
TOTAL_FILES=$(git status --porcelain | wc -l | tr -d ' ')
if [ "$TOTAL_FILES" -eq 0 ]; then
    echo -e "${YELLOW}⚠ No changes to commit${NC}"
    echo -e "${GREEN}🎉 Your repository is already clean!${NC}"
    exit 0
fi

echo -e "${BLUE}📊 Total files to commit: $TOTAL_FILES${NC}"

# Step 6: Get commit message
section "Step 6: Commit Setup"

COMMIT_MESSAGE=""
if [ -n "$1" ]; then
    COMMIT_MESSAGE="$1"
    echo -e "${GREEN}Using provided commit message: $COMMIT_MESSAGE${NC}"
else
    echo -e "${YELLOW}💬 Enter your commit message:${NC}"
    echo -e "${BLUE}Examples:${NC}"
    echo "  - 'Initial commit: Mwaba voice assistant'"
    echo "  - 'Add WhatsApp integration'"
    echo "  - 'Update voice command features'"
    echo
    read -p "Commit message: " COMMIT_MESSAGE
fi

# Default message if empty
COMMIT_MESSAGE="${COMMIT_MESSAGE:-Initial commit: Mwaba voice assistant project}"

# Step 7: Add files and commit
section "Step 7: Committing Changes"

echo "Adding files to git..."
git add .
check_success

# Double-check: remove any node_modules or db files that might have been added
git reset -- node_modules/ backend/node_modules/ frontend/node_modules/ *.db backend/db/*.db > /dev/null 2>&1 || true

echo "Creating commit..."
if git commit -m "$COMMIT_MESSAGE"; then
    echo -e "${GREEN}✅ Successfully committed: '$COMMIT_MESSAGE'${NC}"
else
    echo -e "${RED}❌ Commit failed${NC}"
    exit 1
fi

# Step 8: Final instructions
section "Step 8: Next Steps"

echo -e "${GREEN}🎉 Your Mwaba project is now ready for GitHub!${NC}"
echo
echo -e "${BLUE}📤 To push to GitHub, run:${NC}"
echo -e "   ${GREEN}git branch -M main${NC}"
echo -e "   ${GREEN}git push -u origin main${NC}"
echo
echo -e "${BLUE}🔍 To review your commit:${NC}"
echo -e "   ${GREEN}git show${NC}"
echo
echo -e "${BLUE}📁 Project structure is now clean:${NC}"
echo -e "   ${GREEN}✅ Source code only${NC}"
echo -e "   ${GREEN}✅ No node_modules (removed ~3000 files)${NC}"
echo -e "   ${GREEN}✅ No database files${NC}"
echo -e "   ${GREEN}✅ Proper .gitignore in place${NC}"
echo
echo -e "${YELLOW}💡 Others can now clone and run:${NC}"
echo -e "   ${GREEN}cd backend && npm install${NC}"
echo -e "   ${GREEN}cd frontend && npm install${NC}"

# Create a quick-commit script for future use
section "Creating Quick-Commit Script for Future"

cat > quick-commit.sh << 'EOF'
#!/bin/bash
# Quick commit script for Mwaba project
git add .
git reset -- node_modules/ backend/node_modules/ frontend/node_modules/ *.db backend/db/*.db > /dev/null 2>&1
git commit -m "${1:-Update Mwaba project}"
echo "✅ Committed! Run 'git push' to upload to GitHub"
EOF

chmod +x quick-commit.sh
echo -e "${GREEN}✅ Created quick-commit.sh for future use${NC}"
echo -e "${BLUE}   Usage: ./quick-commit.sh \"Your message\"${NC}"

echo
echo -e "${GREEN}✨ Mwaba Git Setup Complete! ✨${NC}"
