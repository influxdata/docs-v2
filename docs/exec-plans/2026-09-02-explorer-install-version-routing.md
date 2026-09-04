# Explorer install docs: route by version and edition

**Status:** In review — PR [#7734](https://github.com/influxdata/docs-v2/pull/7734)
**Closes:** [#6702](https://github.com/influxdata/docs-v2/issues/6702)

## Goal

Restructure the InfluxDB 3 Explorer install documentation so that each page
states which Explorer versions and which InfluxDB 3 editions it applies to.
After this change, `/influxdb3/explorer/install/` routes readers by version
instead of presenting Docker as the only deployment method, and the Docker
instructions live on a child page that declares its version ceiling in
frontmatter, in the lede, and in the Markdown twin.

## Why now

Explorer v1.9 is the last release distributed as a standalone Docker container.
Starting with v1.10, Explorer is included with InfluxDB 3 Enterprise and is
deployed as WebAssembly (WASM). The current pages have no version or edition
scoping:

- `content/influxdb3/explorer/install.md` documents only Docker.
- `content/influxdb3/explorer/_index.md` repeats a `docker pull` quick start.
- `content/influxdb3/explorer/about/_index.md` states full Core and Enterprise
  support with no end version.
- `data/products.yml` lists `Docker` in `schema.operating_system`, which feeds
  the JSON-LD `SoftwareApplication` node.

Each of these tells readers, search engines, retrieval systems, and coding
agents that Explorer is a Docker container that works with Core. Doing the
restructure before v1.10 ships means the corpus and search index carry the
version scoping before the release changes the answer.

Issue #6702 reports the related gap: the docs never state outright which
distributions exist, so a docs-grounded assistant can only infer the
limitation.

## Decisions

- **Keep `/influxdb3/explorer/install/` as the URL and convert it to a
  version-routing hub.** The URL holds the search ranking, seven inbound
  in-repo links (three of them deep anchors), the `llms.txt` corpus entry, and
  any existing model memory. Moving the page under `/get-started/` or demoting
  it in the navigation would break those without addressing the actual problem,
  which is the page content, not its address.
- **Move the Docker body to `install/docker.md` unchanged.** Keeping the body
  intact preserves the three anchors that other pages link to:
  `#choose-operational-mode`, `#network-exposure-and-access-control`, and
  `#set-file-permissions-for-upgrades`.
- **Do not redirect `/install/` to `/install/docker/`.** A redirect would send
  every "install Explorer" search result and every agent's first URL guess to
  the deprecated path.
- **Use `metadata: [Explorer v1.9 and earlier]` rather than
  `introduced`/`deprecated`.** Both render into the `ul.metadata` list under the
  h1 and into the first line of the Markdown twin, verified against
  `/influxdb3/clustered/reference/cli/influxctl/query/index.md` (`* influxctl
  2.4.0+`) and `/telegraf/v1/input-plugins/jenkins/index.md` (`* Telegraf
  v1.9.0+`). The `introduced`/`deprecated` pair renders as a range
  ("v1.0.0 – v1.10.0"), which is ambiguous about the last working release.
  `metadata` states the ceiling exactly.
- **Keep the Docker page published and indexed.** Explorer v1.9 remains
  supported, and removing or hiding the instructions creates a retrieval dead
  end. A page that states its own version ceiling is not misleading.
- **Use `cascade.prepend` on `explorer/_index.md` for the transition notice,
  not a template banner.** `article/stable-version.html` is gated on a
  hardcoded product whitelist and a `/vN/` URL segment, neither of which
  applies to Explorer, and extending it would add magic values to a template
  (see `.claude/rules/layouts.md`). `article/special-state.html` has the same
  problem. `cascade.prepend` is documented in `DOCS-FRONTMATTER.md` and needs no
  template change.
- **Accept the twin cost of the cascaded notice, and remove it after v1.11.**
  Prepended content appears in every Explorer Markdown twin and in
  `llms-full.txt`, which makes the first chunk of all 12 Explorer pages more
  alike (the twin-hygiene problem tracked in
  [#7323](https://github.com/influxdata/docs-v2/issues/7323)). The notice is
  three lines and is worth that cost while the transition is live.
- **Document version verification with `GET /ping`, not only
  `influxdb3 --version`.** WASM availability depends on the InfluxDB 3 server
  version and build, not on Explorer alone. `GET /ping` returns
  `x-influxdb-version` and `x-influxdb-build` (`Core` or `Enterprise`) in
  headers and `version` in the body
  (`api-docs/influxdb3/enterprise/influxdb3-enterprise-openapi.yaml`), so one
  command answers both questions and works headlessly against a remote
  instance. A `HEAD` request returns 404, so the docs specify `GET`.

## Explicitly out of scope

- WASM deployment instructions under `/influxdb3/enterprise/`. Those wait until
  v1.10 ships; this change only prepares the routing and cross-links.
- `data/products.yml` updates to `latest_patch` and `schema.operating_system`.
  Both change on release day, not before.
- The `localhost` connection failure reported in
  [#7333](https://github.com/influxdata/docs-v2/issues/7333). It affects the
  Docker instructions but is a separate content fix.
- Extending `article/stable-version.html` to support products without a `/vN/`
  URL segment.

## How to update

The Explorer version ceiling appears in four places on
`content/influxdb3/explorer/install/docker.md`: the `metadata` frontmatter, the
`description` frontmatter, the lede, and the transition notice cascaded from
`content/influxdb3/explorer/_index.md`. Update the notice in `_index.md` once
and it changes on every Explorer page. Remove the `cascade.prepend` block when
v1.11 ships.

## Verification

1. `npx hugo --quiet` builds without errors.
2. Confirm the three anchors still resolve within `install/docker/`, and that no
   in-repo link points at `/influxdb3/explorer/install/#` for a Docker-only
   section.
3. `yarn check:md-coherence` confirms the head link, `sitemap-md.xml`, and
   corpus surfaces agree after the URL structure changes.
4. Run the Cypress navigation tests. Converting a single page to a section
   changes the menu tree.
5. After deploy, check the published Markdown twins. PR previews return 404 for
   twins, so use production or staging:

   ```sh
   curl -s --compressed https://docs.influxdata.com/influxdb3/explorer/install/index.md | head -20
   curl -s --compressed https://docs.influxdata.com/influxdb3/explorer/install/docker/index.md | head -20
   ```

   The Docker twin starts with `* Explorer v1.9 and earlier` above the lede.
6. Ask the documentation MCP server "How do I install InfluxDB 3 Explorer?"
   after the corpus rebuilds. The answer routes by version instead of returning
   `docker run`.
