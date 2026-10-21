# Automation-readiness report: TS-3 Customer sends a message to Toolshop through the Contact form
| | |
|---|---|
| Version | v0.3 (draft); previous: v0.2 (draft), v0.1 (draft) |
| Story source | `tests/exploratory/stories/contact-form.md` (status Draft) |
| Environment | local: UI http://localhost:4200, API http://localhost:8091 |
| Run | 2026-10-12; ledger started 17:45; browser 17:46:04 to 17:52:50 |
| Budget | 51 of 60 actions; 7 of 20 minutes; stopped: 80 percent of the action budget reached at A-48, the rest was cleanup |
| Inputs | story; context file; knowledge: e2e-flows.md, decisions.md (empty), rules.md, pages/account.md, pages/login.md; OpenAPI Toolshop API 5.0.0 (http://localhost:8091/docs); previous review: `v0.2/qa-review.md`; earlier reports: v0.2, v0.1 |
| Status | **DRAFT. Not signed off** |

## 1. Summary
> `v0.2/qa-review.md` holds the same answers, decisions and notes as v0.1: nothing new came in after v0.2, so no expectation changed. The five answers (Q-01, Q-04, Q-05, Q-07, Q-08) stay rules and the seven QA decisions are carried. This run covered what v0.2 did not reach: spaces only, a second Send, Send with an invalid email, the logged-in customer, Account > Messages and one more language (Spanish). Everything else is carried from v0.2 or v0.1 with its version. New: F-01, F-04, F-05, F-16, Q-15, S-21. Changed: AC 5, AC 11 and AC 12 are explored again; S-15 is split.

Look at these first:

- Two quick clicks on Send store two messages. Send stays enabled for the whole wait (F-01, F-02, S-19, T-05, Q-15).
- Spaces count as content in the form but not in the API: 60 spaces in Message are posted and refused with raw server text; a first name of spaces is stored (F-04, F-05, Q-12, S-17).
- Nine questions from v0.1 and v0.2 are still unanswered and fourteen scenarios have no QA decision; S-08 has had its proof since v0.2 (section 4, `qa-review.md`).

| | |
|---|---|
| Acceptance criteria | 6 met · 6 partly · 0 not met · 0 not explored |
| Findings | 6 defects · 3 risks · 6 gaps · 1 observation |
| Open questions | 10 open · 5 answered |
| Scenarios | 13 automate now · 7 clarify first · 0 keep exploratory · 1 not worth automating |
| Locators | 17 stable · 1 at risk · 2 blocked · 0 not verified |
| Your input | `qa-review.md`: 10 answers, 14 decisions; S-08 has a decision you may want to change |

## 2. Acceptance criteria
| AC | Criterion | Result | Observed | Tag | Scenarios | Evidence |
|---|---|---|---|---|---|---|
| 1 | Navigation, heading, title | met | Title has the app suffix, accepted by Q-01 | Observed | S-01, S-02, S-18 | E-01, E-02 |
| 2 | Fields, labels, Send, `*` on required fields | partly | Only the Message label has `*`; three fields have it in the placeholder, Subject in its first option | Observed | S-03, S-04 | E-02 |
| 3 | Subject starts at "Select a subject", six subjects | partly | The first option reads "Select a subject *" | Observed | S-05 | E-02 |
| 4 | Required messages, nothing sent | met | carried from v0.2 | Observed | S-06 | v0.2/E-03, v0.2/E-13 |
| 5 | Invalid email | met | Send clicked with "not-an-email": message shown, no request | Observed | S-07 | E-03 |
| 6 | Under 50 characters refused, exactly 50 accepted | met | carried from v0.2 | Observed | S-08 | v0.2/E-09, v0.2/E-11, v0.2/E-13, v0.2/E-14 |
| 7 | Attachment type | met | carried from v0.2 | Observed | S-11 | v0.2/E-15, v0.2/E-16 |
| 8 | Attachment size and hint | met | Hint seen again; the 31-byte txt refusal is carried from v0.2 | Observed | S-12 | E-02, v0.2/E-17 |
| 9 | Errors clear when corrected | partly | Field messages clear (carried from v0.2); the alert after a refused send does not (F-06) | Observed | S-09 | v0.2/E-04 to v0.2/E-11, E-05 |
| 10 | Successful send and confirmation | partly | Sent and confirmed; no busy state (F-02); two clicks send twice (F-01) | Observed | S-13, S-19 | E-05, E-08, v0.2/E-19 |
| 11 | Logged-in customer | partly | Only Subject, Message and Attachment remain and the send works; the name and email fields show briefly first (F-07) | Observed | S-14, S-15, S-21 | E-07, E-08 |
| 12 | Language | partly | Spanish: all listed texts and the five required messages translated. Other Spanish messages and five languages not reached; German issues carried (F-15) | Observed | S-16 | E-10, v0.1/E-19, v0.1/E-21 |

The story does not say: how required fields are marked when a label has no `*` (Q-02, Q-13); whether spaces count as content (Q-12); what a second Send must do (Q-15); which attachment error wins (Q-06); how the name and email fields behave for a customer (Q-09); what Account > Messages shows (Q-10); which languages count (Q-11); how long a send may take (Q-14); maximum lengths of name and email (not explored, no question yet).

## 3. Findings
| ID | Where | Finding | Type | Severity | AC | Tag | Evidence | Status |
|---|---|---|---|---|---|---|---|---|
| F-01 | Contact > Send button | A second click 48 ms after the first is accepted: two `POST /messages`, both 200, two messages stored. The script clicks faster than a person; Send was enabled at both clicks | defect | high | 10 | Observed | E-05 | new (was a risk in v0.2) |
| F-02 | Contact > Send button | No busy state: enabled and without `aria-busy` 49 and 75 ms after the click, while the answers took 4123 and 12252 ms. Required by the answer to Q-08 | defect | medium | 10 | Observed | E-05, E-08 | carried from v0.2, seen again |
| F-03 | Contact > Message field, Send button | 251 characters count as valid, are posted, and the server text "The message field must not be greater than 250 characters." is shown in an alert at the bottom of the form. Defect by the answer to Q-04 | defect | medium | - | Observed | v0.2/E-18 | carried from v0.2 |
| F-04 | Contact > Message field, Send button | 60 spaces count as valid, are posted, and the server answers 422 after 10928 ms; its text "The message field is required." is shown in an alert with no role and no test id, not under the field. Form and API disagree; the rule is Q-12 | defect | medium | - | Observed | E-04 | new |
| F-05 | Contact > First name field | A first name of three spaces counts as valid and is stored untrimmed (name `"    Tester-20261012-1744"`) | gap | medium | - | Observed | E-05 | new |
| F-06 | Contact > alert after a refused send | The alert stays visible after the field is corrected, until the next send answers | defect | low | 9 | Observed | E-05, v0.2/E-19 | carried from v0.2, seen again |
| F-07 | Contact > First name, Last name, Email address, as a customer | Opening Contact from the main menu shows the three fields, empty and editable, and they are gone at the 403 ms sample. v0.1 reported "some seconds" on a page load, which was not timed in this run | risk | low | 11 | Observed | E-07, v0.1/E-16 | carried from v0.1, re-measured |
| F-08 | Account > Messages | Subject shows the stored value "payments", not "Payments"; Date shows 16:51:05 while the browser clock read 17:51:30 (Europe/London) | defect | low | - | Observed | E-09 | carried from v0.1, seen again |
| F-09 | Contact > Message field | Its message changes only when the field loses focus; a test must leave the field before it asserts. Allowed by Q-05 | observation | low | - | Observed | v0.2/E-08, v0.2/E-10, v0.2/E-11 | carried from v0.2 |
| F-10 | Every page as a visitor; Sign out | `GET /users/me` answers 401 on each visitor load and `GET /users/refresh` 500 at sign-out, with console errors. A test that fails on console errors fails here | risk | low | - | Observed | E-11, E-12 | carried from v0.2, seen again |
| F-11 | API `POST /messages` | The API document has one optional `name`, a free-text `subject`, and no minimum length for `message`; the story has two required names, six subjects and 50 characters | gap | low | - | Assumed (OpenAPI document) | - | carried from v0.2 |
| F-12 | Contact > Attachment field | A non-empty file of the wrong type shows "File should be empty." instead of the type error | gap | low | - | Observed | v0.1/E-06, v0.1/E-08 | carried from v0.1 |
| F-13 | Contact > confirmation | After the confirmation the page offers no way to write another message | gap | low | - | Observed | v0.1/E-18 | carried from v0.1 |
| F-14 | Contact > all fields | Messages are not tied to their fields, focus stays on Send after a refused send, and no field has a required attribute | gap | medium | - | Observed | E-02, E-03 | carried from v0.1, seen again |
| F-15 | Contact page in another language | The page title stays "Contact Us - ..." in Spanish. In German the hint loses the 0 KB rule and "Return" reads "Zurück" | gap | low | 12 | Observed | E-10, v0.1/E-19, v0.1/E-21 | Spanish new; German carried from v0.1 |
| F-16 | Account > Messages of the shared customer | Messages cannot be deleted, so the list grows with every run: it held this run's message and the one of 2026-10-10. A test must find its row by its own text, never by position or count | risk | low | - | Observed | E-09 | new |

Not explored: Spanish messages other than the required ones and the five other languages; a customer's send with an attachment; a page load of `/contact` as a customer; maximum lengths of name and email; `.TXT` and files without extension; keyboard-only use. Reason: four actions were lost to tool errors (A-17, A-23 to A-25) and the 80 percent limit was reached at A-48.

## 4. Open questions
| ID | Question | For | Agent's assumption | Blocks |
|---|---|---|---|---|
| Q-02 | Must every required field carry `*` in its label? | product owner | Yes, as AC 2 reads | S-04 |
| Q-03 | Is "Select a subject *" the intended starting text? | product owner | Yes, once Q-02 is settled | S-05 (text only) |
| Q-06 | Are "File should have a txt extension." and "File should be empty." the intended texts, and which one wins for a non-empty wrong file? | product owner | Texts accepted; type error should win | S-11, S-12 (texts only) |
| Q-09 | For a logged-in customer, must the name and email fields be absent from the start? | product owner | Yes | S-14 (not blocking: the end state is the same) |
| Q-10 | In Account > Messages, should the subject show its label and the time be local? | product owner | Yes to both | S-21 |
| Q-11 | Which languages count for AC 12, and must the hint keep the 0 KB rule and the title be translated? | product owner | All seven; hint must match; title not required | S-16 |
| Q-12 | Do spaces count toward the 50 characters and the required names? | domain | No; input is trimmed. Observed: the form counts them, the API refuses a message of spaces and stores a name of spaces (F-04, F-05) | S-17 |
| Q-13 | Is a `*` in the placeholder (First name, Last name, Email address) or in the first option ("Select a subject *") enough to mark a required field, or must every label carry it as the Message label does? Is "Select a subject *" accepted for AC 3? Repeats Q-02 and Q-03: one answer covers all three | product owner | Every required label carries `*`; the first option reads "Select a subject" | S-04, AC 2, AC 3 |
| Q-14 | Which timeout should an automated send use on local? Answers took 3757 to 12703 ms in v0.2 and 4123 to 12252 ms in this run | environment | 20 s | S-13, S-14 (not blocking) |
| Q-15 | Is disabling Send while a message is being sent (T-05) enough, or must the API also refuse an identical message posted twice? | product owner | Disabling Send is enough for this story | S-19 |

## 5. Test scenarios
| ID | Scenario | Type | Level | Decision | Reason | Depends on |
|---|---|---|---|---|---|---|
| S-01 | Contact page opens from the main menu | functional | UI | Automate now | carried (QA) | - |
| S-02 | Contact page title | functional | UI | Automate now | carried | - |
| S-03 | Contact form shows its fields and the Send button | functional | UI | Automate now | carried (QA); no hint step | T-01 for the hint |
| S-04 | Required fields are marked | functional | UI | Clarify first | carried | Q-02, Q-13 |
| S-05 | Subject offers the six subjects | functional | UI | Automate now | carried | Q-03 for the first option |
| S-06 | Empty required fields show their messages | functional | UI | Automate now | carried (QA) | - |
| S-07 | An invalid email address is rejected | functional | UI | Automate now | carried (QA). The Send click is now observed, so the steps cover all of AC 5 | - |
| S-08 | The message needs at least 50 characters | functional | UI | Clarify first | carried (QA). v0.2 gave the proof the note asks for; the agent suggests Automate now | - |
| S-09 | An error disappears when its field is corrected | functional | UI | Automate now | carried | - |
| S-10 | A message above the maximum length is refused clearly | functional | UI | Clarify first | carried: automate after F-03 is fixed | F-03, T-06 |
| S-11 | An attachment that is not a txt file is refused | functional | UI | Automate now | carried (QA) | - |
| S-12 | A txt attachment larger than 0 KB is refused | functional | UI | Automate now | carried | - |
| S-13 | A valid message is sent and confirmed | functional | UI | Automate now | carried; leaves a message that only a reset removes | Q-14, not blocking |
| S-14 | A logged-in customer only chooses a subject and writes a message | functional | UI | Automate now | Observed in this run and in v0.1; locators stable; leaves a message on the shared account (F-16) | Q-09, Q-14, not blocking |
| S-15 | A customer's message appears under Account > Messages | regression | UI, API `GET /messages` | Automate now | Observed; row found by the message's own text, which must be unique in its first 50 characters | F-16 |
| S-16 | The Contact form is translated | functional | UI | Clarify first | Spanish and German observed in part; tests run in English only | Q-11 |
| S-17 | Input made of spaces only is not accepted | functional | UI | Clarify first | Was Keep exploratory. Now observed, and form and API differ (F-04, F-05) | Q-12 |
| S-18 | The Contact page opens from a direct link | functional | UI | Not worth automating | carried (QA) | - |
| S-19 | Sending stays safe while the server is slow | functional | UI | Clarify first | Was Keep exploratory. Expected by Q-08 and observed differ (F-01, F-02); automate after the fix | T-05, Q-15 |
| S-20 | The API refuses a message above 250 characters | functional | API `POST /messages` | Automate now | carried; the project has no API tests yet | - |
| S-21 | Account > Messages shows the subject and time as the customer knows them | regression | UI | Clarify first | New, split from S-15. Observed differs from the assumption (F-08) | Q-10 |

Click a scenario for its steps. Your decision goes in `qa-review.md`.

## 6. Locators and testability
| Element | Status | Best locator found | Why it is at risk |
|---|---|---|---|
| Contact > Attachment hint | at risk (C) | `getByText('Only files with the txt extension are allowed, and files must be 0kb.')`, matches 1 | Translated text; no test id; the file control does not reference it |
| Contact > alert after a refused send | blocked (D) | `locator('.alert.alert-danger')`, proposed, not verified | No role, no test id, not under the field it is about |
| Contact > Send busy state | blocked (D) | none | No busy state exists (F-02) |

| ID | Element | Request | Benefit |
|---|---|---|---|
| T-01 | Contact > Attachment hint | Reference `attachmentHelp` from the file control with `aria-describedby`; add test id "attachment-hint" | The hint is read with the field; a check that does not depend on the language |
| T-02 | Contact > alert after a refused send | Give it `role="alert"` and test id "contact-error" | Screen readers hear it; a stable locator |
| T-03 | Contact > field messages | Link each message to its field (`aria-describedby`, `aria-invalid`) and move focus to the first invalid field | Messages are read with their field; a test finds a field's message through the field |
| T-04 | Contact > required fields | Add `required` or `aria-required` and put `*` in the label | The required state is exposed; a test asserts it without reading placeholders |
| T-05 | Contact > Send button | Disable Send and set `aria-busy` while a send is pending | No second message (F-01); a defined state to wait for; users see the click was taken |
| T-06 | Contact > Message field | Show the maximum-length and spaces-only refusals under the Message field with test id "message-error" and role alert | One stable locator for every Message rule; the error is announced |

Accessibility observations (not an audit; full list in `technical.md`):

- Three required marks sit in placeholders and vanish on typing, and no field has `aria-required` (T-04, Q-13). Field messages have role alert but are not tied to their fields; focus stays on Send (T-03).
- The alert after a refused send has no role, so it is not announced (T-02, T-06).
- Nothing tells the customer that a message is being sent (T-05). The attachment hint is not referenced by the file control (T-01).

## 7. Test data and cleanup
| Data created | Cleaned up |
|---|---|
| Two visitor messages (ids `01m4rg84cc1tfys9aqy2z7qwzc`, `01m4rg84ccpcz48jjcr3106neh`), last name "Tester-20261012-1744", subject Webmaster | No. Messages cannot be deleted in the UI or the API; `npm run aut:reset` removes them |
| One message of the demo customer (id `01m4rgcsqaxp3zc762sr5mtjvt`), subject Payments, text starts `ETA-20261012-1744` | No. It stays under the shared customer's Account > Messages until a reset |
| Language Spanish; customer session; two temporary login script files in `test-output/` | Yes: English restored (E-13), signed out, browser closed; files deleted |

No upload file was created. The folder was searched for the credential values: no match. The messages of the v0.1 and v0.2 runs are also still in the system.

## 8. Next step
Fill in `qa-review.md`: the ten open questions (one answer covers Q-02, Q-03 and Q-13) and the 14 open decisions; S-08 if the v0.2 proof changes your decision. Sign-off needs a QA decision on every scenario. F-01 to F-04 are worth raising with the developers now. Consider `npm run aut:reset`.

Knowledge to add at sign-off:

- New page file `pages/contact.md`: fields, test ids, messages, confirmation text, stable locators (O-02 to O-05, O-15, O-16; v0.2 locators).
- `rules.md`: Message 50 to 250 characters, the form checks only 50 (F-03); spaces pass the form (F-04, F-05); a logged-in customer's name comes from the account and no email is posted (O-16). `pages/contact.md` quirks: Message validates on blur (F-09); a send takes 4 to 13 s on local (Q-14); Send has no busy state and two clicks send twice (F-01, F-02); visitor pages log 401 console errors (F-10).
- `pages/account.md`: Messages lists Subject, Message (first 50 characters), Status, Date in UTC; rows are never removed (O-17, F-08, F-16); row locator (O-19). `e2e-flows.md` impact map: a row for Contact with Account > Messages and the language files.
