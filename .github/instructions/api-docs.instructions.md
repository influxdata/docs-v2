---
applyTo: "api-docs/**/*.md, layouts/**/*.html"
---

# InfluxDB API documentation

To edit the API reference documentation, edit the YAML files in `/api-docs`.

InfluxData uses [Redoc](https://github.com/Redocly/redoc) to generate the full
InfluxDB API documentation when documentation is deployed.
Redoc generates HTML documentation using the InfluxDB `swagger.yml`.
For more information about generating InfluxDB API documentation, see the
[API Documentation README](https://github.com/influxdata/docs-v2/tree/master/api-docs#readme).

## Generate API documentation locally

From `api-docs` directory:

1. Install dependencies. To generate the API documentation locally, you need to have [Node.js](https://nodejs.org/en/) and [Yarn](https://yarnpkg.com/getting-started/install) installed.
   ```sh
   yarn install
   ``` 

2. Run the script to generate the API documentation.

    ```sh
    generate-api-docs.sh
    ```