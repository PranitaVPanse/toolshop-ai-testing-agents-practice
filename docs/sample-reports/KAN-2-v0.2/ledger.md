# Ledger: KAN-2 v0.2

| | |
|---|---|
| Story | KAN-2 Add a Power Tools category page (Jira, read 2026-10-15 19:4x Z, last updated 2026-10-13 21:52:10 +0100, 0 comments) |
| Environment | local: UI http://localhost:4200, API http://localhost:8091 (UI 200 in 0.04 s, API `/brands` 200 in 28.2 s by curl at 19:42:39Z) |
| Budget | 20 minutes, 60 browser actions |
| Test data prefix | `ETA-20261015-2042` |
| Run | Re-run, unattended (the QA engineer said "run unattended"). Reads v0.1 as step 0 says |

## Step 0. Previous version

- Latest folder: `v0.1` (draft). This run is `v0.2`, a reduced run.
- `v0.1/qa-review.md`: answers to Q-01, Q-02, Q-03, Q-04, Q-05, Q-08; Q-06, Q-07, Q-09 open.
  No QA decision on any scenario. Jira comment box not ticked: nothing to post. Sign-off box not ticked.
- Story last updated 2026-10-13 21:52:10 +0100, the same as in the v0.1 header: no acceptance criterion changed.
- Drafts in this cycle: `v0.1` only. Carried state is v0.1's report, every item tagged as there and
  cited `v0.1/E-nn`.

### Answers taken as rules for this run

| Q | Answer (QA) | Effect on this run |
|---|---|---|
| Q-01 | Title starting with "Power Tools" is accepted | S-02 expectation: title starts with "Power Tools". v0.1/E-03 already shows it; F-05 closes as answered |
| Q-02 | Eco-friendly = the product's eco-friendly flag; empty result is correct for launch; check AC 8 through the no-results message | S-12 expectation: no-results message. v0.1/E-06, E-09 already show it |
| Q-03 | "Power Tools" is select-all; unticking clears all four and shows all power tools. **Re-check unticking** | QA note: re-explore |
| Q-04 | "There are no products found." is the agreed English text | S-13 expectation fixed; count `data-test="category-empty"` (not counted in v0.1) |
| Q-05 | Slowness is environment, not product rule; tests wait for the API answer, never a fixed time | F-02 becomes an environment observation; waits in scenarios are on the API answer |
| Q-08 | A loading sign is required while the list refreshes after sort or filter change | F-03 expectation changed: re-check for a loading sign, with timing |

### Reduced-run plan (step 0.6)

Not explored in v0.1 (first): AC 4 open details; AC 12 language; logged-in customer (S-17);
clearing a filter on its own (S-11, AC 6, AC 7); R-01 rentals overview; R-02 home overview;
R-03 opening the comparison page; R-04 cart badge; `category-empty` test id count.
QA note: unticking Power Tools (Q-03). Expectation changed: loading sign (Q-08).
Everything else is carried from v0.1.

## Step 1. Read and restate

### Documents read (not browser actions)

| # | Document | Used for |
|---|---|---|
| D-01 | Jira KAN-2 through the `atlassian` MCP server (view evidence) | Story; unchanged since v0.1 |
| D-02 | `tests/exploratory/context.md` | Environment, budget, test data rules |
| D-03 | `knowledge/e2e-flows.md`, `decisions.md` (still empty), `rules.md` | Flows, impact map, rules |
| D-04 | `knowledge/pages/product-overview.md`, `product-details.md`, `rentals.md` | Pages touched and impact-map rows |
| D-05 | `v0.1/qa-review.md`, `report.md`, `ledger.md`, `locators.md`, `scenarios.feature`, `technical.md` | Carried state |
| D-06 | OpenAPI: not re-read; v0.1 D-05 carried | Step 6 |

### Expected workflow (Assumed: story KAN-2, knowledge files, QA answers)

Same as v0.1 ledger steps 1 to 15, with these changes from the answers:
3. Page title starts with "Power Tools" (Q-01).
7a. Ticking "Power Tools" ticks Grinder, Sander, Saw, Drill; unticking it clears all four and shows all eight (Q-03).
9. Eco-friendly only shows "There are no products found." at launch (Q-02, Q-04).
6-10. While the list refreshes after a sort or filter change, a loading sign is shown (Q-08).

### What the story does not say

Carried from v0.1 (G-01 to G-15). G-02, G-03, G-08, G-10 (loading part) are now answered by Q-02, Q-03, Q-01, Q-08.
New: G-16. What happens to the sub-category ticks when one sub-category is unticked while "Power Tools" is ticked. Assumed: "Power Tools" unticks too.

### Regression (impact map, carried from v0.1)

R-01 rentals overview, R-02 home overview grid with sort, R-03 Compare selection reaches the
comparison page (`/comparison`, v0.1 F-12), R-04 cart badge and Categories menu.

### Charter

**Mission:** close the gaps v0.1 left (open details, language, logged-in customer, clearing filters,
regression) and re-check unticking "Power Tools" and the loading sign against the QA answers.

| Priority | Area | Actions |
|---|---|---|
| 1 | Clearing filters on its own, unticking Power Tools (Q-03), loading sign (Q-08), timed | 12 |
| 2 | AC 4 open details | 3 |
| 3 | R-03 Compare Now opens comparison | 3 |
| 4 | AC 12 language (German) incl. no-results text | 6 |
| 5 | Logged-in customer (scripted login) | 5 |
| 6 | Regression R-01, R-02, R-04 | 5 |
| 7 | Locator verification (about 20 percent) | 12 |
| 8 | Console, network, cleanup (about 10 percent) | 6 |
| | Reserve | 8 |
| | Total | 60 |

Stop opening new paths at 48 actions or 16 minutes.

## Action log

Times are UTC.

| # | Time | Action | Result | Evidence |
|---|---|---|---|---|
| 1 | 19:43:39 | navigate `/category/power-tools` as visitor | Page loads; title in the tool output still the generic app title at that moment | E-01 |
| 2-3 | 19:43:5x-19:44:56 | run_code: wait for list response (2, timed out after 60 s: list had loaded already), wait 300 ms (3) | Title "Power Tools - Practice Software Testing - Toolshop - v5.0", 8 cards | E-02 |
| 4-6 | 19:44:57 | tick Sander (4), wait for `QUERY /products` (5), wait 400 ms (6); 250 ms loading sampler | Answer after 46,016 ms; old list of 8 on screen throughout, no loading sign in 185 samples; then 3 sanders | E-02 |
| 7-9 | 19:45:43 | untick Sander, wait response, wait 400 ms | 1,873 ms; all 8 back, nothing ticked | E-02 |
| 10-12 | 19:45:46 | tick MightyCraft Hardware, wait, wait | 2,922 ms; Belt Sander, Cordless Drill 12V | E-02 |
| 13-15 | 19:45:49 | untick MightyCraft Hardware, wait, wait | 977 ms; all 8 back | E-02 |
| 16-18 | 19:45:50 | tick Power Tools, wait, wait | 1,730 ms; Power Tools, Grinder, Sander, Saw, Drill ticked; 8 shown | E-02 |
| 19-21 | 19:45:53 | untick Power Tools, wait, wait | 1,022 ms; nothing ticked; 8 shown. Ends with DOM read | E-02 |
| 22 | 19:46:28 | click Compare on Circular Saw card | Stays on page; button `[pressed]` in snapshot | E-03 |
| 23 | 19:46:36 | click Compare Now (`compare-link`) | `/comparison`, title "Product Comparison - ..." | tool output |
| 24 | 19:46:4x | evaluate: DOM read of `/comparison` | "Loading...", no product yet; `compare_ids` holds 1 id | E-04 |
| 25 | 19:46:5x | wait_for text "Circular Saw" | Failed: tool default timeout 5 s | - |
| 26 | 19:47:13 | run_code: wait for "Loading..." to go (60 s max), DOM read | Gone after 21,033 ms; Circular Saw column with price, brand, category Saw, CO₂ D, specs | E-05 |
| - | 19:47:23 | check clock and count | 26 actions, about 3 min 45 s of browser time | - |
| 27 | 19:47:27 | navigate `/category/power-tools` | Loaded | tool output |
| 28-31 | 19:47:33 | run_code: wait for Circular Saw card (28), click its name (29), wait for URL (30), wait for h1 (31) | Card shown after 21 ms; URL `/product/<id>` after 255 ms; h1 "Circular Saw" after 23,717 ms; title "Circular Saw - ..."; unit price 80.19, category Saw | E-06 |
| 32 | 19:48:18 | navigate `/category/power-tools` | Loaded | tool output |
| 33-35 | 19:48:2x | run_code: open language menu (33), pick DE (34), wait 1 s (35); DOM read | Seven languages DE EL EN ES FR NL TR. Heading "Kategorie: Power Tools", sort and filter headings and eco label translated; "Power Tools", Grinder, Sander, Saw, Drill not translated; product names unchanged; browser title stays English | E-07 |
| 36-38 | 19:48:35 | run_code: tick Grinder (36), wait response (37), wait for message (38) | 36,652 ms; "Es wurden keine passenden Produkte gefunden."; `[data-test="category-empty"]` count 1, no role, no aria-live | E-08 |
| 39-41 | 19:49:17 | run_code: language menu (39), EN (40), wait for English message (41) | `language` = en again (cleanup of the language choice); English text count 1, test id count 1 | E-08 |
| - | 19:49:2x | check clock and count | 41 actions, about 5 min 45 s | - |
| 42-48 | 19:49:3x-19:49:57 | run_code, scripted login (guardrail 9): goto login (42), fill email (43), fill password (44), click Login (45), wait for `/account` (46), goto `/category/power-tools` (47), wait for first card (48); DOM read | Login 9,999 ms; password field gone before any read; list after 2,013 ms; same 8 tools and prices (12V "$46.5"), title and heading as for a visitor; no Sign in link. 80 percent of the action budget reached: no new paths | E-09 |
| 49 | 19:50:09 | run_code, read-only: locator counts | Sort still unnamed (role+name 0, test id 1); all key ids 1; compare selection from action 22 survived the login | E-10 |
| 50 | 19:50:1x | console messages, all, warning level | 401 `users/me` and Angular "Unauthorized" on each visitor load; NG0956 twice; image preload warnings; no error while logged in | E-11 |
| 51 | 19:50:1x | network requests (non-static) | `QUERY /products`, `/brands`, `/categories/tree`, `/product-specs/names` all 200; login 200; no failed call except visitor `users/me` 401 | E-12 |
| 52 | 19:50:17 | close browser | Closed; login token and compare selection discarded with the isolated browser | - |

Final count: 52 of 60 actions. Browser time 19:43:39 to 19:50:17, 6 min 38 s of 20 minutes.
Stopped opening new paths at action 48 (80 percent). Not reached: R-01 rentals overview, R-02 home
overview, R-04 cart badge after an add (only the Categories menu and badge presence were read, E-09),
sort and filters as a logged-in customer, a count of the comparison page's product locator.
Times marked `x` were not read from a tool output; they lie between the neighbouring rows.

## Observations

New in this run. Carried observations keep their v0.1 IDs and are cited `v0.1/O-nn`.

| ID | Tag | Observation | Evidence | Finding |
|---|---|---|---|---|
| O-01 | Observed | Waiting 46,016 ms for the Sander list: 185 samples at 250 ms, none matched any loading selector (aria-busy, progressbar, spinner, loading, loader, skeleton class parts); the old eight cards stayed on screen until the answer | E-02 | F-02 |
| O-02 | Observed | Unticking Sander restores all eight; unticking MightyCraft Hardware restores all eight | E-02 | AC 6, AC 7, S-11 |
| O-03 | Observed | Ticking Power Tools ticks Grinder, Sander, Saw, Drill; unticking it unticks all five and shows all eight | E-02 | F-07 (resolved), S-14 |
| O-04 | Observed | List answers in this run: 977 ms to 46,016 ms (E-02), German Grinder 36,652 ms (E-08) | E-02, E-08 | F-03 |
| O-05 | Observed | Title "Power Tools - Practice Software Testing - Toolshop - v5.0" (visitor and customer) | E-02, E-09 | F-05 (resolved) |
| O-06 | Observed | Compare on Circular Saw: button pressed; Compare Now opens `/comparison`, shows "Loading..." for 21,033 ms, then a Circular Saw column (price $80.19, ForgeFlex Tools, Saw, CO₂ D) | E-03, E-04, E-05 | AC 11, F-12, S-19 |
| O-07 | Observed | The comparison page shows a "Loading..." text while waiting; the category page shows nothing (O-01) | E-04, E-02 | F-02 |
| O-08 | Observed | Selecting the Circular Saw card opens `/product/<id>` in 255 ms; its h1 "Circular Saw" appears after 23,717 ms; title "Circular Saw - ..." | E-06 | AC 4, F-03 |
| O-09 | Observed | Language menu offers DE, EL, EN, ES, FR, NL, TR | E-07 | Q-09 |
| O-10 | Observed | German: "Kategorie: Power Tools", "Sortieren", "Filter", "Nach Kategorie:", "Nach Marken:", "Nachhaltigkeit:", sort options translated, eco label "Nur umweltfreundliche Produkte anzeigen", Compare aria-label "Vergleichen"; product names unchanged | E-07 | AC 12 |
| O-11 | Observed | German: "Power Tools" in heading and filter, Grinder, Sander, Saw, Drill stay English; browser title stays English | E-07 | F-15 |
| O-12 | Observed | German no-results: "Es wurden keine passenden Produkte gefunden."; `[data-test="category-empty"]` count 1, div, no role, no aria-live | E-08 | AC 10, F-10 |
| O-13 | Observed | Back in English: "There are no products found." count 1, test id count 1; Grinder stays ticked across the language change | E-08 | S-13 |
| O-14 | Observed | Logged-in customer: same 8 tools and prices, "$46.5" for Cordless Drill 12V, same heading and title, no console error | E-09, E-11 | S-17, F-01 |
| O-15 | Observed | Compare selection made as a visitor survived the login (session storage) | E-10 | F-16 |
| O-16 | Observed | Sort dropdown still has no accessible name (no aria-label, no id, no aria-labelledby; role+name "sort" 0) | E-10 | F-09 |
| O-17 | Observed | Console: image preload warning (barn-2400x1600.avif) on each load, besides the known 401s and NG0956 | E-11 | F-14 |
| O-18 | Observed | Tool observation: `wait_for` text has a 5 s timeout, too short for this environment; action 25 failed on it | - | - |

## Test data created

| Data | Cleaned up |
|---|---|
| No records (no cart, order, favourite or account change). Login of the shared customer only | - |
| Language choice DE in local storage | Yes, set back to EN at action 40 (E-08), then the browser closed |
| Compare selection (Circular Saw) in session storage; customer login token | Yes, discarded when the isolated browser closed (action 52) |
| Files on disk: MCP output under `test-output/mcp/` (git-ignored) | Left; evidence copies in `evidence/` |

## Findings map (report v0.2 to observations)

| Finding | Status | Observations |
|---|---|---|
| F-01 | carried, re-observed | v0.1/O-05, O-14 |
| F-02 | changed: was v0.1 F-03 (risk, Inferred), now defect, Observed against the Q-08 answer | O-01, O-07 |
| F-03 | carried, updated (was v0.1 F-02) | v0.1/O-09, O-04, O-08 |
| F-04 | carried | v0.1/O-18 |
| F-05 | resolved by Q-01 | v0.1/O-02, O-05 |
| F-06 | resolved by Q-02 | v0.1/O-14 |
| F-07 | resolved by Q-03, unticking re-checked | v0.1/O-17, O-03 |
| F-08 | carried | v0.1/O-04 |
| F-09 | carried, re-observed | v0.1/O-21, O-16 |
| F-10 | carried, re-observed | v0.1/O-24, O-12 |
| F-11 | carried | v0.1/O-06 |
| F-12 | carried, comparison page now opened | v0.1/O-20, O-06 |
| F-13 | carried | v0.1/O-26 |
| F-14 | carried, updated | v0.1/O-25, O-17 |
| F-15 | new | O-11 |
| F-16 | new | O-15 |
