#!/usr/bin/env bash
# Pull issues labelled "ready" from GitHub and let Claude Code work them, one at a time.
# Usage: scripts/issue-loop.sh [max_issues]      (default 1 — keep it small on stage)
# Requires: gh (authenticated), claude, node.
set -euo pipefail

MAX="${1:-1}"
BUDGET_USD="${BUDGET_USD:-2}"

issues=$(gh issue list --label ready --state open --limit "$MAX" \
          --json number --jq '.[].number')

if [[ -z "$issues" ]]; then
  echo "No issues labelled 'ready'. Nothing to do."
  exit 0
fi

for n in $issues; do
  echo "=== Working issue #$n ==="
  gh issue edit "$n" --remove-label ready --add-label in-progress

  if claude -p "/work-issue $n" \
       --permission-mode acceptEdits \
       --allowedTools "Bash(npm test) Bash(git *) Bash(gh *) mcp__github" \
       --max-budget-usd "$BUDGET_USD" \
       --output-format json > "claude-issue-$n.json" \
     && node -e 'process.exit(JSON.parse(require("fs").readFileSync(process.argv[1])).is_error ? 1 : 0)' "claude-issue-$n.json"; then
    echo "✓ #$n done: $(node -e 'console.log(JSON.parse(require("fs").readFileSync(process.argv[1])).result ?? "")' "claude-issue-$n.json" | tail -3)"
  else
    echo "✗ #$n failed — sending back to humans"
    gh issue edit "$n" --remove-label in-progress --add-label needs-human
  fi
  git switch -q main
done
