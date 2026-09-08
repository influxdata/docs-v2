# Partly generated content

Each file in this directory is a shared page for one official InfluxDB 3
plugin. The plugin's README in
[influxdata/influxdb3_plugins](https://github.com/influxdata/influxdb3_plugins)
is the source of truth for its prose.

These pages are not fully generated. Each one has a generated region the sync
overwrites and a hand-owned remainder the sync preserves.

## Generated and hand-owned regions

```markdown
Hand-owned. Written here, kept here.

<!-- BEGIN GENERATED PLUGIN CONTENT -->

Transformed from the upstream README. Overwritten every sync run.

<!-- END GENERATED PLUGIN CONTENT -->

Hand-owned. Written here, kept here.
```

- **Inside the markers**: edit the upstream README, not this file. Anything
  written here is lost on the next sync run.
- **Outside the markers**: docs-owned. The sync never touches it. This is where
  content belongs that has no upstream home, such as the schema requirements
  section in `basic-transformation.md`.
- **No markers at all**: the page is treated as fully generated and gains
  markers on its first write.
- **One marker, or markers out of order**: the sync fails that plugin and
  leaves the file untouched rather than guessing where the generated region
  ends.

## Frontmatter

These files have no frontmatter. Each has one product stub per product at
`content/influxdb3/{core,enterprise}/plugins/library/official/`, and the stub
carries `title`, `menu`, `source`, and the rest. Stubs are scaffolded once and
never rewritten by the sync, so editorial changes to a title or tags are safe
there.

The shared page filename is the upstream plugin name with underscores replaced
by hyphens. A stub filename can differ: `mad_check`'s shared page is
`mad-check.md` and its stubs are `mad-anomaly-detection.md`.

## Cross-plugin links

Upstream READMEs link to other plugins with a GitHub-relative path, for
example `[influxdata/notifier plugin](../notifier/README.md)`. That path is
valid on GitHub but doesn't resolve on the built docs site (Hugo doesn't
publish `README.md` files). `port_to_docs.js`'s `convertRelativeLinks()`
rewrites these to the sibling plugin's docs-v2 page —
`/influxdb3/version/plugins/library/official/notifier/` — converting the
upstream folder's underscore_case to the docs-v2 hyphen-case slug. This
keeps readers on the docs site instead of bouncing to GitHub.

If you see a broken `../<plugin>/README.md`-style link in one of these
files, the sync script didn't run after the upstream link was added — don't
hand-fix only the generated file; re-run `yarn sync-plugins`, and if the
link still isn't rewritten, check `convertRelativeLinks()` in
`helper-scripts/influxdb3-plugins/port_to_docs.js` for a pattern gap.

## Running the sync

`yarn sync-plugins` from the repository root, with a checkout of
`influxdb3_plugins` at `.ext/influxdb3_plugins`. See
[helper-scripts/influxdb3-plugins/README.md](/helper-scripts/influxdb3-plugins/README.md)
for the full pipeline, the ownership model, and what each reported status
means.
