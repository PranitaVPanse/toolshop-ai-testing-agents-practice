# Toolshop test framework

BDD test framework for the Toolshop (https://practicesoftwaretesting.com), with an exploratory
testing agent that decides what is worth automating.

The agent takes a user story, explores the running application with Playwright MCP and writes
an automation-readiness report. The QA engineer reads it, corrects it and signs it off. Only
then is any automation code written, and only for the rows marked "automate now".

## Layout

```
EXPLORE (the agent)
skills/exploratory-testing/   the app-agnostic skill: SKILL.md, heuristics, locator rubric, report template
.claude/skills/               pointer that makes the skill invocable as /exploratory-testing
context/toolshop.context.md   everything specific to the application under test
stories/                      user stories as markdown (fallback when Jira is not used)
reports/<story>/<run>/        the agent's output: report.md, ledger.md, evidence/

AUTOMATE (the BDD framework, fed by signed-off reports)
features/                     Gherkin feature files
src/steps/                    step definitions, plus fixtures.ts where page objects are registered
src/pages/                    page objects, all extending base.page.ts
src/locators/                 one locators file per page
src/support/                  helpers such as prefixed test data names
config/env.ts                 environment settings and demo users, read from .env
playwright.config.ts          playwright-bdd wiring, headless Google Chrome, Allure reporter
allurerc.mjs                  Allure 3 report settings (single-file HTML)
test-output/                  generated specs, traces, allure-results, allure-report (git-ignored)

PROJECT
scripts/                      start, stop and reset the local application under test
.mcp.json                     Playwright MCP server for the agent
```

## Run the BDD tests

```bash
npm test
```

```bash
npm run report:generate
```

```bash
npm run report:open
```

`npm run test:headed` shows the browser. The report is one self-contained file,
`test-output/allure-report/index.html`.

## Setup

```bash
npm install
```

```bash
npx playwright install chromium
```

Copy `.env.example` to `.env`. Then start the Toolshop locally (Docker Desktop must be running;
the first start takes several minutes):

```bash
npm run aut:up
```

## Run the agent

Open this folder in Claude Code and approve the `playwright` MCP server from `.mcp.json`. Then:

```
/exploratory-testing stories/checkout-incomplete.md
```

## Guardrails

No destructive actions. Prefixed test data and cleanup. No CAPTCHA or bot-check bypassing. Demo
applications and demo credentials only. No automation code before sign-off. Nothing is posted
to Jira without approval.
