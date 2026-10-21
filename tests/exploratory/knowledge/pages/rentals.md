# Page: Rentals overview

Route `/rentals`, reached from **Categories > Rentals** in the main menu. One card per rental
machine. Sources: (docs), (run of 2026-10-10, unversioned).

## Main functionality

- Lists the rental products (`is_rental = true`): Excavator, Bulldozer, Crane on local seed data.
- Each card shows photo, name and description. Selecting the name or the photo opens the
  product details page (run of 2026-10-10).
- No search, filter or sort on this page (story TS-2, out of scope).

## Stable locators (verified in a report)

| Element | Locator | Grade | Source |
|---|---|---|---|
| Menu entry | `getByTestId('nav-rentals')` | A | run of 2026-10-10 |
| Heading | `getByRole('heading', { name: 'Rentals', level: 1 })` | B (translated) | run of 2026-10-10 |
| Card name | `getByRole('heading', { name: '<item>', exact: true })` | A | run of 2026-10-10 |
| Card photo | `getByRole('img', { name: '<item>', exact: true })` | A | run of 2026-10-10 |

## Known quirks

- Cards are focusable `div`s with no link role; `getByRole('link')` finds nothing (run of 2026-10-10).
- Card test ids contain the product id, which changes on every reset. Never use them.
- The page title carries the app suffix: "Rentals Overview - Practice Software Testing - Toolshop - v5.0".

## Regression checks when this page changes

Product details of each rental (F2), the Categories menu, the German menu entry "Mietgeräte".
