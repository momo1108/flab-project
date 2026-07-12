---
name: cleanup-git-lock
description: Remove .git/index.lock file that may be blocking git operations
---

# Git Index Lock Cleanup

Removes the `.git/index.lock` file that may be left from interrupted git operations.

## Usage

This skill removes `.git/index.lock`:

```bash
bash .claude/skills/cleanup-git-lock/scripts/cleanup-index-lock.sh
```

## When to Use

- Git operations fail with "index.lock" errors
- A previous git command was interrupted
- Before retrying failed commit/push operations

## Script

!`bash .claude/skills/cleanup-git-lock/scripts/cleanup-index-lock.sh`
