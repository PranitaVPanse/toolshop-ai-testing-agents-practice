# Business rules: Toolshop

One rule per line, with its source and the date it was written down. The agent treats every rule
as **Assumed** from this file. When a rule and a story disagree, the agent reports it as a
question instead of choosing. Sources: (docs), (story <id>), (TS-n vX.Y), (QA, date).

## Products and prices

- Prices are in USD and exclude tax (story TS-2 assumptions, 2026-10-10).
- A product the API reports as `in_stock: false` shows "Out of stock" on its details page and
  cannot be added to the cart (docs: product detail AC 9, 2026-10-10). Not yet seen on local.
- Discounts exist for geo-location and for combined products (docs). Rules unknown.

## Rentals

- Rental duration is whole hours, 1 to 10, default 1 (story TS-2 AC 5, 2026-10-10).
- Total = hourly price × duration, two decimals, updated as the duration changes (story TS-2 AC 6).
- Durations over 10 hours are out of scope (story TS-2). Whether the cart must enforce this is
  open: see TS-2 Q-02.

## Cart and checkout

- Cart lines have an editable quantity and a remove control (docs).
- A visitor can fill a cart and must sign in or register at the checkout sign-in step (docs).

## Accounts

- Favourites need a logged-in customer (run of 2026-10-10, API returns 401 for a visitor).
- Accounts lock after repeated failed logins. Never try more than two wrong passwords (docs,
  context file).
- The shared demo customer account is never changed: no profile, password or address edits
  (context file).
