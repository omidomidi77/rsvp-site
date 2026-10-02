// Local server: serves the static site and handles POST /api/rsvp, which
// validates the RSVP and sends the confirmation email through Resend.
// Node built-ins only. Run with `npm start`.
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { extname, join, normalize, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { validateRsvp, isDuplicateEmail } from "./rsvp.js";
import { buildConfirmationEmail } from "./email.js";

const ROOT = fileURLToPath(new URL(".", import.meta.url));
const PORT = Number(process.env.PORT ?? 5173);
const RESEND_URL = "https://api.resend.com/emails";
const RSVP_STORE = join(ROOT, "rsvps.json");
const MAX_BODY_BYTES = 10_000;
const CONTENT_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
};

loadDotEnv(join(ROOT, ".env"));

createServer(async (request, response) => {
  try {
    if (request.method === "POST" && request.url === "/api/rsvp") {
      return await handleRsvp(request, response);
    }
    if (request.method === "GET") {
      return await serveStatic(request.url, response);
    }
    sendJson(response, 405, { error: "Method not allowed" });
  } catch (error) {
    console.error(`request failed: ${request.method} ${request.url}: ${error.message}`);
    sendJson(response, 500, { error: "Internal server error" });
  }
}).listen(PORT, () => {
  console.log(`RSVP site at http://localhost:${PORT}`);
  if (!process.env.RESEND_API_KEY) console.warn("RESEND_API_KEY is not set; confirmations will fail.");
});

async function handleRsvp(request, response) {
  const body = await readJsonBody(request);
  const result = validateRsvp(body);
  if (!result.ok) return sendJson(response, 400, { errors: result.errors });

  const rsvps = readRsvps();
  if (isDuplicateEmail(rsvps.map((rsvp) => rsvp.email), result.value.email)) {
    return sendJson(response, 409, { error: "This email already has a reservation. One RSVP per person, please." });
  }
  writeRsvps([...rsvps, { ...result.value, reservedAt: new Date().toISOString() }]);

  const sent = await sendConfirmation(result.value);
  sendJson(response, 202, { sent });
}

async function sendConfirmation(rsvp) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("confirmation not sent: RESEND_API_KEY is not set");
    return false;
  }
  const message = buildConfirmationEmail(rsvp, process.env.RSVP_FROM ?? "RSVP <onboarding@resend.dev>");
  const resend = await fetch(RESEND_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(message),
  });
  if (!resend.ok) console.error(`resend rejected confirmation: status=${resend.status}`);
  return resend.ok;
}

function readRsvps() {
  if (!existsSync(RSVP_STORE)) return [];
  return JSON.parse(readFileSync(RSVP_STORE, "utf8"));
}

function writeRsvps(rsvps) {
  writeFileSync(RSVP_STORE, JSON.stringify(rsvps, null, 2));
}

async function serveStatic(url, response) {
  const requestPath = new URL(url, "http://localhost").pathname;
  const relative = requestPath === "/" ? "index.html" : requestPath.slice(1);
  const filePath = normalize(join(ROOT, relative));
  const isInsideRoot = filePath.startsWith(ROOT);
  const isHidden = relative.split("/").some((part) => part.startsWith("."));
  if (!isInsideRoot || isHidden || !existsSync(filePath)) {
    response.writeHead(404, { "Content-Type": "text/plain" });
    return response.end("Not found");
  }
  const type = CONTENT_TYPES[extname(filePath)] ?? "application/octet-stream";
  response.writeHead(200, { "Content-Type": type });
  response.end(await readFile(filePath));
}

async function readJsonBody(request) {
  let raw = "";
  for await (const chunk of request) {
    raw += chunk;
    if (raw.length > MAX_BODY_BYTES) throw new Error("request body too large");
  }
  return JSON.parse(raw || "{}");
}

function sendJson(response, status, payload) {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(payload));
}

function loadDotEnv(path) {
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
    if (match && process.env[match[1]] === undefined) process.env[match[1]] = match[2];
  }
}
