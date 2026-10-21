# Locators: KAN-2 v0.2

Counts in this run: E-10 (19:50:09Z, logged-in customer on `/category/power-tools`, list shown, no
filter, Circular Saw in the comparison), E-08 (no-results state, German and English), E-06 (details
page), E-07 (language menu open). Rows marked "carried" keep their v0.1 count and evidence
(`v0.1/E-08` at 17:28:42Z and `v0.1/E-09` at 17:29:03Z on 2026-10-14, visitor).

Tool note (v0.1/O-27): in the MCP browser `getByTestId` matches `data-testid`, so test ids were
counted as `locator('[data-test="x"]')`, which is what `getByTestId('x')` means in the framework
(`testIdAttribute: 'data-test'`).

Translated text is downgraded one grade (context file: the app is multilingual).

| Element | State | Recommended locator | Strategy | Matches | Role / accessible name | Grade | Tag | Evidence |
|---|---|---|---|---|---|---|---|---|
| Categories menu | any page | `getByTestId('nav-categories')` | 5 test id | 1 | button "Categories" | A | Observed | E-10 |
| Power Tools menu entry | menu closed (count); clicked with menu open in v0.1 | `getByTestId('nav-power-tools')` | 5 test id | 1 | link "Power Tools" (menu open) | A | Observed | E-10, v0.1/E-09 |
| Page heading | page loaded | `getByRole('heading', { name: 'Category: Power Tools', level: 2 })` | 1 role | 1 | heading "Category: Power Tools" | B (translated) | Observed | E-10 |
| Sort dropdown | page loaded | `getByTestId('sort')` | 5 test id | 1; role combobox "sort" 0 | combobox, no name (F-09) | A | Observed | E-10 |
| Sub-category checkbox | page loaded | `getByRole('checkbox', { name: 'Sander', exact: true })` (same for Grinder, Saw, Drill) | 1 role | 1 (Sander E-10; Grinder used E-08) | checkbox "Sander" | B (translated) | Observed | E-10 |
| Power Tools checkbox | page loaded | `getByRole('checkbox', { name: 'Power Tools', exact: true })` | 1 role | 1 | checkbox "Power Tools" | B (translated) | Observed | E-10 |
| Brand checkbox | page loaded | `getByRole('checkbox', { name: 'MightyCraft Hardware', exact: true })` | 1 role | 1 each for both brands (carried) | checkbox "MightyCraft Hardware" | B (seed data name) | Observed | v0.1/E-08, E-02 |
| Eco-friendly checkbox | page loaded | `getByTestId('eco-friendly-filter')` | 5 test id | 1 | checkbox "Show only eco-friendly products" | A | Observed | E-10 |
| Product card | list shown | `getByRole('link').filter({ has: getByRole('heading', { name: '<product>', exact: true, level: 5 }) })` | 1 role, scoped | 1 (Circular Saw) | link "Circular Saw Compare Circular Saw CO₂: A B C D E $80.19" | B | Observed | E-06, E-10 |
| Card names (collection) | list shown | `getByTestId('product-name')` | 5 test id | 8 (8 expected) | heading level 5 | A | Observed | E-10 |
| Card name | list shown | `getByRole('heading', { name: '<product>', exact: true, level: 5 })` | 1 role | 1 | heading "Circular Saw" | A | Observed | E-06 |
| Card price | list shown | `card.getByTestId('product-price')` | 5 test id, scoped | 1, "$80.19" (carried) | generic | B | Observed | v0.1/E-09 |
| Card image | list shown | `card.getByRole('img', { name: '<product>' })` | 1 role, scoped | 1 (carried) | img "Circular Saw" | B | Observed | v0.1/E-08 |
| Card Compare button | list shown | `card.getByTestId('compare-btn')` | 5 test id, scoped | 1 (carried); pressed state `[aria-pressed="true"]` page-wide 1 | button "Compare" (aria-label) | B | Observed | v0.1/E-09, E-10 |
| Compare Now link | after one Compare | `getByTestId('compare-link')` | 5 test id | 1 | link "Compare Now" | A | Observed | E-10 |
| Language selector | any page | `getByTestId('language-select')` | 5 test id | 1; role button "Select language" also 1 | button "Select language" | A | Observed | E-10 |
| Language option | language menu open | `getByTestId('lang-de')`, `getByTestId('lang-en')` | 5 test id | 1 each (one element per code in E-07's list) | - | A | Observed | E-07 |
| No-results message | Grinder ticked, German and English | `getByTestId('category-empty')` | 5 test id | 1 in German, 1 in English | div, no role (F-10) | A | Observed | E-08 |
| Product details heading | details page | `getByRole('heading', { name: '<product>', level: 1 })` | 1 role | 1 | heading "Circular Saw" | A | Observed | E-06 |
| Card highlighted CO₂ letter | list shown | `card.locator('.co2-letter.active')` | 6 scoped CSS | 1, "D" (carried) | generic, no name (F-11) | C | Observed | v0.1/E-08 |
| Comparison page product column | `/comparison` after one Compare | `getByRole('columnheader', { name: 'Circular Saw' })` | 1 role | not counted; text found in a header cell (E-05) | - | proposed, not verified | Assumed | E-05 |

Stable (A or B, count 1 observed): 19. At risk: 1 (CO₂ letter). Not verified: 1 (comparison column).

Alternative no longer recommended: `getByText('There are no products found.')`, count 1 in English (E-08), grade C (translated text). Use the test id.

Never use: `[data-test="product-<id>"]`, `[data-test="category-<id>"]`, `[data-test="brand-<id>"]`;
they hold product, category and brand ids, which change on every reset (context file).
