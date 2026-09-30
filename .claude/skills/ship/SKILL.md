---
name: ship
description: Test, commit with a conventional message, push the current branch, and open a pull request.
disable-model-invocation: true
argument-hint: "[optional note for the PR description]"
---

# Ship the current work

Current state:
- Branch: !`git branch --show-current`
- Changes: !`git status --short`

Steps:
1. Run `npm test`. If anything fails, stop and report — do not commit.
2. Stage the changes and write ONE conventional commit (`feat:`, `fix:`, `docs:`, `test:`, `chore:`)
   whose subject is under 60 characters and explains the *why*.
3. Push the branch with `git push -u origin HEAD`.
4. Open a PR with `gh pr create --fill`. If the branch name contains an issue number,
   add `Closes #<number>` to the PR body. Extra note from the user: $ARGUMENTS
5. Reply with the PR URL only.
