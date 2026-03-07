# API Code Samples, Ask AI, & Client Library Integration Plan

## Context

The docs-v2 site recently migrated from RapiDoc to Hugo-native API templates. The current API pages render operation details (method, path, parameters, request body, response schemas) but have **no code samples**. This plan adds:

1. **curl request examples** generated at build time, displayed **inline within each operation** in the article flow
2. **Response body schema** for the successful response, shown inline below the request example
3. **"Ask AI about this example"** button on code blocks (API code samples first, then all code blocks site-wide)
4. **Client library integration** (phased — links first, code samples later)

## Design Decision: Inline Code Samples (Not Sidebar)

Code samples render **within the article flow** inside each operation block, not crammed into the right sidebar. The TOC stays at its current 200px width, unchanged.

Each operation block gets a code sample section at the bottom:

```
┌──────────────────────────────────────────────────┐
│ POST /api/v2/write                               │
│ ─────────────────                                │
│ Summary: Write data                              │
│ Description: ...                                 │
│                                                  │
│ Parameters                                       │
│ ┌────────┬──────┬────────────────────────┐       │
│ │ Name   │ Type │ Description            │       │
│ └────────┴──────┴────────────────────────┘       │
│                                                  │
│ Request Body                                     │
│ ┌────────────────────────────────────────┐       │
│ │ schema details...                      │       │
│ └────────────────────────────────────────┘       │
│                                                  │
│ Responses                                        │
│ ┌────────────────────────────────────────┐       │
│ │ 204 Success                            │       │
│ │ 400 Bad Request                        │       │
│ └────────────────────────────────────────┘       │
│                                                  │
│ ┌─ Example ──────────────────────────────┐       │
│ │ ┌──────────────────────────────────┐   │       │
│ │ │ curl --request POST \            │   │       │
│ │ │   "http://localhost:8181/..." \   │   │       │
│ │ │   --header "Authorization: ..." \│   │       │
│ │ │   --header "Content-Type: ..." \ │   │       │
│ │ │   --data-raw "mem,host=a v=1.0"  │   │       │
│ │ └──────────────────────────────────┘   │       │
│ │ [Ask AI about this example]            │       │
│ └────────────────────────────────────────┘       │
│                                                  │
│ ┌─ Client Libraries ────────────────────┐       │
│ │ [Python] [JavaScript] [Go] [Java] [C#]│       │
│ │ ┌──────────────────────────────────┐   │       │
│ │ │ from influxdb_client_3 import    │   │       │
│ │ │   InfluxDBClient3                │   │       │
│ │ │ client = InfluxDBClient3(...)    │   │       │
│ │ │ client.write(record="...")       │   │       │
│ │ └──────────────────────────────────┘   │       │
│ │ 📖 Full guide: Write data with         │       │
│ │    client libraries →                  │       │
│ └────────────────────────────────────────┘       │
│                                                  │
│ ┌─ Response ──────────────────────────────┐       │
│ │ 200 OK                                 │       │
│ │ ┌──────────────────────────────────┐   │       │
│ │ │ id        string                 │   │       │
│ │ │ name      string                 │   │       │
│ │ │ orgID     string                 │   │       │
│ │ │ ...                              │   │       │
│ │ └──────────────────────────────────┘   │       │
│ │ ──── or ────                           │       │
│ │ 204 No Content (empty body)            │       │
│ └────────────────────────────────────────┘       │
└──────────────────────────────────────────────────┘
```

---

## Phase 1: curl Examples in Article Flow (MVP)

### 1.1 Generate curl examples in build script

**Modify:** `api-docs/scripts/generate-openapi-articles.ts`

For each operation, generate a `curlExample` string and store it in the operation metadata. The build script already processes every operation to extract `operationId`, `method`, `path`, `summary`, and `tags` for frontmatter.

Add a function `generateCurlExample(operation, spec)` that:
1. Gets server URL from `spec.servers[0].url` (fallback: `http://localhost:8181`)
2. Builds the full URL with path parameter placeholders (e.g., `{bucketID}`)
3. Adds required query parameters with placeholder values
4. Adds `Authorization: Bearer $INFLUX_TOKEN` header
5. Adds `Content-Type` header when request body exists
6. Generates request body from:
   - `requestBody.content["application/json"].schema.example` (first choice)
   - `requestBody.content["application/json"].example` (second choice)
   - A minimal JSON object from `required` + `properties` with type-based defaults (fallback)
   - For `text/plain` content types (like line protocol), uses a sample line protocol string
7. Stores the complete curl command as a multiline string

The operation frontmatter entry becomes:
```yaml
operations:
  - operationId: PostWrite
    method: POST
    path: /api/v2/write
    summary: Write data
    tags: [Write]
    curlExample: |
      curl --request POST \
        "http://localhost:8181/api/v2/write?bucket=DATABASE_NAME&precision=ns" \
        --header "Authorization: Bearer $INFLUX_TOKEN" \
        --header "Content-Type: text/plain; charset=utf-8" \
        --data-raw "mem,host=host1 used_percent=23.43234543 1556896326"
```

### 1.2 Create curl display partial

**New file:** `layouts/partials/api/code-sample.html`

Renders the code sample block within the operation. Receives the operation dict (with `curlExample` field) and page context.

Output:
```html
<div class="api-code-sample">
  <div class="api-code-sample-header">
    <h5>Example</h5>
  </div>
  <div class="api-code-sample-body">
    <pre class="api-code-block"><code class="language-sh">{{ .operation.curlExample }}</code></pre>
    <a href="#" class="ask-ai-open api-code-ask-ai"
       data-query="Explain this API request: POST /api/v2/write - Write data">
      Ask AI about this example
    </a>
  </div>
</div>
```

### 1.3 Integrate into operation.html

**Modify:** `layouts/partials/api/operation.html`

After the Responses section, add:
```html
{{ with .operation.curlExample }}
  {{ partial "api/code-sample.html" (dict "operation" $.operation "context" $.context) }}
{{ end }}
```

### 1.4 Add styles

**New file:** `assets/styles/layouts/_api-code-samples.scss`

Key styles:
- `.api-code-sample`: full-width block within the operation, subtle border/background
- `.api-code-sample-header`: section header with "Example" title
- `.api-code-block`: dark background code block (always dark, regardless of theme), horizontal scroll for overflow
- `.api-code-ask-ai`: small link below code block, uses existing ask-ai-open styling conventions
- Smooth transition/animation when expanding

**Modify:** `assets/styles/styles-default.scss` — add import for `_api-code-samples.scss`.

---

## Phase 2: Successful Response Schema

### 2.1 Render the response body schema for the successful status code

Instead of generating response *examples*, show the **response body schema** for the successful response (typically `200` or `201`) directly below the curl request example.

This reuses the existing `responses.html` and `schema.html` partials, which already resolve `$ref` and render schema properties with types and descriptions. The difference is we show only the **successful response** in the code sample section (rather than all status codes, which are already shown in the Responses section above).

**Approach:**
- No build script changes needed — the schema is already in the OpenAPI spec, parsed at Hugo build time
- The `code-sample.html` partial reads the operation from the spec (already loaded by `tag-renderer.html`), finds the first 2xx response, and renders its body schema

**Modify:** `layouts/partials/api/code-sample.html`

Below the curl request, add:
```html
{{ $successResponse := false }}
{{ range $code, $resp := $opDef.responses }}
  {{ if hasPrefix $code "2" }}
    {{ $successResponse = $resp }}
  {{ end }}
{{ end }}

{{ with $successResponse }}
  {{ $content := .content | default dict }}
  {{ $jsonContent := index $content "application/json" | default dict }}
  {{ with $jsonContent.schema }}
    <div class="api-code-response">
      <h5>Response Body</h5>
      {{ partial "api/schema.html" (dict "schema" . "spec" $spec "level" 0) }}
    </div>
  {{ else }}
    <div class="api-code-response api-code-response--empty">
      <h5>Response</h5>
      <p>No response body</p>
    </div>
  {{ end }}
{{ end }}
```

This means for a `204 No Content` response (like the write endpoint), it shows "No response body." For a `200 OK` with a JSON schema (like list endpoints), it renders the full schema properties table — the same compact rendering already used in the Responses section but focused on just the success case.

**Note:** This requires passing the full operation definition and spec to `code-sample.html`, not just the frontmatter operation metadata. The partial needs access to the parsed spec to resolve the response schema. This is already available within `tag-renderer.html` where `code-sample.html` is called.

---

## Phase 3: "Ask AI about this example" — All Code Blocks

### 3.1 API code samples (included in Phase 1)

Already covered — each code sample gets an "Ask AI about this example" link using the existing `ask-ai-open` class and `data-query` attribute, leveraging the Kapa.ai widget.

### 3.2 Hugo render hook for all code blocks

**New file:** `layouts/_default/_markup/render-codeblock.html`

A Hugo markdown render hook that wraps every fenced code block with an optional "Ask AI" link:

```html
<div class="code-block-wrapper">
  <pre><code class="language-{{ .Type }}">{{ .Inner }}</code></pre>
  {{ if .Type }}
  <a href="#" class="ask-ai-open code-block-ask-ai"
     data-query="Explain this {{ .Type }} code example from the {{ $.Page.Title }} documentation: {{ .Inner | truncate 200 }}">
    Ask AI about this example
  </a>
  {{ end }}
</div>
```

Considerations:
- Only show on code blocks with a language identifier (skip plain text blocks)
- Truncate the code in the query to avoid overly long prompts
- Use page title for context
- Add subtle styling (small text, appears on hover or below the code block)
- Test with existing code block rendering (syntax highlighting, copy button, etc.)
- Must not break existing `pytest-codeblocks` annotations or other code block features

### 3.3 Add styles for code block Ask AI

**Modify:** `assets/styles/layouts/_api-code-samples.scss` (or create a separate partial)

```scss
.code-block-ask-ai {
  display: block;
  font-size: 0.75rem;
  color: $nav-item;
  text-decoration: none;
  padding: 0.25rem 0;
  opacity: 0.6;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
    color: $nav-item-hover;
  }
}
```

---

## Phase 4: Client Library Integration

Multi-language code tabs are **only for client libraries** — not general-purpose language examples. The curl example (Phase 1) covers the raw HTTP request. The client library section helps users accomplish the same task using the InfluxDB 3 client libraries (Python, JavaScript, Go, Java, C#).

Users and agents can create their own language-specific boilerplate for direct HTTP calls, but the client libraries abstract away HTTP details and provide idiomatic interfaces — that's what we want to surface here.

### 4.1 Client library links on relevant operations

**New file:** `data/api-client-library-links.yml`

A mapping from operation tags/paths to client library documentation:
```yaml
write:
  description: "Write data using InfluxDB 3 client libraries"
  operations:
    - PostWrite
    - PostWriteV1
  links:
    - name: Python
      url: /influxdb3/{version}/reference/client-libraries/v3/python/
      guide: /influxdb3/{version}/write-data/client-libraries/
    - name: JavaScript
      url: /influxdb3/{version}/reference/client-libraries/v3/javascript/
    - name: Go
      url: /influxdb3/{version}/reference/client-libraries/v3/go/
    - name: Java
      url: /influxdb3/{version}/reference/client-libraries/v3/java/
    - name: C#
      url: /influxdb3/{version}/reference/client-libraries/v3/csharp/
query:
  operations:
    - PostQuery
  links:
    - name: Python
      url: /influxdb3/{version}/reference/client-libraries/v3/python/
    # ...
```

**Modify:** `layouts/partials/api/code-sample.html`

Below the curl example, render a "Client Libraries" section when the operation matches. This section includes:
1. Links to the relevant client library reference pages
2. A link to the relevant guide (e.g., "Write data with client libraries")

```html
<div class="api-client-libraries">
  <h6>Client Libraries</h6>
  <ul>
    <li><a href="/influxdb3/core/reference/client-libraries/v3/python/">Python</a></li>
    <li><a href="...">JavaScript</a></li>
    ...
  </ul>
  <p><a href="/influxdb3/core/write-data/client-libraries/">Full guide: Write data with client libraries</a></p>
</div>
```

### 4.2 Client library code samples with language tabs

Add tabbed code samples showing how to accomplish the same operation using each InfluxDB 3 client library. These are **not** raw HTTP examples in different languages — they show the idiomatic client library usage.

**Scope:** Only operations that have corresponding client library methods:
- **Write** operations: `PostWrite`, `PostWriteV1` — client library `write()` / `writeRecord()` methods
- **Query** operations: `PostQuery` — client library `query()` methods
- Additional operations can be added as client libraries expand their APIs

**Code sample source:** Maintained in a data directory, not in OpenAPI specs.

**New directory:** `data/api-code-samples/`

Structure:
```
data/api-code-samples/
├── write/
│   ├── python.md      # Python write example
│   ├── javascript.md  # JavaScript write example
│   ├── go.md          # Go write example
│   ├── java.md        # Java write example
│   └── csharp.md      # C# write example
└── query/
    ├── python.md
    ├── javascript.md
    ├── go.md
    ├── java.md
    └── csharp.md
```

Each file contains just the code sample (no frontmatter), e.g. `data/api-code-samples/write/python.md`:
```python
from influxdb_client_3 import InfluxDBClient3

client = InfluxDBClient3(
    host="{{< influxdb/host >}}",
    token="DATABASE_TOKEN",
    database="DATABASE_NAME",
)

client.write(record="home,room=Living\ Room temp=21.1")
```

**Modify:** `layouts/partials/api/code-sample.html`

Below the curl example, render a tabbed client library section:
```html
<div class="api-client-library-samples">
  <div class="api-code-tabs">
    <button class="api-code-tab is-active" data-lang="python">Python</button>
    <button class="api-code-tab" data-lang="javascript">JavaScript</button>
    <button class="api-code-tab" data-lang="go">Go</button>
    <button class="api-code-tab" data-lang="java">Java</button>
    <button class="api-code-tab" data-lang="csharp">C#</button>
  </div>
  <div class="api-code-tab-content is-active" data-lang="python">
    <pre><code class="language-python">...</code></pre>
  </div>
  <!-- ... other languages ... -->
  <p class="api-client-library-guide">
    <a href="/influxdb3/core/write-data/client-libraries/">
      Full guide: Write data with client libraries
    </a>
  </p>
</div>
```

**New file:** `assets/js/components/api-code-tabs.ts`

A simple tab switcher component (lightweight, not the full `tabs-wrapper` shortcode):
- Listens for clicks on `.api-code-tab` buttons
- Shows/hides corresponding `.api-code-tab-content` panels
- Remembers the user's language preference in `localStorage`
- Syncs language selection across all client library sections on the page

**Keeping samples in sync:** The code samples in `data/api-code-samples/` are manually maintained. When client library versions change, the samples need to be updated. This is a documentation maintenance task, same as updating any other code example in the docs. The samples should use the **latest stable** client library version and follow the patterns from the client library reference pages.

---

## Files Summary

### New Files
| File | Phase | Purpose |
|------|-------|---------|
| `layouts/partials/api/code-sample.html` | 1 | Renders inline curl + response schema + client library samples within operations |
| `assets/styles/layouts/_api-code-samples.scss` | 1 | Styles for code sample blocks, tabs, and Ask AI links |
| `layouts/_default/_markup/render-codeblock.html` | 3 | Hugo render hook adding Ask AI to all code blocks |
| `data/api-client-library-links.yml` | 4.1 | Maps operations to client library documentation links |
| `data/api-code-samples/write/*.md` | 4.2 | Client library write examples (Python, JS, Go, Java, C#) |
| `data/api-code-samples/query/*.md` | 4.2 | Client library query examples (Python, JS, Go, Java, C#) |
| `assets/js/components/api-code-tabs.ts` | 4.2 | Lightweight tab switcher for client library code samples |

### Modified Files
| File | Phase | Change |
|------|-------|--------|
| `api-docs/scripts/generate-openapi-articles.ts` | 1 | Add `curlExample` generation |
| `layouts/partials/api/operation.html` | 1 | Include `code-sample.html` partial after responses |
| `assets/styles/styles-default.scss` | 1 | Import `_api-code-samples.scss` |
| `layouts/partials/api/code-sample.html` | 2, 4.1, 4.2 | Add response body schema, client library links, tabbed code samples |
| `assets/js/main.js` | 4.2 | Register `api-code-tabs` component |

### NOT Modified (kept as-is)
| File | Reason |
|------|--------|
| `layouts/api/list.html` | TOC sidebar stays unchanged |
| `assets/js/components/api-toc.ts` | TOC behavior stays unchanged |
| `assets/styles/layouts/_api-layout.scss` | Layout widths stay unchanged |

---

## Implementation Order

1. **Phase 1** (MVP): Build script curl generation + inline code sample partial + styles
2. **Phase 2**: Successful response body schema (small addition to Phase 1, no build script changes)
3. **Phase 3.1**: Ask AI on API code samples (included in Phase 1 HTML)
4. **Phase 3.2**: Ask AI on all code blocks site-wide (Hugo render hook)
5. **Phase 4.1**: Client library links on relevant operations (data file + partial update)
6. **Phase 4.2**: Client library code samples with language tabs (data files + tab component + partial update)

Phases 1-3.1 can ship together. Phase 3.2 and 4 are independent follow-ups.

Phase 4.2 starts with write and query operations only, then expands as client libraries add more API coverage.

---

## Verification

1. **Regenerate articles**: Run `generate-openapi-articles.ts` → verify `curlExample` in frontmatter YAML
2. **Build**: `npx hugo --quiet` — verify no template errors
3. **Visual**: Dev server → navigate to API tag page → verify each operation has a curl example at the bottom
4. **Ask AI**: Click "Ask AI about this example" → verify Kapa opens with pre-populated query
5. **Dark mode**: Verify code sample blocks look correct in both themes
6. **Responsive**: Verify code samples render well on narrow viewports (no sidebar dependency)
7. **E2E test**: Add Cypress test verifying code samples render on API pages
