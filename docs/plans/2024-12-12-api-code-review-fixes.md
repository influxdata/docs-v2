# API Code Review Fixes Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix code review violations by extracting inline JavaScript from rapidoc.html into a TypeScript component and removing unused Scalar renderer code.

**Architecture:** Create a new `api-rapidoc.ts` TypeScript component following the established component pattern (same as `rapidoc-mini.ts`). The component handles theme synchronization, shadow DOM manipulation, and MutationObserver setup. Remove the Scalar renderer, api-tabs component, and associated partials since they're no longer used.

**Tech Stack:** TypeScript, Hugo templates, SCSS, Cypress

***

## Task 1: Create api-rapidoc.ts TypeScript Component

**Files:**

- Create: `assets/js/components/api-rapidoc.ts`

**Step 1: Create the TypeScript component file**

Create `assets/js/components/api-rapidoc.ts` with the following content:

```typescript
/**
 * RapiDoc API Documentation Component
 *
 * Initializes the full RapiDoc renderer with theme synchronization.
 * This is the component version of the inline JavaScript from rapidoc.html.
 *
 * Features:
 * - Theme detection from Hugo's stylesheet toggle system
 * - Automatic theme synchronization when user toggles dark/light mode
 * - Shadow DOM manipulation to hide unwanted UI elements
 * - CSS custom property injection for styling
 *
 * Usage:
 * <div data-component="api-rapidoc" data-spec-url="/path/to/spec.yml"></div>
 *
 * The component expects a <rapi-doc> element to already exist in the container
 * (created by Hugo template) or will wait for it to be added.
 */

import { getPreference } from '../services/local-storage.js';

interface ComponentOptions {
  component: HTMLElement;
}

interface ThemeColors {
  theme: 'light' | 'dark';
  bgColor: string;
  textColor: string;
  headerColor: string;
  primaryColor: string;
  navBgColor: string;
  navTextColor: string;
  navHoverBgColor: string;
  navHoverTextColor: string;
  navAccentColor: string;
  codeTheme: string;
}

type CleanupFn = () => void;

/**
 * Get current theme from localStorage (source of truth for Hugo theme system)
 */
function getTheme(): 'dark' | 'light' {
  const theme = getPreference('theme');
  return theme === 'dark' ? 'dark' : 'light';
}

/**
 * Get theme colors matching Hugo SCSS variables
 */
function getThemeColors(isDark: boolean): ThemeColors {
  if (isDark) {
    return {
      theme: 'dark',
      bgColor: '#14141F',        // $grey10 ($article-bg in dark theme)
      textColor: '#D4D7DD',      // $g15-platinum
      headerColor: '#D4D7DD',
      primaryColor: '#a0a0ff',
      navBgColor: '#1a1a2a',
      navTextColor: '#D4D7DD',
      navHoverBgColor: '#252535',
      navHoverTextColor: '#ffffff',
      navAccentColor: '#a0a0ff',
      codeTheme: 'monokai',
    };
  }

  return {
    theme: 'light',
    bgColor: '#ffffff',          // $g20-white
    textColor: '#2b2b2b',
    headerColor: '#020a47',      // $br-dark-blue
    primaryColor: '#020a47',
    navBgColor: '#f7f8fa',
    navTextColor: '#2b2b2b',
    navHoverBgColor: '#e8e8f0',
    navHoverTextColor: '#020a47',
    navAccentColor: '#020a47',
    codeTheme: 'prism',
  };
}

/**
 * Apply theme to RapiDoc element
 */
function applyTheme(rapiDoc: HTMLElement): void {
  const isDark = getTheme() === 'dark';
  const colors = getThemeColors(isDark);

  rapiDoc.setAttribute('theme', colors.theme);
  rapiDoc.setAttribute('bg-color', colors.bgColor);
  rapiDoc.setAttribute('text-color', colors.textColor);
  rapiDoc.setAttribute('header-color', colors.headerColor);
  rapiDoc.setAttribute('primary-color', colors.primaryColor);
  rapiDoc.setAttribute('nav-bg-color', colors.navBgColor);
  rapiDoc.setAttribute('nav-text-color', colors.navTextColor);
  rapiDoc.setAttribute('nav-hover-bg-color', colors.navHoverBgColor);
  rapiDoc.setAttribute('nav-hover-text-color', colors.navHoverTextColor);
  rapiDoc.setAttribute('nav-accent-color', colors.navAccentColor);
  rapiDoc.setAttribute('code-theme', colors.codeTheme);
}

/**
 * Set custom CSS properties on RapiDoc element
 */
function setInputBorderStyles(rapiDoc: HTMLElement): void {
  rapiDoc.style.setProperty('--border-color', '#00A3FF');
}

/**
 * Hide unwanted elements in RapiDoc shadow DOM
 */
function hideExpandCollapseControls(rapiDoc: HTMLElement): void {
  const maxAttempts = 10;
  let attempts = 0;

  const tryHide = (): void => {
    attempts++;

    try {
      const shadowRoot = rapiDoc.shadowRoot;
      if (!shadowRoot) {
        if (attempts < maxAttempts) {
          setTimeout(tryHide, 500);
        }
        return;
      }

      // Find all elements and hide those containing "Expand all" / "Collapse all"
      const allElements = shadowRoot.querySelectorAll('*');
      let hiddenCount = 0;

      allElements.forEach((element) => {
        const text = element.textContent || '';

        if (text.includes('Expand all') || text.includes('Collapse all')) {
          (element as HTMLElement).style.display = 'none';
          if (element.parentElement) {
            element.parentElement.style.display = 'none';
          }
          hiddenCount++;
        }
      });

      // Hide "Overview" headings
      const headings = shadowRoot.querySelectorAll('h1, h2, h3, h4');
      headings.forEach((heading) => {
        const text = (heading.textContent || '').trim();
        if (text.includes('Overview')) {
          (heading as HTMLElement).style.display = 'none';
          hiddenCount++;
        }
      });

      // Inject CSS as backup
      const style = document.createElement('style');
      style.textContent = `
        .section-gap.section-tag,
        [id*="overview"],
        .regular-font.section-gap:empty,
        h1:empty, h2:empty, h3:empty {
          display: none !important;
        }
      `;
      shadowRoot.appendChild(style);

      if (hiddenCount === 0 && attempts < maxAttempts) {
        setTimeout(tryHide, 500);
      }
    } catch (e) {
      if (attempts < maxAttempts) {
        setTimeout(tryHide, 500);
      }
    }
  };

  setTimeout(tryHide, 500);
}

/**
 * Watch for theme changes via stylesheet toggle
 */
function watchThemeChanges(rapiDoc: HTMLElement): CleanupFn {
  const handleThemeChange = (): void => {
    applyTheme(rapiDoc);
  };

  // Watch stylesheet disabled attribute changes (Hugo theme.js toggles this)
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (
        mutation.type === 'attributes' &&
        mutation.target instanceof HTMLLinkElement &&
        mutation.target.title?.includes('theme')
      ) {
        handleThemeChange();
        break;
      }
      // Also watch data-theme changes as fallback
      if (mutation.attributeName === 'data-theme') {
        handleThemeChange();
      }
    }
  });

  // Observe head for stylesheet changes
  observer.observe(document.head, {
    attributes: true,
    attributeFilter: ['disabled'],
    subtree: true,
  });

  // Observe documentElement for data-theme changes
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });

  return (): void => {
    observer.disconnect();
  };
}

/**
 * Initialize RapiDoc component
 */
export default function ApiRapiDoc({
  component,
}: ComponentOptions): CleanupFn | void {
  // Find the rapi-doc element inside the container
  const rapiDoc = component.querySelector('rapi-doc') as HTMLElement | null;

  if (!rapiDoc) {
    console.warn('[API RapiDoc] No rapi-doc element found in container');
    return;
  }

  // Apply initial theme
  applyTheme(rapiDoc);

  // Set custom CSS properties
  if (customElements && customElements.whenDefined) {
    customElements.whenDefined('rapi-doc').then(() => {
      setInputBorderStyles(rapiDoc);
      setTimeout(() => setInputBorderStyles(rapiDoc), 500);
    });
  } else {
    setInputBorderStyles(rapiDoc);
    setTimeout(() => setInputBorderStyles(rapiDoc), 500);
  }

  // Hide unwanted UI elements
  hideExpandCollapseControls(rapiDoc);

  // Watch for theme changes
  return watchThemeChanges(rapiDoc);
}
```

**Step 2: Verify the file was created correctly**

Run: `head -30 assets/js/components/api-rapidoc.ts`
Expected: File header and imports visible

**Step 3: Commit**

```bash
git add assets/js/components/api-rapidoc.ts
git commit -m "feat(api): Create api-rapidoc TypeScript component

Extract inline JavaScript from rapidoc.html into a proper TypeScript
component following the established component pattern."
```

***

## Task 2: Register api-rapidoc Component in main.js

**Files:**

- Modify: `assets/js/main.js:49-88`

**Step 1: Add import for ApiRapiDoc**

Add this import after line 52 (after RapiDocMini import):

```javascript
import ApiRapiDoc from './components/api-rapidoc.ts';
```

**Step 2: Register component in componentRegistry**

Add this entry in the componentRegistry object (after line 87, the 'rapidoc-mini' entry):

```javascript
  'api-rapidoc': ApiRapiDoc,
```

**Step 3: Verify changes**

Run: `grep -n "api-rapidoc\|ApiRapiDoc" assets/js/main.js`
Expected: Both the import and registry entry appear

**Step 4: Commit**

```bash
git add assets/js/main.js
git commit -m "feat(api): Register api-rapidoc component in main.js"
```

***

## Task 3: Update rapidoc.html to Use Component Pattern

**Files:**

- Modify: `layouts/partials/api/rapidoc.html`

**Step 1: Replace inline JavaScript with data-component attribute**

Replace the entire content of `layouts/partials/api/rapidoc.html` with:

```html
{{/*
  RapiDoc API Documentation Renderer

  Primary API documentation renderer using RapiDoc with "Mix your own HTML" slots.
  See: https://rapidocweb.com/examples.html

  Required page params:
  - staticFilePath: Path to the OpenAPI specification file

  Optional page params:
  - operationId: Specific operation to display (renders only that operation)
  - tag: Tag to filter operations by

  RapiDoc slots available for custom content:
  - slot="header" - Custom header
  - slot="footer" - Custom footer
  - slot="overview" - Custom overview content
  - slot="auth" - Custom authentication section
  - slot="nav-logo" - Custom navigation logo
*/}}

{{ $specPath := .Params.staticFilePath }}
{{ $specPathJSON := replace $specPath ".yaml" ".json" | replace ".yml" ".json" }}
{{ $operationId := .Params.operationId | default "" }}
{{ $tag := .Params.tag | default "" }}

{{/* Machine-readable links for AI agent discovery */}}
{{ if $specPath }}
<link rel="alternate" type="application/x-yaml" href="{{ $specPath | absURL }}" title="OpenAPI Specification (YAML)" />
<link rel="alternate" type="application/json" href="{{ $specPathJSON | absURL }}" title="OpenAPI Specification (JSON)" />
{{ end }}

<div class="api-reference-wrapper" data-component="api-rapidoc">
  {{/* RapiDoc component with slot-based customization */}}
  <rapi-doc
    id="api-doc"
    spec-url="{{ $specPath }}"
    theme="light"
    bg-color="#ffffff"
    text-color="#2b2b2b"
    header-color="#020a47"
    primary-color="#00A3FF"
    nav-bg-color="#f7f8fa"
    nav-text-color="#2b2b2b"
    nav-hover-bg-color="#e8e8f0"
    nav-hover-text-color="#020a47"
    nav-accent-color="#020a47"
    regular-font="Proxima Nova, -apple-system, BlinkMacSystemFont, sans-serif"
    mono-font="IBM Plex Mono, Monaco, Consolas, monospace"
    font-size="large"
    render-style="view"
    layout="column"
    schema-style="table"
    default-schema-tab="model"
    response-area-height="400px"
    show-header="false"
    show-info="false"
    show-side-nav="false"
    show-components="false"
    allow-authentication="true"
    allow-try="false"
    allow-spec-url-load="false"
    allow-spec-file-load="false"
    allow-server-selection="false"
    allow-search="false"
    fill-request-fields-with-example="true"
    persist-auth="false"
    {{ if $operationId }}goto-path="op/{{ $operationId }}"{{ end }}
    {{ if $tag }}match-paths="tag/{{ $tag }}"{{ end }}
  >
    {{/* Custom overview slot - Hugo page content */}}
    {{ with .Content }}
    <div slot="overview">
      {{ . }}
    </div>
    {{ end }}

    {{/* Custom examples from frontmatter */}}
    {{ with .Params.examples }}
    <div slot="footer" class="api-custom-examples">
      <h3>Examples</h3>
      {{ range . }}
      <div class="api-example">
        <h4>{{ .title }}</h4>
        {{ with .description }}<p>{{ . | markdownify }}</p>{{ end }}
        <pre><code class="language-{{ .lang | default "bash" }}">{{ .code }}</code></pre>
      </div>
      {{ end }}
    </div>
    {{ end }}
  </rapi-doc>
</div>

{{/* Load RapiDoc from CDN */}}
<script type="module" src="https://unpkg.com/rapidoc/dist/rapidoc-min.js"></script>

<style>
.api-reference-wrapper {
  width: 100%;
}

rapi-doc {
  width: 100%;
  min-height: 600px;
  display: block;
  /* Override RapiDoc's internal font sizes to match Hugo docs */
  --font-size-small: 15px;
  --font-size-mono: 15px;
  --font-size-regular: 17px;
  /* Match Hugo theme backgrounds - light mode default */
  --bg: #ffffff;
  --bg2: #f7f8fa;
  --bg3: #eef0f3;
  /* Input field border styling - subtle with transparency */
  --border-color: rgba(0, 163, 255, 0.25);
  --light-border-color: rgba(0, 163, 255, 0.15);
  /* HTTP method colors - lighter palette for light theme */
  --blue: #00A3FF;        /* $b-pool - GET */
  --green: #34BB55;       /* $gr-rainforest - POST */
  --orange: #FFB94A;      /* $y-pineapple - PUT (distinct from red) */
  --red: #F95F53;         /* $r-curacao - DELETE */
  --purple: #9b2aff;      /* $br-new-purple - PATCH */
}

/* Dark mode overrides - match Hugo $grey10: #14141F */
[data-theme="dark"] rapi-doc,
html:has(link[title="dark-theme"]:not([disabled])) rapi-doc {
  --bg: #14141F;
  /* Subtle border colors for dark mode with transparency */
  --border-color: rgba(0, 163, 255, 0.35);
  --light-border-color: rgba(0, 163, 255, 0.2);
  --bg2: #1a1a2a;
  --bg3: #252535;
  --fg: #D4D7DD;
  --fg2: #c8ccd2;
  --fg3: #b0b4ba;
  /* HTTP method colors - darker palette for dark theme */
  --blue: #066FC5;        /* $b-ocean - GET */
  --green: #009F5F;       /* $gr-viridian - POST */
  --orange: #FFC800;      /* $y-thunder - PUT (brighter for dark mode) */
  --red: #DC4E58;         /* $r-fire - DELETE */
  --purple: #8E1FC3;      /* $p-amethyst - PATCH */
}

/* Custom examples section styling */
.api-custom-examples {
  padding: 1.5rem;
  background: var(--bg2, #f7f8fa);
  border-radius: 4px;
  margin-top: 1rem;
}

.api-custom-examples h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.api-example {
  margin-bottom: 1.5rem;
}

.api-example:last-child {
  margin-bottom: 0;
}

.api-example h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
}

.api-example pre {
  margin: 0;
  padding: 1rem;
  background: var(--bg3, #eef0f3);
  border-radius: 4px;
  overflow-x: auto;
}
</style>
```

**Step 2: Verify the inline script is removed**

Run: `grep -c "<script>" layouts/partials/api/rapidoc.html`
Expected: `1` (only the CDN script tag, no inline JavaScript)

**Step 3: Commit**

```bash
git add layouts/partials/api/rapidoc.html
git commit -m "refactor(api): Replace inline JS with data-component in rapidoc.html

Remove ~230 lines of inline JavaScript and use the new api-rapidoc
TypeScript component via data-component attribute instead."
```

***

## Task 4: Remove Scalar Renderer and Related Code

**Files:**

- Delete: `layouts/partials/api/scalar.html`
- Delete: `assets/js/components/api-scalar.ts`
- Modify: `layouts/partials/api/renderer.html`
- Modify: `assets/js/main.js`
- Modify: `config/_default/hugo.yml`

**Step 1: Delete scalar.html partial**

Run: `rm layouts/partials/api/scalar.html`

**Step 2: Delete api-scalar.ts component**

Run: `rm assets/js/components/api-scalar.ts`

**Step 3: Simplify renderer.html to only use RapiDoc**

Replace the content of `layouts/partials/api/renderer.html` with:

```html
{{/*
  API Renderer

  Renders API documentation using RapiDoc.

  Required page params:
  - staticFilePath: Path to the OpenAPI specification file
*/}}

{{ partial "api/rapidoc.html" . }}
```

**Step 4: Remove ApiScalar from main.js**

Remove the import line:

```javascript
import ApiScalar from './components/api-scalar.ts';
```

Remove the registry entry:

```javascript
  'api-scalar': ApiScalar,
```

**Step 5: Remove apiRenderer config from hugo.yml**

Remove these lines from `config/_default/hugo.yml`:

```yaml
  # API documentation renderer: "scalar" (default) or "rapidoc"
  apiRenderer: rapidoc
```

**Step 6: Verify deletions**

Run: `ls layouts/partials/api/scalar.html assets/js/components/api-scalar.ts 2>&1`
Expected: "No such file or directory" for both

Run: `grep -c "ApiScalar\|api-scalar" assets/js/main.js`
Expected: `0`

**Step 7: Commit**

```bash
git add -A
git commit -m "refactor(api): Remove Scalar renderer and related code

Remove unused Scalar API documentation renderer:
- Delete layouts/partials/api/scalar.html
- Delete assets/js/components/api-scalar.ts
- Simplify renderer.html to only use RapiDoc
- Remove ApiScalar from main.js component registry
- Remove apiRenderer config option from hugo.yml"
```

***

## Task 5: Remove Deprecated api-tabs Component

**Files:**

- Delete: `assets/js/components/api-tabs.ts`
- Delete: `layouts/partials/api/tabs.html`
- Delete: `layouts/partials/api/tab-panels.html`
- Modify: `assets/js/main.js`

**Step 1: Delete api-tabs.ts**

Run: `rm assets/js/components/api-tabs.ts`

**Step 2: Delete tabs.html partial**

Run: `rm layouts/partials/api/tabs.html`

**Step 3: Delete tab-panels.html partial**

Run: `rm layouts/partials/api/tab-panels.html`

**Step 4: Remove ApiTabs from main.js**

Remove the import line:

```javascript
import ApiTabs from './components/api-tabs.ts';
```

Remove the registry entry:

```javascript
  'api-tabs': ApiTabs,
```

**Step 5: Verify deletions**

Run: `ls assets/js/components/api-tabs.ts layouts/partials/api/tabs.html layouts/partials/api/tab-panels.html 2>&1`
Expected: "No such file or directory" for all

Run: `grep -c "ApiTabs\|api-tabs" assets/js/main.js`
Expected: `0`

**Step 6: Commit**

```bash
git add -A
git commit -m "refactor(api): Remove deprecated api-tabs component

Remove unused tabs component and partials:
- Delete assets/js/components/api-tabs.ts
- Delete layouts/partials/api/tabs.html
- Delete layouts/partials/api/tab-panels.html
- Remove ApiTabs from main.js component registry

The new architecture renders content directly without tabs."
```

***

## Task 6: Update Cypress Tests

**Files:**

- Modify: `cypress/e2e/content/api-reference.cy.js`

**Step 1: Remove tab-related tests**

Remove the tests that reference tabs, tab-panels, and the 3-column layout tests that expect tabs. The tests for the basic API reference pages and RapiDoc Mini should remain.

Specifically, remove:

1. The `describe('API reference 3-column layout', ...)` block that tests tabs (lines 134-275)
2. Keep the basic API reference tests and RapiDoc Mini tests

**Step 2: Verify tests still work**

Run: `node cypress/support/run-e2e-specs.js --spec "cypress/e2e/content/api-reference.cy.js" content/influxdb3/core/api/_index.md`
Expected: Tests pass

**Step 3: Commit**

```bash
git add cypress/e2e/content/api-reference.cy.js
git commit -m "test(api): Remove deprecated tab-related tests

Remove tests for tabs and 3-column layout that no longer exist.
Keep basic API reference tests and RapiDoc Mini component tests."
```

***

## Task 7: Run Full Test Suite and Verify

**Files:**

- None (verification only)

**Step 1: Build Hugo site**

Run: `npx hugo --quiet`
Expected: Build succeeds without errors

**Step 2: Start Hugo server**

Run: `npx hugo server &`
Expected: Server starts on port 1313

**Step 3: Test API pages load correctly**

Run: `curl -s -o /dev/null -w "%{http_code}" http://localhost:1313/influxdb3/core/api/`
Expected: `200`

Run: `curl -s -o /dev/null -w "%{http_code}" http://localhost:1313/influxdb3/core/api/write/post/`
Expected: `200`

**Step 4: Run Cypress API tests**

Run: `node cypress/support/run-e2e-specs.js --spec "cypress/e2e/content/api-reference.cy.js" content/influxdb3/core/api/_index.md`
Expected: All tests pass

**Step 5: Stop Hugo server**

Run: `pkill -f "hugo server"`

**Step 6: Final commit if any fixes needed**

```bash
git status
# If any files need fixing, make changes and commit
```

***

## Summary

This plan:

1. Creates `api-rapidoc.ts` - a TypeScript component extracting \~230 lines of inline JS from rapidoc.html
2. Registers the new component in main.js
3. Updates rapidoc.html to use `data-component` pattern instead of inline scripts
4. Removes unused Scalar renderer code (scalar.html, api-scalar.ts, config option)
5. Removes deprecated tabs components (api-tabs.ts, tabs.html, tab-panels.html)
6. Updates Cypress tests to remove tab-related tests
7. Verifies everything works with Hugo build and test suite

Total files changed:

- 1 file created: `assets/js/components/api-rapidoc.ts`
- 5 files deleted: scalar.html, api-scalar.ts, api-tabs.ts, tabs.html, tab-panels.html
- 4 files modified: rapidoc.html, renderer.html, main.js, hugo.yml, api-reference.cy.js
