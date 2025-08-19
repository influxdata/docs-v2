---
title: JavaScript client library for the InfluxDB v2 API
seotitle: InfluxDB v2 JavaScript client library for the InfluxDB v2 API
list_title: JavaScript
description: >
  The [InfluxDB v2 JavaScript client library](https://github.com/influxdata/influxdb-client-js)
  for Node.js and browsers integrates with the InfluxDB v2 API to write data to an InfluxDB Cloud Dedicated cluster.
menu:
  influxdb3_cloud_dedicated:
    name: JavaScript
    parent: v2 client libraries
influxdb3/cloud-dedicated/tags: [client libraries, JavaScript, NodeJS]
weight: 201
aliases:
  - /influxdb3/cloud-dedicated/reference/api/client-libraries/js/
prepend: |
  > [!WARNING]
  > ### Use InfluxDB 3 clients
  > 
  > The `/api/v2/query` API endpoint and associated tooling, such as InfluxDB v2 client libraries and the `influx` CLI, **can't** query an {{% product-name omit=" Clustered" %}} cluster.
  > 
  > [InfluxDB 3 client libraries](/influxdb3/{{% product-key %}}/client-libraries/v3/) are available that integrate with your code to write and query data stored in {{% product-name %}}.
  > 
  > InfluxDB 3 supports many different tools for [**writing**](/influxdb3/cloud-dedicated/write-data/) and [**querying**](/influxdb3/cloud-dedicated/query-data/) data.
  > [**Compare tools you can use**](/influxdb3/cloud-dedicated/get-started/#tools-to-use) to interact with {{% product-name %}}.
---

The [InfluxDB v2 JavaScript client library](https://github.com/influxdata/influxdb-client-js)
for Node.js and browsers integrates with the InfluxDB v2 API to write data to an {{% product-name omit=" Clustered" %}} cluster.

{{< children depth="999" >}}
