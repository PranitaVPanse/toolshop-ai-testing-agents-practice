# Exploratory testing agent

The agent reads a user story, explores the running app through Playwright MCP, and writes an
automation-readiness report. It recommends. The QA engineer decides.

## Run it

Open the repo in Claude Code, approve the `playwright` MCP server, start the app (`npm run aut:up`), then:

```
/exploratory-testing tests/exploratory/stories/checkout-incomplete.md
```

## Files

| Path | Purpose |
|---|---|
| `.claude/skills/exploratory-testing/SKILL.md` | The 7-step workflow, guardrails, evidence tags, budget rules |
| `.claude/skills/exploratory-testing/heuristics.md` | Test idea prompts: SFDIPOT, CRUD, boundaries, interruptions, roles, error recovery |
| `.claude/skills/exploratory-testing/locator-rubric.md` | Locator order, uniqueness check, grades A to D, testability requests |
| `.claude/skills/exploratory-testing/report-template.md` | The 12-section report and a self-check |
| `tests/exploratory/context.md` | Everything app-specific: URLs, roles, budgets, test data rules, constraints |
| `tests/exploratory/stories/` | User stories as markdown |
| `tests/exploratory/reports/<story>/<run>/` | `report.md`, `ledger.md` (numbered action log), `evidence/` |

The skill is app-agnostic. To test another app, replace the context file.

## Workflow

1. Read the story and context, write the expected workflow and the gaps. No browser yet.
2. Explore within a time box and action budget (default 20 minutes, 60 actions).
3. Tag every finding Observed, Inferred or Assumed, with evidence.
4. Verify locators: "verified" means exactly one match.
5. Record console errors, failed network calls, accessibility observations.
6. With an OpenAPI document, say which checks belong at API level.
7. Write the report and stop.

## After the report

The QA engineer reviews the decision table (automate now, clarify first, keep exploratory, not
worth automating), corrects it and signs it. Only the signed "automate now" rows become features
in `tests/features/`.
