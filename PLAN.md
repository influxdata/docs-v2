# "Which InfluxDB 3 should I use?" Decision Page — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the Phase 0 "Which InfluxDB 3 should I use?" decision page (canonical at `/influxdb3/which-influxdb-3/`) with a new `/influxdb3/` hub landing, FAQ rendered from a Hugo data file, `FAQPage` JSON-LD scoped to the canonical URL, `llms.txt` entry, and per-product cross-link callouts.

**Architecture:** Single source of truth for the FAQ via a Hugo data file (`data/faqs/which-influxdb-3.yml`). Both the canonical page stub and the new hub stub use `source:` to transclude the same shared markdown body. The shared body calls a new `{{< faq >}}` shortcode that renders the data file as flat `## Question` markdown. A new `head/faq-jsonld.html` partial reads the same data file and emits `FAQPage` JSON-LD, gated on a `faq_canonical: true` frontmatter flag so only the canonical URL emits structured data.

**Tech Stack:** Hugo (extended) for templates and content, YAML for the data file, schema.org JSON-LD for structured data, Cypress for E2E verification, Vale for prose linting, link-checker for link validation.

**Spec:** `docs/plans/2026-05-11-which-influxdb-3-decision-page-design.md`

**Spec corrections baked into this plan (caught during plan review):**

1. The spec's `canonical_url:` field is corrected to `canonical:` to match the existing `layouts/partials/header/canonical.html` partial.
2. The shared body calls `{{< children filterOut="Which InfluxDB 3 should I use?" >}}` unconditionally — it renders the v3 product list on the hub section page and is a no-op on the canonical regular page (which has no child pages). The earlier `show_children:` flag is unnecessary.
3. New stubs (canonical decision page and hub landing) omit `menu:` frontmatter. The decision page is cross-cutting; the hub is the section landing.
4. Migration URLs verified during plan revision: `/influxdb3/{enterprise,core}/get-started/migrate-from-influxdb-v1-v2/` (one page covering both v1 and v2 sources).

---

## File Structure

**Create:**

| Path | Responsibility |
|---|---|
| `data/faqs/which-influxdb-3.yml` | Single source for 7 FAQ Q&As. Read by both the shortcode (HTML) and the JSON-LD partial. |
| `layouts/shortcodes/faq.html` | Renders the FAQ data file (looked up via `.Page.Params.faq_data`) as flat `## Question` + answer markdown. |
| `layouts/partials/head/faq-jsonld.html` | Reads same data file; emits `FAQPage` JSON-LD. Gated on `.Params.faq_canonical`. |
| `content/shared/influxdb3/which-influxdb-3.md` | Canonical body. Decision content + `{{< faq >}}` call + `{{< children >}}` (no-op on regular pages, renders on the hub section). |
| `content/influxdb3/which-influxdb-3.md` | Canonical page stub (slug-shaped URL). `source:` + `faq_data: which-influxdb-3` + `faq_canonical: true`. |
| `content/influxdb3/_index.md` | New v3 hub landing. `source:` + `faq_data: which-influxdb-3` + `canonical: /influxdb3/which-influxdb-3/`. (The `{{< children >}}` call in the shared body renders here automatically because this is a section page.) |

**Modify:**

| Path | Change |
|---|---|
| `layouts/partials/header.html` | Add `{{ partial "head/faq-jsonld" . }}` inside `<head>`. |
| `layouts/index.llmstxt.txt` | Add `## Choosing InfluxDB` section above `## InfluxDB 3`. |
| `content/shared/influxdb3/_index.md` | Add tailored cross-link callout (sourced by Core and Enterprise). |
| `content/influxdb3/cloud-dedicated/_index.md` | Add tailored cross-link callout. |
| `content/influxdb3/cloud-serverless/_index.md` | Add tailored cross-link callout. |
| `content/influxdb3/clustered/_index.md` | Add tailored cross-link callout. |
| `content/platform/faq.md` | Add one cross-link Q&A pointing to the new page. |

**Test:**

| Path | Responsibility |
|---|---|
| `cypress/e2e/content/which-influxdb-3.cy.js` | E2E: canonical URL loads, all 7 FAQ Q&As render, JSON-LD present on canonical only, hub renders with children + FAQ. |

---

## Task 1: Create the FAQ data file

**Files:**
- Create: `data/faqs/which-influxdb-3.yml`

- [ ] **Step 1: Create the data file with the 7 Q&As**

Create `data/faqs/which-influxdb-3.yml`:

```yaml
- question: "What's the difference between InfluxDB 1, InfluxDB 2, and InfluxDB 3?"
  answer: |
    InfluxDB 3 is the current generation — a rewritten storage and query engine
    based on Apache Arrow and Parquet, with SQL and InfluxQL as query languages.
    InfluxDB 1 and InfluxDB 2 are previous generations in maintenance: v1 uses
    the TSM storage engine and InfluxQL; v2 adds a new API surface. For new
    projects, use InfluxDB 3.

- question: "Should I start a new project on InfluxDB 1 or InfluxDB 2?"
  answer: |
    No. Start new projects on InfluxDB 3. InfluxDB 1 and 2 remain supported
    for existing deployments but receive no new features. InfluxDB 3
    Enterprise is the recommended target for production workloads.

- question: "I run InfluxDB 2 today — should I migrate to InfluxDB 3?"
  answer: |
    Plan a migration when you need features only available in v3 (SQL, Apache
    Arrow/Parquet storage, unlimited cardinality, the Processing Engine), or
    when v2's maintenance status becomes a constraint. Migration paths exist
    from both InfluxDB 2 OSS and InfluxDB Cloud (TSM) to InfluxDB 3 Enterprise.

- question: "I run InfluxDB 1 today — should I migrate to InfluxDB 3?"
  answer: |
    Yes, when feasible. InfluxDB 3 supports InfluxQL, so most v1 queries
    continue to work. The data model and line protocol write format are
    compatible. Migration guides cover InfluxDB 1 OSS and InfluxDB Enterprise
    1.x to InfluxDB 3 Enterprise.

- question: "Is InfluxDB 3 Cloud Serverless the same as InfluxDB 3 Enterprise?"
  answer: |
    No. Cloud Serverless runs on the v3 storage engine but exposes a different
    API surface — it does not provide the native v3 write API or the Processing
    Engine, and uses v1/v2-compatible endpoints. Choose Cloud Serverless for
    pay-as-you-go multi-tenant cloud usage or continuity from InfluxDB Cloud
    (TSM). Choose Enterprise for the full v3 API surface, Processing Engine,
    and dedicated deployment.

- question: "Which query languages does InfluxDB 3 support?"
  answer: |
    SQL and InfluxQL. SQL is the primary query language; InfluxQL is supported
    for compatibility with InfluxDB 1 and 2 workloads.

- question: "Where does InfluxDB 3 Explorer fit?"
  answer: |
    InfluxDB 3 Explorer is a web-based UI for querying, visualizing, and
    administering InfluxDB 3. It works with InfluxDB 3 Core and InfluxDB 3
    Enterprise.
```

- [ ] **Step 2: Validate YAML parses**

Run: `node -e "console.log(require('js-yaml').load(require('fs').readFileSync('data/faqs/which-influxdb-3.yml', 'utf8')).length)"`

Expected: `7`

- [ ] **Step 3: Commit**

```bash
git add data/faqs/which-influxdb-3.yml
git commit -m "feat(influxdb3): add FAQ data for 'which InfluxDB 3' decision page"
```

---

## Task 2: Create the `{{< faq >}}` shortcode

**Files:**
- Create: `layouts/shortcodes/faq.html`

- [ ] **Step 1: Create the shortcode**

Create `layouts/shortcodes/faq.html`:

```go-html-template
{{- $key := .Page.Params.faq_data -}}
{{- if not $key -}}
  {{- errorf "faq shortcode requires faq_data frontmatter on the page (%s)" .Page.RelPermalink -}}
{{- end -}}
{{- $faqs := index .Site.Data.faqs $key -}}
{{- if not $faqs -}}
  {{- errorf "faq shortcode: no data file at data/faqs/%s.yml (page %s)" $key .Page.RelPermalink -}}
{{- end -}}
{{ range $faqs }}
## {{ .question }}

{{ .answer }}
{{ end }}
```

- [ ] **Step 2: Verify the shortcode parses by running Hugo build**

The shortcode isn't called from any page yet, so a full build should still succeed.

Run: `npx hugo --quiet`

Expected: exit 0, no errors mentioning `faq.html`.

- [ ] **Step 3: Commit**

```bash
git add layouts/shortcodes/faq.html
git commit -m "feat(layouts): add faq shortcode driven by data/faqs/*.yml"
```

---

## Task 3: Create the canonical shared body

**Files:**
- Create: `content/shared/influxdb3/which-influxdb-3.md`

- [ ] **Step 1: Create the shared body**

Create `content/shared/influxdb3/which-influxdb-3.md` (body-only, no frontmatter — per the shared-vs-stub convention):

```markdown
{{< children type="articles" hlevel="h2" filterOut="Which InfluxDB 3 should I use?" >}}

For new production workloads, use **InfluxDB 3 Enterprise**.
Start with **InfluxDB 3 Core** to evaluate the v3 engine.
Choose **Cloud Serverless** only if you are an existing InfluxDB Cloud (TSM)
customer or need pay-as-you-go multi-tenant cloud usage.
InfluxDB 1 and InfluxDB 2 are in maintenance — migrate new and existing
production workloads to InfluxDB 3.

## The short answer

| Your situation | Use this |
|---|---|
| Building a new production deployment | InfluxDB 3 Enterprise |
| Evaluating v3, single node, open source | InfluxDB 3 Core |
| Existing InfluxDB Cloud (TSM) customer | InfluxDB 3 Cloud Serverless |
| Running InfluxDB 1 or InfluxDB 2 today | Migrate to InfluxDB 3 Enterprise |

## InfluxDB 3 Enterprise — the production answer

InfluxDB 3 Enterprise is a diskless, object-storage-backed time series
database delivered as a single binary. Deploy it where it fits:

- **Self-managed** — your hardware or VMs, single or multi-node
- **Managed** (currently [InfluxDB Cloud Dedicated](/influxdb3/cloud-dedicated/)) — InfluxData operates it for you
- **Kubernetes** (currently [InfluxDB Clustered](/influxdb3/clustered/)) — you operate it on Kubernetes

All three deployment options run the same engine, the same APIs, and the same
Processing Engine.

Choose Enterprise when you need:

- High availability and multi-node deployment
- Long-range historical queries with compaction
- ISO 27001 and SOC 2 security certifications
- Commercial support

[Get started with InfluxDB 3 Enterprise](/influxdb3/enterprise/get-started/)

## InfluxDB 3 Core — open source, single-node

InfluxDB 3 Core is the open source, single-node release of the v3 engine.
Use Core to evaluate v3, run edge or non-critical workloads, or develop
against the v3 APIs before deploying Enterprise.

Choose Core when:

- You need a free, open source v3 database
- A single node meets your throughput and availability requirements
- You want to develop and test against the native v3 write and query APIs

Upgrade to Enterprise when you need high availability, replicas, or
long-range compaction.

[Get started with InfluxDB 3 Core](/influxdb3/core/get-started/)

## InfluxDB 3 Cloud Serverless — multi-tenant, usage-based

InfluxDB 3 Cloud Serverless is a multi-tenant cloud service. It runs on the
v3 storage engine but exposes a different API surface than Core and Enterprise:

- No native v3 write API — use v1 and v2 compatibility endpoints
- No Processing Engine
- Multi-tenant; usage-based pricing

Choose Cloud Serverless when:

- You are an existing InfluxDB Cloud (TSM) customer
- You want pay-as-you-go multi-tenant cloud usage
- You do not need the native v3 API surface or the Processing Engine

[Get started with InfluxDB 3 Cloud Serverless](/influxdb3/cloud-serverless/get-started/)

## Coming from InfluxDB 1 or InfluxDB 2?

InfluxDB 1 and InfluxDB 2 are in maintenance and receive no new features.
For new projects and for production workloads that need v3 features
(SQL, Apache Arrow/Parquet, unlimited cardinality, Processing Engine),
plan a migration to InfluxDB 3 Enterprise.

- [Migrate from InfluxDB 1 or 2 to InfluxDB 3 Enterprise](/influxdb3/enterprise/get-started/migrate-from-influxdb-v1-v2/)
- [Migrate from InfluxDB 1 to InfluxDB 3 Core](/influxdb3/core/get-started/migrate-from-influxdb-v1-v2/)

## Frequently asked questions

{{< faq >}}

## Related

- [InfluxDB 3 Enterprise product FAQ](https://www.influxdata.com/products/influxdb3-enterprise/#faq) — for InfluxDB 3 Core vs Enterprise specifics
- [What is time series data?](/platform/faq/)
```

> **Implementer note:** the migration URLs above (`/influxdb3/enterprise/get-started/migrate-from-influxdb-v1-v2/` and `/influxdb3/core/get-started/migrate-from-influxdb-v1-v2/`) were verified during plan revision. The single migration page covers both v1 and v2 sources. If the URL slugs change later, update them here.

- [ ] **Step 2: Verify Hugo build still succeeds**

Run: `npx hugo --quiet`

Expected: exit 0. The shared file isn't referenced by any stub yet, so it's still inert.

- [ ] **Step 3: Commit**

```bash
git add content/shared/influxdb3/which-influxdb-3.md
git commit -m "feat(influxdb3): add shared body for 'which InfluxDB 3' page"
```

---

## Task 4: Create the canonical page stub and verify rendering

**Files:**
- Create: `content/influxdb3/which-influxdb-3.md`

- [ ] **Step 1: Create the stub**

Create `content/influxdb3/which-influxdb-3.md`:

```markdown
---
title: Which InfluxDB 3 should I use?
description: >
  Decision guide for choosing between InfluxDB 3 Enterprise, Core, and
  Cloud Serverless, and for migrating from InfluxDB 1 or InfluxDB 2.
source: /shared/influxdb3/which-influxdb-3.md
faq_data: which-influxdb-3
faq_canonical: true
---
```

> **Implementer note on `menu:` frontmatter:** the canonical decision page deliberately omits `menu:`. The page is cross-cutting (not owned by any single v3 product), and existing product menus (`influxdb3_enterprise:`, `influxdb3_core:`, etc.) are product-scoped. Discovery is via direct URL, llms.txt entry (Task 9), per-product cross-link callouts (Task 10), and the hub landing (Task 8) — sidebar nav inside a single product would imply false ownership.

- [ ] **Step 2: Build the site and verify the canonical page renders**

Run: `npx hugo --quiet && test -f public/influxdb3/which-influxdb-3/index.html && echo OK`

Expected: `OK`

- [ ] **Step 3: Verify the FAQ Q&As render in HTML**

Run: `grep -c "What's the difference between InfluxDB 1" public/influxdb3/which-influxdb-3/index.html`

Expected: `1` (or higher)

Run: `grep -c "Where does InfluxDB 3 Explorer fit" public/influxdb3/which-influxdb-3/index.html`

Expected: `1` (or higher)

- [ ] **Step 4: Verify all 7 FAQ questions are rendered**

Run:

```bash
for q in "difference between InfluxDB 1" "start a new project on InfluxDB 1" \
  "I run InfluxDB 2 today" "I run InfluxDB 1 today" \
  "Cloud Serverless the same as InfluxDB 3 Enterprise" \
  "query languages does InfluxDB 3" "Explorer fit"; do
  c=$(grep -c "$q" public/influxdb3/which-influxdb-3/index.html)
  echo "[$c] $q"
done
```

Expected: every line shows `[1]` or higher.

- [ ] **Step 5: Commit**

```bash
git add content/influxdb3/which-influxdb-3.md
git commit -m "feat(influxdb3): add canonical 'which InfluxDB 3' decision page stub"
```

---

## Task 5: Create the FAQ JSON-LD partial

**Files:**
- Create: `layouts/partials/head/faq-jsonld.html`

- [ ] **Step 1: Create the partial**

Create `layouts/partials/head/faq-jsonld.html`:

```go-html-template
{{- if and .Params.faq_data .Params.faq_canonical -}}
  {{- $faqs := index .Site.Data.faqs .Params.faq_data -}}
  {{- if $faqs -}}
    {{- $entities := slice -}}
    {{- range $faqs -}}
      {{- $entity := dict
          "@type" "Question"
          "name" .question
          "acceptedAnswer" (dict
            "@type" "Answer"
            "text" (.answer | markdownify | plainify | strings.TrimSpace)
          )
      -}}
      {{- $entities = $entities | append $entity -}}
    {{- end -}}
    {{- $jsonld := dict
        "@context" "https://schema.org"
        "@type" "FAQPage"
        "mainEntity" $entities
    -}}
    <script type="application/ld+json">
{{ jsonify (dict "indent" "  ") $jsonld }}
    </script>
  {{- end -}}
{{- end -}}
```

- [ ] **Step 2: Verify the partial parses (still inert until included from header)**

Run: `npx hugo --quiet`

Expected: exit 0, no errors mentioning `faq-jsonld.html`.

- [ ] **Step 3: Commit**

```bash
git add layouts/partials/head/faq-jsonld.html
git commit -m "feat(layouts): add FAQPage JSON-LD partial gated on faq_canonical"
```

---

## Task 6: Include the JSON-LD partial in header and verify emission

**Files:**
- Modify: `layouts/partials/header.html` (insert after `{{ partial "header/canonical.html" . }}`)

- [ ] **Step 1: Add the partial include in `<head>`**

In `layouts/partials/header.html`, find the line:

```
    {{ partial "header/canonical.html" . }}
```

Insert immediately after it:

```
    {{ partial "head/faq-jsonld.html" . }}
```

- [ ] **Step 2: Rebuild and verify the canonical page emits JSON-LD**

Run: `npx hugo --quiet && grep -c 'application/ld+json' public/influxdb3/which-influxdb-3/index.html`

Expected: `1`

- [ ] **Step 3: Verify the FAQPage structure**

Run: `grep -c '"@type": "FAQPage"' public/influxdb3/which-influxdb-3/index.html`

Expected: `1`

Run: `grep -c '"@type": "Question"' public/influxdb3/which-influxdb-3/index.html`

Expected: `7`

- [ ] **Step 4: Verify other pages do NOT emit FAQPage JSON-LD**

Run: `grep -c 'application/ld+json' public/influxdb3/enterprise/index.html public/influxdb3/core/index.html 2>/dev/null | grep -v ':0$' || echo "no FAQ JSON-LD on other pages — OK"`

Expected: `no FAQ JSON-LD on other pages — OK`

- [ ] **Step 5: Commit**

```bash
git add layouts/partials/header.html
git commit -m "feat(layouts): include FAQ JSON-LD partial in head"
```

---

## Task 7: Validate JSON-LD with Google Rich Results Test (manual gate)

This is a manual validation step. The implementer must complete it before continuing.

- [ ] **Step 1: Start the dev server**

Run: `npx hugo server`

Expected: server starts at `http://localhost:1313`.

- [ ] **Step 2: Tunnel the dev server for public access**

Use `ngrok` or equivalent to expose `localhost:1313` publicly:

```bash
ngrok http 1313
```

Note the public URL.

- [ ] **Step 3: Run Google Rich Results Test**

Visit: https://search.google.com/test/rich-results

Enter URL: `<ngrok-url>/influxdb3/which-influxdb-3/`

Expected results:
- Page is eligible for rich results
- 1 detected item: `FAQ`
- 7 items inside the FAQ detected item (all 7 questions)
- 0 errors, 0 warnings

If validation fails, fix issues in `layouts/partials/head/faq-jsonld.html` and re-run.

- [ ] **Step 4: Stop the dev server and ngrok**

Stop both processes.

- [ ] **Step 5: Record validation outcome in a commit message (no file changes)**

If validation passed cleanly with no changes needed, no commit. If you needed to fix the partial, commit:

```bash
git add layouts/partials/head/faq-jsonld.html
git commit -m "fix(layouts): correct FAQ JSON-LD shape per Rich Results validation"
```

---

## Task 8: Create the new `/influxdb3/` hub landing

**Files:**
- Create: `content/influxdb3/_index.md`

- [ ] **Step 1: Create the hub stub**

Create `content/influxdb3/_index.md`:

```markdown
---
title: InfluxDB 3
description: >
  InfluxDB 3 is the current generation of the InfluxDB time series database,
  with SQL and InfluxQL support, Apache Arrow and Parquet storage, and
  multiple deployment options. Choose between Enterprise, Core, and Cloud
  Serverless based on your workload and operational needs.
source: /shared/influxdb3/which-influxdb-3.md
faq_data: which-influxdb-3
canonical: /influxdb3/which-influxdb-3/
---
```

Notes:

- This stub deliberately **omits** `faq_canonical: true` so the hub does NOT emit FAQPage JSON-LD (canonical equity stays on the slug URL).
- This stub deliberately **omits** `menu:` — the hub is the section landing for `/influxdb3/` and is automatically reachable as such; no product-scoped menu placement applies.

- [ ] **Step 2: Rebuild and verify hub renders**

Run: `npx hugo --quiet && test -f public/influxdb3/index.html && echo OK`

Expected: `OK`

- [ ] **Step 3: Verify hub renders the children list**

Run: `grep -c "InfluxDB 3 Enterprise" public/influxdb3/index.html`

Expected: at least `1`. The `{{< children >}}` shortcode pulls product names from the v3 product index files.

- [ ] **Step 4: Verify hub renders the FAQ**

Run: `grep -c "What's the difference between InfluxDB 1" public/influxdb3/index.html`

Expected: `1` (or higher)

- [ ] **Step 5: Verify hub does NOT emit FAQPage JSON-LD**

Run: `grep -c 'application/ld+json' public/influxdb3/index.html`

Expected: `0`

- [ ] **Step 6: Verify hub canonical points to the slug URL**

Run: `grep 'rel="canonical"' public/influxdb3/index.html`

Expected: `<link rel="canonical" href=".*/influxdb3/which-influxdb-3/" />`

- [ ] **Step 7: Commit**

```bash
git add content/influxdb3/_index.md
git commit -m "feat(influxdb3): add /influxdb3/ hub landing with children + FAQ"
```

---

## Task 9: Add `## Choosing InfluxDB` section to llms.txt

**Files:**
- Modify: `layouts/index.llmstxt.txt`

- [ ] **Step 1: Add the new section above `## InfluxDB 3`**

In `layouts/index.llmstxt.txt`, find this block:

```
## InfluxDB 3

- [InfluxDB 3 Core](influxdb3/core/index.section.md): Open source time series database optimized for real-time data
```

Insert immediately above it:

```
## Choosing InfluxDB

- [Which InfluxDB 3 should I use?](influxdb3/which-influxdb-3.md): Decision guide for choosing between InfluxDB 3 Enterprise, Core, and Cloud Serverless, and for migrating from InfluxDB 1 or InfluxDB 2.

## InfluxDB 3
```

- [ ] **Step 2: Rebuild and verify the llms.txt entry**

Run: `npx hugo --quiet && grep -A2 "Choosing InfluxDB" public/llms.txt`

Expected: shows the new section heading and the link line.

- [ ] **Step 3: Verify the linked Markdown alternate exists or 404 is acceptable**

Run: `test -f public/influxdb3/which-influxdb-3.md && echo "md exists" || echo "md does not exist (acceptable — Markdown twin generation is parallel work)"`

Expected: either outcome. Markdown twin generation is the parallel Phase 0 workstream (per the design spec section 5.4).

- [ ] **Step 4: Commit**

```bash
git add layouts/index.llmstxt.txt
git commit -m "feat(llms.txt): add Choosing InfluxDB section pointing to decision page"
```

---

## Task 10: Add cross-link callouts on v3 product index pages

**Files:**
- Modify: `content/shared/influxdb3/_index.md` (sourced by Core and Enterprise)
- Modify: `content/influxdb3/cloud-dedicated/_index.md`
- Modify: `content/influxdb3/cloud-serverless/_index.md`
- Modify: `content/influxdb3/clustered/_index.md`

- [ ] **Step 1: Add callout to Core + Enterprise shared body**

In `content/shared/influxdb3/_index.md`, insert at the top of the file (before the existing first paragraph):

```markdown
> [!Tip]
> Comparing InfluxDB 3 products or migrating from InfluxDB 1 or 2?
> See [Which InfluxDB 3 should I use?](/influxdb3/which-influxdb-3/)
> for the decision guide.

```

- [ ] **Step 2: Audit each remaining product `_index.md` for source-frontmatter usage**

Run: `grep -H "^source:" content/influxdb3/cloud-dedicated/_index.md content/influxdb3/cloud-serverless/_index.md content/influxdb3/clustered/_index.md 2>/dev/null`

If any of these uses `source:`, edit the source file instead of the per-product file in the steps below. (Per the design implementation note in section 5.2.)

- [ ] **Step 3: Add callout to Cloud Dedicated**

At the top of `content/influxdb3/cloud-dedicated/_index.md` (after frontmatter, before existing first paragraph; or in the shared source if `source:` is set):

```markdown
> [!Tip]
> Choosing between Cloud Dedicated and other InfluxDB 3 deployment options?
> See [Which InfluxDB 3 should I use?](/influxdb3/which-influxdb-3/).

```

- [ ] **Step 4: Add callout to Cloud Serverless**

At the top of `content/influxdb3/cloud-serverless/_index.md` (after frontmatter or in shared source):

```markdown
> [!Tip]
> Comparing Cloud Serverless to InfluxDB 3 Enterprise?
> See [Which InfluxDB 3 should I use?](/influxdb3/which-influxdb-3/) —
> Cloud Serverless has a different API surface than Enterprise.

```

- [ ] **Step 5: Add callout to Clustered**

At the top of `content/influxdb3/clustered/_index.md` (after frontmatter or in shared source):

```markdown
> [!Tip]
> Choosing between Clustered and other InfluxDB 3 deployment options?
> See [Which InfluxDB 3 should I use?](/influxdb3/which-influxdb-3/).

```

- [ ] **Step 6: Rebuild and verify each callout renders**

Run:

```bash
npx hugo --quiet
for f in public/influxdb3/core/index.html \
         public/influxdb3/enterprise/index.html \
         public/influxdb3/cloud-dedicated/index.html \
         public/influxdb3/cloud-serverless/index.html \
         public/influxdb3/clustered/index.html; do
  c=$(grep -c "which-influxdb-3" "$f" 2>/dev/null || echo 0)
  echo "[$c] $f"
done
```

Expected: every line shows `[1]` or higher (link to `/influxdb3/which-influxdb-3/`).

- [ ] **Step 7: Commit**

```bash
git add content/shared/influxdb3/_index.md \
        content/influxdb3/cloud-dedicated/_index.md \
        content/influxdb3/cloud-serverless/_index.md \
        content/influxdb3/clustered/_index.md
git commit -m "docs(influxdb3): add cross-link callouts to decision page"
```

---

## Task 11: Add cross-link Q&A to `content/platform/faq.md`

**Files:**
- Modify: `content/platform/faq.md`

- [ ] **Step 1: Add the pointer Q&A**

In `content/platform/faq.md`, find the link list at the top:

```markdown
[What is time series data?](#what-is-time-series-data)  
[Why shouldn't I just use a relational database?](#why-shouldn-t-i-just-use-a-relational-database)  
```

Append a line:

```markdown
[Which version of InfluxDB should I use?](#which-version-of-influxdb-should-i-use)  
```

At the bottom of the file, add a new H2:

```markdown
## Which version of InfluxDB should I use?
For new projects, use InfluxDB 3.
See [Which InfluxDB 3 should I use?](/influxdb3/which-influxdb-3/)
for a decision guide across InfluxDB 3 products and migration
from InfluxDB 1 or InfluxDB 2.
```

- [ ] **Step 2: Rebuild and verify the cross-link renders**

Run: `npx hugo --quiet && grep -c "which-influxdb-3" public/platform/faq/index.html`

Expected: at least `1`

- [ ] **Step 3: Commit**

```bash
git add content/platform/faq.md
git commit -m "docs(platform): add cross-link Q&A pointing to InfluxDB 3 decision page"
```

---

## Task 12: Write Cypress E2E test for the decision page

**Files:**
- Create: `cypress/e2e/content/which-influxdb-3.cy.js`

- [ ] **Step 1: Write the failing test**

Create `cypress/e2e/content/which-influxdb-3.cy.js`:

```javascript
describe('Which InfluxDB 3 decision page', () => {
  const canonicalUrl = '/influxdb3/which-influxdb-3/';
  const hubUrl = '/influxdb3/';

  describe(`Canonical page (${canonicalUrl})`, () => {
    beforeEach(() => cy.visit(canonicalUrl));

    it('renders the H1', () => {
      cy.get('h1').should('contain.text', 'Which InfluxDB 3 should I use');
    });

    it('renders all 7 FAQ questions as H2s', () => {
      const questions = [
        "What's the difference between InfluxDB 1, InfluxDB 2, and InfluxDB 3?",
        'Should I start a new project on InfluxDB 1 or InfluxDB 2?',
        'I run InfluxDB 2 today',
        'I run InfluxDB 1 today',
        'Is InfluxDB 3 Cloud Serverless the same as InfluxDB 3 Enterprise?',
        'Which query languages does InfluxDB 3 support?',
        'Where does InfluxDB 3 Explorer fit?',
      ];
      questions.forEach((q) => {
        cy.contains('h2', q).should('exist');
      });
    });

    it('emits FAQPage JSON-LD with 7 questions', () => {
      cy.get('script[type="application/ld+json"]').then(($scripts) => {
        const faqScript = [...$scripts]
          .map((s) => JSON.parse(s.textContent))
          .find((j) => j['@type'] === 'FAQPage');
        expect(faqScript, 'FAQPage JSON-LD present').to.exist;
        expect(faqScript.mainEntity).to.have.length(7);
        faqScript.mainEntity.forEach((q) => {
          expect(q['@type']).to.equal('Question');
          expect(q.acceptedAnswer['@type']).to.equal('Answer');
          expect(q.acceptedAnswer.text).to.be.a('string').and.not.empty;
        });
      });
    });

    it('self-canonicals', () => {
      cy.get('link[rel="canonical"]').should(
        'have.attr',
        'href',
        new RegExp(`${canonicalUrl}$`).source.replace(/\$$/, '')
      );
    });
  });

  describe(`Hub landing (${hubUrl})`, () => {
    beforeEach(() => cy.visit(hubUrl));

    it('renders the FAQ', () => {
      cy.contains('h2', 'What').should('exist');
      cy.contains("What's the difference between InfluxDB 1").should('exist');
    });

    it('renders the children list (linked product names)', () => {
      ['Core', 'Enterprise', 'Cloud Dedicated', 'Cloud Serverless', 'Clustered']
        .forEach((name) => cy.contains(name).should('exist'));
    });

    it('does NOT emit FAQPage JSON-LD (canonical equity stays on slug URL)', () => {
      cy.get('script[type="application/ld+json"]').each(($s) => {
        try {
          const j = JSON.parse($s[0].textContent);
          expect(j['@type']).to.not.equal('FAQPage');
        } catch (e) {
          // non-JSON content is fine
        }
      });
    });

    it('canonical-points to the slug URL', () => {
      cy.get('link[rel="canonical"]').should(
        'have.attr',
        'href'
      ).and('match', /\/influxdb3\/which-influxdb-3\/?$/);
    });
  });
});
```

- [ ] **Step 2: Run the E2E test**

Run:

```bash
node cypress/support/run-e2e-specs.js --spec "cypress/e2e/content/which-influxdb-3.cy.js"
```

Expected: all 8 test cases pass.

If any case fails, fix the underlying content/template — do not weaken the test.

- [ ] **Step 3: Commit**

```bash
git add cypress/e2e/content/which-influxdb-3.cy.js
git commit -m "test(cypress): add E2E suite for which InfluxDB 3 decision page"
```

---

## Task 13: Final validation suite

- [ ] **Step 1: Run Vale on the new and modified content files**

Run:

```bash
.ci/vale/vale.sh \
  content/shared/influxdb3/which-influxdb-3.md \
  content/influxdb3/which-influxdb-3.md \
  content/influxdb3/_index.md \
  content/platform/faq.md \
  content/shared/influxdb3/_index.md \
  content/influxdb3/cloud-dedicated/_index.md \
  content/influxdb3/cloud-serverless/_index.md \
  content/influxdb3/clustered/_index.md
```

Expected: 0 errors. Warnings and suggestions are acceptable but worth a quick review.

- [ ] **Step 2: Run link-checker on the new and modified content**

```bash
# Map markdown to built HTML, then check
for f in content/influxdb3/which-influxdb-3.md content/influxdb3/_index.md \
         content/platform/faq.md; do
  link-checker map "$f" | xargs link-checker check
done
```

Expected: 0 broken links. If any in-repo migration guide URLs are broken, update the shared body (Task 3) and re-run.

- [ ] **Step 3: Run the full Cypress suite for content changes**

Run: `yarn test:e2e`

Expected: all suites pass. Pay attention to any sidebar / nav tests that may have changed because of the new `/influxdb3/` hub landing.

- [ ] **Step 4: Smoke test the dev server manually**

Run: `npx hugo server`

Visit in browser:

1. `http://localhost:1313/influxdb3/` — verify hub renders with children + FAQ; no FAQPage JSON-LD (View Source → search `application/ld+json`); canonical link points to `/influxdb3/which-influxdb-3/`
2. `http://localhost:1313/influxdb3/which-influxdb-3/` — verify all sections + 7 FAQ Q&As; FAQPage JSON-LD present; self-canonical
3. `http://localhost:1313/influxdb3/core/`, `/enterprise/`, `/cloud-dedicated/`, `/cloud-serverless/`, `/clustered/` — verify cross-link callout renders at top of each
4. `http://localhost:1313/platform/faq/` — verify the new "Which version of InfluxDB should I use?" Q&A appears

- [ ] **Step 5: Final commit (if any fixes from Steps 1–4)**

If any of the validation steps surfaced fixes, commit them. If everything was clean, no commit needed.

---

## Task 14: Prepare PR

- [ ] **Step 1: Review the commit history**

Run: `git log --oneline master..HEAD`

Expected: ~10-12 commits, one per substantive task, with conventional-commit-style messages.

- [ ] **Step 2: Push and open PR**

Run:

```bash
git push -u origin worktree-add-decision-pages
gh pr create \
  --title 'feat(influxdb3): "Which InfluxDB 3 should I use?" decision page' \
  --body "$(cat <<'EOF'
## Summary

- Adds canonical `/influxdb3/which-influxdb-3/` decision page with 7 FAQ Q&As driven by a Hugo data file
- Adds new `/influxdb3/` hub landing (didn't exist before) that transcludes the same body
- Adds `{{< faq >}}` shortcode and `FAQPage` JSON-LD partial gated on `faq_canonical`
- Adds `## Choosing InfluxDB` section to `llms.txt`
- Adds per-product cross-link callouts (Core, Enterprise, Cloud Dedicated, Cloud Serverless, Clustered)
- Adds cross-link Q&A to `/platform/faq/`

Implements Phase 0 item #4 from `docs/plans/2026-05-11-ai-visibility.md`. Design spec at `docs/plans/2026-05-11-which-influxdb-3-decision-page-design.md`.

## Test plan

- [ ] Cypress E2E suite passes (`cypress/e2e/content/which-influxdb-3.cy.js`)
- [ ] Vale: 0 errors on changed content
- [ ] link-checker: 0 broken links on changed content
- [ ] Google Rich Results Test: canonical page emits 1 FAQ rich result with 7 questions, 0 errors
- [ ] Manual: hub landing renders without FAQPage JSON-LD (canonical equity routed correctly)
- [ ] Manual: each v3 product index page renders the cross-link callout at top
EOF
)"
```

Expected: PR URL returned.

---

## Self-Review Notes

Plan checks against spec sections:

| Spec section | Plan task(s) |
|---|---|
| 3.1 Page content shape | Task 3 (shared body) |
| 3.2 FAQ Q&A list | Task 1 (data file) |
| 3.3 Self-canonical | Task 4 (no `canonical:` field on canonical page → defaults to self) + Task 12 E2E assertion |
| 4 Hub landing | Task 8 |
| 5.1 llms.txt | Task 9 |
| 5.2 Cross-link callouts (per-product wording) | Task 10 |
| 5.3 Platform FAQ cross-link | Task 11 |
| 5.4 Marketing FAQ outbound link | Task 3 (included in "Related" section of shared body) |
| 6 FAQPage JSON-LD | Tasks 5, 6, 7 |
| 7 New Hugo assets | Tasks 1, 2, 5, 6 |
| 8 Files to create/edit | Tasks 1-11 cover every listed file |
| 9 Acceptance criteria | Tasks 4, 6, 7, 8, 9, 10, 11, 12, 13 collectively |
| 10 Quality bar | Editorial responsibility in Task 3 (prose) + Task 13 (Vale lint) |
| 11 Open implementation decisions | Resolved in plan: (1) decision content first / children below — handled via `show_children` flag at top of body; (2) "Choose X when..." wording — baked into Task 3 body; (3) migration URLs — flagged in Task 3 implementer note; (4) FAQ rendering style — flat H2 markdown (per shortcode in Task 2) |

Placeholders / red flags: none found.
Type / property consistency: `faq_data`, `faq_canonical`, `show_children`, `canonical` used consistently across data file, shortcode, partial, and all stubs.
