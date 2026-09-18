# Split generated plugin facts from hand-owned plugin prose

Plugin library pages were fully generated.
`port_to_docs.js` overwrote each shared page from the upstream README, and
`content/shared/influxdb3-plugins/plugins-library/official/CLAUDE.md` told
writers not to edit them.
That model didn't hold.
Editorial content that belongs in the docs but not in an engineering README
had nowhere to live, so it ended up hardcoded in the generator itself:
`addSchemaRequirements()` carries docs prose keyed by plugin name for
`basic_transformation` and `downsampler`.
Writers also edited generated files directly (commits `0baf84e46`,
`d2b11534b`, `f3d87340d`), and the next sync run would have reverted those
edits without warning.

Ownership is now split three ways by file, not by convention:

- Structured facts (name, version, description, trigger types, dependencies)
  are mapped from the plugin's registry index entry into a Hugo data file
  that the sync fully owns. Nobody hand-edits it.
- README-derived prose lands in a generated region of the shared page.
  Everything outside that region is hand-owned and preserved across runs.
- Product stubs are created once when a plugin first appears and are never
  rewritten, because they carry hand-tuned `menu.name`, `weight`, and tags.

We considered pushing the editorial prose upstream into the plugin READMEs.
That would restore a single source of truth, but it puts documentation-site
concerns in an engineering repository where they rot, and
`README_TEMPLATE.md` — whose section list and order `scripts/validate_readme.py`
enforces — has no slot for them.

We also considered keeping `docs_mapping.yaml` as the list of plugins to
sync.
A hand-maintained map is why the library documented 11 of 34 official
plugins: adding a plugin required three coordinated edits across two
repositories, and missing any of them produced a sync that looked
successful but wasn't.
Plugins are now discovered from the upstream registry index (`index.json`
on the `influxdb3_plugins` `registry` release), deduped to the latest
published version per name, and the mapping file is reduced to slug
overrides and exclusions.

We considered scanning `influxdata/*/manifest.toml` in the upstream
checkout for discovery.
That would surface an in-tree plugin before its first release, but the
registry index already carries every field this pipeline needs (version,
description, trigger types, dependencies) as JSON, in one HTTP fetch, with
no TOML parser and no directory-exclusion logic.
The tradeoff: a plugin merged but not yet published doesn't gain a page
until it is.
We accept that lag because it matches "official plugin" to "published
plugin," which is also what a reader following a documentation link
expects to be able to install.

## Consequences

The generator becomes a merge tool for shared pages.
It must locate the generated region and preserve everything around it,
which means a malformed or missing region marker is a failure mode that
whole-file overwrite didn't have.
Content a writer places inside a generated region is still lost.

A newly published upstream plugin now produces documentation without human
action.
That's the intent, but a plugin published with a thin README also produces
a thin page, so the sync PR stays review-gated.

At the file level, a rename looks the same as a delete plus an add.
Auto-deleting the old page on a rename would break its live URL, so the
sync doesn't delete pages for plugins removed upstream.
It reports the removal in the pull request body, and a person decides what
to do with the page.
