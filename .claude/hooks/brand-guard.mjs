#!/usr/bin/env node
// PreToolUse guard: RBC is the only bank allowed on this site.
// Blocks any Edit, Write or Bash call whose content, command or file name introduces another bank's name or logo.
// Exit 2 = block the tool call; stderr is shown to Claude as the reason.
import { win32 } from "node:path";
let raw = "";
for await (const chunk of process.stdin) raw += chunk;
const { tool_name: tool, tool_input: input = {} } = JSON.parse(raw || "{}");

if (!["Edit", "Write", "Bash"].includes(tool)) process.exit(0);

const filePath = input.file_path ?? "";
const text = [input.content, input.new_string, input.command].filter(Boolean).join("\n");

// Short tickers are case-sensitive so <td> table cells and similar never match.
const TICKERS = /\b(TD|BMO|CIBC|HSBC|ATB)\b/;
const NAMES = /\b(scotia\s?bank|bank of montreal|toronto[- ]dominion|national bank|desjardins|tangerine|simplii|laurentian|eq bank|wells fargo|bank of america|jp ?morgan|chase bank|citi ?bank|barclays|capital one)\b/i;

const LOGO_IN_COMMAND = /[\w.-]*logo[\w.-]*\.(svg|png|jpe?g|webp|gif)/i;
const logoFile = filePath ? win32.basename(filePath) : (text.match(LOGO_IN_COMMAND)?.[0] ?? "");
if (/logo/i.test(logoFile) && !/^rbc[-_.]/i.test(logoFile)) {
  console.error(`Blocked: ${logoFile} is a logo file for a brand other than RBC. Only the RBC logo is allowed on this site.`);
  process.exit(2);
}

const hit = text.match(TICKERS) ?? text.match(NAMES);
if (hit) {
  console.error(`Blocked: "${hit[0]}" names a bank other than RBC. This site carries the RBC brand only; do not add other bank names or logos.`);
  process.exit(2);
}
process.exit(0);
