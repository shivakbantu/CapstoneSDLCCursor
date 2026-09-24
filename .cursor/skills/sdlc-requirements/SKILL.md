---
name: sdlc-requirements
description: Captures Agentic SDLC Step 1 requirements from a user story (Jira/Confluence/Word/paste). Clarifies ambiguity, then writes requirements.md. Use when starting a story, refining requirements, or when requirements-agent / sdlc-master runs Stage 1.
---

# SDLC Requirements

## Steps

1. Obtain the user story (Jira REST API via `api-conf.properties`, Confluence/file, or user paste).
2. Ask clarifying questions (scope, actors, I/O, edge cases, NFRs, acceptance). Wait for answers.
3. Write `requirements.md` using the template below (default delivery: Python web app; verify via Playwright).
4. Write `docs/sdlc/01-requirements-response.md` and open the Stage 1 PR.
5. Stop for human approval before Stage 2.

## Clarification checklist

- In-scope vs out-of-scope
- Actors and primary flows
- Inputs/outputs (doc sync sources & targets)
- Edge cases: missing files, empty repos, Not Found fields
- Security: no secrets in output
- Testable acceptance criteria
- Python web app + Playwright E2E expectations (unless story overrides)

## Template

```markdown
# Requirements

## User Story

## Clarifications (Q&A summary)

## Functional Requirements

1. …

## Non-Functional Requirements

1. …

## Acceptance Criteria

- [ ] …

## Out of Scope

## Open Questions (if any remain)
```

## Done when

- Ambiguities resolved or listed under Open Questions
- Acceptance criteria are testable
- User explicitly approves `requirements.md`
