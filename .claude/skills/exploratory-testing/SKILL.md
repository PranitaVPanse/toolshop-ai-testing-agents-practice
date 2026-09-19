---
name: exploratory-testing
description: Explore a running web application against a user story and produce an automation-readiness report for a QA engineer to sign off. Use when asked to explore a story, assess automation readiness, or decide what is worth automating. Arguments - a Jira issue key or a path to a story markdown file.
---

This is a pointer. The canonical, app-agnostic skill lives at `skills/exploratory-testing/` in
the repository root so it can be copied to other projects and agent hosts.

1. Read `skills/exploratory-testing/SKILL.md` and follow it exactly. Its reference files are in
   the same folder.
2. The project context file for this repository is named in `CLAUDE.md`.
3. The story is the argument passed to this skill: an issue key, or a path under `stories/`.
   If no argument was given, ask which story to explore.
