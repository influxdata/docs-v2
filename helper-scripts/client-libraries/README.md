# Client library release notes sync

Syncs `CHANGELOG.md` from the InfluxDB v3 client library repos
(`InfluxCommunity/influxdb3-{python,go,js,csharp,java,rust}`) into
Hugo-flavored release notes pages under `content/shared/`.

Driven by `.github/workflows/sync-client-library-release-notes.yml`
(nightly cron + manual dispatch).

## Excluded sections

Some upstream CHANGELOG sections (for example `### CI`) are maintenance
detail that's noise for docs readers. Rather than drop them outright — which
can leave a release with no visible content and read as "the sync forgot
this release" — a matching heading and everything under it (list items,
paragraph text, nested subheadings) collapses to a single bullet, for
example `- CI updates`.

The default exclude list is `DEFAULT_EXCLUDE_HEADINGS` in
[`transform-changelog.js`](transform-changelog.js) (currently just `CI`).
Matching is case-insensitive and tolerates `#` markers, so `CI` and `### CI`
both match a `### CI` heading.

Override the list for a run with `--exclude-headings` (comma-separated
heading labels), for example `--exclude-headings "CI,Dependencies"`. Each
label collapses to `<label> updates`; pass `{ heading, replacement }` objects
to `transformChangelog`'s `excludeHeadings` option directly (not available
via the CLI flag) for a custom bullet.

## Local usage

```sh
# Sync one client (reads from a local checkout you provide).
node helper-scripts/client-libraries/sync-release-notes.js \
  --client python \
  --source-path /path/to/influxdb3-python

# Sync all five (expects --source-root with each repo checked out as a subdir).
node helper-scripts/client-libraries/sync-release-notes.js \
  --all \
  --source-root /path/to/InfluxCommunity
```

## Tests

```sh
node --test helper-scripts/client-libraries/test/transform-changelog.test.js
```

See [PLAN.md](../../PLAN.md) at the repo root for design context.
