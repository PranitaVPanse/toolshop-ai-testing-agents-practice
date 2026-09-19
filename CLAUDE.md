# Toolshop test framework

BDD test framework for the Toolshop, plus an exploratory testing agent. The agent takes a user
story, explores the running app with Playwright MCP and writes an automation-readiness report.
The QA engineer makes the final decisions.

## How to run the agent

`/exploratory-testing stories/checkout-incomplete.md`

- Skill: `skills/exploratory-testing/` (app-agnostic. Keep anything about Toolshop out of it)
- Project context file: `context/toolshop.context.md`
- Stories: `stories/`
- Reports: `reports/<story-id>/<YYYYMMDD-HHmm>/`
- Browser: the `playwright` MCP server from `.mcp.json`. Do not use any other browser tool
  for an exploration run. Results must be comparable with Playwright's Planner agent.

## BDD framework

`features/` (Gherkin), `src/steps/` (step definitions, import Given/When/Then from
`src/steps/fixtures.ts`), `src/pages/` (page objects extending `BasePage`), `src/locators/`
(one `<page>.locators.ts` per page, no inline selectors in page objects), `config/env.ts`.
Run with `npm test` (headless Google Chrome), then `npm run report:generate` for Allure.
Keep this structure. Do not add new top-level folders without asking.

## Working rules

- Ask the QA engineer before choosing anything they have not specified. Record every decision
  in `docs/DECISIONS.md`. The `docs/` folder is local working notes and is git-ignored. Never
  commit it, and never reference its content from committed files.
- Never write automation code (features, steps, page objects) until a report is signed off,
  and then only for its "automate now" rows.
- Never post to Jira without approval in the conversation. Tokens come from environment
  variables only. Never write them to a file.
- During an exploration run, do not read anything under `docs/` or earlier reports for the same
  story. They can contain known gaps, known-bug lists and previous answers, and reading them
  would invalidate the run.
- Use the local app by default. The hosted with-bugs environment is for evaluation runs only.
