/**
 * beforeShellExecution — block destructive git unless user already approved risky ops.
 * Input: JSON on stdin with { command }
 * Output: { permission: "allow"|"deny"|"ask", user_message?, agent_message? }
 */
const fs = require("fs");

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

const command = String(input.command || "");
const lower = command.toLowerCase();

const patterns = [
  { re: /git\s+push\s+[^\n]*--force/, msg: "Force push is blocked by SDLC hook. Use a normal push or get explicit user approval." },
  { re: /git\s+push\s+[^\n]*-f\b/, msg: "Force push (-f) is blocked by SDLC hook." },
  { re: /git\s+reset\s+--hard/, msg: "git reset --hard is blocked by SDLC hook (destructive)." },
  { re: /git\s+clean\s+[^\n]*-[a-z]*f/, msg: "git clean with -f is blocked by SDLC hook (destructive)." },
  { re: /git\s+branch\s+[^\n]*-D\b/, msg: "Force-deleting branches (-D) requires explicit user approval." },
  { re: /git\s+checkout\s+--\s+\.|git\s+restore\s+--source=head\s+\./i, msg: "Discarding all working tree changes is blocked; be more specific or get approval." },
];

for (const p of patterns) {
  if (p.re.test(command) || p.re.test(lower)) {
    process.stdout.write(
      JSON.stringify({
        permission: "ask",
        user_message: p.msg,
        agent_message: `SDLC shell gate flagged: ${command}`,
      })
    );
    process.exit(0);
  }
}

process.stdout.write(JSON.stringify({ permission: "allow" }));
process.exit(0);
