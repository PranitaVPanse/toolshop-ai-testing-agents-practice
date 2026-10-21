# Locators: TS-3 v0.3

Rows counted in this run cite `E-nn`. Rows not re-counted are carried from v0.2 and cite
`v0.2/E-nn`; they keep their tag and are not new observations. Method in this run: Playwright
locator `count()` in read-only parts of code-run calls (E-01, E-02, E-07, E-08, E-09).

Tool note (carried from v0.2/E-16): the MCP browser session uses the default test id attribute,
so test ids were counted as `[data-test="x"]`. The project configures `data-test`, so in the
framework `getByTestId('x')` equals `[data-test="x"]`.

The app is multilingual and tests run in English only (context file), so a locator that rests on
visible text or an accessible name is graded one level lower. Spanish names differ (E-10).

| Element | State | Recommended locator | Strategy | Matches | Role / accessible name | Grade | Tag | Evidence |
|---|---|---|---|---|---|---|---|---|
| Main menu > Contact | Home page, visitor | `getByRole('link', { name: 'Contact' })` | 1 role and name | 1 (also 1 with `exact: true`) | link "Contact" | B | Observed | E-01 |
| Contact > heading | Visitor form (carried); customer form | `getByRole('heading', { name: 'Contact' })` | 1 role and name | 1; 1 | heading "Contact", level 3 | B | Observed | v0.2/E-16, E-07 |
| Contact > First name | Visitor form | `getByRole('textbox', { name: 'First name' })` | 1 role and name | 1; 0 for a customer | textbox "First name" | B | Observed | v0.2/E-16, E-07 |
| Contact > Last name | Visitor form | `getByLabel('Last name')` | 2 label | 1; 0 for a customer | textbox "Last name" | B | Observed | v0.2/E-16, E-07 |
| Contact > Email address | Visitor form | `getByLabel('Email address')` | 2 label | 1; 0 for a customer | textbox "Email address" | B | Observed | v0.2/E-16, E-07 |
| Contact > Subject | Visitor form (carried); customer form | `getByRole('combobox', { name: 'Subject' })` | 1 role and name | 1; 1 | combobox "Subject" | B | Observed | v0.2/E-16, E-07 |
| Contact > Message | Visitor form (carried); customer form | `getByRole('textbox', { name: 'Message' })` | 1 role and name | 1; 1 | textbox "Message *" | B | Observed | v0.2/E-16, E-07 |
| Contact > Attachment | Visitor form (carried); customer form | `getByLabel('Attachment')` | 2 label | 1; 1 | button "Attachment" (file control) | B | Observed | v0.2/E-16, E-07 |
| Contact > Send button | Visitor form (carried); customer form | `getByRole('button', { name: 'Send' })` | 1 role and name | 1; 1; 0 after the confirmation | button "Send" | B | Observed | v0.2/E-16, E-07, v0.2/E-19 |
| Contact > First name message | After Send on the empty form | `getByTestId('first-name-error')` | 5 test id | 1 visible; 0 when the field is valid | alert "First name is required" | A | Observed, carried from v0.2 | v0.2/E-03, v0.2/E-17 |
| Contact > Last name message | After Send on the empty form | `getByTestId('last-name-error')` | 5 test id | 1 visible; 0 when valid | alert "Last name is required" | A | Observed, carried from v0.2 | v0.2/E-03, v0.2/E-17 |
| Contact > Email address message | After Send on the empty form | `getByTestId('email-error')` | 5 test id | 1 visible; 0 when valid | alert "Email is required" | A | Observed, carried from v0.2 | v0.2/E-03, v0.2/E-17 |
| Contact > Subject message | After Send on the empty form | `getByTestId('subject-error')` | 5 test id | 1 visible; 0 when valid | alert "Subject is required" | A | Observed, carried from v0.2 | v0.2/E-03, v0.2/E-17 |
| Contact > Message message | After Send on the empty form | `getByTestId('message-error')` | 5 test id | 1 visible; 0 when valid | alert "Message is required" | A | Observed, carried from v0.2 | v0.2/E-03, v0.2/E-17 |
| Contact > Attachment message | Non-empty txt chosen | `getByTestId('attachment-error')` | 5 test id | 1 | alert "File should be empty." | A | Observed, carried from v0.2 | v0.2/E-17 |
| Contact > confirmation | After a successful send, as a customer | `getByRole('alert').filter({ hasText: 'Thanks for your message! We will contact you shortly.' })` | 1 role with text filter | 1 | alert, text as shown | B | Observed | E-08, v0.2/E-19 |
| Account > Messages > row of one message | Customer, after a send | `getByRole('row', { name: /<start of the message text>/ })` | 1 role and name | 1 (with `/ETA-20261012-1744/`); the list had 2 rows | row | B | Observed | E-09 |
| Contact > Attachment hint | Visitor form | `getByText('Only files with the txt extension are allowed, and files must be 0kb.')` | 4 text | 1; `locator('#attachmentHelp')` also 1; `[data-test="attachment-hint"]` 0 | text; no role; not referenced by the file control | C | Observed | E-02 |
| Contact > alert after a refused send | After Send with 251 characters (v0.2) or 60 spaces (v0.3) | `locator('.alert.alert-danger')` | 6 CSS | not counted with a locator; DOM reads list one visible alert without role and test id | none | D, proposed, not verified | Assumed | v0.2/E-18, E-04 |
| Contact > Send busy state | While a send is pending | none exists | - | no disabled state and no `aria-busy` at 49 and 75 ms | - | D | Observed | E-05, E-08 |

Notes:

- The message row is graded B, not C: its text is the test's own input, not seed data. Two
  limits: the list shows only the first 50 characters, and it keeps the messages of earlier runs,
  so the text must be unique within those 50 characters (F-16).
- Field messages by test id were not re-counted with a locator in this run. DOM reads of this
  run list the same test ids on the visible alerts: `email-error` alone after Send with an
  invalid address (E-03) and the five required ones in Spanish (E-10).
- Each field also has a test id that matched 1 in v0.2 (`first-name`, `last-name`, `email`,
  `subject`, `message`, `attachment`, `contact-submit`, `nav-contact`; v0.2/E-17). They are grade A
  and the fallback if a test must run in another language. This run drove the page with them.
- For a logged-in customer the name and email locators match 0 once the account is applied, but
  they match for a moment after the page opens (F-07, E-07). A test must not assert their absence
  at once without a retrying assertion.

Counts: 17 stable (menu link, heading, 6 fields, Send, 6 field messages, confirmation, message
row), 1 at risk (Attachment hint), 2 blocked (alert after a refused send, busy state), 0 not verified.

## Testability requests

```
ID:           T-01 (carried from v0.1)
Element:      Contact > Attachment hint
Problem:      Found only by its translated sentence (1 match) or by the id attachmentHelp
              (1 match). No test id; the file control has no aria-describedby
Request:      Reference attachmentHelp from the file control with aria-describedby; add test id
              "attachment-hint"
Benefit:      The hint is read with the field; a check that does not depend on the language
Evidence:     E-02
```

```
ID:           T-02 (carried from v0.1)
Element:      Contact > alert after a refused send
Problem:      One visible alert with style classes only: no role, no test id
Request:      Give it role alert and test id "contact-error"
Benefit:      Screen readers hear it; a stable locator for S-10 and S-17
Evidence:     v0.2/E-18, E-04
```

```
ID:           T-03 (carried from v0.1)
Element:      Contact > field messages
Problem:      Each message has role alert but no field has aria-describedby or aria-invalid, and
              focus stays on Send after a refused send
Request:      Link each message to its field and move focus to the first invalid field
Benefit:      Messages are read with their field; a test finds a field's message through the field
Evidence:     E-02, E-03
```

```
ID:           T-04 (carried from v0.1)
Element:      Contact > required fields
Problem:      No field has required or aria-required; three marks sit in placeholders
Request:      Add required or aria-required and put * in the label
Benefit:      The required state is exposed; a test asserts it without reading placeholders
Evidence:     E-02
```

```
ID:           T-05 (named by the QA engineer in the answer to Q-08)
Element:      Contact > Send button while a message is being sent
Problem:      No busy state. Send is enabled with no aria-busy 49 and 75 ms after the click while
              the answers took 4123 and 12252 ms. A second click 48 ms later stored a second message
Request:      Disable Send and set aria-busy on the form while the request is pending
Benefit:      No second message; a test waits for a defined state; users see the click was taken
Evidence:     E-05, E-08, v0.2/E-18, v0.2/E-19
```

```
ID:           T-06 (carried from v0.2, widened)
Element:      Contact > Message field
Problem:      The refusals for more than 250 characters and for spaces only come from the server
              and are shown in the alert of T-02, not under the field
Request:      Show both under the Message field with test id "message-error" and role alert, as
              the QA engineer's answer to Q-04 requires for the maximum
Benefit:      One stable locator for every Message rule; the error is announced
Evidence:     v0.2/E-18, E-04
```
