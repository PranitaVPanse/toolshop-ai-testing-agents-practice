# Report template

Copy everything below the line into `report.md` and fill it in. Keep the section order and
headings. Tags are **Observed**, **Inferred** or **Assumed**, exactly one per row: when a row
would need two, split it. IDs: findings `F-nn` (numbered 01, 02, ... in report order, no gaps),
ledger observations `O-nn`, evidence `E-nn`, questions `Q-nn`, scenarios `S-nn`, testability
requests `T-nn`.

Writing rules for every section:

- **Name the place.** Say where it happens as the customer sees it: the page, then the field
  label or button text (`Contact > Message field`, `Contact > Send button`). Never only an internal
  name.
- **Numbers come from the evidence.** Every time, count, length or size is in an evidence file. A
  range needs evidence for both ends; otherwise say what is known ("over 5 s, under 50 s").
- **Say when the tool may be the cause.** If an observation could come from how the tool acted
  (filling a field without typing, focus never leaving a field, reading the page too early), say so
  in that row and tag it Inferred until it is re-checked another way.

The report is the decision document: under 150 lines, every fact once, referenced by ID
everywhere else. Detail goes to the files next to it:

| File | Holds | Who writes it | Kept |
|---|---|---|---|
| `report.md` | The eight sections below | agent | committed when signed |
| `qa-review.md` | Answers, decisions, the Jira comment and its "post" box, sign-off | agent prefills, **the QA engineer fills it in** | committed when signed |
| `scenarios.feature` | Gherkin for every scenario in section 5, tagged with its decision | agent | committed when signed |
| `locators.md` | Full locator table: state, strategy, match counts, grade, evidence | agent | committed when signed |
| `technical.md` | Console errors, network calls, accessibility observations | agent | local |
| `ledger.md` | Step 0 and 1 output, numbered action log, observations, test data | agent | local |
| `evidence/` | Snapshots, DOM reads, logs | agent | local |
| `report.html` | Rendered view | rendering command | local |

The rendered `report.html` shows the Gherkin under each scenario row, the QA engineer's answers
and decisions as extra columns, and the Jira comment with its status, all read from `qa-review.md`.

**A re-run's report is complete on its own.** Every carried criterion, finding, question and
testability request is written out in full with "carried from vX.Y" and its `vX.Y/E-nn`
evidence. Never write "see vX.Y" or "wording in vX.Y" instead of the content.

---

# Automation-readiness report: <story id> <story title>

| | |
|---|---|
| Version | <vX.Y> (<draft / signed off>); previous: <vX.Y, or "none"> |
| Story source | <issue key and URL, with "last updated <time>"; or file path> |
| Environment | <name>: UI <url>, API <url> |
| Run | <date>; ledger started <time>; browser <first action time> to <last action time> |
| Budget | <actions used> of <budget> actions; <minutes> of <time box> minutes; stopped: <reason> |
| Inputs | story; context file; knowledge: <files read>; OpenAPI <or "none">; previous review: <`vX.Y/qa-review.md`, or "none"> |
| Status | **DRAFT. Not signed off** / **SIGNED OFF** by <name> on <date> |

Separate the parts of Version, Budget and Inputs with semicolons: the rendered report shows
them one per line.

## 1. Summary

Re-runs only, as a quote block: what was applied from the previous review, what was
re-explored, what is new or resolved, and what still needs the QA engineer.

Look at these first: three lines, each with the IDs behind it.

- ...

| | |
|---|---|
| Acceptance criteria | <n> met · <n> partly · <n> not met · <n> not explored |
| Findings | <n> defects · <n> risks · <n> gaps |
| Open questions | <n> open · <n> answered |
| Scenarios | <n> automate now · <n> clarify first · <n> keep exploratory · <n> not worth automating |
| Locators | <n> stable · <n> at risk · <n> blocked · <n> not verified |
| Your input | `qa-review.md`: <n> answers, <n> decisions |

## 2. Acceptance criteria

One row per criterion, in the story's order. Result: met, partly, not met, not explored.
**Met** only when every part of the criterion matches, including which message appears and its
text. The right outcome with a different message is **partly**. A criterion with a defect or gap
from section 3 about the behaviour it describes is not "met" (a gap in the API documentation
alone does not count).
"Observed" is one short phrase, only what differs from the criterion or what was not reached.
On a re-run, rows that were not re-explored say "carried" and cite the previous version's
evidence as `vX.Y/E-nn`.

| AC | Criterion | Result | Observed | Tag | Scenarios | Evidence |
|---|---|---|---|---|---|---|

The story does not say: one line, each gap followed by the question that covers it.

## 3. Findings

Anything worth a decision that is not an acceptance criterion result. Type: defect, risk, gap,
observation. Severity: high, medium, low. Re-runs add a Status column: new, carried, resolved.
Where: page > field label or button text. AC: criterion numbers, or "-". The ledger maps each
finding to its observations.

| ID | Where | Finding | Type | Severity | AC | Tag | Evidence |
|---|---|---|---|---|---|---|---|

Not explored: one line listing the charter items not reached, with the reason.

## 4. Open questions

Only questions still open. Answered ones are closed and live in `qa-review.md`. A question
carried from an earlier version keeps its full wording and its ID. For: product owner, domain,
environment.

| ID | Question | For | Agent's assumption | Blocks |
|---|---|---|---|---|

## 5. Test scenarios

Type: **functional** (demonstrates an acceptance criterion) or **regression** (another page or
flow from the knowledge files' impact map). Level: UI, API with the endpoint, or both. Decision
with a one-line reason; on a re-run a carried decision just says "carried". Depends on: question
or testability request IDs.

A QA decision from `qa-review.md` is shown in the Decision column as it is, with "carried (QA)"
as the reason; if this run suggests changing it, add that after. The Gherkin tag follows it.

**Automate now** needs every Gherkin step Observed (in this run or carried), every element it
touches stable, and steps that cover every part of the criterion it demonstrates. If one step fails that, move it into its own scenario. Each scenario tests one
rule: it must not use another rule's failure (for example an invalid attachment) to stop a send,
least of all a rule the story calls temporary.

| ID | Scenario | Type | Level | Decision | Reason | Depends on |
|---|---|---|---|---|---|---|

Click a scenario for its steps. Your decision goes in `qa-review.md`.

## 6. Locators and testability

Only what needs attention. Stable elements (grade A or B) are counted in the summary and listed
in `locators.md`; this table has the at-risk (grade C) and blocked (grade D) ones.

| Element | Status | Best locator found | Why it is at risk |
|---|---|---|---|

Testability requests for developers, one row per element above:

| ID | Element | Request | Benefit |
|---|---|---|---|

Accessibility observations that affect users or automation, at most five lines, each pointing
at the request (`T-nn`) or question (`Q-nn`) that resolves it. The full list is in `technical.md`.

- ...

## 7. Test data and cleanup

| Data created | Cleaned up |
|---|---|

Files the run created on disk (upload files, downloads) are test data too: delete them at the end.

## 8. Next step

One or two lines: what the QA engineer does now (fill in `qa-review.md`, re-run, or sign off),
and whether anything pending blocks the rest.

Knowledge to add at sign-off: facts the knowledge files lack (a missing page file, an impact map
row, a stable locator), one line each with its finding or observation ID. Sign-off copies the
confirmed ones into the knowledge files.

Jira comment (issue stories only), one line: "<n> questions and <n> findings drafted in
`qa-review.md`; posted in the next run if you tick its box there" (or "posted <date>" once it is).

---

## `qa-review.md` template

````markdown
# QA review: <story id> <vX.Y>

Fill in the two tables, and the Jira comment if you want it posted. Leave a cell empty to keep
the item pending. The next run reads this file; nothing else in the report needs editing.

## Answers

| ID | Question | Answer |
|---|---|---|
| Q-01 | <the question, in full> | |

## Decisions

| ID | Scenario | Agent's decision | QA decision | Note |
|---|---|---|---|---|
| S-01 | <title> | <decision> | | |

## Jira comment

Only for stories from an issue tracker. Edit the text as you like: it is posted exactly as
written. Tick the box and the next run posts it; leave it unticked and nothing is posted.

- [ ] Post this comment to <issue key> in the next run
- Posted: no

```text
Exploratory testing of <issue key>, report <vX.Y> (draft).

Open questions (the agent's working assumption in brackets):
Q-01 (product owner): <question> [<assumption>]

Findings worth your attention:
F-01: <one line>
```

## Sign-off

- [ ] Signed off by ____________ on __________
````

On a re-run, keep every earlier question, answer, decision and note exactly as written, and add
the new questions and scenarios. The file is the complete record of the QA engineer's input.
The Jira comment section is rewritten for the new version, unticked, with "Posted:" carried for
comments that were posted.

---

## Self-check before handing over (do not copy into the report)

- Every finding has exactly one tag, and every Observed finding has an evidence ID that exists
  in `evidence/` (or `vX.Y/E-nn` for a carried one).
- Findings are numbered F-01 upwards with no gaps, each names its page and UI element, and the
  ledger maps each one to its observations.
- Every number in the report appears in an evidence file. No range without evidence for both ends.
- No AC row is "met" while a finding is filed against it or the message differs.
- Every "automate now" Gherkin step was Observed, and the scenario does not rely on another rule's
  failure.
- Every acceptance criterion of the story has a row in section 2.
- A fact appears once. Section 3 does not repeat section 2; section 5 references findings and
  questions by ID instead of restating them.
- Every scenario in section 5 has a Gherkin block in `scenarios.feature` whose title starts with
  its ID, and the other way round.
- Every question (with its full wording) and every scenario has a row in `qa-review.md`, with the
  QA engineer's previous values carried forward unchanged.
- On a re-run, nothing says "see vX.Y" or "wording in vX.Y": carried items are written out, and
  every QA decision appears unchanged in the Decision column and the Gherkin tag.
- No locator is counted as stable without an observed match count of exactly 1 in `locators.md`,
  and section 6 lists only at-risk and blocked elements.
- Every "automate now" row has all key locators stable and no blocking question.
- Budget used and stop reason are in the header; the action count equals the ledger's rows.
- Test data created in the run is listed, with cleanup status, and files created on disk are deleted.
- No credentials, tokens or personal data anywhere in the folder. Search for each credential
  value from the environment, not by eye.
- `report.md` is under 150 lines. If not, move detail to the appendix files.
- No step definitions, page objects or spec code anywhere.
