# Page: Account

Routes `/account` and its sub-pages: `/account/profile`, `/account/favorites`,
`/account/invoices`, `/account/messages`. Logged-in customers only. Sources: (docs),
(run of 2026-10-10, unversioned).

## Main functionality

- Dashboard with links to the sub-pages (docs).
- Profile: update name, address and contact details; change password (docs). **Never do this on
  the shared demo account** (context file).
- Favourites: list of favourite products with a remove control per item (docs, run of 2026-10-10).
- Invoices: list of orders, detail view, PDF download (docs).
- Messages: contact-form messages sent by this customer (docs).

## Stable locators (verified in a report)

None verified yet. The favourite's delete control is an icon-only button with no accessible
name, and the only test id nearby contains the record id (run of 2026-10-10, grade D).

## Known quirks

- The shared demo customer has three favourites that belong to the seed data. Leave them.
- Favourites created by a test must be removed in the same run (context file).

## Regression checks when this page changes

Add to favourites on product details (F3), the checkout sign-in step (prefilled address),
invoices after a checkout (F1).
