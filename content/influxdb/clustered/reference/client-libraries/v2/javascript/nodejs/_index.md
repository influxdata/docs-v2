---
title: Node.js JavaScript client library
seotitle: InfluxDB v2 JavaScript client library for Node.js
list_title: Node.js
description: >
  The [InfluxDB v2 JavaScript client library](https://github.com/influxdata/influxdb-client-js)
  for Node.js integrates with the InfluxDB v2 API to write data to an InfluxDB Clustered database.
menu:
  influxdb_clustered:
    name: Node.js
    parent: JavaScript
influxdb/clustered/tags: [client libraries, JavaScript, NodeJS]
weight: 201
aliases:
  - /influxdb/clustered/reference/api/client-libraries/nodejs/ 
---

The [InfluxDB v2 JavaScript client library](https://github.com/influxdata/influxdb-client-js)
integrates with the InfluxDB v2 API to write data from Node.js and browser applications to an {{% product-name %}} database.

{{% note %}}

### Tools to execute queries

This client library can't query an {{% product-name %}} database.

{{% product-name %}} supports many different tools for querying data, including:

- [`influx3` data CLI](https://github.com/InfluxCommunity/influxdb3-python-cli)
- [InfluxDB v3 client libraries](/influxdb/clustered/reference/client-libraries/v3/)
- [Flight clients](/influxdb/clustered/reference/client-libraries/flight-sql/)
- [Superset](/influxdb/clustered/query-data/sql/execute-queries/superset/)
- [Grafana](/influxdb/clustered/query-data/sql/execute-queries/grafana/)
- [InfluxQL with InfluxDB v1 HTTP API](/influxdb/clustered/primers/api/v1/#query-using-the-v1-api)
- [Chronograf](/chronograf/v1/)

{{% /note %}}

{{% warn %}}

#### /api/v2/query not supported

The InfluxDB API `/api/v2/query` endpoint can't query an {{% product-name omit=" Clustered" %}} cluster.
The `/api/v2/query` API endpoint and associated tooling, such as the `influx` CLI and InfluxDB v2 client libraries, **aren’t** supported in {{% product-name %}}.

{{% /warn %}}

## Use the client library in a Node.js application

{{< children >}}
