# Explorer v1.10 release readiness

**Status:** In progress — PR [#7734](https://github.com/influxdata/docs-v2/pull/7734)
**Refs:** [2026-09-02-explorer-install-version-routing.md](2026-09-02-explorer-install-version-routing.md)

## Goal

Define the documentation work for the InfluxDB 3 Explorer v1.10 release and the
InfluxDB 3 Enterprise release that carries it. The install restructure prepares
the version routing; this plan covers what changes when v1.10 ships.

## Decisions

- **Every new feature page tells the reader how to check whether their version
  has the feature.** A version marker states the requirement, but a reader
  arriving from search doesn't know which version they're running. Each feature
  page states the requirement and shows the check, or links to the check in the
  install hub. See
  [DOCS-VERSION-AVAILABILITY.md](../../DOCS-VERSION-AVAILABILITY.md).
- **The check covers both the Explorer version and the InfluxDB 3 server
  version and edition.** A v1.10 feature can require both. `GET /ping` returns
  `x-influxdb-version` and `x-influxdb-build` (`Core` or `Enterprise`), so it
  answers the server half in one request, including against a remote instance.
- **Merge at release rather than publishing with `draft: true`.** Content pages
  merge on release day. Use `draft: true` only when a page must exist in the
  branch before the release for a specific reason, such as a link target that
  other merged content depends on.
- **Use `data/notifications.yaml` for the release announcement, and keep the
  version facts in the pages.** Notifications render in the footer, outside the
  article, so they don't appear in Markdown twins or `llms-full.txt`. The
  announcement is for readers; the version scope that agents and retrieval
  systems need stays in frontmatter and the lede.
- **Order the release-day merge so no published page points at an unpublished
  one.** Feature pages first, then the install hub lede, then
  `data/products.yml`.

## Before the release

1. Write each new feature page with its version marker: page-level `metadata:`
   when the whole page is new in v1.10, a `{metadata="v1.10+"}` heading
   attribute when only a section is.
2. Add the version check to each feature page. State the Explorer version the
   feature requires and, when the feature depends on the server, the InfluxDB 3
   version and edition. Show the `/ping` request or link to the check in the
   install hub.
3. Add the WASM deployment instructions to the InfluxDB 3 Enterprise section,
   including the server version that introduced them.
4. Add `alt_links` in both directions between each Explorer feature page and
   the Enterprise page that documents the server side.
5. Write the release notes entry in
   `content/influxdb3/explorer/release-notes/_index.md`.
6. Add a commented-out `data/notifications.yaml` entry with the final `id`,
   `scope`, `title`, and `slug`, following the `influxdb3-cloud-ga` stub
   already in that file.

## On release day

Merge in this order.

1. Feature pages and the Enterprise WASM deployment page.
2. The install hub lede at `content/influxdb3/explorer/install/_index.md`, so
   the WASM path is described first and Docker reads as the path for v1.9 and
   earlier.
3. `data/products.yml`: set `latest_patch` to the new Explorer version and
   update `schema.operating_system`, which lists `Docker` and feeds the JSON-LD
   `SoftwareApplication` node.
4. The release notes entry.
5. The `data/notifications.yaml` entry, uncommented.

## At v1.11

1. Delete the `data/notifications.yaml` entry by `id`.
2. Remove the `cascade.prepend` transition notice from
   `content/influxdb3/explorer/_index.md`.
3. Leave the frontmatter version markers. They state a fact about the release,
   not a temporary condition.

## Verification

1. `npx hugo --quiet` builds without errors.

2. `yarn check:md-coherence` confirms the head links, `sitemap-md.xml`, and
   corpus surfaces agree after the new pages publish.

3. The notification renders on its scoped paths and not on the excluded ones.

4. After deploy, the version marker leads each new page's Markdown twin. PR
   previews return 404 for twins, so use production or staging:

   ```sh
   curl -s --compressed https://docs.influxdata.com/influxdb3/explorer/<page>/index.md | head -20
   ```

5. The notification text appears in neither the twins nor
   `https://docs.influxdata.com/influxdb3/explorer/llms-full.txt`. If it does,
   it was added to the wrong surface.

6. Ask the documentation MCP server how to use a new v1.10 feature. The answer
   states the version requirement and how to check it.
