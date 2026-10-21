# Page: Cart and checkout

Route `/checkout`. One page with steps: cart, sign in, billing address, payment, confirmation.
Sources: (docs), (TS-1 draft), (run of 2026-10-10, unversioned).

## Main functionality

- Cart table: item, quantity (editable number field, min 1, max 99), price, line total, cart
  total, remove control per line (docs, run of 2026-10-10).
- Changing a quantity shows "Product quantity updated." and recalculates totals (run of 2026-10-10).
- A rental line shows "Item for rent, price per hour"; its "quantity" is the duration in hours
  (run of 2026-10-10).
- Sign in step: login form, or continue as a logged-in customer (docs).
- Billing address: prefilled from the profile for a logged-in customer; required fields (docs).
- Payment: several methods with their own validation; confirmation creates an invoice (docs).

## Stable locators (verified in a report)

| Element | Locator | Grade | Source |
|---|---|---|---|
| Cart link in header | `getByRole('link', { name: 'cart' })` | A | run of 2026-10-10 |
| Cart badge | `getByTestId('cart-quantity')` | A | run of 2026-10-10 |
| Cart line | `getByRole('row', { name: /<item>/ })` | A | run of 2026-10-10 |
| Line quantity | `getByRole('spinbutton', { name: 'Quantity for <item>' })` | B | run of 2026-10-10 |
| Line price, line total, cart total | `getByTestId('product-price')`, `getByTestId('line-price')`, `getByTestId('cart-total')` | A | run of 2026-10-10 |

## Known quirks

- Every cart load logs "TypeError: Cannot read properties of undefined (reading 'cart_items')";
  the cart still renders (run of 2026-10-10). Tests must not assert a clean console here.
- The remove control is an anchor with no role, name or test id; only `.btn-danger` inside the
  row works (run of 2026-10-10, testability request open).
- Money format differs from the details page: "$1,365.00" here, "$1365.00" there (run of 2026-10-10).
- The cart badge can lag more than 10 seconds behind an add (run of 2026-10-10).

## Regression checks when this page changes

Cart badge on every page, invoice totals under Account > Invoices, the sign-in step with an
existing visitor cart (cart survives login, run of 2026-10-10).
