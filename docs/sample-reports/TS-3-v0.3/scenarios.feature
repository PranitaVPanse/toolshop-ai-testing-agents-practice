# TS-3 v0.3. Gherkin candidates only. No step definitions exist before sign-off.
# The first tag is the decision shown in the report: the QA decision where one exists
# ("carried (QA)"), otherwise the agent's recommendation.

Feature: Contact form

  @automate-now @functional @ui
  # carried (QA): Automate now. Link count on the home page observed in v0.3 (E-01)
  Scenario: S-01 Contact page opens from the main menu
    Given a visitor is on the home page
    When they select "Contact" in the main menu
    Then the Contact page is shown at "/contact"
    And the page heading is "Contact"

  @automate-now @functional @ui
  # carried from v0.2. The test waits for the title: it is set shortly after the route opens
  Scenario: S-02 Contact page title
    Given a visitor opened the Contact page from the main menu
    Then the page title starts with "Contact Us"

  @automate-now @functional @ui
  # carried (QA): Automate now, without the attachment hint step
  Scenario: S-03 Contact form shows its fields and the Send button
    Given a visitor is on the Contact page
    Then the form shows the fields "First name", "Last name", "Email address", "Subject", "Message" and "Attachment", each with a label
    And the form shows the "Send" button

  @clarify-first @functional @ui
  # Depends on Q-02 and Q-13. Observed: only the Message label has the mark (E-02)
  Scenario: S-04 Required fields are marked
    Given a visitor is on the Contact page
    Then the labels "First name", "Last name", "Email address", "Subject" and "Message" are marked with "*"

  @automate-now @functional @ui
  # The text of the first option depends on Q-03 and is left out
  Scenario: S-05 Subject offers the six subjects
    Given a visitor is on the Contact page
    Then the Subject drop-down has no subject selected
    And it offers "Customer service", "Webmaster", "Return", "Payments", "Warranty" and "Status of my order"

  @automate-now @functional @ui
  # carried (QA): Automate now
  Scenario: S-06 Empty required fields show their messages
    Given a visitor is on the Contact page
    When they select "Send" without filling in anything
    Then the form shows "First name is required", "Last name is required", "Email is required", "Subject is required" and "Message is required"
    And no message is sent

  @automate-now @functional @ui
  # carried (QA): Automate now. The Send click with the invalid address was observed in v0.3 (E-03)
  Scenario: S-07 An invalid email address is rejected
    Given a visitor filled in a valid first name, last name, subject and message
    And they entered "not-an-email" in "Email address"
    When they select "Send"
    Then the Email address field shows "Email format is invalid"
    And no message is sent

  @clarify-first @functional @ui
  # carried (QA): Clarify first. The proof asked for in the note is in v0.2: no attachment is
  # used, and 50 characters are proven by the confirmation. The agent suggests Automate now
  Scenario: S-08 The message needs at least 50 characters
    Given a visitor filled in a valid first name, last name, email address and subject
    And they entered a message of 49 characters
    When they select "Send"
    Then the Message field shows "Message must be minimal 50 characters"
    And no message is sent
    When they add one character to the message and leave the field
    Then the Message field shows no message
    When they select "Send"
    Then the confirmation "Thanks for your message! We will contact you shortly." is shown

  @automate-now @functional @ui
  # carried from v0.2
  Scenario Outline: S-09 An error disappears when its field is corrected
    Given a visitor selected "Send" on the empty Contact form
    When they type "<value>" in "<field>" and leave the field
    Then the message "<message>" is no longer shown

    Examples:
      | field         | value                    | message                |
      | First name    | ETA                      | First name is required |
      | Email address | not-an-email@example.com | Email is required      |
    # The Message field is covered by S-08: its message changes only when the field loses focus (F-09)

  @clarify-first @functional @ui
  # Expected by the QA answer to Q-04. Observed in v0.2: defect F-03, the request is sent and the raw server text is shown
  Scenario: S-10 A message above the maximum length is refused clearly
    Given a visitor filled in a valid first name, last name, email address and subject
    And they entered a message of 251 characters
    When they select "Send"
    Then the Message field shows a message about the maximum of 250 characters
    And no message is sent

  @automate-now @functional @ui
  # carried (QA): Automate now. Re-checked in v0.2 with the Send click
  Scenario: S-11 An attachment that is not a txt file is refused
    Given a visitor filled in every required field with valid values
    And they chose an empty file "empty.pdf" as attachment
    When they select "Send"
    Then the Attachment field shows "File should have a txt extension."
    And no message is sent

  @automate-now @functional @ui
  # carried from v0.2
  Scenario: S-12 A txt attachment larger than 0 KB is refused
    Given a visitor filled in every required field with valid values
    And they chose a txt file of 31 bytes as attachment
    When they select "Send"
    Then the Attachment field shows "File should be empty."
    And no message is sent

  @automate-now @functional @ui
  # carried from v0.2. The wait for the confirmation needs a timeout above the slowest answer seen (Q-14)
  Scenario: S-13 A valid message is sent and confirmed
    Given a visitor filled in every required field with valid values
    And they chose an empty txt file as attachment
    When they select "Send"
    Then the form is replaced by "Thanks for your message! We will contact you shortly."
    And the visitor is still on the Contact page

  @automate-now @functional @ui
  # Observed in v0.3 (E-07, E-08) and in v0.1. The form is asserted after the name fields have gone (F-07)
  Scenario: S-14 A logged-in customer only chooses a subject and writes a message
    Given a customer is logged in
    And they opened the Contact page from the main menu
    Then the form shows "Subject", "Message" and "Attachment" and no "First name", "Last name" or "Email address"
    When they choose the subject "Payments" and enter a valid message
    And they select "Send"
    Then the form is replaced by "Thanks for your message! We will contact you shortly."

  @automate-now @regression @ui
  # Observed in v0.3 (E-09). The message text must be unique in its first 50 characters:
  # the list cuts it there and keeps the messages of earlier runs (F-16)
  Scenario: S-15 A customer's message appears under Account > Messages
    Given a logged-in customer sent a message through the Contact form
    When they open "Messages" in their account
    Then the list has a row with the start of that message and the status "NEW"

  @clarify-first @functional @ui
  # Depends on Q-11. Spanish observed in v0.3 for labels, placeholders, options, hint and the
  # required messages (E-10); German in v0.1. Tests run in English only
  Scenario: S-16 The Contact form is translated
    Given a visitor is on the Contact page
    When they change the language
    Then the labels, placeholders, subject options, hint and error messages are shown in that language

  @clarify-first @functional @ui
  # Depends on Q-12. Observed in v0.3: the form accepts spaces, the API refuses a message of
  # spaces with raw server text (F-04) and stores a first name of spaces (F-05)
  Scenario: S-17 Input made of spaces only is not accepted
    Given a visitor is on the Contact page
    When they fill the required text fields with spaces only
    And they select "Send"
    Then each of those fields shows its required message
    And no message is sent

  @not-worth-automating @functional @ui
  # carried (QA): Not worth automating
  Scenario: S-18 The Contact page opens from a direct link
    When a visitor opens "/contact" directly
    Then the Contact page is shown with its form

  @clarify-first @functional @ui
  # Expected by the QA answer to Q-08. Observed in v0.3: no busy state (F-02) and two clicks
  # store two messages (F-01). Automate after the fix (T-05)
  Scenario: S-19 Sending stays safe while the server is slow
    Given a visitor filled in every required field with valid values
    When they select "Send" twice in a row
    Then the Send button shows a busy state until the answer arrives
    And only one message is stored

  @automate-now @functional @api
  # carried from v0.2. POST /messages. Observed through the UI request in v0.2/E-18
  Scenario: S-20 The API refuses a message above 250 characters
    Given a contact request with a valid name, email address and subject
    And a message of 251 characters
    When the request is posted to "/messages"
    Then the answer has status 422
    And the answer names the message field and the limit of 250 characters

  @clarify-first @regression @ui
  # New in v0.3, split from S-15. Depends on Q-10. Observed: subject "payments" and a time one hour behind (F-08)
  Scenario: S-21 Account > Messages shows the subject and time as the customer knows them
    Given a logged-in customer sent a message with the subject "Payments"
    When they open "Messages" in their account
    Then the row shows the subject "Payments"
    And the row shows the time of sending in the customer's local time
