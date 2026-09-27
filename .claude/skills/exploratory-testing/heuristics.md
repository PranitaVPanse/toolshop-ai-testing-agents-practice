# Exploration heuristics

Use these to generate test ideas. They are prompts, not a checklist to complete. Pick what the
story's risks justify and what the action budget allows. Note in the ledger which heuristic
produced each idea. That makes the report explainable.

## SFDIPOT (product elements)

| Letter | Ask |
|---|---|
| **S**tructure | What is this feature made of? Pages, components, routes, API endpoints, storage. What is shared with other features? |
| **F**unction | What does it do? Every acceptance criterion, plus what it must do that nobody wrote down: calculations, state changes, error handling |
| **D**ata | What goes in, what comes out, what is stored? Types, lengths, formats, defaults, empty, huge, special characters, unicode, leading and trailing spaces |
| **I**nterfaces | UI, API, URLs with parameters, browser storage, emails, files, third parties. Does each interface enforce the same rules? |
| **P**latform | Browser, viewport, locale, time zone, network speed. Only vary what the context file says matters |
| **O**perations | Who uses it and how? Realistic sequences, common mistakes, heavy users, first-time users, keyboard-only users |
| **T**ime | Timeouts, session expiry, double clicks, slow responses, things that happen "later", dates at boundaries |

## CRUD

For every entity the story touches, ask which of Create, Read, Update and Delete are in scope,
and for each one: who may do it, where the result shows up, and whether it shows up for other
roles. Check that a Create can be Read back exactly, that an Update does not change fields it
should not, and that a Delete (only on data you created) removes it everywhere it was listed.

## Boundaries

- Numbers: zero, one, minimum, maximum, just below, just above, negative, decimal, very large.
- Text: empty, one character, maximum length, maximum plus one, only spaces, markup characters.
- Collections: none, one, many, exactly a page, a page plus one.
- Dates: today, past, far future, month and year ends, invalid dates.
- Money: rounding, currency format, totals that sum many rounded lines.
- Look for where the UI boundary and the API boundary disagree.

## Interruptions

- Reload in the middle of a multi-step flow. Is state kept, lost or corrupted?
- Browser back and forward between steps. Deep-link straight into a later step.
- Open the same flow in a second tab and continue in both.
- Submit twice quickly. Navigate away while a request is in flight.
- Let the session expire or log out in another tab, then continue.

## State and role changes

- Same action as each role in the context file, including not logged in.
- Change state in one role, then observe as another role. How stale is what they see?
- Change the underlying data mid-flow: a price, stock, a permission, an item removed.
- Logged-out to logged-in transition in the middle of a flow. What is carried over?
- Direct URL access to pages the current role should not see.

## Error recovery

- After a validation error: is the input kept, is the message specific, is it attached to the
  field, can the user fix it and continue without starting again?
- After a server error or failed network call: what does the user see, can they retry, was
  anything half-saved?
- Is every error state reachable again on purpose? If not, it will be hard to automate. Say so.

## Stopping rules

Stop a path when: you have confirmed or refuted the expectation, you would need a destructive
action to go further, you meet a CAPTCHA or bot check, or the path's share of the budget is
spent. Record why you stopped.
