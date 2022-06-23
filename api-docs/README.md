# API reference documentation

## How to update API docs for InfluxDB Cloud

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

   To troubleshoot errors, see [how to generate API docs locally](#how-to-generate-api-docs-locally).
3. Enter the following commands into your terminal to generate the API docs with Redocly:

   ```sh
   sh generate-api-docs.sh
   ```

   To troubleshoot errors, see [how to generate API docs locally](#how-to-generate-api-docs-locally).
4. Commit the changes, push your branch to `influxdata/docs-v2`, and create a PR against the `master` branch.

## How to update API docs for a new InfluxDB OSS version release

1. Go into your local `influxdata/openapi` repo directory--for example:

   ```sh
   cd ~/github/openapi
   ```

2. Get the SHA for the release commit (or consult Team-Edge if you're not sure)--for example, enter the following command into your terminal to get the latest SHA for `contracts/ref/oss.yml` :

   ```sh
   git log -n 1 --pretty=format:%h -- contracts/ref/oss.yml
   ```

3. Copy the SHA from the output and create a git tag for it with the pattern `influxdb-oss-v[SEMANTIC_VERSION]`:

   ```sh
   git tag influxdb-oss-v[SEMANTIC_VERSION] COMMIT_SHA
   ```

   Replace the following:

   - **`COMMIT_SHA`**: SHA from **Step 2**.
   - **`[SEMANTIC_VERSION]`**: OSS patch release number--for example: `2.3.0`.

4. Enter the following commands into your terminal to push the new tag to the repo:

   ```sh
   git push tags
   ```

5. Enter the following commands into your terminal to update `docs-release/influxdb-oss` branch to the OSS release commit, rebase or reset the branch to the [latest release of InfluxDB OSS](#how-to-find-the-api-spec-used-by-an-influxdb-oss-version).

   ```sh
   git checkout docs-release/influxdb-oss
   git rebase -i OSS_RELEASE_TAG
   git push -f origin docs-release/influxdb-oss
   ```

   Replace the following:

   - **`OSS_RELEASE_TAG`**: release tag name or SHA from **Step 3**.
  
6. Go into your `docs-v2` directory and create a branch for your changes--for example:

   ```sh
   cd ~/github/docs-v2
   git fetch -ap
   git checkout -b release/api-oss origin/master
   ```

7. In `./api-docs`, create a directory for the new OSS version number--for example:

   ```sh
   # In your terminal, go to the `docs-v2/api-docs` directory:
   cd ./api-docs

   # Create the directory:
   mkdir v2.3
   ```

8. Enter the following commands into your terminal to fetch and process the contracts:

   ```sh
   # Fetch the contracts, apply customizations, and bundle.
   sh getswagger.sh oss
   ```

   To troubleshoot errors, see [how to generate API docs locally](#how-to-generate-api-docs-locally).
9. Enter the following commands into your terminal to generate the API docs with Redocly:

   ```sh
   sh generate-api-docs.sh
   ```

   To troubleshoot errors, see [how to generate API docs locally](#how-to-generate-api-docs-locally).
10. Commit the changes, push your branch to `influxdata/docs-v2`, and create a PR against the `master` branch.

## How to update API docs for OSS spec changes between releases

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

3. Cherry-pick the new documentation commits into the release branch and push to the remote branch--for example:

   ```sh
   git cherry-pick [COMMIT_SHAs]
   git push -f origin docs-release/influxdb-oss
   ```

   Replace the following:

   - **`[COMMIT_SHAs]`**: one or more commit SHAs (space-separated).
  
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

7. Enter the following commands into your terminal to generate the API docs with Redocly:

   ```sh
   sh generate-api-docs.sh
   ```

8. Commit the changes, push your branch to `influxdata/docs-v2`, and create a PR against the `master` branch.

## How to generate InfluxDB API docs

InfluxData uses [Redoc](https://github.com/Redocly/redoc/),
[redoc-cli](https://github.com/Redocly/redoc/blob/master/cli/README.md),
and Redocly's [OpenApi CLI](https://redoc.ly/docs/cli/) to generate
API documentation from the [InfluxDB OpenAPI (aka Swagger) contracts](https://github.com/influxdata/openapi).

To minimize the size of the `docs-v2` repository, the generated API documentation HTML is gitignored, therefore
not committed to the docs repo.
The InfluxDB docs deployment process uses OpenAPI specification files in the `api-docs` directory
to generate version-specific (Cloud, OSS v2.1, OSS v2.0, etc.) API documentation.

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

Because InfluxDB Cloud releases are frequent and not versioned, we make no effort to version the
Cloud API spec.
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

## How to generate API docs locally

Because the API documentation HTML is gitignored, you must manually generate it
to view the API docs locally.

Verify that you have a working `npx` (it's included with Node.js).
In your terminal, run:

```sh
npx --version
```

If `npx` returns errors, [download](https://nodejs.org/en/) and run a recent version of the Node.js installer for your OS.

```sh
# In your terminal, go to the `docs-v2/api-docs` directory:
cd api-docs

# Generate the API docs with Redocly
sh generate-api-docs.sh
```

## How to use custom OpenAPI spec processing

Generally, you should manage API content in `influxdata/openapi`.
In some cases, however, you may want custom processing (e.g. collecting all Tags)
or additional content (e.g. describing the reference documentation)
specifically for the docs.

When you run `getswagger.sh`, it executes `@redocly/openapi-cli` and the plugins listed in `.redocly.yaml`.
[`./openapi/plugins`](./openapi/plugins) use
[`./openapi/plugins/decorators`](./openapi/plugins/decorators) to apply custom
processing to OpenAPI specs.

`.yml` files in [`./openapi/content`](./openapi/content) set content for sections (nodes) in the contract.
To update the content for those nodes, you only need to update the YAML files.
To add new YAML files for other nodes in the contracts,
configure the new content YAML file in [`./openapi/content/content.js`](./openapi/content/content.js).
The content structure and Markdown must be valid OAS.

Then, you'll need to write or update a decorator module for the node and configure the decorator in the plugin,
e.g. [`./openapi/plugins/docs-plugin.js`](`./openapi/plugins/docs-plugin.js).
See the [complete list of OAS v3.0 nodes](https://github.com/Redocly/openapi-cli/blob/master/packages/core/src/types/oas3.ts#L529).

`@redocly/openapi-cli` requires that modules use CommonJS `require` syntax for imports.

### How to add tag content or describe a group of paths

In API reference docs, we use OpenAPI `tags` elements for navigation and the
`x-traitTag` vendor extension to define custom content.

| Example                                                                                                | OpenAPI field                                         |                                            |
|:-------------------------------------------------------------------------------------------------------|-------------------------------------------------------|--------------------------------------------|
| [Add supplementary documentation](https://docs.influxdata.com/influxdb/cloud/api/#tag/Quick-start)     | `tags: [ { name: 'Quick start', x-traitTag: true } ]` | [Source](https://github.com/influxdata/openapi/master/src/cloud/tags.yml) |
| [Group and describe related paths](https://docs.influxdata.com/influxdb/cloud/api/#tag/Authorizations) | `tags: [ { name: 'Buckets', description: '...' } ]`   | [Source](https://github.com/influxdata/openapi/master/src/cloud/tags-groups.yml)) |

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
