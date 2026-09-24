/**
 * afterFileEdit / beforeSubmitPrompt — flag likely secrets in edited content or prompt.
 * Uses common high-entropy / key patterns. Fail open with additional_context / ask.
 */
const fs = require("fs");
const path = require("path");

let raw = "";
try {
  raw = fs.readFileSync(0, "utf8");
} catch {
  raw = "";
}

let input = {};
try {
  input = JSON.parse(raw || "{}");
} catch {
  input = {};
}

const SECRET_PATTERNS = [
  { name: "AWS access key", re: /AKIA[0-9A-Z]{16}/ },
  { name: "GitHub PAT", re: /\bghp_[A-Za-z0-9]{36,}\b/ },
  { name: "GitHub fine-grained PAT", re: /\bgithub_pat_[A-Za-z0-9_]{20,}\b/ },
  { name: "Slack token", re: /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/ },
  { name: "Generic API key assignment", re: /(?:api[_-]?key|secret[_-]?key|access[_-]?token)\s*[=:]\s*['\"][^'\"]{12,}['\"]/i },
  { name: "Private key block", re: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/ },
];

function scan(text) {
  if (!text || typeof text !== "string") return [];
  const hits = [];
  for (const p of SECRET_PATTERNS) {
    if (p.re.test(text)) hits.push(p.name);
  }
  return hits;
}

const chunks = [];
if (input.prompt) chunks.push(String(input.prompt));
if (input.content) chunks.push(String(input.content));
if (input.new_string) chunks.push(String(input.new_string));
if (input.diff) chunks.push(String(input.diff));
if (input.file_path && typeof input.file_path === "string") {
  try {
    const abs = path.isAbsolute(input.file_path)
      ? input.file_path
      : path.join(process.cwd(), input.file_path);
    if (fs.existsSync(abs) && fs.statSync(abs).size < 512_000) {
      chunks.push(fs.readFileSync(abs, "utf8"));
    }
  } catch {
    /* ignore read errors */
  }
}

const found = [...new Set(chunks.flatMap(scan))];

if (found.length === 0) {
  // beforeSubmitPrompt may expect permission; afterFileEdit expects additional_context optional
  if (input.prompt !== undefined || input.hook_event_name === "beforeSubmitPrompt") {
    process.stdout.write(JSON.stringify({ permission: "allow" }));
  } else {
    process.stdout.write(JSON.stringify({}));
  }
  process.exit(0);
}

const msg =
  `Possible secret(s) detected (${found.join(", ")}). Redact before commit/PR. Rotate if exposed.`;

if (input.prompt !== undefined || input.hook_event_name === "beforeSubmitPrompt") {
  process.stdout.write(
    JSON.stringify({
      permission: "ask",
      user_message: msg,
      agent_message: msg,
    })
  );
} else {
  process.stdout.write(
    JSON.stringify({
      additional_context: msg,
    })
  );
}
process.exit(0);
