# IA sharing mechanism — canonical-honoring validation and decision rubric

**Status:** Design — validation pending. No route chosen until the test in
section 3 produces data.
**Closes:** [#7233](https://github.com/influxdata/docs-v2/issues/7233) (Phase 2 design review)
**Parent:** [#7230](https://github.com/influxdata/docs-v2/issues/7230) (AI visibility)
**Blocks:** [#7232](https://github.com/influxdata/docs-v2/issues/7232) (job-led IA migration kickoff)
**Related:** [#7245](https://github.com/influxdata/docs-v2/issues/7245) (canonical audit of engine-concept pages)

## Goal

Decide how the job-led IA shares content across Core, Enterprise, and
deployment variants — but decide it on evidence, not assumption. The IA's
"engine docs live once, thin overlays elsewhere" model needs a sharing
mechanism. The choice between candidate mechanisms hinges on one empirical
question that no one has measured: **do LLM retrievers honor `rel=canonical`?**

This document defines the test that answers that question and a rubric that
maps each possible outcome to a route. It does not pick the route. The route is
chosen when the validation test has data and recorded under "Test results and
decision."

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

## Validation test (spec — run manually)

Per the epic, measurement tooling lives in `influxdata/docs-tooling` and is out
of docs-v2 scope. This document is the **protocol**; execution is manual against
production (already-indexed) content. Results land under "Test results and
decision."

### Targets — a contrast pair

The test isolates the marginal effect of `rel=canonical` by comparing two
"identical content at multiple live URLs" situations that differ only in whether
canonical is declared.

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

## Test results and decision

> Pending. Fill the results table from the validation test's coding scheme, then state the
> chosen route and a one-paragraph rationale keyed to the matching rubric row.
> Filling this section closes #7233 and unblocks #7232.

## Work chunks

Small, sequenced. Only chunk 1 is this session.

1. **This design doc** — protocol + rubric. The #7233 artifact. *(done)*
2. **Execute and record** — run the section 3 queries manually; paste results
   into section 5. *(manual; you)*
3. **Decision record** — pick the route from the rubric, write the rationale
   under "Test results and decision," close #7233, unblock #7232.

Opened only **after** the decision:

4. **#7245 canonical audit** — promoted to do-now if the rubric says canonical
   helps; deferred or reshaped otherwise.
5. **Inverted-transclusion mechanism spike** ([#7297](https://github.com/influxdata/docs-v2/issues/7297)) —
   the Hugo question: make a real published page the authoritative source
   instead of a `/shared/` stub; define how consumers include it; decide whether
   sub-page fragment includes are needed.
6. **Pilot conversion** ([#7298](https://github.com/influxdata/docs-v2/issues/7298)) —
   top `show-in`/`hide-in` pages, using the chosen route.

## Explicitly out of scope

- The route decision itself (deferred to "Test results and decision", post-data).
- Migration guides per competitor (separate content workstream).
- The Phase 1 IA skeleton (#7232 predecessor) and Phase 3 editorial discipline
  (#7234 successor).
- The prompt-audit data pipeline and measurement tooling
  (`influxdata/docs-tooling`).
