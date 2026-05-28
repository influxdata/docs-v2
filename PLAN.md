# Design: TechArticle + SoftwareApplication JSON-LD (#7242)

Parent: #7230 (Phase 0 — AI visibility for InfluxDB documentation)

## Goal

Emit schema.org `TechArticle` and `SoftwareApplication` JSON-LD on product
documentation pages so structured-data-aware retrievers (Google, Bing,
Perplexity, Brave) can resolve product identity, applicable platform, and
version without scraping prose.

Follows the pattern established by the FAQPage JSON-LD work (#7220):
a partial under `layouts/partials/header/` wired into `header.html`.

## Key decisions

- **Gating is path/cascade-based, not per-page frontmatter opt-in.** Eligibility
  is resolved from the existing `product` cascade key, so no content frontmatter
  churn. A `techarticle: false` opt-out exists for the rare exception.
- **`TechArticle` applies to all product prose, including `reference/`.** The
  schema.org `TechArticle` definition explicitly lists "specifications" as an
  example, so API/CLI/SQL/config reference pages are valid `TechArticle` nodes.
  Register (guide vs. spec) is encoded in `articleSection`, not by withholding
  the type. No `proficiencyLevel` (avoids a guessy path→proficiency mapping).
- **`SoftwareApplication` is emitted once per product**, on the product landing
  page only, as the authoritative node that `TechArticle.isPartOf` references.

## 1. Gating & file structure

Two new partials under `layouts/partials/header/`, included in `header.html`
immediately after the existing `faq-jsonld.html` include:

- `techarticle-jsonld.html` — emits `TechArticle`
- `softwareapplication-jsonld.html` — emits `SoftwareApplication`

Both resolve the product with the existing
`partial "product/get-data.html" .` (reads the `product` cascade key set in
each product section's `_index.md`). No path parsing.

**`TechArticle` emits when ALL of:**

- `product/get-data.html` returns a non-empty product (page is inside a product
  section)
- `.Kind` is `page` or `section` — structurally excludes `taxonomy` and `term`
  (the `tags` pages), plus `home`
- frontmatter does not set `techarticle: false`

**`SoftwareApplication` emits only on the product landing page** — the section
root where `.RelPermalink` equals `/{{ content_path }}/`.

## 2. Emitted fields

### `TechArticle` (every qualifying page)

| Field               | Source                                                                                                         |
| ------------------- | -------------------------------------------------------------------------------------------------------------- |
| `@type`             | `"TechArticle"`                                                                                                |
| `headline` / `name` | `.Title`                                                                                                       |
| `description`       | `.Description` (fallback `.Summary`)                                                                           |
| `mainEntityOfPage`  | absolute page URL (`.Permalink`)                                                                               |
| `articleSection`    | top-level section under the product, title-cased (e.g. `Reference`, `Get started`, `Administer`, `Write data`) |
| `about`             | `{ "@type": "SoftwareApplication", "name": <product.name> }`                                                   |
| `isPartOf`          | `{ "@type": "SoftwareApplication", "@id": "<landing-URL>#software" }`                                          |
| `dateModified`      | `.Lastmod`                                                                                                     |
| `inLanguage`        | `"en"`                                                                                                         |

### `SoftwareApplication` (landing page only)

| Field                 | Source                                             |
| --------------------- | -------------------------------------------------- |
| `@type` / `@id`       | `"SoftwareApplication"` / `<landing-URL>#software` |
| `name`                | `product.name`                                     |
| `applicationCategory` | `"DatabaseApplication"`                            |
| `operatingSystem`     | new `product.schema.operating_system`              |
| `softwareVersion`     | `product.latest_patch` (existing)                  |
| `offers`              | new `product.schema.offers` (omit if absent)       |
| `url`                 | landing page `.Permalink`                          |

## 3. New data: `schema:` block in `data/products.yml`

`products.yml` has `name` and `latest_patch` but not OS or pricing. Add a
per-product `schema:` block (content-as-data, consistent with the file) for
**all products** in `products.yml`:

```yaml
influxdb3_core:
  # ...existing...
  schema:
    operating_system: "Linux, macOS, Windows, Docker"
    offers:
      price: "0"
      price_currency: "USD"
```

The partial reads `product.schema.*` with safe fallbacks: omit `offers` /
`operatingSystem` when absent rather than emit empty values. Products without a
`schema` block still get `TechArticle`.

## 4. Validation & testing

- **Build safety**: both partials use `with`/`default` guards so a missing field
  never errors the build (matches `faq-jsonld.html`). `safeJS` on `jsonify`
  output, same as the FAQ partial.
- **Google Rich Results Test**: manually validate one landing page (both types)
  and one deep `reference/` page (TechArticle only) before merge.
- **Cypress** (`cypress/e2e/content/`, mirroring `which-influxdb-3.cy.js`):
  assert a product landing page emits both `@type: TechArticle` and
  `@type: SoftwareApplication` with non-empty `name`/`url`, and that a `tags`
  page emits neither.
- **PR preview**: list the landing page + one reference page + one tags page in
  the PR body with an "Expected JSON-LD" column.

## Acceptance criteria (from #7242)

- [ ] New partial(s) under `layouts/partials/header/` emit `TechArticle` per page
  (`name`, `headline`, `mainEntityOfPage`, `about`, `articleSection`,
  `isPartOf`) and `SoftwareApplication` on product landing pages (`name`,
  `applicationCategory`, `operatingSystem`, `softwareVersion`, `offers`,
  `url`)
- [ ] Wired into `header.html` after the FAQ JSON-LD include
- [ ] Gated without per-page frontmatter churn (cascade-based default + opt-out)
- [ ] Validated with Google Rich Results Test
- [ ] Cypress assertion for both types on a product page

***

# TechArticle + SoftwareApplication JSON-LD Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Emit schema.org `TechArticle` JSON-LD on every InfluxData product documentation page and `SoftwareApplication` JSON-LD on each product landing page, so structured-data-aware retrievers can resolve product identity, platform, and version.

**Architecture:** Two new Hugo partials under `layouts/partials/header/`, gated on the existing `product` cascade key (resolved via `partial "product/get-data.html"`), wired into `layouts/partials/header.html` after the FAQ JSON-LD include. Per-product `SoftwareApplication` metadata (operating system, offers, application category) lives in a new `schema:` block in `data/products.yml`. Mirrors the FAQPage JSON-LD pattern from #7220.

**Tech Stack:** Hugo (Go html/template), YAML data files, Cypress E2E.

***

## File structure

| File                                                               | Responsibility                                                                                    |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| `data/products.yml` (modify)                                       | Add a `schema:` block per product: `operating_system`, `application_category`, optional `offers`. |
| `layouts/partials/header/techarticle-jsonld.html` (create)         | Emit `TechArticle` on qualifying pages.                                                           |
| `layouts/partials/header/softwareapplication-jsonld.html` (create) | Emit `SoftwareApplication` on product landing pages.                                              |
| `layouts/partials/header.html` (modify)                            | Include the two new partials after `faq-jsonld.html`.                                             |
| `cypress/e2e/content/jsonld-techarticle.cy.js` (create)            | Assert emissions on a landing page, a reference page, and exclusion on a tags page.               |

## Conventions established by this plan (use these exact names)

- Product data accessor: `partial "product/get-data.html" .` returns the product dict (or empty dict).
- `SoftwareApplication` node `@id`: `<landing-page-absolute-URL>#software`. `TechArticle.isPartOf.@id` references the same string.
- `data/products.yml` per-product key: `schema` with sub-keys `operating_system` (string), `application_category` (string), `offers` (map with `price`, `price_currency`).
- Partials read schema safely via `{{ $schema := $product.schema | default dict }}` so a missing block never errors.

## Known scope boundaries (intentional, not gaps)

- `SoftwareApplication` is skipped when a product's `content_path` is a map (only `influxdb`, which has `v1`/`v2` paths). Those pages still emit `TechArticle` but without `isPartOf` (no single landing node). Documented as a follow-up, not in scope for #7242.
- `offers` is emitted only for products whose `schema` block defines it (free/open-source products). Commercial products omit `offers` rather than fabricate a price.

***

### Task 1: Add `schema:` blocks to `data/products.yml`

**Files:**

- Modify: `data/products.yml` (one `schema:` block appended to each top-level product key)

- [ ] **Step 1: Add the `schema:` block to each product**

Insert a `schema:` block as a child of each product key. Use these exact values (indented two spaces under the product key, consistent with sibling keys like `limits:`):

```yaml
# influxdb3_core
  schema:
    operating_system: "Linux, macOS, Windows, Docker"
    application_category: "DatabaseApplication"
    offers:
      price: "0"
      price_currency: "USD"

# influxdb3_enterprise
  schema:
    operating_system: "Linux, macOS, Windows, Docker"
    application_category: "DatabaseApplication"

# influxdb3_explorer
  schema:
    operating_system: "Linux, macOS, Windows, Docker"
    application_category: "BusinessApplication"
    offers:
      price: "0"
      price_currency: "USD"

# influxdb3_cloud_serverless
  schema:
    operating_system: "Any"
    application_category: "DatabaseApplication"

# influxdb3_cloud_dedicated
  schema:
    operating_system: "Any"
    application_category: "DatabaseApplication"

# influxdb3_clustered
  schema:
    operating_system: "Kubernetes"
    application_category: "DatabaseApplication"

# influxdb
  schema:
    operating_system: "Linux, macOS, Windows, Docker"
    application_category: "DatabaseApplication"
    offers:
      price: "0"
      price_currency: "USD"

# influxdb_cloud
  schema:
    operating_system: "Any"
    application_category: "DatabaseApplication"

# telegraf
  schema:
    operating_system: "Linux, macOS, Windows, FreeBSD, Docker"
    application_category: "DeveloperApplication"
    offers:
      price: "0"
      price_currency: "USD"

# telegraf_controller
  schema:
    operating_system: "Docker"
    application_category: "DeveloperApplication"

# chronograf
  schema:
    operating_system: "Linux, macOS, Windows, Docker"
    application_category: "BusinessApplication"
    offers:
      price: "0"
      price_currency: "USD"

# kapacitor
  schema:
    operating_system: "Linux, macOS, Windows, Docker"
    application_category: "DeveloperApplication"
    offers:
      price: "0"
      price_currency: "USD"

# enterprise_influxdb
  schema:
    operating_system: "Linux, Docker"
    application_category: "DatabaseApplication"

# influxdb_cloud1
  schema:
    operating_system: "Any"
    application_category: "DatabaseApplication"

# flux
  schema:
    operating_system: "Linux, macOS, Windows, Docker"
    application_category: "DeveloperApplication"
    offers:
      price: "0"
      price_currency: "USD"
```

- [ ] **Step 2: Verify YAML parses and every product has a schema block**

Run:

```bash
node -e "const y=require('js-yaml');const d=y.load(require('fs').readFileSync('data/products.yml','utf8'));const missing=Object.entries(d).filter(([k,v])=>v&&typeof v==='object'&&!v.schema).map(([k])=>k);console.log('missing schema:',missing);"
```

Expected: `missing schema: []`

- [ ] **Step 3: Commit**

```bash
git add data/products.yml
git commit -m "feat(jsonld): add schema metadata blocks to products.yml (#7242)"
```

***

### Task 2: Create the `TechArticle` partial

**Files:**

- Create: `layouts/partials/header/techarticle-jsonld.html`

- [ ] **Step 1: Write the partial**

```go-html-template
{{- /*
  Emits a schema.org TechArticle JSON-LD <script> for product documentation
  pages. Gated on: the page resolves to a product (via the `product` cascade
  key), the page Kind is "page" or "section" (excludes taxonomy/term/home —
  e.g. tags pages), and frontmatter does not set `techarticle: false`.

  articleSection encodes the top-level docs section (e.g. "Reference",
  "Get started"). isPartOf references the product's SoftwareApplication node
  emitted on the landing page.

  safeJS opts out of Go's JS-context re-escaping so jsonify output is verbatim,
  matching layouts/partials/header/faq-jsonld.html.
*/ -}}
{{- $product := partial "product/get-data.html" . -}}
{{- if and $product (in (slice "page" "section") .Kind) (ne .Params.techarticle false) -}}
  {{- $article := dict
      "@context" "https://schema.org"
      "@type" "TechArticle"
      "headline" .Title
      "name" .Title
      "mainEntityOfPage" .Permalink
      "about" (dict "@type" "SoftwareApplication" "name" $product.name)
      "dateModified" (.Lastmod.Format "2006-01-02")
      "inLanguage" "en"
  -}}
  {{- with .Description | default .Summary -}}
    {{- $article = merge $article (dict "description" (. | plainify | strings.TrimSpace)) -}}
  {{- end -}}
  {{- if eq (printf "%T" $product.content_path) "string" -}}
    {{- $base := printf "/%s/" $product.content_path -}}
    {{- $rel := strings.TrimPrefix $base .RelPermalink -}}
    {{- $seg := index (split $rel "/") 0 -}}
    {{- with $seg -}}
      {{- /* Function-call form: Hugo's `replace s old new` puts the input
             first, so a pipe (`x | replace "-" " "`) would silently reorder
             args and yield `-`. Use `replace . "-" " "` explicitly. */ -}}
      {{- $article = merge $article (dict "articleSection" (title (replace . "-" " "))) -}}
    {{- end -}}
    {{- $landing := $base | absURL -}}
    {{- $article = merge $article (dict "isPartOf" (dict "@type" "SoftwareApplication" "@id" (printf "%s#software" $landing))) -}}
  {{- end -}}
  <script type="application/ld+json">{{ $article | jsonify | safeJS }}</script>
{{- end -}}
```

- [ ] **Step 2: Temporarily include the partial and build**

Add `{{ partial "header/techarticle-jsonld.html" . }}` after line 20 of `layouts/partials/header.html` (this becomes permanent in Task 4 — add it now to test).

Run:

```bash
npx hugo --quiet --destination public_test 2>&1 | tail -20
```

Expected: build completes with no template errors.

- [ ] **Step 3: Verify the emission on a guide page and a reference page**

Run:

```bash
node -e "const fs=require('fs');for(const p of ['public_test/influxdb3/core/get-started/index.html','public_test/influxdb3/core/reference/cli/index.html']){const h=fs.readFileSync(p,'utf8');const m=[...h.matchAll(/<script\s+type=[\"\x27]?application\/ld\+json[\"\x27]?\s*>([\s\S]*?)<\/script>/gs)].map(x=>JSON.parse(x[1]));const t=m.find(j=>j['@type']==='TechArticle');console.log(p, t?('OK '+t.articleSection+' / '+(t.isPartOf||{})['@id']):'MISSING');}"
```

Expected: both lines print `OK <section> / .../influxdb3/core/#software` (e.g. `Get started` and `Reference`).

- [ ] **Step 4: Verify a tags page emits NO TechArticle**

Run:

```bash
node -e "const fs=require('fs');const p='public_test/influxdb3/core/tags/index.html';if(!fs.existsSync(p)){console.log('no tags page built — kind guard still applies');process.exit(0);}const h=fs.readFileSync(p,'utf8');const m=[...h.matchAll(/<script\s+type=[\"\x27]?application\/ld\+json[\"\x27]?\s*>([\s\S]*?)<\/script>/gs)].map(x=>JSON.parse(x[1]));console.log(m.some(j=>j['@type']==='TechArticle')?'FAIL: TechArticle on tags page':'OK: no TechArticle on tags page');"
```

Expected: `OK: no TechArticle on tags page`

- [ ] **Step 5: Clean up the test build and commit the partial**

Run:

```bash
rm -rf public_test
git add layouts/partials/header/techarticle-jsonld.html
git commit -m "feat(jsonld): add TechArticle partial (#7242)"
```

(Leave the temporary `header.html` include uncommitted for now, or revert it — Task 4 adds the permanent wiring.)

***

### Task 3: Create the `SoftwareApplication` partial

**Files:**

- Create: `layouts/partials/header/softwareapplication-jsonld.html`

- [ ] **Step 1: Write the partial**

```go-html-template
{{- /*
  Emits a schema.org SoftwareApplication JSON-LD <script> once per product, on
  the product landing page (the section root where RelPermalink equals
  "/<content_path>/"). Reads optional metadata from data/products.yml `schema`:
  operating_system, application_category (default "DatabaseApplication"), and
  offers. Absent fields are omitted rather than emitted empty.

  Skipped when content_path is a map (multi-version products like `influxdb`),
  which have no single landing node.
*/ -}}
{{- $product := partial "product/get-data.html" . -}}
{{- if and $product (eq (printf "%T" $product.content_path) "string") -}}
  {{- $base := printf "/%s/" $product.content_path -}}
  {{- if eq .RelPermalink $base -}}
    {{- $schema := $product.schema | default dict -}}
    {{- $url := $base | absURL -}}
    {{- $sw := dict
        "@context" "https://schema.org"
        "@type" "SoftwareApplication"
        "@id" (printf "%s#software" $url)
        "name" $product.name
        "applicationCategory" (index $schema "application_category" | default "DatabaseApplication")
        "url" $url
    -}}
    {{- with $product.latest_patch | default $product.latest -}}
      {{- $sw = merge $sw (dict "softwareVersion" .) -}}
    {{- end -}}
    {{- with index $schema "operating_system" -}}
      {{- $sw = merge $sw (dict "operatingSystem" .) -}}
    {{- end -}}
    {{- with index $schema "offers" -}}
      {{- $sw = merge $sw (dict "offers" (dict "@type" "Offer" "price" .price "priceCurrency" .price_currency)) -}}
    {{- end -}}
    <script type="application/ld+json">{{ $sw | jsonify | safeJS }}</script>
  {{- end -}}
{{- end -}}
```

- [ ] **Step 2: Temporarily include the partial and build**

Add `{{ partial "header/softwareapplication-jsonld.html" . }}` after the TechArticle include in `layouts/partials/header.html`, then run:

```bash
npx hugo --quiet --destination public_test 2>&1 | tail -20
```

Expected: build completes with no template errors.

- [ ] **Step 3: Verify SoftwareApplication on the landing page only**

Run:

```bash
node -e "const fs=require('fs');function sw(p){const h=fs.readFileSync(p,'utf8');return [...h.matchAll(/<script\s+type=[\"\x27]?application\/ld\+json[\"\x27]?\s*>([\s\S]*?)<\/script>/gs)].map(x=>JSON.parse(x[1])).find(j=>j['@type']==='SoftwareApplication');}const land=sw('public_test/influxdb3/core/index.html');console.log('landing:', land?('OK '+land.name+' v'+land.softwareVersion+' '+land.applicationCategory+' offers='+JSON.stringify(land.offers||null)):'MISSING');const deep=sw('public_test/influxdb3/core/get-started/index.html');console.log('deep page:', deep?'FAIL: SoftwareApplication on non-landing page':'OK: none on deep page');"
```

Expected:

- `landing: OK InfluxDB 3 Core v3.9.2 DatabaseApplication offers={"@type":"Offer","price":"0","priceCurrency":"USD"}`

- `deep page: OK: none on deep page`

- [ ] **Step 4: Verify the @id matches TechArticle.isPartOf**

Run:

```bash
node -e "const fs=require('fs');const h=fs.readFileSync('public_test/influxdb3/core/index.html','utf8');const m=[...h.matchAll(/<script\s+type=[\"\x27]?application\/ld\+json[\"\x27]?\s*>([\s\S]*?)<\/script>/gs)].map(x=>JSON.parse(x[1]));const sw=m.find(j=>j['@type']==='SoftwareApplication');const ta=m.find(j=>j['@type']==='TechArticle');console.log(sw['@id']===ta.isPartOf['@id']?'OK: @id matches isPartOf':'FAIL: '+sw['@id']+' != '+ta.isPartOf['@id']);"
```

Expected: `OK: @id matches isPartOf`

- [ ] **Step 5: Clean up and commit the partial**

Run:

```bash
rm -rf public_test
git add layouts/partials/header/softwareapplication-jsonld.html
git commit -m "feat(jsonld): add SoftwareApplication partial (#7242)"
```

***

### Task 4: Wire both partials into `header.html`

**Files:**

- Modify: `layouts/partials/header.html:20`

- [ ] **Step 1: Add the permanent includes**

Ensure these two lines follow the FAQ JSON-LD include (line 20). The final block reads:

```go-html-template
    {{ partial "header/faq-jsonld.html" . }}
    {{ partial "header/techarticle-jsonld.html" . }}
    {{ partial "header/softwareapplication-jsonld.html" . }}
```

(If you added temporary includes during Tasks 2–3, consolidate to exactly these two new lines.)

- [ ] **Step 2: Build and confirm no errors**

Run:

```bash
npx hugo --quiet 2>&1 | tail -20
```

Expected: build completes with no template errors.

- [ ] **Step 3: Commit**

```bash
git add layouts/partials/header.html
git commit -m "feat(jsonld): wire TechArticle + SoftwareApplication partials into header (#7242)"
```

***

### Task 5: Cypress E2E test

**Files:**

- Create: `cypress/e2e/content/jsonld-techarticle.cy.js`

- [ ] **Step 1: Write the test**

```js
/// <reference types="cypress" />

// #7242: TechArticle + SoftwareApplication JSON-LD on product doc pages.

function ldByType(win$, doc, type) {
  const scripts = win$(doc).find('script[type="application/ld+json"]');
  return [...scripts]
    .map((s) => {
      try {
        return JSON.parse(s.textContent);
      } catch (e) {
        return null;
      }
    })
    .filter((j) => j && j['@type'] === type);
}

describe('Product landing page JSON-LD', function () {
  beforeEach(() => cy.visit('/influxdb3/core/'));

  it('emits TechArticle with required fields', function () {
    cy.document().then((doc) => {
      const [ta] = ldByType(Cypress.$, doc, 'TechArticle');
      expect(ta, 'TechArticle present').to.exist;
      expect(ta['@context']).to.equal('https://schema.org');
      expect(ta.name).to.be.a('string').and.not.empty;
      expect(ta.mainEntityOfPage).to.match(/\/influxdb3\/core\/$/);
      expect(ta.about['@type']).to.equal('SoftwareApplication');
      expect(ta.isPartOf['@id']).to.match(/\/influxdb3\/core\/#software$/);
    });
  });

  it('emits SoftwareApplication with required fields', function () {
    cy.document().then((doc) => {
      const [sw] = ldByType(Cypress.$, doc, 'SoftwareApplication');
      expect(sw, 'SoftwareApplication present').to.exist;
      expect(sw.name).to.be.a('string').and.not.empty;
      expect(sw.url).to.be.a('string').and.not.empty;
      expect(sw.applicationCategory).to.equal('DatabaseApplication');
      expect(sw['@id']).to.equal(sw.url + '#software');
    });
  });
});

describe('Reference page JSON-LD', function () {
  it('emits TechArticle but NOT SoftwareApplication', function () {
    cy.visit('/influxdb3/core/reference/cli/');
    cy.document().then((doc) => {
      expect(ldByType(Cypress.$, doc, 'TechArticle')).to.have.length(1);
      expect(ldByType(Cypress.$, doc, 'SoftwareApplication')).to.have.length(0);
    });
  });
});

describe('Tags page JSON-LD exclusion', function () {
  it('emits neither TechArticle nor SoftwareApplication', function () {
    cy.visit('/influxdb3/core/tags/');
    cy.document().then((doc) => {
      expect(ldByType(Cypress.$, doc, 'TechArticle')).to.have.length(0);
      expect(ldByType(Cypress.$, doc, 'SoftwareApplication')).to.have.length(0);
    });
  });
});
```

- [ ] **Step 2: Run the test against a running Hugo server**

Run:

```bash
node cypress/support/run-e2e-specs.js --spec "cypress/e2e/content/jsonld-techarticle.cy.js"
```

Expected: all specs pass. If the `/influxdb3/core/tags/` URL 404s (no tags defined for Core), switch the tags test to a product/tag URL that exists, or assert via `cy.request({url, failOnStatusCode:false})` that a taxonomy page carries no JSON-LD.

- [ ] **Step 3: Commit**

```bash
git add cypress/e2e/content/jsonld-techarticle.cy.js
git commit -m "test(jsonld): assert TechArticle/SoftwareApplication emission and tags exclusion (#7242)"
```

***

### Task 6: Validate with Google Rich Results Test and open the PR

- [ ] **Step 1: Validate structured data**

Start the server (`npx hugo server`), then paste the rendered JSON-LD from `/influxdb3/core/` and `/influxdb3/core/reference/cli/` into the [Google Rich Results Test](https://search.google.com/test/rich-results) (use the "Code" tab). Confirm `TechArticle` and `SoftwareApplication` parse with no errors. Fix any flagged required-property warnings.

- [ ] **Step 2: Push and open the PR**

```bash
git push -u origin feat/7242-techarticle-softwareapplication-jsonld
gh pr create --repo influxdata/docs-v2 --base master \
  --title "feat(jsonld): TechArticle + SoftwareApplication JSON-LD on product pages (#7242)" \
  --body "Closes #7242. Emits schema.org TechArticle on product doc pages and SoftwareApplication on product landing pages. See PLAN.md.

## Pages to preview

| URL | Expected |
| --- | --- |
| /influxdb3/core/ | Emits both \`TechArticle\` and \`SoftwareApplication\` (with \`offers\`, \`softwareVersion\`) |
| /influxdb3/core/reference/cli/ | Emits \`TechArticle\` only, \`articleSection: Reference\` |
| /influxdb3/core/tags/ | Emits neither |"
```

Expected: PR created.

***

## Self-review

- **Spec coverage:** §1 gating → Tasks 2–4; §2 TechArticle fields → Task 2; §2 SoftwareApplication fields → Task 3; §3 products.yml schema (all products) → Task 1; §4 validation/Cypress → Tasks 5–6. All acceptance criteria mapped.
- **Type consistency:** `@id` = `<landing-URL>#software` is produced in Task 3 and referenced identically in Task 2 (`isPartOf.@id`) and asserted in Tasks 3 (step 4) and 5. `schema` sub-keys (`operating_system`, `application_category`, `offers.price`, `offers.price_currency`) match between Task 1 YAML and the Task 3 partial.
- **Placeholder scan:** No TBDs; every code step has complete code; commands have expected output.
