# Locator rubric

Goal: for every key element, recommend one locator that a future automated test can rely on,
and show that it was checked. A locator nobody verified is a guess.

## 1. Candidate order

Try candidates in this order. Stop at the first one that passes the uniqueness check, unless
the project context file sets a different convention. If it does, the context file wins and you
note the deviation.

| # | Strategy | Playwright form | Notes |
|---|---|---|---|
| 1 | Role and accessible name | `getByRole('button', { name: 'Save' })` | Preferred. Also proves the element is exposed to assistive technology |
| 2 | Label | `getByLabel('Email address')` | Form fields. Requires a real label association |
| 3 | Placeholder | `getByPlaceholder('Search')` | Only when there is no label. Note the missing label as an accessibility observation |
| 4 | Text | `getByText('Order confirmed')` | Non-interactive content. Avoid for text that is translated or data-driven |
| 5 | Test id | `getByTestId('checkout-submit')` | Use the test id attribute named in the context file |
| 6 | Scoped CSS | `locator('form#payment').locator('select')` | Last resort. Scope to a stable container. Never positional (`nth-child`), never generated class names |

Scoping with a parent (`getByRole('row', { name: 'Hammer' }).getByRole('button', { name: 'Delete' })`)
is allowed at any level and is often the right answer for repeated elements.

A role without a name (`getByRole('alert')`) is not strategy 1: it is unique only by accident of
the current state. Add the name, a text filter (`getByRole('alert').filter({ hasText: '...' })`)
or use the test id. When several candidates matched 1, recommend the most specific one.

## 2. Uniqueness check

For each candidate, in the application state where the test would use it:

1. Count the matches. Use the browser tool's evaluate or code-run capability with the actual
   locator where available. Otherwise count matching nodes in a fresh accessibility snapshot.
2. **Exactly 1 match: verified.** Record the count, the method used and the evidence ID.
3. 0 matches: the candidate is wrong or the state is wrong. Re-check the state once, then move
   to the next candidate.
4. 2 or more matches: try scoping to a parent. If scoped count is 1, the scoped locator is
   verified. If not, move to the next candidate.
5. If the element appears in more than one state that matters (for example before and after a
   validation error), check the count in each.

Never write "verified" for a locator whose count you did not observe in this run. Write
"proposed, not verified" and tag it Assumed.

## 3. Accessible name

Record the element's role and accessible name from the snapshot. If the name is empty, generic
("button", "click here"), duplicated on the same page, or comes only from a placeholder or
title attribute, record an accessibility observation and expect role-based locators to fail.

## 4. Stability grade

| Grade | Meaning | Typical locator |
|---|---|---|
| **A** | Verified unique. Based on role and name, label, or a dedicated test id. Survives restyling and layout changes | strategies 1, 2, 5 |
| **B** | Verified unique. Based on placeholder or visible text that is static, or needs one level of parent scoping | strategies 3, 4, scoped 1 to 5 |
| **C** | Verified unique today, but tied to structure or to data-driven text. Likely to break on redesign or data change | strategy 6, text containing data |
| **D** | No unique locator found, or only positional or generated selectors work | none |

Downgrade one level if the name or text is likely to be translated and the context file says
the app is multilingual. Downgrade to D if the count changed between two checks of the same state.

## 5. Testability request for developers

For every key element graded C or D, write a request the QA engineer can hand to a developer.
Keep it specific and small.

```
Element:      <what it is, and on which page or state>
Problem:      <why no stable locator exists, with the counts observed>
Request:      <one of: add an accessible name / associate the label / add test id "<suggested-name>" / make the repeated item's container identifiable>
Benefit:      <automation benefit, and the accessibility benefit if there is one>
Evidence:     <evidence ID>
```

Prefer asking for an accessibility fix over a test id when both would work. It helps users too.

## 6. Output format

One row per key element in the report's locator table:

| Element | State | Recommended locator | Strategy | Matches | Role / accessible name | Grade | Tag | Evidence |
|---|---|---|---|---|---|---|---|---|
