---
name: git-pr-create
description: GitHub Pull Request creation specialist. Creates a GitHub Pull Request when the user requests PR creation. Uses the git-commit skill's analysis and commit results to prepare a PR title and body, detect repository PR templates, obtain user confirmation, and create the PR via gh CLI.
---

# PR Creator

Workflow for creating GitHub Pull Requests. Uses the completed results of the `git-commit` skill as the primary source for change analysis and commit information. Focuses on writing clear PR titles and bodies, detecting repository PR templates, obtaining user confirmation, and creating PRs via gh CLI.

**Responsibility Boundary:**

- `git-commit`: Repository status analysis, change analysis, file classification, atomic commit grouping, commit execution, and final verification.
- `git-pr-create`: Consume `git-commit` results, create PR titles and bodies, obtain user approval, and create PRs.

**IMPORTANT:** NEVER duplicate the repository analysis or commit workflow handled by `git-commit`.

## Workflow

### 0. Create TODO list for tracking

**CRITICAL: ALWAYS start by creating a TODO list using TodoWrite tool.**

Create todos for all workflow steps:

```json
{
  "todos": [
    {
      "content": "Obtain and review git-commit results",
      "status": "pending",
      "activeForm": "Obtaining and reviewing git-commit results"
    },
    {
      "content": "Build PR change summary from git-commit results",
      "status": "pending",
      "activeForm": "Building PR change summary"
    },
    {
      "content": "Write PR title",
      "status": "pending",
      "activeForm": "Writing PR title"
    },
    {
      "content": "Detect PR template",
      "status": "pending",
      "activeForm": "Detecting PR template"
    },
    {
      "content": "Write PR body",
      "status": "pending",
      "activeForm": "Writing PR body"
    },
    {
      "content": "Save PR draft and get user confirmation",
      "status": "pending",
      "activeForm": "Saving PR draft and getting user confirmation"
    },
    {
      "content": "Verify commit completion and create PR via gh CLI",
      "status": "pending",
      "activeForm": "Verifying commit completion and creating PR"
    }
  ]
}
```

Update each todo's status to "in_progress" when starting that step, and "completed" when finished.

### 1. Obtain git-commit Results

**CRITICAL: The `git-commit` skill is the sole owner of repository status analysis and commit-related operations.**

Before proceeding with PR creation, obtain the execution results from the `git-commit` skill.

1. **Check for Existing Execution Results**

   Check the current conversation context for completed `git-commit` skill execution results.

   - Reuse the results if the skill has already completed successfully for the same repository, branch, and change set.
   - Do not invoke the skill again if valid results are already available.

2. **Invoke git-commit When Necessary**

   If no valid execution results are available, invoke the `git-commit` skill to obtain the required analysis and verification results.

   This applies even when the working directory appears clean. The `git-commit` skill must determine the current repository state and whether any commits are necessary.

   If there are no changes requiring commits, continue using the available commit history and execution results as the basis for PR preparation.

   Wait until the entire `git-commit` workflow is completed.

   The `git-commit` skill is responsible for:
   - Gathering repository status and Git history
   - Analyzing staged, unstaged, and untracked changes
   - Classifying changed files
   - Analyzing dependencies and feature boundaries
   - Grouping changes into atomic commits
   - Establishing dependency-based commit order
   - Generating commit messages
   - Executing commits
   - Performing final verification

3. **Consume git-commit Results**

   Use the information produced by the `git-commit` skill as the primary source for subsequent PR-related work.

   Specifically, utilize:

   - **Commit Plan**
     - Commit group descriptions
     - Files included in each group
     - Reasons for grouping
     - Dependency-based execution order

   - **Commit Results**
     - Created commit hashes
     - Commit messages
     - Number of commits created

   - **Final Verification**
     - Whether all intended changes were committed
     - Final Git working directory status
     - Any remaining issues

4. **Execution Constraints**

   - NEVER execute `get_git_status.py` directly within this skill.
   - NEVER independently run `git status`, `git diff`, or `git log` to repeat the analysis already performed by `git-commit`.
   - NEVER classify changed files or create commit groups independently.
   - NEVER perform staging or commit operations directly.
   - Always use the `git-commit` skill's results instead of repeating its workflow.

5. **Failure Handling**

   - If the `git-commit` workflow fails, do not proceed with PR creation.
   - If a merge or rebase is in progress, stop and report the issue.
   - If the final verification indicates that intended changes remain uncommitted, resolve them through the `git-commit` skill before proceeding.

### 2. Build PR Change Summary from git-commit Results

Use the results from the `git-commit` skill to understand the changes and prepare a PR-oriented summary.

**CRITICAL: Do not repeat the repository-wide change analysis already completed by `git-commit`.**

#### Information Sources

Use the following information as the primary source:

1. **Original User Request**
   - Understand the original problem or requirement.
   - Identify the user's core intent and what should be emphasized in the PR.

2. **Atomic Commit Groups**
   - Identify the functional changes from each commit group.
   - Understand the purpose of each group through its description and included files.
   - Use the grouping rationale to understand relationships between changes.

3. **Commit Messages**
   - Use commit messages to understand the individual changes.
   - Identify the main features, fixes, and refactoring work.

4. **Dependency-Based Commit Order**
   - Understand how foundational changes support subsequent features.
   - Use this information to explain the implementation sequence when relevant.

#### PR-Oriented Summary

Consolidate the atomic commit groups into a single PR-level summary.

Analyze the available results to determine:

- **Problem:** What problem or requirement does this PR address?
- **Implementation:** What features or changes are included?
- **Approach:** What implementation approach was taken?
- **Purpose:** Why were these changes necessary?
- **Core Intent:** What should reviewers understand or pay attention to?

#### Analysis Rules

- Treat `git-commit` results as the primary source of truth for change classification and implementation scope.
- Consolidate related atomic commits into meaningful PR-level changes.
- Do not simply copy the commit list into the PR body.
- Avoid repeating file-by-file analysis already performed by `git-commit`.
- Use the original user request to understand business context and intended outcomes.
- Do not infer implementation details or business benefits that are not supported by the available information.
- If the commit results do not contain enough information to explain a specific technical detail accurately, inspect only the relevant source files as necessary. Do not repeat the entire repository-wide analysis.

### 3. Write PR title

**Format:**

- `{descriptive title}`

**Required rules:**

- **Noun form ending**: End with noun form in the user's query language
- **Specific and clear**: Immediately understandable
- **Emphasize core**: Reflect what the user wants to highlight
- **Around 50-60 characters** Keep concise but informative
- **Use git-commit results:** Use the commit messages and consolidated change summary from `git-commit` as references when determining the PR title. Do not simply copy an individual commit message when the PR contains multiple related changes.

**Prohibited:**

- NO vague expressions like "bug fix", "improvement"
- NO technical term lists only

**Good examples:**

- "Fix dmypy incorrectly inferring all Django models as Reel type"
- "Implement Instagram Reels bulk collection API"
- "Improve response speed by adding search result caching"
- "Fix dmypy incorrectly inferring all Django models as Reel type" (no ticket)

**Bad examples:**

- "bug fix"
- "performance improvement"
- "Fix type error"

### 4. Detect PR template

**CRITICAL: ALWAYS run the PR template detection script. DO NOT skip this step.**

**You MUST run this Python script to detect PR templates:**

```bash
python scripts/detect_pr_template.py
```

**Why this is critical:**

- Each repository may have its own PR template structure
- Using the repository's template ensures consistency with team conventions
- The script handles git worktree environments correctly
- Skipping this step results in incorrect PR format

**What the script does:**

- Searches for PULL_REQUEST_TEMPLATE.md in standard locations (.github/, docs/, root)
- Works correctly in git worktree environments
- Returns JSON with template path and content if found

**IMPORTANT: You must parse the JSON output and follow the instructions:**

- If `"found": true` → **USE THE TEMPLATE STRUCTURE** from `"content"` field. DO NOT use fallback structure.
- If `"found": false` → Use the fallback structure below

**Example output when found:**

```json
{
  "found": true,
  "path": ".github/PULL_REQUEST_TEMPLATE.md",
  "content": "## Description\n\n## Changes\n..."
}
```

**What to do:** Extract the `"content"` field and use that exact structure for the PR body.

### 5. Write PR body

**If template found:** Follow the repository's template structure exactly. Fill in each section based on the analyzed changes.

**If template not found (fallback):** Use the structure matching the user's query language.

**Structure template:**

```markdown
## Description

<!-- Provide a clear summary of what this PR does and why. -->

## Type of Change

- [ ] New feature
- [ ] Bug fix
- [ ] Refactoring (no functional changes)
- [ ] Documentation update
- [ ] Infrastructure / CI/CD
- [ ] Performance improvement

## Changes Made

<!-- List the specific changes. Be precise. -->

-
-
-

## How to Test

<!-- Step-by-step instructions for reviewers to verify this works. -->

1.
2.
3.

## Checklist

- [ ] Code follows the project's style guidelines
- [ ] Self-reviewed the code for obvious errors
- [ ] Added or updated tests where applicable
- [ ] Existing tests pass locally
- [ ] Updated documentation if needed
- [ ] No new warnings or console errors introduced

## Related Issues

<!-- If applicable, link related tickets or issues. Use "Closes #123" to auto-close. -->

## Screenshots

<!-- If applicable, add screenshots or screen recordings. -->
```

### Content Generation Rules

- Use the PR change summary derived from `git-commit` results in Phase 2 as the primary source for the PR body.
- Use atomic commit groups to construct meaningful PR-level change descriptions.
- Consolidate related commits into higher-level feature descriptions instead of listing every commit individually.
- Use the original user request to explain the problem and business context.
- Do not repeat file-by-file analysis or independently reclassify changes.
- Ensure that all descriptions accurately reflect the actual implementation.
- Do not claim that tests were executed or passed unless supported by the available results.

### 6. Save PR draft

Save the draft to a temporary file:

```bash
/tmp/pull-request-{topic}-{timestamp}.md
```

Show the content to the user and ask for confirmation in their language.

### 7. Create PR

**Only proceed after user approval.**

1. Verify commit completion using `git-commit` results:

   **CRITICAL: Do not perform commit-related operations directly within this skill.**

   - Review the final verification results from the `git-commit` skill.
   - Confirm that all intended PR changes have been committed successfully.
   - Confirm that no intended changes remain uncommitted.
   - If new changes have appeared since the previous `git-commit` execution, invoke the `git-commit` skill again.
   - Do not repeat the repository-wide status analysis or commit workflow.

   **IMPORTANT:**
   - NEVER execute `git add` or `git commit` directly within this skill.
   - NEVER partially implement or duplicate the `git-commit` workflow.
   - Always delegate commit-related operations to the `git-commit` skill.
   - Do not proceed if commit completion cannot be verified.

2. Push to remote:

   ```bash
   git push -u origin {branch-name}
   ```

3. Create PR using gh CLI:

   ```bash
   gh pr create --title "{title}" --body "$(cat /tmp/pull-request-{topic}-{timestamp}.md)" --base main
   ```

4. Return PR URL to user

## Key considerations

**User intent understanding:**

- Use the original user request to understand the purpose and intended outcome of the PR.
- Use `git-commit` results to identify the actual implementation scope and technical changes.
- Focus on business value or problem solving over technical achievement
- Clearly communicate "why this is important"

**Balance technical accuracy and readability:**

- Use technical terms precisely, but add context
- Wrap code changes in backticks
- Add simple analogies or explanations for complex concepts
- Base technical descriptions on the implementation and `git-commit` results
- Do not introduce unsupported implementation details or assumptions

**Reviewer perspective:**

- Structure the PR for quick understanding
- Consolidate atomic commits into meaningful feature-level descriptions
- Emphasize important changes
- Provide clear testing methods

## Prohibited actions

- NO conventional commit prefixes in PR title
- NO vague or generic descriptions
- NO technical term lists only
- NO PR creation without user confirmation
- NO PR creation with uncommitted changes

## Final checklist

Before creating PR, verify:

- [ ] Title matches user's query language?
- [ ] Title is specific and clear?
- [ ] Body follows the required structure?
- [ ] PR content accurately reflects the changes identified by `git-commit`?
- [ ] Balance between technical details and explanations is appropriate?
- [ ] User's core intent is well communicated?
- [ ] `git-commit` skill completed successfully?
- [ ] All intended changes are committed according to `git-commit` final verification?
- [ ] User confirmation received?
