# Site-wide article navigation and Ask AI sidebar

Status: Proposed. Implementation pending.
Updated: 2026-10-10.
Review: [Draft PR #7873](https://github.com/influxdata/docs-v2/pull/7873).
Related issue: [#7706](https://github.com/influxdata/docs-v2/issues/7706).
Existing API navigation: [PR #6622](https://github.com/influxdata/docs-v2/pull/6622).
Implementation plan: [Site-wide article ToC and Ask AI sidebar](../design-docs/2026-10-10-site-wide-article-navigation-and-ask-ai.md).
Decision record: [Shared article navigation and chat layout](../exec-plans/2026-10-10-site-wide-article-navigation-and-ask-ai.md).

## Goal

Readers can navigate sections of any eligible documentation article through the same "On this page" pattern used by the API reference.
They can ask a question from a persistent composer or the top navigation, then continue in an AI chat sidebar.
At desktop widths, the ToC stays beside the article while chat opens in a separate far-right column.
Both remain usable at a CSS viewport width of 1280px, with article space reserved between the left navigation and ToC.

This spec extends #7706 to include site-wide article navigation.
The issue originally deferred that rollout.
The 2026-10-10 screenshot review supersedes the earlier rule that chat replaces the ToC and that the ToC collapses at 1280px.
Below 1280px, the ToC uses a drawer with the left sidebar's open and close affordance.

## Reader journeys

1. On a wide-screen article, the reader sees "On this page" beside the content. Selecting a section moves to its existing fragment and identifies the active entry as the reader scrolls.
2. At 1280px and above, opening chat leaves "On this page" visible and interactive. The article narrows within its own column; neither panel overlays it.
3. The reader types a question into the bottom composer and submits it. The question passes unchanged to chat, and the composer gives way to the vendor input. Below 1280px, chat temporarily suspends the ToC drawer and its toggle.
4. The reader closes chat and returns to the same article position, selected tabs, and previous narrow-screen ToC state. Reopening chat retains the conversation within the current page.
5. If chat cannot load or open, the reader keeps their draft, receives a retryable status message, and can continue using article navigation.
6. Below 1280px, the reader opens "On this page" with a toggle. Selecting a heading closes the drawer and moves focus to that heading.

## Page eligibility

| Page | On this page | Ask AI entry points |
| --- | --- | --- |
| Standard article or section with article content | Visible rendered headings | Top-navigation button and bottom composer |
| Article rendered from shared `source:` content | Headings in the final rendered content | Top-navigation button and bottom composer |
| API operation page or endpoint index | Existing operation navigation, order, labels, and method badges | Top-navigation button and bottom composer |
| API conceptual page | Existing heading navigation | Top-navigation button and bottom composer |
| Article with no eligible entries | No empty rail or toggle | Top-navigation button and bottom composer |
| Homepage or feature board | No ToC | Top-navigation button and bottom composer |
| 404 page | No ToC | No Ask AI button or composer |
| Printed page | Article content without interactive navigation or chat controls | No composer or chat |

Custom layouts require an explicit eligibility check.
Finding `.article--content` alone does not make a page eligible.

## Responsive layout

Breakpoints use CSS viewport width, including the boundary values below.

| Width | ToC | Chat when open | Article layout |
| --- | --- | --- | --- |
| 1441px and above | Sticky right rail, also visible during chat | Separate far-right sidebar, 386px wide | Reserve both visible panel widths; cap article text at its existing readable maximum |
| 1280px through 1440px | Compact sticky right rail, also visible during chat | Separate far-right sidebar, 360px wide | Reserve both visible panel widths; use compact navigation and spacing |
| 601px through 1279px | Collapsed toggle; expandable right-side drawer; suspended during chat | Right-side overlay, 360px wide | Reserve no right-rail width |
| 600px and below | Collapsed toggle; drawer constrained to the viewport | Vendor full-screen mobile presentation | Reserve no right-rail width |

The desktop ToC retains the API rail's typography and active-link treatment.
Its existing hide-at-1280px and width rules must change to fit the combined layout.
The chat width uses `--ask-ai-rail-width`, set to 360px through 1440px and 386px above it.
The widget and host layout must consume the same width value, including after resize.
Tables, code blocks, and article content must remain readable without horizontal page overflow caused by either panel.
Use local horizontal scrolling for wide code blocks and tables; keep prose and navigation labels wrapping at the existing font size.
The desktop custom-time control must move clear of chat when needed.
The bottom composer must not cover final article content or footer controls.

### Desktop width budget

The supplied ChatGPT documentation screenshots show left navigation, article, ToC, and chat together at 1280×1024 and 1920×1080.
The article absorbs most of the width reduction in the smaller capture.
These are visual references, not evidence of our layout or the reference site's exact CSS dimensions.
The intended match is simultaneous navigation and chat, with enough reading space for our technical content.

Use this initial budget at 1280px with the left navigation, ToC, and chat all visible:

| Region | Width budget |
| --- | --- |
| Left navigation, including its padding | 240px |
| Article text area | 416px |
| ToC, including its padding and border | 200px |
| Chat, including its border | 360px |
| All remaining outer gutters, article padding, and column gaps | 64px |
| Total | 1280px |

Treat these as border-box budgets, with no uncounted nested horizontal padding.
The rendered article text area must remain at least 400 CSS pixels wide in the 1280px acceptance case, allowing for a browser scrollbar.
Use a flexible article column with `min-width: 0`; at 1280px and above, the compact panel sizes and spacing must satisfy that floor.
Closing chat releases only the chat column. An empty ToC releases only the ToC column.
Closing the left navigation releases its column without altering its saved preference.
Above 1440px, initially cap left navigation at 280px and ToC at 260px, keep chat at 386px, and keep article text within its existing 850px maximum. Confirm these caps during layout exploration.
Compact left-navigation sizing is a scoped layout change, not a navigation-tree redesign or an automatic collapse.
Fit the header, search, product selectors, and custom-time controls to the remaining documentation width while chat is docked.
Do not shrink fonts or hide the desktop ToC to make the 1280px case pass.
Confirm the budget on regular and API pages before feature implementation proceeds beyond layout exploration.

### Collapsible ToC

- Below 1280px, the ToC starts collapsed on each new page. Its open control remains reachable outside the hidden drawer, below the fixed header.
- Use a right-edge toggle on larger screens and a compact labeled "On this page" control on phones. Both use a real button with `aria-expanded` and `aria-controls`.
- The drawer is nonmodal navigation. It overlays the article without changing the left sidebar's state or squeezing the content between two panels.
- Constrain the drawer's width to the viewport and its height to the space below the fixed header. Its entries scroll independently, and its close control remains reachable.
- Close the drawer on Escape, outside activation, or plain ToC-link selection. Preserve modified-click behavior. Drawer dismissal must not consume Escape intended for another active dialog.
- On dismissal, return focus to the toggle. On link selection, move focus to the target heading without a second scroll jump. Navigation must respect reduced-motion preferences.
- Remember the last narrow-screen expanded or collapsed choice within the current page. Crossing the desktop breakpoint does not discard that choice. Entering the narrow layout for the first time starts collapsed.
- Below 1280px, opening chat saves the drawer choice and suspends the drawer and its toggle. Closing chat restores that choice. At 1280px and above, chat opening, closing, and pending handoff leave the sticky ToC visible and interactive.
- When an open chat crosses below 1280px, it changes to an overlay and suspends drawer access. Widening to 1280px restores the ToC beside the still-open chat without reopening or resubmitting to the widget. Preserve the current reading target across reflow; move focus only when its control becomes hidden.
- Hidden entries and controls must leave the keyboard tab order. Resize must not duplicate navigation links or leave focus inside hidden content.

The left sidebar retains its existing preference and mobile behavior.
The right ToC uses its own state and does not reuse the left sidebar's stylesheet-switching preference.

## Navigation requirements

| ID | Requirement |
| --- | --- |
| NAV-01 | Standard articles list visible h2 headings in document order. Support an explicit opt-in for h3 depth. Preserve existing API heading depth and operation rendering. |
| NAV-02 | Discover headings in the final rendered article, including shared content. Exclude the page title, feedback section, navigation controls, and headings inside hidden tab or collapsed content. |
| NAV-03 | Refresh entries after tab, accordion, and relevant viewport changes. Heading discovery stays scoped to the owning article. |
| NAV-04 | Preserve existing heading and operation IDs. Every entry has a real fragment URL that resolves to its target, including IDs containing `/`. |
| NAV-05 | Render heading labels as text. Inline code, angle brackets, non-ASCII characters, and repeated labels must not corrupt links or introduce markup. |
| NAV-06 | Plain clicks align the target below the fixed header. Modified clicks, fragment copying, and native link behavior remain available. Only one handler owns ToC navigation. |
| NAV-07 | Initial fragments, back and forward navigation, and scrolling update the active entry. Use `aria-current="location"`; keep the active entry reachable in a long ToC. |
| NAV-08 | Empty navigation hides the rail and toggle and reserves no width. Server-rendered API links remain usable before JavaScript initialization. |

## Ask AI requirements

| ID | Requirement |
| --- | --- |
| AI-01 | Replace the floating footer launcher with a persistent bottom composer and a labeled top-navigation "Ask AI" button. Preserve the existing Search behavior. |
| AI-02 | Show the composer immediately on eligible pages. Center it near the bottom, cap its width at 386px, and label its multiline textarea. Use `#chat-assistant-textarea` and the placeholder `Ask a question...`. |
| AI-03 | Enter submits, Shift+Enter inserts a newline, and IME composition does not submit. Disable send for whitespace-only input. Validate emptiness without trimming or rewriting the submitted question. |
| AI-04 | Header opening starts or reopens chat without submitting a question. Existing conversation history remains available within the current page. |
| AI-05 | Composer submission opens chat and submits the exact question once. Existing shortcode, code-block, and version-detector links preserve their prefill and submission behavior. |
| AI-06 | Before opening, apply the entry point's product source groups. Ordinary header and composer entry points restore the page's default groups after any filtered entry point. |
| AI-07 | Keep the first-party composer and vendor textarea separate. Hide the first-party composer after successful handoff, focus the vendor input, and retain the vendor instance across close and reopen. |
| AI-08 | Maintain one outstanding open or submission request. Repeated activations must not create another widget, replace a queued question, or submit it twice. Keep status and disabled controls consistent while it is pending. |
| AI-09 | Retain a queued question until the widget is rendered and can open. Script load alone is not readiness. Clear the saved draft only after the query-submit acknowledgment. |
| AI-10 | On script, render, or open failure, restore usable controls and the ToC, retain the draft, and announce a retryable error. Bound readiness and open waits. Do not automatically replay an unacknowledged submission. |
| AI-11 | On close, restore the initiating control's focus, composer, and appropriate ToC state. Preserve article scroll and selected tabs. If the initiating control no longer exists, use an available Ask AI control. |
| AI-12 | Synchronize the composer and vendor widget with the active light or dark theme, including changes while chat is open. |
| AI-13 | Preserve existing analytics, privacy and disclaimer content, MCP menu, product questions, and source filtering unless an existing setting conflicts with sidebar presentation. |

After a query has been accepted, answer failures belong to the vendor conversation.
They must not trigger a second automatic submission from the first-party composer.

## State and layout coordination

ToC availability and chat lifecycle are independent.
At 1280px and above, both can be visible, and the layout reserves a separate column for each.
Below 1280px, only one right-side overlay can be available at a time.
Chat handoff suspends the narrow ToC drawer while preserving its choice; desktop navigation remains available throughout handoff.
The actual widget open event confirms chat visibility; an open call alone does not reserve a desktop chat column.
Failure or close releases chat space and restores narrow navigation when needed.

| Chat state | Meaning | First-party behavior |
| --- | --- | --- |
| `loading` | Widget readiness is pending | Entry points remain visible; retain one queued request and its draft |
| `ready` | Widget rendered; chat closed | Composer and eligible ToC are available |
| `opening` | A request is handing off to the widget | Prevent duplicate activation; preserve the draft and remembered ToC state |
| `open` | Actual widget open event received | Hide composer; reserve chat beside the desktop ToC or suspend narrow ToC access for overlay/mobile chat |
| `error` | Load, render, or open failed | Restore navigation and composer with retained draft and retry status |

Represent pending request, initiating control, draft acknowledgment, and remembered ToC choice as state associated with the relevant transition.
Derive panel presentation from viewport mode, eligible entries, remembered drawer choice, and chat state.
Simultaneous desktop panels are valid; simultaneous narrow overlays are not.

| Responsibility | Owner |
| --- | --- |
| Heading discovery, fragment navigation, active entry, and narrow-screen ToC choice | Shared page-ToC component, with an API operation adapter |
| Widget readiness, queued requests, product groups, open and close callbacks, and handoff | One Ask AI controller registered through `assets/js/main.js` |
| Narrow-screen overlay exclusion and ToC restoration | Ask AI controller coordinating with the page-ToC component |
| Separate desktop columns, drawer presentation, and responsive panel widths | Shared scoped layout styles derived from chat state and viewport mode |
| Theme selection | Existing theme controller, exposing the active value for the widget |

The alternative is for each entry point and ToC component to mutate layout independently.
That preserves the current split initialization paths but permits overlapping overlays and duplicate callbacks.
Use one chat controller for handoff and narrow overlay coordination; keep ToC navigation independent of vendor APIs.

## Integration contracts

These are proposed contracts, not claims about current implementation.

| Contract | Meaning |
| --- | --- |
| `data-component="ask-ai"` | Root for the single Ask AI controller |
| `data-ask-ai-action="open"` or `"submit"` | First-party controls delegated to that controller |
| Body `data-ask-ai-state` | `loading`, `ready`, `opening`, `open`, or `error`, derived from controller state |
| `[data-page-rail]` | Shared marker for eligible regular and API ToCs |
| Body `data-theme` | Active `light` or `dark` theme |
| `--ask-ai-rail-width` | Chat width, 360px through 1440px and 386px above it; mobile presentation takes precedence |
| `--page-toc-width` | Separate desktop ToC width, initially 200px in compact mode; zero space for empty navigation |

Use the Kapa Website Widget in its documented sidebar mode.
Remove legacy modal size and centering overrides that conflict with sidebar defaults.
Set the width explicitly because the vendor's default sidebar is 600px.
Use the documented host color-scheme selector for theme synchronization.

The vendor interface needs `render`, `open`, `close`, source-group methods, and callable event registration.
Apply `setSourceGroupIDs(ids)` before `open({ mode, query, submit })`.
Do not rely on the undocumented `sourceGroupIdsInclude` option on `open`.
Register `onModalOpen`, `onModalClose`, and `onAskAIQuerySubmit` once per widget instance.
Ignore obsolete readiness callbacks from a failed attempt after a later retry has taken over.

Sources: [Kapa theming](https://docs.kapa.ai/integrations/website-widget/configuration/theming), [functions](https://docs.kapa.ai/integrations/website-widget/javascript-api/functions), and [events](https://docs.kapa.ai/integrations/website-widget/javascript-api/events).
Actual vendor focus, width, and conversation-history behavior require a live-widget browser check.

## Accessibility

The left navigation, ToC, and chat have accessible names.
Desktop chat must permit interaction with the article and ToC while open, without a page-wide backdrop, inert article, or modal focus trap.
Verify this against the actual Kapa sidebar before committing to the integration; an overlay styled to look docked does not satisfy the desktop contract.
Buttons expose their purpose and expanded state, and all controls work with a keyboard.
Provide visible focus in both themes and an `aria-live` status region for loading and retryable errors.
Hidden panels expose no focusable descendants.
The nonmodal ToC drawer does not trap focus; vendor mobile chat must support its full-screen keyboard interaction.
Opening, dismissal, and resize must preserve a usable focus target.
Reduced motion disables animated scrolling and unnecessary panel transitions.

## Acceptance criteria

Every requirement is pending until the implementation supplies fresh evidence.

| Coverage | Required evidence |
| --- | --- |
| NAV-01 through NAV-05 and NAV-08 | Rendered-page assertions for regular, sourced, and API content; hidden-heading exclusions; safe labels; every href resolves |
| NAV-06 and NAV-07 | Real fragment navigation, fixed-header alignment, history, modified clicks, reduced motion, active-state assertions |
| Collapsible ToC | Toggle, Escape, outside activation, heading focus, independent scrolling, resize, and retained narrow-screen choice |
| AI-01 through AI-09 | Deterministic Kapa mock covering controls, exact question, groups, delayed readiness, acknowledgment, and duplicate activation |
| AI-10 and AI-11 | Script, render, and open failures; timeout and retry; draft retention; restored ToC, scroll, tabs, and focus |
| AI-12 and AI-13 | Both themes; existing entry points and analytics; preserved vendor configuration |
| Responsive layout | At 1280px and above, article/ToC/chat bounds do not overlap, both panels remain interactive, and article text is at least 400px at 1280px; below 1280px, only one right-side overlay is available; no page overflow; composer/header/custom-time clearance |
| Real vendor integration | One live-widget smoke check for responsive sidebar width, nonmodal desktop interaction, focus, theme, close, resize, and retained conversation history |

Use `/example/` in the testing environment, a sourced article, a long reference, an API operation page, and the existing version-detector page.
Also check the homepage, feature board, 404, an article without headings, and print.
The implementation plan names the routes and commands.

Capture desktop ToC with chat closed and open, narrow ToC collapsed and expanded, composer draft, delayed loading, open chat with a long answer, failure, and restored navigation.
Reproduce the supplied 1280×1024 and 1920×1080 viewport cases in both themes, with both left-sidebar states.
Also check 1440px, 1024px, and 390px, plus 1279/1280/1281px, 1440/1441px, 800/801px, and 600/601px boundaries.
At 1280px with all columns visible, select a ToC entry while chat stays open, then interact with the article and chat input to prove simultaneous use.
Include both left-sidebar states and resize with either panel open.

Set the viewport and mock vendor script before navigation.
Wait for fonts, expected component state, and settled layout before screenshots.
Pair image review with bounds, focus, and scroll assertions.
Approve initial screenshot baselines through human review.
Production-build PR previews supplement local testing; test-only fixtures need the testing environment.

## Out of scope

- Replacing the Kapa Website Widget with React or the Chat SDK.
- Redesigning the left navigation tree or changing its saved preference. Scoped column sizing to meet the desktop budget is included.
- Migrating OpenAPI specs or rewriting article content.
- Persisting drafts, ToC choice, or conversations across page navigation or browser sessions.
- Treating mocked AI answers as proof of vendor response quality.

The implementation plan contains code findings, delivery order, browser iteration commands, and the limits of the original review.
This documentation change does not implement the feature or establish a browser-test pass.
