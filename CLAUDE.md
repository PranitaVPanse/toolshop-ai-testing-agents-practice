# Toolshop AI testing agents practice

BDD test framework for the Toolshop, plus an exploratory testing agent. The QA engineer makes
the final decisions.

## Exploratory testing agent

Run: `/exploratory-testing tests/exploratory/stories/<story>.md`

- Skill: `.claude/skills/exploratory-testing/` (app-agnostic. Keep anything about Toolshop out of it)
- Context file: `tests/exploratory/context.md`
- Reports: `tests/exploratory/reports/<story-id>/<YYYYMMDD-HHmm>/`
- Browser: the `playwright` MCP server from `.mcp.json` only.

## BDD framework

`tests/features/` (Gherkin), `tests/steps/` (import Given/When/Then from `fixtures.ts`),
`tests/pages/` (extend `BasePage`), `tests/locators/` (one file per page, no inline selectors in
page objects), `helpers/` (env, test data, setup). Keep this structure. Ask before adding
top-level folders. Conventions are in `CONTRIBUTING.md`.

## Working rules

- Ask the QA engineer before choosing anything they have not specified. Record decisions in
  `.local/DECISIONS.md`. `.local/` is git-ignored working notes. Never commit it or reference its
  content from committed files.
- Never write automation code for a story until its report is signed off, and then only for its
  "automate now" rows.
- Never post to Jira without approval in the conversation. Tokens come from environment variables only.
- During an exploration run, do not read `.local/` or earlier reports for the same story.
- Use the local app by default. The hosted with-bugs environment is for evaluation runs only.
