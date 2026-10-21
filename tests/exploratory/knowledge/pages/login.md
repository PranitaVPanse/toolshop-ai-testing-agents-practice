# Page: Login, register, forgot password

Routes `/auth/login`, `/auth/register`, `/auth/forgot-password`. Sources: (docs), the
existing `login.feature` in this repository.

## Main functionality

- Login with email and password; a successful login lands on `/account` (login.feature).
- Unknown user or wrong password shows an error and stays on the page (login.feature).
- Email and password are required (login.feature).
- Register creates a customer account (docs). The agent does not register accounts unless the
  story is about registration (context file).
- Forgot password sends a reset email (docs). Email delivery is out of scope for every run.
- Accounts lock after repeated failed attempts. Never try more than two wrong passwords
  (docs, context file).
- Social login and two-factor authentication exist on the hosted site (docs). Not covered.

## Stable locators

See `tests/locators/login.locators.ts`. These are the locators the automated login scenarios
already use; prefer them over new proposals.

## Regression checks when this page changes

The checkout sign-in step (F1), favourites for a visitor (F3), every `/account` route, the
admin login.
