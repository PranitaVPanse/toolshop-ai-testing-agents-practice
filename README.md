# Toolshop AI testing agents practice

BDD test framework for the [Toolshop](https://practicesoftwaretesting.com) practice site, plus an
AI exploratory testing agent that decides what is worth automating before any test is written.

**Stack:** TypeScript, Playwright, playwright-bdd, Allure, Playwright MCP.

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
  exploratory/    agent inputs (context, stories) and outputs (reports)
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

## Documentation

- [docs/test-framework.md](docs/test-framework.md): how the layers fit together
- [docs/exploratory-agent.md](docs/exploratory-agent.md): running the agent and reading its report
- [CONTRIBUTING.md](CONTRIBUTING.md): conventions for adding tests

## License

[MIT](LICENSE)
