# RSVP site — Claude Code workshop demo repo

Each git tag is a checkpoint. If a live step misbehaves, jump ahead:

    git checkout stage-0-baseline      # plain site + tests
    git checkout stage-1-claude-md     # + CLAUDE.md
    git checkout stage-2-skills        # + design-system (auto) and /ship (manual) skills
    git checkout stage-3-subagent      # + reviewer subagent
    git checkout stage-4-hooks         # + guard / format hooks
    git checkout stage-5-mcp           # + GitHub MCP (.mcp.json, needs GITHUB_PAT)
    git checkout stage-6-work-issue    # + /work-issue skill that composes everything
    git checkout stage-7-automation    # + scripts/issue-loop.sh and GitHub Actions

Branch `demo/flawed-speakers` has deliberate defects for the reviewer demo.

    npm test          # run tests
    npm run serve     # http://localhost:5173
