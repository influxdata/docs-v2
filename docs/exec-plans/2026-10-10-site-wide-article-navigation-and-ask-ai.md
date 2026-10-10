# Shared article navigation and chat ownership

Status: Draft for review. Implementation pending.
Refs: [#7706](https://github.com/influxdata/docs-v2/issues/7706) and [PR #6622](https://github.com/influxdata/docs-v2/pull/6622).
Spec: [Site-wide article navigation and Ask AI sidebar](../product-specs/site-wide-article-navigation-and-ask-ai.md).
Plan: [Grounded implementation plan](../design-docs/2026-10-10-site-wide-article-navigation-and-ask-ai.md).

## Goal

Extend the API reference's "On this page" pattern to eligible articles.
Replace the footer Ask AI launcher with a composer and chat sidebar that share the right side with article navigation.

## Why now

The API navigation shipped in #6622, while #7706 describes chat ownership and defers the site-wide ToC rollout.
This review combines those requirements and adds a collapsible ToC at 1280px and below.
Publish the spec and reviewed plan before implementation so the layout and handoff rules have one reference.

## Decisions

- Share the ToC shell and navigation behavior while preserving the API operation adapter. This extends the existing design without losing API ordering, method badges, or operation anchors.
- Discover regular headings from final rendered content. Shared `source:` pages render through `RenderString`, so `.TableOfContents` alone is not a reliable source.
- Give chat precedence over the right ToC. Reserve only the active rail's width above 1280px; use overlays below that breakpoint to preserve article space.
- Collapse the ToC at 1280px and below. Use the left sidebar's visual affordance with independent state because its stylesheet preference and 800px mobile behavior belong to left navigation.
- Retain the Kapa Website Widget and separate composer surfaces. One controller owns readiness and handoff; actual widget events confirm visibility and accepted submission.
- Use documented source-group setters before opening chat. The documented `open` options do not include `sourceGroupIdsInclude`.
- Test with a rendered vendor mock and real Hugo pages. Mocked calls prove requests, while panel bounds and screenshots prove layout; a live smoke check verifies vendor behavior.
- Store durable documentation outside root `PLAN.md`. The repository's ephemeral-doc check blocks that filename from merging to master.

## Explicitly out of scope

Feature implementation, left-navigation redesign, API spec migration, article rewrites, a React or Chat SDK migration, and cross-page conversation persistence.
This documentation PR references #7706 without closing it.

## How to update

Update the product spec when reader-visible requirements change.
Update the implementation plan for code findings, delivery steps, and verification commands.
Keep this record focused on the reasons for those choices.

## Verification

Check the documentation diff for whitespace errors and verify all relative file links.
Run `node scripts/verify-changed.mjs --staged` to select repository checks.
The original review found component-level gaps but could not run Cypress or browser captures in this environment.
The spec's acceptance criteria remain pending until implementation provides fresh rendered-page, browser, and live-widget evidence.
