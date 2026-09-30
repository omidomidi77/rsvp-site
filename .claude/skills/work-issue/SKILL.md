---
name: work-issue
description: Take one GitHub issue from the board to an open pull request.
disable-model-invocation: true
argument-hint: "<issue-number>"
---

# Work issue #$ARGUMENTS end to end

1. **Read the issue** with the GitHub MCP tools (title, body, labels, comments).
   If the issue is unclear, comment on it with your questions and STOP.
2. **Label it** `in-progress` so nobody else picks it up.
3. **Branch**: `git switch -c issue-$ARGUMENTS-<short-slug>` from an up-to-date `main`.
4. **Plan** in 3–5 bullets, then implement following CLAUDE.md.
   For UI work, follow the `design-system` skill.
5. **Test**: `npm test` must pass. Add tests for any new pure function.
6. **Review**: delegate to the `reviewer` subagent. Fix every finding it marks as a problem,
   then ask it again until the verdict is `APPROVE` (max 2 rounds).
7. **Ship**: commit, push, and open a PR whose body contains `Closes #$ARGUMENTS`
   and the reviewer's final verdict.
8. Reply with: PR URL, one-line summary, anything left for a human.
