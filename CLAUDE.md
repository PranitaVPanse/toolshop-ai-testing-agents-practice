# Toolshop AI testing agents practice

BDD test framework for the Toolshop, plus an exploratory testing agent. The QA engineer makes
the final decisions.

## Exploratory testing agent

Run: `/exploratory-testing tests/exploratory/stories/<story>.md`

- Skill: `.claude/skills/exploratory-testing/` (app-agnostic. Keep anything about Toolshop out of it)
- Context file: `tests/exploratory/context.md`
- Knowledge files: `tests/exploratory/knowledge/` (flows, rules, decisions, one file per page)
- Reports: `tests/exploratory/reports/<story-id>/<vX.Y>/`. Drafts are `vX.1`, `vX.2`, ...;
  a signed-off report is `vX.0`. `npm run report:explore -- <folder>` renders `report.html`.
- Sign-off: `/exploratory-testing <story> sign-off` writes the signed version, appends the
  decisions to `knowledge/decisions.md` and deletes the drafts' `evidence/` folders only.
- Browser: the `playwright` MCP server from `.mcp.json` only.
- Jira: the `atlassian` MCP server from `.mcp.json` (OAuth, run `/mcp` once to sign in). Run the
  agent on an issue with `/exploratory-testing KAN-1`. Site, project and rules are in the context file.

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
- Never post to Jira without approval: a yes in the conversation, or the QA engineer's tick on
  "Post this comment" in that version's `qa-review.md`. No token is stored; Jira uses OAuth.
- Exploratory reports: only signed versions (`v1.0`, `v2.0`, ...) are committed. Drafts and every
  version's `report.html`, `technical.md`, `ledger.md` and `evidence/` stay local (git-ignored).
- During an exploration run, do not read `.local/`. A first run of a story (`v0.1`) reads no
  earlier reports. A re-run reads the earlier versions of the same story as the skill's step 0
  says: their results are carried forward with their version and evidence ID, never presented as
  observed in this run.
- Use the local app by default. The hosted with-bugs environment is for evaluation runs only.
