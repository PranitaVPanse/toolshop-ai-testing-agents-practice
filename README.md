# Toolshop AI testing agents practice

BDD test framework for the [Toolshop](https://practicesoftwaretesting.com) practice site, plus an
AI exploratory testing agent that decides what is worth automating before any test is written.

**Stack:** TypeScript, Playwright, playwright-bdd, Allure, Playwright MCP, Atlassian (Jira) MCP.

## Quick start

```bash
npm install
```

```bash
cp .env.example .env
```

```bash
npm run aut:up
```

```bash
npm test
```

```bash
npm run report
```

`aut:up` starts the Toolshop locally with Docker (the first start takes several minutes). The
Allure report is written to `test-output/allure-report/index.html` as one self-contained file.

## Structure

```
.claude/skills/   exploratory testing agent (skill)
.github/          CI workflow
.husky/           pre-commit hook (lint + format staged files)
docs/             framework and agent documentation
helpers/          env settings, test data, global setup, local app script
tests/
  features/       Gherkin feature files
  steps/          step definitions and fixtures
  pages/          page objects
  locators/       one locators file per page
  exploratory/    agent inputs (context, stories, knowledge) and outputs (versioned reports)
```

## Commands

| Command | What it does |
|---|---|
| `npm test` | Run all scenarios in headless Chrome |
| `npm run test:smoke` | Run `@smoke` scenarios only |
| `npm run test:headed` | Run with the browser visible |
| `npm run report` / `report:open` | Build / serve the Allure report |
| `npm run lint` / `format` / `typecheck` | Code quality checks |
| `npm run aut:up` / `aut:down` / `aut:reset` | Start, stop, re-seed the local Toolshop |

## Exploratory testing agent

Run it in Claude Code on a Jira issue or a markdown story:

```
/exploratory-testing KAN-2
```

It explores the running app, writes a versioned automation-readiness report, and waits for the
QA engineer's answers and decisions in `qa-review.md`. Drafts (`v0.1`, `v0.2`, ...) stay local;
only signed versions (`v1.0`) are committed. See [docs/exploratory-agent.md](docs/exploratory-agent.md).

### User stories

The stories live in Jira (project `KAN`). The agent reads them from Jira at every run. For readers
of this repository they are mirrored as markdown in `tests/exploratory/stories/`:

| Jira issue | Mirror | Story |
|---|---|---|
| KAN-1 | `KAN-1.md` | Rentals page (also kept as `rentals-overview.md`, TS-2) |
| KAN-2 | `KAN-2.md` | Power Tools category page (also kept as `category-power-tools.md`, TS-4) |
| - | `checkout-incomplete.md` | Checkout (TS-1), markdown only |
| - | `contact-form.md` | Contact form (TS-3), markdown only |

To use your own Jira, sign in to the `atlassian` MCP server once with `/mcp` in Claude Code. The
site address is a placeholder (`<your-site>.atlassian.net`); the agent finds your site itself.

### Sample reports

Real draft reports from this project, with their evidence, in
[docs/sample-reports/](docs/sample-reports/). Open `report.html` in a browser.

| Sample | Story | Shows |
|---|---|---|
| `TS-2-v0.1` | Rentals page | A first run |
| `TS-3-v0.3` | Contact form | A third run that carries earlier results and the QA engineer's answers |
| `KAN-2-v0.2` | Power Tools category (Jira) | A re-run of a Jira story with a Jira comment draft |

## Documentation

- [docs/test-framework.md](docs/test-framework.md): how the layers fit together
- [docs/exploratory-agent.md](docs/exploratory-agent.md): running the agent and reading its report
- [CONTRIBUTING.md](CONTRIBUTING.md): conventions for adding tests

## License

[MIT](LICENSE)
