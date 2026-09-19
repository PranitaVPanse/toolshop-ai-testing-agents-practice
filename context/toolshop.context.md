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

## Automation stack and conventions

- TypeScript, Playwright Test, playwright-bdd, Allure reporting. Tests run in Google Chrome, headless.
- Features in `features/`, step definitions in `src/steps/`, page objects in `src/pages/`
  (all extend `BasePage`), one locators file per page in `src/locators/`, settings in `config/env.ts`.
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
