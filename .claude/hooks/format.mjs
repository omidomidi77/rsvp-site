#!/usr/bin/env node
// PostToolUse: format the file Claude just wrote; run tests after JS edits.
// Exit 2 here cannot undo the edit, but Claude sees stderr and fixes the failure.
import { execSync } from "node:child_process";
import { existsSync } from "node:fs";

let raw = "";
for await (const chunk of process.stdin) raw += chunk;
const file = JSON.parse(raw || "{}").tool_input?.file_path ?? "";
if (!file || !existsSync(file)) process.exit(0);

const cwd = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
if (/\.(html|css|js|md)$/.test(file)) {
  try { execSync(`npx --yes prettier@3 --write "${file}"`, { cwd, stdio: "ignore" }); } catch {}
}
if (file.endsWith(".js")) {
  try {
    execSync("npm test", { cwd, stdio: "pipe" });
  } catch (err) {
    console.error(`Tests failed after editing ${file}:\n` + String(err.stdout).split("\n").slice(-25).join("\n"));
    process.exit(2);
  }
}
process.exit(0);
