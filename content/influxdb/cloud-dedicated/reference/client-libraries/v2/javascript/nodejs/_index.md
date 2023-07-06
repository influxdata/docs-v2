---
title: Node.js JavaScript client library
seotitle: InfluxDB v2 JavaScript client library for Node.js
list_title: Node.js
description: >
  The [InfluxDB v2 JavaScript client library](https://github.com/influxdata/influxdb-client-js)
  for Node.js integrates with the InfluxDB v2 API to write data to an InfluxDB Cloud Dedicated database.
menu:
  influxdb_cloud_dedicated:
    name: Node.js
    parent: JavaScript
influxdb/cloud-dedicated/tags: [client libraries, JavaScript, NodeJS]
weight: 201
aliases:
  - /influxdb/cloud-dedicated/reference/api/client-libraries/nodejs/ 
---

The [InfluxDB v2 JavaScript client library](https://github.com/influxdata/influxdb-client-js)
integrates with the InfluxDB v2 API to write data from Node.js and browser applications to an {{% cloud-name %}} database.

{{% note %}}

### Tools to execute queries

InfluxDB v2 client libraries use the InfluxDB API `/api/v2/query` endpoint.
This endpoint can't query an {{% cloud-name %}} database.

{{% cloud-name %}} supports many different tools for querying data, including:

- [InfluxDB v3 client libraries](/influxdb/cloud-dedicated/reference/client-libraries/v3/)
- [Flight clients](/influxdb/cloud-dedicated/reference/client-libraries/flight-sql/)
- [Superset](/influxdb/cloud-dedicated/query-data/sql/execute-queries/superset/)
- [Grafana](/influxdb/cloud-dedicated/query-data/sql/execute-queries/grafana/)
- [InfluxQL with InfluxDB v1 HTTP API](/influxdb/cloud-dedicated/primers/api/v1/#query-using-the-v1-api)
- [Chronograf](/{{< latest "Chronograf" >}}/)

{{% /note %}}

## Use the client library in a Node.js application

{{< children >}}
