# InfluxDB 3 plugin documentation sync

This directory holds the generator that turns official InfluxDB 3 plugins in
[`influxdata/influxdb3_plugins`](https://github.com/influxdata/influxdb3_plugins)
into documentation in docs-v2.

The sync runs from `.github/workflows/sync-plugins.yml` and opens one aggregate
pull request per run. It never pushes to a documentation branch directly, and
it never deletes a published page.

Architecture decisions are recorded in
[docs/adr/0004-plugin-sync-ownership-seam.md](../../docs/adr/0004-plugin-sync-ownership-seam.md).

## Terminology

Upstream and docs-v2 name several of these concepts differently.
Use the following terms in code, comments, pull requests, and content.

- **Official plugin**: a plugin under `influxdata/` in `influxdb3_plugins`.
  These are the only plugins the documentation covers.
  Not "community plugin" or "first-party plugin".
- **Contributor plugin**: a plugin under a personal directory (`efbar/`,
  `pbarnett/`). Unvalidated and unpublished upstream, and out of scope here.
- **Plugin library**: the documentation section listing official plugins, one
  page per plugin. Not "catalog", "registry", or "index".
- **Manifest**: a plugin's `manifest.toml` upstream. The source of truth for
  name, version, description, trigger types, and dependencies.
- **Registry index**: the `index.json` asset on the `registry` release of
  `influxdb3_plugins`. Distinct from `plugin_library.json`, which is
  hand-maintained and serves the InfluxDB 3 Explorer UI.
- **Shared page**: a body-only Markdown file under `content/shared/` with no
  frontmatter. Not "source file" or "partial".
- **Product stub**: a per-product Markdown file carrying all frontmatter and
  pointing at a shared page through `source:`. Not "wrapper" or "shim".
- **Generated region**: a span of a shared page the sync overwrites every run.
- **Hand-owned region**: a span of a shared page the sync preserves.
- **Sync run**: one execution of the sync, covering every official plugin.
- **Backfill**: the one-time reviewed change adding pages for official plugins
  that have never been documented.

### Trigger types

Upstream spells these four ways: `manifest.toml` uses `process_scheduled_call`
/ `process_writes` / `process_request`; the Python docstring uses `scheduled` /
`onwrite` / `http`; `plugin_library.json` uses `scheduler` / `data_writes` /
`http`; the README emoji line uses `scheduled` / `data-write` / `http`.
Documentation uses the following, mapped from the registry index.

- **Scheduled**: fires on an interval or cron expression.
- **Data write**: fires when rows are written. Not "WAL trigger" or "onwrite".
- **HTTP request**: fires when a request reaches a custom endpoint.

## Ownership

Ownership splits three ways by file. This is the seam that lets a generator and
a human writer share the same plugin page.

| Artifact                                                      | Owner    | Rewritten                     |
| ------------------------------------------------------------- | -------- | ----------------------------- |
| `data/influxdb3_plugins.yml`                                  | The sync | Fully, every run              |
| Generated region of a shared page                             | The sync | Every run                     |
| Everything outside that region                                | A human  | Never                         |
| Product stubs under `content/influxdb3/{core,enterprise}/...` | A human  | Created once, never rewritten |

A shared page marks its generated region with HTML comments:

```markdown
<!-- BEGIN GENERATED PLUGIN CONTENT -->

Transformed upstream README prose. Do not edit here; edit the upstream README.

<!-- END GENERATED PLUGIN CONTENT -->
```

### Adding a hand-owned region

Write the content outside the markers, above or below them, in the shared page.
Nothing else is needed: the writer replaces only what sits between the markers
and leaves the rest byte-identical.

A page with no markers is treated as fully generated and gains markers on its
first write. A page with only one marker, or with the markers out of order,
fails that plugin and leaves the file untouched, rather than overwriting prose
whose boundary the generator cannot determine.

`content/shared/influxdb3-plugins/plugins-library/official/basic-transformation.md`
is the worked example.

## How a sync run works

1. Fetch `index.json` from the `registry` release of `influxdb3_plugins` and
   dedupe to the latest published version per plugin name. This is the plugin
   list; there is no hand-maintained roster of plugins to keep current.
   A plugin merged upstream but not yet published to the registry does not
   appear until it is published.
2. Write `data/influxdb3_plugins.yml` from the registry entries. Output is
   deterministic, so an unchanged registry produces a byte-identical file and
   no pull request.
3. Scaffold Core and Enterprise stubs for any plugin that lacks them. An
   existing stub is never opened for writing.
4. Transform the README of each plugin in the `plugins:` map of
   `docs_mapping.yaml` and merge it into the generated region of its shared
   page.
5. Report one row per plugin to the step summary, and set the
   `needs_attention` output.

Only step 4 depends on `docs_mapping.yaml`. Steps 1 through 3 cover every
official plugin in the registry.

## Statuses

The generator reports one status per plugin. The status determines whether a
run fails and whether the pull request body carries a warning.

| Status       | Meaning                                                          | Fails the run | Sets `needs_attention` |
| ------------ | ---------------------------------------------------------------- | ------------- | ---------------------- |
| `unchanged`  | The generated region already matched.                            | No            | No                     |
| `updated`    | The generated region was rewritten.                              | No            | No                     |
| `scaffolded` | A new product stub was created.                                  | No            | Yes                    |
| `skipped`    | No README the transform could read, or a registry fetch failure. | No            | Yes                    |
| `removed`    | A shared page whose plugin is no longer in the registry.         | No            | Yes                    |
| `error`      | A write failed, or a generated region was malformed.             | Yes           | Yes                    |

The split between `skipped` and `error` is deliberate. A flaky network or a
malformed upstream README must not fail a scheduled run, because a red nightly
that nobody can fix locally gets ignored. A failed write must fail the run,
because a sync that reports success while publishing nothing is the failure
mode this pipeline was rebuilt to end.

A `removed` row is reported, never acted on. A rename and a deletion look
identical from the registry index, so resolving one is a human decision.

## Files in this directory

| File                | Purpose                                                           |
| ------------------- | ----------------------------------------------------------------- |
| `port_to_docs.js`   | CLI entry point: discovery, transform, merge, scaffold, report.   |
| `discovery.js`      | Fetches and parses the registry index.                            |
| `plugin-data.js`    | Maps registry entries to `data/influxdb3_plugins.yml`.            |
| `stub-template.js`  | Renders and scaffolds product stubs.                              |
| `reporting.js`      | Collapses results per plugin and writes step summary and outputs. |
| `docs_mapping.yaml` | README source and target paths, slug overrides, exclusions.       |
| `test/`             | Node test runner tests for all of the above.                      |

## Configuration

`docs_mapping.yaml` carries four things the registry index cannot supply.

- `plugins`: the README source and shared-page target for each plugin whose
  prose is transformed. A plugin absent here still gets a data file entry and
  product stubs.
- `overrides`: per-plugin product stub slugs, where the stub slug differs from
  the name-derived shared-page slug. `mad_check` is the only current case: its
  shared page is `mad-check.md` and its stubs are `mad-anomaly-detection.md`.
- `exclude`: official plugins to drop from discovery entirely. An excluded
  plugin is named in the run output, not silently absent.
- `exceptions.manual_review`: plugins whose generated output has historically
  needed a closer read during review.

## Running the sync locally

The transform reads plugin READMEs from a checkout of `influxdb3_plugins` at
`.ext/influxdb3_plugins` in the repository root. `.ext/` is git-ignored.

```bash
git clone --depth 1 https://github.com/influxdata/influxdb3_plugins.git \
  .ext/influxdb3_plugins
```

Without that checkout, discovery, the data file, and stub scaffolding still
work; every mapped plugin reports `skipped` because its README is missing.

| Command                       | Effect                                             |
| ----------------------------- | -------------------------------------------------- |
| `yarn sync-plugins:dry-run`   | Report what would change, write nothing.           |
| `yarn sync-plugins`           | Write the data file, stubs, and shared pages.      |
| `yarn validate-plugin-config` | Check `docs_mapping.yaml` source and target paths. |
| `yarn test:sync-plugins`      | Run the tests.                                     |

To limit the run to specific plugins, pass a name or a comma-separated list:

```bash
cd helper-scripts/influxdb3-plugins
node port_to_docs.js --plugin basic_transformation,downsampler
```

`--plugin` restricts the README transform only, and skips discovery, the data
file, and stub scaffolding. Omit it, or pass `all`, for a full run.

Review the result before committing:

```bash
git diff content/shared/influxdb3-plugins/ content/influxdb3/ data/influxdb3_plugins.yml
```

## Running the sync in CI

`.github/workflows/sync-plugins.yml` runs on `workflow_dispatch` with a
`plugins` input that takes a name, a comma-separated list, or `all`.

The workflow validates upstream READMEs with the upstream
`scripts/validate_readme.py`, but that step is informational
(`continue-on-error: true`) and gates nothing. One plugin failing template
validation must not block the rest, so an unusable README surfaces as a
per-plugin `skipped` row instead.

Both checkouts are tokenless and use `persist-credentials: false`.
`influxdata/influxdb3_plugins` is public, so no cross-repository secret is
needed. `peter-evans/create-pull-request` pushes the fixed branch
`sync/influxdb3-plugins` with the default `GITHUB_TOKEN`, using the job's
`contents: write` and `pull-requests: write` permissions.

## Adding a plugin

Publishing a plugin to the registry upstream is what adds it to the docs. The
next sync run picks it up, writes its data file entry, and scaffolds its Core
and Enterprise stubs.

Two things still need a human:

1. The scaffolded stubs carry baseline tags (`plugins`, `processing engine`,
   `python`, `official`). Editorial tags are not derivable from the registry.
2. To publish the plugin's README prose as a shared page, add a `plugins:`
   entry to `docs_mapping.yaml` pointing at its upstream README and its shared
   page target.
