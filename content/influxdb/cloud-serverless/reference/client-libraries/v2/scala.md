---
title: Scala client library
seotitle: Use the InfluxDB Scala client library
list_title: Scala
description: Use the InfluxDB Scala client library to interact with InfluxDB.
external_url: https://github.com/influxdata/influxdb-client-java/tree/master/client-scala
menu:
  influxdb_cloud_serverless:
    name: Scala
    parent: v2 client libraries
weight: 201
prepend:
  block: warn
  content: |
    ### Use InfluxDB v3 clients

    The `/api/v2/query` API endpoint and associated tooling, such as InfluxDB v2 client libraries and the `influx` CLI, **can't** query an {{% product-name omit=" Clustered" %}} cluster.

    [InfluxDB v3 client libraries](/influxdb/cloud-serverless/reference/client-libraries/v3/) and [Flight SQL clients](/influxdb/cloud-serverless/reference/client-libraries/) are available that integrate with your code to write and query data stored in {{% product-name %}}.

    InfluxDB v3 supports many different tools for [**writing**](/influxdb/cloud-serverless/write-data/) and [**querying**](/influxdb/cloud-serverless/query-data/) data.
    [**Compare tools you can use**](/influxdb/cloud-serverless/get-started/#tools-to-use) to interact with {{% product-name %}}.
---

Scala is a general-purpose programming language that supports both object-oriented and functional programming.

The documentation for this client library is available on GitHub.  

<a href="https://github.com/influxdata/influxdb-client-java/tree/master/client-scala" target="_blank" class="btn github">Scala InfluxDB client</a>