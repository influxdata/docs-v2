# API Code Samples & Ask AI Integration Plan

## Scope

This plan covers:

1. **Inline curl examples** for each API operation, generated at Hugo template time from the OpenAPI spec
2. **"Ask AI about this example"** link on each curl example, using the existing Kapa integration
3. **Client library related link** on all InfluxDB 3 API tag pages

**Out of scope** (separate plans):

- Site-wide Ask AI on all code blocks (render-codeblock hook)
- Client library tabbed code samples with language tabs
- Duplicate response schema rendering (already shown in Responses section)

***

## Architecture

**No build script changes for curl generation.** The curl example is constructed entirely in a Hugo partial (`api/code-sample.html`) using data already loaded by `tag-renderer.html` — the full parsed OpenAPI spec with server URLs, parameters, request body schemas, and examples.

The existing `influxdb-url.js` automatically replaces the default placeholder host in `<pre>` elements with the user's custom URL. No new JavaScript is needed for URL personalization.

### Operation layout order (revised)

1. Header (method + path + summary)
2. Description
3. Parameters
4. Request Body
5. **Example (curl + Ask AI)** — new
6. Responses

***

## curl Example Generation

### Partial: `layouts/partials/api/code-sample.html`

Receives the operation definition (`$opDef`), spec (`$spec`), and operation metadata from `operation.html`. Constructs a curl command:

1. **Server URL**: `spec.servers[0].url` — falls back to the product's `placeholder_host`. The existing `influxdb-url.js` replaces this in the DOM if the user has a custom URL.
2. **Method**: Always explicit `--request METHOD`
3. **Path**: Appended to server URL. `{param}` placeholders left as-is in the URL.
4. **Query parameters**: Only required ones. Uses `example` value if available, otherwise an `UPPER_SNAKE_CASE` placeholder derived from the parameter name.
5. **Headers**:
   - Always: `--header "Authorization: Bearer INFLUX_TOKEN"`
   - When request body exists: `--header "Content-Type: ..."` derived from the first key in `requestBody.content`
6. **Request body**:
   - `application/json`: Uses `schema.example` if present. If no example, body is omitted entirely — no synthesized fake data.
   - `text/plain` (line protocol): Hardcoded sample: `--data-raw "measurement,tag=value field=1.0"`
   - No example and no special content type: body omitted, shows only URL + headers.

### Ask AI link

Each code sample block includes an "Ask AI about this example" link using the existing `ask-ai-open` CSS class and `data-query` attribute. The existing `ask-ai-trigger.js` handles click events and opens the Kapa widget — no new JavaScript needed.

```html
<a href="#" class="ask-ai-open api-code-ask-ai"
   data-query="Explain this API request: POST /api/v2/write - Write data">
  Ask AI about this example
</a>
```

***

## Client Library Related Link

The generation script adds a related link to `/influxdb3/{product}/reference/client-libraries/v3/` for all InfluxDB 3 product tag pages.

**InfluxDB 3 products** (identified by `pagesDir` containing `influxdb3/`):

- `influxdb3_core`
- `influxdb3_enterprise`
- `cloud-dedicated`
- `cloud-serverless`
- `clustered`

**Excluded** (future plan with v2 client library links):

- `cloud-v2`, `oss-v2`, `oss-v1`, `enterprise-v1`

The `{product}` segment is derived from the `pagesDir` (e.g., `content/influxdb3/core` yields `core`).

***

## File Changes

### New files

| File                                           | Purpose                      |
| ---------------------------------------------- | ---------------------------- |
| `layouts/partials/api/code-sample.html`        | curl example + Ask AI link   |
| `assets/styles/layouts/_api-code-samples.scss` | Styles for code sample block |

### Modified files

| File                                            | Change                                                             |
| ----------------------------------------------- | ------------------------------------------------------------------ |
| `layouts/partials/api/operation.html`           | Insert `code-sample.html` between request body and responses       |
| `assets/styles/styles-default.scss`             | Import `_api-code-samples.scss`                                    |
| `api-docs/scripts/generate-openapi-articles.ts` | Add client library reference related link for InfluxDB 3 tag pages |

### Not modified

| File                                                   | Reason                   |
| ------------------------------------------------------ | ------------------------ |
| `layouts/api/list.html`                                | No layout changes needed |
| `assets/js/main.js`                                    | No new JS components     |
| `assets/js/components/api-toc.ts`                      | TOC unchanged            |
| `assets/styles/layouts/_api-layout.scss`               | Layout unchanged         |
| `api-docs/scripts/openapi-paths-to-hugo-data/index.ts` | No data model changes    |

***

## Verification

1. **Build**: `npx hugo --quiet` — no template errors
2. **Visual**: Dev server — navigate to API tag page (e.g., `/influxdb3/core/api/write-data/`) — each operation has a curl example between Request Body and Responses
3. **URL replacement**: Set a custom URL in the URL selector — verify it replaces the host in curl examples
4. **Ask AI**: Click "Ask AI about this example" — Kapa opens with pre-populated query
5. **Related link**: Client library reference link appears at bottom of all InfluxDB 3 API tag pages
6. **Cypress**: Add test verifying `.api-code-sample` elements render on tag pages
7. **Dark/light mode**: Code block renders correctly in both themes
8. **Responsive**: Code sample block handles narrow viewports (horizontal scroll for long curl commands)
