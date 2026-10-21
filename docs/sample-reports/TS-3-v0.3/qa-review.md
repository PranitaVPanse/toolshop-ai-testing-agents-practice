# QA review: TS-3 v0.3

Fill in the two tables. Leave a cell empty to keep the item pending. The next run reads this
file; nothing else in the report needs editing.

## Answers

| ID | Question | Answer |
|---|---|---|
| Q-01 | Is the title with the app suffix acceptable, and should "Contact" be the page's main heading? | The title with the app suffix is accepted. The heading level is outside this story; keep it as an accessibility observation only. |
| Q-02 | Must every required field carry `*` in its label? | |
| Q-03 | Is "Select a subject *" the intended starting text? | |
| Q-04 | Is 250 the intended maximum for the message, and what must the form show above it? | Yes, 250 is the maximum. The form must show a message under the Message field before sending; showing the raw server text is a defect. |
| Q-05 | When must an error refresh: while typing, on leaving the field, or on Send? | An error must refresh at the latest when the field loses focus. Re-check AC 9 by typing key by key and leaving the field. |
| Q-06 | Are "File should have a txt extension." and "File should be empty." the intended texts, and which one wins for a non-empty wrong file? | |
| Q-07 | Is "Thanks for your message! We will contact you shortly." the intended confirmation? | Yes, that is the intended confirmation text. |
| Q-08 | Are 7 to 45 second answers from `POST /messages` normal on local, and must the page show progress and block a second Send? | Slow answers on local are an environment matter, not a defect. A busy state while sending is required (T-05). |
| Q-09 | For a logged-in customer, must the name and email fields be absent from the start? | |
| Q-10 | In Account > Messages, should the subject show its label and the time be local? | |
| Q-11 | Which languages count for AC 12, and must the hint keep the 0 KB rule and the title be translated? | |
| Q-12 | Do spaces count toward the 50 characters and the required names? | |
| Q-13 | Is a `*` in the placeholder (First name, Last name, Email address) or in the first option ("Select a subject *") enough to mark a required field, or must every label carry it as the Message label does? Is "Select a subject *" accepted for AC 3? Repeats Q-02 and Q-03: one answer covers all three. | |
| Q-14 | Which timeout should an automated send use on local? Answers took 3757 to 12703 ms in v0.2 and 4123 to 12252 ms in v0.3. | |
| Q-15 | Is disabling Send while a message is being sent (T-05) enough, or must the API also refuse an identical message posted twice? | |

## Decisions

| ID | Scenario | Agent's decision | QA decision | Note |
|---|---|---|---|---|
| S-01 | Contact page opens from the main menu | Automate now | Automate now | Agree. |
| S-02 | Contact page title | Automate now | | |
| S-03 | Contact form shows its fields and the Send button | Automate now | Automate now | Without the attachment hint step; the hint waits for T-01. |
| S-04 | Required fields are marked | Clarify first | | |
| S-05 | Subject offers the six subjects | Automate now | | |
| S-06 | Empty required fields show their messages | Automate now | Automate now | Agree. |
| S-07 | An invalid email address is rejected | Automate now | Automate now | Agree. |
| S-08 | The message needs at least 50 characters | Automate now | Clarify first | Do not stop the send with an invalid attachment. Show how 50 characters is proven accepted without relying on another rule. |
| S-09 | An error disappears when its field is corrected | Automate now | | |
| S-10 | A message above the maximum length is refused clearly | Clarify first | | |
| S-11 | An attachment that is not a txt file is refused | Automate now | Automate now | Re-check first: the Send with the empty PDF was never done in v0.1. |
| S-12 | A txt attachment larger than 0 KB is refused | Automate now | | |
| S-13 | A valid message is sent and confirmed | Automate now |  | Re-measure the visitor send with an attachment: time from the Send click to the confirmation, with timestamps. |
| S-14 | A logged-in customer only chooses a subject and writes a message | Automate now | | |
| S-15 | A customer's message appears under Account > Messages | Automate now | | |
| S-16 | The Contact form is translated | Clarify first | | |
| S-17 | Input made of spaces only is not accepted | Clarify first | | |
| S-18 | The Contact page opens from a direct link | Not worth automating | Not worth automating | Agree. |
| S-19 | Sending stays safe while the server is slow | Clarify first | | |
| S-20 | The API refuses a message above 250 characters | Automate now | | |
| S-21 | Account > Messages shows the subject and time as the customer knows them | Clarify first | | |

## Sign-off

- [ ] Signed off by ____________ on __________
