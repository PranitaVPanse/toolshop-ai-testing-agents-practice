# Locators

One file per page: `<page>.locators.ts`. It exports one factory that takes the Playwright
`Page` and returns named locators. No actions, no assertions, no waits.

```ts
import type { Page } from '@playwright/test';

export const examplePageLocators = (page: Page) => ({
  saveButton: page.getByRole('button', { name: 'Save' }),
  nameInput: page.getByLabel('Name'),
});

export type ExamplePageLocators = ReturnType<typeof examplePageLocators>;
```

Rules:

- Follow the order in `skills/exploratory-testing/locator-rubric.md`: role, label, placeholder,
  text, test id (`getByTestId` matches `data-test`), scoped CSS last.
- Only use locators that a signed-off automation-readiness report verified at grade A or B.
  Put the report's evidence ID in a comment when the choice is not obvious.
- Never put a product ID or other seed-data ID in a locator.
