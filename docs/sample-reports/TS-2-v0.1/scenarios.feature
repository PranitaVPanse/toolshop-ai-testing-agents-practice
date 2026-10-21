# TS-2 Rentals overview, v0.1 (draft). Gherkin candidates only. No automation code exists.
# Tags: scenario ID, type, agent's decision. The QA engineer's decision goes in qa-review.md.
Feature: Rent heavy equipment from the Rentals page

  @S-01 @functional @automate-now
  Scenario: S-01 Rentals page opens from the Categories menu
    Given a visitor is on the home page
    When the visitor selects "Rentals" in the "Categories" menu
    Then the Rentals page is shown at "/rentals"
    And the heading "Rentals" is shown

  @S-02 @functional @clarify-first
  Scenario: S-02 Rentals page title
    Given a visitor is on the Rentals page
    Then the page title is "Rentals Overview"

  @S-03 @functional @automate-now
  Scenario: S-03 Rentals page lists only the three rental machines
    Given a visitor is on the Rentals page
    Then exactly these rental cards are shown:
      | Excavator |
      | Bulldozer |
      | Crane     |
    And each card shows a photo, a name and a description

  @S-04 @functional @automate-now
  Scenario Outline: S-04 A rental card opens its details page
    Given a visitor is on the Rentals page
    When the visitor selects the <part> of the "<item>" card
    Then the details page of "<item>" is shown

    Examples:
      | item      | part  |
      | Excavator | name  |
      | Bulldozer | photo |
      | Crane     | name  |

  @S-05 @functional @automate-now
  Scenario Outline: S-05 Rental details show the hourly price and product information
    Given a visitor is on the details page of the rental "<item>"
    Then the price is shown as "$<price> per hour"
    And the photo with its credit, the category, the brand, the CO2 rating and the description are shown

    Examples:
      | item      | price  |
      | Excavator | 136.50 |
      | Bulldozer | 147.50 |
      | Crane     | 153.50 |

  @S-06 @functional @automate-now
  Scenario: S-06 Duration defaults to 1 hour and stays between 1 and 10
    Given a visitor is on the details page of the rental "Bulldozer"
    Then the duration is 1 hour
    When the visitor moves the duration to its maximum and one step further
    Then the duration is 10 hours
    When the visitor moves the duration to its minimum and one step further
    Then the duration is 1 hour

  @S-07 @functional @clarify-first
  Scenario Outline: S-07 Label and total follow the chosen duration
    Given a visitor is on the details page of the rental "<item>"
    When the visitor sets the duration to <hours> hours
    Then the duration label reads "Duration (<hours> hour(s))"
    And the total reads "(Total $<total>)"

    Examples:
      | item      | hours | total   |
      | Excavator | 1     | 136.50  |
      | Excavator | 3     | 409.50  |
      | Bulldozer | 10    | 1475.00 |

  @S-08 @functional @automate-now
  Scenario: S-08 A rental is added to the cart with its duration and total
    Given a visitor is on the details page of the rental "Excavator"
    And the visitor sets the duration to 3 hours
    When the visitor adds the rental to the cart
    And the visitor opens the cart
    Then the cart has one line for "Excavator" marked as a rental priced per hour
    And the line shows 3 hours, the price "$136.50" and the line total "$409.50"
    And the cart total is "$409.50"

  @S-09 @functional @clarify-first
  Scenario: S-09 Adding a rental confirms and updates the cart count
    Given a visitor is on the details page of the rental "Excavator"
    And the visitor sets the duration to 3 hours
    When the visitor adds the rental to the cart
    Then a confirmation message is shown
    And the cart count in the header increases

  @S-10 @functional @clarify-first
  Scenario: S-10 The cart does not allow a rental longer than 10 hours
    Given a visitor has the rental "Excavator" in the cart for 3 hours
    When the visitor changes the rental's duration in the cart to 11
    Then the change is rejected
    And the line still shows 3 hours

  @S-11 @functional @clarify-first
  Scenario: S-11 Adding the same rental again does not pass 10 hours
    Given a visitor has the rental "Excavator" in the cart for 10 hours
    When the visitor adds the rental "Excavator" for 1 hour again
    Then the cart does not hold more than 10 hours of "Excavator"

  @S-12 @functional @clarify-first
  Scenario: S-12 Related products list the other rentals
    Given a visitor is on the details page of the rental "Excavator"
    Then the related products are "Bulldozer" and "Crane"
    And "Excavator" is not among the related products
    When the visitor selects the related product "Crane"
    Then the details page of "Crane" is shown

  @S-13 @functional @clarify-first
  Scenario: S-13 A visitor is asked to sign in before adding a favourite
    Given a visitor is on the details page of the rental "Crane"
    When the visitor selects "Add to favourites"
    Then the visitor is asked to sign in
    And the rental is not added to any favourites list

  @S-14 @functional @automate-now
  Scenario: S-14 A logged-in customer adds a rental to favourites
    Given a logged-in customer is on the details page of the rental "Crane"
    When the customer selects "Add to favourites"
    Then "Crane" is listed under the customer's favourites
    And the test removes "Crane" from the favourites afterwards

  @S-15 @functional @clarify-first
  Scenario: S-15 A rental can be compared
    Given a visitor is on the details page of the rental "Crane"
    When the visitor selects "Compare"
    Then "Crane" is shown in the comparison

  @S-16 @functional @clarify-first
  Scenario: S-16 An unavailable rental cannot be added to the cart
    Given the rental "Crane" is not available
    When a visitor opens the details page of "Crane"
    Then the page says the rental is not available
    And the rental cannot be added to the cart

  @S-17 @functional @clarify-first
  Scenario: S-17 Rental labels are translated
    Given a visitor has chosen the language "DE"
    When the visitor opens the Rentals page and the details page of "Excavator"
    Then the heading, "per hour", "Duration", "Total" and "Related products" are shown in German

  @S-18 @functional @keep-exploratory
  Scenario: S-18 Rentals pages are usable at mobile width
    Given a visitor uses a viewport 375 pixels wide
    When the visitor opens the Rentals page and the details page of "Excavator"
    Then nothing is cut off, overlapped or scrolls sideways

  @S-19 @regression @not-worth-automating
  Scenario: S-19 The Rentals page opens from a direct link and keeps the cart
    Given a visitor has a rental in the cart
    When the visitor opens "/rentals" directly
    Then the Rentals page is shown
    And the cart still holds the rental

  @S-20 @regression @automate-now
  Scenario: S-20 A visitor's cart with a rental survives login
    Given a visitor has the rental "Excavator" in the cart for 3 hours
    When the visitor logs in as a customer
    And the customer opens the cart
    Then the cart still has "Excavator" for 3 hours with the line total "$409.50"

  @S-21 @regression @keep-exploratory
  Scenario: S-21 A normal product still uses a quantity, not a duration
    Given a visitor is on the details page of a normal product
    Then a quantity control is shown
    And no duration, "per hour" or rental total is shown
