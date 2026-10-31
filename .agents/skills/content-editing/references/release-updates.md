# Release updates

Treat release notes, product version data, and release announcements as one
update. Apply the following steps when editing any of them, including follow-up
link repairs. Reuse completed review evidence for the reviewed commit; verify
new changes against the current files.

1. Identify the product and version from the release evidence and release-note
   heading. Check related editions against their own release evidence. OSS and
   Enterprise versions can differ; Core and Enterprise 3 share release notes
   with edition-specific sections.
2. Reconcile `data/products.yml` with the newest published release for each
   affected product. Update `latest_patch` or `latest_patches.<version>` in the
   same change. A release update includes this synchronization without another
   permission question. Verify that release artifacts are published before
   advancing download versions; distinguish future or pending releases from
   published releases.
3. Inspect `data/notifications.yaml` for affected product announcements. Update
   the title, summary, details, and release-note links together. Describe the
   announced release's changes. Give a new release announcement a new ID so
   dismissing the previous notification does not hide it. Keep announcements
   for different editions tied to their own releases.
4. Keep perpetual relationship callouts above the version history and link to
   the release-notes page without a version anchor. Use `latest-patch` for text
   that should track the current patch in content that processes shortcodes.
   Keep historical release claims and links pinned to the verified version;
   changing product data must not rewrite what an older release included.
5. Check related editions and shared-source consumers for the same pattern.
   Preserve requested contributor credit in follow-up commits.
6. Run `node .ci/scripts/check-release-notes-version.js` with the changed paths,
   plus the content checks selected by `yarn verify:changed`. Resolve version
   drift for affected products. Verify the rendered notification, callout, and
   anchor targets when changed. For a product version bump, check rendered
   download links against published artifacts.

Complete when each affected product's published release, product data,
announcement, and link targets agree, and historical inclusion statements
still describe the release they belong to. Report any blocked artifact or
render verification explicitly.
