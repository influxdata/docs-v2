## Generate InfluxDB API docs
InfluxDB uses [Redoc](https://github.com/Redocly/redoc/),
[redoc-cli](https://github.com/Redocly/redoc/blob/master/cli/README.md),
and Redocly's [OpenApi CLI](https://redoc.ly/docs/cli/) to generate
API documentation from the fully resolved InfluxDB openapi (OAS, OpenAPI Specification) contracts (`contracts/ref`)

To minimize repo size, the generated API documentation HTML is gitignored, therefore
not committed directly to the docs repo.
The InfluxDB docs deployment process uses swagger files in the `api-docs` directory
to generate version-specific API documentation.

### Versioned swagger files
The structure versions swagger files using the following pattern:

```
api-docs/
  ├── v2.0/
  │     └── ref.yml
  ├── v2.1/
  │     └── ref.yml
  ├── v2.2/
  │     └── ref.yml
  └── etc...
```

### Configure OpenAPI CLI linting and bundling
`.redoc.yaml` sets linting and bundling options for the `openapi` CLI.
`./openapi/plugins` contains custom OpenAPI CLI plugins composed of *rules* (for linting) and *decorators* (for bundle customization).

### Custom content
`./openapi/content` contains custom [OAS (OpenAPI Spec)](https://swagger.io/specification/) content in YAML files. The content structure and Markdown must be valid OAS.

`./openapi/plugins` use `./openapi/plugins/decorators` to apply the content to the contracts.
`.yml` files in `./openapi/content/` set content for sections (nodes) in the contract. To update content for a section, update the corresponding YAML file.

To add a new section (node) to the openapi contracts, add a YAML file for the node in `./openapi/content/content.js`. Then, write a decorator module for the node and configure the decorator in the plugin, e.g. `./openapi/plugins/docs-plugin.js`. See the [complete list of OAS v3.0 nodes](https://github.com/Redocly/openapi-cli/blob/master/packages/core/src/types/oas3.ts#L529).

`openapi` CLI requires that modules use CommonJS `require` syntax for imports. 

### Generate API docs locally
Because the API documentation HTML is gitignored, you must manually generate it
to view the API docs locally.

Verify that you have a working `npx` (it's included with Node.js).
In your terminal, run:

```sh
npx --version
```

If `npx` returns errors, [download](https://nodejs.org/en/) and run a recent version of the Node.js installer for your OS.

In your terminal, from the root of the docs repo, run:

```sh
cd api-docs

# Generate the API docs
sh generate-api-docs.sh
```
