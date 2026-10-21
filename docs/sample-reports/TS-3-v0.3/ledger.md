# Ledger: TS-3 v0.3

| | |
|---|---|
| Story | TS-3 Customer sends a message to Toolshop through the Contact form (`tests/exploratory/stories/contact-form.md`, status Draft) |
| Version | v0.3, draft, reduced run. Previous: v0.2 (draft), v0.1 (draft) |
| Environment | local: UI `http://localhost:4200`, API `http://localhost:8091` |
| Mode | Unattended (argument "run unattended") |
| Budget | 20 minutes of browser work, 60 browser actions |
| Test data prefix | `ETA-20261012-1744` |
| Step 1 written | 2026-10-12 17:45, before the first browser action (A-01 at 17:46:04) |

## Step 0. Previous version

Latest folder: `v0.2` (draft, sign-off box empty). Read: `v0.2/qa-review.md`, `v0.2/report.md`,
`v0.1/report.md`, and for wording and evidence IDs `v0.2/scenarios.feature`, `v0.2/locators.md`,
`v0.2/technical.md`, `v0.1/locators.md`, `v0.1/qa-review.md`. `.local/` was not read.

`v0.2/qa-review.md` holds the same answers, decisions and notes as `v0.1/qa-review.md`. The QA
engineer added nothing after v0.2: Q-13, Q-14 and S-20 are empty. So no expectation changed since
v0.2, and the notes on S-08, S-11 and S-13 were already acted on in v0.2.

### Answers that are rules (verbatim, unchanged)

| ID | QA answer | Effect |
|---|---|---|
| Q-01 | The title with the app suffix is accepted. The heading level is outside this story; keep it as an accessibility observation only. | Title with a suffix passes AC 1 |
| Q-04 | Yes, 250 is the maximum. The form must show a message under the Message field before sending; showing the raw server text is a defect. | S-10 expectation |
| Q-05 | An error must refresh at the latest when the field loses focus. Re-check AC 9 by typing key by key and leaving the field. | S-09 expectation; done in v0.2 |
| Q-07 | Yes, that is the intended confirmation text. | "Thanks for your message! We will contact you shortly." is expected |
| Q-08 | Slow answers on local are an environment matter, not a defect. A busy state while sending is required (T-05). | Busy state expected between the click and the answer |

Unanswered: Q-02, Q-03, Q-06, Q-09, Q-10, Q-11, Q-12, Q-13, Q-14.

### QA decisions (fixed)

| ID | QA decision | Note (verbatim) | Status of the note |
|---|---|---|---|
| S-01 | Automate now | Agree. | - |
| S-03 | Automate now | Without the attachment hint step; the hint waits for T-01. | applied in v0.2 |
| S-06 | Automate now | Agree. | - |
| S-07 | Automate now | Agree. | - |
| S-08 | Clarify first | Do not stop the send with an invalid attachment. Show how 50 characters is proven accepted without relying on another rule. | acted on in v0.2 (v0.2/E-09, E-11, E-13, E-14); decision stays with the QA engineer |
| S-11 | Automate now | Re-check first: the Send with the empty PDF was never done in v0.1. | done in v0.2 (v0.2/E-15, E-16) |
| S-13 | (empty) | Re-measure the visitor send with an attachment: time from the Send click to the confirmation, with timestamps. | done in v0.2 (v0.2/E-19: 4212 ms) |
| S-18 | Not worth automating | Agree. | - |

### Carried state (latest result per item)

| Item | Latest result | Last observed |
|---|---|---|
| AC 1 | met (title accepted by Q-01) | v0.2/E-01, E-02 |
| AC 2 | partly: only the Message label has `*` | v0.2/E-02 |
| AC 3 | partly: first option "Select a subject *" | v0.2/E-02 |
| AC 4 | met | v0.2/E-03, E-13 |
| AC 5 | v0.2 partly (Send not clicked with the invalid address); v0.1 met | v0.2/E-06; v0.1/E-04, E-05 |
| AC 6 | met | v0.2/E-09, E-11, E-13, E-14 |
| AC 7 | met | v0.2/E-15, E-16 |
| AC 8 | met | v0.2/E-02, E-17 |
| AC 9 | partly (alert of v0.2 F-02 does not clear) | v0.2/E-04 to E-11, E-19 |
| AC 10 | partly (no busy state) | v0.2/E-14, E-19 |
| AC 11 | not explored in v0.2; v0.1: works, but name and email fields show for some seconds first (v0.1 F-17) | v0.1/E-16, E-17, E-18 |
| AC 12 | not explored in v0.2; v0.1 partly: German only, hint loses the 0 KB rule, "Return" is "Zurück", title stays English | v0.1/E-19, E-21 |
| v0.2 F-01 to F-07 | as in the v0.2 report | v0.2/E-18, E-19, E-20, E-21, E-08, E-10, E-11 |
| v0.1 F-10 (non-empty wrong file shows the size error) | gap, not re-checked in v0.2 | v0.1/E-06, E-08 |
| v0.1 F-17 (fields flash for a customer) | defect, not re-checked in v0.2 | v0.1/E-16, E-17 |
| v0.1 F-19 (no way to write another message after the confirmation) | gap | v0.1/E-18 |
| v0.1 F-21 (Messages shows "warranty" and time one hour behind) | defect | v0.1/E-20 |
| v0.1 F-23 (errors not tied to fields, focus stays on Send, no required attribute) | gap | v0.1/E-02, E-21 |
| v0.1 F-25 (story and API disagree: one `name`, free-text `subject`) | gap | Assumed (OpenAPI) |
| Locators | 15 stable in v0.2; hint C in v0.1; Messages row not verified | v0.2/E-03, E-16, E-17, E-19; v0.1/E-17, E-20 |
| T-01 to T-06 | open | v0.1 and v0.2 reports |

### Reduced run plan

Nothing has a new QA note or a changed expectation. So this run covers what v0.2 did not reach,
never-explored items first:

1. Never explored in any version: spaces only (S-17), a second Send during the wait (S-19, v0.2 F-04).
2. Not reached in v0.2: Send with an invalid email still in the field (AC 5), the Contact link
   counted on the home page, the Attachment hint locator.
3. Not reached in v0.2, observed only in v0.1: language (AC 12, S-16; a second language, since v0.1
   did German), the logged-in customer (AC 11, S-14, v0.1 F-17 timed), Account > Messages (S-15).

Not planned (carried): everything v0.2 observed (AC 1 to 4, 6 to 10, S-01 to S-13, S-20).

## Step 1. Read and restate

Documents read (not browser actions): the story, `context.md`, `knowledge/e2e-flows.md`,
`knowledge/decisions.md` (no lines), `knowledge/rules.md`, `knowledge/pages/account.md`,
`knowledge/pages/login.md`, the OpenAPI document (Toolshop API 5.0.0, `http://localhost:8091/docs`;
the context file's URL `/api/documentation` is the HTML viewer), the skill reference files. There
is no `knowledge/pages/contact.md`. The story file is unchanged in its criteria since v0.2 as far
as the v0.2 report's criteria rows show.

### Expected workflow

1. Contact in the main menu opens `/contact`, heading "Contact", title starting "Contact Us" (AC 1, Q-01).
2. The form shows six labelled fields, `*` on required ones, and Send (AC 2).
3. Subject starts at "Select a subject" and offers six subjects (AC 3).
4. Send on the empty form shows five required messages and sends nothing (AC 4).
5. An invalid email shows "Email format is invalid" and nothing is sent (AC 5).
6. Under 50 characters is refused, exactly 50 accepted (AC 6); over 250 gets a field message before sending (Q-04).
7. A non-txt attachment or a txt above 0 KB shows an error; nothing is sent (AC 7, 8).
8. A corrected field loses its error at the latest on blur (AC 9, Q-05).
9. Valid input: Send shows a busy state (Q-08), one message is stored, the form is replaced by "Thanks for your message! We will contact you shortly." on the same page (AC 10, Q-07).
10. A logged-in customer sees no name and email fields and only chooses a subject and writes a message (AC 11); the message is listed under Account > Messages (e2e-flows F6, Assumed).
11. Changing the language translates labels, placeholders, options, hints and errors (AC 12).

AC to steps: AC 1: 1. AC 2: 2. AC 3: 3. AC 4: 4. AC 5: 5. AC 6: 6. AC 7, 8: 7. AC 9: 8. AC 10: 9. AC 11: 10. AC 12: 11.

### What the story does not say (Assumed unless a question covers it)

| Gap | Assumption | Question |
|---|---|---|
| Whether spaces count as content | No; input is trimmed | Q-12 |
| What a second Send during the wait does | One message is stored | Q-08 answered: busy state required |
| How a customer's name and email are shown | Fields absent from the start | Q-09 |
| What Account > Messages shows | Subject label and local time | Q-10 |
| Which languages count | All in the header selector | Q-11 |
| Maximum length of name and email | 120 and 256 (OpenAPI `ContactRequest`) | none yet; not planned in this run |
| Which attachment error wins | Type error | Q-06 |
| How long a send may take | Timeout 20 s on local | Q-14 |

Story against knowledge and OpenAPI: no new contradiction. Carried: the API has one optional
`name`, a free-text `subject`, `message` max 250 and no minimum (v0.1 F-25, v0.2 F-07).

### Regression scope (impact map)

No row for Contact. Applying rows: "Language files" (menu entries and validation messages on
every page) and "Login or register" (account pages). Regression scenarios: S-15 Account > Messages,
S-18 direct link. Share of the budget: about 5 actions (Messages list).

### Charter

Mission: observe what no earlier version observed (spaces only, a second Send) and re-observe what
v0.2 did not reach (invalid email with Send, a second language, the logged-in customer, Account >
Messages), so every row of the v0.3 table rests on evidence with a version.

| Priority | Area | Actions |
|---|---|---|
| 1 | Home page: Contact link count; Contact page: hint locator, DOM read | 4 |
| 2 | Spaces only (S-17), heuristic: Boundaries, text of only spaces | 5 |
| 3 | Second Send during the wait (S-19), heuristic: Interruptions, submit twice | 6 |
| 4 | Send with an invalid email in the field (AC 5) | 3 |
| 5 | Language: a second language, labels, options, hint, errors (AC 12) | 7 |
| 6 | Logged-in customer: login, timed look at the name fields, send (AC 11); Account > Messages (S-15) | 15 |
| 7 | Locator counts in the customer state and on Messages (about 20 percent with the counts above) | 4 |
| 8 | Console and network reads; sign out, language back to English (cleanup, 10 percent) | 6 |
| | Total planned | 50 of 60 |

Counting rule used: one action per browser tool call; a `fill_form` call is one call and is
counted as one action per field it fills; a scripted call counts one per page interaction in it.

## Action log

Time box started with A-01. Times are local, from the machine clock when the row was written.

| # | Time | Action | Result | Evidence |
|---|---|---|---|---|
| A-01 | 17:46:04 | Navigate to `http://localhost:4200/` (visitor) | Home page, title "Practice Software Testing - Toolshop - v5.0" | - |
| A-02 | 17:46:11 | Read-only code-run: count the Contact link locators on the home page | role and name 1, `[data-test="nav-contact"]` 1, visible. Console: 3 errors after the load | E-01 |
| A-03 | 17:46:18 | Click Contact in the main menu (`[data-test="nav-contact"]`) | `/contact`, title "Contact Us - Practice Software Testing - Toolshop - v5.0" | - |
| A-04 | 17:46:29 | Read-only code-run: DOM read of the form, hint locator counts | Fields, labels and options as in v0.2; hint is one element `#attachmentHelp`, not referenced by the file input; full-sentence `getByText` 1, `#attachmentHelp` 1; seven languages in the header | E-02 |
| A-05 to A-09 | 17:46:55 | `fill_form` (5 fields, 5 actions): First name "ETA", Last name "Tester-20261012-1744", Email address "not-an-email", Subject Webmaster, Message 66 characters starting `ETA-20261012-1744` | Filled. Tool note: `fill` sets the value without key presses | - |
| A-10 | 17:46:55 | Click Send with "not-an-email" in Email address, other fields valid | Still on `/contact`, form shown | E-03 |
| A-11 | 17:47:02 | Evaluate: DOM read after the Send | One alert, test id `email-error`, "Email format is invalid"; no request to `/messages`; focus on Send; Send enabled | E-03 |
| A-12 to A-14 | 17:47:20 | `fill_form` (3 fields, 3 actions): Email address "eta-20261012-1744@example.com", First name 3 spaces, Message 60 spaces | Filled. Last name stays "Tester-20261012-1744" so a stored message carries the prefix | - |
| A-15 | 17:47:22 | Scripted timed Send, step 1: click Send | `POST /messages` sent 39 ms after the click, name `"    Tester-20261012-1744"`, message 60 spaces | E-04 |
| A-16 | 17:47:33 | Step 2: wait for a visible alert | Alert at 10927 ms; answer 422 `{"message":["The message field is required."]}` at 10928 ms | E-04 |
| A-17 | 17:47:53 | Step 3: wait for a response (script error: the answer had already arrived, the wait ran to its 20 s timeout) | Nothing new. Tool-caused delay, counted | E-04 |
| A-18 | 17:47:53 | Step 4: wait 500 ms, then DOM read | Form still shown; First name (3 spaces) and Message (60 spaces) both `ng-valid`; one alert, no role, no test id, text "The message field is required." | E-04 |
| A-19 | 17:48:20 | Fill Message with 64 characters starting `ETA-20261012-1744`; First name stays 3 spaces | Filled | - |
| A-20 | 17:48:29 | Scripted timed action, step 1: click Send | `POST /messages` at 43 ms; Send still enabled, no `aria-busy`, the old alert "The message field is required." still shown (read at 49 ms) | E-05 |
| A-21 | 17:48:29 | Step 2: click Send again (93 ms) | Click accepted; a second `POST /messages` at 92 ms with the same body | E-05 |
| A-22 | 17:48:33 | Step 3: wait for both answers, then DOM read | Both 200 at 4123 ms, two ids (`01m4rg84cc1tfys9aqy2z7qwzc`, `01m4rg84ccpcz48jjcr3106neh`); stored name `"    Tester-20261012-1744"`; form replaced by the confirmation (role alert) | E-05 |
| A-23 | about 17:49:00 | Scripted login from a script file (`filename`) | Failed before touching the page: `SyntaxError: Unexpected token 'const'`. Counted | - |
| A-24 | about 17:49:15 | Same call again | Same error. Counted | - |
| A-25 | about 17:49:35 | Scripted login reading the environment file inside the call | Failed before touching the page: dynamic import is not available in the tool. Counted | - |
| A-26 | 17:49:53 | Scripted login, step 1: navigate to `/auth/login` | Login page | - |
| A-27 | 17:49:54 | Step 2: fill Email address from `AUT_CUSTOMER_EMAIL` | Filled | - |
| A-28 | 17:49:54 | Step 3: fill Password from `AUT_CUSTOMER_PASSWORD` (value not recorded) | Filled | - |
| A-29 | 17:49:55 | Step 4: click Login | - | - |
| A-30 | 17:49:58 | Step 5: wait for `/account`, then DOM read | Landed after 5275 ms in all; no password field on the page when read | E-06 |
| A-31 | 17:50:17 | Scripted timed action, step 1: click Contact in the main menu as the logged-in customer | `/contact`; First name, Last name, Email address shown, empty and editable at the first sample | E-07 |
| A-32 | 17:50:29 | Step 2: sample the form every 50 ms for 12 s, then count locators | The three fields are gone at the 403 ms sample. After 12 s: labels Subject, Message *, Attachment; Subject, Message, Attachment, Send and heading count 1; name and email locators 0 | E-07 |
| A-33, A-34 | 17:50:50 | `fill_form` (2 fields, 2 actions): Subject Payments, Message 66 characters starting `ETA-20261012-1744` | Filled | - |
| A-35 | 17:50:55 | Scripted timed Send as the customer, step 1: click Send | `POST /messages` at 72 ms with name "Jane Doe", subject `payments`, an Authorization header and no email; Send enabled, no `aria-busy` at 75 ms | E-08 |
| A-36 | 17:51:07 | Step 2: wait for the answer | 200 at 12252 ms, id `01m4rgcsqaxp3zc762sr5mtjvt`, status NEW | E-08 |
| A-37 | 17:51:07 | Step 3: wait for the confirmation, then DOM read | Confirmation visible at 12258 ms, role alert, locator count 1; form gone; still `/contact` | E-08 |
| A-38 | 17:51:21 | Navigate to `/account/messages` (still logged in) | Page opened; title at that moment "Practice Software Testing - Toolshop - v5.0" | - |
| A-39 | 17:51:30 | Read-only code-run: wait for the row text (11 ms), DOM read, locator counts | Two rows. This run's: Subject "payments", Message cut to 50 characters plus "...", Status NEW, Date "2026-10-12 16:51:05" while the browser clock read 17:51:30 (Europe/London). Row locator by message text counts 1. The v0.1 run's message is still listed | E-09 |
| A-40 | 17:51:43 | Click the user menu in the header | Menu open | - |
| A-41 | 17:51:45 | Click Sign out | Page reloaded, title back to the application default, 2 console errors; signed-out state is confirmed by the DOM read of A-46 (name fields present) | - |
| A-42 | 17:51:51 | Click Contact in the main menu (signed out) | `/contact`, title "Contact Us - ..." | - |
| A-43 | 17:51:54 | Click the language selector in the header | List open | - |
| A-44 | 17:51:57 | Click ES | Language switched; the tool still reports the title "Contact Us - Practice Software Testing - Toolshop - v5.0" | E-10 |
| A-45 | 17:52:04 | Click Send on the empty Spanish form | Form stays | E-10 |
| A-46 | 17:52:10 | Evaluate: DOM read of the Spanish form | Menu, heading, 6 labels, 3 placeholders, 7 options, hint, Send and the 5 required messages are in Spanish; `html lang="es"`; the page title stays "Contact Us - ..."; no request to `/messages`; name fields present, so the visitor state is confirmed | E-10 |
| A-47 | 17:52:15 | Read all console messages (warning and above) | 21 entries: 401 on `GET /users/me` on visitor loads, one 422 on `POST /messages`, one 500 on `GET /users/refresh` at sign-out, preload warnings | E-11 |
| A-48 | 17:52:16 | Read the network requests since the last page load | `GET /messages?page=1` 200; `GET /users/refresh` 500; `GET /users/me` 401 after sign-out; `es.json` loaded | E-12 |
| A-49 | 17:52:24 | Cleanup: click the language selector | List open | - |
| A-50 | 17:52:27 | Cleanup: click EN | English labels back; the form still shows the required messages, now in English | E-13 |
| A-51 | 17:52:50 | Close the browser page | Closed | - |

Totals: 51 actions (A-01 to A-51), browser work 17:46:04 to 17:52:50, 7 minutes. 80 percent of the
action budget (48) was reached at A-48; A-49 to A-51 are cleanup. No new path was opened after A-44.

Deviations from the charter: three actions were lost to failed login attempts (A-23 to A-25) and
one to a script error (A-17). The language check came last and was cut to one language and the
required messages. Not reached: the other Spanish messages (email format, message length,
attachment), the five other languages, a customer's send with an attachment, a full page load of
`/contact` as a customer, maximum lengths of name and email, keyboard-only use.

Heuristics behind the ideas: Boundaries, text of only spaces (A-12 to A-22); Interruptions, submit
twice quickly (A-20 to A-22); State and role changes, same action as each role (A-26 to A-39);
CRUD, a Create can be Read back (A-38, A-39); Platform, locale (A-43 to A-46).

## Observations

| ID | Observation | Tag | Evidence | Became |
|---|---|---|---|---|
| O-01 | Home page: the Contact link matches 1 by role and name and 1 by `[data-test="nav-contact"]` | Observed | E-01 | locators |
| O-02 | The menu link opens `/contact`; heading "Contact" (level 3); title "Contact Us - Practice Software Testing - Toolshop - v5.0" | Observed | E-02 | AC 1 |
| O-03 | Only the Message label has `*`; First name, Last name, Email address have it in the placeholder; the first Subject option reads "Select a subject *" and is hidden and disabled; no field has `required` or `aria-required` | Observed | E-02 | AC 2, AC 3, F-14 |
| O-04 | The hint is one element `#attachmentHelp` with the story's text; the file input does not reference it; full-sentence `getByText` matches 1 | Observed | E-02 | locators, T-01 |
| O-05 | Send with "not-an-email": one alert `email-error` "Email format is invalid"; no request; focus stays on Send | Observed | E-03 | AC 5, F-14 |
| O-06 | Message of 60 spaces and First name of 3 spaces are valid for the form; Send posts; the API answers 422 "The message field is required." after 10928 ms; the text is shown in an alert with no role and no test id | Observed | E-04 | F-04 |
| O-07 | The name is posted as `"    Tester-20261012-1744"`: the spaces are not trimmed | Observed | E-04, E-05 | F-05 |
| O-08 | After the message was corrected the alert of O-06 was still visible at the next Send click | Observed | E-05 | F-06 |
| O-09 | Send is enabled and has no `aria-busy` 49 ms after a click (visitor) and 75 ms after a click (customer) while the answers took 4123 and 12252 ms | Observed | E-05, E-08 | F-02 |
| O-10 | A second Send click 48 ms after the first is accepted: two `POST /messages`, two 200 answers, two ids | Observed | E-05 | F-01 |
| O-11 | A person's double click is slower than the script's 48 ms but far inside the 4123 ms wait, so it would also post twice | Inferred from O-09, O-10: Send stays enabled for the whole wait | - | F-01 |
| O-12 | Both stored messages have a first name of spaces only | Observed | E-05 | F-05 |
| O-13 | Login as the demo customer lands on `/account` | Observed | E-06 | - |
| O-14 | Customer opens Contact from the menu: First name, Last name, Email address are shown, empty and editable, at the first sample and are gone at the 403 ms sample | Observed | E-07 | F-07 |
| O-15 | Customer form after 12 s: labels Subject, Message *, Attachment; Subject, Message, Attachment, Send, heading locators match 1; name and email locators 0 | Observed | E-07 | AC 11, locators |
| O-16 | Customer send: body has name "Jane Doe", subject `payments`, no email, with an Authorization header; 200 after 12252 ms; confirmation at 12258 ms, locator count 1 | Observed | E-08 | AC 11, S-14 |
| O-17 | Account > Messages lists the message: Subject "payments", Message cut to 50 characters plus "...", Status NEW, Date "2026-10-12 16:51:05" while the browser clock read 17:51:30 Europe/London | Observed | E-09 | S-15, F-08 |
| O-18 | The list also holds the customer message of the v0.1 run (2026-10-10) | Observed | E-09 | F-16 |
| O-19 | `getByRole('row', { name: /ETA-20261012-1744/ })` matches 1 | Observed | E-09 | locators |
| O-20 | Spanish: menu, heading, labels, placeholders, options, hint, Send and the five required messages are translated; `html lang="es"`; the page title stays English | Observed | E-10 | AC 12, F-15 |
| O-21 | The Spanish hint says the files must be empty ("deben estar vacíos") where the English one says "0kb" | Observed | E-10 | AC 12 |
| O-22 | Console: 401 on `GET /users/me` on every visitor load, 500 on `GET /users/refresh` at sign-out | Observed | E-11, E-12 | F-10 |
| O-23 | English restored at the end; nobody signed in | Observed | E-13 | cleanup |
| O-24 | Tool: code-run cannot import modules and a script file given by `filename` failed with a syntax error, so the login script carried the demo values in the call itself. They are not in this folder | Observed | A-23 to A-25 | technical.md |

## Findings map

| Finding | Observations | Earlier ID |
|---|---|---|
| F-01 | O-10, O-11 | v0.2 F-04 (risk, Inferred), v0.1 F-14 |
| F-02 | O-09 | v0.2 F-03 |
| F-03 | carried | v0.2 F-01, v0.1 F-16 |
| F-04 | O-06 | new |
| F-05 | O-07, O-12 | new |
| F-06 | O-08 | v0.2 F-02 |
| F-07 | O-14 | v0.1 F-17 |
| F-08 | O-17 | v0.1 F-21 |
| F-09 | carried | v0.2 F-05 |
| F-10 | O-22 | v0.2 F-06, v0.1 F-24 |
| F-11 | carried | v0.2 F-07, v0.1 F-25 |
| F-12 | carried | v0.1 F-10 |
| F-13 | carried | v0.1 F-19 |
| F-14 | O-03, O-05 | v0.1 F-23 |
| F-15 | O-20 | v0.1 AC 12 row |
| F-16 | O-18 | new |

## Test data

| Created | Where | Cleaned up |
|---|---|---|
| Message id `01m4rg84cc1tfys9aqy2z7qwzc`, visitor, name `"    Tester-20261012-1744"`, subject webmaster, text starts `ETA-20261012-1744` (A-20) | API messages | No: no delete in the UI or the API. `npm run aut:reset` |
| Message id `01m4rg84ccpcz48jjcr3106neh`, same content, from the second click (A-21) | API messages | No. Same |
| Message id `01m4rgcsqaxp3zc762sr5mtjvt`, demo customer, subject payments, text starts `ETA-20261012-1744` (A-35) | Account > Messages of the shared customer | No. Same |
| Language ES (A-44) | browser session | Yes, EN restored (A-50, E-13) |
| Customer session (A-26 to A-30) | browser session | Yes, signed out (A-41) and browser closed (A-51) |
| Two temporary login script files in `test-output/` | disk | Yes, deleted before A-26 |

No upload file was created. Nothing in the shared customer's profile, password or address was touched.

## Handover checks

- Credential search: every `AUT_*_EMAIL` and `AUT_*_PASSWORD` value from the environment was searched in this folder with a fixed-string search: 0 matches. No redaction was needed.
- Evidence: E-01 to E-13 exist; every `E-nn` and `vX.Y/E-nn` cited in the report, locators and technical notes resolves to a file.
- Scenario IDs match between `report.md`, `scenarios.feature` and `qa-review.md` (S-01 to S-21); each Gherkin tag equals the Decision column.
- `report.md` has 149 lines. No step definitions, page objects or spec files were written.
