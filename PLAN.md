# InfluxDB v1 shared-content migration

Ephemeral working notes. Decisions live in `docs/adr/0001`-`0003`; this file is
removed before merge (`block-ephemeral-docs.yml`).

## Problem

`content/influxdb/v1/` and `content/enterprise_influxdb/v1/` are coupled by
convention only. Nothing fails when a fix lands in one copy and not the other,
so they drifted silently.

## Terminology

- **Edition** -- InfluxDB v1 OSS or InfluxDB v1 Enterprise. Both are `version:
  v1`; only `product` distinguishes them.
- **Edition root** -- the URL prefix owned by an edition: `/influxdb/v1/` or
  `/enterprise_influxdb/v1/`. The v1 pair is the only shared pair in this repo
  whose editions do not share a root.
- **Free file** -- an overlapping page whose two copies are *provably*
  equivalent, so merging discards nothing: identical after normalizing the
  edition root, or differing only by whitespace (`diff -w` is the proof). "Free"
  means zero editorial judgment, not zero work.
- **Edition-neutral** -- content whose correctness does not depend on edition
  (Flux syntax, InfluxQL spec, line protocol). Divergence here is accidental by
  definition.
- **Divergence ratchet** -- the transitional CI rule that a deferred pair's
  divergence may hold or shrink, never grow.

## Measurements

|                                            | count            |
| ------------------------------------------ | ---------------- |
| OSS v1 pages / Enterprise v1 pages         | 127 / 186        |
| Overlapping paths                          | 95               |
| Fully byte-identical                       | 1                |
| Body-identical (front matter stripped)     | 13               |
| Identical after edition-root normalization | 21               |
| Genuinely divergent                        | 74 (4,881 lines) |

Scope B = free files + provably-accidental divergence.

## Phases

- [x] `git fetch --unshallow` -- history was grafted at `c32e05175`, so
  `git log`/`blame` could not arbitrate reconciliation. Now 10,513 commits.
- [x] **Phase C** -- 31 free files migrated, plus the mechanism (path token,
  `show-in`/`hide-in`, `products.yml`, ratchet, ADRs).
- [ ] **Phase A** -- 24 deferred pairs, 1,508 diverging lines, listed in
  `.ci/v1-shared-drift-manifest.json`. Arbitrate per hunk using the
  recovered history. Glossary merges via additive `show-in` blocks
  (Enterprise adds 10 cluster and auth terms).

## Carried forward into phase A

- `flux/guides/geo/_index.md` links a Flux stdlib path that resolves in
  neither edition (`built-in/outputs/to` is the pre-0.65 layout). Fix both, do
  not pick a winner.
- `flux/installation.md` is genuinely edition-specific IA:
  `administration/config.md` (OSS) vs `administration/configure/` (Enterprise).
  Needs the resolved token or a conditional.
- \~200 cross-product links per edition into `/influxdb/v2/`, `/flux/v0/`,
  `/influxdb3/`. Merging freezes them into both products at once; some are stale.
- One stray `/influx/version/` token exists in shared content (likely a typo for
  `/influxdb/version/`). Not touched here.

## Verification performed

- Hugo build exit 0; 5,959 pages.
- Zero unresolved `/product/version/` or `<root>/version/` placeholders sitewide.
- Baseline vs migrated, asset fingerprints normalized: 60 v1 pages changed as
  intended, 0 unintended. Build nondeterminism (Hugo shortcode placeholder
  counter, taxonomy title casing) proven by a control build of identical code
  and subtracted.
- Ratchet proven to fail on increased divergence and pass when restored;
  11 unit tests pass.
- Vale: 0 errors across the 31 new shared files (20 mechanical fixes applied;
  `50th percentile` exempted inline as a standard technical term).
- Codeblock lint, `check-source-paths`, and `check-feedback-links` all pass.

## Findings worth separate issues

- **Vale under-reports on pages with front matter.** For an identical body,
  Vale reports 4 errors with no front matter and 0 with it, once the body is
  long enough (bisected: suppression starts between body lines 14 and 20; path
  is irrelevant). Because `content/shared/**` files have no front matter, they
  are fully linted while product pages are not -- so the corpus is less linted
  than it appears, and migrating content to shared files exposes pre-existing
  style errors. Mechanism not identified; looks like an offset bug.
- **`.ci/scripts/**` is never linted.** The `lint-js` hook globs only
  `assets/js/*`, and eslint's Node-globals block covers `helper-scripts/**` and
  `scripts/**` but not `.ci/scripts/**`, so every script there reports
  `'process' is not defined`.
- **Hugo builds are not reproducible.** Two builds of identical code differ on
  \~26 pages: the shortcode placeholder counter (`hahahugoshortcodeNNN`) leaks
  into heading IDs, and taxonomy title casing flips (`CLI`/`Cli`,
  `InfluxQL`/`Influxql`) depending on which page Hugo reads first.
