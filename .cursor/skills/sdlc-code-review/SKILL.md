---
name: sdlc-code-review
description: Peer code review for Agentic SDLC Step 6 using the capstone checklist (correctness, security, error handling, tests, clarity, DRY, dependency safety). Use after implementation, before PR, or when code-review-agent runs.
---

# SDLC Code Review

## Steps

1. Run `git diff` and inspect untracked **Python web application** files.
2. Compare to `requirements.md` and `architecture.md`.
3. Evaluate **every** checklist row (do not skip).
4. Output Critical / Warnings / Suggestions with file references and fixes.
5. Write `docs/sdlc/06-code-review-response.md` and open the Stage 6 PR.
6. Block Verify until Critical items are fixed or explicitly accepted.

## Mandatory checklist

| Review Area | Review Question |
|-------------|-----------------|
| Correctness | Does each component behave as specified in `requirements.md`? |
| Security | Are secrets excluded from output? Is user input validated? |
| Error Handling | Are API failures, missing files, and empty repos handled gracefully? |
| Test Coverage | Happy path AND Not Found / missing-field edge cases? |
| Code Clarity | Self-explanatory names? Logic clear without comments? |
| DRY Principle | Duplicated logic that should be shared? |
| Dependency Safety | Vulnerable or inappropriate package versions? |
| Stack fit | Python web app aligned with architecture / impl-plan? |

## Output template

```markdown
# Code Review

## Summary

## Critical (must fix)

## Warnings (should fix)

## Suggestions (consider)

## Checklist Results

| Area | Pass/Fail | Notes |
|------|-----------|-------|
| Correctness | | |
| Security | | |
| Error Handling | | |
| Test Coverage | | |
| Code Clarity | | |
| DRY Principle | | |
| Dependency Safety | | |

## Recommended Fixes (ordered)

## Ready for Verify Stage? (yes/no)
```
