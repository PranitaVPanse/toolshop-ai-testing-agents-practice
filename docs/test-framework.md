# Test framework

Each scenario passes through four layers. Each layer has one job.

```
tests/features/login.feature      WHAT is tested, in business language
        ↓ matched by text
tests/steps/login.steps.ts        HOW a sentence maps to page actions and assertions
        ↓ uses fixtures (fixtures.ts)
tests/pages/login.page.ts         WHAT a page can do (login, submit, open)
        ↓ uses
tests/locators/login.locators.ts  WHERE the elements are (selectors only)
```

A UI change touches one locators file. A flow change touches one page object. A new requirement
is new Gherkin.

## Supporting files

| File | Purpose |
|---|---|
| `helpers/env.ts` | Base URLs and demo users, read from `.env`. Fails clearly if a value is missing |
| `helpers/global-setup.ts` | Warms up the API before the run. Cold API routes on the local app take up to 10 s |
| `helpers/test-data.ts` | `prefixed('Hammer')` gives `BDD-20260927-101500 Hammer` |
| `helpers/aut.mjs` | Starts, stops and re-seeds the local Toolshop with Docker Compose |
| `playwright.config.ts` | Wires playwright-bdd, Chrome, timeouts, Allure |
| `allurerc.mjs` | Allure report settings (single self-contained HTML file) |

## Settings worth knowing

- Tests run in installed Google Chrome, headless. `npm run test:headed` shows the browser.
- One worker and a 30 s assertion timeout by default, because the local app is slow when cold. Hosted runs can use `WORKERS=4 EXPECT_TIMEOUT=15000 npm test`.
- `testIdAttribute` is `data-test`, which is what the Toolshop uses.
- Generated specs, traces and reports go to `test-output/` (git-ignored).
