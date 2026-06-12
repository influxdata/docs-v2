# IA sharing mechanism — canonical-honoring validation and decision rubric

**Status:** Decided. Route chosen on field evidence (see "Test results and
decision"). The original "no route until the section-3 test produces data" gate
is lifted: the test, as specified, could not produce an outcome that changed the
action, so it is repurposed as non-blocking before/after validation on the pilot
pages.
**Closes:** [#7233](https://github.com/influxdata/docs-v2/issues/7233) (Phase 2 design review)
**Parent:** [#7230](https://github.com/influxdata/docs-v2/issues/7230) (AI visibility)
**Blocks:** [#7232](https://github.com/influxdata/docs-v2/issues/7232) (job-led IA migration kickoff)
**Related:** [#7245](https://github.com/influxdata/docs-v2/issues/7245) (canonical audit of engine-concept pages)

## Goal

Decide how the job-led IA shares content across Core, Enterprise, and
deployment variants — and decide it on evidence. The IA's "engine docs live
once, thin overlays elsewhere" model needs a sharing mechanism. The original
plan framed the choice as hinging on one unmeasured empirical question: **do LLM
retrievers honor `rel=canonical`?**

That question turns out to be largely answered by published field evidence (see
"Field evidence"), and — more decisively — the decision rubric below contains no
outcome that argues against canonical consolidation. When no test result can
change the action, the test is not a gate. This document therefore picks the
route now, on field evidence and the rubric's own logic, and records it under
"Test results and decision." The section-3 protocol is retained as non-blocking
before/after validation, not as a precondition.

## Intent (the two pillars)

The work this design serves has two pillars, both from the parent epic and the
original (since-lost) AI-visibility plan:

1. **Placement — job-led, anti-dumping.** Content lives where the *task* is, not
   dumped into `/reference/` or a catch-all section. An agent asking "how do I
   downsample with InfluxDB 3" should retrieve a `/process/` page, not a
   reference appendix. This is the #7232 IA concern and overlaps #7245.

2. **Mechanism — inverted transclusion.** Today's pattern is *N thin stubs pull
   from one hidden `content/shared/*.md` source*, and that source is laced with
   `show-in` / `hide-in` conditionals. Three costs fall on readers and
   retrievers: the authoritative body lives at a non-published `/shared/` path
   that is not itself a URL; whoever parses the source wades through
   conditionals; and no single *real* page is the authority — every stub is an
   equal pull from a hidden file. **Inverted** flips this: the full content
   lives at one real, published, canonical page written as clean prose with no
   conditionals, and other products reference or include *from that real page*.
   `N stubs → 1 hidden source` becomes `1 canonical real page ← N consumers`.

## Key reframe

The **readability** half of pillar 2 — authoritative copy is clean prose with
no `show-in`/`hide-in` to parse — wins on reader-UX and agent-parse grounds
**regardless of the test outcome**. The test does not decide *whether* to invert.
It decides **how much to invest in URL consolidation** (canonical tags, `noindex`
on secondary copies, fragment tooling). That bounds the decision: the downside
of a wrong read is bounded effort, not a wrong direction.

## What the repo already has

The #7233 issue frames "Route 1 (transclusion)" as net-new engineering. It is
not. docs-v2 already ships the building blocks:

- **Whole-page transclusion** — `source:` frontmatter + `content/shared/`
  (\~1,485 files). A per-product stub holds frontmatter; the body comes from one
  shared file.
- **Conditional blocks** — `show-in` / `hide-in` shortcodes (\~146 files) vary a
  shared file by consuming product.
- **Canonical signaling** — `canonical:` frontmatter (\~296 files) and
  `alt_links:` (\~206 files).

So the genuinely new piece a transclusion route would need is **sub-page
fragment** includes (reuse a 60-word snippet inline); `source:` is whole-page
only. And the inversion is a *discipline and placement* change to the existing
mechanism, not a new engine. This is scoped in chunk 5, after the decision.

## Validation test (spec — non-blocking before/after)

This protocol is **no longer a gate** on the route decision (see "Test results
and decision"). It is retained, reframed, as before/after validation on the pilot
pages: measure citation behavior before the canonical cleanup, apply the cleanup,
then measure the same pages again. That design removes the content-type confound
of the original contrast pair — the same page is compared against itself, with
only its canonical/`noindex` state changed over time. Run it to confirm the
cleanup did something, not to decide whether to do it.

Per the epic, measurement tooling lives in `influxdata/docs-tooling` and is out
of docs-v2 scope. This document is the **protocol**; execution is manual against
production (already-indexed) content. Reliable per-retriever behavioral intel is
a separate research track that needs the `docs-tooling` pipeline, not this hand-run.

### Targets — before/after on the pilot pages

The original spec compared a contrast pair (Control with canonical, Realistic
without). That pair is confounded: Control is release-notes across 5 products,
Realistic is admin prose across 2–3, so content type and duplicate count vary
alongside the tag. The reframed test instead measures the **same pilot pages
before and after** the cleanup. The contrast-pair targets below are kept only as
an optional secondary observation, not the primary measurement.

The original contrast pair compared two "identical content at multiple live URLs"
situations that differ primarily in whether canonical is declared.

|                   | Content                                                               | Live URLs                                                                                                                                | Canonical state                            |
| ----------------- | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| **Control (C)**   | v3 Python client release notes (byte-identical via one shared source) | 5: `core`, `enterprise`, `clustered`, `cloud-dedicated`, `cloud-serverless` under `/reference/client-libraries/v3/python/release-notes/` | Non-Core copies declare **Core** canonical |
| **Realistic (R)** | `admin/performance-tuning`; replicate with `admin/backup-restore`     | `core` + `enterprise` (backup-restore also `clustered`)                                                                                  | **No canonical declared**                  |

Control verified byte-identical (single `source:`); Core is canonical. Realistic
pages are identical across products but carry no `canonical:` — that absence is
itself the #7245 gap. C and R differ systematically only in the canonical tag,
so the citation delta between them measures what the tag does.

### Retrievers and modes

ChatGPT (browsing on), Claude (web search on), Perplexity, Gemini (search on),
Google AI Overviews. **Browsing/RAG mode is primary** — canonical only matters
when a retriever indexes URLs. Record a plain/no-browsing pass separately as
"which URL does the model *recall* from training," noting it is not a canonical
test.

### Prompts

3–5 natural prompts per target, phrased as a user or agent asks. Examples:

- **C:** "What changed in the latest influxdb3-python client release?";
  "Show the release notes for the InfluxDB 3 Python client."
- **R:** "How do I tune InfluxDB 3 query performance?";
  "What are the steps to back up and restore InfluxDB 3?"

### Coding scheme

Record one row per `query × retriever × repeat`:

- date, retriever, mode, prompt
- verbatim cited InfluxData URL(s)
- classification:
  - **(a)** canonical URL cited
  - **(b)** one non-canonical duplicate cited
  - **(c)** multiple duplicates cited
  - **(d)** neither — third-party or marketing URL
  - **(e)** no citation

### Variance control

N=3 fresh-session repeats per cell. Stamp the date — retriever index freshness
drifts. Rough total: 2 targets × \~4 prompts × \~5 retrievers × 3 ≈ 100
observations. Doable by hand in one sitting.

## Decision rubric (outcome → route)

| Control (canonical present)           | Realistic (no canonical)            | Reading                                             | Route lean                                                                                                                                 |
| ------------------------------------- | ----------------------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Canonical URL cited consistently      | Duplicates scatter across products  | Canonical does real work                            | **Promote #7245 to do-now** (add canonical everywhere) + Route 2 conventional split. Cheap, high-leverage                                  |
| Canonical ignored; duplicates scatter | Duplicates scatter                  | Canonical is cosmetic to retrievers                 | **Inverted transclusion** — one clean readable canonical page; reduce duplicate URL surface (consolidation, `noindex` on secondary copies) |
| Canonical honored                     | Realistic also consolidates somehow | Something other than canonical drives consolidation | Investigate the real signal (sitemap, internal link graph) before investing either way                                                     |
| Mixed across retrievers               | Mixed                               | Partial honoring                                    | **Hybrid** — canonical for cheap consolidation + inverted transclusion for the highest-value pages                                         |

In every row, the readability inversion still proceeds (see Key reframe). The
rubric only sets the consolidation investment.

**Read the rubric column-by-column.** Every route lean — every row — still does
canonical signaling and reduces duplicate URL surface. No outcome says "don't add
canonical." A test whose every branch leads to the same next action has near-zero
decision value for that action. That is the structural reason the canonical
cleanup is not gated on the test.

## Field evidence (2026)

The "do LLM retrievers honor `rel=canonical`" question is less unmeasured than the
original framing assumed. The major AI retrievers do not form independent opinions
about canonical — they inherit the canonical handling of the search indexes they
ride on, so the effect happens at the **index/dedup layer, upstream of the LLM**:

- **ChatGPT search** runs largely on Bing's index (reported \~92% of grounded
  queries). Bing treats canonical as a consolidation signal, so ChatGPT tends to
  cite whatever URL Bing already canonicalized — often before the model layer
  chooses.
- **Google AI Overviews and Gemini grounding** run on Google's index. Google
  honors canonical as a *hint* and can override the declared canonical with its
  own choice; that override cascades into what the AI surface can cite.
- **Perplexity and Claude** (Brave / independent crawl) are the weak-dedup cases —
  more likely to index and cite multiple variants. Between-retriever divergence is
  large: published audits report only \~11% domain overlap between ChatGPT and
  Perplexity citations on identical queries.

Two practical consequences:

1. **`noindex` on true secondary duplicates is the more reliable lever than
   canonical alone.** Google can ignore a canonical hint; it cannot ignore
   `noindex`. The cleanup should be "canonical + selectively `noindex` secondary
   copies," not canonical only. This is adopted from known practice — it does not
   require our own study. **Caveat:** `noindex` is safe only on *pure* duplicates.
   A page that mixes shared reference with per-product usage is not a duplicate;
   `noindex`ing it would suppress distinct content. See "Reference vs usage."
2. **The high between-retriever variance means a hand-run N=3 audit cannot
   reliably separate "canonical consolidates" from noise.** Citation selection is
   stochastic; the variance swamps \~100 observations. Reliable per-retriever
   intel needs the `docs-tooling` measurement pipeline (out of docs-v2 scope per
   the epic), not a one-sitting hand-run.

Sources: Passionfruit (canonical tags and AI citations); Glenn Gabe / GSQI
(canonical-as-hint cascade to ChatGPT; AI search and syndicated content);
ai-visibility.org.uk (how AI search works); Topic Intelligence (per-engine source
selection).

## Test results and decision

**Decision (2026-06-08): Route 1 — promote #7245 canonical cleanup to do-now,
paired with Route 2 conventional split and the readability inversion. The
section-3 measurement is repurposed as non-blocking before/after validation.**

This is the rubric's first row ("canonical does real work → promote #7245 +
conventional split. Cheap, high-leverage"), reached on field evidence rather than
a hand-run audit, for three reasons:

1. **No rubric outcome stops the canonical work.** Every route lean in the table
   still adds canonical signaling and reduces duplicate URL surface. A gating test
   whose every branch leads to the same action has near-zero decision value. The
   action is decided by the structure of the rubric itself.

2. **Field evidence already points to consolidation working at the index layer.**
   The two highest-traffic AI surfaces — ChatGPT (via Bing) and AI Overviews /
   Gemini (via Google) — inherit canonical/dedup decisions from indexes that honor
   the signal (Google as a hint it may override; Bing more directly). Canonical
   cleanup helps these surfaces and classic SEO at once, with no downside, and the
   repo already has the `canonical:` machinery (296 files). It is a no-regret move;
   gating it was the real cost.

3. **The hand-run audit could not have settled it anyway.** N=3 across five
   retrievers with \~11% cross-retriever citation overlap is underpowered for a
   stochastic outcome; variance swamps the signal. And the contrast pair was
   confounded (release-notes-×5 vs admin-prose-×3). The reliable version of that
   measurement belongs in the `docs-tooling` pipeline, out of docs-v2 scope.

**Implementation note carried into #7245:** classify each page first (see
"Reference vs usage") — pure shared reference gets consolidated; per-product
usage stays distinct and indexed. **The urgent pass covers only Core↔Enterprise
shared content (canonical → Enterprise);** reference shared across all v3 editions
(client libraries, etc.) keeps its current canonical and is deferred to the
broader cross-edition IA work. For pure duplicates in scope, consolidate with
**canonical + selective `noindex`**, not canonical alone, since Google can ignore
a canonical hint but not `noindex`. Pair the canonical reference page with
bidirectional links to each product's usage guides. The readability inversion
proceeds regardless, per the Key reframe.

This decision closes #7233 and unblocks #7232. The before/after validation
(section 3, reframed) runs during the pilot conversion (#7298) to confirm the
cleanup consolidated citations; it does not block the migration.

## Reference vs usage — what gets consolidated

Canonical consolidation applies to **shared reference**, not to **per-product
usage**. These are different content types and the cleanup must not collapse them.

| Content type          | Example                                                               | Across products   | Canonical / index treatment                                                                    |
| --------------------- | --------------------------------------------------------------------- | ----------------- | ---------------------------------------------------------------------------------------------- |
| **Shared reference**  | v3 Python client release notes; client API surface                    | byte-identical    | One product owns canonical. Secondary copies `canonical:` → owner; `noindex` if pure duplicate |
| **Per-product usage** | how the client is used in Serverless vs Core; setup, examples, guides | genuinely differs | Each page self-canonical, stays indexed, discoverable on its own. Never `noindex`              |

The v3 Python client control case shows the split cleanly: the **release notes**
are the same across all v3 products and versions, so one product owns that
canonical. But *how the client is used* differs by product, deployment, and
version — that usage is distinct content that each product keeps.

### Canonical owner by sharing scope (urgent vs deferred)

*Which* product owns the canonical depends on the sharing scope, and the two
scopes have different urgency.

| Sharing scope          | Example                                                 | Canonical owner                                                 | When                                                                 |
| ---------------------- | ------------------------------------------------------- | --------------------------------------------------------------- | -------------------------------------------------------------------- |
| Core ↔ Enterprise only | engine internals (storage, compaction, indexing)        | **Enterprise** (most complete edition; strict superset of Core) | **Urgent — this pass (#7245).** Fill missing canonicals now          |
| All v3 editions        | client libraries, line protocol, SQL/InfluxQL reference | **Deferred** — keep current canonical                           | **Broader cross-edition IA work, not this pass.** Do not re-home now |
| Single edition         | Core install/quickstart; Enterprise HA/clustering       | **self**                                                        | already correct by default                                           |

**Urgent now:** add the missing `canonical:` (→ Enterprise) on Core↔Enterprise
shared content — the original #7245 gap. This is unambiguous on present facts:
Enterprise is the most complete edition and a strict superset of Core, so it owns
the shared engine reference.

**Deferred:** canonical ownership for reference shared across *all* v3 editions
(client libraries, etc.) is **not settled in this pass.** Those pages keep their
current canonical. Resolving them — including whether to unify all shared
reference under one owner — is folded into the broader cross-edition IA effort,
where the relationship between editions is being reworked. Canonical re-pointing
is a cheap, reversible frontmatter change, so deferring costs little. Leaving the
current state in place is the conservative choice until that effort lands.

**Linking pattern (bidirectional hub-and-spoke):**

- The canonical reference page links out to each product's usage guides
  ("Using the client in Core / Serverless / Dedicated ...").
- Each per-product usage guide links back to the canonical reference for the
  shared parts (release notes, full API).

This is the natural output of Route 2: the split *is* the reference/usage
boundary. The classification pass — deciding, per page, whether a body is pure
reference (dedup) or carries per-product usage (keep distinct) — is the first
step of the #7245 cleanup, ahead of any `noindex`.

## Work chunks

Small, sequenced.

1. **This design doc** — protocol + rubric. The #7233 artifact. *(done)*
2. **Decision record** — route picked on field evidence and rubric structure;
   rationale under "Test results and decision"; closes #7233, unblocks #7232.
   *(done)*

Now unblocked (the canonical cleanup is decoupled from any test gate):

3. **#7245 canonical cleanup (urgent scope)** — promoted to do-now, scoped to
   **Core↔Enterprise shared content**. Add `canonical:` (→ Enterprise) wherever it
   is missing on shared engine-concept pages, and add `noindex` to true secondary
   duplicates. No-regret; machinery exists. Reference shared across all v3 editions
   (client libraries, etc.) is **out of this pass** — keep current canonical.
   Deferred to the broader cross-edition IA work.
4. **Inverted-transclusion mechanism spike** ([#7297](https://github.com/influxdata/docs-v2/issues/7297)) —
   the Hugo question: make a real published page the authoritative source
   instead of a `/shared/` stub; define how consumers include it; decide whether
   sub-page fragment includes are needed.
5. **Pilot conversion** ([#7298](https://github.com/influxdata/docs-v2/issues/7298)) —
   top `show-in`/`hide-in` pages, using the chosen route. Run the reframed
   before/after validation (section 3) on these pilot pages — non-blocking.

## Explicitly out of scope

- Migration guides per competitor (separate content workstream).
- The Phase 1 IA skeleton (#7232 predecessor) and Phase 3 editorial discipline
  (#7234 successor).
- The prompt-audit data pipeline and measurement tooling
  (`influxdata/docs-tooling`).
- Reliable per-retriever behavioral intel (how ChatGPT vs Perplexity vs Gemini
  pick sources). Strategically valuable for the parent epic (#7230) but needs the
  `docs-tooling` pipeline with adequate sample size — not a one-sitting hand-run.
