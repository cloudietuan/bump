#!/usr/bin/env bash
# One-step publish for the Bump prototype.
# Usage:  ./push.sh your-github-username
set -euo pipefail

USER="${1:-}"
if [ -z "$USER" ]; then
  echo "Usage: ./push.sh your-github-username"
  echo "Create an empty PUBLIC repo named 'bump' on github.com first."
  exit 1
fi

if [ -f .mcp.json ]; then
  echo "Refusing to run: .mcp.json is in this folder and holds an API token."
  echo "Move it somewhere else, then try again."
  exit 1
fi

git init -q
git add .
git commit -q -m "Bump: interactive volleyball accessibility prototype"
git branch -M main
git remote add origin "https://github.com/${USER}/bump.git" 2>/dev/null || \
  git remote set-url origin "https://github.com/${USER}/bump.git"
git push -u origin main

echo
echo "Pushed. Now enable Pages:"
echo "  https://github.com/${USER}/bump/settings/pages"
echo "  Source: Deploy from a branch -> main -> / (root)"
echo "Live in about a minute at https://${USER}.github.io/bump/"
