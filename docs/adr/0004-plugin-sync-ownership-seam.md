# Split generated plugin facts from hand-owned plugin prose

Plugin library pages were fully generated: `port_to_docs.js` overwrote each
shared page from the upstream README, and
`content/shared/influxdb3-plugins/plugins-library/official/CLAUDE.md` told
writers not to edit them. That model leaked. Editorial content that belongs in
the docs but not in an engineering README had nowhere to live, so it ended up
hardcoded in the generator itself -- `addSchemaRequirements()` carries
docs prose keyed by plugin name for `basic_transformation` and `downsampler`.
Writers also edited generated files directly anyway (commits `0baf84e46`,
`d2b11534b`, `f3d87340d`), which the next sync run would have silently
reverted.

Ownership is now split three ways by file, not by convention:

- Structured facts (name, version, description, trigger types, dependencies)
  are parsed from each plugin's `manifest.toml` into a Hugo data file that the
  sync fully owns and nobody hand-edits.
- README-derived prose lands in a generated region of the shared page.
  Everything outside that region is hand-owned and preserved across runs.
- Product stubs are created once when a plugin first appears and are never
  rewritten, because they carry hand-tuned `menu.name`, `weight`, and tags.

We rejected pushing the editorial prose upstream into the plugin READMEs. It
would restore a single source of truth, but it puts documentation-site concerns
in an engineering repository where they rot, and `README_TEMPLATE.md` -- whose
section list and order `scripts/validate_readme.py` enforces -- has no slot for
them.

We also rejected keeping `docs_mapping.yaml` as the list of plugins to sync.
A hand-maintained map is why the library documented 11 of 34 official plugins:
adding a plugin required three coordinated edits across two repositories, and
forgetting any of them produced a successful-looking sync. Plugins are now
discovered by scanning `influxdata/*/manifest.toml`, and the mapping file is
reduced to slug overrides and exclusions.

## Consequences

The generator becomes a merge tool for shared pages. It must locate the
generated region and preserve everything around it, which means a malformed or
missing region marker is a failure mode that whole-file overwrite did not have.
Anything a writer places *inside* a generated region is still lost.

Discovery by scan means a new upstream plugin now produces documentation
without human action. That is the point, but it also means an upstream plugin
added with a thin README produces a thin page, so the sync PR stays
review-gated.

Deleting a plugin upstream does not delete its page. Removals are reported in
the pull request body and resolved by hand, because a rename is
indistinguishable from a delete-plus-add at the file level and auto-deletion
would break live URLs on every upstream rename.
