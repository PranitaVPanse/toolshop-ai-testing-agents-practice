# Automation-readiness report: KAN-2 Power Tools category page

| | |
|---|---|
| Version | v0.2 (draft); previous: v0.1 (draft) |
| Story source | Jira KAN-2, https://<your-site>.atlassian.net/browse/KAN-2, last updated 2026-10-13 21:52 (+0100), unchanged since v0.1 |
| Environment | local: UI http://localhost:4200, API http://localhost:8091 |
| Run | 2026-10-15; ledger started 19:42Z; browser 19:43:39Z to 19:50:17Z |
| Budget | 52 of 60 actions; 7 of 20 minutes; stopped: 80 percent of the action budget reached at action 48, then locators, console and network only |
| Inputs | story; context file; knowledge: e2e-flows, decisions (empty), rules, pages/product-overview, pages/product-details, pages/rentals; OpenAPI: v0.1 reading carried; previous review: `v0.1/qa-review.md` |
| Status | **DRAFT. Not signed off** |

## 1. Summary

> Applied from v0.1's review: answers Q-01, Q-02, Q-03, Q-04, Q-05, Q-08 are now rules; no scenario
> had a QA decision yet. Re-explored: unticking Power Tools (your Q-03 note), the loading sign (Q-08),
> and everything v0.1 did not reach: clearing filters, opening details, comparison page, German,
> logged-in customer. Resolved: F-05, F-06, F-07. New: F-15, F-16, Q-10, S-20. Still open: Q-06,
> Q-07, Q-09, Q-10 and all 20 decisions.

Look at these first:

- The loading sign you required in Q-08 does not exist: during a 46 s wait for the Sander list the old eight cards stayed on screen with nothing marking the refresh (F-02, Q-10, S-20).
- Cordless Drill 12V still shows "$46.5", for visitors and logged-in customers alike (F-01).
- In German, the category and sub-category names stay English ("Kategorie: Power Tools", Grinder, Sander, Saw, Drill); whether that is accepted is Q-09 (F-15).

| | |
|---|---|
| Acceptance criteria | 5 met · 6 partly · 1 not met · 0 not explored |
| Findings | 2 defects · 2 risks · 2 gaps · 7 observations · 3 resolved |
| Open questions | 4 open · 6 answered |
| Scenarios | 16 automate now · 2 clarify first · 2 keep exploratory · 0 not worth automating |
| Locators | 19 stable · 1 at risk · 0 blocked · 1 not verified |
| Your input | `qa-review.md`: 4 answers, 20 decisions |

## 2. Acceptance criteria

| AC | Criterion | Result | Observed | Tag | Scenarios | Evidence |
|---|---|---|---|---|---|---|
| 1 | Navigation: Categories > Power Tools, URL, heading, title | met | Menu, URL, heading carried from v0.1; title starts with "Power Tools", accepted by Q-01 | Observed | S-01, S-02 | v0.1/E-01, v0.1/E-03, E-09 |
| 2 | Lists every power tool and nothing else | met | Eight tools for visitor and customer; rentals left out (carried) | Observed | S-03, S-17, S-18 | E-02, E-09, v0.1/E-06 |
| 3 | Card: photo, name, CO₂ rating, price with two decimals | not met | Cordless Drill 12V "$46.5" (F-01) | Observed | S-04, S-05 | E-09, v0.1/E-03 |
| 4 | Selecting a card opens its details page | met | Circular Saw details open; heading appears after 23.7 s (F-03) | Observed | S-06 | E-06 |
| 5 | Each sort option reorders correctly | partly | Six orders correct (carried); no loading sign while the list refreshes (F-02) | Observed | S-07, S-20 | v0.1/E-05, E-02 |
| 6 | Sub-category filter; clearing restores all | partly | Filter and clearing correct; no loading sign (F-02) | Observed | S-08, S-11, S-14 | E-02 |
| 7 | Brand filter; clearing restores all | partly | Filter and clearing correct; no loading sign (F-02) | Observed | S-09, S-11 | E-02 |
| 8 | Eco-friendly shows only eco-friendly power tools | partly | No-results message as Q-02 expects (carried); no loading sign (F-02) | Observed | S-12 | v0.1/E-06, v0.1/E-09, E-02 |
| 9 | Filters combine; sort order kept | partly | Drill + MightyCraft with CO₂ (E - A) kept (carried); no loading sign (F-02) | Observed | S-10 | v0.1/E-06, E-02 |
| 10 | No match shows a "no products found" message | met | "There are no products found." (agreed text, Q-04); German text shown too | Observed | S-13 | E-08, v0.1/E-09 |
| 11 | Compare adds the product to the comparison | met | Comparison page shows the Circular Saw column | Observed | S-15, S-19 | E-03, E-05 |
| 12 | Labels translated on language change | partly | German heading prefix, sort, filter headings, eco label, message translated; category names English (F-15) | Observed | S-16 | E-07, E-08 |

The story does not say: default order (Q-06); which brands are listed (Q-07); which languages and whether category names are translated (Q-09); what the loading sign looks like and whether the old list stays visible (Q-10). Gaps G-05, G-07, G-09, G-13, G-15, G-16 in the ledger were not reached.

## 3. Findings

| ID | Where | Finding | Type | Severity | AC | Status | Tag | Evidence |
|---|---|---|---|---|---|---|---|---|
| F-01 | Power Tools > Cordless Drill 12V card > price | Price shows "$46.5", not "$46.50", in every sort and filter state and for a logged-in customer. The API sends `46.5`; the card does not format it | defect | medium | 3 | carried, re-observed | Observed | E-09, v0.1/E-03, v0.1/E-05 |
| F-02 | Power Tools > product grid, after a sort or filter change | No loading sign while the list refreshes, against the Q-08 answer: 46,016 ms after ticking Sander the old eight cards were still shown, and 185 samples at 250 ms found no spinner, progress bar, aria-busy, loading or skeleton element. The comparison page does show "Loading..." | defect | medium | 5-9 | changed (was risk F-03) | Observed | E-02, E-04 |
| F-03 | Power Tools > product grid; product details heading | Answers are slow on local: list 977 ms to 46,016 ms, details heading 23,717 ms after the URL changed. Per Q-05 an environment matter; tests must wait for the API answer or the element, never a fixed time | risk | low | - | carried, updated | Observed | E-02, E-06 |
| F-04 | Power Tools > filter checkboxes | Every click sends its own request, none cancelled. With slow answers an older answer could arrive last and show the wrong list. Not reproduced | risk | medium | 9 | carried from v0.1 | Inferred | v0.1/E-11, v0.1/E-06 |
| F-05 | Power Tools > browser tab title | Title "Power Tools - Practice Software Testing - Toolshop - v5.0"; accepted by Q-01 | gap | low | 1 | resolved | Observed | E-09 |
| F-06 | Power Tools > Show only eco-friendly products | No power tool is eco-friendly, so AC 8 can only show the no-results message; accepted by Q-02 as the launch state | gap | medium | 8 | resolved | Observed | v0.1/E-04, v0.1/E-06 |
| F-07 | Power Tools > By category > Power Tools checkbox | Ticking it ticks all four sub-categories; unticking clears all five and shows all eight, as Q-03 requires | gap | low | 6 | resolved | Observed | E-02 |
| F-08 | Power Tools > By category > Drill | In the API the Drill sub-category also holds the three rentals; the page leaves them out without sending `is_rental`. If that server default changes, rentals appear here | observation | low | 2 | carried from v0.1 | Observed | v0.1/E-04, v0.1/E-06 |
| F-09 | Power Tools > Sort dropdown | No accessible name (no label, aria-label or aria-labelledby); the same control on the home page is named "sort" | gap | low | - | carried, re-observed | Observed | E-10, v0.1/E-12 |
| F-10 | Power Tools > "There are no products found." | Message has no role or live region in English or German, so screen readers are not told the list emptied | observation | low | - | carried, re-observed | Observed | E-08 |
| F-11 | Power Tools > product card > CO₂ scale | The product's letter is marked by CSS class only; the card's accessible name reads "CO₂: A B C D E" for every product | observation | medium | 3 | carried from v0.1 | Observed | v0.1/E-01, v0.1/E-03 |
| F-12 | Power Tools > Compare Now link | Opens `/comparison`, which lists the product; `knowledge/e2e-flows.md` F4 says `/compare` | observation | low | - | carried, comparison now opened | Observed | E-05, v0.1/E-07 |
| F-13 | API documentation for `/products` | The page calls `QUERY /products` with `eco_friendly` and `by_category_slug`; the OpenAPI GET /products lists neither | observation | low | - | carried from v0.1 | Observed | v0.1/E-05, v0.1/E-06 |
| F-14 | Power Tools page, browser console | Angular NG0956 on each re-render, image preload warnings, and the known 401 `users/me` errors for visitors. A test that fails on console warnings would fail here | observation | low | - | carried, updated | Observed | E-11 |
| F-15 | Power Tools in German > heading and By category filter | "Kategorie: Power Tools"; filter keeps Power Tools, Grinder, Sander, Saw, Drill in English; browser title stays English. Everything else checked is translated | gap | low | 12 | new | Observed | E-07 |
| F-16 | Power Tools > Compare, then Sign in | A comparison chosen as a visitor survives the login | observation | low | - | new | Observed | E-10 |

Not explored: R-01 rentals overview, R-02 home overview, R-04 cart badge after an add, sort and filters as a logged-in customer, other languages than German; action budget reached 80 percent at action 48.

## 4. Open questions

| ID | Question | For | Agent's assumption | Blocks |
|---|---|---|---|---|
| Q-06 | With no sort chosen, the order is Sheet Sander, Belt Sander, Random Orbit Sander, Circular Saw, Cordless Drill 20V, 24V, 18V, 12V. Is any default order required? | product owner | None; tests must not assert it | - |
| Q-07 | Should the brand filter list only brands that have power tools, or all brands? The seed data has only two brands, so the two cannot be told apart | product owner | Only brands with power tools | - |
| Q-09 | Which languages must AC 12 cover, and are sub-category names (Grinder, Sander, Saw, Drill) translated? | product owner | The seven in the selector (DE, EL, EN, ES, FR, NL, TR); category names come from the API and stay English, as seen in German (F-15) | S-16 |
| Q-10 | What should the required loading sign be (for example a "Loading..." text as on the comparison page, or a spinner), and should the old list stay visible or be hidden while it shows? | product owner | A text or spinner with `role="status"`; old list hidden | S-20 |

## 5. Test scenarios

| ID | Scenario | Type | Level | Decision | Reason | Depends on |
|---|---|---|---|---|---|---|
| S-01 | Visitor opens Power Tools from the Categories menu | functional | UI | automate now | Carried; menu and heading locators A and B | - |
| S-02 | Power Tools page title | functional | UI | automate now | Q-01 answered; title Observed | - |
| S-03 | Page lists exactly the eight power tools | functional | API `QUERY /products` with `by_category_slug`, plus one UI count | automate now | Carried; re-observed | - |
| S-04 | Every card price shows two decimals | functional | UI | automate now | Clear rule; fails until F-01 is fixed | - |
| S-05 | Card highlights the product's CO₂ rating | functional | UI | keep exploratory | Carried; CSS class only (grade C) | T-03 |
| S-06 | Selecting a card opens its details page | functional | UI | automate now | Observed; card B, details heading A; wait for the heading (F-03) | - |
| S-07 | Each sort option orders the list | functional | API `QUERY /products` with `sort`, plus one UI sort | automate now | Carried | - |
| S-08 | Sander filter shows only sanders | functional | UI | automate now | Re-observed | - |
| S-09 | Brand filter shows only that brand | functional | API `QUERY /products` with `by_brand`, plus UI | automate now | Re-observed | - |
| S-10 | Sub-category and brand combine and keep the sort | functional | UI | automate now | Carried | - |
| S-11 | Clearing a filter restores all eight | functional | UI | automate now | Observed for sub-category and brand | - |
| S-12 | Eco-friendly filter shows the no-results message at launch | functional | UI | automate now | Q-02 answered; message test id A | - |
| S-13 | Grinder shows the no-results message | functional | UI | automate now | Q-04 answered; `category-empty` counted 1 | - |
| S-14 | Power Tools checkbox selects and clears all sub-categories | functional | UI | automate now | Q-03 answered; ticking and unticking Observed | - |
| S-15 | Compare on a card adds the product | functional | UI | automate now | Carried; re-observed | - |
| S-16 | Labels are translated on language change | functional | UI | clarify first | German Observed; scope and category names open | Q-09 |
| S-17 | Logged-in customer sees the eight power tools | functional | UI | automate now | Observed; one cheap check of the in-scope role | - |
| S-18 | Rentals stay off the page when Drill is selected | regression | API `QUERY /products` with `by_category_slug` and Drill | automate now | Carried; guards F-08 | - |
| S-19 | Compare selection reaches the comparison page | regression | UI | keep exploratory | Observed, but the comparison page's product locator was not counted | - |
| S-20 | A loading sign shows while the list refreshes | functional | UI | clarify first | Fails today (F-02); form of the sign unknown | Q-10, T-04 |

Click a scenario for its steps. Your decision goes in `qa-review.md`.

## 6. Locators and testability

| Element | Status | Best locator found | Why it is at risk |
|---|---|---|---|
| Card > highlighted CO₂ letter | at risk (C) | `card.locator('.co2-letter.active')`, 1 match (carried) | Styling class only (F-11) |
| Comparison page > product column | not verified | proposed `getByRole('columnheader', { name: 'Circular Saw' })` | Count not taken (budget) |

| ID | Element | Request | Benefit |
|---|---|---|---|
| T-01 | Sort dropdown (F-09), carried | Add the accessible name "sort" as on the home page, or associate the "Sort" heading as its label | Role-based locator; screen readers announce the control |
| T-02 | No-results message (F-10), carried | Give it `role="status"` and keep `data-test="category-empty"` | Message announced; test id already verified |
| T-03 | Card CO₂ letter (F-11), carried | Expose the rating, for example `aria-label="CO₂ rating D"` on the scale or `aria-current="true"` on the active letter | Assert the rating without CSS; screen reader users hear it |
| T-04 | Loading sign (F-02), new | When it is built, give it `role="status"` and `data-test="products-loading"` | Tests can wait on it; refresh announced |

Accessibility observations (full list in `technical.md`; observations, not an audit): sort dropdown unnamed (T-01); no-results message not announced in either language checked (T-02); CO₂ rating not exposed (T-03); list refresh silent, nothing visual or announced (T-04, Q-10).

## 7. Test data and cleanup

| Data created | Cleaned up |
|---|---|
| No records; the shared customer was only logged in | - |
| Language choice DE in local storage | Yes, set back to EN in the run (E-08) |
| Compare selection, login token | Yes, discarded when the isolated browser closed |

## 8. Next step

Fill in `qa-review.md` (Q-06, Q-07, Q-09, Q-10 and 20 decisions), then sign off or ask for a re-run. Nothing blocks the 16 "automate now" rows except your decisions; S-04 and S-20 fail until F-01 and F-02 are fixed.

Jira comment: 4 questions and 3 findings drafted in `qa-review.md`; posted in the next run if you tick its box there.

Knowledge to add at sign-off:

- `pages/category.md` (new): route `/category/<slug>`, filters, sort, Power Tools select-all, no-results text and `category-empty`, stable locators from `locators.md` (v0.1/O-01, O-03, O-12).
- `e2e-flows.md` F4: the compare link goes to `/comparison`, which shows "Loading..." until the API answers (F-12, O-06); the selection survives login (F-16).
- `rules.md`: rentals share sub-categories with power tools and must be left out of category pages (F-08); no seed power tool is eco-friendly (Q-02); category names are API data and stay English (F-15, pending Q-09).
- `pages/product-overview.md` quirks: the MCP browser's `getByTestId` matches `data-testid`, so count `data-test` ids with CSS (v0.1/O-27); list answers on local can take over 45 s (F-03); `wait_for` text times out at 5 s (O-18).
