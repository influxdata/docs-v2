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
for Node.js and browsers integrates with the InfluxDB v2 API to write data to an {{% product-name omit=" Clustered" %}} cluster.

{{% note %}}
### Tools to execute queries

This client library can't query an {{% product-name omit=" Clustered" %}} database.

{{% product-name %}} supports many different tools for querying data, including:

- [`influx3` data CLI](https://github.com/InfluxCommunity/influxdb3-python-cli)
- [InfluxDB v3 client libraries](/influxdb/cloud-dedicated/reference/client-libraries/v3/)
- [Flight clients](/influxdb/cloud-dedicated/reference/client-libraries/flight-sql/)
- [Superset](/influxdb/cloud-dedicated/query-data/sql/execute-queries/superset/)
- [Grafana](/influxdb/cloud-dedicated/query-data/sql/execute-queries/grafana/)
- [InfluxQL with InfluxDB v1 HTTP API](/influxdb/cloud-dedicated/primers/api/v1/#query-using-the-v1-api)
- [Chronograf](/chronograf/v1/)

{{% /note %}}

{{% warn %}}

#### /api/v2/query not supported

The InfluxDB API `/api/v2/query` endpoint can't query an {{% product-name omit=" Clustered" %}} cluster.
The `/api/v2/query` API endpoint and associated tooling, such as the `influx` CLI and InfluxDB v2 client libraries, **aren’t** supported in {{% product-name %}}.

{{% /warn %}}

{{< children depth="999" >}}
