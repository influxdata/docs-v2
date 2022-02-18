## Generate InfluxDB API docs
InfluxData uses [Redoc](https://github.com/Redocly/redoc/),
[redoc-cli](https://github.com/Redocly/redoc/blob/master/cli/README.md),
and Redocly's [OpenApi CLI](https://redoc.ly/docs/cli/) to generate
API documentation from the [InfluxDB OpenAPI (aka Swagger) contracts](https://github.com/influxdata/openapi).

To minimize the size of the `docs-v2` repository, the generated API documentation HTML is gitignored, therefore
not committed to the docs repo.
The InfluxDB docs deployment process uses OpenAPI specification files in the `api-docs` directory
to generate version-specific (Cloud, OSS v2.1, OSS v2.0, etc.) API documentation.

### Versioned OpenAPI files
The `api-docs` directory structure versions OpenAPI files using the following pattern:

```
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

### Fetch and process openapi contracts
Update the contracts in `api-docs` to the latest from `influxdata/openapi`.

```sh
# In your terminal, go to the `docs-v2/api-docs` directory:
cd api-docs

# Fetch the contracts and run @redocly/openapi-cli to customize and bundle them.
sh getswagger.sh oss; sh getswagger.sh cloud
```

### Generate API docs locally
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

### Test your openapi spec edits
You can use `getswagger.sh` to fetch contracts from any URL.
For example, if you've made changes to spec files and generated new contracts in your local `openapi` repo, you can use `getswagger.sh` to fetch and process them.

To fetch contracts from your own `openapi` repo, pass the
`-b` `base_url` option and the full path to your `openapi` directory.

```sh
# Use the file:/// protocol to pass your openapi directory.
sh getswagger.sh oss -b file:///Users/me/github/openapi
```

After you fetch them, run the linter or generate HTML to test your changes before you commit them to `influxdata/openapi`.
By default, `getswagger.sh` doesn't run the linter when bundling
the specs. Manually run the linter rules to get a report of errors and warnings.

```sh
npx @redocly/openapi-cli lint v2.1/ref.yml
```

### Configure OpenAPI CLI linting and bundling
The `.redoc.yaml` configuration file sets linting and bundling options for the `@redocly/openapi-cli` CLI.
`./openapi/plugins` contains custom @redocly/openapi-cli plugins composed of *rules* (for validating and linting) and *decorators* (for customizing).

### Custom content
`./openapi/content` contains custom OAS (OpenAPI Spec) content in YAML files. The content structure and Markdown must be valid OAS.

`./openapi/plugins` use `./openapi/plugins/decorators` to apply the content to the contracts.
`.yml` files in `./openapi/content/` set content for sections (nodes) in the contract. To update the content for those nodes, you only need to update the YAML files.

To add new YAML files for other nodes in the openapi contracts, configure the new content YAML file in `./openapi/content/content.js`. Then, write a decorator module for the node and configure the decorator in the plugin, e.g. `./openapi/plugins/docs-plugin.js`. See the [complete list of OAS v3.0 nodes](https://github.com/Redocly/openapi-cli/blob/master/packages/core/src/types/oas3.ts#L529).

`@redocly/openapi-cli` requires that modules use CommonJS `require` syntax for imports.
