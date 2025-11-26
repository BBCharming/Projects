#!/bin/bash
# Quick commit script for Mwaba project
git add .
git reset -- node_modules/ backend/node_modules/ frontend/node_modules/ *.db backend/db/*.db > /dev/null 2>&1
git commit -m "${1:-Update Mwaba project}"
echo "✅ Committed! Run 'git push' to upload to GitHub"
