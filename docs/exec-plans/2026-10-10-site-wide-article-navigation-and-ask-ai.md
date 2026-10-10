# Shared article navigation and chat layout

Status: Draft for review in [PR #7873](https://github.com/influxdata/docs-v2/pull/7873). Implementation pending.
Refs: [#7706](https://github.com/influxdata/docs-v2/issues/7706) and [PR #6622](https://github.com/influxdata/docs-v2/pull/6622).
Spec: [Site-wide article navigation and Ask AI sidebar](../product-specs/site-wide-article-navigation-and-ask-ai.md).
Plan: [Grounded implementation plan](../design-docs/2026-10-10-site-wide-article-navigation-and-ask-ai.md).

## Goal

Extend the API reference's "On this page" pattern to eligible articles.
Replace the footer Ask AI launcher with a composer and far-right chat sidebar beside article navigation on desktop.

## Why now

The API navigation shipped in #6622, while #7706 describes chat ownership and defers the site-wide ToC rollout.
This review combines those requirements.
The supplied 1280×1024 and 1920×1080 ChatGPT documentation screenshots show that ToC and chat can coexist with left navigation.
The 2026-10-10 refinement replaces the original exclusive-rail proposal with separate desktop columns, including at exactly 1280px.
Feature implementation remains pending.
Publish the spec and reviewed plan before implementation so the layout and handoff rules have one reference.

## Decisions

- Share the ToC shell and navigation behavior while preserving the API operation adapter. This extends the existing design without losing API ordering, method badges, or operation anchors.
- Discover regular headings from final rendered content. Shared `source:` pages render through `RenderString`, so `.TableOfContents` alone is not a reliable source.
- Keep the ToC visible and usable beside chat at 1280px and above. Reserve both visible widths. The screenshots demonstrate the intended behavior, but their narrow article at 1280px is a reason to budget our technical-content space explicitly.
- Start with a compact 1280px budget of 240px left navigation, 416px article text, 200px ToC, 360px chat, and 64px total spacing. Preserve at least 400px of article text in rendered checks; grow chat to 386px above 1440px. Scope navigation sizing and reduced article padding to the shared layout, preserving left-navigation preference and structure.
- Collapse the ToC only below 1280px. Use the left sidebar's visual affordance with independent state because its stylesheet preference and 800px mobile behavior belong to left navigation. Chat suspends ToC access only where the panels would otherwise compete as overlays.
- Retain the Kapa Website Widget and separate composer surfaces. One controller owns readiness and handoff; actual widget events confirm visibility and accepted submission.
- Use documented source-group setters before opening chat. The documented `open` options do not include `sourceGroupIdsInclude`.
- Validate layout before completing the feature. Compare compact 360px and 386px chat layouts on real regular and API pages at 1280px, using the width budget as the initial choice. Check both columns at 1920px, then verify actual Kapa width and nonmodal interaction. If vendor behavior blocks simultaneous use, resolve that constraint before proceeding; do not silently return to hiding the desktop ToC.
- Test with a rendered vendor mock and real Hugo pages. Mocked calls prove requests, while panel bounds, interaction, and screenshots prove layout. A live smoke check verifies vendor behavior, including ToC use while chat stays open.
- Store durable documentation outside root `PLAN.md`. The repository's ephemeral-doc check blocks that filename from merging to master.

## Explicitly out of scope

Feature implementation, left-navigation tree or preference redesign, API spec migration, article rewrites, a React or Chat SDK migration, and cross-page conversation persistence.
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
