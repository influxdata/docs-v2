---
title: JavaScript client library for the InfluxDB v2 API
seotitle: InfluxDB v2 JavaScript client library for the InfluxDB v2 API
list_title: JavaScript
description: >
  The [InfluxDB v2 JavaScript client library](https://github.com/influxdata/influxdb-client-js)
  for Node.js and browsers integrates with the InfluxDB v2 API to write data to an InfluxDB Cloud Serverless bucket.
menu:
  influxdb_cloud_serverless:
    name: JavaScript
    parent: v2 client libraries
influxdb/cloud-serverless/tags: [client libraries, JavaScript, NodeJS]
weight: 201
aliases:
  - /influxdb/cloud-serverless/reference/api/client-libraries/js/
prepend:
  block: warn
  content: |
    ### Use InfluxDB v3 clients

    The `/api/v2/query` API endpoint and associated tooling, such as InfluxDB v2 client libraries and the `influx` CLI, **can't** query an {{% product-name omit=" Clustered" %}} cluster.

    [InfluxDB v3 client libraries](/influxdb/cloud-serverless/reference/client-libraries/v3/) and [Flight SQL clients](/influxdb/cloud-serverless/reference/client-libraries/) are available that integrate with your code to write and query data stored in {{% product-name %}}.

    InfluxDB v3 supports many different tools for [**writing**](/influxdb/cloud-serverless/write-data/) and [**querying**](/influxdb/cloud-serverless/query-data/) data.
    [**Compare tools you can use**](/influxdb/cloud-serverless/get-started/#tools-to-use) to interact with {{% product-name %}}.
---

The [InfluxDB v2 JavaScript client library](https://github.com/influxdata/influxdb-client-js)
for Node.js and browsers integrates with the InfluxDB v2 API to write data to an {{% product-name omit=" Clustered" %}} cluster.

{{< children type="list">}}
