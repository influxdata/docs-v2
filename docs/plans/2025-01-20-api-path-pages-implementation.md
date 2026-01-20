# API Path Pages Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace operation-level API pages (`/api/v3/.../post/`) with path-level pages (`/api/v3/configure/token/admin/`) that show all HTTP methods for each endpoint.

**Architecture:** Modify the `generateOperationPages()` function to group operations by API path instead of creating one page per operation. Update RapiDoc Mini to use `match-type="includes"` for path-based filtering. Update Hugo templates to link to path pages with method anchors.

**Tech Stack:** TypeScript (generation scripts), Hugo templates, RapiDoc web component

***

## Task 1: Add match-type Support to RapiDoc Mini TypeScript

**Files:**

- Modify: `assets/js/components/rapidoc-mini.ts:200-210`

**Step 1: Write the failing test**

No automated tests exist for this component. Manual verification required.

**Step 2: Add match-type data attribute handling**

In `createRapiDocElement()` function, after the `match-paths` setAttribute call (around line 208), add match-type support:

```typescript
  // Set match-paths filter. With path-specific specs, this is just the method.
  // With tag-based specs, includes path + optional title for uniqueness.
  if (matchPaths) {
    element.setAttribute('match-paths', buildMatchPattern(matchPaths, title));
  }

  // Set match-type for filtering mode (default: 'includes' for substring matching)
  // This enables showing all methods for a path when matchPaths is just the path
  const matchType = container.dataset.matchType || 'includes';
  element.setAttribute('match-type', matchType);
```

**Step 3: Update the component initialization to read matchType**

In the `RapiDocMini` default export function (around line 280), add matchType extraction:

```typescript
    const specUrl = component.dataset.specUrl;
    const matchPaths = component.dataset.matchPaths;
    const matchType = component.dataset.matchType;
    const title = component.dataset.title;
```

Then pass it to `createRapiDocElement`:

```typescript
    const rapiDocElement = createRapiDocElement(specUrl, matchPaths, matchType, title);
```

**Step 4: Update createRapiDocElement signature**

Change the function signature to accept matchType:

```typescript
function createRapiDocElement(
  specUrl: string,
  matchPaths?: string,
  matchType?: string,
  title?: string
): HTMLElement {
```

And use it:

```typescript
  // Set match-type for filtering mode
  element.setAttribute('match-type', matchType || 'includes');
```

**Step 5: Build TypeScript**

Run: `cd /Users/ja/Documents/github/influxdata/docs/pr6622-api-uplift/docs-v2-pr6622 && yarn build:ts`

Expected: Build succeeds with no errors

**Step 6: Commit**

```bash
git add assets/js/components/rapidoc-mini.ts
git commit -m "feat(api): add match-type support to RapiDoc Mini component

Enables path-based filtering with match-type='includes' to show
all HTTP methods for an API path on a single page."
```

***

## Task 2: Create Path Page Hugo Layout

**Files:**

- Create: `layouts/api-path/path.html`

**Step 1: Create the layout directory**

Run: `mkdir -p layouts/api-path`

**Step 2: Create the path layout file**

```html
{{/*
  API Path Page Layout

  Shows all HTTP methods for a single API path using RapiDoc.
  Uses match-type="includes" to filter by path (not method).

  Required frontmatter:
  - title: The API path (e.g., "/api/v3/configure/token/admin")
  - specFile: Path to the path-specific OpenAPI spec
  - apiPath: The API path for RapiDoc filtering
  - operations: Array of operations with method, operationId, summary

  Optional frontmatter:
  - tag: Associated OpenAPI tag name
  - related: Array of related documentation paths
*/}}

{{ partial "header.html" . }}
{{ partial "topnav.html" . }}

<div class="page-wrapper">
  {{ partial "sidebar.html" . }}

  <div class="content-wrapper api-content">
    <div class="api-main">
      <article class="article article--content api-reference api-path-page" role="main">
        <header class="article--header">
          <h1 class="article--title"><code>{{ .Params.apiPath }}</code></h1>
          {{ with .Description }}
          <p class="article--description">{{ . }}</p>
          {{ end }}
        </header>

        {{/* Download OpenAPI spec button */}}
        {{ with .Params.specFile }}
        <div class="api-spec-actions">
          <a href="{{ . }}" class="btn api-spec-download" download>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M8 12L3 7h3V2h4v5h3L8 12z"/>
              <path d="M1 14h14v2H1v-2z"/>
            </svg>
            Download OpenAPI Spec
          </a>
        </div>
        {{ end }}

        {{/* Hugo page content shown as overview */}}
        {{ with .Content }}
        <section class="api-content-overview">
          {{ . }}
        </section>
        {{ end }}

        {{/* RapiDoc renders all methods for this path */}}
        {{ with .Params.specFile }}
        <section class="api-renderer-section">
          {{ partial "api/rapidoc-path.html" $ }}
        </section>
        {{ end }}

        {{/* Related documentation links */}}
        {{ partial "article/related.html" . }}

      </article>
    </div>

    {{/* Right sidebar: Methods TOC */}}
    {{ $operations := .Params.operations }}
    {{ if $operations }}
    <aside class="api-toc" data-component="api-toc">
      <h4 class="api-toc-header">METHODS</h4>
      <nav class="api-toc-nav">
        {{ range $operations }}
        <a href="#{{ lower .method }}" class="api-toc-link">
          <span class="api-method api-method--{{ lower .method }}">{{ upper .method }}</span>
          <span class="api-toc-summary">{{ .summary }}</span>
        </a>
        {{ end }}
      </nav>
    </aside>
    {{ end }}
  </div>
</div>

{{ partial "footer.html" . }}
```

**Step 3: Verify file created**

Run: `cat layouts/api-path/path.html | head -20`

Expected: Shows the layout header

**Step 4: Commit**

```bash
git add layouts/api-path/path.html
git commit -m "feat(api): add path page layout for multi-method endpoints

New layout shows all HTTP methods for an API path on one page
with a methods TOC in the right sidebar."
```

***

## Task 3: Create RapiDoc Path Partial

**Files:**

- Create: `layouts/partials/api/rapidoc-path.html`

**Step 1: Create the partial**

```html
{{/*
  RapiDoc Path - Multi-Method Path Renderer

  Renders all HTTP methods for an API path using RapiDoc.
  Uses match-type="includes" for path-based filtering.

  Required page params:
  - specFile: Path to the path-specific OpenAPI spec
  - apiPath: The API path to filter by (e.g., "/api/v3/configure/token/admin")
*/}}

{{ $specPath := .Params.specFile }}
{{ $apiPath := .Params.apiPath | default "" }}

{{/* Machine-readable links for AI agent discovery */}}
{{ if $specPath }}
{{ $specPathJSON := replace $specPath ".yaml" ".json" | replace ".yml" ".json" }}
<link rel="alternate" type="application/x-yaml" href="{{ $specPath | absURL }}" title="OpenAPI Specification (YAML)" />
<link rel="alternate" type="application/json" href="{{ $specPathJSON | absURL }}" title="OpenAPI Specification (JSON)" />
{{ end }}

{{/* Auth credentials modal */}}
<div class="api-auth-backdrop" hidden></div>
<div class="api-auth-popover" role="dialog" aria-label="API credentials" hidden>
  {{/* Content rendered by TypeScript component */}}
</div>

{{/*
  Determine supported auth schemes based on API path:
  - /api/v3/* endpoints: BearerAuthentication only
  - /api/v2/* endpoints: BearerAuthentication + TokenAuthentication
  - /write, /query (v1): All 4 schemes (Bearer, Token, Basic, Querystring)
*/}}
{{ $authSchemes := "bearer" }}
{{ if hasPrefix $apiPath "/api/v3" }}
  {{ $authSchemes = "bearer" }}
{{ else if hasPrefix $apiPath "/api/v2" }}
  {{ $authSchemes = "bearer,token" }}
{{ else if or (eq $apiPath "/write") (eq $apiPath "/query") }}
  {{ $authSchemes = "bearer,token,basic,querystring" }}
{{ end }}

{{/* Authentication info banner with trigger for credentials modal */}}
<div class="api-auth-info"
     data-component="api-auth-input"
     data-schemes="{{ $authSchemes }}">
  <svg class="api-auth-icon" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
  </svg>
  <span class="api-auth-status">This endpoint requires authentication.</span>
  <button type="button" class="api-auth-trigger">Set credentials</button>
</div>

{{/* RapiDoc component - uses path filtering with match-type="includes" */}}
<div class="api-reference-wrapper api-reference-path"
     data-component="rapidoc-mini"
     data-spec-url="{{ $specPath }}"
     data-match-paths="{{ $apiPath }}"
     data-match-type="includes">
  {{/* RapiDoc element created by TypeScript component */}}
</div>
```

**Step 2: Verify file created**

Run: `cat layouts/partials/api/rapidoc-path.html | head -20`

Expected: Shows the partial header

**Step 3: Commit**

```bash
git add layouts/partials/api/rapidoc-path.html
git commit -m "feat(api): add RapiDoc path partial for multi-method rendering

Uses match-type='includes' to show all HTTP methods for a path."
```

***

## Task 4: Modify Generation Script - Replace Operation Pages with Path Pages

**Files:**

- Modify: `api-docs/scripts/generate-openapi-articles.ts:580-680` (generateOperationPages function)

**Step 1: Rename and refactor generateOperationPages to generatePathPages**

Replace the `generateOperationPages` function with a new `generatePathPages` function that groups operations by path:

```typescript
/**
 * Generate standalone Hugo content pages for each API path
 *
 * Creates pages at path-based URLs like /api/v3/configure/token/admin/
 * that show all HTTP methods for that path using RapiDoc with match-type="includes".
 *
 * @param options - Generation options
 */
function generatePathPages(options: GenerateOperationPagesOptions): void {
  const { articlesPath, contentPath, pathSpecFiles } = options;
  const yaml = require('js-yaml');
  const articlesFile = path.join(articlesPath, 'articles.yml');

  if (!fs.existsSync(articlesFile)) {
    console.warn(`⚠️  Articles file not found: ${articlesFile}`);
    return;
  }

  // Read articles data
  const articlesContent = fs.readFileSync(articlesFile, 'utf8');
  const data = yaml.load(articlesContent) as {
    articles: Array<{
      path: string;
      fields: {
        name?: string;
        title?: string;
        tag?: string;
        isConceptual?: boolean;
        staticFilePath?: string;
        operations?: OperationMeta[];
        related?: string[];
      };
    }>;
  };

  if (!data.articles || !Array.isArray(data.articles)) {
    console.warn(`⚠️  No articles found in ${articlesFile}`);
    return;
  }

  // Collect all operations and group by API path
  const operationsByPath = new Map<string, {
    operations: OperationMeta[];
    tagName: string;
    tagSpecFile?: string;
  }>();

  for (const article of data.articles) {
    if (article.fields.isConceptual) continue;

    const operations = article.fields.operations || [];
    const tagSpecFile = article.fields.staticFilePath;
    const tagName = article.fields.tag || article.fields.name || '';

    for (const op of operations) {
      const existing = operationsByPath.get(op.path);
      if (existing) {
        // Add operation to existing path group
        existing.operations.push(op);
      } else {
        // Create new path group
        operationsByPath.set(op.path, {
          operations: [op],
          tagName,
          tagSpecFile,
        });
      }
    }
  }

  let pathCount = 0;

  // Generate a page for each unique API path
  for (const [apiPath, pathData] of operationsByPath) {
    // Build page path: api/{path}/
    // e.g., /api/v3/configure/token/admin -> api/v3/configure/token/admin/
    const pathSlug = apiPathToSlug(apiPath);
    const basePath = pathSlug.startsWith('api/') ? pathSlug : `api/${pathSlug}`;
    const pathDir = path.join(contentPath, basePath);
    const pathFile = path.join(pathDir, '_index.md');

    // Create directory if needed
    if (!fs.existsSync(pathDir)) {
      fs.mkdirSync(pathDir, { recursive: true });
    }

    // Use path-specific spec if available
    const pathSpecFile = pathSpecFiles?.get(apiPath);
    const specFile = pathSpecFile || pathData.tagSpecFile;

    // Sort operations by method for consistent display
    const sortedOps = [...pathData.operations].sort((a, b) => {
      const methodOrder = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
      return methodOrder.indexOf(a.method) - methodOrder.indexOf(b.method);
    });

    // Build title from first operation summary or path
    const primaryOp = sortedOps[0];
    const title = sortedOps.length === 1
      ? primaryOp.summary || `${primaryOp.method} ${apiPath}`
      : apiPath;

    // Build frontmatter
    const frontmatter: Record<string, unknown> = {
      title,
      description: `API reference for ${apiPath}`,
      type: 'api-path',
      layout: 'path',
      specFile,
      apiPath,
      tag: pathData.tagName,
      // Include all operations for TOC generation
      operations: sortedOps.map(op => ({
        method: op.method,
        operationId: op.operationId,
        summary: op.summary,
      })),
    };

    // Add compatibility version if all operations have the same one
    const compatVersions = new Set(sortedOps.map(op => op.compatVersion).filter(Boolean));
    if (compatVersions.size === 1) {
      frontmatter.compatVersion = [...compatVersions][0];
    }

    // Collect related links from all operations
    const relatedLinks: string[] = [];
    for (const op of sortedOps) {
      if (op.externalDocs?.url && !relatedLinks.includes(op.externalDocs.url)) {
        relatedLinks.push(op.externalDocs.url);
      }
    }
    if (relatedLinks.length > 0) {
      frontmatter.related = relatedLinks;
    }

    const pageContent = `---
${yaml.dump(frontmatter)}---
`;

    fs.writeFileSync(pathFile, pageContent);
    pathCount++;
  }

  console.log(
    `✓ Generated ${pathCount} path pages in ${contentPath}/api/`
  );
}
```

**Step 2: Update the call site in generateTagPagesFromArticleData**

Change the call from `generateOperationPages` to `generatePathPages`:

```typescript
  // Generate path pages for standalone URLs (replaces operation pages)
  generatePathPages({
    articlesPath,
    contentPath,
    pathSpecFiles,
  });
```

**Step 3: Build the TypeScript**

Run: `cd /Users/ja/Documents/github/influxdata/docs/pr6622-api-uplift/docs-v2-pr6622/api-docs/scripts && npx tsc`

Expected: Build succeeds

**Step 4: Commit**

```bash
git add api-docs/scripts/generate-openapi-articles.ts
git commit -m "feat(api): replace operation pages with path pages

Groups operations by API path instead of creating one page per method.
Each path page shows all HTTP methods using RapiDoc with match-type='includes'."
```

***

## Task 5: Update Tag Page Links to Use Path URLs

**Files:**

- Modify: `layouts/api/list.html:70-90`

**Step 1: Update the operation URL generation**

Change from method-based URLs to path-based URLs with anchors:

```html
            {{/* Build path page URL (without method) and anchor */}}
            {{ $apiBase := $.Parent.RelPermalink }}
            {{ $pathWithoutApiPrefix := .path | strings.TrimPrefix "/api" }}
            {{ $normalizedPath := $pathWithoutApiPrefix }}
            {{ if not (findRE `^/v\d+/` $pathWithoutApiPrefix) }}
              {{ $normalizedPath = printf "/v1%s" $pathWithoutApiPrefix }}
            {{ end }}
            {{ $normalizedPath = $normalizedPath | strings.TrimPrefix "/" }}
            {{/* Path page URL without method suffix */}}
            {{ $pathURL := printf "%s%s/" $apiBase $normalizedPath }}
            {{/* Anchor for specific method */}}
            {{ $methodAnchor := printf "#%s" (lower .method) }}
            <a href="{{ $pathURL }}{{ $methodAnchor }}" class="api-operation-card">
              <span class="api-method api-method--{{ lower .method }}">{{ upper .method }}</span>
              <code class="api-path">{{ .path }}</code>
              <span class="api-operation-summary">{{ .summary }}</span>
            </a>
```

**Step 2: Commit**

```bash
git add layouts/api/list.html
git commit -m "fix(api): update tag page links to use path URLs with anchors

Links now point to /api/v3/path/#method instead of /api/v3/path/method/"
```

***

## Task 6: Update All Endpoints Page Links

**Files:**

- Modify: `layouts/partials/api/all-endpoints-list.html:110-170`

**Step 1: Update all three URL generation blocks**

Apply the same change as Task 5 to all three URL generation blocks in the file (around lines 116, 138, and 166).

Replace each occurrence of:

```html
{{ $operationURL := printf "%s%s/%s/" $apiBase $normalizedPath (lower $op.method) }}
<a href="{{ $operationURL }}" class="api-operation-card">
```

With:

```html
{{ $pathURL := printf "%s%s/" $apiBase $normalizedPath }}
{{ $methodAnchor := printf "#%s" (lower $op.method) }}
<a href="{{ $pathURL }}{{ $methodAnchor }}" class="api-operation-card">
```

**Step 2: Commit**

```bash
git add layouts/partials/api/all-endpoints-list.html
git commit -m "fix(api): update all-endpoints links to use path URLs with anchors"
```

***

## Task 7: Remove Old Operation Layout

**Files:**

- Remove: `layouts/api-operation/operation.html`

**Step 1: Delete the old layout**

Run: `rm layouts/api-operation/operation.html && rmdir layouts/api-operation 2>/dev/null || true`

**Step 2: Commit**

```bash
git add -A layouts/api-operation/
git commit -m "chore(api): remove operation layout (replaced by path layout)"
```

***

## Task 8: Regenerate API Content for Core

**Files:**

- None (regeneration task)

**Step 1: Build the TypeScript**

Run: `cd /Users/ja/Documents/github/influxdata/docs/pr6622-api-uplift/docs-v2-pr6622 && yarn build:ts`

Expected: Build succeeds

**Step 2: Clean old generated content**

Run: `rm -rf content/influxdb3/core/api/v*/`

**Step 3: Regenerate API docs for Core**

Run: `cd /Users/ja/Documents/github/influxdata/docs/pr6622-api-uplift/docs-v2-pr6622/api-docs && node scripts/dist/generate-openapi-articles.js influxdb3_core`

Expected: Shows "Generated N path pages" (should be fewer than before)

**Step 4: Verify generated content**

Run: `find content/influxdb3/core/api -name "_index.md" -path "*/v3/*" | head -10`

Expected: Shows path-level directories (no `/post/`, `/get/` suffixes)

**Step 5: Commit generated content**

```bash
git add content/influxdb3/core/api/
git commit -m "chore(api): regenerate Core API with path-based pages"
```

***

## Task 9: Manual Testing - Verify RapiDoc Rendering

**Files:**

- None (testing task)

**Step 1: Start Hugo server**

Run: `cd /Users/ja/Documents/github/influxdata/docs/pr6622-api-uplift/docs-v2-pr6622 && npx hugo server --port 1315`

Wait for: "Web Server is available at <http://localhost:1315/>"

**Step 2: Test path page with single method**

Open: `http://localhost:1315/influxdb3/core/api/v3/configure/token/admin/`

Verify:

- Page loads without errors
- RapiDoc shows the POST method
- Title shows the API path
- Right sidebar shows "METHODS" with POST

**Step 3: Test path page with multiple methods (if any exist)**

Check: `grep -r "operations:" content/influxdb3/core/api/v3/ | head -5`

If a path has multiple methods, verify:

- All methods are displayed
- TOC shows all methods
- Clicking TOC link scrolls to that method

**Step 4: Test anchor links**

Open: `http://localhost:1315/influxdb3/core/api/v3/configure/token/admin/#post`

Verify: Page scrolls to POST operation

**Step 5: Test tag page links**

Open: `http://localhost:1315/influxdb3/core/api/auth-token/`

Click an operation card and verify:

- Links to path page with anchor
- Page scrolls to correct method

***

## Task 10: Regenerate API Content for Enterprise

**Files:**

- None (regeneration task)

**Step 1: Clean old generated content**

Run: `rm -rf content/influxdb3/enterprise/api/v*/`

**Step 2: Regenerate API docs**

Run: `cd /Users/ja/Documents/github/influxdata/docs/pr6622-api-uplift/docs-v2-pr6622/api-docs && node scripts/dist/generate-openapi-articles.js influxdb3_enterprise`

**Step 3: Commit generated content**

```bash
git add content/influxdb3/enterprise/api/
git commit -m "chore(api): regenerate Enterprise API with path-based pages"
```

***

## Task 11: Update Cypress Tests

**Files:**

- Modify: `cypress/e2e/content/api-reference.cy.js`

**Step 1: Update test subjects to use path URLs**

Replace any operation-level URLs like `/api/v3/configure/token/admin/post/` with path URLs like `/api/v3/configure/token/admin/`.

**Step 2: Run tests**

Run: `node cypress/support/run-e2e-specs.js --spec "cypress/e2e/content/api-reference.cy.js" content/influxdb3/core/api/_index.md`

Expected: Tests pass

**Step 3: Commit**

```bash
git add cypress/e2e/content/api-reference.cy.js
git commit -m "test(api): update tests for path-based API pages"
```

***

## Verification Checklist

After completing all tasks, verify:

- [ ] Path pages load at `/influxdb3/core/api/v3/configure/token/admin/`
- [ ] RapiDoc shows all methods for multi-method paths
- [ ] Right sidebar shows methods TOC
- [ ] Tag page links work with anchors
- [ ] All endpoints page links work with anchors
- [ ] No 404 errors on generated pages
- [ ] Cypress tests pass
- [ ] Old operation-level URLs return 404 (no redirects needed - not in production)
