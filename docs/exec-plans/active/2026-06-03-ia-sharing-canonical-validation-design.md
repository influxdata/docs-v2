# IA content-sharing mechanism — canonical decision

**Status:** Decided 2026-06-08; revised 2026-07-01 — each edition stays
self-canonical (`canonical: self`) and shares content by inline transclusion,
rather than consolidating to a sibling edition.
**Closes:** [#7233](https://github.com/influxdata/docs-v2/issues/7233) ·
**Parent:** [#7230](https://github.com/influxdata/docs-v2/issues/7230) ·
**Blocks:** [#7232](https://github.com/influxdata/docs-v2/issues/7232) ·
**Related:** [#7245](https://github.com/influxdata/docs-v2/issues/7245)

## Goal

Decide how the job-led IA shares engine and reference content across InfluxDB 3
Core, Enterprise, and the deployment variants, and how to set `rel=canonical` so
shared content doesn't strand readers in the wrong edition. The decision rests on
published field evidence and the original decision rubric's structure, not on a
citation-measurement test (see D2).

## The four decisions

### D1 — Invert the sharing mechanism

Today, per-product stubs pull from one hidden `content/shared/*.md` file filled
with `show-in`/`hide-in` conditionals. The real content isn't a published page,
and anyone reading the source parses the conditionals to follow it.

Invert it. Author the shared content once as clean prose, then transclude it into
each edition. Every edition renders a complete page at its own URL, so a Core
reader stays in Core docs and an Enterprise reader stays in Enterprise docs. Only
the source changes; the reader's page doesn't.

Link to another edition only to suggest an upgrade — for example, a Core page
pointing to Enterprise for a capability Core lacks. Never link out to complete or
supplement the page's own task.

Set `canonical: self` on each edition's page so search and AI keep readers in
that edition:

```yaml
# content/influxdb3/core/admin/performance-tuning.md
title: Performance tuning
source: /shared/influxdb3-admin/performance-tuning.md
canonical: self   # keep Core readers in Core; don't route to Enterprise
```

`canonical: self` is required, not optional. A page that sets `source:` but omits
`canonical` inherits a sibling edition's canonical automatically — Enterprise
first — which sends Core readers to Enterprise
(`layouts/partials/header/canonical.html`).

Two pieces stay in the mechanism spike (#7297): where the clean prose lives (a
real page or a conditional-free shared file), and how an edition includes only
the shared sections while adding its own. Today's `source:` transcludes a whole
file, so edition-specific sections still need the fragment includes #7297 defines.

### D2 — Do the canonical cleanup now; don't gate it on a test

The original plan gated the route on one measurement: do LLM retrievers honor
`rel=canonical`? Stop gating on it:

- **No rubric outcome argues against canonical.** Every branch of the original
  decision rubric still adds canonical signaling; none argues against it. A test
  whose every branch leads to the same action can't change the action.
- **Field evidence shows canonical signals are honored upstream of the model.**
  ChatGPT (through Bing) and AI Overviews and Gemini (through Google) inherit
  canonical and dedup decisions at the index layer. Google treats canonical as a
  hint it can override; Bing applies it more directly. Because the signal is
  honored, `canonical: self` reliably keeps each edition distinct.
- **A hand-run audit couldn't settle it.** Three repeats across five retrievers
  is underpowered against a stochastic outcome, and the original contrast pair
  was confounded. The reliable version belongs in the `docs-tooling` pipeline,
  outside docs-v2 scope.

(Sources: Passionfruit; Glenn Gabe / GSQI; ai-visibility.org.uk; Topic
Intelligence.)

### D3 — Keep each edition self-canonical

Every edition owns its own canonical, so a reader who searches for "Core
performance tuning" lands on the Core page instead of Enterprise. This holds for
both kinds of content that look shared:

- **Shared reference** — identical prose across editions (engine concepts, client
  API surface). Author it once, transclude it into each edition (D1), and set
  `canonical: self` on each.
- **Per-product usage** — content that genuinely differs (how the client is used
  in Serverless versus Core). It's already distinct; keep it self-canonical and
  indexed.

| Content                                                                               | Canonical              | Action                                                   |
| ------------------------------------------------------------------------------------- | ---------------------- | -------------------------------------------------------- |
| Shared via `source:` (Core ↔ Enterprise engine pages)                                 | `self` on each edition | Urgent — #7245: add `canonical: self` where it's missing |
| Per-product usage, or single edition                                                  | `self` (default)       | Already correct                                          |
| Byte-identical across all v3 editions (client libraries, line protocol, SQL/InfluxQL) | Keep current canonical | Deferred to the broader cross-edition IA work            |

The urgent fix corrects today's behavior: a page with `source:` and no
`canonical` doesn't stay self-canonical — the template routes it to a sibling
edition (Enterprise first), so Core engine pages already point their canonical at
Enterprise. Adding `canonical: self` is a one-line, reversible change.

Byte-identical reference across all five v3 editions is a different case: there,
consolidating to one owner may be worth it. That stays deferred; those pages keep
their current canonical for now.

Classify each page as shared reference or per-product usage as the first step of
the #7245 cleanup, and link each reference page and its per-product usage guides
to each other.

### D4 — Validate after cleanup, non-blocking

Measure citation behavior on the pilot pages (#7298) before and after the
cleanup to confirm each edition is cited for its own queries. This validation
never gates the migration. Comparing each page against itself — with only its
`canonical` changed — avoids the confound in the original contrast-pair test.

## Work chunks

1. **Design and decision record** (this doc). Done.
2. **#7245 canonical cleanup, urgent scope.** On Core↔Enterprise shared engine
   pages, add `canonical: self` where it's missing so each edition stays in its
   own docs. Byte-identical all-edition reference is out of this pass.
3. **Inverted-transclusion spike**
   ([#7297](https://github.com/influxdata/docs-v2/issues/7297)). Make a real
   published page the authoritative source instead of a `/shared/` stub, define
   how consumers include it, and decide whether sub-page fragment includes are
   needed.
4. **Pilot conversion**
   ([#7298](https://github.com/influxdata/docs-v2/issues/7298)). Convert the top
   `show-in`/`hide-in` pages to the chosen route and run the non-blocking
   before/after validation.

## Out of scope

- Migration guides per competitor.
- The Phase 1 IA skeleton (#7232 predecessor) and Phase 3 editorial discipline
  ([#7234](https://github.com/influxdata/docs-v2/issues/7234)).
- The prompt-audit data pipeline and measurement tooling
  (`influxdata/docs-tooling`).
- Reliable per-retriever behavioral intel, which needs the `docs-tooling`
  pipeline rather than a hand-run.
