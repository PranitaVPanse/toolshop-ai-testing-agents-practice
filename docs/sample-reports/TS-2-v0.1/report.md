# Automation-readiness report: TS-2 Customer browses and rents heavy equipment from the Rentals page

| | |
|---|---|
| Version | v0.1 (draft); previous: none |
| Story source | `tests/exploratory/stories/rentals-overview.md` (status Draft) |
| Environment | local: UI http://localhost:4200, API http://localhost:8091 |
| Run | 2026-10-10, browser work 21:50 to 22:01 |
| Budget | 59 of 60 actions; 11 of 20 minutes; stopped: new paths closed at 80 percent of the action budget (action 48), the rest went to cart locators and cleanup |
| Inputs | story; context file; knowledge: e2e-flows.md, decisions.md (empty), rules.md, pages/rentals.md, pages/product-details.md, pages/cart-checkout.md, pages/account.md; OpenAPI Toolshop API 5.0.0; previous review: none |
| Status | **DRAFT. Not signed off** |

## 1. Summary

Look at these first:

- **The 10-hour limit holds on the details page only.** The cart accepts 11 hours, and adding the same rental again sums the hours past 10 (F-17, F-27, Q-02).
- **Three criteria describe feedback that did not appear.** No confirmation after Add to cart (2 of 2 adds), an "Unauthorized" alert instead of a sign-in request, and Compare with no visible result and no `/compare` route (AC 7, AC 10, F-24, Q-03, Q-08, Q-09).
- **Related products and category look like a data problem.** Every rental lists four cordless drills before the other machines, and all three machines have the category "Drill" (AC 9, F-20, Q-06, Q-07).

| | |
|---|---|
| Acceptance criteria | 5 met · 6 partly · 0 not met · 1 not explored |
| Findings | 4 defects · 3 risks · 2 gaps |
| Open questions | 12 open · 0 answered |
| Scenarios | 8 automate now · 10 clarify first · 2 keep exploratory · 1 not worth automating |
| Locators | 27 stable · 8 at risk · 2 blocked |
| Your input | `qa-review.md`: 12 answers, 21 decisions |

## 2. Acceptance criteria

| AC | Criterion | Result | Observed | Tag | Scenarios | Evidence |
|---|---|---|---|---|---|---|
| 1 | Navigation: menu entry, `/rentals`, heading, title | partly | Title is "Rentals Overview - Practice Software Testing - Toolshop - v5.0" | Observed | S-01, S-02 | E-01, E-02, E-27 |
| 2 | Overview: three cards with photo, name, description; rentals only | met | | Observed | S-03 | E-02, E-27 |
| 3 | Card name or photo opens the matching details | met | Name tried on Excavator and Crane, photo on Bulldozer | Observed | S-04 | E-03, E-12, E-28 |
| 4 | Details: photo with credit, name, category, brand, CO2, description, "$<price> per hour" | met | Category value is "Drill" (F-20) | Observed | S-05 | E-03, E-13, E-14 |
| 5 | Duration 1 to 10 whole hours, default 1, label shows the value | met | Slider; bounds hold by keyboard | Observed | S-06, S-07 | E-04, E-05, E-13 |
| 6 | Total = price x duration, two decimals, updates at once | met | $409.50 for Excavator, 3 hours | Observed | S-07 | E-05, E-13 |
| 7 | Add to cart: confirmation message, cart count increases | partly | Count rises by the hours (3), about 3 s late; no confirmation message present | Observed | S-08, S-09 | E-06, E-07, E-21, E-22 |
| 8 | Cart line: name, duration, line total; cart total includes it | partly | Duration is an unlabelled "Quantity" field; nothing says hours | Observed | S-08 | E-08, E-33 |
| 9 | Related products list the other rental items, not itself; item opens details | partly | Four cordless drills are listed before the two other rentals | Observed | S-12 | E-03, E-13, E-14, E-28 |
| 10 | Favourites and Compare work; visitor is asked to sign in | partly | Customer favourite works. Visitor gets "Unauthorized, can not add product to your favorite list.". Compare shows nothing (F-24) | Observed | S-13, S-14, S-15 | E-15, E-17, E-30 |
| 11 | Unavailable rental says so and cannot be added | not explored | No unavailable rental on local, and no way found to create one | Assumed (rules.md) | S-16 | E-28 |
| 12 | Fixed labels are translated | partly | German only: heading, "pro Stunde", "Dauer", "Verwandte Produkte" translated; "Total" unchanged | Observed | S-17 | E-19, E-20, E-25 |

The story does not say: the page title suffix (Q-01); whether the cart enforces the 10 hours (Q-02); the confirmation text (Q-03); what the cart count counts (Q-04); how the cart shows a duration (Q-05); how a rental becomes unavailable (Q-10); which languages and whether the tab title counts (Q-11); what the mobile layout must do (Q-12). Empty and error states of `/rentals` and keyboard use are not covered by any question yet: see F-29 and the ledger's gap list.

## 3. Findings

| ID | Finding | Type | Severity | AC | Tag | Evidence |
|---|---|---|---|---|---|---|
| F-17 | The cart accepts 11 hours for a rental ($1,501.50). The field allows 1 to 99 | defect | high | 5 | Observed | E-10, E-33 |
| F-27 | Adding the same rental again merges into one line and sums the hours: 11 + 1 = 12, $1,638.00 | defect | high | 5, 7 | Observed | E-22, E-33 |
| F-24 | `/compare` is not a route (redirect to home, console NG04002). No way to see a comparison was found | defect | medium | 10 | Observed | E-18 |
| F-29 | Rental cards have no link, role or `tabindex`, so a keyboard user cannot open one (inferred, Tab key not tried) | defect | medium | 3 | Observed, consequence Inferred | E-25, E-27 |
| F-20 | All three machines show the category "Drill"; this is probably why drills are their related products | risk | medium | 4, 9 | Observed, cause Inferred from F-06 | E-03, E-13, E-14 |
| F-15 | Every cart load logs "Cannot read properties of undefined (reading 'cart_items')"; visitors also get 401 console errors on every page (F-16). Tests cannot assert a clean console | risk | medium | 8 | Observed | E-09, E-34 |
| F-13 | The cart badge is missing or stale right after an add and correct within 3 s; tests must wait for it | risk | low | 7 | Observed | E-06, E-07, E-21, E-22 |
| F-11 | Money format differs: "$1475.00" on details, "$1,501.50" in the cart | gap | low | 6, 8 | Observed | E-13, E-10 |
| F-28 | At 375 px there is no sideways scroll, but the chat button covers the start of the description | gap | low | none | Observed | E-23, E-24, E-25 |

Not explored: AC 11 (no data); a normal product's details and rentals on the home overview (dropped at the 80 percent mark); languages other than German; compare with two products; empty and error states of `/rentals`. Four statements in the knowledge files did not hold in this run (compare route, focusable cards, favourites test id, toast frequency): see F-35 in the ledger.

## 4. Open questions

| ID | Question | For | Agent's assumption | Blocks |
|---|---|---|---|---|
| Q-01 | Is the title with the app suffix acceptable for AC 1? | product owner | Yes; assert that the title starts with "Rentals Overview" | S-02 |
| Q-02 | Must the cart keep a rental at 10 hours at most, both when the quantity is edited and when the same rental is added again? | product owner | Yes; F-17 and F-27 are defects | S-10, S-11 |
| Q-03 | Which confirmation message must Add to cart show? None appeared in 2 of 2 adds | product owner | "Product added to shopping cart." (product-details.md); its absence is a defect | S-09 |
| Q-04 | Should the cart count show items or hours? One 3-hour rental shows 3 | product owner | Hours are not intended; a rental counts as 1 | S-09 |
| Q-05 | How should the cart show the duration? Today it is a "Quantity" field with no unit | product owner | Label it as hours | S-08 (label only) |
| Q-06 | Should related products hold only the other rentals? Today drills come first | product owner | Only rentals, as AC 9 reads | S-12 |
| Q-07 | Is "Drill" the intended category for the three machines? | domain | No; seed data error | S-05 (value only), S-12 |
| Q-08 | Is the "Unauthorized" alert the intended way to ask a visitor to sign in? | product owner | No; a sign-in prompt or redirect is meant | S-13 |
| Q-09 | Where does a customer see the comparison after selecting Compare? | product owner | A compare page should exist; it is missing on local | S-15 |
| Q-10 | How can a rental be made unavailable on local, and what text must the page show? | environment | Seed one rental with `in_stock: false`; text "Out of stock" (rules.md) | S-16 |
| Q-11 | Must "Total" and the browser title be translated, and which languages count for AC 12? | product owner | "Total" must be translated; all seven languages; title not required | S-17 |
| Q-12 | What must the mobile layout satisfy? It is in scope without a criterion | product owner | No sideways scroll, nothing covered | S-18 |

## 5. Test scenarios

| ID | Scenario | Type | Level | Decision | Reason | Depends on |
|---|---|---|---|---|---|---|
| S-01 | Rentals page opens from the Categories menu | functional | UI | Automate now | Observed, clear criterion, locators A and B | |
| S-02 | Rentals page title | functional | UI | Clarify first | Expected and observed title differ | Q-01 |
| S-03 | Rentals page lists only the three rental machines | functional | both: UI and `GET /products?is_rental=true` | Automate now | Observed and stable; the "only rentals" rule is cheaper at API level | |
| S-04 | A rental card opens its details page | functional | UI | Automate now | Observed for all three; name and photo locators grade A | |
| S-05 | Rental details show the hourly price and product information | functional | UI | Automate now | Observed; assert the price number and that each field is shown; category value waits for Q-07 | T-06 for the unit and credit text |
| S-06 | Duration defaults to 1 hour and stays between 1 and 10 | functional | UI | Automate now | Observed by keyboard; assert the slider's value | |
| S-07 | Label and total follow the chosen duration | functional | UI | Clarify first | Behaviour is correct, but the label and total have grade C locators only | T-02, T-03 |
| S-08 | A rental is added to the cart with its duration and total | functional | UI; cart cleanup by `DELETE /carts/{cartId}` | Automate now | Observed; cart locators A and B; wait for the cart line, not the badge | Q-05 and T-07 for the rental note only |
| S-09 | Adding a rental confirms and updates the cart count | functional | UI | Clarify first | No message appeared; count shows hours | Q-03, Q-04 |
| S-10 | The cart does not allow a rental longer than 10 hours | functional | API: `PUT /carts/{cartId}/product/quantity`, one UI check | Clarify first | Observed behaviour contradicts the story's limit | Q-02 |
| S-11 | Adding the same rental again does not pass 10 hours | functional | API: `POST /carts/{id}` | Clarify first | Same rule as S-10 | Q-02 |
| S-12 | Related products list the other rentals | functional | both: UI and `GET /products/{productId}/related` | Clarify first | Drills are listed too | Q-06, Q-07 |
| S-13 | A visitor is asked to sign in before adding a favourite | functional | UI; `POST /favorites` 401 at API level | Clarify first | Observed message differs from the criterion | Q-08 |
| S-14 | A logged-in customer adds a rental to favourites | functional | UI; setup and cleanup by `/favorites` | Automate now | Observed; cleanup possible; must remove the favourite on the shared account | |
| S-15 | A rental can be compared | functional | UI | Clarify first | No visible result, no compare page | Q-09 |
| S-16 | An unavailable rental cannot be added to the cart | functional | UI | Clarify first | Not reproducible on local | Q-10 |
| S-17 | Rental labels are translated | functional | UI | Clarify first | "Total" unchanged; scope of languages open; tests run in English | Q-11 |
| S-18 | Rentals pages are usable at mobile width | functional | UI | Keep exploratory | Visual judgment; no criterion | Q-12 |
| S-19 | The Rentals page opens from a direct link and keeps the cart | regression | UI | Not worth automating | Low risk; S-01 and S-20 cover the route and the cart | |
| S-20 | A visitor's cart with a rental survives login | regression | UI | Automate now | Observed; login page object exists; cart is session data | |
| S-21 | A normal product still uses a quantity, not a duration | regression | UI | Keep exploratory | Not reached in this run; explore it in the next one | |

## 6. Locators and testability

| Element | Status | Best locator found | Why it is at risk |
|---|---|---|---|
| Total on details | at risk (C) | `getByText(/\(Total \$[\d.,]+\)/)` | Text with data; no test id (`id="total-price"` exists, not counted) |
| Duration label | at risk (C) | `getByText(/^Duration \(\d+ hour\(s\)\)$/)` | Translated text with data; not tied to the slider |
| "per hour" unit | at risk (C) | `getByText('per hour', { exact: true })` | Translated bare text node |
| Active CO2 letter | at risk (C) | `locator('.co2-letter.active')` | CSS class only |
| Photo credit | at risk (C) | `getByRole('figure').getByText(/Photo by/)` | Translated text |
| Card description on `/rentals` | at risk (C) | `locator('.card').filter({ has: <name> }).locator('p')` | Bootstrap class and tag |
| Rental note in the cart | at risk (C) | `<row>.getByText('Item for rent, price per hour')` | Translated text |
| Remove cart line | at risk (C) | `<row>.locator('.btn-danger')` | Anchor without role or name; style class |
| Add-to-cart confirmation | blocked (D) | none | No element appeared |
| Compare result | blocked (D) | none | No element appeared, no route |

| ID | Element | Request | Benefit |
|---|---|---|---|
| T-01 | Rental cards and their description | Make the name and photo a real link; add test id "rental-description" | Keyboard access; stable card locator |
| T-02 | Duration label | Associate the label with the slider (`aria-labelledby`) | Slider gets the name "Duration"; `getByLabel` works |
| T-03 | Total on details | Add test id "total-price" to the existing span and announce changes | Exact total assertion; screen reader hears the new total |
| T-04 | Remove cart line | Use a button named "Remove <item>" | Role locator; usable by keyboard and screen reader |
| T-05 | Active CO2 letter | Expose the rating as text or `aria-current` | Rating assertable and not colour-only |
| T-06 | "per hour" unit and photo credit | Add test ids "price-unit" and "photo-credit" | Language-independent checks of AC 4 |
| T-07 | Rental note in the cart | Add test id "rental-note" (wording after Q-05) | Language-independent check of AC 8 |
| T-08 | Favourite's delete button | Add the accessible name "Remove <item> from favourites" | Role locator; screen reader users know what it deletes |

- Keyboard and screen reader users are blocked or misled in four places: cards cannot be opened by keyboard (T-01), the slider is announced as "ngx-slider" (T-02), cart remove and favourites delete are unnamed icons (T-04, T-08), the CO2 rating is colour only (T-05).
- The two blocked elements wait on Q-03 and Q-09, not on a locator request. Compare gives no feedback at all.

## 7. Test data and cleanup

| Data created | Cleaned up |
|---|---|
| Cart line Excavator (3 h, edited to 11, then 12) | Yes: removed, cart confirmed empty (E-35) |
| Favourite "Crane" on the shared demo customer | Yes: deleted, the 3 seeded favourites confirmed untouched (E-32) |
| Compare selection "Crane" (session storage); language German (local storage) | Yes: selection removed, language set back to English, customer signed out |
| Records with a free-text name, orders | None created, so no `ETA-` record exists |

## 8. Next step

Fill in `qa-review.md`: 12 answers and 21 decisions. Q-02, Q-03, Q-06 and Q-09 need the product owner and decide 5 scenarios; Q-10 needs test data before AC 11 can be explored. Then ask for a re-run (v0.2), which will also cover S-21.
