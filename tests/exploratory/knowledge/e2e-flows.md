# End-to-end flows: Toolshop

Maintained by the QA engineer. The agent reads this before every run to see how the pages of a
story connect, and which other pages a change can affect. Sources: **(docs)** the Toolshop
documentation, **(TS-n vX.Y)** a report of that story and version. A signed version (`.0`)
is confirmed; a draft is not. Anything without a source is unverified.

## Pages and routes

| Page | Route | Main job |
|---|---|---|
| Home / product overview | `/` | Search, filter by category and brand, sort, price range, pagination, open a product (docs) |
| Category page | `/category/<slug>` | The overview filtered to one category (docs) |
| Rentals overview | `/rentals` | One card per rental machine (run of 2026-10-10) |
| Product details | `/product/<id>` | Photo, price, quantity or rental duration, add to cart, favourites, compare, related products (docs, run of 2026-10-10) |
| Compare | `/compare` | Side-by-side specifications of selected products (docs) |
| Cart and checkout | `/checkout` | Cart lines with editable quantity and remove; then sign in, billing address, payment, confirmation (docs, TS-1 draft) |
| Login, register, forgot password | `/auth/login`, `/auth/register`, `/auth/forgot-password` | Authentication; accounts lock after repeated failures (docs) |
| Account | `/account`, `/account/profile`, `/account/favorites`, `/account/invoices`, `/account/messages` | Profile, password, favourites, invoices with PDF, contact messages (docs) |
| Contact | `/contact` | Contact form with file upload (docs) |
| Admin | `/admin/...` | CRUD of products, brands, categories, users, orders; reporting (docs) |

## Flows

- **F1 Browse and buy.** Home → filter or search → product details → Add to cart (badge in the
  header) → cart → sign in step (login or register) → billing address → payment → confirmation →
  the order appears under Account > Invoices (docs).
- **F2 Rent.** Categories > Rentals → rental details → duration 1 to 10 hours → Add to cart →
  the same cart and checkout as F1. The duration is stored as the cart line's quantity
  (run of 2026-10-10).
- **F3 Favourites.** Product details → Add to favourites (login required) → Account >
  Favourites → remove (docs, run of 2026-10-10).
- **F4 Compare.** Product details → Compare → `/compare` (docs). Selection lives in session
  storage (run of 2026-10-10).
- **F5 Account.** Register → login → update profile, change password → logout (docs).
- **F6 Contact.** Contact form, optionally with an attachment → message visible under
  Account > Messages when logged in (docs).
- **F7 Admin.** Admin login → change a product, brand or category → the change shows on the
  public site (docs).

## Shared state that crosses pages

- Cart: cart id in session storage. A visitor's cart survives login (run of 2026-10-10). The cart badge
  in the header is on every page.
- Compare selection: session storage (run of 2026-10-10).
- Language: header selector, applies to every page (docs: multi-language).
- Login session: token in local storage; account routes need it (unverified).

## Impact map: a change on one page can affect these

| Change on | Check also |
|---|---|
| Product details, including rentals | Cart lines and totals, checkout totals, invoices, favourites, compare, related products of other products |
| Cart | Checkout steps, cart badge on every page, invoice totals |
| Login or register | Checkout sign-in step, favourites, account pages, admin |
| Product overview filters, search, sort | Category pages, rentals overview (same product data), related products |
| Admin product changes | Overview, details, cart pricing, out-of-stock states |
| Language files | Every page: fixed labels, validation messages, menu entries |
