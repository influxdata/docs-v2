---
title: Node.js JavaScript client library
seotitle: InfluxDB v2 JavaScript client library for Node.js
list_title: Node.js
description: >
  The [InfluxDB v2 JavaScript client library](https://github.com/influxdata/influxdb-client-js)
  for Node.js integrates with the InfluxDB v2 API to write data to an InfluxDB Cloud Serverless bucket.
menu:
  influxdb_cloud_serverless:
    name: Node.js
    parent: JavaScript
influxdb/cloud-serverless/tags: [client libraries, JavaScript, NodeJS]
weight: 201
aliases:
  - /influxdb/cloud-serverless/reference/api/client-libraries/nodejs/
  - /influxdb/cloud-serverless/reference/api/client-libraries/nodejs/query/

---

The [InfluxDB v2 JavaScript client library](https://github.com/influxdata/influxdb-client-js)
integrates with the InfluxDB v2 API to write data from Node.js and browser applications to {{% product-name %}}.

{{% note %}}

### Tools to execute queries

{{% product-name %}} supports many different tools for querying data, including:

- [InfluxDB v3 client libraries](/influxdb/cloud-serverless/reference/client-libraries/v3/)
- [Flight clients](/influxdb/cloud-serverless/reference/client-libraries/flight-sql/)
- [Superset](/influxdb/cloud-serverless/query-data/sql/execute-queries/superset/)
- [Grafana](/influxdb/cloud-serverless/query-data/sql/execute-queries/grafana/)
- [InfluxQL with InfluxDB v1 HTTP API](/influxdb/cloud-serverless/primers/api/v1/#query-using-the-v1-api)
- [Chronograf](/chronograf/v1/)

{{% /note %}}

{{% warn %}}

#### Avoid using /api/v2/query

Avoid using the `/api/v2/query` API endpoint in {{% product-name %}} and associated tooling, such as the `influx query` CLI command and InfluxDB v2 client libraries.
You can't use SQL or InfluxQL with these tools.

{{% /warn %}}

## Use the client library in a Node.js application

{{< children >}}


