#!/bin/bash
# Remove .git/index.lock file if it exists

if [ -f .git/index.lock ]; then
  rm .git/index.lock
  echo "✓ Removed .git/index.lock"
  exit 0
else
  echo "✗ .git/index.lock not found"
  exit 1
fi
