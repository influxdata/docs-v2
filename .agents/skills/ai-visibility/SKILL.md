---
name: ai-visibility
description: >
  Review documentation PRs, pages, or navigation for visibility to AI
  consumers — crawlers building training corpora, RAG retrievers, and
  autonomous agents — across the model lifecycle (pre-training, training,
  post-training, inference/RAG). Use whenever the user asks how docs appear
  to LLMs or AI agents, asks to review a PR or page for AI visibility,
  discoverability, GEO, or agent experience, or mentions llms.txt,
  llms-full.txt, markdown twins, JSON-LD, canonical links, sitemap-md, or
  "how would a model navigate this" — even if they don't say "AI
  visibility" explicitly. Also covers SEO-relevant frontmatter review
  (titles, descriptions, canonicals) since the same metadata drives both
  search snippets and AI retrieval.
---

# AI visibility review

Review documentation the way AI systems consume it, not the way humans read
it. Different consumers read different surfaces at different times: crawlers
snapshot HTML for training corpora, RAG retrievers fetch Markdown twins and
chunk them, and agents walk URLs and bind to machine-readable contracts.
A page can be excellent for human readers and invisible — or misleading —
to every one of these consumers. This review finds those gaps with
evidence, not assumptions.

## Inputs

Accept any of:

- **A PR**: `gh pr view <N>` and `gh pr diff <N>` for the change; the
  PR preview site for rendered output (see the reference file for preview
  URL shape and its known artifacts).
- **Page URLs**: production or preview.
- **A section or product**: review the navigation graph and discovery
  paths, not just individual pages.

## Step 0: Scope the review before fetching anything

State a one-paragraph review plan first: what the target is, which pages
you will fetch, and which layers matter most for this target. An unscoped
review fetches everything at full depth and burns most of its budget
proving things that were never in doubt.

- **PR**: review the changed pages and the discovery paths they depend
  on. Pre-existing product-wide gaps get one line and a pointer, not a
  re-investigation.
- **Single page**: full depth on that page; discovery paths checked once.
- **Section or product**: sample, don't enumerate. The product root, one
  or two task pages, one reference page, and one API page (if any) reveal
  every defect class; reading all 285 pages reveals the same classes
  slower. Use corpus-level greps (`llms-full.txt`) to measure how
  widespread a defect is after you find it on a sampled page.
- **Match depth to the product**: for a GUI product, the agent-harness
  layer is "what can be done headless" (install, config files), not API
  contracts. For a legacy product, lead with currency and
  compatibility-statement checks. Don't run every layer at uniform depth
  when the target makes a layer mostly moot.

## Step 1: Fetch the surfaces — verify, don't assume

A review is read-only. **Never build the site (`hugo`, `yarn build:*`,
docker) for a review** — everything a review needs is already published
(production, the PR preview) or readable in source (templates, data
files, content). Local builds take minutes, stall in constrained
environments, and leave artifacts in the working tree, and they verify
nothing that a fetch plus a source read doesn't. If a claim can't be
verified from published artifacts and source, label it an inference and
include the one-line command that would verify it.

Every claim in the report must come from a fetched artifact or a read
source file. Three gotchas that produce false findings if skipped:

- **Always `curl --compressed`.** Production serves gzip; raw bytes look
  like binary garbage and a naive fetch "finds" nothing.
- **Minified HTML drops attribute quotes.** `grep '<link rel="canonical"'`
  misses `<link rel=canonical ...>`. Match with quote-tolerant patterns
  (for example `<link[^>]*canonical[^>]*>`) or you will report present
  metadata as missing.
- **Check preview AND production before calling something a bug.** See
  [PR Preview](../../../DOCS-DEPLOYING.md#pr-preview) for deployment behavior
  and known parity gaps. Its advertised Markdown twins 404, so check twin
  fidelity on production or staging. Other preview-only defects need
  investigation; don't dismiss them as expected prefix behavior.

For each page, capture:

| Surface          | What to check                                                                                  |
| ---------------- | ---------------------------------------------------------------------------------------------- |
| `<head>`         | `<title>`, meta description, `<link rel=canonical>`, `<link rel=alternate type=text/markdown>` |
| JSON-LD          | Which `@type` nodes exist, and whether `@id` references resolve (entity graph coherence)       |
| Headings         | h2/h3 hierarchy, stable anchor ids, question-shaped phrasing                                   |
| Markdown twin    | Exists? Served as `text/markdown`? Conversion quality (see Step 3, RAG)                        |
| robots / noindex | Anything blocking AI crawlers from this path                                                   |

### Frontmatter and SEO signals

Frontmatter is the single source for the page's `<title>`, meta
description, JSON-LD fields, and twin metadata — one weak field degrades
every surface at once. Check in the source files (not just rendered
output):

- **`description`**: present, specific to the page, roughly one to two
  sentences. A missing description falls back to generic text; a
  duplicated description (for example, a section landing reusing the
  product root's) makes search snippets interchangeable and page
  embeddings near-identical — the retriever can't tell the pages apart.
  Grep for duplicates across the section; don't check pages one at a
  time.
- **`title`**: distinct within the product, matches how users phrase the
  task. Title is the strongest single retrieval and snippet signal.
- **Canonical intent**: self-canonical by default; a cross-product
  canonical (shared content pointing at the canonical edition) is a
  deliberate consolidation — verify it points where intended, and flag
  it as a trade-off, not a bug, when it's by design.
- **Dates**: `lastmod`/`date` flow into twins, JSON-LD `dateModified`,
  and sitemap `<lastmod>` — stale dates on current content undersell
  freshness to both rankers and agents.

## Step 2: Walk the discovery paths

An AI consumer can only use what it can find. Walk each path end-to-end
and record where it works and where it dead-ends:

1. **`llms.txt` path**: site root `llms.txt` → the product or section
   entry → its artifacts. Check all three granularities: the per-section
   `index.section.md` links, the per-page `.md` twins, and the per-product
   `llms-full.txt` flattened corpus. Verify the corpus file exists (fetch
   it, don't trust the link) and contains the pages under review. A
   product missing from `llms.txt` — or listed without a `llms-full.txt`
   corpus — is invisible to every llms.txt-first agent regardless of page
   quality.
2. **Sitemap path**: `sitemap.xml` and `sitemap-md.xml` → page and twin
   URLs.
3. **HTML head path**: canonical + markdown-alternate + JSON-LD from any
   page reached by crawl or search.
4. **In-site navigation**: hops from the product root to the page; menu
   placement; `related:` links; anchor-deep links.

Report the paths as a table (works / dead end), and trace dead ends to
their cause in code or data — the fix usually lives in a template, a
build script, or a data file, not in the page (see the reference file for
where these live in this repo).

## Step 3: Analyze per consumption layer

Judge each finding by which lifecycle stage it affects. The same page
serves four consumers with different needs and different latencies:

### Pre-training / training (months; shapes the next model generation)

- Is the content server-rendered, public, and crawlable? Anything behind
  authentication, a running instance, or client-side JS is absent from
  every training corpus, permanently.
- What concrete facts can a model memorize from this page? Ports, paths,
  prefixes, version numbers, header schemes. Vague prose trains nothing.
- Name the hallucination risk that gaps create: when docs publish an API's
  conventions but not its surface, future models invent the missing
  endpoints by analogy with products they know better. For new products,
  the first crawl impression is the seed corpus — thin coverage now is
  parametric ignorance later.

### Post-training (instruction and agentic tuning)

- Are examples self-contained and runnable — imports and auth visible, no
  "as in the previous example"? Instruction-tuning corpora favor
  Q\&A-shaped sections and copy-adaptable code.
- Do placeholders follow a consistent, machine-recognizable convention
  (UPPER\_SNAKE tokens with replace-instructions)?

### RAG / retrieval (weeks; the layer you can move now)

- **Chunk quality**: each h2 section should stand alone with the answer in
  its first sentence. Retrievers extract passages without surrounding
  context.
- **Twin fidelity**: read the generated Markdown twin, don't trust that it
  mirrors the HTML. Look for conversion bugs (lost whitespace around links
  and code spans, broken tab-group rendering) and for repeated boilerplate
  (beta banners, sunset notices) consuming the first chunk of every page
  in a section — that makes section pages embed near-identically and
  surfaces the banner instead of the answer.
- **The dead-end test**: for the page's core question, what does a
  docs-grounded assistant retrieve and what can it actually answer? "Check
  your instance" or "see the UI" is a terminal non-answer for every hosted
  assistant.

### Agent harness (immediate)

- Can an agent execute the page's guidance headlessly? Token auth in a
  fenced command beats "log in via the browser."
- Are machine-readable contracts published or fetchable (OpenAPI, JSON
  schema, MCP)? An interactive UI is not a contract.
- Are URL shapes predictable and anchors stable enough to construct from a
  task description? Count the hops from product root to the answer.

## Step 4: Report

Lead with the verdict — what's solid, what's broken, in two or three
sentences. Then:

- **Facts with evidence.** Every finding cites the fetched URL, file path,
  or command output that proves it. Distinguish confirmed facts from
  inferences.
- **Separate findings by level.** Page-level (fix in the content),
  product-level (fix in data or config — for example a missing corpus
  entry), and pipeline-level (fix in shared templates or converters,
  affects all products). Mislabeling a pipeline bug as a page bug sends
  the fix to the wrong place.
- **Prioritized recommendations.** Order by leverage: discovery-path
  breaks first (they gate everything else), then machine-readable
  contract gaps, then content coverage, then twin hygiene.
- **Credit what works.** Inherited infrastructure (head links, JSON-LD,
  sitemap entries) that the change gets for free belongs in the report —
  it scopes the real gaps and prevents re-litigating solved problems.

Produce the report; don't file anything unsolicited. Then offer
follow-ups. If the user accepts:

- File pipeline-caused findings as **general** issues citing the observed
  pages as evidence — not product-scoped issues, which misleads triage.
- For small mechanical fixes (a cross-link, a frontmatter field), prefer a
  direct PR over an issue.

## Repo specifics

Before reviewing anything on docs.influxdata.com or in this repo, read
[DOCS-AI-VISIBILITY.md](../../../DOCS-AI-VISIBILITY.md) — it maps the three
Markdown artifact layers, the eligibility predicates and their source
files, the products.yml gate that controls `llms.txt` inclusion, and the PR
preview workflow's known artifacts. Reviews that skip it rediscover (or
misdiagnose) the same plumbing every time.

[DOCS-DEPLOYING.md](../../../DOCS-DEPLOYING.md#llm-markdown-generation)
covers how those artifacts are generated, if a finding traces back to the
build rather than to content.
