# Release-notes version drift check

**Status:** In review — PR _pending_
**Refs:** release-process reliability (no tracking issue yet)

## Goal

Catch the silent mismatch where a product's release notes gain a new
`## vX.Y.Z` heading but `data/products.yml` is not bumped. That version feeds the
`{{< latest-patch >}}` shortcode, which builds every `dl.influxdata.com` download
URL and the version strings in install/code examples — so a missed bump makes the
docs advertise the previous release everywhere with no signal. After this change,
a release PR gets a reminder to bump the number, a download-link check that covers
the install pages, and (on real version bumps) a gate that the binaries are
actually published.

## Why now

Verified against the live repo: the v3.10.3 release (commit `848a6ba`) added
release-notes prose only, with no `products.yml`-vs-notes safeguard and no feature
badge on the new pages. Nothing in CI ties release notes to the version number,
and a PR that changes only `data/products.yml` currently skips the link check
entirely (it maps only changed `content/*.md` files to pages). This is Stage 0 of
a longer effort to remove the drift at its source (see Roadmap).

## What shipped (Stage 0)

- `.ci/scripts/check-release-notes-version.js` (+ `.test.js`) — per-product
  comparison of the newest release-notes heading to `data/products.yml`. Handles
  both the scalar `latest_patch` and the map `latest_patches.<version>` shapes.
  Non-blocking; prints a per-product status table, a drift reminder, and a badge
  reminder.
- `.github/workflows/pr-release-check.yml` — job A posts the reminder as a sticky
  PR comment; job B, on a real version bump (detected by
  `.ci/scripts/detect-version-bump.js` comparing parsed `latest_patch` values),
  posts a non-blocking reminder to confirm the new version's download artifacts
  are published. Neither job blocks merge.
- `.github/workflows/pr-link-check.yml` — now also checks the download/install
  pages when `data/products.yml` changes, closing the gap where a version-only PR
  never re-checked those URLs.
- `.agents/skills/docs-testing/SKILL.md` — documents both in the CI table.

## Decisions

- **Both checks are non-blocking reminders.** A drift reminder shouldn't fail
  unrelated edits, and the artifact reminder just surfaces a version bump so the
  author confirms the binaries are published — neither blocks merge. The rendered
  download URLs are verified (non-blocking) by `pr-link-check.yml`, which checks
  the install/download pages on any `data/products.yml` change. An earlier draft
  had a blocking artifact gate; review flagged it as fail-open and over-broad
  (it checked unrelated products and all links, not just artifacts), so it was
  reduced to a reminder.
- **Telegraf is checked and reported, not skipped.** Its internal automation keeps
  `products.yml` in sync, so it normally reports success; that green result
  confirms the automation ran, and a mismatch would surface a regression in it.
- **General download-link health lives in `pr-link-check.yml`, not the new
  workflow.** Widening that existing check helps every product on any
  `products.yml` change and avoids duplicating the Hugo build + link-checker. The
  new workflow keeps only the release-specific reminders.
- **Explicit release-notes→product mapping in the script**, validated against
  `products.yml` at runtime, rather than inferring paths. The locations are stable
  and few; an explicit table is clearer and fails safe (unknown field → info note,
  not a crash).
- **Core and Enterprise are compared per edition, not by the shared file's top
  heading.** The v3 shared file interleaves `### Core` / `### Enterprise`
  subsections and can comment out an edition's section pending its build (e.g. an
  Enterprise-only `v3.10.4` with `### Core` commented out). `parseEditionVersions`
  strips HTML comments and takes the newest _live_ section per edition, so Core is
  never flagged to bump to a version it hasn't shipped.
- **Change detection uses `git diff`, not the GitHub Files API.** The API is flaky
  and the repo is already moving off it (mirrors `pr-remark-check.yml` / `test.yml`).
- **No new badge shortcode.** The version badge already exists as frontmatter
  (`metadata:` / `updated_in:` / `introduced:` → `page-meta.html` /
  `supported-versions.html`); the reminder points authors at it.

## Explicitly out of scope (the roadmap — prevent drift at the source)

The check is a safety net. The durable fix is the Telegraf model: generate the
docs and the version from the product's source repo so they can't disagree. Now
feasible because Core, Enterprise, and Cloud share one source repository (the
complication is their edition differences, expressible with shared content +
`{{% show-in %}}`). Staged, each useful alone:

- **Stage 1 — auto-bump `products.yml` from release notes** in the same PR.
  `helper-scripts/common/update-product-version.sh` is a starting point, **but it
  has never run in the real flow** (manual `workflow_dispatch` only) and only
  handles the scalar InfluxDB 3 products — prove it out or rewrite it, and extend
  it to Cloud and the map shape.
- **Stage 2 — trigger the docs PR from the release itself** via the existing
  `trigger-on-release.yml` `repository_dispatch`, instead of by hand.
- **Stage 3 — single source of truth for the number**: derive `latest_patch` from
  the top release-notes heading at build time; the Stage 0 check becomes an
  equality assertion.
- **Stage 4 — generate the reference docs from the shared source repo** (an
  InfluxDB analog of `helper-scripts/influxdb3-plugins/port_to_docs.js`), emitting
  shared content with edition conditionals; multi-quarter, sequenced easiest-first,
  with `docs audit` as the coverage backstop.

## How to update

- Add or change a product's version tracking: edit the `RELEASE_NOTES` table in
  `.ci/scripts/check-release-notes-version.js` (product key, `selector`,
  `notesFile`, optional `triggerPaths`) and add a fixture to the `.test.js`.
- Add a download/install page to the link check: append its path to
  `DOWNLOAD_PAGES` in `.github/workflows/pr-link-check.yml` (the map step uses
  `--existing-only`, so a wrong path is ignored, not fatal).

## Verification

```sh
# Unit tests (pure logic, no disk)
node .ci/scripts/check-release-notes-version.test.js

# Against the real tree — expect all products ✅ in sync
node .ci/scripts/check-release-notes-version.js

# Regenerate + validate agent instructions (SKILL.md lives under .agents/)
yarn build:agent:instructions && yarn validate:agent-instructions
```
