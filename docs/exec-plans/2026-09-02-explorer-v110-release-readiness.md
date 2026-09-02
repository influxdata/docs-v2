# Explorer v1.10 release readiness

**Status:** In progress — PR [#7734](https://github.com/influxdata/docs-v2/pull/7734)
**Refs:** [2026-09-02-explorer-install-version-routing.md](2026-09-02-explorer-install-version-routing.md)

## Goal

Define the documentation work to complete before and on the day InfluxDB 3
Explorer v1.10 and the accompanying InfluxDB 3 Enterprise release ship.
The sequence applies regardless of which features the release contains.
Feature-specific content, such as user authorization, follows the same steps.

## Why now

The install restructure in the referenced exec-plan prepares the version
routing but stops short of the release itself. It deliberately leaves the WASM
deployment instructions, the `data/products.yml` updates, and the hub lede flip
until v1.10 ships. This plan records that remaining work as an ordered sequence
so the release day doesn't depend on someone reconstructing it.

The conventions the release work follows are documented separately in
[DOCS-VERSION-AVAILABILITY.md](../../DOCS-VERSION-AVAILABILITY.md), which this
plan applies rather than restates.

## Decisions

- **Feature pages are drafted before the release, not written on the day.**
  Each new page carries its version metadata, its version-verification step,
  and its cross-product links from the first commit. Publishing then becomes a
  frontmatter change rather than an authoring task.
- **Use `data/notifications.yaml` for the release announcement, and keep the
  version facts in the pages.** Notifications render in the footer, outside the
  article, so they don't appear in Markdown twins or `llms-full.txt`. The
  announcement is for readers; the version scope that agents and retrieval
  systems need stays in frontmatter and the lede.
- **Add the notification as a commented-out stub before the release.** The
  `influxdb3-cloud-ga` entry in `data/notifications.yaml` already uses this
  pattern: a commented block with a checklist of what to confirm before it goes
  live. Uncommenting is a one-line release-day action.
- **Order the release-day steps so no published page contradicts another at any
  point.** Feature pages publish first, then the hub lede flips to lead with
  WASM, then `data/products.yml` changes. Reversing that order leaves the hub
  pointing at unpublished pages.
- **Retire notices by identifier, not by search.** The `cascade.prepend`
  transition notice and the notification entry are both removed at v1.11, and
  both are named here so the removal doesn't depend on finding them again.
- **The install restructure exec-plan stays as written.** This plan follows it.
  Where the two describe the same file, the restructure plan describes the
  pre-release state and this plan describes the release-day change.

## Pre-release tasks

1. Draft each new feature page with `draft: true`.
   Apply the version marker for the feature's availability, per
   [DOCS-VERSION-AVAILABILITY.md](../../DOCS-VERSION-AVAILABILITY.md).
   Use a page-level `metadata:` entry when the whole page is new in v1.10, and
   a heading attribute such as `{metadata="v1.10+"}` when only a section is.
2. Include the version-check step on each feature page, or link to the section
   of the install hub that documents it.
3. Add `alt_links` in both directions between the Explorer page and the
   InfluxDB 3 Enterprise page that documents the server side of the feature.
4. Add the WASM deployment instructions to the InfluxDB 3 Enterprise section,
   including the server version that introduced them.
5. Add a commented-out entry to `data/notifications.yaml` with the final `id`,
   `scope`, `title`, and `slug`, and a comment listing what to confirm before
   uncommenting.
6. Draft the release notes entry in
   `content/influxdb3/explorer/release-notes/_index.md`.

## Release-day tasks

Complete in this order.

1. Remove `draft: true` from the feature pages.
2. Update the install hub lede at
   `content/influxdb3/explorer/install/_index.md` so the WASM path is described
   first and Docker reads as the path for v1.9 and earlier.
3. Update `data/products.yml`: set `latest_patch` to the new Explorer version,
   and update `schema.operating_system`, which currently lists `Docker` and
   feeds the JSON-LD `SoftwareApplication` node.
4. Publish the release notes entry.
5. Uncomment the `data/notifications.yaml` entry.
6. Verify the published surfaces (see Verification).

## Post-release tasks

At the v1.11 release:

1. Delete the `data/notifications.yaml` entry by `id`.
2. Remove the `cascade.prepend` transition notice from
   `content/influxdb3/explorer/_index.md`.
3. Leave all frontmatter version markers in place. They state a fact about the
   release, not a temporary condition.

## Verification

1. `npx hugo --quiet` builds without errors.

2. `yarn check:md-coherence` confirms the head links, `sitemap-md.xml`, and
   corpus surfaces agree after pages are published.

3. Confirm the notification renders on the scoped paths and doesn't render on
   the excluded ones.

4. After deploy, confirm the version marker leads each new page's Markdown
   twin. PR previews return 404 for twins, so use production or staging:

   ```sh
   curl -s --compressed https://docs.influxdata.com/influxdb3/explorer/<page>/index.md | head -20
   ```

5. Confirm the notification text doesn't appear in the twin or in
   `https://docs.influxdata.com/influxdb3/explorer/llms-full.txt`. Notifications
   are footer content; if the text appears in either file, it was added to the
   wrong surface.

6. Ask the documentation MCP server how to install Explorer and how to use the
   new feature. Both answers state the version requirement.
