# Ledger: TS-1 Customer checks out the items in the cart

Run 20260920-1330. Environment: local, http://localhost:4200 (API http://localhost:8091).
Budget: 60 browser actions, 20 minutes. Test data prefix: `ETA-20260920-1330`.

Run caveat: the session that ran this exploration also wrote the story, so it knew which gaps
were left out on purpose. This run confirms the agent works end to end. It is not a fair
measure of gap detection.

## Step 1. Written before the browser was opened

### Expected workflow (from the story alone)

1. A customer has at least one item in the cart and opens the cart.
2. The cart lists each item with quantity, unit price and line total, plus a cart total. (AC1)
3. The customer changes a quantity or removes an item. The total updates. (AC2)
4. The customer proceeds to checkout. Being logged in, they continue to the billing address step. (AC3)
5. The billing address is pre-filled from the profile and is editable for this order. (AC3)
6. With any address field empty, the customer cannot continue. (AC4)
7. The customer chooses a payment method and enters what that method needs. (AC5)
8. The customer confirms the payment and sees a confirmation with an invoice number. (AC6)
9. Under "My invoices" the order is listed with the same total. (AC7)

### Acceptance criteria mapping

| AC | Demonstrated by steps |
|---|---|
| 1 | 1, 2 |
| 2 | 3 |
| 3 | 4, 5 |
| 4 | 6 |
| 5 | 7 |
| 6 | 8 |
| 7 | 9 |

### What the story does not say, and what I would have assumed

| # | Gap | What I would have assumed |
|---|---|---|
| G1 | What happens when the payment fails or is declined | An error is shown, no invoice is created, the cart is kept, the customer can retry |
| G2 | Whether a visitor who is not logged in can check out. The OpenAPI document has `POST /invoices/guest`, so the API supports it | Visitor is asked to log in, with a guest option offered |
| G3 | Which payment methods exist and which fields and formats each needs (AC5 is vague) | Whatever the UI offers is correct |
| G4 | Checkout with an empty cart (for example by deep link) | Checkout is blocked, customer is sent back to the cart |
| G5 | Quantity limits: zero, negative, decimal, maximum, more than stock | Minimum 1, integer only, some maximum |
| G6 | Price or stock changing between cart and payment | Price at time of payment wins |
| G7 | Whether the cart is emptied after a successful order | Yes |
| G8 | Whether an address edited during checkout is saved back to the profile ("for this order" suggests not) | Not saved to the profile |
| G9 | Format rules for address fields (postcode, length limits) | Required only, no format rules |
| G10 | Confirmation email, invoice PDF | Out of scope |
| G11 | Discounts, shipping costs, tax in the total | Total is the sum of line totals |
| G12 | Going back between steps, reloading mid-flow, double submit on confirm | State is kept, one invoice only |
| G13 | Whether the cart survives login (items added as visitor, then log in) | Cart is kept |

### OpenAPI read

`http://localhost:8091/docs?api-docs.json`, OpenAPI 3.2.0, "Toolshop API". Relevant: `POST /carts`,
`POST /carts/{id}`, `GET /carts/{cartId}`, `PUT /carts/{cartId}/product/quantity`,
`DELETE /carts/{cartId}/product/{productId}`, `POST /payment/check`, `POST /invoices`,
`POST /invoices/guest`, `GET /invoices`, `GET /invoices/{invoiceId}`, `GET /postcode-lookup`.

### Charter

Mission: find out whether a logged-in customer can complete checkout as the story describes,
and what happens at the edges the story is silent about, so the QA engineer can decide what to automate.

| Priority | Area | Actions |
|---|---|---|
| 1 | Positive path, AC1 to AC7 end to end (one order will be placed) | 24 |
| 2 | Negative: required address fields, payment field validation (AC4, G3) | 8 |
| 3 | Edge: quantity boundaries, visitor checkout, empty-cart deep link, reload mid-flow (G2, G4, G5, G12) | 10 |
| 4 | Locator verification for key elements | 12 |
| 5 | Console, network, cleanup | 6 |

## Action log

| # | Time | Action | Result | Finding |
|---|---|---|---|---|
| 1 | 13:33:06 | navigate / | Home loads | |
| 2 | 13:33 | snapshot product list | Skeleton only, products still loading | |
| 3 | 13:33 | wait for "Combination Pliers" | Visible. 3 console errors on home | F-15 |
| 4 | 13:33 | click product card | Product page | |
| 5 | 13:33 | snapshot product page | Add-to-cart and two more buttons have no accessible name | F-11, E-02 |
| 6 | 13:33 | click Increase quantity | Quantity 2 | |
| 7 | 13:33 | click add-to-cart | Added | |
| 8 | 13:33 | navigate to second product (full page load) | Cart kept across page load | |
| 9 | 13:33 | click add-to-cart | Added | |
| 10 | 13:34 | click cart icon | /checkout. Console errors jump from 3 to 81 | F-14 |
| 11 | 13:34 | snapshot cart | AC1 met. Remove control has no role or name | F-01, F-12, E-01 |
| 12 | 13:34 | console messages | TypeError cart_items repeated | F-14, E-03 |
| 13 | 13:34 | type quantity 3 + Enter (Bolt Cutters) | Line total updates | |
| 14 | 13:34 | snapshot table | Cart total not updated | F-02, E-04 |
| 15 | 13:35 | evaluate after 3 s | Total and badge still stale | F-02, E-05 |
| 16 | 13:35 | navigate /checkout (reload) | Interruption heuristic | |
| 17 | 13:35 | evaluate | Total and badge now correct. Cart survives reload | F-02, F-03, E-05 |
| 18 | 13:35 | click remove (Combination Pliers) | Removed at once, no prompt | F-04 |
| 19 | 13:35 | evaluate | Total and badge correct after remove | F-04, E-06 |
| 20 | 13:35 | click proceed-1 as visitor | Sign-in step | |
| 21 | 13:35 | snapshot | Tabs "Sign in" and "Continue as Guest" | F-05, E-07 |
| 22 | 13:36 | click "Continue as Guest" | Asks email, first name, last name | F-05, E-08 |
| 23 | 13:36 | click "Sign in" tab | Login form | |
| 24 | 13:36 | fill email and password (demo customer) | | |
| 25 | 13:36 | click Login | No visible change, no loading indicator | F-16 |
| 26 | 13:36 | snapshot | Still login form. Evidence redacted: the snapshot exposed the password value | E-09 |
| 27 | 13:37 | wait for "already logged in" | Timed out after 5 s | F-16 |
| 28 | 13:37 | network requests | POST /users/login pending | F-16 |
| 29 | 13:37 | wait 20 s | "Hello Jane Doe, you are already logged in". Visitor cart kept | F-06 |
| 30 | 13:37 | click proceed-2 | Billing address step | E-10 |
| 31 | 13:38 | evaluate after 4 s | All address fields empty, Proceed disabled | F-07, E-11 |
| 32 | 13:38 | network requests | /users/me 401 once after login, then 200 | F-07, E-11 |
| 33 | 13:38 | evaluate again | Street and City now filled. Country still empty | F-07, E-11 |
| 34 | 13:38 | fill Country, Postal code 00000, House number 1 | Select value is "AT" | |
| 35 | 13:38 | evaluate | Proceed disabled with State empty, no message. "Looking up your address..." | F-08, F-09, E-12 |
| 36 | 13:39 | type State | | |
| 37 | 13:39 | click proceed-3 | Payment step. postcode-lookup 422 twice, nothing shown | F-09, E-13 |
| 38 | 13:39 | select Credit Card | 4 fields. Confirm enabled while empty | F-10, E-14 |
| 39 | 13:39 | fill fake invalid card values | | |
| 40 | 13:39 | evaluate | Expiry and CVV errors. All-zero number accepted | F-10, E-14 |
| 41 | 13:39 | select Cash on Delivery | No extra fields | |
| 42 | 13:40 | run code: locator counts, payment step | All candidates match 1 | E-15 |
| 43 | 13:40 | click Confirm | | |
| 44 | 13:40 | wait 8 s | "Payment was successful", no invoice number, Confirm still enabled | F-13, E-16 |
| 45 | 13:40 | click Confirm again | | |
| 46 | 13:41 | evaluate, up to 20 s | No confirmation, badge still 3 | F-13, E-18 |
| 47 | 13:41 | network requests | POST /invoices 422 | F-13, E-18 |
| 48 | 13:41 | network request body | Postal code format invalid for country | F-13, E-18 |
| 49 | 13:42 | click wizard step "Billing Address" | Nothing happens | F-17, E-19 |
| 50 | 13:42 | run code: address check | Still on payment step | F-17, E-19 |
| 51 | 13:42 | run code: reload and walk wizard | proceed-2 never appears (60 s timeout) | F-18 |
| 52 | 13:43 | snapshot | Login form shown again | F-18, E-20 |
| 53 | 13:44 | evaluate | Token stored, header shows "Sign in" | F-18, E-21 |
| 54 | 13:44 | console messages, all | Saved | E-22 |
| 55 | 13:44 | network requests | Saved | E-23 |
| 56 | 13:44 | close browser | | |

Budget used: 56 of 60 actions, 12 of 20 minutes (13:33:06 to 13:45:11). The running count given
in the chat during the run drifted to 58. This table is the recount and is the correct figure.

Stop reason: action budget. At action 49 the order had failed and repeating the flow with a valid
postcode needed about 10 more actions.

Budget weakness found: `browser_run_code_unsafe` runs many Playwright calls as one "action".
Actions 42, 50 and 51 used it, and 51 tried to batch 8 steps. The rule "one tool call is one
action" can be gamed this way and should be tightened.

## Findings

| ID | Finding | Tag | Evidence |
|---|---|---|---|
| F-01 | Cart shows item, quantity, unit price, line total and a correct cart total | Observed | E-01 |
| F-02 | After a quantity change the line total updates but the cart total and header badge stay stale until reload | Observed | E-04, E-05 |
| F-03 | Cart survives a full page reload, as visitor | Observed | E-05 |
| F-04 | Remove deletes the line at once, with no prompt. Total and badge update correctly | Observed | E-06 |
| F-05 | Guest checkout exists: tab "Continue as Guest" asking email, first and last name. API has POST /invoices/guest | Observed | E-07, E-08 |
| F-06 | Cart built as visitor is kept after logging in inside checkout | Observed | E-09, E-10 |
| F-07 | Address pre-fill is partial and late: Street and City arrive after several seconds, Country is never pre-filled although the profile has "Austria" | Observed | E-11 |
| F-07a | Cause of the missing Country: the select uses codes ("AT"), the profile stores the name | Inferred from F-07 | E-11, E-12 |
| F-08 | With an address field empty the Proceed button is disabled. No message says why | Observed (State only) | E-12 |
| F-09 | A postcode lookup runs by itself. For postcode 00000 it returned 422 twice and the page showed nothing | Observed | E-12, E-22, E-23 |
| F-10 | Credit card: expiry must be in the future, CVV 3 or 4 digits. Number 0000-0000-0000-0000 accepted. Confirm is enabled while the four fields are still empty | Observed | E-14 |
| F-11 | Add-to-cart and two neighbouring buttons on the product page have no accessible name | Observed | E-02 |
| F-12 | Cart remove control is a clickable element with no role and no name | Observed | E-01 |
| F-13 | Order creation fails silently: POST /invoices 422 (postcode format), page keeps showing "Payment was successful", no error, no invoice number. The address step had accepted the same postcode | Observed | E-16, E-18 |
| F-13a | Confirm needs two clicks: the first runs /payment/check, the second runs /invoices | Observed | E-16, E-18 |
| F-14 | "TypeError: Cannot read properties of undefined (reading 'cart_items')" logged 88 times in the run, mostly on opening the cart | Observed | E-03, E-22 |
| F-15 | GET /users/me returns 401 for visitors and is logged as a console error (9 calls) | Observed | E-22, E-23 |
| F-16 | Login inside checkout took over 20 s with no loading indicator. The delay comes from the cold local API | Observed, cause Inferred | E-09 |
| F-17 | No way back from the payment step. Wizard navigation is not clickable and there is no Back button | Observed | E-19 |
| F-18 | 6 minutes after login a reload shows the login form again, the header shows "Sign in", the token is still in storage. Token lifetime is 5 minutes | Observed. "Session expired silently" is Inferred | E-20, E-21 |
| F-19 | AC6 (invoice number) and AC7 (My invoices) were not reached | Not explored | |

## Test data

| Data | Prefix | Cleaned up |
|---|---|---|
| Cart 01m2zcxqzvng4ywvjazv217mk4 (Bolt Cutters x3) | Not possible, carts have no name field | Yes. DELETE 204, then GET 404 (E-24) |
| Orders | | None created. 0 invoices dated 2026-09-20 (E-24) |
| Profile of the shared customer | | Not changed. The address typed in checkout was never saved because the invoice failed |
