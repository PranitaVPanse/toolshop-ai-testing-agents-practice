# Technical notes: KAN-2 v0.2

Carried items keep their v0.1 evidence (`v0.1/E-nn`).

## Console (E-11)

| Action | Level | Message | Note |
|---|---|---|---|
| 1, 27, 32, 42 (visitor loads) | error | 401 Unauthorized `GET http://localhost:8091/users/me`, twice per load | Known quirk for visitors (`pages/product-overview.md`) |
| same | error | `ERROR {message: Unauthorized}` from Angular | Same cause |
| each load | warning | `barn-2400x1600.avif` preloaded but not used within a few seconds | New in this run's log; not in v0.1's warning list (F-14) |
| list re-renders | warning | NG0956: track by identity re-created the whole collection of 8 | F-14, carried (v0.1/E-10) |
| 47-49 (logged in) | - | No error | The 401s are visitor-only |

## Network (E-02, E-08, E-12)

- Click to `QUERY /products` answer in this run: 977 ms (untick MightyCraft) to 46,016 ms (tick
  Sander) (E-02); German Grinder 36,652 ms (E-08). v0.1: 1,420 ms to 42,816 ms (v0.1/E-05, v0.1/E-09).
- `/comparison` showed "Loading..." for 21,033 ms before the product appeared (E-05).
- Details page: URL changed 255 ms after the click; h1 appeared after 23,717 ms (E-06).
- Login `POST /users/login` 200; scripted login took 9,999 ms to reach `/account` (E-09).
- Language change loads `assets/i18n/de.json` (200) and sends one new `QUERY /products` (E-12).
- No call failed except the visitor `users/me` 401s. No call contradicted the UI.
- Carried: requests are not cancelled when a newer one starts (F-04, v0.1/E-11); body parameters
  `eco_friendly` and `by_category_slug` are not in the GET documentation (F-13).
- curl before the run: API `/brands` 200 in 28.2 s (ledger header): the environment was slow throughout.

## API notes

Carried from v0.1 (OpenAPI not re-read): `GET /products` documents `by_brand`, `by_category`,
`is_rental`, `between`, `sort`, `page`; every power tool has `is_eco_friendly: false`; `per_page` 9.

## Step 6. API level or UI level

Carried from v0.1, plus:

| Check | Lowest level | Endpoint |
|---|---|---|
| Clearing a filter restores all eight (S-11) | UI | wiring of untick to request |
| Power Tools select-all and clear (S-14) | UI | checkbox state is client-side |
| Open details (S-06), comparison page (S-19) | UI | navigation |
| Logged-in customer list (S-17) | UI, one check | `QUERY /products` is the same call |
| Language (S-16) | UI | `assets/i18n/<lang>.json`; category names come from `/categories/tree` |
| Loading sign (S-20) | UI | rendering |

## Accessibility observations

Observations from DOM reads and snapshots, not an audit.

- Sort dropdown has no accessible name: no aria-label, no id for a label, no aria-labelledby (F-09, T-01, E-10).
- No-results message is a plain div with no role or live region, in English and German (F-10, T-02, E-08).
- List refresh gives no visual or announced sign; old content stays for up to 46 s (F-02, T-04, E-02).
- CO₂ rating only by CSS class (F-11, T-03, carried v0.1/E-03).
- Compare is a button inside the card link (nested interactive), carried (v0.1/E-01); keyboard not checked.
- In German the browser title stays English (F-15, E-07); the `lang` attribute of the page was not read.
- Compare button state uses `aria-pressed` (good) (E-03, E-10).
- Filter checkboxes have accessible names from their labels (E-10).
