---
title: JavaScript client library for the InfluxDB v2 API
seotitle: InfluxDB v2 JavaScript client library for the InfluxDB v2 API
list_title: JavaScript
description: >
  The [InfluxDB v2 JavaScript client library](https://github.com/influxdata/influxdb-client-js)
  for Node.js and browsers integrates with the InfluxDB v2 API to write data to an InfluxDB cluster.
menu:
  influxdb_clustered:
    name: JavaScript
    parent: v2 client libraries
influxdb/clustered/tags: [client libraries, JavaScript, NodeJS]
weight: 201
aliases:
  - /influxdb/clustered/reference/api/client-libraries/js/  
---

The [InfluxDB v2 JavaScript client library](https://github.com/influxdata/influxdb-client-js)
for Node.js and browsers integrates with the InfluxDB v2 API to write data to an {{% cloud-name %}} cluster.

{{% note %}}
### Tools to execute queries

InfluxDB v2 client libraries use the InfluxDB API `/api/v2/query` endpoint.
This endpoint can't query an {{% cloud-name %}} cluster.

{{% cloud-name %}} supports many different tools for querying data, including:

- [`influx3` data CLI](https://github.com/InfluxCommunity/influxdb3-python-cli)
- [InfluxDB v3 client libraries](/influxdb/clustered/reference/client-libraries/v3/)
- [Flight clients](/influxdb/clustered/reference/client-libraries/flight-sql/)
- [Superset](/influxdb/clustered/query-data/sql/execute-queries/superset/)
- [Grafana](/influxdb/clustered/query-data/sql/execute-queries/grafana/)
- [InfluxQL with InfluxDB v1 HTTP API](/influxdb/clustered/primers/api/v1/#query-using-the-v1-api)
- [Chronograf](/{{< latest "Chronograf" >}}/)

{{% /note %}}

{{< children depth="999" >}}
