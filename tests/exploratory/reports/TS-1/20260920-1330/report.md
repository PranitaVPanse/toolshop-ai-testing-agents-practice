# Automation-readiness report: TS-1 Customer checks out the items in the cart

| | |
|---|---|
| Story source | `stories/checkout-incomplete.md` |
| Environment | local, http://localhost:4200 (API http://localhost:8091) |
| Run | 2026-09-20, 13:33 to 13:45 |
| Budget | 56 of 60 actions, 12 of 20 minutes |
| Stopped because | Action budget. The order failed at action 47 and repeating the flow with a valid postcode needed about 10 more actions |
| Inputs used | story, context file `context/toolshop.context.md`, OpenAPI `http://localhost:8091/docs?api-docs.json` |
| Status | **DRAFT. Not signed off** |

**Run caveat.** The session that ran this exploration also wrote the story, so it knew which
gaps were left out on purpose. This run shows that the agent works end to end. It does not
measure how well the agent finds gaps. Use a fresh session for that.

**Three things most worth your attention**

1. An order can fail without the customer being told (F-13). The page says "Payment was successful" while the server rejected the invoice. The story has no rule for failure at all.
2. AC2 is not met: after a quantity change the cart total stays wrong until the page is reloaded (F-02).
3. AC6 and AC7 were never reached, so nothing about confirmation or "My invoices" is ready to automate.

## 1. Story summary and expected workflow

A logged-in customer reviews the cart, adjusts it, confirms a billing address that comes from
their profile, pays, gets an invoice number and finds the order under "My invoices".

Expected workflow, written before the browser was opened:

1. A customer has at least one item in the cart and opens the cart.
2. The cart lists each item with quantity, unit price and line total, plus a cart total.
3. The customer changes a quantity or removes an item. The total updates.
4. The customer proceeds to checkout. Being logged in, they continue to the billing address step.
5. The billing address is pre-filled from the profile and can be edited for this order.
6. With any address field empty, the customer cannot continue.
7. The customer chooses a payment method and enters what that method needs.
8. The customer confirms the payment and sees a confirmation with an invoice number.
9. Under "My invoices" the order is listed with the same total.

| AC | Criterion | Demonstrated by steps |
|---|---|---|
| 1 | Cart shows items, quantities, unit prices, total | 1, 2 |
| 2 | Change quantity or remove, total updates | 3 |
| 3 | Logged-in customer continues to address, pre-filled and editable | 4, 5 |
| 4 | All address fields required | 6 |
| 5 | Choose payment method, enter its details | 7 |
| 6 | Confirmation with invoice number | 8 |
| 7 | Order under "My invoices" with same total | 9 |

What the story does not say (13 gaps, G1 to G13, listed in `ledger.md`. The ones that matter are questions in section 8):
payment failure, guest checkout, which payment methods and their rules, empty cart, quantity limits,
price or stock changes, cart emptied after order, address saved back to profile, address formats,
email and PDF, totals with tax or shipping, back, reload and double submit, cart kept on login.

## 2. Expected versus observed

| # | Expected (from story) | Observed | Match | Tag | Evidence |
|---|---|---|---|---|---|
| 1 | Cart shows items, quantity, unit price, total | Shown, plus a line total per item. 2 x 14.15 + 48.41 = 76.71 correct | yes | Observed | E-01 |
| 2a | Quantity change updates the total | Line total updates. Cart total and header badge stay stale until reload | **no** | Observed | E-04, E-05 |
| 2b | Remove updates the total | Line removed at once, total and badge correct. No confirmation prompt | yes | Observed | E-06 |
| 3a | Logged-in customer continues to address | Wizard has a "Sign in" step. A logged-in customer sees "you are already logged in" and one more Proceed button | partly | Observed | E-09, E-10 |
| 3b | Address pre-filled from profile | Street and City arrive several seconds late. Country never pre-filled although the profile has it. Postcode, house number, state are empty in the seeded profile | **partly** | Observed | E-11 |
| 3c | Address can be changed for this order | Fields are editable. Whether the change is kept off the profile could not be checked, the order failed | not explored | | |
| 4 | All address fields required | Proceed is disabled while State is empty. No message explains it. Other fields not tried one by one | partly | Observed | E-12 |
| 5 | Choose method, enter details | 5 methods: Bank Transfer, Cash on Delivery, Credit Card, Buy Now Pay Later, Gift Card. Credit Card has 4 fields with validation. Cash on Delivery has none | yes | Observed | E-13, E-14 |
| 6 | Confirmation with invoice number | First Confirm shows "Payment was successful" without a number. Second Confirm sent POST /invoices, which failed with 422. Nothing was shown | **no** in this run | Observed | E-16, E-18 |
| 7 | Order under "My invoices" | Not reached | not explored | | |

## 3. Risks

| Risk | Why it matters | Likelihood | Impact | Basis | Tag |
|---|---|---|---|---|---|
| Customer believes they have paid and ordered when no order exists | Lost orders, support calls, trust | High, any server rejection triggers it | High | F-13 | Observed |
| Customer checks out with a wrong total on screen | The amount confirmed is not the amount charged. The server value is right, the screen is not | High, every quantity change | High | F-02 | Observed |
| Customer is stuck on the payment step after a server rejection | Only a reload helps, and a reload after 5 minutes also logs them out | Medium | Medium | F-17, F-18 | Observed, link to expiry Inferred |
| Session ends after 5 minutes in the middle of checkout, with no message | A slow customer loses the flow | Medium | Medium | F-18 | Inferred |
| Address validation lives only on the server and only at the last step | Errors surface late or, today, never | High | Medium | F-09, F-13 | Observed |
| Double order through the two-click Confirm | The button stays enabled after "Payment was successful" | Unknown | High | F-13a | Inferred, not tried |
| Tests written against the local app are slow and flaky | Cold API calls took 20 to 40 s in this run | High locally | Medium | F-16 | Observed |
| `DELETE /carts/{id}` worked without a token | Out of scope for this story (security). Noted because cleanup used it | | | E-24 | Observed |

## 4. Positive, negative and edge paths

### Positive
| ID | Path | Result | Tag | Evidence |
|---|---|---|---|---|
| P-1 | Add two products, open cart, check lines and total | As expected | Observed | E-01 |
| P-2 | Remove one item | Total and badge update | Observed | E-06 |
| P-3 | Log in inside checkout, visitor cart kept | As expected, slow | Observed | E-09, E-10 |
| P-4 | Fill address, reach payment, choose Cash on Delivery | Reached | Observed | E-13 |
| P-5 | Confirm and get invoice number | **Failed**, see N-3 | Observed | E-18 |

### Negative
| ID | Path | Result | Tag | Evidence |
|---|---|---|---|---|
| N-1 | Leave State empty | Proceed disabled, no message | Observed | E-12 |
| N-2 | Credit card: past expiry, 2-digit CVV, all-zero number | Two errors shown, Confirm disabled. All-zero number accepted | Observed | E-14 |
| N-3 | Postcode in the wrong format for the country (00000 for Austria) | Address step accepts it. POST /invoices 422 at the end. Page shows nothing | Observed | E-18 |

### Edge
| ID | Path | Heuristic | Result | Tag | Evidence |
|---|---|---|---|---|---|
| ED-1 | Reload with items in the cart | Interruptions | Cart kept, totals corrected | Observed | E-05 |
| ED-2 | Visitor proceeds to checkout | State and role changes | Offered "Sign in" or "Continue as Guest" | Observed | E-07, E-08 |
| ED-3 | Go back from payment to address | Interruptions | Not possible | Observed | E-19 |
| ED-4 | Reload 6 minutes after login | Time | Treated as logged out, token still stored | Observed | E-20, E-21 |
| ED-5 | Quantity typed and confirmed with Enter | Data | Stale total. Arrow keys and blur not tried | Observed | E-05 |

### Not explored
Completing an order (AC6), My invoices (AC7), each address field empty on its own, quantity
boundaries (0, negative, decimal, very large), empty-cart deep link, double click on Confirm,
the other four payment methods' rules, the guest path beyond its first form, whether an edited
address is written back to the profile. Reason for all: action budget.

## 5. Validations

| Field or rule | Input tried | Expected | Observed | Enforced in | Tag | Evidence |
|---|---|---|---|---|---|---|
| Address, State | empty | cannot continue | Button disabled, no message, no `required` or `aria-invalid` on the field | UI | Observed | E-11, E-12 |
| Address, Postal code format | 00000 with Austria | unknown, story is silent | UI accepts. API rejects at POST /invoices with 422 | API only | Observed | E-18 |
| Postcode lookup | 00000, AT, 1 | unknown | GET /postcode-lookup 422, twice, silent | API | Observed | E-22, E-23 |
| Card expiry | 01/2020 | rejected | "Expiration date must be in the future." | UI | Observed | E-14 |
| CVV | 12 | rejected | "CVV must be 3 or 4 digits." | UI | Observed | E-14 |
| Card number | 0000-0000-0000-0000 | unknown | Accepted | UI | Observed | E-14 |
| Card fields empty | none entered | Confirm disabled | Confirm **enabled** until a field is touched | UI | Observed | E-14 |
| Payment method | none chosen | Confirm disabled | Confirm disabled | UI | Observed | E-13 |

## 6. Accessibility, console and network

These are observations made while exploring, not an accessibility audit.

### Accessibility observations
| Observation | Where | Impact on users | Impact on automation | Evidence |
|---|---|---|---|---|
| Add-to-cart and two neighbouring buttons have no accessible name | Product page | Screen reader announces "button" three times | No role-based locator, test id needed | E-02 |
| Remove control has no role and no name | Cart | Not reachable or understandable with assistive technology | No role-based locator, only scoped CSS | E-01 |
| Disabled Proceed button with no explanation, fields not marked required or invalid | Billing address | User cannot tell what is missing | Nothing to assert on except the disabled state | E-11, E-12 |
| Error messages have no role and are not tied to their field | Credit card | Errors may not be announced | Only text or CSS class to locate them | E-14 |
| Server rejection produces no message at all | Payment | User is misinformed | Negative path cannot be asserted in the UI | E-18 |
| Wizard step list is plain text, no current-step state exposed | Checkout | Position in the flow is not announced | Step cannot be asserted through roles | E-01, E-07 |
| Good: quantity fields are named per product ("Quantity for Bolt Cutters"), address and payment fields have real labels | Cart, address, payment | | Grade A or B locators without test ids | E-01, E-10, E-15 |

### Console errors and warnings
| Action # | Level | Message (shortened) | Count | Related finding |
|---|---|---|---|---|
| 10 onwards | error | TypeError: Cannot read properties of undefined (reading 'cart_items') | 88 | F-14 |
| every page as visitor, and after token expiry | error | 401 on GET /users/me, plus "ERROR {message: Unauthorized}" | 15 + 11 | F-15, F-18 |
| 37 | error | 422 on GET /postcode-lookup | 2 | F-09 |
| 45 | error | 422 on POST /invoices | 1 | F-13 |

### Failed or suspicious network calls
| Action # | Method and URL | Status | What the UI showed | Related finding |
|---|---|---|---|---|
| 45 | POST /invoices | 422, "postal code format is not valid for the selected country" | "Payment was successful" | F-13 |
| 37 | GET /postcode-lookup?country=AT&postcode=00000&house_number=1 | 422, twice | "Looking up your address...", then nothing | F-09 |
| 25 | POST /users/login | 200 after more than 20 s | No loading indicator | F-16 |
| 30 | GET /users/me | 401 once directly after a successful login, then 200 | Address pre-fill arrives late | F-07 |
| all | GET /users/me as visitor | 401, 9 times | Nothing | F-15 |

## 7. Locator and testability assessment

Method column: **strict** means the MCP click or fill ran in Playwright strict mode and succeeded,
which only happens with exactly one match. **count** means an explicit `count()`. **snapshot**
means counted in the accessibility snapshot. Role and label locators are graded B, not A, because
the context file says visible text is translatable. Test ids are graded A.

| Element | State | Recommended locator | Strategy | Matches | Role / accessible name | Grade | Tag | Evidence |
|---|---|---|---|---|---|---|---|---|
| Quantity of an item | cart | `getByRole('spinbutton', { name: 'Quantity for <product>' })` | role | 1, strict | spinbutton / "Quantity for Bolt Cutters" | B | Observed | E-01 |
| Cart total | cart | `getByTestId('cart-total')` | test id | 1, evaluate returned one node | none | A | Observed | E-05 |
| Line total | cart | `getByRole('row', { name: /<product>/ }).getByTestId('line-price')` | scoped test id | proposed, not verified. Unscoped it matches one per row | cell | B | Assumed | E-05 |
| Remove item | cart | `getByRole('row', { name: /<product>/ }).locator('.btn-danger')` | scoped CSS | 1, strict with `tr:has-text()` scoping | **no role, no name** | **D** | Observed | E-01 |
| Proceed, cart step | cart | `getByTestId('proceed-1')` | test id | 1, strict | button / "Proceed to checkout" | A | Observed | E-01 |
| Proceed, by name | any step | `getByRole('button', { name: 'Proceed to checkout' })` | role | 1 per visible step in snapshots, 0 on payment. Same name on three steps | button | C | Observed | E-10, E-15 |
| Proceed, sign-in step | logged in | `getByTestId('proceed-2')` | test id | 1, strict | button | A | Observed | E-10 |
| Proceed, address step | address | `getByTestId('proceed-3')` | test id | 1, strict | button | A | Observed | E-13 |
| Guest tab | sign-in step | `getByRole('tab', { name: 'Continue as Guest' })` | role | 1, strict | tab | B | Observed | E-07 |
| Country | address | `getByLabel('Country')` | label | 1, snapshot | combobox / "Country" | B | Observed | E-10 |
| Postal code, House number, Street, City, State | address | `getByLabel('<label>')` | label | 1 each, snapshot. Test ids `postal_code`, `house_number`, `state` also 1, strict | textbox | B | Observed | E-10 |
| Payment method | payment | `getByLabel('Payment Method')` | label | 1, count | combobox / "Payment Method" | B | Observed | E-15 |
| Confirm | payment | `getByRole('button', { name: 'Confirm' })` or `getByTestId('finish')` | role / test id | 1 and 1, count | button / "Confirm" | B / A | Observed | E-15 |
| Card number, expiry, CVV, holder | payment, Credit Card | `getByLabel('Credit Card Number')` and so on | label | 1 each, snapshot. Test ids 1, strict | textbox | B | Observed | E-14 |
| Field error messages | payment | none found. `.alert.alert-danger` plus text | CSS + text | 2 visible at once | no role | **D** | Observed | E-14 |
| "Payment was successful" | payment | `getByText('Payment was successful')` | text | 1, snapshot | none | C | Observed | E-16 |
| Add to cart | product page | `getByTestId('add-to-cart')` | test id | 1, strict | **button with no name** | A for automation | Observed | E-02 |
| Order confirmation, invoice number | confirmation | not reached | | | | not verified | | |
| My invoices rows | account | not reached | | | | not verified | | |

Summary: 19 key elements, 6 grade A, 8 B, 2 C, 2 D, 3 not verified (1 proposed, 2 not reached).

### Testability requests for developers

```
Element:      Remove item control in each cart row
Problem:      Clickable element with no role and no accessible name. Only a CSS class, scoped to the row, finds it (1 match).
Request:      Make it a <button> with an accessible name such as "Remove <product name>"
Benefit:      getByRole('button', { name: 'Remove Bolt Cutters' }) becomes possible. Keyboard and screen-reader users can remove items.
Evidence:     E-01
```

```
Element:      Validation messages on the payment step (and the missing ones on the address step)
Problem:      No role, no test id, not linked to their field. Two are visible at once, so a class locator matches 2.
Request:      Add test ids following the login page pattern ("<field>-error"), link them with aria-describedby, and give the container role="alert"
Benefit:      One stable locator per message. Errors get announced.
Evidence:     E-14
```

```
Element:      Result of a rejected order (POST /invoices 4xx)
Problem:      Nothing is rendered, so there is nothing to locate or assert.
Request:      Show an error with test id "payment-error" and remove "Payment was successful" when invoice creation fails
Benefit:      The negative path becomes testable. Customers learn that the order did not go through.
Evidence:     E-18
```

```
Element:      Add-to-cart button (and its two neighbours) on the product page
Problem:      Buttons have no accessible name. Only the test id finds them.
Request:      Add an accessible name ("Add to cart", and the right names for the other two)
Benefit:      Accessibility. Automation already works through the test id.
Evidence:     E-02
```

### API level or UI level

| Check | Recommended level | Endpoint | Reason |
|---|---|---|---|
| Cart arithmetic: line totals, cart total, many lines, rounding | API | `GET /carts/{cartId}` | Pure calculation. The UI check only needs one case |
| Quantity boundaries (0, negative, decimal, huge) | API | `PUT /carts/{cartId}/product/quantity` | A matrix. Add one UI case for the stale-total defect |
| Address and postcode format rules per country | API | `POST /invoices`, `GET /postcode-lookup` | The rule lives only on the server today |
| Payment method rules (card, gift card, bank, pay later) | API | `POST /payment/check` | A validation matrix. Keep one UI case per method for wiring |
| Invoice is created with the cart's total and appears in the list | API | `POST /invoices`, `GET /invoices` | AC7's "same total" is data. One UI journey proves the wiring |
| Test setup: a cart with known items | API | `POST /carts`, `POST /carts/{id}` | Saves about 9 UI steps per scenario |
| Guest order | API first | `POST /invoices/guest` | Only once Q-02 is answered |
| The checkout journey itself, the stale total, the silent failure, going back | UI | | These are rendering and wiring problems. The API was correct in each case |

## 8. Open questions

### Requirement questions (for the product owner)
| ID | Question | Why it matters | What I would have assumed | Blocks scenarios |
|---|---|---|---|---|
| Q-01 | What should the customer see when payment or order creation fails? | Today they see "Payment was successful" and no order exists (F-13) | An error message, cart kept, retry possible | S-07, S-08 |
| Q-02 | Is guest checkout in scope? The app and the API both offer it, the story does not mention it | A whole second path with its own form | Out of scope for TS-1, separate story | S-10 |
| Q-03 | Which payment methods are in scope, and what are the rules for each? AC5 names none. The app offers five | Decides the size of the test matrix | All five, rules as the API enforces them | S-06 |
| Q-04 | Is Confirm meant to be pressed twice (check payment, then place order)? | The story reads as one step. The enabled button after "successful" invites double submits | One press | S-07 |
| Q-05 | Should the customer be able to go back from payment to address? | Today they cannot, and a rejected address leaves them stuck | Yes | S-09 |
| Q-06 | "Pre-filled from their profile": all fields, or only those the profile has? And should Country be included? | AC3 cannot be judged without this. Today Country is never filled | All fields the profile has, including Country | S-05 |
| Q-07 | Should a changed address be saved to the profile or apply to this order only? | "for this order" suggests not. Not checked | This order only | S-05 |

### Domain questions (for someone who knows the business)
| ID | Question | Why it matters | What I would have assumed | Blocks scenarios |
|---|---|---|---|---|
| Q-08 | What are the postcode rules per country, and should the customer learn about them on the address step? | Today the server alone knows, and says so only at the very end | Validate on the address step | S-04, S-09 |
| Q-09 | Is 0000-0000-0000-0000 a valid card number for this shop's purposes? Is a checksum expected? | It is accepted today | Format only, as it is a demo | S-06 |
| Q-10 | Quantity limits: minimum, maximum, stock? | Not explored, story silent | Minimum 1, integers | S-03 |
| Q-11 | Is the cart emptied after a successful order? | Not reached | Yes | S-07 |

### Environment questions (for the team that runs the test environment)
| ID | Question | Why it matters | What I would have assumed | Blocks scenarios |
|---|---|---|---|---|
| Q-12 | Which address is valid test data per country? The context file's postcode `00000` is rejected for Austria | The documented fake data cannot complete an order | A 4-digit postcode for Austria | S-07, S-08 |
| Q-13 | Is the 5-minute login token meant for this environment? Is there a refresh? | Any checkout slower than 5 minutes ends logged out. Automated flows on the slow local app are at risk too | Intended, and tests must finish a login-dependent flow inside 5 minutes | S-07, S-11 |
| Q-14 | Can the local API be made faster (first calls took 20 to 40 s)? | Decides timeouts and whether UI tests are stable locally | Keep the warm-up and 1 worker | all UI scenarios |
| Q-15 | The seeded customer profile has no postcode, house number or state. Is that on purpose? | It makes AC3 hard to demonstrate with seed data | On purpose, tests must create a fuller profile | S-05 |

## 9. BDD candidates

```gherkin
Feature: Customer checks out the items in the cart

  Background:
    Given a cart with 2 "Combination Pliers" and 1 "Bolt Cutters" prepared through the API

  @TS-1 @automate-now
  Scenario: S-01 Cart lists items with quantities, prices and the total
    When I open the cart
    Then I see "Combination Pliers" with quantity 2, unit price "$14.15" and line total "$28.30"
    And I see "Bolt Cutters" with quantity 1, unit price "$48.41" and line total "$48.41"
    And the cart total is "$76.71"

  @TS-1 @automate-now
  Scenario: S-02 Removing an item updates the total
    Given I have opened the cart
    When I remove "Combination Pliers"
    Then "Combination Pliers" is no longer in the cart
    And the cart total is "$48.41"

  @TS-1 @clarify-first @defect-F-02
  Scenario: S-03 Changing a quantity updates the total
    Given I have opened the cart
    When I change the quantity of "Bolt Cutters" to 3
    Then the line total for "Bolt Cutters" is "$145.23"
    And the cart total is "$173.53"

  @TS-1 @automate-now
  Scenario: S-04 The customer cannot continue with an incomplete billing address
    Given I am logged in as the customer and on the billing address step
    When I leave "State" empty
    Then I cannot proceed to payment

  @TS-1 @clarify-first @Q-06 @Q-07 @Q-15
  Scenario: S-05 Billing address is pre-filled from the profile
    Given I am logged in as the customer and on the billing address step
    Then the address fields show the address from my profile

  @TS-1 @clarify-first @Q-03 @Q-09
  Scenario Outline: S-06 Payment details are validated
    Given I am on the payment step
    When I choose "Credit Card" and enter <field> as "<value>"
    Then I see "<message>"
    Examples:
      | field           | value   | message                                |
      | expiration date | 01/2020 | Expiration date must be in the future. |
      | CVV             | 12      | CVV must be 3 or 4 digits.             |

  @TS-1 @clarify-first @Q-01 @Q-04 @Q-12
  Scenario: S-07 Customer completes an order and gets an invoice number
    Given I am logged in as the customer and on the payment step with a valid address
    When I pay with "Cash on Delivery" and confirm
    Then I see a confirmation with an invoice number

  @TS-1 @clarify-first @Q-12
  Scenario: S-08 The order appears under My invoices with the same total
    Given I have completed an order with total "$145.23"
    When I open "My invoices"
    Then I see that invoice with total "$145.23"

  @TS-1 @clarify-first @Q-01 @Q-05 @Q-08
  Scenario: S-09 The customer is told when the order cannot be placed
    Given I am on the payment step with a postcode that is not valid for my country
    When I pay with "Cash on Delivery" and confirm
    Then I see why the order could not be placed
    And I can correct my address

  @TS-1 @clarify-first @Q-02
  Scenario: S-10 A visitor checks out as a guest
    Given I am not logged in and have items in my cart
    When I continue as a guest with my email and name
    Then I can enter a billing address
```

## 10. Decision table

| Scenario or check | Decision | Level | Reason | Depends on | QA decision |
|---|---|---|---|---|---|
| S-01 Cart contents and total | Automate now | UI, setup by API | Observed, stable, matches AC1, locators A and B | | |
| S-02 Remove updates total | Automate now | UI, setup by API | Observed and correct. Remove locator is grade D, acceptable when scoped to the row, testability request raised | | |
| S-03 Quantity change updates total | Clarify first | UI | Expected and observed differ (F-02). It looks like a defect against AC2. Automating now gives a red test on day one. Report the defect, then automate | defect F-02 | |
| S-04 Address fields required | Automate now | UI | Observed for State. The rule is UI-only, so UI is the right level. Extend to the other fields after one manual check | | |
| S-05 Address pre-filled | Clarify first | UI | Partly met, and "pre-filled" is not defined | Q-06, Q-07, Q-15 | |
| S-06 Payment validation | Clarify first | API for the matrix, one UI case | Rules are not in the story. Error locators are grade D | Q-03, Q-09 | |
| S-07 Complete order, invoice number | Clarify first | UI, one journey | Not reached. Needs valid test data and a decision on the two-click Confirm | Q-01, Q-04, Q-12 | |
| S-08 My invoices shows the order | Clarify first | API for the total, UI once | Not reached | Q-12 | |
| S-09 Failed order is reported | Clarify first | UI | No requirement exists, and today there is nothing on the page to assert | Q-01, Q-05, Q-08 | |
| S-10 Guest checkout | Clarify first | API first | Scope unknown | Q-02 | |
| Session expiry during checkout (F-18) | Keep exploratory | | Time-dependent and only inferred so far | Q-13 | |
| Step indicator, layout, loading feedback (F-16) | Keep exploratory | | Visual and judgment-based | | |
| Console error "cart_items" (F-14) | Not worth automating on its own | | Report as a defect. A generic "no console errors" check in the fixtures would cover it and everything like it | | |
| 401 on /users/me for visitors (F-15) | Not worth automating | | Noise, no user impact seen | | |
| Cart arithmetic and quantity boundaries | Automate now | API | Pure data rules, cheap and stable at API level. Boundaries themselves still need Q-10 | Q-10 for limits | |

## 11. Test data and cleanup

| Data created | Prefix used | Cleaned up | If not, why and where it is |
|---|---|---|---|
| Cart `01m2zcxqzvng4ywvjazv217mk4`, Bolt Cutters x3 | None possible, carts have no name field | Yes. DELETE 204, then GET 404 (E-24) | |
| Orders | | None were created. 0 invoices dated 2026-09-20 for the customer (E-24) | |
| Shared customer profile | | Not changed | |

The context file's test data rule for postcodes (`00000`) cannot complete an order for Austria.
Please update the rule (Q-12).

Process notes for the skill, found during this run:

- `browser_run_code_unsafe` lets many steps count as one action. Used 3 times here. The budget rule should count the Playwright calls inside it, or forbid it outside locator counting.
- Accessibility snapshots expose password field values. E-09 was redacted by hand. The skill should say: never snapshot a form that holds a password.
- The agent's running action count drifted by 2 (58 narrated, 56 actual). A hook that counts tool calls would make the number trustworthy.

## 12. Sign-off

The recommendations above are the agent's. The decisions are the QA engineer's. No automation
code is written until this is signed.

- [ ] I have reviewed the findings and corrected the decision table where I disagree.
- [ ] Open questions approved for posting to the issue tracker: yes / no / edited

QA engineer: ____________________  Date: ____________
