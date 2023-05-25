---
title: Node.js JavaScript client library
seotitle: Use the InfluxDB v2 JavaScript client library
list_title: Node.js
description: >
  Use the InfluxDB v2 JavaScript client library to interact with InfluxDB.
menu:
  influxdb_cloud_dedicated:
    name: Node.js
    parent: JavaScript
influxdb/cloud-dedicated/tags: [client libraries, JavaScript, NodeJS]
weight: 201
aliases:
  - /influxdb/cloud-dedicated/reference/api/client-libraries/nodejs/ 
---

Use the [InfluxDB v2 JavaScript client library](https://github.com/influxdata/influxdb-client-js)
to write data from Node.js and browser applications to an InfluxDB Cloud Dedicated cluster.

## Use the client library in a Node.js application

{{< children >}}

{{% note %}}

### Tools to execute queries

InfluxDB v2 client libraries use the InfluxDB API `/api/v2/query` endpoint.
This endpoint can't query an InfluxDB Cloud Dedicated cluster.

InfluxDB Cloud Dedicated supports many different tools for querying data, including:

- [Flight SQL clients](?t=Go#execute-an-sql-query)
- [Superset](/influxdb/cloud-dedicated/query-data/execute-queries/flight-sql/superset/)
- [Grafana](/influxdb/cloud-dedicated/query-data/tools/grafana/)
- [InfluxQL with InfluxDB v1 HTTP API](/influxdb/cloud-dedicated/primers/api/v1/#query-using-the-v1-api)
- [Chronograf](/{{< latest "Chronograf" >}}/)

{{% /note %}}
