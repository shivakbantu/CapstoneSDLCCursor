# MCP & API setup (Agentic SDLC)

GitHub and Jira use **REST APIs** via `api-conf.properties` (not MCP). **Playwright MCP is required** for Stage 7 (Verify) test-script authoring and browser checks.

## GitHub & Jira API (stories / per-stage PRs)

1. Copy `api-conf.properties.example` → `api-conf.properties` at the repo root.
2. Fill in tokens and project identifiers. **Never commit** `api-conf.properties`.
3. Stage agents read this file for outbound calls:
   - **requirements-agent** — Jira REST API for user stories
   - **Every stage agent / pr-agent** — GitHub REST API (or `gh` CLI) for **stage PRs** after each phase and the **final PR** at Stage 8

### Property keys

| Key | Purpose |
|-----|---------|
| `github.baseUrl` | GitHub API host (default `https://api.github.com`) |
| `github.token` | Personal access token |
| `github.owner` / `github.repo` | Target repository |
| `github.defaultBranch` | PR base branch |
| `jira.baseUrl` | e.g. `https://your-domain.atlassian.net` |
| `jira.email` | Atlassian account email |
| `jira.apiToken` | [Jira API token](https://id.atlassian.com/manage-profile/security/api-tokens) |
| `jira.projectKey` | Default project key |
| `jira.apiPath` | Usually `/rest/api/3` |

Auth reminder: Jira Cloud uses Basic auth with `email:apiToken` (Base64). Do not put tokens in agent prompts, PR bodies, or synced docs.

## Playwright MCP (required for Verify)

1. Ensure `.cursor/mcp.json` includes the `playwright` server (see `.cursor/mcp.json.example`).
2. Cursor Settings → MCP → refresh / restart if the server does not appear.
3. **verify-agent** uses Playwright MCP to **write and run** E2E/browser test scripts against the Python web app (Stage 5).

| Server | Stage agents | Purpose |
|--------|--------------|---------|
| `playwright` | `verify-agent` | Author Playwright test scripts; run UI/E2E smoke checks |

## Docs platform

If Automated Documentation Sync targets Notion/Confluence/GitHub wiki, configure that vendor’s REST API in `api-conf.properties` (add keys as needed) and reference them from `architecture.md` Interfaces — prefer APIs over MCP for this project.
