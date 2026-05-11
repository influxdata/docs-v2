# Design: Fix Core canonical routing (AI-visibility Phase 0, item 1)

**Status:** Spec — pending approval.
**Branch:** `fix/claude-worktree-hook` (worktree `fix-canonical-partial`)
**Source plan:** `AI-visibility-for-InfluxDB.md` § 5.1, § 7.2 (Phase 0).
**Scope:** Phase 0 item 1 only (canonical fix). Items 2–6 sketched as follow-up backlog at the end of this document.

---

## 1. Goal and approach

### 1.1 Goal

Stop the unwanted Enterprise-canonical override on the three Core pages whose narrative is Core-owned (landing, install, get-started), without disturbing the intentional shared-source priority routing that correctly canonicalizes engine-concept pages to Enterprise.

### 1.2 LLM-visibility rationale

`rel="canonical"` is honored by crawlers and retrievers for deduplication and citation-equity routing. Today, Core's product-identity pages (`/influxdb3/core/`, `/influxdb3/core/install/`, `/influxdb3/core/get-started/`) point their canonical at Enterprise. The effect: when an LLM is asked "how do I install InfluxDB Core?", retrievers find the Core page, see the canonical → Enterprise, and surface the Enterprise install page instead.

The fix isn't adding visibility for Core — it's stopping Core from leaking its own. RAG/agent effect: next crawl. Base-model effect: next training cut.

### 1.3 Approach

Extend the existing `canonical:` frontmatter to accept the sentinel string `"self"`. Update `layouts/partials/header/canonical.html` to short-circuit on that sentinel **before** the shared-source priority loop runs. Add the sentinel to a tight list of Core pages whose narrative is Core-owned.

### 1.4 Why not the doc's proposed approach

The AI-visibility doc proposes adding a *new* `canonical_url:` frontmatter field and replacing the partial with a simple "if frontmatter then else self" pattern. That proposal mis-describes the current partial: the partial is **not** the Hugo default. It already supports a `canonical:` field (line 8) and implements a deliberate shared-source priority chain (lines 23–41) that encodes which product is canonical for shared engine content (Enterprise > Core > Cloud Dedicated > Clustered > Cloud Serverless > v2 > Cloud).

Removing the priority chain would:

- Force every shared engine-concept page to self-canonical, fragmenting citation/training equity across 5+ product URLs.
- Conflict with the doc's own § 5.1 principle that Enterprise is canonical for shared content.
- Cause a much larger blast radius than the bug warrants.

The bug is narrower than the doc claims: it's that the priority routing is applied uniformly to all source-using Core pages, including product-narrative pages. The fix is an escape hatch, not a rewrite.

### 1.5 Out of scope

- Phase 0 items 2–6 (markdown alternate link, `noindex` on `/__tests__/`, decision page, robots.txt AI-bot policy, `ref-card` shortcode) — sketched as follow-up backlog only.
- Renaming `canonical:` → `canonical_url:` (doc's proposal; current field name stays).
- Cross-product canonical correctness for Cloud Dedicated / Serverless / Clustered / v2 / Telegraf / Flux — the doc states these self-canonical correctly today.
- Broader IA migration under § 5.2.

---

## 2. Template change

**File:** `layouts/partials/header/canonical.html`

### 2.1 Logic order (after change)

1. Default canonical = page's own permalink (unchanged).
2. If `Params.canonical == "self"` → keep self-permalink, **skip remaining branches**. _(new)_
3. Else if `Params.canonical` is a non-empty string → use it as an absolute path (unchanged behavior).
4. Else if `Params.source` is set → apply shared-source priority routing (unchanged).
5. Emit `<link rel="canonical" href="...">`.

### 2.2 Why branch order matters

The `canonical: "self"` check must run **before** the `source:` branch. Otherwise a page with both `source:` and `canonical: self` would still be routed by the priority loop, defeating the fix.

The check must also run **before** the URL-string branch — though `"self"` is unlikely to be a valid URL path, an explicit sentinel check avoids any chance of `<link rel="canonical" href="<baseURL>self">` being emitted on typo.

### 2.3 Diff

Replace lines 7–41 with:

```go-html-template
{{ if eq .Page.Params.canonical "self" }}
  {{/* Explicit self-canonical; overrides shared-source priority routing.
       Use for product-narrative pages (landings, install, quickstart)
       whose `source:` would otherwise route them to a sibling product. */}}
{{ else if .Page.Params.canonical }}
  {{ $scratch.Set "canonicalURL" (print $baseURL .Page.Params.canonical) }}
{{ else if .Page.Params.source }}
  {{ $productPriority := slice
    "/enterprise/"
    "/core/"
    "/cloud-dedicated/"
    "/clustered/"
    "/cloud-serverless/"
    "/v2/"
    "/cloud/"
  }}
  {{ range where (sort .Site.Pages "Section" "desc") "Params.source" "eq" .Page.Params.source }}
    {{ $pagePath := .RelPermalink }}
    {{ range $productPriority }}
      {{ if in $pagePath . }}
        {{ $scratch.Set "canonicalURL" (print $baseURL $pagePath) }}
      {{ end }}
    {{ end }}
  {{ end }}
{{ end }}
```

### 2.4 Backward compatibility

- 10 existing pages set `canonical:` to a URL path (e.g., `/influxdb3/core/reference/client-libraries/v3/go/release-notes/` on Enterprise client-lib release-notes). All continue to work via branch 3.
- 242 Core pages use `source:` without `canonical:`. All continue to route via branch 4 (shared-source priority), exactly as today.
- Verified: no existing content sets `canonical: self` (grep returned zero hits), so the sentinel is unambiguous to introduce.

### 2.5 Edge case: case sensitivity

`canonical: Self` or `canonical: SELF` would fall through to branch 3 and emit a broken `<link rel="canonical" href="<baseURL>Self">`. Mitigation: documentation in `DOCS-FRONTMATTER.md` (case-sensitive value). Silent normalization (`lower`) is rejected because it would mask the same typo class elsewhere.

---

## 3. Per-page audit list

### 3.1 Pages that receive `canonical: self`

| Page                  | File                                              | `source:` set? | Rationale                                                                                                                              |
| --------------------- | ------------------------------------------------- | -------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Core landing          | `content/influxdb3/core/_index.md`                | yes            | Product landing — URL marks SKU identity even when body is shared.                                                                     |
| Install               | `content/influxdb3/core/install.md`               | yes            | `/shared/influxdb3/install.md` uses `{{% show-in %}}` blocks — rendered HTML differs per product. Self-canonical reflects that.        |
| Get-started (landing) | `content/influxdb3/core/get-started/_index.md`    | yes            | Quickstart landing; Core on-ramp entry point.                                                                                          |

Total scope: **3 file edits + 1 partial change**.

### 3.2 Pages in doc § 5.1 taxonomy that need no action

| Page                                                          | Why no action                                                                                                                                                  |
| ------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `content/influxdb3/core/admin/upgrade-to-enterprise.md`       | No `source:` set → already self-canonical by default. Doc lists it for completeness; the partial does not break it.                                            |

### 3.3 Pages explicitly excluded (canonical → Enterprise is correct)

| Page                                                                  | Reason                                                                                                                                          |
| --------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `content/influxdb3/core/release-notes/_index.md`                       | Shared file (`/shared/v3-core-enterprise-release-notes/`), shared version line, no cadence drift between Core and Enterprise.                  |
| `content/influxdb3/core/get-started/setup.md`                          | Enterprise twin exists at `content/influxdb3/enterprise/get-started/setup.md` sourcing the same shared content. Shared on-ramp, not Core-only.  |
| `content/influxdb3/core/get-started/migrate-from-influxdb-v1-v2.md`    | Enterprise twin exists at `content/influxdb3/enterprise/get-started/migrate-from-influxdb-v1-v2.md`. Applies to both products.                  |
| All other 230+ Core pages with `source:` (engine concepts)             | Engine documentation lives once, under Enterprise (doc § 5.1 principle). Current priority routing is the intended behavior.                    |

### 3.4 Frontmatter snippet to apply

For each of the three files in § 3.1, add a single key in the existing YAML frontmatter:

```yaml
canonical: self
```

Place it adjacent to `source:` to make the relationship visible to future editors.

---

## 4. Verification and testing

### 4.1 Local spot-check before commit

```sh
npx hugo --quiet
for p in \
  influxdb3/core/index.html \
  influxdb3/core/install/index.html \
  influxdb3/core/get-started/index.html \
  influxdb3/core/write-data/index.html \
  influxdb3/enterprise/reference/client-libraries/v3/go/release-notes/index.html ; do
  echo "=== $p ==="
  grep -o '<link rel="canonical"[^>]*>' "public/$p"
done
```

Expected output:

| Path                                                                                  | Expected canonical                                                                       |
| ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `influxdb3/core/index.html`                                                            | `/influxdb3/core/`                                                                       |
| `influxdb3/core/install/index.html`                                                    | `/influxdb3/core/install/`                                                               |
| `influxdb3/core/get-started/index.html`                                                | `/influxdb3/core/get-started/`                                                           |
| `influxdb3/core/write-data/index.html`                                                 | a `/influxdb3/enterprise/...` URL (priority routing intact)                              |
| `influxdb3/enterprise/reference/client-libraries/v3/go/release-notes/index.html`       | `/influxdb3/core/reference/client-libraries/v3/go/release-notes/` (URL branch intact)    |

### 4.2 Cypress e2e test (new file)

**Path:** `cypress/e2e/content/canonical.cy.js`

**Test matrix (6 cases, covers all 4 partial branches):**

| Test name                                | URL                                                                                | Expected canonical                                                              | Partial branch exercised |
| ---------------------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ------------------------ |
| Core landing self-canonicals             | `/influxdb3/core/`                                                                 | self                                                                            | new sentinel branch      |
| Core install self-canonicals             | `/influxdb3/core/install/`                                                         | self                                                                            | new sentinel branch      |
| Core quickstart self-canonicals          | `/influxdb3/core/get-started/`                                                     | self                                                                            | new sentinel branch      |
| Engine concept routes to Enterprise      | `/influxdb3/core/write-data/`                                                      | starts-with `/influxdb3/enterprise/`                                            | source priority branch   |
| Explicit canonical URL honored           | `/influxdb3/enterprise/reference/client-libraries/v3/go/release-notes/`            | `/influxdb3/core/reference/client-libraries/v3/go/release-notes/`               | URL string branch        |
| Default self-canonical when no overrides | `/influxdb3/core/admin/upgrade-to-enterprise/`                                     | self                                                                            | default branch           |

### 4.3 Production diff evidence in PR description

Include a before/after table for the three changed pages — production HTML's current canonical vs. local-build canonical after the fix:

```text
| Page                          | Before (production)            | After (local build)            |
|-------------------------------|--------------------------------|--------------------------------|
| /influxdb3/core/              | /influxdb3/enterprise/         | /influxdb3/core/               |
| /influxdb3/core/install/      | /influxdb3/enterprise/install/ | /influxdb3/core/install/       |
| /influxdb3/core/get-started/  | /influxdb3/enterprise/get-...  | /influxdb3/core/get-started/   |
```

The "Before" column is captured once from `https://docs.influxdata.com` using `curl -s <url> | grep canonical`. The "After" column comes from the local Hugo build in § 4.1. This gives reviewers concrete evidence without asking them to diff HTML themselves.

### 4.4 Test command

This is a functionality test (no per-file content mapping), so pass `--no-mapping`:

```sh
node cypress/support/run-e2e-specs.js --spec "cypress/e2e/content/canonical.cy.js" --no-mapping
```

---

## 5. Risks and rollout

### 5.1 Risk register

| Risk                                                                                                              | Severity     | Mitigation                                                                                                                                                       |
| ----------------------------------------------------------------------------------------------------------------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Reviewer wants a 4th or 6th page added to the self-canonical list                                                 | Low          | PR description states the 3-page rationale and links to § 5.1 of the AI-visibility doc; editorial debate happens against that doc, not in this PR.               |
| Frontmatter typo (`canonical: Self`) falls through to URL branch and emits `/Self`                                | Low          | Add a one-line note in `DOCS-FRONTMATTER.md`; case-sensitivity is consistent with Hugo conventions elsewhere.                                                    |
| Short-term SEO/citation regression on the 3 changed pages                                                         | Low–medium   | This is the *intended* effect — the doc accepts the trade. Re-audit per doc § 6 (4–6 weeks post-merge) confirms Core-specific search presence is being built up. |
| Retriever caches lag the new canonical                                                                            | Low          | Time, not code. Re-audit per doc § 6.                                                                                                                            |
| Some other shared-source page also needs self-canonical that this audit missed                                    | Medium       | Acknowledge in PR description; this PR fixes the doc's stated list only. Additional pages get added in follow-up PRs as editorial review identifies them.        |

### 5.2 Rollout

Single PR. After merge:

1. Manual production check: curl the 3 URLs, grep `<link rel="canonical">`, confirm the new canonical is live.
2. Re-audit per AI-visibility doc § 6 in 4–6 weeks: monitor whether Core-specific URLs start surfacing in LLM citations and search engines for `InfluxDB 3 Core install`-shaped queries.

No feature flag, no staged rollout — this is a template change with deterministic output.

### 5.3 Commit / PR structure

Single PR, two commits (or one):

1. `fix(canonical): add 'self' sentinel to canonical partial` — template change only, includes Cypress test
2. `fix(canonical): self-canonical Core landing, install, get-started` — three frontmatter edits

Branch is already `fix/claude-worktree-hook` in the `fix-canonical-partial` worktree.

---

## 6. Phase 0 follow-up backlog (items 2–6)

These are **not** designed in this spec. Each is sketched with enough detail to file as a separate issue / PR. Impact estimates are from the LLM-visibility assessment that informed scoping.

### 6.1 Item 2 — `<link rel="alternate" type="text/markdown">` in `<head>`

**LLM-visibility impact: medium–high (agent / RAG layer).** Markdown twins already exist; this just makes them discoverable from any HTML page without round-tripping through `/llms.txt`.

**Implementation:** one branch in the head partial (likely `layouts/partials/header/head.html`, or wherever head meta currently emits) pointing to the page's `.md` alternate.

**Effort:** ~1 hour template edit + Cypress test verifying the link is emitted with the correct href.

**Risk:** low — additive only.

### 6.2 Item 3 — `noindex` or 404 on `/__tests__/shortcodes/` in production

**LLM-visibility impact: low (training-corpus hygiene).** Robots.txt already disallows but the paths return 200, so any crawler that doesn't strictly honor robots.txt may still ingest shortcode test fixtures.

**Implementation:** conditional `<meta name="robots" content="noindex">` when the path starts with `/__tests__/`. Simpler and more reversible than 404'ing in production.

**Effort:** ~1 hour template change + Cypress test.

**Risk:** low.

### 6.3 Item 4 — "Which InfluxDB 3 should I use?" decision page

**LLM-visibility impact: high — potentially the single biggest editorial bet in Phase 0.** Decision pages collapse the most common LLM-prompt shape ("which X should I use?") into one canonical answer. SKU sprawl is one of the largest visibility taxes today.

**Implementation:** content work (not a template fix). Steps:

- Write the page (honest "when to pick each" matrix across Core / Enterprise / Cloud Dedicated / Cloud Serverless / Clustered).
- Add `FAQPage` JSON-LD inline.
- Add to `llms.txt` as a top-level entry.
- Cross-link from Core/Enterprise landings and from any comparison content.

**Effort:** 1–3 days editorial + ~half-day engineering for the JSON-LD plumbing.

**Risk: quality-dependent.** A perfunctory page is worse than none — LLMs will learn the bad version. Coordinate with marketing's tracker item 16 (competitive language overhaul). Highest leverage, highest variance in Phase 0.

**Dependency on this PR:** the new page should be self-canonical from day one, which depends on the canonical sentinel landing first.

### 6.4 Item 5 — Explicit AI-bot policy in `robots.txt`

**LLM-visibility impact: low direct, medium strategic.** Current file is silent on AI bots. Named `User-agent:` stanzas for GPTBot, OAI-SearchBot, ClaudeBot, anthropic-ai, PerplexityBot, CCBot, Google-Extended — even if all are `Allow:` — document intent and buy optionality for future training-vs-grounding distinction.

**Implementation:** edit `layouts/robots.txt`.

**Effort:** ~1 hour.

**Risk:** low — make sure not to accidentally `Disallow` anything currently allowed.

### 6.5 Item 6 — `ref-card` shortcode + editorial guideline

**LLM-visibility impact: low directly; compounds slowly.** Section-level inline callout listing 3–4 canonical reference links. Per doc § 5.1.1, `ref-card` is "look up while reading" and complements the existing `related:` frontmatter mechanism ("browse after reading").

**Implementation:**

- New shortcode at `layouts/shortcodes/ref-card.html`.
- Editorial guideline in `DOCS-SHORTCODES.md` distinguishing it from `related:`.
- Optional: working examples in `content/example.md`.

**Effort:** ~half-day shortcode + docs.

**Risk:** low.

### 6.6 Dependency graph

```
Item 1 (canonical fix)   ──── independent  ← THIS SPEC
Item 2 (markdown alt)    ──── independent
Item 3 (noindex tests)   ──── independent
Item 5 (robots AI)       ──── independent
Item 6 (ref-card)        ──── independent
Item 4 (decision page)   ──── depends on doc § 5.1 being settled
                                + benefits from Item 1 (canonical correct from day one)
```

Items 1, 2, 3, 5, 6 ship in any order. Item 4 should follow item 1.
