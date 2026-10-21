# Technical notes: TS-3 v0.3

Observations from this run, plus carried rows marked with their version. They are not an audit.

## Console

Source: the tool's console log for the whole session, saved as E-11 (warning level and above).

| After action | Level | Message | Affects a decision |
|---|---|---|---|
| A-01 to A-03 (visitor loads) | error | `GET http://localhost:8091/users/me` 401 Unauthorized, three times, plus one Angular "ERROR {message: Unauthorized}" | Yes, F-10 |
| A-15 | error | `POST http://localhost:8091/messages` 422 Unprocessable Content | Yes, F-04 |
| A-41 (sign-out) | error | `GET http://localhost:8091/users/refresh` 500 Internal Server Error, then 401 on `GET /users/me` and the Angular error | Yes, F-10 |
| several loads | warning | Preloaded image `barn-2400x1600.avif` not used within a few seconds | No |
| A-31 to A-39 (logged in) | - | No errors while logged in (the tool reported 0 errors on `/contact` and `/account/messages`) | - |

## Network

| Action | Request | Status | Time from the click | Note | Evidence |
|---|---|---|---|---|---|
| A-10 | none after Send with "not-an-email" | - | - | Client-side refusal | E-03 |
| A-15 | `POST /messages`, message of 60 spaces | 422 | 10928 ms | Body `{"message":["The message field is required."]}`. The UI shows this text unchanged (F-04) | E-04 |
| A-20 | `POST /messages`, first click | 200 | 4123 ms | Sent 43 ms after the script started the click; id `01m4rg84cc1tfys9aqy2z7qwzc` | E-05 |
| A-21 | `POST /messages`, second click | 200 | 4123 ms | Sent at 92 ms with the same body; id `01m4rg84ccpcz48jjcr3106neh` (F-01) | E-05 |
| A-35 | `POST /messages` as the customer | 200 | 12252 ms | Body has `name` "Jane Doe" (the seeded demo customer), `subject`, `message`; no `email`; Authorization header present. The answer carries a `user_id` | E-08 |
| A-38 | `GET /messages?page=1` | 200 | - | Fills Account > Messages | E-12 |
| A-41 | `GET /users/refresh` | 500 | - | At sign-out | E-12 |
| A-45 | none after Send on the empty Spanish form | - | - | Client-side refusal | E-10 |

Carried from v0.2: `POST /messages` with 251 characters answers 422 after 6617 ms (v0.2/E-18); a
send with an attachment posts `POST /messages/{id}/attach-file` after the message is stored
(v0.2/E-19).

Response times are an environment matter on local (QA answer to Q-08). They matter here only for
the timeout of a test (Q-14) and for how long Send stays clickable (F-01).

## API notes (OpenAPI Toolshop API 5.0.0 at `http://localhost:8091/docs`, read outside the browser)

- The context file names `http://localhost:8091/api/documentation`. That URL is the HTML viewer;
  the JSON document is at `/docs`.
- `POST /messages`: no authentication required. `ContactRequest`: `name` (max 120), `email`
  (max 256, "required when not authenticated"), `subject` (max 120), `message` (max 250).
  Required: `subject`, `message`. No minimum length for `message` (F-11).
- Observed against it: a message of spaces is refused as missing (E-04), so the API trims or
  treats spaces as empty for `message`; a name starting with four spaces is stored as sent (E-05),
  so `name` is not trimmed and not required.
- The UI joins first and last name with a space into `name` and posts the subject as a slug
  (`webmaster`, `payments`). Account > Messages shows that slug (F-08).
- `GET /messages` and `GET /messages/{messageId}` need authentication. `GET /messages?page=1`
  is what Account > Messages calls. No delete operation exists for messages.
- Checks that can move to API level: maximum 250 (S-20); a message of spaces refused; the rule
  for a name of spaces once Q-12 is answered; whether an identical second post is refused once
  Q-15 is answered; the read-back of a customer's message through `GET /messages` (S-15).

## Accessibility observations (from the snapshots and DOM reads already taken)

| Where | Observation | Evidence | Resolved by |
|---|---|---|---|
| Contact > heading | "Contact" is a level 3 heading and the only heading on the page | E-02 | Outside this story (QA answer to Q-01) |
| Contact > First name, Last name, Email address, Subject | Required is shown only by `*` in the placeholder or the first option; no `required` or `aria-required` on any field | E-02 | T-04, Q-13 |
| Contact > field messages | Role alert, but no field has `aria-describedby`; after a refused Send focus stays on the Send button | E-02, E-03 | T-03 |
| Contact > alert after a refused send | No role, so it is not announced; not tied to the Message field | E-04 | T-02, T-06 |
| Contact > Send button | No busy state while sending | E-05, E-08 | T-05 |
| Contact > Attachment hint | Not referenced by the file control | E-02 | T-01 |
| Contact > confirmation | Has role alert | E-05, E-08 | - |
| Contact page in Spanish | `html lang` changes to "es"; the page title stays English | E-10 | Q-11 |
| Account > Messages | The page has a level 1 heading "Messages"; the Details link of each row has the same name "Details" | E-09 | Not requested; a row scope makes it unique |

Carried from v0.2: the Message field's message changes only when the field loses focus
(v0.2/E-08, v0.2/E-10, v0.2/E-11), accepted by the QA answer to Q-05.

Not checked: keyboard-only use of the form, focus after the confirmation.

## Tool observations

- `getByTestId` uses `data-testid` in the MCP session, not the project's `data-test` (carried from v0.2/E-16).
- Code-run cannot import modules, and a script given through `filename` failed with
  `SyntaxError: Unexpected token 'const'` (A-23 to A-25). The login therefore ran from a script in
  the call itself; the tool echoes that script to the conversation, not to this folder.
- `fill` sets a value without key presses. The form still validated the values (classes in E-03,
  E-04), so the spaces findings do not depend on typing.
- The script's two Send clicks were 48 ms apart, faster than a person (E-05). Send was enabled
  for the whole 4123 ms, so a slower double click would meet the same state (Inferred, ledger O-11).
- E-04: the DOM read is 31 s after the click because a second wait in the script ran to its
  timeout. The page had its outcome at 10927 ms.
- The title read right after a navigation can still be the application default
  ("Practice Software Testing - Toolshop - v5.0" on `/account` and `/account/messages`, E-06, A-38);
  a moment later it is the page's own title. A title assertion should wait.
