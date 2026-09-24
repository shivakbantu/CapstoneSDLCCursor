/**
 * subagentStop — after an SDLC stage agent finishes, remind to await human approval
 * and confirm stage response MD + stage PR were created.
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

const subagent =
  input.subagent_type ||
  input.agent_id ||
  input.agent ||
  input.name ||
  "";

const status = String(input.status || input.outcome || "completed");
const text = `${subagent} ${JSON.stringify(input)}`.toLowerCase();

const stageHints = [
  {
    match: /requirements/,
    next: "Confirm docs/sdlc/01-requirements-response.md + Stage 1 PR exist. Await human approval of requirements.md, then run architecture-agent (Stage 2).",
  },
  {
    match: /architecture/,
    next: "Confirm docs/sdlc/02-architecture-response.md + Stage 2 PR exist. Await human approval of architecture.md (Python web app), then run design-review-agent (Stage 3).",
  },
  {
    match: /design-review|design_review/,
    next: "Confirm docs/sdlc/03-design-review-response.md + Stage 3 PR exist. Await human approval of design-review.md, then run impl-planning-agent (Stage 4).",
  },
  {
    match: /impl-planning|impl_planning|implementation-planning/,
    next: "Confirm docs/sdlc/04-impl-plan-response.md + Stage 4 PR exist. Await human approval of impl-plan.md, then run implementation-agent (Stage 5 — Python web app).",
  },
  {
    match: /implementation(?!-planning)/,
    next: "Confirm docs/sdlc/05-implementation-response.md + Stage 5 PR exist. Await human review of the Python web app slice, then run code-review-agent (Stage 6).",
  },
  {
    match: /code-review|code_review/,
    next: "Confirm docs/sdlc/06-code-review-response.md + Stage 6 PR exist. Resolve Critical findings, then run verify-agent (Stage 7 — Playwright MCP test scripts).",
  },
  {
    match: /verify/,
    next: "Confirm docs/sdlc/07-verify-response.md + Stage 7 PR and Playwright scripts exist. If Go, await confirmation, then run pr-agent for the final Stage 8 PR. If No-Go, fix and re-verify.",
  },
  {
    match: /pr-agent|\bpr\b/,
    next: "If this was a stage PR, await human stage approval before advancing. If Stage 8 final PR, write docs/sdlc/08-final-pr-response.md — cycle complete once reviewed/merged.",
  },
  {
    match: /sdlc-master|master/,
    next: "Confirm which stage just finished (response MD + stage PR) with the user before advancing.",
  },
];

let followup =
  "SDLC reminder: ensure stage response MD + stage PR exist; do not advance until the human explicitly approves.";

for (const h of stageHints) {
  if (h.match.test(text)) {
    followup = `SDLC gate (${status}): ${h.next}`;
    break;
  }
}

process.stdout.write(JSON.stringify({ followup_message: followup }));
process.exit(0);
