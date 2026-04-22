# API reference documentation

## TL;DR: validate and test your local `influxdata/openapi` changes

1. After you've edited `influxdata/openapi` definitions, you need to generate and validate contracts and test the API reference docs.
   To create a shell alias that does this, open your `~/.profile` in an editor and add the following commands to the file:

   ```sh
   export DOCS="$HOME/github/docs-v2"
   alias gsd="cd $HOME/github/openapi && make generate-all && \
              npx oats ./contracts/ref/cloud.yml && npx oats ./contracts/ref/oss.yml && \
              cd $DOCS/api-docs && ./getswagger.sh all -b file:///$HOME/github/openapi && \
              sh ./generate-api-docs.sh"
   ```

2. To refresh your environment with the `~/.profile` changes, enter the following command into your terminal:

   ```sh
   source ~/.profile
   ```

3. To run the alias, enter the following command into your terminal:

   ```sh
   gsd
   ```

`gsd` generates the local contracts in `~/github/openapi`, validates them with OATS, bundles and lints them with `@redocly/cli`, and then generates Hugo-native API reference pages.

## Update API docs for InfluxDB Cloud

1. In your `docs-v2` directory, create a branch for your changes--for example:

   ```sh
   cd ~/github/docs-v2
   git fetch -ap
   git checkout -b release/api-cloud origin/master
   ```

2. Enter the following commands into your terminal to fetch and process the contracts:

   ```sh
   # In your terminal, go to the `docs-v2/api-docs` directory:
   cd ./api-docs

   # Fetch the contracts, apply customizations, and bundle.
   sh getswagger.sh cloud
   ```

3. To generate the HTML files for local testing, follow the instructions to [generate API docs locally](#generate-api-docs-locally).

4. To commit your updated spec files, push your branch to `influxdata/docs-v2`, and create a PR against the `master` branch.

## Update API docs for an InfluxDB OSS release

1. Go into your local `influxdata/openapi` repo directory--for example:

   ```sh
   cd ~/github/openapi
   ```

2. Get the SHA for the release commit (or consult Team-Edge if you're not sure)--for example, enter the following command into your terminal to get the latest SHA for `contracts/ref/oss.yml` :

   ```sh
   git log -n 1 --pretty=format:%h -- contracts/ref/oss.yml
   ```

3. Copy the SHA from the output and create a git tag by running the following command, replacing **`[SEMANTIC_VERSION]`** with the OSS release (for example, `2.3.0`) and **`COMMIT_SHA`** with the SHA from step 2:

   ```sh
   git tag influxdb-oss-v[SEMANTIC_VERSION] COMMIT_SHA
   ```

4. Enter the following commands into your terminal to push the new tag to the repo:

   ```sh
   git push --tags
   ```

5. Enter the following commands into your terminal to update `docs-release/influxdb-oss` branch to the OSS release commit and rebase the branch to the [latest release of InfluxDB OSS](#how-to-find-the-api-spec-used-by-an-influxdb-oss-version), replacing **`OSS_RELEASE_TAG`** with the SHA from step 3.

   ```sh
   git checkout docs-release/influxdb-oss
   git rebase -i OSS_RELEASE_TAG
   git push -f origin docs-release/influxdb-oss
   ```

6. Go into your `docs-v2` directory and create a branch for your changes--for example:

   ```sh
   cd ~/github/docs-v2
   git fetch -ap
   git checkout -b release/api-oss origin/master
   ```

7. In `./api-docs`, copy the previous version or create a directory for the new OSS version number--for example:

   ```sh
   # In your terminal, go to the `docs-v2/api-docs` directory:
   cd ./api-docs
   ```

   If the old version directory contains custom content files (for example, v2.2/content), you'll likely want to copy
   those for the new version.

   ```sh
   # Copy the old version directory to a directory for the new version:
   cp -r v2.2 v2.3
   ```

8. In your editor, update custom content files in NEW\_VERSION/content.

9. Enter the following commands into your terminal to fetch and process the contracts:

   ```sh
   # Fetch the contracts, apply customizations, and bundle.
   sh getswagger.sh oss
   ```

10. To generate the HTML files for local testing, follow the instructions to [generate API docs locally](#generate-api-docs-locally).

11. To commit your updated spec files, push your branch to `influxdata/docs-v2`, and create a PR against the `master` branch.

## Update API docs for OSS spec changes between releases

Follow these steps to update OSS API docs between version releases--for example, after revising description fields in `influxdata/openapi`.

1. Go into your local `influxdata/openapi` repo directory--for example:

   ```sh
   cd ~/github/openapi
   ```

2. Enter the following commands into your terminal to checkout `docs-release/influxdb-oss` branch:

   ```sh
   git fetch -ap
   git checkout -t docs-release/influxdb-oss
   ```

3. Cherry-pick the commits with the updated description fields, and push the commits to the remote branch, replacing **`[COMMIT_SHAs]`** (one or more commit SHAs (space-separated))--for example:

   ```sh
   git cherry-pick [COMMIT_SHAs]
   git push -f origin docs-release/influxdb-oss

   ```

4. Go into your `docs-v2` directory and create a branch for your changes--for example:

   ```sh
   cd ~/github/docs-v2
   git fetch -ap
   git checkout -b docs/api-oss origin/master
   ```

5. Go into `./api-docs` directory--for example:

   ```sh
   # In your terminal, go to the `docs-v2/api-docs` directory:
   cd ./api-docs
   ```

6. Enter the following commands into your terminal to fetch and process the contracts:

   ```sh
   # Fetch the contracts, apply customizations, and bundle.
   sh getswagger.sh oss
   ```

7. To generate the HTML files for local testing, follow the instructions to [generate API docs locally](#generate-api-docs-locally).

8. To commit your updated spec files, push your branch to `influxdata/docs-v2`, and create a PR against the `master` branch.

## Generate InfluxDB API docs

InfluxData uses [@redocly/cli](https://redocly.com/docs/cli/) to bundle and lint specs,
and Hugo-native templates to render API reference pages from the
[InfluxDB OpenAPI (aka Swagger) contracts](https://github.com/influxdata/openapi).

To minimize the size of the `docs-v2` repository, generated API content pages are gitignored
and not committed to the docs repo.
The InfluxDB docs deployment process uses OpenAPI specification files in the `api-docs` directory
to generate product-specific API documentation.

### Generate API docs locally

Because the API documentation HTML is gitignored, you must manually generate it
to view the API docs locally.

The `./generate-api-docs.sh` script orchestrates the API docs pipeline:
post-process specs (apply overlays and tag configs) and generate Hugo article data and content pages.

1. Verify that you have a working `npx` (it's included with Node.js).
   In your terminal, run:

   ```sh
   npx --version
   ```

   If `npx` returns errors, [download](https://nodejs.org/en/) and run a recent version of the Node.js installer for your OS.

2. To generate API docs for *all* InfluxDB versions in `./openapi`, enter the following command into your terminal:

   ```sh
   sh generate-api-docs.sh
   ```

   To save time testing your spec changes, you can pass the `-c` flag
   to regenerate HTML for only the OpenAPI files that differ from your `master` branch.

   ```sh
   sh generate-api-docs.sh -c
   ```

## How we version OpenAPI contracts

The `api-docs` directory structure organizes OpenAPI files by product:

```md
api-docs/
  ├── influxdb3/
  │     ├── core/
  │     │     ├── influxdb3-core-openapi.yaml
  │     │     ├── tags.yml
  │     │     └── .config.yml
  │     ├── enterprise/
  │     ├── cloud-dedicated/
  │     ├── cloud-serverless/
  │     └── clustered/
  ├── influxdb/
  │     ├── cloud/
  │     ├── v2/
  │     └── v1/
  └── enterprise_influxdb/
        └── v1/
```

### InfluxDB Cloud version

InfluxDB Cloud releases are frequent and not versioned, so the Cloud API spec isn't versioned.
We regenerate API reference docs from `influxdata/openapi`
**master** branch as features are released.

### InfluxDB OSS v2 version

Given that
`influxdata/openapi` **master** may contain OSS spec changes not implemented
in the current OSS release, we (Docs team) maintain a release branch, `influxdata/openapi`
**docs-release/influxdb-oss**, used to generate OSS reference docs.

### How to find the API spec used by an InfluxDB OSS version

`influxdata/openapi` does not version the InfluxData API.
To find the `influxdata/openapi` commit SHA used in a specific version of InfluxDB OSS,
see `/scripts/fetch-swagger.sh` in `influxdata/influxdb`--for example,
for the `influxdata/openapi` commit used in OSS v2.2.0, see <https://github.com/influxdata/influxdb/blob/v2.2.0/scripts/fetch-swagger.sh#L13=>.
For convenience, we tag `influxdata/influxdb` (OSS) release points in `influxdata/openapi` as
`influxdb-oss-v[OSS_VERSION]`. See <https://github.com/influxdata/openapi/tags>.

## How to use custom OpenAPI spec processing

Generally, you should manage API content in `influxdata/openapi`.
For docs-specific customizations, use the overlay and tag config files
in each product's `api-docs/` directory.

### Content overlays

Each product directory can contain overlay files that the `post-process-specs.ts`
script applies to the bundled spec before article generation:

| Overlay          | Location                             | Behavior                                                                                 |
| ---------------- | ------------------------------------ | ---------------------------------------------------------------------------------------- |
| `content/info.yml`    | `{product}/content/info.yml`   | Merges each field into `spec.info`, preserving fields not in the overlay                 |
| `content/servers.yml` | `{product}/content/servers.yml`| Replaces `spec.servers` entirely                                                         |
| `content/page.yml`    | `{product}/content/page.yml`   | Sets the API landing page `description` and optional `body_extra` (e.g., callout blocks) |
| `tags.yml`            | Colocated with spec            | Renames tags, sets descriptions and `x-related`, drops unsupported tags                  |

For example, to customize the Info section for the Cloud Serverless API reference, edit
`influxdb3/cloud-serverless/content/info.yml`.

### Redocly bundling and linting

`getswagger.sh` uses `@redocly/cli` to bundle and lint specs.
The `.redocly.yaml` configuration file sets options for the
[`lint`](https://redocly.com/docs/cli/commands/lint/) and
[`bundle`](https://redocly.com/docs/cli/commands/bundle/) commands.

### How to add tag content or describe a group of paths

Each product has a `tags.yml` file colocated with its spec that configures tag
names, descriptions, vendor extensions, and related links.
The `post-process-specs.ts` script applies these configs to the bundled spec
before article generation.

#### Tag config format (`tags.yml`)

```yaml
tags:
  # Operation-backed tag — groups API endpoints
  Write data:
    description: >
      Write time series data to InfluxDB 3 Core in line protocol format using
      the v1, v2, or v3 write endpoints.
    x-related:
      - title: Write data using HTTP APIs
        href: /influxdb3/core/write-data/http-api/
      - title: Line protocol reference
        href: /influxdb3/core/reference/syntax/line-protocol/

  # Trait tag — supplementary documentation, no operations
  Quick start:
    x-traitTag: true
    description: >
      Get started authenticating, writing, and querying data with the
      InfluxDB 3 Core API.

  # Rename a tag from the upstream spec
  Cache data:
    rename: Cache distinct values
    description: >
      Query cached distinct values.
```

#### Field reference

| Field         | Type    | Description                                                                                                                                                                                            |
| ------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `description` | string  | Tag description rendered in the API reference. Use `>` (folded scalar) for prose, `\|` (literal scalar) for multiline markdown with links or HTML.                                                     |
| `x-traitTag`  | boolean | When `true`, marks the tag as supplementary documentation — it appears in the sidebar but has no associated operations. Use for tags like Authentication, Quick start, Headers, and API compatibility. |
| `x-related`   | list    | Related documentation links rendered below the tag description. Each item has `title` (link text) and `href` (URL path or full URL).                                                                   |
| `rename`      | string  | Renames the tag in both `tags[]` and all `operation.tags[]` references. Use when the upstream tag name is too generic or doesn't match docs conventions.                                               |

#### Tag categories

**Operation-backed tags** group API endpoints. Every operation in the spec
has a `tags[]` array; each unique tag name becomes a navigation section.
These tags need a `description` and usually `x-related` links.

**Trait tags** (`x-traitTag: true`) are supplementary documentation sections
with no operations. They appear in the sidebar as standalone content pages.
Common trait tags: Authentication, Quick start, Headers, API compatibility,
Common parameters, Response codes, Pagination.

#### One tag per operation

Assign exactly **one tag** per operation. Most API documentation UIs don't
handle multi-tagged operations well — the operation appears in multiple
navigation sections, which is confusing.

Use `x-compatibility-version` instead of a second tag to mark compatibility
endpoints. The build pipeline extracts this vendor extension and renders
version badges in the UI.

```yaml
# Correct — single tag + compatibility marker
/api/v2/write:
  post:
    summary: Write data (v2 compatible)
    x-compatibility-version: v2
    tags:
      - Write

# Wrong — dual-tagged, appears under both Write and v2 Compatibility
/api/v2/write:
  post:
    summary: Write data (v2 compatible)
    tags:
      - v2 Compatibility
      - Write
```

For operations that belong purely to a compatibility layer (e.g.,
`/api/v2/buckets` in a v1 product — no equivalent in the native API),
use the compatibility tag as the single tag:

```yaml
/api/v2/buckets:
  get:
    summary: List buckets (v2 compatible)
    x-compatibility-version: v2
    tags:
      - v2 Compatibility
```

**`x-compatibility-version` values:** `v1`, `v2`, or `v3`. The build pipeline
(`openapi-paths-to-hugo-data/index.ts`) extracts this into `compatVersion`
in the article frontmatter, which templates use to render version badges.

**Authentication tags** are a special case — they use `|` (literal scalar)
for the description because they contain a markdown list and
`<!-- ReDoc-Inject: <security-definitions> -->`, which renders the API's
security scheme definitions inline. Security scheme anchor names vary by
product:

| Product family                                          | Scheme anchors                                                                                    |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| v3 (Core, Enterprise, Dedicated, Serverless, Clustered) | `TokenAuthentication`, `BearerAuthentication`, `BasicAuthentication`, `QuerystringAuthentication` |
| v2 (Cloud, OSS v2)                                      | `TokenAuthentication`, `BasicAuthentication`, `QuerystringAuthentication`                         |
| v1 (OSS v1, Enterprise v1)                              | `BasicAuth`, `QueryAuth`, `TokenAuth`                                                             |

#### Writing tag descriptions

- Start with a verb phrase describing what the endpoints do
  (e.g., "Create and manage...", "Write time series data...", "Query data...")
- Include the full product name on first reference
  (e.g., "InfluxDB 3 Core", "InfluxDB Cloud", "InfluxDB Enterprise v1")
- Keep descriptions to 2-3 lines (folded scalar `>` handles wrapping)
- Don't include documentation links in descriptions — use `x-related` instead
- For management API tags, don't repeat links that are in the main product's
  data API tags

#### Content overlay discovery

The post-processor looks for content files in two locations, in order:

1. **Spec directory**: `{specDir}/content/{file}` (e.g., `influxdb3/core/content/info.yml`)
2. **Product directory fallback**: `{productDir}/content/{file}` (e.g., `influxdb3/core/content/info.yml`)

For products with multiple APIs (e.g., Cloud Dedicated has both data and
management APIs), the spec-specific directory takes precedence.

| Overlay       | Behavior                                                                                 |
| ------------- | ---------------------------------------------------------------------------------------- |
| `info.yml`    | Merges each field into `spec.info`, preserving fields not in the overlay                 |
| `servers.yml` | Replaces `spec.servers` entirely                                                         |
| `tags.yml`    | Colocated with spec (not in `content/`). Renames tags, sets descriptions and `x-related` |

#### Reviewing tags across products

When editing tags, check consistency across related products:

- **Core and Enterprise** share the same spec structure — their tags should
  use parallel descriptions (swap product name only)
- **Cloud Dedicated and Clustered** share management API tags — keep
  descriptions and `x-related` links parallel
- **Cloud v2 and OSS v2** share most tags — Cloud omits a few OSS-only tags
  (Backup, Restore, Scraper Targets) and adds Cloud-only tags (Limits, Usage,
  Invokable Scripts)
- **OSS v1 and Enterprise v1** are similar — Enterprise adds the `consistency`
  parameter note in Write and cluster-specific language

## Documentation links in OpenAPI specs

Use the `/influxdb/version/` placeholder when including InfluxDB links in OpenAPI spec description and summary fields.
The build process automatically transforms these placeholders to product-specific paths based on the spec file location.

### Writing links

```yaml
# In api-docs/influxdb3/core/openapi/ref.yml
info:
  description: |
    See [authentication](/influxdb/version/api/authentication/) for details.
    Related: [tokens](/influxdb/version/admin/tokens/)
```

After build, these become:

- `/influxdb3/core/api/authentication/`
- `/influxdb3/core/admin/tokens/`

### How it works

The product path is derived from the spec file location:

- `api-docs/influxdb3/core/...` → `/influxdb3/core`
- `api-docs/influxdb3/enterprise/...` → `/influxdb3/enterprise`
- `api-docs/influxdb/v2/...` → `/influxdb/v2`

Only `description` and `summary` fields are transformed.
Explicit cross-product links (e.g., `/telegraf/v1/plugins/`) remain unchanged.

### Link validation

Run with the `--validate-links` flag to check for broken links:

```bash
yarn build:api-docs --validate-links
```

This validates that transformed links point to existing Hugo content files and warns about any broken links.

## How to test your spec or API reference changes

You can use `getswagger.sh` to fetch contracts from any URL.
For example, if you've made changes to spec files and generated new contracts in your local `openapi` repo, run `getswagger.sh` to fetch and process them.

To fetch contracts from your own `openapi` repo, pass the
`-b` `base_url` option and the full path to your `openapi` directory.

```sh
# Use the file:/// protocol to pass your openapi directory.
sh getswagger.sh oss -b file:///Users/me/github/openapi
```

After you fetch them, run the linter or generate API pages to test your changes before you commit them to `influxdata/openapi`.
By default, `getswagger.sh` doesn't run the linter when bundling
the specs.
Manually run the [linter rules](https://redocly.com/docs/cli/resources/built-in-rules/) to get a report of errors and warnings.

```sh
npx @redocly/cli lint influxdb3/core/influxdb3-core-openapi.yaml
```

### Configure OpenAPI CLI linting and bundling

The `.redocly.yaml` configuration file sets options for the `@redocly/cli` [`lint`](https://redocly.com/docs/cli/commands/lint/) and [`bundle`](https://redocly.com/docs/cli/commands/bundle/) commands.
For more configuration options, see `@redocly/cli` [configuration file documentation](https://redocly.com/docs/cli/configuration/).
