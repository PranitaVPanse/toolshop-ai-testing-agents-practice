# Locators: TS-2 v0.1

Counts were taken with Playwright `locator.count()` in read-only code-run calls (actions 44, 46,
53), in the state named. The browser tool does not use the project's `testIdAttribute`, so
`getByTestId('x')` was counted as `locator('[data-test="x"]')`, which the project config makes
equivalent. Grades follow the rubric; role-and-name and text locators lose one grade because the
app is multilingual. Product names are data from the story and are not translated (E-19).

Summary: 27 stable (A or B), 8 at risk (C), 2 blocked (D).

## Rentals overview (`/rentals`, logged-in customer, English, E-27)

| Element | State | Recommended locator | Strategy | Matches | Role / accessible name | Grade | Tag | Evidence |
|---|---|---|---|---|---|---|---|---|
| Categories menu | menu closed | `getByRole('button', { name: 'Categories' })` | 1 | 1 | button "Categories" | B | Observed | E-27, E-01 |
| Rentals menu entry | in DOM, menu closed | `getByTestId('nav-rentals')` | 5 | 1 | link "Rentals" | A | Observed | E-27, E-01 |
| Page heading | page loaded | `getByRole('heading', { name: 'Rentals', level: 1 })` | 1 | 1 | heading "Rentals" | B | Observed | E-27 |
| Card name (each of 3) | cards rendered | `getByRole('heading', { name: '<item>', exact: true })` | 1 | 1 each | heading level 5 | A | Observed | E-27 |
| Card photo (each of 3) | cards rendered | `getByRole('img', { name: '<item>', exact: true })` | 1 | 1 each | img "<item>" | A | Observed | E-27 |
| Card count | cards rendered | `getByRole('heading', { level: 5 })` | 1 | 3 (expected 3) | | A | Observed | E-27 |
| Card description | cards rendered | `locator('.card').filter({ has: <card name> }).locator('p')` | 6 | 1 | paragraph, no name | C | Observed | E-27 |
| Language selector | any page | `getByTestId('language-select')` | 5 | 1 | button "Select language" | A | Observed | E-27 |

The Rentals entry's role candidate `getByRole('link', { name: 'Rentals' })` was not counted in this
run (proposed, not verified, Assumed from E-01). The entry is only visible after the Categories menu is opened.

## Rental details (Crane, logged-in customer, English, duration 1, E-28)

| Element | State | Recommended locator | Strategy | Matches | Role / accessible name | Grade | Tag | Evidence |
|---|---|---|---|---|---|---|---|---|
| Name | details loaded | `getByRole('heading', { name: '<item>', level: 1 })` | 1 | 1 | heading level 1 | A | Observed | E-28 |
| Category | details loaded | `getByLabel('category')` | 2 | 1 | generic "category" | A | Observed | E-28 |
| Brand | details loaded | `getByLabel('brand')` | 2 | 1 | generic "brand" | A | Observed | E-28 |
| Hourly price | details loaded | `getByLabel('unit-price')` | 2 | 1 | "unit-price" | A | Observed | E-28 |
| "per hour" unit | details loaded | `getByText('per hour', { exact: true })` | 4 | 1 | text | C | Observed | E-28 |
| Total | details loaded | `getByText(/\(Total \$[\d.,]+\)/)` | 4 | 1 | text, holds data | C | Observed | E-28 |
| Duration label | details loaded | `getByText(/^Duration \(\d+ hour\(s\)\)$/)` | 4 | 1 | text, not associated with the slider | C | Observed | E-28 |
| Duration slider | details loaded | `getByRole('slider')` | 1 | 1 | slider "ngx-slider" (generic name) | B | Observed | E-28, E-04 |
| Add to cart | details loaded | `getByRole('button', { name: 'Add to cart' })` | 1 | 1 | button "Add to cart" | B | Observed | E-28 |
| Add to favourites | details loaded | `getByRole('button', { name: 'Add to favourites' })` | 1 | 1 | button | B | Observed | E-28 |
| Compare | details loaded | `getByRole('button', { name: 'Compare' })` | 1 | 1 | button | B | Observed | E-28 |
| Description | details loaded | `getByTestId('product-description')` | 5 | 1 | paragraph | A | Observed | E-28 |
| CO2 rating scale | details loaded | `getByTestId('co2-rating-badge')` | 5 | 1 | generic with a long description | A | Observed | E-28 |
| Active CO2 letter | details loaded | `locator('.co2-letter.active')` | 6 | 1 | none | C | Observed | E-28, E-04 |
| Photo | details loaded | `getByRole('figure').getByRole('img', { name: '<item>' })` | 1 scoped | 1 | img "<item>" | B | Observed | E-28 |
| Photo credit | details loaded | `getByRole('figure').getByText(/Photo by/)` | 4 scoped | 1 | text | C | Observed | E-28 |
| Related products heading | details loaded | `getByRole('heading', { name: 'Related products' })` | 1 | 1 | heading level 2 | B | Observed | E-28 |
| Related item | details loaded | `getByRole('link', { name: /<item>/ })` | 1 | 1 | link "<item> More information" | B | Observed | E-28 |
| Add-to-cart confirmation | after add | none: no element appeared | | 0 | | D | Observed | E-06, E-07, E-22 |
| Compare result or indicator | after Compare | none: no element appeared, `/compare` is not a route | | 0 | | D | Observed | E-17, E-18 |

Also counted: `getByTestId('add-to-cart')`, `getByTestId('add-to-favorites')`, `getByTestId('add-to-compare')`,
`getByTestId('unit-price')`, `getByTestId('product-name')`: 1 each (grade A fallbacks). `getByTestId('total-price')`
0 and `getByLabel(/Duration/)` 0. The total's number sits in `<span id="total-price">`;
`locator('#total-price')` is proposed, not verified (count not taken, Assumed from the DOM read in E-28).

## Cart (`/checkout`, logged-in customer, one line, E-33)

| Element | State | Recommended locator | Strategy | Matches | Role / accessible name | Grade | Tag | Evidence |
|---|---|---|---|---|---|---|---|---|
| Cart link | header | `getByRole('link', { name: 'cart' })` | 1 | 1 | link "cart" | A | Observed | E-27 |
| Cart badge | cart not empty | `getByTestId('cart-quantity')` | 5 | 1 | none | A | Observed | E-33 |
| Cart line | one line | `getByRole('row', { name: /<item>/ })` | 1 | 1 | row | A | Observed | E-33 |
| Line quantity (hours) | one line | `getByRole('spinbutton', { name: 'Quantity for <item>' })` | 1 | 1 | spinbutton | B | Observed | E-33 |
| Unit price | one line | `getByTestId('product-price')` | 5 | 1 | cell | A | Observed | E-33 |
| Line total | one line | `getByTestId('line-price')` | 5 | 1 | cell | A | Observed | E-33 |
| Cart total | one line | `getByTestId('cart-total')` | 5 | 1 | cell | A | Observed | E-33 |
| Rental note | one line | `<row>.getByText('Item for rent, price per hour')` | 4 scoped | 1 | text | C | Observed | E-33 |
| Remove line | one line | `<row>.locator('.btn-danger')` | 6 | 1 | anchor, no role, no name (`<row>.getByRole('button')` 0) | C | Observed | E-33 |

`product-price` and `line-price` were counted with one line in the cart. With several lines they
must be scoped to the row; that state was not checked.

## Favourites (`/account/favorites`, E-30)

| Element | State | Recommended locator | Strategy | Matches | Role / accessible name | Grade | Tag | Evidence |
|---|---|---|---|---|---|---|---|---|
| Delete a favourite | 4 favourites | `locator('[data-test^="favorite-"]').filter({ has: <heading '<item>'> }).getByTestId('delete')` | 5 scoped | 1 (strict-mode click on the equivalent selector succeeded, action 50) | button, no name | B | Observed | E-30, E-32 |
