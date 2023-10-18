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

`gsd` generates the local contracts in `~/github/openapi`, validates them with OATS, bundles and lints them with `@redocly/cli`, and then generates the HTML with `@redocly/cli`.

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
   
8. In your editor, update custom content files in NEW_VERSION/content.

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

InfluxData uses [Redoc](https://github.com/Redocly/redoc/),
[redoc-cli](https://github.com/Redocly/redoc/blob/master/cli/README.md),
and Redocly's [OpenApi CLI](https://redoc.ly/docs/cli/) to generate
API documentation from the [InfluxDB OpenAPI (aka Swagger) contracts](https://github.com/influxdata/openapi).

To minimize the size of the `docs-v2` repository, the generated API documentation HTML is gitignored, therefore
not committed to the docs repo.
The InfluxDB docs deployment process uses OpenAPI specification files in the `api-docs` directory
to generate version-specific (Cloud, OSS v2.1, OSS v2.0, etc.) API documentation.

### Generate API docs locally

Because the API documentation HTML is gitignored, you must manually generate it
to view the API docs locally.

The `./generate.sh` script uses the Redoc CLI to generate Redocly HTML, Javascript,
and CSS for each version of the InfluxDB spec.
The script uses `npx` to download and execute the Redocly CLI.

1. Verify that you have a working `npx` (it's included with Node.js).
   In your terminal, run:

   ```sh
   npx --version
   ```

   If `npx` returns errors, [download](https://nodejs.org/en/) and run a recent version of the Node.js installer for your OS.

2. To generate API docs for _all_ InfluxDB versions in `./openapi`, enter the following command into your terminal:

   ```sh
   sh generate-api-docs.sh
   ```

   To save time testing your spec changes, you can pass the `-c` flag
   to regenerate HTML for only the OpenAPI files that differ from your `master` branch.

   ```sh
   sh generate-api-docs.sh -c
   ```

## How we version OpenAPI contracts

The `api-docs` directory structure versions OpenAPI files using the following pattern:

```md
api-docs/
  |-- cloud/
  │     └── ref.yml
  │     └── swaggerV1Compat.yml
  ├── v2.0/
  │     └── ref.yml
  │     └── swaggerV1Compat.yml
  ├── v2.1/
  │     └── ref.yml
  │     └── swaggerV1Compat.yml
  ├── v2.2/
  │     └── ref.yml
  │     └── swaggerV1Compat.yml
  └── etc...
```

### InfluxDB Cloud version

InfluxDB Cloud releases are frequent and not versioned, so the Cloud API spec isn't versioned.
We regenerate API reference docs from `influxdata/openapi`
**master** branch as features are released.

### InfluxDB OSS version

 Given that
 `influxdata/openapi` **master** may contain OSS spec changes not implemented
 in the current OSS release, we (Docs team) maintain a release branch, `influxdata/openapi`
**docs-release/influxdb-oss**, used to generate OSS reference docs.

### How to find the API spec used by an InfluxDB OSS version

`influxdata/openapi` does not version the InfluxData API.
To find the `influxdata/openapi` commit SHA used in a specific version of InfluxDB OSS,
see `/scripts/fetch-swagger.sh` in `influxdata/influxdb`--for example,
for the `influxdata/openapi` commit used in OSS v2.2.0, see https://github.com/influxdata/influxdb/blob/v2.2.0/scripts/fetch-swagger.sh#L13=.
For convenience, we tag `influxdata/influxdb` (OSS) release points in `influxdata/openapi` as
`influxdb-oss-v[OSS_VERSION]`. See <https://github.com/influxdata/openapi/tags>.

## How to use custom OpenAPI spec processing

Generally, you should manage API content in `influxdata/openapi`.
In some cases, however, you may want custom processing (e.g. collecting all Tags)
or additional content (e.g. describing the reference documentation)
specifically for the docs.

When you run `getswagger.sh`, it executes `@redocly/openapi-cli` and the plugins listed in `.redocly.yaml`.
[`./openapi/plugins`](./openapi/plugins) use
[`./openapi/plugins/decorators`](./openapi/plugins/decorators) to apply custom
processing to OpenAPI specs.

`.yml` files in [`./PLATFORM/content`](./openapi/content) define custom content for OpenAPI nodes published in the reference docs.
To update the content for those nodes, you only need to update the YAML files.
For example, to customize the Info section for the Cloud API reference, edit `./cloud/content/info.yml`.

To add new YAML files for other nodes in the contracts, follow these steps:

1. Create your new content file with valid OAS content structure and Markdown.
2. Configure the new content YAML file in [`./openapi/content/content.js`](./openapi/content/content.js).
3. Write or update a decorator module for the node and configure the decorator in
   [`./openapi/plugins/docs-plugin.js`](`./openapi/plugins/docs-plugin.js).
   See the [complete list of OAS v3.0 nodes](https://github.com/Redocly/openapi-cli/blob/master/packages/core/src/types/oas3.ts#L529).

`@redocly/cli` requires that modules use CommonJS `require` syntax for imports.

`@redocly/cli` also provides some [built-in decorators](https://redocly.com/docs/cli/decorators/)
that you can configure in `.redocly` without having to write JavaScript.
### How to add tag content or describe a group of paths

In API reference docs, we use OpenAPI `tags` elements for navigation,
the `x-traitTag` vendor extension for providing custom content, and the `x-tagGroups` vendor extension
for grouping tags in navigation.

| Example                                                                                                | OpenAPI field                                         |                                            |
|:-------------------------------------------------------------------------------------------------------|-------------------------------------------------------|--------------------------------------------|
| [Add supplementary documentation](https://docs.influxdata.com/influxdb/cloud/api/#tag/Quick-start)     | `tags: [ { name: 'Quick start', x-traitTag: true } ]` | [Source](https://github.com/influxdata/openapi/master/src/cloud/tags.yml) |
| Group tags in navigation                                                                               | `x-tagGroups: [ { name: 'All endpoints', tags: [...], ...} ]`   | [Source](https://github.com/influxdata/docs-v2/blob/da6c2e467de7212fc2197dfe0b87f0f0296688ee/api-docs/cloud-iox/content/tag-groups.yml)) |

#### Add and update x-tagGroups

Custom `x-tagGroups` configured in
`PLATFORM/content/tag-groups.yml` override `x-tagGroups` defined in `influxdata/openapi`.
If you assign a list of tags to the `All endpoints` tag group,
the decorator applies your list and removes Operations that don't contain
those tags.
If you assign an empty array(`[]`) to the `All endpoints` x-tagGroup in `PLATFORM/content/tag-groups.yml`,
the decorator replaces the empty array with the list of tags from all Operations in the spec.

## How to test your spec or API reference changes

You can use `getswagger.sh` to fetch contracts from any URL.
For example, if you've made changes to spec files and generated new contracts in your local `openapi` repo, run `getswagger.sh` to fetch and process them.

To fetch contracts from your own `openapi` repo, pass the
`-b` `base_url` option and the full path to your `openapi` directory.

```sh
# Use the file:/// protocol to pass your openapi directory.
sh getswagger.sh oss -b file:///Users/me/github/openapi
```

After you fetch them, run the linter or generate HTML to test your changes before you commit them to `influxdata/openapi`.
By default, `getswagger.sh` doesn't run the linter when bundling
the specs.
Manually run the [linter rules](https://redoc.ly/docs/cli/resources/built-in-rules/) to get a report of errors and warnings.

```sh
npx @redocly/openapi-cli lint v2.1/ref.yml
```

### Configure OpenAPI CLI linting and bundling

The `.redoc.yaml` configuration file sets options for the `@redocly/openapi-cli` [`lint`](https://redoc.ly/docs/cli/commands/lint/) and [`bundle`](https://redoc.ly/docs/cli/commands/bundle/) commands.
`./openapi/plugins` contains custom InfluxData Docs plugins composed of *rules* (for validating and linting) and *decorators* (for customizing). For more configuration options, see `@redocly/openapi-cli` [configuration file documentation](https://redoc.ly/docs/cli/configuration/configuration-file/).
