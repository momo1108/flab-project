---
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git commit:*), Bash(git push:*), Bash(git log:*), Bash(git branch:*), Bash(git diff:*), Bash(find:*)
description: Generate a convention-aligned git commit message with user confirmation and execute the commit
---

## Check Current State

- Current branch: !`git branch --show-current`
- Working tree changes: !`git diff --stat`
- Unstaged diff (for message drafting): !`git diff`

## Review Recent Commits

Use recent commit titles and bodies to match the tone and level of detail.

- Inspect recent commits: !`git log -n 10 --pretty=format:"%h %s%n%b%n---"`

## Index.lock Error Handling

Before any git operation, check for index.lock file:

- Check: !`find .git -name "index.lock" -type f 2>/dev/null`
- If index.lock exists:
  - Inform the user that index.lock file exists (likely from a previous interrupted git operation)
  - Ask for confirmation to remove it using vscode_askQuestions
  - If confirmed: remove it using the cleanup-git-lock skill
  - If declined: stop and explain the user must manually resolve it

## Staging Policy

- Staging happens only after the commit message is accepted by the user.
- Default after acceptance: stage all modified files before committing. !`git add -A`
- Exception after acceptance: stage only the requested paths when the user explicitly limits the commit scope.

## Commit Message Rules

Write commit messages using these types:

- `feat`: add a new feature. Example: `feat(auth): add login flow`
- `fix`: fix a bug. Example: `fix(api): resolve user lookup error`
- `docs`: update documentation such as README or comments. Example: `docs(readme): add setup steps`
- `refactor`: improve code structure without changing behavior. Example: `refactor(utils): extract shared helper`
- `test`: add or update tests. Example: `test(login): add login unit tests`
- `chore`: update project configuration or build-related settings. Example: `chore(webpack): add bundle config`

## Workflow

1. **Check index.lock**: Handle index.lock if it exists (see Index.lock Error Handling section)

2. **Analyze Changes**:
   - Get working tree changes: !`git diff --stat`

- Review actual diff content without staging: !`git diff`
- Determine the commit type(s) based on changes
- Analyze files changed to understand the nature of changes

3. **Generate Initial Commit Message**:
   - Based on the changes, create a conventional commit message with subject and body
   - Message format:

     ```
     <type>(<scope>): <subject>

     <body>
     ```

4. **Commit Message Confirmation Loop**:
   - Present the generated commit message to the user
   - Offer three options using vscode_askQuestions:
     - **✅ Accept**: Proceed to staging, commit, and push
     - **❌ Reject**: Exit without staging or committing
     - **✏️ Modify**: Provide modification guidance to regenerate the message
   - **If Accept (✅)**:
     - Decide staging scope:
       - If the user specified files or folders, stage only those paths.
       - If the user did not specify a scope, stage everything: !`git add -A`
     - Verify staging:
       - Staging summary: !`git diff --cached --stat`
       - Staged items: !`git status --short`
       - If the user requested a limited scope and unexpected paths are staged, stop and ask for scope confirmation.
       - If nothing is staged, do not commit and explain why.
     - Execute: !`git commit -m "<message>"`
     - If successful, execute: !`git push`
     - Confirm success to user
   - **If Reject (❌)**:
     - Inform user that commit has been cancelled before staging
     - Exit without committing
   - **If Modify (✏️)**:
     - Ask the user for specific modification guidance (e.g., "make it more descriptive", "change type to docs")
     - Regenerate commit message based on feedback
     - Return to step 4 (present updated message for confirmation)

5. **Error Handling**:
   - If git commit fails due to index.lock, handle according to Index.lock Error Handling section
   - If git push fails, inform user and suggest manual action
