# KAN-2 Add a Power Tools category page that lists all power tools for sale.

> Mirror of Jira issue KAN-2 for readers of this repository, copied on 2026-10-21. Jira is the source: the exploratory testing agent reads the issue from Jira at every run, not this file.

**Source:** Jira KAN-2, https://<your-site>.atlassian.net/browse/KAN-2
**Type:** Story
**Status:** To Do
**Last updated in Jira:** 2026-10-13 21:52 (+01:00)

## Summary

Add a Power Tools category page that lists all power tools for sale. The customer can narrow the list by sub-category, brand and eco-friendly products, sort it by name, price or CO2 rating, and open any product to see its details.

## Story

As a customer (visitor or logged-in) I want to see all power tools in one place and filter and sort them So that I can quickly find the power tool that fits my job and budget

## Description

The Power Tools page is reached from **Categories > Power Tools** in the main menu (`/category/power-tools`). It has the heading "Category: Power Tools" and the page title "Power Tools".

The page shows a product card for every power tool for sale. Each card shows the product photo, name, CO2 rating (A to E, with the product's rating highlighted), price and a **Compare** button. Rental equipment is not listed here, even when it shares a sub-category.

Power Tools has these sub-categories: Grinder, Sander, Saw and Drill.

Next to the list, the customer can:

| Control | Options |
| --- | --- |
| Sort | Name (A - Z), Name (Z - A), Price (High - Low), Price (Low - High), CO₂ Rating (A - E), CO₂ Rating (E - A) |
| Filter by category | Power Tools, Grinder, Sander, Saw, Drill |
| Filter by brand | The brands that have power tools, for example ForgeFlex Tools and MightyCraft Hardware |
| Sustainability | Show only eco-friendly products |

Power tools at launch (seed data):

| Product | Sub-category | Brand | Price |
| --- | --- | --- | --- |
| Sheet Sander | Sander | ForgeFlex Tools | $58.48 |
| Belt Sander | Sander | MightyCraft Hardware | $73.59 |
| Random Orbit Sander | Sander | ForgeFlex Tools | $100.79 |
| Circular Saw | Saw | ForgeFlex Tools | $80.19 |
| Cordless Drill 12V | Drill | MightyCraft Hardware | $46.50 |
| Cordless Drill 18V | Drill | ForgeFlex Tools | $119.24 |
| Cordless Drill 20V | Drill | ForgeFlex Tools | $125.23 |
| Cordless Drill 24V | Drill | ForgeFlex Tools | $66.54 |

## Acceptance criteria

1. **Navigation.** The main menu has **Categories > Power Tools**. Selecting it opens `/category/power-tools` with the heading "Category: Power Tools" and the page title "Power Tools".
2. **Product list.** The page lists every power tool for sale (all sub-categories) and nothing else. Hand tools, other categories and rental equipment do not appear.
3. **Product card.** Each card shows the photo, name, CO2 rating and price. Prices always show two decimals, for example "$46.50".
4. **Open details.** Selecting a card opens that product's details page.
5. **Sort.** Each sort option reorders the list correctly:

    * Name (A - Z) and Name (Z - A) sort alphabetically.
    * Price (Low - High) and Price (High - Low) sort by price. For example, Price (Low - High) starts with Cordless Drill 12V ($46.50) and ends with Cordless Drill 20V ($125.23).
    * CO₂ Rating (A - E) and (E - A) sort by rating.

6. **Filter by sub-category.** Selecting one or more sub-categories shows only products in the selected sub-categories. For example, Sander shows Sheet Sander, Belt Sander and Random Orbit Sander. Clearing the selection shows all power tools again.
7. **Filter by brand.** Selecting one or more brands shows only products from those brands. Clearing the selection shows all power tools again.
8. **Eco-friendly.** Selecting "Show only eco-friendly products" shows only eco-friendly power tools.
9. **Combined filters.** Sub-category, brand and eco-friendly filters work together. Only products that match all chosen filters are shown, and the chosen sort order is kept.
10. **No results.** When no product matches the filters (for example Grinder, or eco-friendly only), the page shows a "no products found" message instead of an empty area.
11. **Compare.** Selecting **Compare** on a card adds that product to the comparison.
12. **Language.** The heading, sort options, filter labels and the "no products found" message are translated when the customer changes the language. Product names are not translated.

## In scope

* Categories > Power Tools menu entry and the category page (`/category/power-tools`)
* Product cards and opening a product's details page
* Sorting by name, price and CO2 rating
* Filtering by sub-category, brand and eco-friendly, alone and combined
* "No products found" state
* Compare button on the cards
* Behaviour for visitors and logged-in customers
* Translated labels

## Out of scope

* The product details page itself, add to cart and checkout (covered by other stories)
* Other categories (Hand Tools, Other, Special Tools) and the Rentals page (TS-2)
* The home page search and price range slider
* Pagination (all power tools fit on one page today)
* Admin management of products, categories and brands
* Performance, load and security testing

## Assumptions and dependencies

* Products, sub-categories and brands come from the Toolshop API seed data.
* Prices are in USD and exclude tax.
* Filters and sort apply straight away. There is no "Apply" button.

## Definition of done

* All acceptance criteria pass on the local environment.
* Open questions are answered and the acceptance criteria are updated to match.
* The exploratory testing report for this story is signed off by the QA engineer.
