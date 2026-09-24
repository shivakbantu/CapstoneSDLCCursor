/**
 * afterFileEdit — light normalize trailing whitespace on SDLC markdown artifacts.
 * Does not reformat arbitrary code; only known artifact filenames.
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

const filePath = input.file_path || input.path || "";
const base = path.basename(String(filePath));
const ARTIFACTS = new Set([
  "requirements.md",
  "architecture.md",
  "design-review.md",
  "impl-plan.md",
]);

if (!ARTIFACTS.has(base)) {
  process.stdout.write(JSON.stringify({}));
  process.exit(0);
}

const abs = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);

try {
  if (!fs.existsSync(abs)) {
    process.stdout.write(JSON.stringify({}));
    process.exit(0);
  }
  const original = fs.readFileSync(abs, "utf8");
  const normalized = original
    .split(/\r?\n/)
    .map((line) => line.replace(/[ \t]+$/g, ""))
    .join("\n")
    .replace(/\n*$/, "\n");

  if (normalized !== original) {
    fs.writeFileSync(abs, normalized, "utf8");
    process.stdout.write(
      JSON.stringify({
        additional_context: `Normalized trailing whitespace in ${base}.`,
      })
    );
  } else {
    process.stdout.write(JSON.stringify({}));
  }
} catch (e) {
  process.stdout.write(
    JSON.stringify({
      additional_context: `SDLC doc format hook skipped: ${e.message}`,
    })
  );
}
process.exit(0);
