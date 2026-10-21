# Project context: Toolshop

Read by the exploratory testing agent before every run. Facts here are maintained by the QA
engineer. If something here contradicts what you observe, report it as a finding.

## Application

| | |
|---|---|
| Name | Toolshop (Practice Software Testing), sprint 5 |
| Type | Angular single-page app, Laravel REST API, MariaDB |
| Source | https://github.com/testsmith-io/practice-software-testing |

## Environments

| Name | UI | API | OpenAPI | Use for |
|---|---|---|---|---|
| local (default) | http://localhost:4200 | http://localhost:8091 | http://localhost:8091/api/documentation | demos and normal runs |
| with-bugs (hosted) | https://with-bugs.practicesoftwaretesting.com | https://api-with-bugs.practicesoftwaretesting.com | https://api-with-bugs.practicesoftwaretesting.com/api/documentation | evaluation runs only, when the QA engineer says so |

Allowed hosts for a run: the UI and API hosts of the chosen environment, nothing else.
The local environment is started with `npm run aut:up` and reset with `npm run aut:reset`.

## Roles and credentials

Demo accounts only. Values come from environment variables (see `.env.example`). Never print
passwords in the ledger, report or evidence.

| Role | Email variable | Password variable | Notes |
|---|---|---|---|
| Admin | `AUT_ADMIN_EMAIL` | `AUT_ADMIN_PASSWORD` | Manages products, orders, users |
| Customer | `AUT_CUSTOMER_EMAIL` | `AUT_CUSTOMER_PASSWORD` | Shared seeded account. Do not change its profile, password or address |
| Visitor | none | none | Not logged in |

## Budgets

| | |
|---|---|
| Time box | 20 minutes |
| Action budget | 60 browser actions |
| Reports location | `tests/exploratory/reports/<story-id>/<vX.Y>/` (versioned, see the skill) |
| Report rendering command | `npm run report:explore -- <report folder>` writes `report.html` next to `report.md` |

## Issue tracker

| | |
|---|---|
| Tracker | Jira Cloud, through the `atlassian` MCP server (Atlassian Rovo MCP, OAuth; no token in any file) |
| Site | `https://<your-site>.atlassian.net`. The agent does not need the address: the MCP server lists the signed-in account's site (`getAccessibleAtlassianResources`) |
| Project | `KAN` |
| Story for an issue | Read from Jira at every run; the report header records the issue's last-updated time. `stories/<issue key>.md` files are mirrors for readers of the repository, not inputs: do not read them in a Jira run |
| Report folder for an issue | `tests/exploratory/reports/<issue key>/` |
| Allowed | Read issues and their comments. Add one comment per version with the open questions, only when the QA engineer ticks "Post this comment" in that version's `qa-review.md` (the next run posts it) or says yes in the conversation |
| Not allowed | Create, edit, transition or delete issues; edit or delete comments |

Known issues: `KAN-1` is the Rentals story (the same story as `stories/rentals-overview.md`, TS-2).
`KAN-2` is the Power Tools category story (the same story as `stories/category-power-tools.md`, TS-4).

## Knowledge files

Folder `tests/exploratory/knowledge/`, maintained by the QA engineer. Read in the order the
skill gives. Everything taken from here is Assumed with the file as its source.

| File | Holds |
|---|---|
| `e2e-flows.md` | Pages and routes, end-to-end flows, shared state, and the impact map used for regression scenarios |
| `rules.md` | Business rules, each with a source and a date |
| `decisions.md` | QA decisions and answered questions from signed-off reports. The agent appends to it at sign-off |
| `pages/<page>.md` | Main functionality, verified locators, quirks and regression checks for one page. Read only the pages the story touches and their impact-map rows |

## Automation stack and conventions

- TypeScript, Playwright Test, playwright-bdd, Allure reporting. Tests run in Google Chrome, headless.
- Features in `tests/features/`, step definitions in `tests/steps/`, page objects in `tests/pages/`
  (all extend `BasePage`), one locators file per page in `tests/locators/`, settings in `helpers/env.ts`.
- Page objects never contain inline selectors. They use the page's locators file.
- Locator convention: follow the skill's rubric order (role, label, placeholder, text, test id,
  scoped CSS). The test id attribute is `data-test` (configured as `testIdAttribute` in
  `playwright.config.ts`), so `getByTestId('x')` matches `[data-test="x"]`.
- The app is offered in several languages. Tests run in English only. Treat visible text as
  translatable when grading locators.

## Existing automation

| Kind | Exists today |
|---|---|
| Framework | `BasePage`, BDD fixtures, env config, Allure. No page-specific code yet |
| Page objects | `LoginPage`, `AccountPage` |
| Locator files | `login.locators.ts`, `account.locators.ts` |
| Feature files | `login.feature`: customer login, admin login, unknown user rejected, required fields |
| Step definitions | `login.steps.ts` |
| API tests | none |

## Test data rules

- Prefix everything you create with `ETA-` followed by the run timestamp, for example
  `ETA-20260919-1412 Hammer`.
- Payment: never enter real payment data. Use obviously fake values such as account name
  `ETA Test`, account number `123456789`, card number `0000-0000-0000-0000`. If a field
  rejects fake values, record that and stop the path.
- Addresses: `ETA Test Street 1`, city `Testville`, country `Testland`, postcode `00000`.
- Orders placed by the agent cannot be deleted through the UI. List them in the report's
  cleanup section. They are removed by `npm run aut:reset`.
- Admin runs: edit only products you created, or the single product the story names. Restore
  any value you change and record before and after values in the ledger.
- Do not register new user accounts unless the story is about registration.

## Known constraints

- Seed data is reset by `npm run aut:reset`. Product IDs are not stable across resets, so never
  put an ID in a locator or a Gherkin step.
- Accounts lock after repeated failed logins. Do not try more than two wrong passwords per account.
- The hosted environments are shared with other people and reset on a schedule. Data you see
  there may not be yours.
- No CAPTCHA is expected on local. If one appears anywhere, stop the path and report it.

## Out of scope for every run

Performance and load, security testing, email delivery, the admin reporting pages unless the
story names them.
