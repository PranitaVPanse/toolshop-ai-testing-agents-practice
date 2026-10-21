# Page: Product details

Route `/product/<id>`. Shared by normal products and rentals; the price unit and the
quantity-or-duration control differ. Sources: (docs), (run of 2026-10-10, unversioned).

## Main functionality

- Photo with credit, name, category and brand badges, CO2 rating scale, description (docs).
- Normal product: quantity selector with plus and minus, minimum 1, manual entry (docs).
- Rental: duration slider 1 to 10 hours, label "Duration (n hour(s))", total next to the hourly
  price (run of 2026-10-10).
- Add to cart updates the header badge and shows "Product added to shopping cart." (docs;
  the toast was seen on 1 of 3 adds in run of 2026-10-10).
- Add to favourites needs a login; Compare stores a selection for `/compare` (docs, run of 2026-10-10).
- Related products: cards linking to other products. On local the list is driven by category
  (run of 2026-10-10, inferred).
- Out of stock: message shown and add to cart blocked (docs). Not reproduced on local.

## Stable locators (verified in a report)

| Element | Locator | Grade | Source |
|---|---|---|---|
| Name | `getByRole('heading', { name: '<item>', level: 1 })` | A | run of 2026-10-10 |
| Category, brand | `getByLabel('category')`, `getByLabel('brand')` | A | run of 2026-10-10 |
| Unit price | `getByLabel('unit-price')` | A | run of 2026-10-10 |
| Duration slider | `getByRole('slider')` | B | run of 2026-10-10 |
| Add to cart, favourites, compare | `getByRole('button', { name: '<label>' })` | B (translated) | run of 2026-10-10 |
| Description | `getByTestId('product-description')` | A | run of 2026-10-10 |

## Known quirks

- The total and the duration label have no test id; only text locators work (run of 2026-10-10,
  testability request open).
- The slider's accessible name is "ngx-slider"; the visible label is not associated (run of 2026-10-10).
- The active CO2 letter is marked by CSS class only (run of 2026-10-10).
- Accessibility snapshots from the browser tool under-report the buttons on this page; use DOM
  reads for them (run of 2026-10-10).

## Regression checks when this page changes

Cart line and totals (F1, F2), favourites page (F3), compare page (F4), related products on
neighbouring products.
