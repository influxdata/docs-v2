## Generate InfluxDB API docs
InfluxDB uses [Redoc](https://github.com/Redocly/redoc/) and
[redoc-cli](https://github.com/Redocly/redoc/blob/master/cli/README.md) to generate
API documentation from the InfluxDB `swagger.yml`.

To minimize repo size, the generated API documentation HTML is gitignored, therefore
not committed directly to the docs repo.
The InfluxDB docs deployment process uses swagger files in the `api-docs` directory
to generate version-specific API documentation.

### Versioned swagger files
Structure versions swagger files using the following pattern:

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

From the root of the docs repo, run:

```sh
# Install redoc-cli
npm install -g redoc-cli

# Generate the API docs
cd api-docs && generate-api-docs.sh
```
