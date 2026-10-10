# Site-wide article ToC and Ask AI sidebar

**Status:** Draft plan for review; implementation pending.
**Reviewed:** 2026-10-09.
**Review baseline:** GitHub `master` and local `work` both resolved to `f5a42077a16bb8334b92e077e882f57f893ebd25` on 2026-10-09. Master advanced by three commits to `dc9ce95938ea92a8d9bcc98bc33b73b81afbecf6` before publication on 2026-10-10; those commits change article content, not the reviewed UI implementation.
**Scope:** Extend the API ToC design to regular articles and accommodate an AI chat sidebar that replaces the production footer launcher.
**Spec:** [Site-wide article navigation and Ask AI sidebar](../product-specs/site-wide-article-navigation-and-ask-ai.md).
**Decisions:** [Shared article navigation and chat ownership](../exec-plans/2026-10-10-site-wide-article-navigation-and-ask-ai.md).

## Sources and branch findings

- [PR #6622](https://github.com/influxdata/docs-v2/pull/6622) shipped the Hugo-native API reference, including its right-sidebar ToC with scroll highlighting. Merged 2026-04-20; the implementation is already on master.
- [Issue #7706](https://github.com/influxdata/docs-v2/issues/7706) is open and contains the detailed Ask AI sidebar/composer plan. Its original scope explicitly deferred site-wide navigation. This plan includes that extension, as requested in this review.
- No dedicated site-wide ToC issue, open PR, or matching implementation branch was found through ToC/navigation/sidebar searches, the current open-PR list, and relevant branch searches. #7706 has no comments or linked implementation in its timeline. This is a search result, not proof that no differently named private work exists.
- The original `feat-api-uplift` PR branch is deleted. Surviving `api-docs-uplift` and `api-uplift` branches contain older API work, not this combined feature. The two `jts-askai-groups-*` branches concern source filtering and product help, not sidebar ownership. Do not revive these old branches for this change.
- Historical [Hugo-native migration plan](https://github.com/influxdata/docs-v2/blob/api-docs-uplift/docs/plans/2026-02-13-hugo-native-api-migration.md) and [uplift design](https://github.com/influxdata/docs-v2/blob/api-docs-uplift/docs/plans/2026-03-09-api-docs-uplift-design.md) remain on `api-docs-uplift`. Their pending checklists predate the merged implementation and are not current acceptance evidence.
- `docs/plans/plan-issue-6939.md` covers API spec processing and build ordering, not site-wide ToC navigation.
- No branch for the requested feature was updated. Start its implementation from current master. If an existing feature branch is supplied later, preserve its commits, merge master into it, and assess its final diff against this contract.

## Current code and verified gaps

| Surface | Grounded finding | Implication |
| --- | --- | --- |
| `layouts/api/list.html:73`, other API layouts | API ToCs exist; operation links are rendered by Hugo and sorted like the body. | Preserve operation anchors, labels, method badges, and order. |
| `layouts/_default/single.html:8`, `section.html:8`, `layouts/partials/article.html:1` | Regular pages render an article without a right rail. | Add the shared article/rail layout at these seams. |
| `layouts/partials/article/content.html:21` | Shared content is rendered via `RenderString`, while ordinary pages use `.Content`. | Build regular-page entries from final rendered headings; `.TableOfContents` alone cannot be assumed to cover transcluded content. |
| `assets/js/components/api-toc.ts:49` | Heading mode uses a document-wide root search; filters hidden and feedback headings. | Scope to the owning article and retain exclusions. |
| `api-toc.ts:111` | Heading text and IDs are interpolated into an HTML string. | Construct links with DOM APIs and `textContent`; preserve literal angle brackets and safe attributes. |
| `api-toc.ts:277` | Click handler prevents default even on Ctrl-click and always requests smooth scrolling. | Preserve modified/native navigation and respect reduced motion. |
| `api-toc.ts:338` | Visibility observer only attaches to `.api-tab-panels`. | Ordinary tabs and collapsible content need bounded visibility refresh. |
| `api-toc.ts:240` | Scroll fallback compares `offsetTop` with document scroll position. | Use a consistent document coordinate system; verify long sections and nested targets in a browser. |
| `assets/styles/layouts/_content-wrapper.scss:6`, `_api-layout.scss:12` | Default wrapper clips overflow; API wrapper explicitly enables sticky positioning. | Introduce a scoped shared layout that supports sticky navigation without changing unrelated wrappers. |
| `_api-layout.scss:28`, `:772` | API ToC is sticky, independently scrollable, hidden at widths up to 1280px. | Reuse the visual pattern and breakpoint, with separate ToC/chat widths. |
| `assets/js/ask-ai-trigger.js:47`, `assets/js/ask-ai.ts:100` | Footer trigger loads a 640px modal; no shared rail marker or chat-open state exists. | Replace the launcher and centralize widget readiness, entry points, and ownership. |
| `assets/js/theme.js:14` | Theme is selected by stylesheet enablement. | Expose a stable body theme attribute for widget synchronization. |

Fresh bounded checks invoked the actual ToC component using Node 24 and DOM stubs: visible heading links, hidden/feedback exclusions, and hash updates pass; safe heading encoding, modified-click preservation, reduced motion, and ordinary-tab observation fail.
These establish component code paths, not browser rendering, full-site correctness, or current production behavior.
No production files or checked-in tests were changed in this review.

## Proposed behavior and shared contracts

1. Regular articles and API pages share the existing “On this page” visual language. Regular articles list visible h2 headings, with opt-in h3 depth. Exclude the page title, feedback, and navigation chrome; hide an empty ToC. Preserve all existing heading IDs and API operation IDs, including IDs containing `/`.
2. Use one shared right-rail contract: `[data-page-rail]` marks the ToC on every eligible layout. Retain API-specific operation rendering behind the common shell. Chat opening hides the ToC; chat closing restores it without resetting article scroll or selected tabs.
3. At widths above 1280px, reserve the active rail's width in layout: retain the API-derived ToC sizing and use `--ask-ai-rail-width: 386px` for chat. Do not subtract both widths. Prevent content, tables, code blocks, and fixed custom-time controls from being obscured.
4. At 1280px and below, collapse the ToC by default behind a labeled “On this page” toggle, using the left sidebar's open/close affordance. Opening it reveals a right-side drawer over the article, with no permanently reserved rail width. At 601–1280px, chat also uses an overlay; at 600px and below, use Kapa's full-screen mobile mode. ToC and chat must not be open together. Test boundary widths, not just named devices.
5. Replace the production footer Ask AI launcher with the first-party composer described in #7706 and a labeled top-navigation Ask AI button. The composer is centered near the bottom and capped at 386px; ensure it does not obscure final content or footer controls. No ToC is needed on the home, feature-board, or 404 pages; Ask AI remains available on home and feature-board, and is omitted on 404 and print.
6. Composer submission opens chat and submits the exact question. Enter submits, Shift+Enter inserts a newline, IME composition does not submit, and whitespace disables send. Header opening starts/reopens chat without submitting. Existing shortcode, code-block, and version-detector entry points preserve their prefill behavior and product filters.
7. The first-party composer and widget textarea are separate surfaces. Hide the first-party composer after handoff; do not move a vendor-owned textarea. Close restores the initiating control's focus and the appropriate ToC. Keep the same widget instance so conversation history survives close/reopen.
8. Use body `data-ask-ai-state="loading|ready|opening|open|error"`, `[data-page-rail]`, and `data-theme="light|dark"`. The chat controller owns state and registers widget callbacks once. Drive the open state from the actual widget event; retain a draft and restore usable controls on load/render/open failure.
9. ToC links retain real fragment URLs. Use safe DOM construction, plain-click navigation with the actual fixed-header offset, reduced-motion handling, initial hash/back/forward updates, and `aria-current="location"` for the active entry. Avoid a second competing handler from `content-interactions.js`.

### Responsive ToC collapse

The left sidebar supplies the visual precedent, but its current implementation has two behaviors: `assets/js/sidebar-toggle.js` swaps alternate stylesheets and saves the left-sidebar preference; at 800px and below, `content-interactions.js:97` instead toggles the inline navigation tree. Reuse the open/close affordance for the right ToC through its own controller and scoped styles, with the requested 1280px breakpoint. Keep left and right state independent.

- **Above 1280px:** show the sticky ToC rail whenever chat is closed.
- **At 1280px and below:** start collapsed; keep the toggle outside the hidden drawer and reachable below the fixed header. Use a right-edge open/close control on larger screens and a compact labeled control on phones. Expose `aria-expanded` and `aria-controls` on a real button; hide the toggle when there are no entries.
- **Expanded drawer:** constrain its width to the viewport and its height below the header; scroll its entries independently. Opening it must not squeeze the article between two sidebars or obscure its own close control. Close on Escape, outside activation, or plain ToC-link selection; preserve modified-link behavior and reduced-motion preferences. Return focus to the toggle on dismissal and to the target heading on link selection.
- **Chat handoff:** save the drawer's expanded/collapsed state, close it, and hide its toggle while chat owns the right side. Restore that state and the appropriate initiating focus when chat closes, keeping article scroll and selected tabs intact.
- **Resize:** switch between the desktop rail and narrow drawer without duplicating links or leaving hidden controls focusable. Keep the last narrow-screen choice within the current page; entering the narrow layout for the first time starts collapsed. Chat ownership takes precedence at every width.

## Kapa API grounding and corrections to #7706

Use the existing Website Widget and product/version data; this plan does not require React or the Chat SDK.
The current [theming reference](https://docs.kapa.ai/integrations/website-widget/configuration/theming) confirms `data-view-mode="sidebar"` and a host theme selector.
Its sidebar defaults include a **600px** modal, so explicitly override width to 386px and remove old modal offsets/positioning that would override sidebar defaults.
Use current documented configuration names instead of copying legacy attributes unchanged.

The [functions reference](https://docs.kapa.ai/integrations/website-widget/javascript-api/functions) documents `open({ mode, query, submit })`, asynchronous `render({ onRender })`, and `setSourceGroupIDs(ids)`.
It does not document `sourceGroupIdsInclude` as an `open()` option.
Apply source filtering through `setSourceGroupIDs()` before opening/submitting, and restore the page's default groups for ordinary header/composer entry points.
Script load alone is not sufficient evidence that the widget has rendered.

The [events reference](https://docs.kapa.ai/integrations/website-widget/javascript-api/events) confirms callable event registration and open, close, and query-submit callbacks.
Use them for ownership, focus handoff, and draft acknowledgment.
Actual vendor focus behavior, width overrides, and close/reopen history still require a live-widget browser smoke check; deterministic mocks cannot prove them.

## Implementation sequence

### 1. Establish shared ToC and article layout

- Add the shared rail partial and styles. Wire regular single/section layouts through the article wrapper; add `[data-page-rail]` to every API ToC variant. Audit custom layouts separately rather than assuming every `.article--content` needs a ToC.
- Add the independent ToC collapse control and drawer state at widths up to 1280px. Preserve the left sidebar's own preference and mobile navigation behavior; cover keyboard dismissal, target focus, and resize transitions.
- Extract common navigation behavior from `assets/js/components/api-toc.ts` into a registered page-ToC component, keeping the API operation adapter. Keep server-rendered API links usable before JS initialization.
- Resolve regular headings from rendered content, scope discovery to the article, and refresh on ordinary tab/accordion visibility changes and relevant resize events. Observe bounded content, not the whole body or the ToC's own DOM. Disconnect obsolete observers and debounce refresh.
- Address the confirmed encoding/click/motion gaps and the coordinate-system risk. Preserve API order and the feedback exclusion introduced by commit `fc71d9119`.
- Add behavior coverage in `cypress/e2e/content/page-toc.cy.js` and extend the existing API suite. Include sourced content and headings with inline code, angle brackets, non-ASCII text, and duplicate heading labels.

### 2. Replace the launcher with the chat flow

- Update `layouts/partials/topnav.html`, footer widget partials, and shared widget styles. Register one TypeScript controller through `assets/js/main.js`; consolidate `ask-ai-trigger.js` and `ask-ai.ts` responsibilities rather than stacking initialization paths.
- Implement readiness, queued open/submission, retry, exact query preservation, callbacks, focus restoration, and product filtering. Preserve MCP menu, privacy/disclaimer content, existing analytics, example questions, and existing prefill links.
- Synchronize body theme state from the real theme switch. Validate the Hugo/TypeScript asset pipeline resolves the new imports; the current controller imports compiled `ask-ai.js` while its authored source is `ask-ai.ts`.
- Stub Kapa deterministically in `cypress/e2e/content/ask-ai.cy.js`; cover delayed readiness, script/render failures, duplicate submissions, IME, source groups, and close/reopen history. Add top-navigation coverage for the labeled button.

### 3. Integrate ownership and responsive behavior

- Connect actual open/close events to the shared rail and composer state on regular, shared-content, and API pages.
- Check 1440px, 1024px, 390px, plus 1280/1281px, 800/801px, and 600/601px; test both themes, left sidebar open/closed, ToC collapsed/expanded, long code/table content, no-heading pages, print, and restored scroll/focus after close. Include resizing with the drawer or chat open.
- Complete one live Kapa smoke check to validate supported sidebar presentation and focus. Keep the automated suite independent of external answers and network timing.

## Acceptance and evidence

| Requirement | Required evidence | Current status |
| --- | --- | --- |
| Regular and sourced articles show the right headings and links | Rendered-page Cypress checks; each href resolves to its actual heading | Unimplemented |
| API navigation preserves operation ordering and anchors | Existing API suite plus actual navigation/active-state assertions | Shipped; fresh full-suite run blocked |
| Tabs, accordions, scroll, history, keyboard, and reduced motion work | Focused ToC runtime suite through public behavior | Component gaps identified |
| Chat replaces the footer launcher and hands off exact questions | Stubbed widget/composer tests, including delayed readiness and retry | Unimplemented |
| Exactly one desktop rail owns the space | Browser layout bounds before open, while open, after close | Unimplemented |
| Collapsed ToC remains reachable at widths up to 1280px; drawer, chat, print, and themes remain usable | Boundary-width checks; drawer dismissal/target focus; chat-state restoration; keyboard QA | Unimplemented |
| Product filters and legacy prefill entry points remain correct | Explicit group-setting and query assertions in mocked Kapa calls | Unverified |
| Real vendor sidebar/focus/history matches the integration | Live-widget smoke test after deterministic suites pass | Unverified |

Run the repository verifier on the final changed paths, then the relevant build/runtime checks:

```sh
yarn verify:changed -- <changed-paths>
yarn build:ts
yarn build:api-docs
npx hugo --quiet
node cypress/support/run-e2e-specs.js --spec cypress/e2e/content/page-toc.cy.js --no-mapping
node cypress/support/run-e2e-specs.js --spec cypress/e2e/content/api-reference.cy.js --no-mapping
node cypress/support/run-e2e-specs.js --spec cypress/e2e/content/ask-ai.cy.js --no-mapping
node cypress/support/run-e2e-specs.js --spec cypress/e2e/topnav.cy.js --no-mapping
yarn test:shortcode-examples
```

The runner manages Hugo; do not start a competing server or cancel builds.
Run API generation before checking generated API routes.
No release-ready verdict follows from a build or mocked widget checks alone.

## Seams for iterative visual testing in the browser

Use the actual Hugo pages for layout iteration. The existing tooling is sufficient for a manual edit/reload/inspect loop; repeatable chat-state captures need a small scenario harness using the existing Puppeteer helpers.

| Seam | Existing entry point | Use and limitation |
| --- | --- | --- |
| Persistent browser and live reload | `scripts/puppeteer/debug-browser.js:31`, `.vscode/launch.json` | Headed browser stays open with DevTools and console output. Hugo emits inline source maps in development/testing through `layouts/partials/header/javascript.html:48`. |
| Viewport, element, and full-page captures | `scripts/puppeteer/screenshot.js:45`, `scripts/puppeteer/utils/puppeteer-helpers.js:141` | Capture the article and rail together to assess collisions; crop the rail for typography. The CLI opens a fresh page, so it cannot capture an already-open conversation or preserved draft. |
| Responsive scenarios and image comparison | `puppeteer-helpers.js:380`, `:404` | `testResponsive()` and a working `compareScreenshots()` implementation already exist. `pixelmatch` and `pngjs` are declared dependencies. No caller or approved image-baseline workflow was found; render-regression Cypress coverage asserts DOM output, not pixels. |
| Interactive behavioral replay | `cypress/e2e/content/api-reference.cy.js`, `ask-ai.cy.js`, `cypress.config.js:9` | Cypress open mode can replay interactions while inspecting the real page. The repository runner manages/reuses Hugo on port 1315, but does not forward `--headed`; use the Cypress CLI for the interactive runner. |
| Production-build review | `DOCS-TESTING.md:262`, `.github/workflows/pr-preview.yml` | Eligible same-repository PRs get a full-site preview at `https://test2.docs.influxdata.com/pr-preview/pr-<N>/`. Use real product URLs and expected behavior in the PR description. Test-only fixtures are not a production-preview contract; fork previews are unavailable. |

Concrete local loop, once repository dependencies and a usable browser session are available. Run each long-lived command in its own terminal; the last two are alternative inspection surfaces:

```sh
npx hugo server --environment testing --port 1315 --disableFastRender --noHTTPCache
yarn debug:browser /influxdb3/core/get-started/write/ --devtools --viewport=1440x900 --base-url=http://localhost:1315 --chrome=/usr/bin/chromium
yarn cypress open --e2e --browser /usr/bin/chromium
```

The browser/screenshot CLI option parser requires `--option=value`, despite its space-separated usage examples. Its helper navigates at **1280×720**, then the CLI applies the requested viewport after page initialization. At 1280px the API rail is hidden. Reload after resizing for manual inspection; make pre-navigation viewport selection part of the scenario harness before treating screenshots as acceptance evidence. The screenshot CLI currently captures immediately after resizing, without waiting for component refresh.

Start with a small set of real routes:

| Route | Visual pressure it supplies |
| --- | --- |
| `/example/` in the testing environment | Heading hierarchy, ordinary tabs, code-tabs, accordions, long code, and shortcode combinations. Use this existing fixture for broad rendering checks. |
| `/influxdb3/core/get-started/write/` | Article rendering from `source:` shared content; confirms ToC discovery covers final rendered headings. |
| `/influxdb3/enterprise/reference/config-options/` | Long sourced reference with many headings/tables; sticky positioning, active-entry tracking, and independent rail scrolling. |
| `/influxdb3/core/api/write-data/` after API generation | Existing API operation ToC, operation anchors, and API-specific layout compatibility. |
| `/influxdb3/core/admin/identify-version/` | Existing Ask AI integration and version/prefill entry points. |

Add home, feature-board, 404, and an empty-heading article to the exclusion checks. Keep a dedicated fixture under an existing `__tests__/` section only if the real routes cannot reliably express heading encoding or visibility edge cases; production excludes those sections.

The implementation boundaries are also the browser observation boundaries:

- **Article/rail layout:** `layouts/partials/article.html`, the API `aside.api-toc` variants, and `_content-wrapper.scss`/`_api-layout.scss`. Measure article and rail bounding rectangles together; check sticky placement after a long scroll and interference from the left navigation/custom-time control. Add `[data-page-rail]` here as planned.
- **Navigation behavior:** `assets/js/components/api-toc.ts` and the component registration in `assets/js/main.js`. Inspect real links and active classes now; use `aria-current` once implemented. `window.influxdatadocs.componentRegistry` and `.instances` help identify initialized elements, but constructors do not consistently return controllers, so these are not dependable state-control APIs.
- **Chat readiness/events:** `assets/js/ask-ai.ts:125` loads `https://widget.kapa.ai/kapa-widget.bundle.js`. Intercept that request before navigation in Cypress/Puppeteer and supply a callable Kapa mock implementing render/open/close/group-setting and event callbacks. A visual scenario also needs a minimal rendered sidebar; method spies alone cannot establish layout. Keep injection in the browser harness, without adding a production state-override parameter.
- **Ownership/theme state:** Observe the proposed body `data-ask-ai-state`, `data-theme`, and `[data-page-rail]` through real controls and mock widget events. These markers are planned, not present today. Do not manufacture them directly as proof that the integration works.

For the minimum repeatable harness, create the page, set its viewport, install request interception and startup state, attach error listeners, and only then navigate. Reuse `takeScreenshot()` and `compareScreenshots()` rather than adding a visual-testing dependency. Wait for `document.fonts.ready`, the expected component/widget state, and settled layout after resize/tab/scroll interactions; `networkidle2` alone is not a readiness contract. Save route/viewport/theme/state-named captures and diffs outside the Cypress runner's cleaned screenshot directories.

Capture the desktop ToC, narrow ToC collapsed and expanded, focused composer/draft, delayed loading, chat open with a long answer, failure with retained draft, and close/reopen with restored drawer state/scroll/focus. Iterate first at 1440×900 in both themes, then 1024px and 390px, and check 1280/1281px, 800/801px, and 600/601px boundaries. Include both left-sidebar states and resizing while a panel is open. Pair screenshots with bounds/focus/scroll assertions; require human review of initial baselines. Finish with one live Kapa smoke check in a normal browser to verify vendor rendering, focus, and history. The helper's development browser disables web security, so it does not establish production cross-origin behavior.

This follow-up inspected source and configuration only. No browser capture or visual comparison was executed; the execution limits below still apply.

## Original review execution limits

- The changed-file verifier ran and correctly deferred asset/layout checks; it does not cover these behaviors.
- The Cypress command failed at startup with `ERR_MODULE_NOT_FOUND: cypress`. No project `node_modules`, Yarn, or Hugo binary was available.
- CLI Git/network operations failed connecting to the environment proxy. GitHub connector reads established master, PR/issue status, and surviving branches at review time. No dependencies were installed and no feature implementation branch was fetched or merged during that review.
- Chromium fixture execution was blocked by sandbox `EPERM`; the additional-permission attempt was canceled. No browser pass is claimed.
- Bounded component reproduction: `node /tmp/docs-toc-component-check.mjs`; evidence is `/tmp/docs-toc-review/component-results.json`. These temporary files may need regeneration in a new environment.
- `node --check` on the TypeScript file is not a valid TypeScript check in this runtime and produced a parser error; it is not a product defect. Use `yarn build:ts` when dependencies are available.

## Remaining work and scope boundaries

The shared article ToC rollout, chat/composer replacement, shared layout ownership, and browser acceptance coverage remain to be implemented.
Use #7706 as the existing chat reference. The documentation PR records the site-wide extension without closing the implementation issue.
Leave the left navigation tree, API spec migration, article content rewrites, and unrelated UI issues outside this feature.
This plan was promoted from root `PLAN.md` so the reviewed requirements can remain in the repository. The linked spec defines required behavior, and the execution-plan record explains the decisions.
