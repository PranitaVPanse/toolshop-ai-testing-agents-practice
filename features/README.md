# Features

One `.feature` file per page or per user story, in business language. Steps live in
`src/steps/<page>.steps.ts`, page objects in `src/pages/<page>.page.ts`, locators in
`src/locators/<page>.locators.ts`.

A scenario is added here only when it is an "automate now" row in a signed-off
automation-readiness report under `reports/`, or when the QA engineer asks for it directly.
Tag each scenario with the story id, for example `@TS-1`.
