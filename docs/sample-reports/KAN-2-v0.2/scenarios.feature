# KAN-2 v0.2 scenario candidates. Gherkin only: no step definitions before sign-off.
# Tags carry the agent's recommended decision; the QA engineer decides in qa-review.md.
# Every step that waits on the list waits for the products API answer or the element, never a
# fixed time (Q-05, F-03).

Feature: KAN-2 Power Tools category page

  Background:
    Given a visitor on the Toolshop home page

  @automate-now @functional @ui
  Scenario: S-01 Visitor opens Power Tools from the Categories menu
    When the visitor opens "Categories" in the main menu
    And selects "Power Tools"
    Then the URL path is "/category/power-tools"
    And the heading "Category: Power Tools" is shown

  @automate-now @functional @ui
  Scenario: S-02 Power Tools page title
    When the visitor opens the Power Tools category page
    Then the page title starts with "Power Tools"

  @automate-now @functional @api @ui
  Scenario: S-03 Page lists exactly the eight power tools
    When the visitor opens the Power Tools category page
    Then exactly these products are listed:
      | Sheet Sander        |
      | Belt Sander         |
      | Random Orbit Sander |
      | Circular Saw        |
      | Cordless Drill 12V  |
      | Cordless Drill 18V  |
      | Cordless Drill 20V  |
      | Cordless Drill 24V  |

  @automate-now @functional @ui
  Scenario: S-04 Every card price shows two decimals
    When the visitor opens the Power Tools category page
    Then every product card shows its price with two decimals
    And the card "Cordless Drill 12V" shows the price "$46.50"

  @keep-exploratory @functional @ui @T-03
  Scenario: S-05 Card highlights the product's CO2 rating
    When the visitor opens the Power Tools category page
    Then the card "Circular Saw" highlights CO2 rating "D"
    And the card "Sheet Sander" highlights CO2 rating "E"

  @automate-now @functional @ui
  Scenario: S-06 Selecting a card opens its details page
    Given the visitor is on the Power Tools category page
    When the visitor selects the card "Circular Saw"
    Then the product details page for "Circular Saw" is shown

  @automate-now @functional @api @ui
  Scenario Outline: S-07 Each sort option orders the list
    Given the visitor is on the Power Tools category page
    When the visitor sorts by "<option>"
    Then the listed products are ordered by <key> <direction>

    # Ties (seven products rated E) have no agreed order (gap G-05): assert the order of the key only.
    Examples:
      | option             | key        | direction  |
      | Name (A - Z)       | name       | ascending  |
      | Name (Z - A)       | name       | descending |
      | Price (Low - High) | price      | ascending  |
      | Price (High - Low) | price      | descending |
      | CO₂ Rating (A - E) | CO2 rating | ascending  |
      | CO₂ Rating (E - A) | CO2 rating | descending |

  @automate-now @functional @ui
  Scenario: S-08 Sander filter shows only sanders
    Given the visitor is on the Power Tools category page
    When the visitor ticks the sub-category "Sander"
    Then exactly these products are listed:
      | Sheet Sander        |
      | Belt Sander         |
      | Random Orbit Sander |

  @automate-now @functional @api @ui
  Scenario: S-09 Brand filter shows only that brand
    Given the visitor is on the Power Tools category page
    When the visitor ticks the brand "MightyCraft Hardware"
    Then exactly these products are listed:
      | Belt Sander        |
      | Cordless Drill 12V |

  @automate-now @functional @ui
  Scenario: S-10 Sub-category and brand combine and keep the sort
    Given the visitor is on the Power Tools category page
    And the visitor has sorted by "CO₂ Rating (E - A)"
    When the visitor ticks the sub-category "Drill"
    And ticks the brand "MightyCraft Hardware"
    Then exactly these products are listed:
      | Cordless Drill 12V |
    And the sort shows "CO₂ Rating (E - A)"

  @automate-now @functional @ui
  Scenario Outline: S-11 Clearing a filter restores all eight
    Given the visitor is on the Power Tools category page
    And the visitor has ticked the <filter> "<value>"
    When the visitor unticks the <filter> "<value>"
    Then all eight power tools are listed

    Examples:
      | filter       | value                |
      | sub-category | Sander               |
      | brand        | MightyCraft Hardware |

  @automate-now @functional @ui
  Scenario: S-12 Eco-friendly filter shows the no-results message at launch
    # Q-02: no seed power tool is eco-friendly; check AC 8 through the no-results message until one is.
    Given the visitor is on the Power Tools category page
    When the visitor ticks "Show only eco-friendly products"
    Then no product card is shown
    And the message "There are no products found." is shown

  @automate-now @functional @ui
  Scenario: S-13 Grinder shows the no-results message
    Given the visitor is on the Power Tools category page
    When the visitor ticks the sub-category "Grinder"
    Then no product card is shown
    And the message "There are no products found." is shown

  @automate-now @functional @ui
  Scenario: S-14 Power Tools checkbox selects and clears all sub-categories
    Given the visitor is on the Power Tools category page
    When the visitor ticks the category "Power Tools"
    Then the sub-categories "Grinder", "Sander", "Saw" and "Drill" are ticked
    And all eight power tools are listed
    When the visitor unticks the category "Power Tools"
    Then no sub-category is ticked
    And all eight power tools are listed

  @automate-now @functional @ui
  Scenario: S-15 Compare on a card adds the product
    Given the visitor is on the Power Tools category page
    When the visitor selects Compare on the card "Circular Saw"
    Then the Compare button on "Circular Saw" is pressed
    And the "Compare Now" link is shown
    And the visitor stays on the Power Tools category page

  @clarify-first @functional @ui @Q-09
  Scenario: S-16 Labels are translated on language change
    Given the visitor is on the Power Tools category page
    When the visitor changes the language to "DE"
    Then the heading starts with "Kategorie:"
    And the sort options, filter headings and eco-friendly label are in German
    And product names are unchanged
    When the visitor ticks the sub-category "Grinder"
    Then the message "Es wurden keine passenden Produkte gefunden." is shown

  @automate-now @functional @ui
  Scenario: S-17 Logged-in customer sees the eight power tools
    Given a logged-in customer
    When the customer opens the Power Tools category page
    Then all eight power tools are listed

  @automate-now @regression @api
  Scenario: S-18 Rentals stay off the page when Drill is selected
    Given the visitor is on the Power Tools category page
    When the visitor ticks the sub-category "Drill"
    Then exactly these products are listed:
      | Cordless Drill 12V |
      | Cordless Drill 18V |
      | Cordless Drill 20V |
      | Cordless Drill 24V |
    And "Excavator", "Bulldozer" and "Crane" are not listed

  @keep-exploratory @regression @ui
  Scenario: S-19 Compare selection reaches the comparison page
    Given the visitor has selected Compare on the card "Circular Saw"
    When the visitor selects "Compare Now"
    Then the comparison page shows "Circular Saw"

  @clarify-first @functional @ui @Q-10 @T-04
  Scenario: S-20 A loading sign shows while the list refreshes
    # Q-08: a loading sign is required. Fails today (F-02).
    Given the visitor is on the Power Tools category page
    When the visitor ticks the sub-category "Sander"
    Then a loading sign is shown until the list is refreshed
    And then exactly the three sanders are listed
