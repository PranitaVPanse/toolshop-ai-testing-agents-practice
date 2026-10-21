# Exploratory testing agent

The agent reads a user story, explores the running app through Playwright MCP, and writes an
automation-readiness report. It recommends. The QA engineer decides.

## Run it

Open the repo in Claude Code, approve the `playwright` MCP server, start the app (`npm run aut:up`), then:

```
/exploratory-testing tests/exploratory/stories/rentals-overview.md
```

Render the report as a web page:

```
npm run report:explore -- tests/exploratory/reports/TS-2/v0.1
```

## Files

| Path | Purpose |
|---|---|
| `.claude/skills/exploratory-testing/SKILL.md` | The workflow, guardrails, evidence tags, budget rules, versioning and sign-off |
| `.claude/skills/exploratory-testing/heuristics.md` | Test idea prompts: SFDIPOT, CRUD, boundaries, interruptions, roles, error recovery |
| `.claude/skills/exploratory-testing/locator-rubric.md` | Locator order, uniqueness check, grades A to D, testability requests |
| `.claude/skills/exploratory-testing/report-template.md` | The 8-section report, its appendix files and a self-check |
| `tests/exploratory/context.md` | Everything app-specific: URLs, roles, budgets, test data rules, constraints |
| `tests/exploratory/knowledge/` | Domain knowledge the QA engineer maintains: `e2e-flows.md`, `rules.md`, `decisions.md`, `pages/<page>.md` |
| `tests/exploratory/stories/` | User stories as markdown |
| `tests/exploratory/reports/<story>/<vX.Y>/` | Committed for signed versions: `report.md`, `qa-review.md` (the QA engineer's input), `scenarios.feature`, `locators.md`. Local only (git-ignored): `report.html`, `technical.md`, `ledger.md`, `evidence/`, and every draft version |
| `helpers/report-html.mjs` | Renders a report folder to one self-contained `report.html` |

The skill is app-agnostic. To test another app, replace the context file and the knowledge files.

## Workflow

0. Read the previous version's QA decisions and answers, if there is one. Plan a reduced run.
1. Read the story, the context and the knowledge files. Write the expected workflow, the gaps
   and the regression candidates from the impact map. No browser yet.
2. Explore within a time box and action budget (default 20 minutes, 60 actions).
3. Tag every finding Observed, Inferred or Assumed, with evidence.
4. Verify locators: "verified" means exactly one match.
5. Record console errors, failed network calls, accessibility observations (in `technical.md`).
6. With an OpenAPI document, say which checks belong at API level.
7. Write the report and its appendices, render it, and stop.

## Versions and sign-off

```
reports/TS-2/
  v0.1/   first draft
  v0.2/   re-run after the QA engineer filled in the Answer and QA decision columns
  v1.0/   signed off: decisions applied, no browser run
```

The QA engineer fills in one file in the latest draft, `qa-review.md`: answers to the open
questions, a decision per scenario and, for Jira stories, whether to post the comment. Running
the skill again produces the next draft, re-exploring only what is still pending; the rendered
report shows the answers and decisions as extra columns. Saying "sign off" (or passing
`sign-off` as the second argument) produces `vX.0`, appends every decision to
`knowledge/decisions.md`, copies the evidence it cites into the signed version, and deletes the
draft folders. Drafts are never committed: the signed version is the record, and the local audit
files keep how it was reached.

## After the report

Only the signed "automate now" rows become features in `tests/features/`. The Gherkin for them
is already in the signed version's `scenarios.feature`.

## Stories from Jira

The `atlassian` MCP server in `.mcp.json` connects to Jira Cloud with OAuth, so no token is stored.
Sign in once: open Claude Code in the repo, run `/mcp`, select `atlassian` and finish the sign-in
in the browser. Then run the agent with an issue key:

```
/exploratory-testing KAN-1
```

The agent reads the issue from Jira at every run (no copy is kept in the project) and records the
issue's last-updated time in the report header. It drafts a comment with the open questions in
the "Jira comment" section of `qa-review.md`. Edit the text if you like and tick
"Post this comment": the next run posts it exactly as written. You can also say yes in the
conversation. Creating, editing or moving issues is blocked in the project settings.
