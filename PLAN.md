# Format Selector GA4 Events Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire GA4 `ai_format_action` events into the existing format-selector dropdown so we can measure user/agent intent for AI-friendly artifacts before building the server-side pipeline (Part B, separate branch).

**Architecture:** Add one `emitFormatEvent()` helper inside `format-selector.ts`. Call it from a single chokepoint in the option click handler (intent for every dropdown action) and additionally from the async copy handlers' success/catch paths (so we distinguish intent from outcome). Derive `product` via the existing `getProductKeyFromPath()`. Extend the existing Cypress spec with a GA4 events `describe` block that stubs `window.gtag` via `onBeforeLoad` and asserts payloads with `Cypress.sinon.match`.

**Tech Stack:** TypeScript, GA4 (gtag.js, already on every page via the site's `<head>`), Cypress 14, existing `assets/js/utils/product-mappings.ts`.

**Branch:** This branch (`chore-llm-request-metrics`) ships Part A only. Part B (S3 access logs → InfluxDB 3 pipeline) will live on a separate branch (suggested name: `chore-llm-request-metrics-pipeline`) with its own implementation plan. The spec for both parts is preserved in this branch's git history (commit before this plan replaced it).

---

## Event payload contract

| Field | Value | Source |
| --- | --- | --- |
| Event name | `ai_format_action` | constant |
| `action` | `copy_page_md` \| `copy_section_md` \| `open_chatgpt` \| `open_claude` \| `connect_mcp` \| `copy_failed` | mapped from `option.dataAttribute` |
| `page_type` | `leaf` \| `branch` | `config.pageType` |
| `page_path` | `window.location.pathname` | read at emit time |
| `product` | product key (e.g., `influxdb3-core`) or `null` | `getProductKeyFromPath(page_path)` |
| `action_target` (only on `copy_failed`) | `copy_page_md` \| `copy_section_md` | constant per call site |

Single event name `ai_format_action` with `action` as a parameter keeps GA4 event-count limits manageable and matches the `code_copy` pattern in `code-controls.js:154`.

## Data-attribute → action map

The five dropdown options each carry a `data-option` attribute (set at `format-selector.ts:329, 339, 369, 382, 418`). Map them to event action names:

| `data-option` (existing) | event `action` (new) | Emit from |
| --- | --- | --- |
| `copy-page` | `copy_page_md` | `handleCopyPage` success |
| `copy-section` | `copy_section_md` | `handleCopySection` success |
| `open-chatgpt` | `open_chatgpt` | option click handler (intent) |
| `open-claude` | `open_claude` | option click handler (intent) |
| `connect-mcp-docs` | `connect_mcp` | option click handler (intent) |
| (n/a) | `copy_failed` | `handleCopyPage` / `handleCopySection` catch |

Copy options emit only on success/failure — not on click — so the GA4 metric reflects actual clipboard outcomes. External-link options emit on click because the browser handles navigation after our handler returns and we have no success signal to wait for.

## File structure

- **Modify** `assets/js/components/format-selector.ts`
  - Add `gtag` declaration to the `Window` interface (existing pattern: `influxdb-version-detector.ts:163-166`).
  - Add `import { getProductKeyFromPath } from '../utils/product-mappings.js';` at the top.
  - Add `emitFormatEvent(action, extras?)` helper inside the component closure (after `initConfig`).
  - Modify `handleCopyPage` (line 246-254): emit `copy_page_md` on success, `copy_failed` in catch.
  - Modify `handleCopySection` (line 259-279): emit `copy_section_md` on success, `copy_failed` in catch.
  - Modify the option click handler (line 501-506): emit intent events for `open-chatgpt`, `open-claude`, `connect-mcp-docs` via a lookup map.

- **Modify** `cypress/e2e/content/llm-format-selector.cy.js`
  - Append a `describe('GA4 events (ai_format_action)', ...)` block at the end with one `it` per action (6 total: 4 success + 1 failure + 1 product-derivation check on a non-core path).
  - Stub `window.gtag` in `onBeforeLoad`; stub `navigator.clipboard.writeText` to control success/failure paths.

- **Read-only references**
  - `assets/js/utils/product-mappings.ts:125` — `getProductKeyFromPath(path: string): string | null`
  - `assets/js/code-controls.js:152-165` — gtag wiring template
  - `assets/js/influxdb-version-detector.ts:163-170` — `Window.gtag` type declaration template

---

## Tasks

### Task 1: Add failing Cypress test for `copy_page_md`

**Files:**
- Modify: `cypress/e2e/content/llm-format-selector.cy.js` (append at end, before final `});`)

- [ ] **Step 1: Append the GA4 describe block**

Open `cypress/e2e/content/llm-format-selector.cy.js`. Locate the final closing `});` of the top-level `describe('LLM Format Selector', () => { ... })` block. Insert this nested block immediately before it:

```js
describe('GA4 events (ai_format_action)', () => {
  function stubGtag(win) {
    win.gtag = cy.stub().as('gtag');
  }

  function stubClipboardSuccess(win) {
    cy.stub(win.navigator.clipboard, 'writeText').resolves();
  }

  it('emits copy_page_md on successful page copy', () => {
    cy.visit(LEAF_PAGE_URL, { onBeforeLoad: stubGtag });
    cy.window().then(stubClipboardSuccess);
    cy.get('[data-component="format-selector"] button').click();
    cy.get('[data-option="copy-page"]').click();
    cy.get('@gtag').should(
      'have.been.calledWith',
      'event',
      'ai_format_action',
      Cypress.sinon.match({
        action: 'copy_page_md',
        page_type: 'leaf',
        page_path: LEAF_PAGE_URL,
        product: 'influxdb3-core',
      })
    );
  });
});
```

- [ ] **Step 2: Run the new test to verify it fails**

Run:

```sh
node cypress/support/run-e2e-specs.js --spec "cypress/e2e/content/llm-format-selector.cy.js" --grep "emits copy_page_md"
```

Expected: FAIL — gtag stub is never invoked because `emitFormatEvent` does not exist yet.

> If `--grep` is not honored by `run-e2e-specs.js`, omit it; the test still fails for the same reason among the wider suite.

- [ ] **Step 3: Commit the failing test**

```sh
git add cypress/e2e/content/llm-format-selector.cy.js
git commit -m "test(format-selector): add failing GA4 copy_page_md assertion"
```

---

### Task 2: Add `Window.gtag` type and `emitFormatEvent` helper

**Files:**
- Modify: `assets/js/components/format-selector.ts`

- [ ] **Step 1: Add the global gtag type declaration**

Locate the top of `assets/js/components/format-selector.ts` (after the file's header comment, before the `interface FormatSelectorConfig` block — around line 19). Insert:

```ts
declare global {
  interface Window {
    gtag?: (
      command: 'event',
      eventName: string,
      eventParams?: Record<string, unknown>
    ) => void;
  }
}
```

- [ ] **Step 2: Add the product-mappings import**

Add this import directly below the global declaration:

```ts
import { getProductKeyFromPath } from '../utils/product-mappings.js';
```

> Note the `.js` extension: this file is consumed by Hugo's esbuild pipeline which expects ESM extensions on relative imports. See `assets/js/code-controls.js` for precedent.

- [ ] **Step 3: Add the emitFormatEvent helper inside the FormatSelector closure**

Locate `function initConfig(): void {` (around line 88). Immediately above it (inside the `FormatSelector` function body, after the `if (!button || !dropdownMenu) { ... return; }` guard), insert:

```ts
function emitFormatEvent(
  action: string,
  extras: Record<string, unknown> = {}
): void {
  if (typeof window.gtag === 'undefined') return;
  const pagePath = window.location.pathname;
  window.gtag('event', 'ai_format_action', {
    action,
    page_type: config.pageType,
    page_path: pagePath,
    product: getProductKeyFromPath(pagePath) ?? null,
    ...extras,
  });
}
```

- [ ] **Step 4: Type-check the change**

Run:

```sh
yarn build:ts
```

Expected: clean exit, no errors.

- [ ] **Step 5: Commit**

```sh
git add assets/js/components/format-selector.ts
git commit -m "feat(format-selector): add emitFormatEvent helper for GA4"
```

---

### Task 3: Wire `copy_page_md` + `copy_failed` into `handleCopyPage`

**Files:**
- Modify: `assets/js/components/format-selector.ts:246-254`

- [ ] **Step 1: Replace `handleCopyPage` with the instrumented version**

Replace the existing function body (lines 246-254) with:

```ts
async function handleCopyPage(): Promise<void> {
  try {
    const markdown = await fetchMarkdownContent();
    await copyToClipboard(markdown);
    emitFormatEvent('copy_page_md');
    closeDropdown();
  } catch (error) {
    console.error('Failed to copy page:', error);
    emitFormatEvent('copy_failed', { action_target: 'copy_page_md' });
  }
}
```

- [ ] **Step 2: Run the Cypress test from Task 1 to verify it now passes**

```sh
node cypress/support/run-e2e-specs.js --spec "cypress/e2e/content/llm-format-selector.cy.js" --grep "emits copy_page_md"
```

Expected: PASS.

- [ ] **Step 3: Commit**

```sh
git add assets/js/components/format-selector.ts
git commit -m "feat(format-selector): emit copy_page_md and copy_failed GA4 events"
```

---

### Task 4: Add failing test + wire `copy_section_md` + `copy_failed` into `handleCopySection`

**Files:**
- Modify: `cypress/e2e/content/llm-format-selector.cy.js`
- Modify: `assets/js/components/format-selector.ts:259-279`

- [ ] **Step 1: Add the failing section test to the GA4 describe block**

Inside the `describe('GA4 events (ai_format_action)', ...)` block from Task 1, append:

```js
  it('emits copy_section_md on successful section copy', () => {
    cy.visit(SMALL_SECTION_URL, { onBeforeLoad: stubGtag });
    cy.intercept('GET', '**/index.section.md', { body: '# stub\n' });
    cy.window().then(stubClipboardSuccess);
    cy.get('[data-component="format-selector"] button').click();
    cy.get('[data-option="copy-section"]').click();
    cy.get('@gtag').should(
      'have.been.calledWith',
      'event',
      'ai_format_action',
      Cypress.sinon.match({
        action: 'copy_section_md',
        page_type: 'branch',
      })
    );
  });

  it('emits copy_failed when clipboard write rejects', () => {
    cy.visit(LEAF_PAGE_URL, { onBeforeLoad: stubGtag });
    cy.window().then((win) => {
      cy.stub(win.navigator.clipboard, 'writeText').rejects(
        new Error('denied')
      );
    });
    cy.get('[data-component="format-selector"] button').click();
    cy.get('[data-option="copy-page"]').click();
    cy.get('@gtag').should(
      'have.been.calledWith',
      'event',
      'ai_format_action',
      Cypress.sinon.match({
        action: 'copy_failed',
        action_target: 'copy_page_md',
      })
    );
  });
```

- [ ] **Step 2: Run the new tests to verify they fail**

```sh
node cypress/support/run-e2e-specs.js --spec "cypress/e2e/content/llm-format-selector.cy.js"
```

Expected: FAIL — `copy_section_md` never emitted; `copy_failed` already passes for page-copy because Task 3 wired it (note this in commit if so — the section/failure test pair is bundled because they share the catch-path code).

- [ ] **Step 3: Replace `handleCopySection` with the instrumented version**

Replace the existing function body (lines 259-279) with:

```ts
async function handleCopySection(): Promise<void> {
  try {
    const url = config.sectionMarkdownUrl || config.markdownUrl;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch section markdown: ${response.statusText}`
      );
    }

    const markdown = await response.text();
    await copyToClipboard(markdown);
    emitFormatEvent('copy_section_md');
    showNotification('Section copied to clipboard', 'success');
    closeDropdown();
  } catch (error) {
    console.error('Failed to copy section:', error);
    emitFormatEvent('copy_failed', { action_target: 'copy_section_md' });
    showNotification('Failed to copy section', 'error');
  }
}
```

- [ ] **Step 4: Run tests again to verify both pass**

```sh
node cypress/support/run-e2e-specs.js --spec "cypress/e2e/content/llm-format-selector.cy.js"
```

Expected: all three GA4 tests so far (`copy_page_md`, `copy_section_md`, `copy_failed`) PASS.

- [ ] **Step 5: Commit**

```sh
git add assets/js/components/format-selector.ts cypress/e2e/content/llm-format-selector.cy.js
git commit -m "feat(format-selector): emit copy_section_md and copy_failed GA4 events"
```

---

### Task 5: Wire `open_chatgpt`, `open_claude`, `connect_mcp` via single click chokepoint

**Files:**
- Modify: `cypress/e2e/content/llm-format-selector.cy.js`
- Modify: `assets/js/components/format-selector.ts` (the option click handler near line 501)

- [ ] **Step 1: Add failing tests for the three external-link events**

Append to the `describe('GA4 events (ai_format_action)', ...)` block:

```js
  it('emits open_chatgpt when ChatGPT option is clicked', () => {
    cy.visit(LEAF_PAGE_URL, { onBeforeLoad: stubGtag });
    cy.get('[data-component="format-selector"] button').click();
    cy.get('[data-option="open-chatgpt"]').then(($el) => {
      // Prevent actual navigation; we only care about the emit.
      $el.on('click', (e) => e.preventDefault());
    });
    cy.get('[data-option="open-chatgpt"]').click();
    cy.get('@gtag').should(
      'have.been.calledWith',
      'event',
      'ai_format_action',
      Cypress.sinon.match({ action: 'open_chatgpt' })
    );
  });

  it('emits open_claude when Claude option is clicked', () => {
    cy.visit(LEAF_PAGE_URL, { onBeforeLoad: stubGtag });
    cy.get('[data-component="format-selector"] button').click();
    cy.get('[data-option="open-claude"]').then(($el) => {
      $el.on('click', (e) => e.preventDefault());
    });
    cy.get('[data-option="open-claude"]').click();
    cy.get('@gtag').should(
      'have.been.calledWith',
      'event',
      'ai_format_action',
      Cypress.sinon.match({ action: 'open_claude' })
    );
  });
```

> The MCP option is conditional on `config.mcpDocsUrl` being set. If `LEAF_PAGE_URL` doesn't have a docs MCP server configured, skip that test or use a page that does. Confirm by inspecting the rendered button list with `cy.get('[data-option="connect-mcp-docs"]').should('exist')` and conditionally adding the test. If unsure, run the existing test suite to see which pages render MCP. **Do not invent a test that asserts against a non-rendered element.**

- [ ] **Step 2: Verify the new tests fail**

```sh
node cypress/support/run-e2e-specs.js --spec "cypress/e2e/content/llm-format-selector.cy.js"
```

Expected: the two new tests FAIL — `gtag` stub never invoked for these options.

- [ ] **Step 3: Add the action-event map and instrument the click handler**

In `assets/js/components/format-selector.ts`, locate the option click handler inside `renderOptions` (around line 501):

```ts
optionEl.addEventListener('click', (e) => {
  if (!option.href) {
    e.preventDefault();
    option.action();
  }
});
```

Replace it with:

```ts
optionEl.addEventListener('click', (e) => {
  const intentEvent = INTENT_EVENT_MAP[option.dataAttribute];
  if (intentEvent) {
    emitFormatEvent(intentEvent);
  }
  if (!option.href) {
    e.preventDefault();
    option.action();
  }
});
```

Then add the lookup map at the top of the `FormatSelector` function body, near `emitFormatEvent`:

```ts
const INTENT_EVENT_MAP: Record<string, string> = {
  'open-chatgpt': 'open_chatgpt',
  'open-claude': 'open_claude',
  'connect-mcp-docs': 'connect_mcp',
};
```

> Copy options (`copy-page`, `copy-section`) are intentionally omitted from this map: their events fire from inside the async handlers based on the actual outcome, not on click intent. Adding them here would double-count.

- [ ] **Step 4: Run all GA4 tests to verify everything passes**

```sh
node cypress/support/run-e2e-specs.js --spec "cypress/e2e/content/llm-format-selector.cy.js"
```

Expected: all GA4 tests PASS; existing non-GA4 tests in the spec continue to PASS.

- [ ] **Step 5: Commit**

```sh
git add assets/js/components/format-selector.ts cypress/e2e/content/llm-format-selector.cy.js
git commit -m "feat(format-selector): emit open_chatgpt, open_claude, connect_mcp events"
```

---

### Task 6: Verify in a real browser and commit final state

**Files:** none modified.

- [ ] **Step 1: Start Hugo and exercise the dropdown manually**

```sh
npx hugo server
```

Open `http://localhost:1313/influxdb3/core/get-started/setup/`. Open DevTools Console.

- [ ] **Step 2: Stub gtag in the console and exercise each option**

In the browser console:

```js
window.gtag = (...args) => console.log('[gtag]', ...args);
```

Then click the "Copy page for AI" button, open the dropdown, and click each option in turn. Verify the console logs one `ai_format_action` event per click with the expected `action`, `page_type: 'leaf'`, `page_path`, and `product: 'influxdb3-core'`.

- [ ] **Step 3: Repeat on a branch (section) page**

Navigate to `http://localhost:1313/influxdb3/core/get-started/`. Re-stub gtag (page reload wipes the override). Open the dropdown and click "Copy section for AI". Verify the event reports `action: 'copy_section_md'`, `page_type: 'branch'`.

- [ ] **Step 4: Confirm no console errors and no double-emits**

Especially: clicking "Copy page" should produce exactly one `ai_format_action` event (the `copy_page_md` from success), not two. If you see two, the click chokepoint is double-emitting — re-check Task 5 Step 3 (the map must not include `copy-page` / `copy-section`).

- [ ] **Step 5: Stop Hugo, run the full Cypress GA4 suite one last time**

```sh
node cypress/support/run-e2e-specs.js --spec "cypress/e2e/content/llm-format-selector.cy.js"
```

Expected: all tests in the spec PASS.

- [ ] **Step 6: Verify nothing else regressed**

Run the broader Cypress suite (or at minimum the spec files that touch overlapping UI):

```sh
node cypress/support/run-e2e-specs.js --spec "cypress/e2e/content/code-controls.cy.js,cypress/e2e/content/llm-format-selector.cy.js"
```

Expected: all PASS.

- [ ] **Step 7: Push the branch and open the PR**

```sh
git push -u origin chore-llm-request-metrics
gh pr create --title "feat(format-selector): GA4 ai_format_action events" --body "$(cat <<'EOF'
## Summary

Wires `ai_format_action` GA4 events into the format-selector dropdown. Six action values (`copy_page_md`, `copy_section_md`, `open_chatgpt`, `open_claude`, `connect_mcp`, `copy_failed`) covering all five dropdown options plus a failure path.

Part A of a two-part series. Part B (S3 access logs → InfluxDB 3 pipeline) ships on a separate branch.

## Test plan

- [ ] Cypress GA4 suite in `cypress/e2e/content/llm-format-selector.cy.js` passes locally
- [ ] Manual browser verification (with `window.gtag` stub in console) on a leaf page and a branch page
- [ ] No double-emit on copy success
- [ ] Existing format-selector and code-controls Cypress specs continue to pass
EOF
)"
```

---

## Self-review checklist

- [x] Spec requirement: GA4 event name `ai_format_action` — Tasks 2-5
- [x] Spec requirement: 6 action values — Tasks 3, 4, 5 cover all six
- [x] Spec requirement: `page_type`, `page_path`, `product` fields — Task 2 helper
- [x] Spec requirement: `if (typeof window.gtag !== 'undefined')` guard — Task 2 helper line 1
- [x] Spec requirement: derive product via existing `product-mappings` — Task 2 Step 2 import + Step 3 call
- [x] Spec requirement: Cypress e2e verifies each option — Tasks 1, 4, 5
- [x] Spec requirement: stubs `window.gtag` — Task 1 helper
- [x] No `TODO` placeholders in implementation steps
- [x] All function names, data-attribute strings, and event names are consistent across tasks
- [x] Out-of-scope items (Part B pipeline, dashboards, Measurement Protocol beacons) are not referenced in any task

## Out of scope (deferred to Part B branch)

- S3 / CloudFront log ingest
- DuckDB query
- InfluxDB 3 write
- `data/ua-classes.yml`
- `.github/workflows/llm-request-metrics.yml`
- Schema / cardinality budget
- Watermark / state management

These items live in the original brainstorm (preserved in this branch's git history one commit prior to this plan) and will move to their own implementation plan on a new branch.
