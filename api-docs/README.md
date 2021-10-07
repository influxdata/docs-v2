## Generate InfluxDB API docs
InfluxDB uses [Redoc](https://github.com/Redocly/redoc/) and
[redoc-cli](https://github.com/Redocly/redoc/blob/master/cli/README.md) to generate
API documentation from the InfluxDB `swagger.yml`.

To minimize repo size, the generated API documentation HTML is gitignored, therefore
not committed directly to the docs repo.
The InfluxDB docs deployment process uses swagger files in the `api-docs` directory
to generate version-specific API documentation.

### Versioned swagger files
The structure versions swagger files using the following pattern:

```
api-docs/
  ├── v2.0/
  │     └── swagger.yml
  ├── v2.1/
  │     └── swagger.yml
  ├── v2.2/
  │     └── swagger.yml
  └── etc...
```

### Generate API docs locally
Because the API documentation HTML is gitignored, you must manually generate it
to view the API docs locally.

In your terminal, from the root of the docs repo, run:

```sh



cd api-docs

# Install dependencies
yarn install

# Generate the API docs
generate-api-docs.sh
```
