#!/usr/bin/env node
// Reads a `claude -p --output-format json` result file.
// Exits 1 if the run reported an error; otherwise prints the last lines of Claude's reply.
import { readFileSync } from "node:fs";
const run = JSON.parse(readFileSync(process.argv[2], "utf8"));
if (run.is_error) process.exit(1);
console.log(String(run.result ?? "").trim().split("\n").slice(-3).join("\n"));
