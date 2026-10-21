# Ledger: TS-2 Rentals overview, v0.1

| | |
|---|---|
| Story | TS-2 Customer browses and rents heavy equipment from the Rentals page (`tests/exploratory/stories/rentals-overview.md`, status Draft) |
| Version | v0.1 (first draft) |
| Environment | local: UI http://localhost:4200, API http://localhost:8091 |
| Run started | 2026-10-10 21:47 |
| Test data prefix | `ETA-20261010-2147` |
| Budget | 20 minutes, 60 browser actions |

## Step 0. Previous version

No `vX.Y` folder exists under `tests/exploratory/reports/TS-2/`. This run is `v0.1`, a full run.
`knowledge/decisions.md` has no lines yet, so nothing overrides an assumption.

## Step 1. Read and restate

### Documents read outside the browser (not browser actions)

| Document | What it gave |
|---|---|
| Story file | 12 acceptance criteria, scope, assumptions |
| `tests/exploratory/context.md` | Environment, roles, budgets, test data rules |
| `knowledge/e2e-flows.md`, `decisions.md`, `rules.md` | Flows F2, F3, F4, impact map, rental rules |
| `knowledge/pages/rentals.md`, `product-details.md`, `cart-checkout.md`, `account.md` | Page behaviour, earlier locators, quirks |
| OpenAPI `http://localhost:8091/docs?api-docs.json` (Toolshop API 5.0.0) | `GET /products?is_rental=`, `GET /products/{id}`, `GET /products/{id}/related`, `POST /carts`, `POST /carts/{id}`, `PUT /carts/{cartId}/product/quantity`, `DELETE /carts/{cartId}/product/{productId}`, `GET/POST /favorites`, `DELETE /favorites/{id}`. `ProductResponse` has `is_rental` and `in_stock`; `ProductRequest` has `is_rental` but no `in_stock` |

Everything below that comes from a knowledge file is **Assumed** with that file as source.

### Expected workflow

1. Visitor opens the home page and opens **Categories** in the main menu (story AC 1).
2. Selects **Rentals**; the app goes to `/rentals`, heading "Rentals", title "Rentals Overview" (AC 1).
3. The page shows exactly three cards, Excavator, Bulldozer and Crane, each with photo, name and description; no normal products (AC 2).
4. Selects the Excavator card by name or photo; the Excavator details page opens (AC 3).
5. Details show photo with credit, name, category, brand, CO2 rating, description and "$136.50 per hour" (AC 4).
6. Duration control defaults to 1; label "Duration (1 hour(s))" (AC 5).
7. Sets duration to 3; label "Duration (3 hour(s))", total "(Total $409.50)" at once (AC 5, 6).
8. Selects **Add to cart**; confirmation message, cart count increases (AC 7).
9. Opens the cart; the rental line shows the name, the duration and the line total $409.50; the cart total includes it (AC 8).
10. Back on the details page, "Related products" lists Bulldozer and Crane, not Excavator; selecting one opens its details (AC 9).
11. **Compare** adds the rental to the comparison; **Add to favourites** as a visitor asks to sign in; as a logged-in customer it adds the favourite (AC 10).
12. A rental that is not available says so and cannot be added to the cart (AC 11).
13. Changing the language translates heading, "per hour", "Duration", "Total", "Related products" (AC 12).

### Acceptance criteria to steps

| AC | Steps | AC | Steps |
|---|---|---|---|
| 1 Navigation | 1, 2 | 7 Add to cart | 8 |
| 2 Overview content | 3 | 8 Cart | 9 |
| 3 Open details | 4 | 9 Related products | 10 |
| 4 Details content | 5 | 10 Favourites and compare | 11 |
| 5 Duration | 6, 7 | 11 Availability | 12 |
| 6 Total price | 7 | 12 Language | 13 |

### Story against knowledge files: differences to raise

| # | Story says | Knowledge file says | Source |
|---|---|---|---|
| D-1 | Page title is "Rentals Overview" (AC 1) | Title carries the suffix " - Practice Software Testing - Toolshop - v5.0" | `pages/rentals.md` |
| D-2 | Customer sees a confirmation message on add to cart (AC 7) | The toast was seen on 1 of 3 adds | `pages/product-details.md` |
| D-3 | Related products lists the other rental items (AC 9) | On local the list is driven by category (inferred) | `pages/product-details.md` |
| D-4 | Duration is 1 to 10 hours; over 10 is out of scope (AC 5) | Duration is stored as the cart line quantity, an editable field with max 99 | `pages/cart-checkout.md`, `rules.md` (Q-02 open) |
| D-5 | Cart line shows the duration (AC 8) | Line shows "Item for rent, price per hour" and a quantity field; no word "hours" recorded | `pages/cart-checkout.md` |
| D-6 | Total to two decimals (AC 6) | Money format differs: "$1365.00" on details, "$1,365.00" in the cart | `pages/cart-checkout.md` |

### What the story does not say

| # | Gap | What I would have assumed |
|---|---|---|
| G-1 | How the duration is chosen (slider, dropdown, field) and whether the keyboard must work | Slider, operable with arrow keys (`pages/product-details.md`) |
| G-2 | Adding the same rental twice: one line with summed hours, or two lines; what if the sum passes 10 | One line, hours summed, capped at 10 |
| G-3 | Whether the cart may change a rental's duration, and its limits | Editable, limited to 1 to 10 |
| G-4 | Exact confirmation text, and the unavailable text for AC 11 | "Product added to shopping cart."; "Out of stock" (`rules.md`) |
| G-5 | How a rental becomes unavailable on local, so AC 11 can be tested | No seeded unavailable rental; `ProductRequest` has no `in_stock`, so not settable by admin |
| G-6 | Empty state of `/rentals` when no rental exists; error state when the API fails | A "no rentals" message; an error message |
| G-7 | Direct URL access to `/rentals` and to a rental details page; back button returns to `/rentals` | All work |
| G-8 | Whether rentals also appear on the home overview, in search and in category pages | Not excluded there (AC 2 only restricts `/rentals`) |
| G-9 | Which languages AC 12 covers and whether item names and descriptions are translated | All languages in the header selector; product data stays English |
| G-10 | Mobile layout is in scope but has no acceptance criterion | Cards stack in one column, nothing cut off |
| G-11 | Compare with a mix of rental and normal products; per-hour price shown in compare and favourites | Allowed; price shown without unit |
| G-12 | Rounding and thousands separator for totals of $1,000 and more | Two decimals; separator not specified |
| G-13 | Whether the cart and its rental line survive login and reload | Yes (`e2e-flows.md`) |

### Regression areas from the impact map

Product details change → cart line and totals, cart badge, favourites page, compare page, related
products of a neighbouring normal product, a normal product's quantity control (must still be
quantity, not duration), Categories menu entries, home overview (same product data). Invoices and
checkout totals are out of scope for this story (TS-1) and are not explored.

### Charter

**Mission:** find out whether a visitor and a logged-in customer can find, inspect, price and add
a rental machine to the cart as TS-2 describes, and which of those behaviours are stable enough
to automate.

| Priority | Area | Actions |
|---|---|---|
| 1 | Positive path: menu → `/rentals` → Excavator details → duration 3 → add to cart → cart (AC 1 to 8) | 16 |
| 2 | Related products, compare, favourites as visitor and as customer (AC 9, 10) | 9 |
| 3 | Negative and edge: duration bounds 1 and 10, cart quantity over 10, same rental added twice, availability (AC 5, 11; G-2, G-3) | 8 |
| 4 | Language and mobile width (AC 12, G-10) | 4 |
| 5 | Regression: a normal product's details, home overview | 3 |
| 6 | Console and network reads | 2 |
| 7 | Locator verification (20 percent) | 12 |
| 8 | Cleanup: empty cart, remove the favourite I added (10 percent) | 6 |
| | **Total** | **60** |

Test data this run can create: cart lines (session only), one favourite on the shared customer
(removed in the run), a compare selection (session only). No orders, no admin edits.

## Action log

| # | Time | Action | Result | Evidence | Finding |
|---|---|---|---|---|---|
| 1 | 21:50 | Navigate to `http://localhost:4200` (visitor) | Home loads, title "Practice Software Testing - Toolshop - v5.0" | | |
| 2 | 21:50 | Click **Categories** in the main menu (`[data-test="nav-categories"]`) | Menu opens; 3 console errors logged on home | | |
| 3 | 21:50 | Click **Rentals** (`[data-test="nav-rentals"]`) | URL `/rentals`; title "Rentals Overview - Practice Software Testing - Toolshop - v5.0" | E-01, E-02 | F-01, F-02 |
| 4 | 21:51 | Click the Excavator card name (heading) | Details page `/product/<id>` opens, title "Excavator - Practice Software Testing - Toolshop - v5.0" | E-02, E-03 | F-03, F-04 |
| 5 | 21:51 | Focus the duration slider and press ArrowRight twice (one code-run call, one key sequence) | `aria-valuenow` 3, min 1, max 10; slider accessible name is "ngx-slider" | E-04 | F-07, F-08 |
| 6 | 21:51 | Wait 300 ms inside the same call, then DOM read of buttons, price and CO2 scale | Three buttons have text and `data-test` but were unnamed in snapshot E-03; active CO2 letter is E, marked by CSS class only | E-04 | F-09, F-10 |
| 7 | 21:52 | Snapshot of the details component | "Duration (3 hour(s))", "/ (Total $409.50)", "$136.50 per hour" | E-05 | F-05, F-07, F-11 |
| 8 | 21:52 | Click **Add to cart** (`[data-test="add-to-cart"]`), duration 3 | Snapshot right after the click shows no confirmation message and no cart link or badge | E-06 | F-12 |
| 9 | 21:52 | DOM read: cart badge, toast containers, session storage | Badge "3" (hours, not items); no toast element present; `cart_id` and `cart_quantity=3` in session storage | E-07 | F-12, F-13 |
| 10 | 21:52 | Click the cart link in the header | `/checkout`; line "Excavator / Item for rent, price per hour", Quantity 3, Price $136.50, Total $409.50, cart total $409.50. Console: "Cannot read properties of undefined (reading 'cart_items')" 3 times | E-08, E-09 | F-14, F-15, F-16 |
| 11 | 21:52 | Type 11 in "Quantity for Excavator" and press Enter (boundary: just above 10) | Accepted. Alert "Product quantity updated."; line total and cart total "$1,501.50"; badge "11" | E-10 | F-17, F-18 |
| 12 | 21:53 | Navigate directly to `/rentals` (deep link, full reload) | Page loads with the same title; cards and cart badge checked from the snapshot | E-11 | F-19 |
| 13 | 21:53 | Click the Bulldozer card photo (`img[alt="Bulldozer"]`) | Bulldozer details open, title "Bulldozer - Practice Software Testing - Toolshop - v5.0". The snapshot at action 12 was taken before the cards rendered; the cart link was still in the header after the reload | E-11, E-12 | F-04, F-19 |
| 14 | 21:53 | Slider: End, then ArrowRight (boundary: maximum and just above), DOM read | Stays at 10; "Duration (10 hour(s))"; "$147.50 per hour / (Total $1475.00)"; category "Drill"; related: 4 cordless drills, Excavator, Crane | E-13 | F-05, F-06, F-08, F-11, F-20 |
| 15 | 21:53 | Slider: Home, then ArrowLeft (boundary: minimum and just below), DOM read | Stays at 1; "Duration (1 hour(s))"; total $147.50 | E-13 | F-08 |
| 16 | 21:53 | Click the related product Crane on the Bulldozer page | Crane details open, title "Crane - Practice Software Testing - Toolshop - v5.0" | E-14 | F-21 |
| 17 | 21:53 | Click **Add to favourites** on Crane as a visitor | Alert "Unauthorized, can not add product to your favorite list."; stays on the page, no sign-in prompt or redirect; `POST /favorites` 401 in console | E-15 | F-22 |
| 18 | 21:54 | Click **Compare** on Crane | Snapshot unchanged apart from focus on the button; no alert in the snapshot | E-16 | F-23 |
| 19 | 21:54 | DOM read: compare button, session storage, alerts | `compare_ids` in session storage holds the Crane id; no alert, no link to `/compare`, button unchanged | E-17 | F-23 |
| 20 | 21:54 | Navigate to `/compare` (route named in `e2e-flows.md`) | Redirected to `/`. Console: "NG04002: Cannot match any routes. URL Segment: 'compare'". No compare element on the home page. Check at 21:55: 20 actions, 5 minutes | E-18 | F-24 |
| 21 | 21:54 | Navigate to `/rentals` | Loads | | |
| 22 | 21:54 | Click the language selector (`[data-test="language-select"]`) | Language menu opens | | |
| 23 | 21:55 | Click menu item **DE** | Language switches; browser tab title stays "Rentals Overview - ..." in English; heading read from the snapshot | E-19 | F-25 |
| 24 | 21:55 | Click the Excavator card name with German active | Details in German: "pro Stunde", "Dauer (1 Stunde(n))", "Verwandte Produkte"; "/ (Total $136.50)" keeps the word "Total"; `/rentals` heading was "Mieten" | E-19, E-20 | F-25, F-26 |
| 25 | 21:55 | Click **Add to cart** on Excavator again, duration 1, German active (same rental twice) | Snapshot right after: no alert, badge still "11" | E-21 | F-12, F-27 |
| 26 | 21:55 | Wait 3 s (code-run), then DOM read | Badge "12" (11 + 1); no alert present; buttons read "Zum Einkaufswagen hinzufügen", "Zu Favoriten hinzufügen", "Vergleichen" | E-22 | F-12, F-13, F-25, F-27 |
| 27 | 21:56 | Click the language selector | Menu opens | | |
| 28 | 21:56 | Click menu item EN with `[role="menuitem"]:has-text("EN")` | **Failed**: my selector matched 3 elements ("Kategorien", "Einloggen", "EN"). Tool error, not an app finding. Language still German | | |
| 29 | 21:56 | Resize the viewport to 375 x 812 (platform: mobile width) | Resized | | |
| 30 | 21:56 | Full-page screenshot of Excavator details at 375 px (German). Check: 30 actions, 7 minutes | Single column; buttons wrap to three in a row; the floating chat button covers the first lines of the description; description text runs to the right edge | E-23 | F-28 |
| 31 | 21:56 | Navigate to `/rentals` at 375 px | Loads | | |
| 32 | 21:57 | Wait for the first card heading (code-run) | Cards rendered | | |
| 33 | 21:57 | Full-page screenshot and DOM read of `/rentals` at 375 px | No horizontal scroll (scrollWidth 375); cards 351 px wide in one column; cards are `div.card` with no role, tabindex or test id; German kept after reload (`language` in local storage); heading "Mieten" | E-24, E-25 | F-25, F-28, F-29 |
| 34 | 21:57 | Resize the viewport back to 1280 x 800 | Resized | | |
| 35 | 21:57 | Click the language selector | Menu opens | | |
| 36 | 21:57 | Click EN (`[data-test="lang-en"]`) | Back to English | | |
| 37 | 21:57 | Navigate to `/auth/login` | Login page loads | | |
| 38 | 21:58 | Fill the email field with the demo customer (`AUT_CUSTOMER_EMAIL`), in one code-run call with 39 to 42 so that no snapshot is taken while the password field holds a value | Filled | | |
| 39 | 21:58 | Fill the password field (`AUT_CUSTOMER_PASSWORD`) | Filled | | |
| 40 | 21:58 | Click the login button | Submitted | | |
| 41 | 21:58 | Wait for the URL to leave `/auth/login` | `/account` | | |
| 42 | 21:58 | Wait for the account menu, then read | Logged in; no password field on the page; cart badge still "12" (visitor cart survived login). Check: 42 actions, 8 minutes | E-26 | F-30 |
| 43 | 21:57 | Navigate to `/rentals` as the logged-in customer | Loads | | |
| 44 | 21:58 | Wait for cards, then count 18 locators on `/rentals` (read-only code-run) | All key locators match 1; 3 cards; 0 links inside cards; test ids `page-title` and `product-<id>` exist on the page | E-27 | F-03, F-29 |
| 45 | 21:58 | Click the Crane card name | Crane details open (third item of AC 3) | | F-04 |
| 46 | 21:59 | Count 32 locators on Crane details (read-only code-run) and read the total element | Key locators match 1; total is `<span id="total-price">` with no test id; `getByLabel(/Duration/)` 0; related links 6 (4 drills, Excavator, Bulldozer); no "Out of stock"; add to cart enabled | E-28 | F-06, F-08, F-09, F-31 |
| 47 | 21:59 | Click **Add to favourites** on Crane as the logged-in customer | No alert in the snapshot taken right after the click; result checked on the favourites page | E-29 | F-32 |
| 48 | 21:59 | Navigate to `/account/favorites` | Loads. **80 percent of the action budget reached (48 of 60, 9 minutes).** No new paths from here: the regression check on a normal product is dropped and listed as not explored. Remaining actions go to cart locators and cleanup | | |
| 49 | 21:59 | Wait for the favourites list, then DOM read | 4 favourites: 3 seeded (Combination Pliers, Slip Joint Pliers, Belt Sander) plus Crane. Delete button has `data-test="delete"`, no accessible name, no text | E-30 | F-32, F-33 |
| 50 | 21:59 | Cleanup: click delete on the Crane favourite only (scoped to the item with heading "Crane") | Snapshot right after the click still lists Crane | E-31 | F-33 |
| 51 | 22:00 | DOM read of the favourites list | Crane removed; the 3 seeded favourites remain; no alert | E-32 | F-33 |
| 52 | 21:59 | Navigate to `/checkout` as the logged-in customer | Loads | | |
| 53 | 22:00 | Wait for the Excavator row, count 13 cart locators, read the lines | One line: Excavator, quantity 12 (the second add merged into the same line), $136.50, $1,638.00; cart total $1,638.00; field min 1, max 99; remove control is `<a class="btn btn-danger">` with no role or name | E-33, E-34 | F-14, F-17, F-27, F-34 |
| 54 | 22:00 | Cleanup: click the remove control of the Excavator line | Clicked; result read in action 55 | | |
| 55 | 22:00 | Cleanup: remove my `compare_ids` from session storage, then DOM read of the cart | Alert "Product deleted."; "The cart is empty. Nothing to display."; badge gone; `cart_quantity` 0; compare selection cleared | E-35 | F-34 |
| 56 | 22:00 | Read network requests for the cart path | No failed call. `DELETE /carts/<id>/product/<id>` 204, `GET /carts/<id>` 200, `GET /users/me` 200 | E-36 | |
| 57 | 22:00 | Cleanup: click the account menu (`[data-test="nav-menu"]`) | Menu opens | | |
| 58 | 22:01 | Cleanup: click **Sign out** (`[data-test="nav-sign-out"]`) | Signed out; "Sign in" back in the menu | | |
| 59 | 22:01 | Close the browser page | Closed. **Browser work ended: 59 of 60 actions, 21:50 to 22:01 (11 of 20 minutes)** | | |

Action 28 failed (my selector) and still counts. Actions 5-6, 14-15, 32-33 and 38-42 were code-run
calls counted per interaction inside them. Locator counts at 44, 46 and 53 were read-only code-run
calls, one action each (53 includes its wait).

## Findings

| ID | Finding | Tag | Evidence / basis |
|---|---|---|---|
| F-01 | **Categories > Rentals** exists and opens `/rentals` | Observed | E-01, E-02 |
| F-02 | Heading is "Rentals" (h1). Browser title is "Rentals Overview - Practice Software Testing - Toolshop - v5.0", not the bare "Rentals Overview" of AC 1 | Observed | E-02, E-27 |
| F-03 | `/rentals` shows exactly three cards, Excavator, Bulldozer, Crane, each with an image, a name heading and a description paragraph; no other product | Observed | E-02, E-27 |
| F-04 | Card name opens the right details (Excavator, Crane); card photo opens the right details (Bulldozer) | Observed | E-03, E-12, E-28 |
| F-05 | Details show photo with credit, name, category, brand, CO2 scale, description, and "$136.50 per hour" / "$147.50 per hour" / "$153.50 per hour" as in the story's table | Observed | E-03, E-13, E-14 |
| F-06 | Related products on each rental list four cordless drills first, then the other two rentals; the item itself is not listed | Observed | E-03, E-13, E-28 |
| F-07 | Duration defaults to 1; label reads "Duration (1 hour(s))" and "Duration (3 hour(s))" after two steps | Observed | E-03, E-05 |
| F-08 | Duration control is a slider, keyboard operable, `aria-valuemin` 1, `aria-valuemax` 10; End + ArrowRight stays at 10, Home + ArrowLeft stays at 1. Its accessible name is "ngx-slider"; the visible label is not associated (`for=""`, `getByLabel(/Duration/)` 0) | Observed | E-04, E-13, E-28 |
| F-09 | Tool observation: accessibility snapshots show the three action buttons without names, but `getByRole('button', { name })` matches each exactly once. DOM reads used for them | Observed | E-03, E-04, E-28 |
| F-10 | The active CO2 letter (E on all three rentals) is marked by CSS class `active` only | Observed | E-04, E-13 |
| F-11 | Total = hourly price x duration with two decimals: $409.50 (Excavator, 3), $1475.00 (Bulldozer, 10), $147.50 (Bulldozer, 1). Details page has no thousands separator; the cart shows "$1,501.50" | Observed | E-05, E-13, E-10 |
| F-12 | No confirmation message was present after Add to cart, on 2 of 2 adds, in the snapshot right after the click and in a DOM read 3 s and about 15 s later | Observed | E-06, E-07, E-21, E-22 |
| F-12a | So the app shows no confirmation for add to cart. The same reads did catch "Product quantity updated.", the favourites "Unauthorized" alert and "Product deleted." | Inferred | F-12, F-18, F-22, F-34: other alerts were visible to the same method |
| F-13 | Cart badge counts hours, not items: "3" after one rental of 3 hours, "12" after 11 + 1. The badge was missing or stale in the snapshot right after each add and correct within 3 s | Observed | E-06, E-07, E-21, E-22 |
| F-14 | Cart line: "Excavator", note "Item for rent, price per hour", a "Quantity" number field holding the duration, price $136.50, line total $409.50; cart total $409.50. Nothing says "hours" or "duration" | Observed | E-08, E-33 |
| F-15 | Every cart load logs "TypeError: Cannot read properties of undefined (reading 'cart_items')" (3 times as visitor, 7 as customer); the cart still renders | Observed | E-09, E-34 |
| F-16 | As a visitor every full page load logs two 401s on `GET /users/me` and an "Unauthorized" console error | Observed | E-09 |
| F-17 | The cart accepts 11 hours for a rental: line total $1,501.50. The field has min 1, max 99 | Observed | E-10, E-33 |
| F-18 | Changing the cart quantity shows the alert "Product quantity updated." | Observed | E-10 |
| F-19 | `/rentals` works as a direct link, and the cart is still in the header after the reload | Observed | E-11, E-12 |
| F-20 | All three machines show the category "Drill" | Observed | E-03, E-13, E-14 |
| F-21 | Selecting a related rental opens its details (Bulldozer page, Crane) | Observed | E-14 |
| F-22 | Visitor, Add to favourites: alert "Unauthorized, can not add product to your favorite list."; no sign-in prompt, no redirect; `POST /favorites` 401 | Observed | E-15 |
| F-23 | Compare gives no visible feedback. The product id is stored in session storage `compare_ids`; no link or indicator appears | Observed | E-16, E-17 |
| F-24 | `/compare` is not a route: "NG04002: Cannot match any routes", redirect to `/`. No way to view a comparison was found | Observed | E-18 |
| F-25 | German: heading "Mieten", "pro Stunde", "Dauer (1 Stunde(n))", "Verwandte Produkte", buttons translated; choice kept after reload (`language` in local storage). The browser title stays English | Observed | E-19, E-20, E-22, E-25 |
| F-26 | In German the total still reads "/ (Total $136.50)" | Observed | E-20 |
| F-27 | Adding the same rental again merges into the one cart line and sums the hours (11 + 1 = 12, $1,638.00) | Observed | E-22, E-33 |
| F-28 | At 375 px both pages are one column with no horizontal scroll. On details the floating chat button covers the start of the description | Observed | E-23, E-24, E-25 |
| F-29 | Rental cards are `div.card` with no role, no `tabindex` and no link inside (`getByRole('link')` 0) | Observed | E-25, E-27 |
| F-29a | So a keyboard-only user cannot open a rental from `/rentals` | Inferred | F-29: nothing focusable in the cards. Not tried with the Tab key |
| F-30 | A visitor's cart (badge 12) is still there after login | Observed | E-26 |
| F-31 | No rental is unavailable on local: add to cart enabled, no "Out of stock" text on Crane. AC 11 could not be exercised | Observed | E-28, E-04 |
| F-32 | Logged-in customer, Add to favourites: no alert in the snapshot right after; Crane then appears under Account > Favourites | Observed | E-29, E-30 |
| F-33 | The favourite's delete button works; it has `data-test="delete"`, no accessible name and no text | Observed | E-30, E-31, E-32 |
| F-34 | Cart remove shows "Product deleted." and "The cart is empty. Nothing to display."; the control is `<a class="btn btn-danger">` with no role, name or test id | Observed | E-33, E-35 |
| F-35 | Knowledge files differ from this run: `/compare` route (e2e-flows.md) does not exist; cards are not focusable (rentals.md says focusable); favourites delete has a usable test id (account.md says none); add-to-cart toast seen 0 of 2 (product-details.md says 1 of 3) | Inferred | F-24, F-29, F-33, F-12 |

Heuristics behind the ideas: boundaries (actions 11, 14, 15), interfaces (cart field against the
slider rule, 11), operations (same rental twice 25; keyboard on the slider 5, 14, 15), state and
role changes (visitor and customer favourites 17, 47; cart across login 42), interruptions (deep
link and reload 12), platform (language 23-26; viewport 29-33).

## Not explored

- AC 11 availability: no unavailable rental exists on local and `ProductRequest` has no `in_stock` field.
- Regression: a normal product's details (quantity control), rentals on the home overview and in search. Dropped at the 80 percent mark.
- Languages other than German; the German Categories menu entry.
- Compare with two or more products; favourites and compare from the keyboard.
- Empty and error states of `/rentals`.

## Test data created

| # | Data | Where | Cleanup |
|---|---|---|---|
| 1 | Cart line Excavator (3 h, edited to 11, then +1 = 12) | session cart, visitor then customer | Removed at action 54, confirmed empty at 55 (E-35) |
| 2 | Compare selection: Crane | session storage `compare_ids` | Removed at action 55 |
| 3 | Favourite: Crane on the shared demo customer | Account > Favourites | Deleted at action 50, confirmed at 51 (E-32). The 3 seeded favourites are untouched |
| 4 | Language set to German | local storage | Set back to English at action 36 |

No record needed the `ETA-` prefix: nothing with a free-text name was created. No order was placed.

## Credential check

Searched the run folder for the customer email and password values from `.env`: no match. Login
was done in one scripted call that returned only the URL, so no snapshot holds a filled password field.
