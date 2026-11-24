---
name: pr-review-assistant
description: Use when the user asks to check, read, view, or review feedback and comments on their GitHub Pull Request, or wants to reply to, hide, or fix PR review comments. Fetches and displays reviews, then handles the user's selected actions.
---

# PR Review Assistant

## Purpose

Assist the user in reviewing feedback received on their GitHub Pull Requests.

The workflow consists of three phases:

1. Fetch and display all relevant reviews and review comments on the user's PR.
2. Ask the user to decide how each review comment should be handled.
3. Execute only the action explicitly selected by the user.

Never make decisions about review feedback on behalf of the user.

## Prerequisites

- GitHub CLI (`gh`) must be installed and authenticated.
- The current working directory must belong to a GitHub repository.
- The user must have sufficient permissions to access and modify the target PR.
- An existing commit-and-push skill must be available when code changes need to be committed and pushed.

Verify GitHub CLI authentication before proceeding:

```bash
gh auth status
```

If authentication fails, stop and ask the user to authenticate.

## Workflow

### Phase 1: Identify the Target Pull Request

Identify the PR associated with the current branch.

```bash
gh pr view --json number,title,url,state,headRefName,baseRefName
```

If no PR is associated with the current branch:

- Ask the user to provide a PR number or URL.
- Do not guess which PR should be reviewed.

Verify that the PR is open before proceeding.

Record the following information:

- PR number and URL
- PR title
- Source branch (`headRefName`)
- Target branch (`baseRefName`)
- PR state

### Phase 2: Fetch and Display Reviews

Fetch all reviews and inline review comments associated with the PR.

Retrieve PR reviews:

```bash
gh api --paginate \
  repos/{owner}/{repo}/pulls/{pull_number}/reviews
```

Retrieve inline review comments:

```bash
gh api --paginate \
  repos/{owner}/{repo}/pulls/{pull_number}/comments
```

Use the repository owner, repository name, and PR number obtained from the current repository and target PR.

Do not assume that the default API response contains every review. Handle pagination.

Also retrieve review thread information through the GitHub GraphQL API when needed, including:

- Thread IDs
- Whether a thread is resolved
- Whether a thread is outdated
- Comments within each thread

Present the retrieved information in a readable format.

For each review, display:

- Reviewer
- Review state (APPROVED, CHANGES_REQUESTED, COMMENTED, etc.)
- Review submission date
- Review body

For each inline comment, display:

- Reviewer
- File path
- Line number or diff position, when available
- Comment body
- Whether the comment belongs to a resolved or outdated thread
- Existing replies, if any

Group comments by reviewer or review thread to make the feedback easier to understand.

Preserve the original comment content. Do not silently summarize or omit technical details.

If there are no reviews or review comments, inform the user and stop.

### Phase 3: Ask the User to Choose an Action

After displaying all review feedback, explicitly ask the user how they want to handle it.

The available actions are:

1. Reply to a review comment.
2. Hide a review comment.
3. Fix the issue described in a review comment.

Allow the user to select a specific comment or multiple comments.

Do not automatically execute any action based on the reviewer's wording or perceived importance.

If the user's intention is ambiguous, ask for clarification.

#### Action A: Reply to a Review Comment

When the user chooses to reply:

1. Identify the exact review comment or review thread.
2. Ask the user for the reply content if it has not already been provided.
3. Show the final reply text for confirmation.
4. Post the reply to the corresponding review thread using the GitHub GraphQL API.

Use the `addPullRequestReviewThreadReply` mutation.

Example:

```graphql
mutation ($threadId: ID!, $body: String!) {
  addPullRequestReviewThreadReply(
    input: { pullRequestReviewThreadId: $threadId, body: $body }
  ) {
    comment {
      id
      body
      url
    }
  }
}
```

Execute the mutation through `gh api graphql`.

Do not create a new general PR comment when the user intends to reply to a specific review thread.

After successful execution, display the posted reply and its URL.

#### Action B: Hide a Review Comment

When the user chooses to hide a review comment:

1. Identify the exact comment.
2. Explain that hiding a comment uses GitHub's comment minimization feature.
3. Show the comment author, content, and target PR.
4. Ask for explicit confirmation before executing the action.

Use the GitHub GraphQL `minimizeComment` mutation.

Example:

```graphql
mutation ($subjectId: ID!, $classifier: ReportedContentClassifiers!) {
  minimizeComment(input: { subjectId: $subjectId, classifier: OFF_TOPIC }) {
    minimizedComment {
      isMinimized
      minimizedReason
    }
  }
}
```

Use the comment's GraphQL node ID as `subjectId`.

Select an appropriate minimization classifier based on the user's intention. Do not classify comments as spam, abuse, or off-topic without the user's explicit direction.

Important constraints:

- GitHub comment minimization is not the same as deleting a comment.
- The operation may require additional repository permissions.
- Not all comment types can necessarily be minimized.
- If GitHub rejects the operation, explain the error and do not claim that the comment was hidden.

After successful execution, verify the minimized status and report the result.

#### Action C: Fix an Issue Described in a Review Comment

When the user chooses to fix an issue:

1. Identify the exact review comment and associated file or code location.
2. Read the relevant source code and surrounding implementation.
3. Understand the reviewer's concern before proceeding.
4. Explain the proposed fix briefly.
5. Let the user implement the changes manually. Do not modify source files on behalf of the user.
6. Wait for the user to finish implementing the changes before proceeding.
7. Inspect the user's modifications and compare them against the original review feedback.
8. Explain whether the changes adequately address the reviewer's concerns.
9. If the changes are insufficient, explain what remains to be addressed and let the user make further modifications.
10. Once the changes adequately address the feedback, proceed to the Commit and Push Delegation phase.

Important implementation rules:

- Work on the existing PR source branch.
- Never create a new feature branch for a review fix unless explicitly requested.
- Never modify the target branch.
- Do not overwrite unrelated user changes.
- Do not introduce unrelated refactoring or additional features.
- Follow the project's existing coding conventions.
- Run relevant tests, linting, or type checks when available.
- Report any failed checks rather than claiming that the fix is verified.

#### Commit and Push Delegation

Once the user's modifications have been reviewed and confirmed to address the review feedback, delegate the commit and push operations as follows:

1. Invoke the locally available `git-commit` skill to generate an appropriate commit message based on the user's modifications.
2. Review the generated commit message and present it to the user for confirmation.
3. Once confirmed, create the commit using the generated commit message.
4. Push the committed changes to the existing PR source branch.

Do not independently generate a competing commit message or implement a separate commit workflow.

Ensure that the commit is created from the user's existing modifications without including unrelated changes.

After the commit and push operations:

1. Verify that the new commit exists on the remote source branch.
2. Verify that the existing PR reflects the new commit.
3. Inform the user that the changes have been pushed to the existing PR.

Do not claim that the review has been approved or that the PR has been merged. Those actions require a separate review and merge process.

### Phase 4: Continue Review Management

After completing an action, ask whether the user wants to handle another review comment.

If multiple comments were selected, process each one individually and track its status.

Possible statuses include:

- Pending
- Replied
- Hidden
- Fixed locally
- Committed and pushed
- Skipped

Do not mark an issue as fixed merely because code was modified. Mark it as committed and pushed only after successful verification.

## Safety Rules

- Never automatically reply to reviewers.
- Never automatically hide review comments.
- Never automatically modify code based solely on reviewer feedback.
- Never commit or push without user authorization.
- Never force-push or rewrite existing PR history.
- Never create a duplicate PR for fixes belonging to the existing PR.
- Never modify branches unrelated to the target PR.
- Never resolve review threads or dismiss reviews unless explicitly requested.
- Never expose GitHub authentication tokens or other credentials.
- If any operation fails, report the actual failure and stop the affected operation.

## Expected Behavior

The ideal interaction should look like this:

**Assistant:**

I found PR #123: Implement login functionality.

There are three review comments:

1. `src/auth/login.ts:24` — Missing input validation.
2. `src/auth/login.ts:42` — Potential null reference.
3. `src/components/LoginForm.tsx:18` — Naming suggestion.

How would you like to handle these comments?

**User:**

Fix comments 1 and 2. Reply to comment 3.

**Assistant:**

I will fix the two issues in the existing PR branch and prepare a reply to the third comment.

After implementing the changes, I will show you the diff and request approval before invoking the commit-and-push skill.

**User:**

Approved. Push the changes.

**Assistant:**

The existing PR branch has been updated with the fixes.

The new commit is reflected in PR #123. The third review comment has also been replied to.

The existing PR remains open for further review.
