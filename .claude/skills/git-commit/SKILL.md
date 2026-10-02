---
name: git-commit
description: Git commit and push rules for the RSVP site. Use after every completed code change, before reporting a task as done, to commit and push the work.
---

# Commit and push after every change

Every task that changes files ends with a commit that is pushed. Do not report a task as done with uncommitted or unpushed work.

## Steps
1. Run `npm test`. If it fails, fix it first; never commit red.
2. Stage only the files you changed, by name: `git add index.html styles.css`.
   Never `git add .` or `git add -A`.
3. Never stage `.env*`, `node_modules/`, or anything containing a key or token.
4. One commit per task with a conventional message:
   - Prefix: `feat:`, `fix:`, `docs:`, `test:`, `chore:` (from CLAUDE.md).
   - Subject: imperative, capitalized, 50 characters or fewer, no trailing period.
   - Body (optional): what changed and why, wrapped at 72 characters.
5. Work for a GitHub issue goes on a branch named `issue-<number>-<short-slug>`; never commit to that branch's work on `main`.
6. Push with plain `git push`, which follows the branch's tracking branch.
   Never push with an explicit refspec such as `HEAD` or `main`; local `main` tracks `origin/live-demo`, not the remote `main`.
   If the branch has no tracking branch, use `git push -u origin HEAD:<branch-name>` and say which remote branch you created.
   If the repo has no `origin` remote, say so and stop; do not create one without being asked.
7. Finish by reporting the short hash, subject and the branch that was pushed,
   for example `a1b2c3d feat: Add location section (pushed main)`.

## Don'ts
- No `--amend`, no force-push, no history rewriting.
- No commits that mix unrelated changes.
