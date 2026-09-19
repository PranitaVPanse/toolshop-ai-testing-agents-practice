# Report template

Copy everything below the line into `report.md` and fill it in. Keep the section order and
headings. Tags are **Observed**, **Inferred** or **Assumed**. IDs: findings `F-nn`, evidence
`E-nn`, questions `Q-nn`, scenarios `S-nn`.

---

# Automation-readiness report: <story id> <story title>

| | |
|---|---|
| Story source | <issue key and URL, or file path> |
| Environment | <base URL from the context file> |
| Run | <date, start time to end time> |
| Budget | <actions used> of <action budget> actions, <minutes used> of <time box> minutes |
| Stopped because | <charter complete / action budget / time box / blocked: reason> |
| Inputs used | story, context file <path>, OpenAPI <path or "none"> |
| Status | **DRAFT. Not signed off** |

## 1. Story summary and expected workflow

Two or three sentences on what the story asks for and for whom.

Expected workflow, written before the browser was opened:

1. ...

Acceptance criteria mapping:

| AC | Criterion | Demonstrated by steps |
|---|---|---|

What the story does not say (detail is in section 8):

- ...

## 2. Expected versus observed

| # | Expected (from story) | Observed | Match | Tag | Evidence |
|---|---|---|---|---|---|

Match is one of: yes, no, partly, not explored.

## 3. Risks

| Risk | Why it matters | Likelihood | Impact | Basis (finding IDs) | Tag |
|---|---|---|---|---|---|

## 4. Positive, negative and edge paths

### Positive
| ID | Path | Result | Tag | Evidence |
|---|---|---|---|---|

### Negative
| ID | Path | Result | Tag | Evidence |
|---|---|---|---|---|

### Edge
| ID | Path | Heuristic | Result | Tag | Evidence |
|---|---|---|---|---|---|

### Not explored
Paths you planned in the charter but did not reach, and why.

## 5. Validations

| Field or rule | Input tried | Expected | Observed message or behaviour | Enforced in UI, API or both | Tag | Evidence |
|---|---|---|---|---|---|---|

## 6. Accessibility, console and network

These are observations made while exploring, not an accessibility audit.

### Accessibility observations
| Observation | Where | Impact on users | Impact on automation | Evidence |
|---|---|---|---|---|

### Console errors and warnings
| Action # | Level | Message (shortened) | Related finding |
|---|---|---|---|

### Failed or suspicious network calls
| Action # | Method and URL | Status | What the UI showed | Related finding |
|---|---|---|---|---|

## 7. Locator and testability assessment

| Element | State | Recommended locator | Strategy | Matches | Role / accessible name | Grade | Tag | Evidence |
|---|---|---|---|---|---|---|---|---|

Summary: <n> key elements, <n> grade A, <n> B, <n> C, <n> D, <n> not verified.

### Testability requests for developers
One block per element graded C or D, in the format from the locator rubric.

### API level or UI level
| Check | Recommended level | Endpoint | Reason |
|---|---|---|---|

If no OpenAPI document was provided, say so here.

## 8. Open questions

Each question states what the agent would have assumed, so the QA engineer can see the cost of
not asking.

### Requirement questions (for the product owner)
| ID | Question | Why it matters | What I would have assumed | Blocks scenarios |
|---|---|---|---|---|

### Domain questions (for someone who knows the business)
| ID | Question | Why it matters | What I would have assumed | Blocks scenarios |
|---|---|---|---|---|

### Environment questions (for the team that runs the test environment)
| ID | Question | Why it matters | What I would have assumed | Blocks scenarios |
|---|---|---|---|---|

## 9. BDD candidates

Gherkin only. No step definitions. Each scenario carries its decision as a tag:
`@automate-now`, `@clarify-first`, `@keep-exploratory` or `@not-worth-automating`, and the
question IDs that block it if any.

```gherkin
Feature: <story title>

  @automate-now
  Scenario: S-01 ...
    Given ...
    When ...
    Then ...
```

## 10. Decision table

| Scenario or check | Decision | Level (UI / API) | Reason | Depends on | QA decision |
|---|---|---|---|---|---|

The last column is left empty for the QA engineer.

## 11. Test data and cleanup

| Data created | Prefix used | Cleaned up | If not, why and where it is |
|---|---|---|---|

## 12. Sign-off

The recommendations above are the agent's. The decisions are the QA engineer's. No automation
code is written until this is signed.

- [ ] I have reviewed the findings and corrected the decision table where I disagree.
- [ ] Open questions approved for posting to the issue tracker: yes / no / edited

QA engineer: ____________________  Date: ____________

---

## Self-check before handing over (do not copy into the report)

- Every finding has exactly one tag, and every Observed finding has an evidence ID that exists
  in the `evidence/` folder.
- No locator is marked verified without an observed match count of exactly 1.
- Every open question has a "what I would have assumed".
- Every decision table row has a reason, and every `@automate-now` scenario has all key
  locators at grade A or B and no blocking question.
- Budget used and stop reason are stated in the header.
- Test data created in the run is listed, with cleanup status.
- No credentials, tokens or personal data appear anywhere in the report or evidence.
- The report contains no step definitions, page objects or spec code.
