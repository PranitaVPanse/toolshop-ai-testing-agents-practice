# QA review: KAN-2 v0.2

Fill in the two tables, and the Jira comment if you want it posted. Leave a cell empty to keep
the item pending. The next run reads this
file; nothing else in the report needs editing.

## Answers

| ID | Question | Answer |
|---|---|---|
| Q-01 | The page title is "Power Tools - Practice Software Testing - Toolshop - v5.0". Should AC 1 say the title starts with "Power Tools", or must it be exactly "Power Tools"? | A title that starts with "Power Tools" is accepted; the app suffix is fine. |
| Q-02 | No power tool in the seed data is eco-friendly. What makes a product eco-friendly, and should the seed data get at least one eco-friendly power tool so AC 8 can be shown, or is an empty result the expected launch state? | Eco-friendly means the product's eco-friendly flag. An empty result is correct for launch: check AC 8 through the no-results message until the seed data has an eco-friendly power tool. |
| Q-03 | Ticking "Power Tools" under By category ticks all four sub-categories. Is that intended, and what should unticking it do? | Yes, "Power Tools" is a select-all. Unticking it must clear all four sub-categories and show all power tools again. Please re-check unticking. |
| Q-04 | Is "There are no products found." the agreed text for AC 10, in English and the other languages? | Yes, "There are no products found." is the agreed English text. |
| Q-05 | Product list answers on local took 1.4 s to 42.8 s, and a direct API call took 13 s. Is the local stack expected to be this slow, and what response time should the page meet? | Slow answers on local are an environment matter, not a product rule. Tests must wait for the API answer, never a fixed time. |
| Q-06 | With no sort chosen, the order is Sheet Sander, Belt Sander, Random Orbit Sander, Circular Saw, Cordless Drill 20V, 24V, 18V, 12V. Is any default order required? | |
| Q-07 | Should the brand filter list only brands that have power tools, or all brands? The seed data has only two brands, so the two cannot be told apart | |
| Q-08 | Should the page show a loading sign while the list refreshes after a sort or filter change? | Yes, a loading sign is required while the list refreshes after a sort or filter change. |
| Q-09 | Which languages must AC 12 cover, and are sub-category names (Grinder, Sander, Saw, Drill) translated? | |
| Q-10 | What should the required loading sign be (for example a "Loading..." text as on the comparison page, or a spinner), and should the old list stay visible or be hidden while it shows? | |

## Decisions

| ID | Scenario | Agent's decision | QA decision | Note |
|---|---|---|---|---|
| S-01 | Visitor opens Power Tools from the Categories menu | automate now | | |
| S-02 | Power Tools page title | automate now | | |
| S-03 | Page lists exactly the eight power tools | automate now | | |
| S-04 | Every card price shows two decimals | automate now | | |
| S-05 | Card highlights the product's CO₂ rating | keep exploratory | | |
| S-06 | Selecting a card opens its details page | automate now | | |
| S-07 | Each sort option orders the list | automate now | | |
| S-08 | Sander filter shows only sanders | automate now | | |
| S-09 | Brand filter shows only that brand | automate now | | |
| S-10 | Sub-category and brand combine and keep the sort | automate now | | |
| S-11 | Clearing a filter restores all eight | automate now | | |
| S-12 | Eco-friendly filter shows the no-results message at launch | automate now | | |
| S-13 | Grinder shows the no-results message | automate now | | |
| S-14 | Power Tools checkbox selects and clears all sub-categories | automate now | | |
| S-15 | Compare on a card adds the product | automate now | | |
| S-16 | Labels are translated on language change | clarify first | | |
| S-17 | Logged-in customer sees the eight power tools | automate now | | |
| S-18 | Rentals stay off the page when Drill is selected | automate now | | |
| S-19 | Compare selection reaches the comparison page | keep exploratory | | |
| S-20 | A loading sign shows while the list refreshes | clarify first | | |

## Jira comment

Only for stories from an issue tracker. Edit the text as you like: it is posted exactly as
written. Tick the box and the next run posts it; leave it unticked and nothing is posted.

- [ ] Post this comment to KAN-2 in the next run
- Posted: no (the v0.1 comment was not posted)

```text
Exploratory testing of KAN-2, report v0.2 (draft), local environment.

Answered by QA since v0.1: page title may carry the app suffix; no eco-friendly power tool at launch is expected; "Power Tools" is a select-all; "There are no products found." is the agreed text; a loading sign is required while the list refreshes.

Open questions (the agent's working assumption in brackets):
Q-06 (product owner): With no sort chosen, the order is Sheet Sander, Belt Sander, Random Orbit Sander, Circular Saw, Cordless Drill 20V, 24V, 18V, 12V. Is any default order required? [None]
Q-07 (product owner): Should the brand filter list only brands that have power tools, or all brands? The seed data has only two brands, so the two cannot be told apart. [Only brands with power tools]
Q-09 (product owner): Which languages must AC 12 cover, and are sub-category names (Grinder, Sander, Saw, Drill) translated? [The seven languages in the selector; category names stay English, as they do today in German]
Q-10 (product owner): What should the required loading sign be (for example a "Loading..." text as on the comparison page, or a spinner), and should the old list stay visible or be hidden while it shows? [A text or spinner announced to screen readers; old list hidden]

Findings worth your attention:
F-01: The Cordless Drill 12V card shows "$46.5" instead of "$46.50" (AC 3), for visitors and logged-in customers.
F-02: There is no loading sign while the list refreshes after a sort or filter change; in one case the old list stayed on screen for 46 seconds.
F-15: In German the heading reads "Kategorie: Power Tools" and the category filter keeps Power Tools, Grinder, Sander, Saw and Drill in English (see Q-09).
```

## Sign-off

- [ ] Signed off by ____________ on __________
