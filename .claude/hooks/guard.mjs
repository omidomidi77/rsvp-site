#!/usr/bin/env node
// PreToolUse guard: blocks secret files and destructive shell commands.
// Exit 2 = block the tool call; stderr is shown to Claude as the reason.
let raw = "";
for await (const chunk of process.stdin) raw += chunk;
const { tool_name: tool, tool_input: input = {} } = JSON.parse(raw || "{}");

const file = input.file_path ?? "";
const cmd = input.command ?? "";

if (["Edit", "Write", "Read"].includes(tool) && /(^|\/)\.env(\.|$)/.test(file)) {
  console.error("Blocked: .env files hold secrets and are off-limits. Ask the human to set the value.");
  process.exit(2);
}
if (tool === "Bash" && /rm\s+-rf|git\s+push\s+(-f|--force)|git\s+reset\s+--hard/.test(cmd)) {
  console.error(`Blocked: destructive command (${cmd}). Propose a safer alternative.`);
  process.exit(2);
}
process.exit(0);
