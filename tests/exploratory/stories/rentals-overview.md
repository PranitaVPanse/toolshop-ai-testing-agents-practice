# TS-2 Customer browses and rents heavy equipment from the Rentals page

**Type:** Story
**Status:** Draft

## Summary

Add a Rentals page that lists the heavy equipment available for hourly rental (Excavator,
Bulldozer, Crane). Each item opens a details page where the customer picks a rental duration,
sees the total price, adds the rental to the cart and sees related rental equipment.

## Story

As a customer (visitor or logged-in)
I want to see the heavy equipment I can rent and open the details for each machine
So that I can choose the right machine and rent it for the number of hours I need

## Description

Toolshop sells tools, and now also rents heavy equipment by the hour. Customers need one place
to find this equipment. The Rentals page is reached from **Categories > Rentals** in the main
menu (`/rentals`). It shows one card per rental item with a photo, the name and a description.

Selecting a card opens that item's details page. Rental items differ from normal products: the
price is per hour, and the customer chooses a duration instead of a quantity. The total updates
as the duration changes. The details page also shows related products so the customer can
compare other machines.

Rental items at launch:

| Item | Price per hour | Use |
|---|---|---|
| Excavator | $136.50 | Digging, trenching, foundations, earthmoving |
| Bulldozer | $147.50 | Grading, site clearing, land levelling |
| Crane | $153.50 | Lifting and placing heavy loads |

## Acceptance criteria

1. **Navigation.** The main menu has **Categories > Rentals**. Selecting it opens the Rentals
   page at `/rentals` with the heading "Rentals" and the page title "Rentals Overview".
2. **Overview content.** The Rentals page shows a card for each rental item: Excavator,
   Bulldozer and Crane. Each card shows the item's photo, name and description. Only rental items
   are listed. Normal (non-rental) products do not appear.
3. **Open details.** Selecting a card (its name or photo) opens the details page for that item.
   Excavator opens Excavator, Bulldozer opens Bulldozer, Crane opens Crane.
4. **Details content.** The details page shows the photo with its credit, name, category, brand,
   CO2 rating, full description and the price in the format "$<price> per hour".
5. **Duration.** The customer chooses a rental duration in whole hours from 1 to 10. It defaults
   to 1 hour, and the label shows the chosen value, for example "Duration (3 hour(s))".
6. **Total price.** The total equals the hourly price multiplied by the duration, shown to two
   decimals, and updates as soon as the duration changes. Example: Excavator for 3 hours shows
   "(Total $409.50)".
7. **Add to cart.** Selecting **Add to cart** adds the rental item to the cart with the chosen
   duration and total. The customer sees a confirmation message and the cart count increases.
8. **Cart.** In the cart, the rental line shows the item name, the duration and the line total
   (hourly price x duration). The cart total includes it.
9. **Related products.** The details page has a "Related products" section that lists the other
   rental items. For example, Excavator shows Bulldozer and Crane, and does not list itself.
   Selecting a related item opens its details page.
10. **Favourites and compare.** **Add to favourites** and **Compare** work for rental items in the
    same way as for normal products. Adding to favourites asks a visitor to sign in first.
11. **Availability.** If a rental item is not available, the details page says so and the
    customer cannot add it to the cart.
12. **Language.** All fixed labels on the Rentals page and the rental details page (heading,
    "per hour", "Duration", "Total", "Related products") are translated when the customer
    changes the language.

## In scope

- Rentals entry in the Categories menu
- Rentals overview page (`/rentals`) listing Excavator, Bulldozer and Crane
- Rental item details page: hourly price, duration selector (1 to 10 hours), live total
- Add to cart with duration, and the rental line in the cart
- Related products on the rental details page
- Add to favourites and Compare for rental items
- Behaviour for visitors and logged-in customers
- Translated labels and mobile layout

## Out of scope

- Checkout and payment for rentals (covered by TS-1 Checkout)
- Booking calendar, start date, delivery address or pickup scheduling
- Real-time fleet availability or reservation hold
- Operator hire, insurance, deposits and damage waivers
- Durations in days or weeks, or durations over 10 hours
- Admin management of rental items (create, edit, price changes)
- Search, filters and sorting on the Rentals page
- Email confirmations, performance, load and security testing

## Assumptions and dependencies

- Rental items are seeded products flagged as rentals in the API (`is_rental = true`).
- Prices are in USD and exclude tax.
- Photos are served with the product data and include a photographer credit.

## Definition of done

- All acceptance criteria pass on the local environment.
- Open questions are answered and the acceptance criteria are updated to match.
- The exploratory testing report for this story is signed off by the QA engineer.
