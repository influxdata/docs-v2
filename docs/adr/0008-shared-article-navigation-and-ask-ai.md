# Shared article navigation and Ask AI

Accepted on 2026-10-11; live answer and conversation history verification remain pending.
Related to [PR #7873](https://github.com/influxdata/docs-v2/pull/7873),
[issue #7706](https://github.com/influxdata/docs-v2/issues/7706), and the
[product spec](../product-specs/site-wide-article-navigation-and-ask-ai.md).

## Decisions

- Share article and API section navigation.
  Discover headings from the rendered DOM because shared `source:` content can bypass Hugo's `.TableOfContents`.
  Preserve API operation order, anchors, and method badges.
- Give navigation and chat separate columns at widths of at least 1280px, preserving at least 400px of article text.
  Chat is 360px through 1440px and 386px at wider widths.
  Narrow layouts allow one right-side overlay; chat becomes full-screen at 600px or less.
- Retain one Kapa Website Widget instance, a separate first-party composer, and a header button.
  One controller owns readiness, source filters, and submission acknowledgment.
  Preserve failed drafts and avoid duplicate submissions on retry or resize.
- Isolate the desktop focus adapter in `kapa-sidebar.ts`.
  Desktop chat permits native keyboard traversal into the page; narrow layouts retain vendor modal behavior.

## Turning points

Screenshot review replaced the exclusive navigation or chat panel with simultaneous desktop columns.
Live width comparisons supported compact chat; regular and API checks measured 448px of article text at 1280px.

Sidebar styling allowed pointer interaction but retained the vendor modal focus trap.
The user selected a scoped adapter over a React Chat SDK migration to preserve widget features and limit scope.

Rendered mocks and live probes verified layout and query acknowledgment.
Blocked reCAPTCHA resources prevented completed-answer and conversation history checks.
Network policy changes require a new session, with certificate verification enabled.

Preview feedback led to theme-aware drawer styling and independent header-button alignment when the product menu opens.

## Consequences

The adapter depends on vendor shadow DOM and needs live regression checks when the widget changes.
Final acceptance requires a completed answer and retained history after close, reopen, and resize.
Cross-page history and a Chat SDK migration remain outside this change.
