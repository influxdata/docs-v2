---
title: JavaScript client library for the InfluxDB v2 API
seotitle: InfluxDB v2 JavaScript client library for the InfluxDB v2 API
list_title: JavaScript
description: >
  The [InfluxDB v2 JavaScript client library](https://github.com/influxdata/influxdb-client-js)
  for Node.js and browsers integrates with the InfluxDB v2 API to write data to an InfluxDB Cloud Dedicated cluster.
menu:
  influxdb_cloud_dedicated:
    name: JavaScript
    parent: v2 client libraries
influxdb/cloud-dedicated/tags: [client libraries, JavaScript, NodeJS]
weight: 201
aliases:
  - /influxdb/cloud-dedicated/reference/api/client-libraries/js/  
---

The [InfluxDB v2 JavaScript client library](https://github.com/influxdata/influxdb-client-js)
for Node.js and browsers integrates with the InfluxDB v2 API to write data to an {{% cloud-name %}} cluster.

{{% note %}}
### Tools to execute queries

InfluxDB v2 client libraries use the InfluxDB API `/api/v2/query` endpoint.
This endpoint can't query an {{% cloud-name %}} cluster.

{{% cloud-name %}} supports many different tools for querying data, including:

- [`influx3` data CLI](https://github.com/InfluxCommunity/influxdb3-python-cli)
- [InfluxDB v3 client libraries](/influxdb/cloud-dedicated/reference/client-libraries/v3/)
- [Flight clients](/influxdb/cloud-dedicated/reference/client-libraries/flight-sql/)
- [Superset](/influxdb/cloud-dedicated/query-data/execute-queries/flight-sql/superset/)
- [Grafana](/influxdb/cloud-dedicated/query-data/tools/grafana/)
- [InfluxQL with InfluxDB v1 HTTP API](/influxdb/cloud-dedicated/primers/api/v1/#query-using-the-v1-api)
- [Chronograf](/{{< latest "Chronograf" >}}/)

{{% /note %}}

{{< children depth="999" >}}
