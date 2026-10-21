# Page: Home and product overview

Route `/`, and `/category/<slug>` for one category. Sources: (docs).

## Main functionality

- Product grid with photo, name and price; a product card opens the details page (docs).
- Search by name; filter by category (hierarchical) and brand; filters combine (docs).
- Sorting by name and price; price range slider; pagination (docs).
- Discount price shown next to the original price where a discount applies (docs).
- Out-of-stock indicator on the card (docs).
- Rental products: whether they appear in this grid, in search and in category pages is open
  (run of 2026-10-10, not explored).

## Stable locators (verified in a report)

None verified yet.

## Known quirks

- Every page load as a visitor logs two 401 responses for `GET /users/me` (run of 2026-10-10). Not a
  defect of this page; expect it everywhere.

## Regression checks when this page changes

Category pages, rentals overview (same product data), related products on the details page,
the cart badge in the header.
