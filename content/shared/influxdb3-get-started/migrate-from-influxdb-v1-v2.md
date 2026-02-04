InfluxDB 3 provides compatibility APIs and tools for migrating existing
InfluxDB v1 and v2 workloads.
Use existing client libraries and tools with minimal changes to your code.

## Write data

InfluxDB 3 supports v1 and v2 compatible write endpoints:

- **`/api/v2/write`**: Compatible with InfluxDB v2 clients and tools
- **`/write`**: Compatible with InfluxDB v1 clients and tools

Both endpoints accept line protocol and write data the same way.

For more information, see [Use compatibility APIs to write data](/influxdb3/version/write-data/http-api/compatibility-apis/).

## Query data

InfluxDB 3 supports the v1 HTTP query API for InfluxQL queries:

- **`/query`**: Compatible with InfluxDB v1 query clients

For more information, see [Use the v1 HTTP query API](/influxdb3/version/query-data/execute-queries/influxdb-v1-api/).

## Client libraries

Use InfluxDB v1 and v2 client libraries with {{% product-name %}}:

- [v2 client libraries](/influxdb3/version/reference/client-libraries/v2/)
- [v1 client libraries](/influxdb3/version/reference/client-libraries/v1/)
