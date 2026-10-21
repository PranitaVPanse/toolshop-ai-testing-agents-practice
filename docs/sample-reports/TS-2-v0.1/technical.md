# Technical notes: TS-2 v0.1

## Console

| Action | Page | Level | Message | Count | Evidence |
|---|---|---|---|---|---|
| 1, 12, 20, 21 | every full page load as visitor | error | `GET /users/me` 401, then "ERROR {message: Unauthorized}" | 2 + 1 per load | E-09 |
| 10, 52 | `/checkout` | error | "TypeError: Cannot read properties of undefined (reading 'cart_items')" at `CartComponent_Template` | 3 as visitor, 7 as customer | E-09, E-34 |
| 11 | `/checkout` after quantity change | warning | Angular NG0956: tracking expression re-creates the whole collection | 1 | action 11 output |
| 17 | Crane details, visitor | error | `POST /favorites` 401 | 1 | E-15 |
| 20 | `/compare` | error | "NG04002: Cannot match any routes. URL Segment: 'compare'" | 1 | E-18 |
| several | any | warning | Preloaded `barn-2400x1600.avif` not used | 1 per load | action 14 output |

A test that asserts a clean console fails on every visitor page (401) and on the cart (TypeError).
No console error was logged on `/rentals` or on a rental details page for a logged-in customer.

## Network

Read once, at the end of the cart path as the customer (action 56, E-36): no failed call.
`GET /carts/<id>` 200, `DELETE /carts/<id>/product/<id>` 204, `GET /users/me` 200.
Failed calls known from the console: `GET /users/me` 401 (visitor), `POST /favorites` 401 (visitor).
The network list was not read on the other paths; this is a gap of this run.

## API level notes (OpenAPI: Toolshop API 5.0.0)

| Check | Endpoint | Used for |
|---|---|---|
| Only rentals are listed | `GET /products?is_rental=true` | S-03: assert the three names and that every item has `is_rental: true` |
| Related products rule | `GET /products/{productId}/related` | S-12, once Q-06 is answered |
| Duration limit in the cart | `POST /carts/{id}`, `PUT /carts/{cartId}/product/quantity` | S-10, S-11, once Q-02 is answered |
| Favourite needs login | `POST /favorites` without a token returns 401 | S-13 |
| Favourite setup and cleanup | `POST /favorites`, `DELETE /favorites/{favoriteId}` | S-14 |
| Cart setup and cleanup | `POST /carts`, `POST /carts/{id}`, `DELETE /carts/{cartId}` | S-08, S-20 |
| Availability | `ProductResponse.in_stock` is read-only: `ProductRequest` has no `in_stock` | S-16, Q-10 |

No API call was made in this run. The endpoints are Assumed from the OpenAPI document.

## Accessibility observations

These come from the snapshots and DOM reads of this run. They are observations, not an audit.

| # | Observation | Evidence | Request |
|---|---|---|---|
| 1 | Rental cards are plain `div`s: no link, no role, no `tabindex`. Mouse click works; nothing for keyboard or screen reader users to activate | E-25, E-27 | T-01 |
| 2 | The duration slider's accessible name is "ngx-slider"; the visible "Duration" label is not associated with it | E-04, E-28 | T-02 |
| 3 | The total next to the price is plain text in a `<small>`; it changes without a live region | E-28 | T-03 |
| 4 | The active CO2 letter is conveyed by colour and CSS class only | E-04, E-23 | T-05 |
| 5 | The cart's remove control is an anchor without `href`, role or name, holding only an icon | E-33 | T-04 |
| 6 | The favourite's delete button has no accessible name | E-30 | T-08 |
| 7 | The Compare button gives no feedback and has no pressed state | E-17 | Q-09 |
| 8 | Snapshots show the three action buttons on details without names, yet role-and-name locators match them. Likely a tool artefact (icon inside the button); not confirmed as a real accessibility problem | E-03, E-28 | none |
| 9 | Category and brand badges and the price use `aria-label` values that are developer words ("category", "unit-price"), which replace the visible text for screen readers | E-03, E-28 | none raised |
| 10 | At 375 px the floating chat button covers the first lines of the description | E-23 | Q-12 |

## Tool observations

- The click and navigate tools save their snapshot to a file at once, often before the app has
  rendered data (cards at action 12, cart badge at 8 and 25, favourites list at 50). Evidence for
  those states is a later DOM read.
- One selector of mine failed (action 28). It counts as an action and is not an app finding.
