---
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git commit:*), Bash(git log:*), Bash(git branch:*), Bash(git diff:*)
description: Generate a convention-aligned git commit message and run the commit
---

## Execution Mode

- Default: perform the actual commit
- Exception: use message-only mode only when `/commit msg` is explicitly used

Mode rules:

- Switch to message-only mode only when the `msg` option is explicitly present.
- Do not interpret natural-language phrases such as "message only" or "dry-run" as mode switches.
- If `msg` is absent, always perform the actual commit.

## Check Current State

- Current branch: !`git branch --show-current`
- Working tree changes: !`git diff --stat`
- Staged files: !`git diff --cached --stat`

## Review Recent Commits

Use recent commit titles and bodies to match the tone and level of detail.

- Inspect recent commits: !`git log -n 10 --pretty=format:"%h %s%n%b%n---"`

## Staging Policy

- Default: stage all modified files before committing. !`git add -A`
- Exception: stage only the requested paths when the user explicitly limits the commit scope.

## Commit Message Rules

Write commit messages using these types:

- `feat`: add a new feature. Example: `feat(auth): add login flow`
- `fix`: fix a bug. Example: `fix(api): resolve user lookup error`
- `docs`: update documentation such as README or comments. Example: `docs(readme): add setup steps`
- `refactor`: improve code structure without changing behavior. Example: `refactor(utils): extract shared helper`
- `test`: add or update tests. Example: `test(login): add login unit tests`
- `chore`: update project configuration or build-related settings. Example: `chore(webpack): add bundle config`

## Workflow

1. Analyze the changes.
2. Decide the staging scope.

- If the user specified files or folders, stage only those paths.
- If the user did not specify a scope, stage everything. !`git add -A`

3. Verify staging before committing.

- Staging summary: !`git diff --cached --stat`
- Staged items: !`git status --short`

4. If the user requested a limited scope and unexpected paths are staged, stop and ask for scope confirmation.
5. If nothing is staged, do not commit and explain why.
6. Generate an appropriate commit message.
7. Follow the selected mode.

- `/commit msg`:
  - Do not run `git commit`.
  - Output only the final commit message, including subject and body.
- `/commit` or no `msg` option:
  - Run the actual commit with the generated message.
