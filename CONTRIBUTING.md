# Contributing

## Adding a scenario

1. Write the scenario in `tests/features/<area>.feature`. Business language, no selectors, no credentials.
2. Add step definitions in `tests/steps/<area>.steps.ts`. Import `Given`, `When`, `Then` from `./fixtures`.
3. Put page behaviour in `tests/pages/<page>.page.ts`, extending `BasePage`.
4. Put selectors in `tests/locators/<page>.locators.ts`. Page objects never contain inline selectors.
5. Register a new page object in `tests/steps/fixtures.ts`.

## Locators

Order of preference: role, label, placeholder, text, test id (`getByTestId` matches `data-test`),
scoped CSS last. A locator must match exactly one element. Never use seed-data IDs.

## Test data

Records created by tests start with `BDD-` (see `helpers/test-data.ts`). The agent uses `ETA-`.
Clean up what you create. Never change the shared demo accounts.

## What gets automated

Story scenarios are automated only from "automate now" rows of a signed-off report in
`tests/exploratory/reports/`.

## Before you commit

The pre-commit hook lints and formats staged files. CI runs `lint`, `format:check` and `typecheck`
on every push. The BDD job runs on demand against the hosted Toolshop and needs the repository
secrets `AUT_ADMIN_EMAIL`, `AUT_ADMIN_PASSWORD`, `AUT_CUSTOMER_EMAIL`, `AUT_CUSTOMER_PASSWORD`.
