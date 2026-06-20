---
name: exec-plan-writing
description: "Capture durable goal, intent, and decisions for a unit of work as an execution plan under docs/exec-plans/. Use when finishing a non-trivial change that needs a decision record, when a PR closes one or more issues and the rationale would otherwise live only in commit messages or PR descriptions, or when the user asks to write an exec-plan, decision doc, or to document the why behind a change. Distinct from PLAN.md (ephemeral, tracked on feature branches, and blocked from the default branch) and design-docs (architectural)."
author: InfluxData
version: "0.1"
---

# Writing Execution Plans

## Purpose

Execution plans are durable, checked-in records of *why* a unit of work was done a particular way. They survive past merge, so future agents and humans can reconstruct intent without spelunking through commit history or closed PR descriptions.

They are **not**:

- **PLAN.md** at the repo root — that file is the in-flight working plan. It is
  tracked on feature branches and blocked from the default branch by a PR check.
  PLAN.md captures step-by-step *how*; the exec-plan captures durable *why*.
- **Design docs** under `docs/design-docs/` (coming) — those capture architectural beliefs and cross-cutting decisions. Exec-plans are scoped to one change/PR.
- **Commit messages or PR descriptions** — both are useful but tied to a specific moment; PR descriptions get buried, and squash-merge commit messages frequently lose detail.

## When to write one

Write an exec-plan when **any** of these apply:

- The work involves a non-obvious design choice (alternative approaches existed and were rejected for specific reasons)
- Closing multiple issues in one PR — record which decisions tie them together
- Bundling an opportunistic fix with the main change (future readers should know it was intentional)
- A reviewer would reasonably ask "why didn't you just do X instead?" — answer it here
- The change has explicit out-of-scope boundaries that affect how follow-up work is sequenced

Skip an exec-plan for purely mechanical changes (typo fixes, dependency bumps, link updates, formatting) where the *what* is the whole story.

## Where it lives

```
docs/
└── exec-plans/
    └── YYYY-MM-DD-kebab-case-slug.md
```

**Filename:** `YYYY-MM-DD-kebab-case-slug.md`. Use the date the PR was opened, not the merge date.

**Slug:** short, action-flavored. Match how a future reader would search. Good: `robots-named-ai-bots`, `influxdb3-decision-pages-hub`, `api-tag-pages-rendering`. Avoid: `update-things`, `fix-bug`.

**Lifecycle:** create the file when the PR opens or when PLAN.md grows durable
decision context. After merge, update the **Status** line from "In review" to
"Merged YYYY-MM-DD" when convenient. Do not move the file between lifecycle
directories.

## Template

Copy this as the starting point. Trim sections that don't apply (don't pad them with "N/A"). Keep the doc focused — terse and load-bearing beats long and exhaustive.

```markdown
# <Short title — matches PR title without the conventional-commit prefix>

**Status:** In review — PR [#NNNN](https://github.com/influxdata/docs-v2/pull/NNNN)
**Closes:** [#NNNN](https://github.com/influxdata/docs-v2/issues/NNNN), [#NNNN](https://github.com/influxdata/docs-v2/issues/NNNN)
**Parent:** [#NNNN](https://github.com/influxdata/docs-v2/issues/NNNN) (optional — link the epic if there is one)

## Goal

<One or two sentences. What does this change accomplish, and what observable behavior is different after it lands? Avoid restating the PR title.>

## Why now

<The concrete trigger. A user report, a security finding, a phase of an epic, a regression discovered in review. Distinguish "we did this now" from the broader "we want this eventually" — the trigger is what makes the difference.>

## Decisions

<Non-obvious choices, one bullet each. Lead with the choice, then the reason. A reviewer should be able to read this list and not need to ask "why didn't you just …". Capture both code-shape decisions (data structures, file locations) and process decisions (bundling vs splitting PRs, what stays out of scope).>

- **<Decision>.** <Rationale. If there's a discarded alternative, name it.>
- **<Decision>.** <Rationale.>

## Explicitly out of scope

<Adjacent work the reader might expect to see in this PR but won't. Link to issues if follow-ups already exist. This is where you protect future-you from being asked "why didn't you fix X while you were in there?" — answer it here.>

- <Item> ([#NNNN](https://github.com/influxdata/docs-v2/issues/NNNN))
- <Item>

## How to update

<Steady-state instructions: a future contributor wants to add to or change the thing this PR introduced — what file(s) do they touch, and what regenerates from there? One or two sentences max. Skip this section if the change is a one-shot fix with no extensibility surface.>

## Verification

<Reproducible commands or steps that confirm the change works. The PR description has a test plan; this section is for the *durable* repro that still makes sense six months from now.>
```

## Worked example

The first exec-plan in this repo is the model:

**`docs/exec-plans/2026-05-21-robots-named-ai-bots.md`**

It covers two bundled issues (#7240 named AI-bot blocks, #7251 staging whitespace fix), records five concrete decisions (flat YAML, kept legacy IDs, mirrored staging guard, `Allow` not `Disallow`, bundled #7251), and explicitly defers four related issues (#7242, #7243, #7241, #7245). It's \~40 lines. That's the right length.

## Writing checklist

Before opening (or updating) the PR:

- [ ] File is in `docs/exec-plans/` with `YYYY-MM-DD-slug.md` naming
- [ ] **Status** line links the PR; **Closes/Refs** line links every issue the doc covers
- [ ] Every bullet under **Decisions** is a choice + a reason — no restatement of what's in the diff
- [ ] **Out of scope** lists every adjacent issue the reader might expect, with links
- [ ] Sections that don't apply are removed, not left empty
- [ ] The doc is shorter than PLAN.md — if it's longer, content has leaked from "decisions" into "implementation steps"

## After merge

When the PR lands:

1. Update **Status** from "In review" to "Merged YYYY-MM-DD"
2. Update the PR link if a follow-up PR delivered the final form

This housekeeping can ride along on the next docs-touching PR — it doesn't need its own.

## Related skills and conventions

- The repo-root `PLAN.md` convention (ephemeral working plan, tracked on
  feature branches, blocked from the default branch) is documented in
  `CLAUDE.md`.
- Future skills will cover `docs/design-docs/` (architectural beliefs), `docs/product-specs/` (product specifications), and `docs/references/` (LLM-ingestible reference corpora) — see the structure overview in the next gardening pass.
