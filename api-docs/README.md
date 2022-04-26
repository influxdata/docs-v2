# How to generate InfluxDB API docs

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

Because InfluxDB Cloud releases are frequent, we make no effort to version the
Cloud API spec. We regenerate API reference docs from `influxdata/openapi`
**master** as features are released.

### InfluxDB OSS version

 Given that
 `influxdata/openapi` **master** may contain OSS spec changes not implemented
 in the current OSS release, we (Docs team) maintain a release branch, `influxdata/openapi`
**docs-release/influxdb-oss**, used to generate OSS reference docs.

To update this branch to a new OSS release, (re)base on the commit or tag for the [latest release of InfluxDB OSS](#how-to-find-the-api-spec-used-by-an-influxdb-oss-version).

```sh
git checkout docs-release/influxdb-oss
git rebase -i influxdb-oss-v2.2.0
git push -f origin docs-release/influxdb-oss
```

To update this branch with documentation changes between OSS releases, cherry-pick your documentation commits into the release branch.

```sh
git checkout docs-release/influxdb-oss
git cherry-pick <commit hashes>
git push -f origin docs-release/influxdb-oss
```

### How to find the API spec used by an InfluxDB OSS version

`influxdata/openapi` does not version the InfluxData API.
To find the `influxdata/openapi` commit SHA used in a specific version of InfluxDB OSS,
see `/scripts/fetch-swagger.sh` in `influxdata/influxdb`,
e.g. https://github.com/influxdata/influxdb/blob/v2.2.0/scripts/fetch-swagger.sh#L13=.
For convenience, we tag `influxdata/influxdb` (OSS) release points in `influxdata/openapi` as
`influxdb-oss-v[OSS_VERSION]`. See <https://github.com/influxdata/openapi/tags>.

## How to fetch and process influxdata/openapi contracts

Update the contracts in `api-docs` to the latest from `influxdata/openapi`.

```sh
# In your terminal, go to the `docs-v2/api-docs` directory:
cd api-docs

# Fetch the contracts and run @redocly/openapi-cli to customize and bundle them.
sh getswagger.sh oss; sh getswagger.sh cloud
```

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

### How add tag content or describe a group of paths

In API reference docs, we use OpenAPI `tags` elements for navigation and the
`x-traitTag` vendor extension to define custom content.

| Example                                                                                                | OpenAPI field                                         |                                            |
|:-------------------------------------------------------------------------------------------------------|-------------------------------------------------------|--------------------------------------------|
| [Add supplementary documentation](https://docs.influxdata.com/influxdb/cloud/api/#tag/Quick-start)     | `tags: [ { name: 'Quick start', x-traitTag: true } ]` | [Source](https://github.com/influxdata/openapi/master/src/cloud/tags.yml) |
| [Group and describe related paths](https://docs.influxdata.com/influxdb/cloud/api/#tag/Authorizations) | `tags: [ { name: 'Buckets', description: '...' } ]`   | [Source](https://github.com/influxdata/openapi/master/src/cloud/tags-groups.yml)) |

## How to test your spec or API reference changes

You can use `getswagger.sh` to fetch contracts from any URL.
For example, if you've made changes to spec files and generated new contracts in your local `openapi` repo, use `getswagger.sh` to fetch and process them.

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
