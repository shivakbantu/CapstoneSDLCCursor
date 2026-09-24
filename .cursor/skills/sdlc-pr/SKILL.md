---
name: sdlc-pr
description: Creates Agentic SDLC stage PRs after each phase and the final Stage 8 PR with mandatory sections. Use after any stage completes (stage PR) or after Verify Go (final PR).
---

# SDLC Pull Request

## Two PR modes

### A) Stage PR (after Stages 1–7)

Create or update a PR for the completed stage:

1. Ensure stage primary artifact(s) and `docs/sdlc/0N-*-response.md` are committed on the branch.
2. Push branch if needed (`-u` when no upstream).
3. Open/update PR via GitHub REST API (`api-conf.properties`) or `gh` CLI.
4. Title pattern: `[SDLC Stage N] <Stage Name> — <short summary>`
5. Body must include: stage number/name, list of artifacts, link/path to stage response MD, checklist for human approval of this stage.
6. Return the PR URL and record it in the stage response file under `## PR`.

### B) Final PR (Stage 8)

## Prerequisites

- Verify stage is **Go**, or user explicitly overrides.

## Steps

1. Review full branch diff vs base (`main`/`master`).
2. Push branch if needed (`-u` when no upstream).
3. Create/update the **final** PR with **all** required sections below (no omissions).
4. Write `docs/sdlc/08-final-pr-response.md` with the PR URL.
5. Return the PR URL.

## Required final PR body sections

1. **Summary** — 2–3 sentences: what was built and why
2. **Changes Made** — bullets: `path/file` — reason
3. **Test Evidence** — paste test output or CI link (fenced text); include Playwright script paths/results
4. **Known Limitations** — Not Found items, out of scope, residual risks
5. **Reviewer Checklist** — include at least:

- [ ] Behavior matches `requirements.md` acceptance criteria
- [ ] No secrets in code or generated documentation
- [ ] Error paths for missing files / empty repos handled
- [ ] Tests cover happy path and Not Found / missing-field cases
- [ ] Playwright E2E scripts cover primary UI flows
- [ ] Design aligns with approved `architecture.md`
- [ ] Implementation is a Python web application as planned
- [ ] Verification report reviewed
- [ ] Prior stage response MDs under `docs/sdlc/` are present

## Rules

- Base Summary on the real diff and SDLC artifacts.
- Never force-push protected branches (hooks may ask before force push).
- Prefer GitHub REST API from `api-conf.properties`; fall back to `gh`.
- Completing Stage 8 finishes the agentic SDLC cycle for the story.
