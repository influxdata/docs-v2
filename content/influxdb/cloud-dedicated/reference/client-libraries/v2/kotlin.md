---
title: Kotlin client library
seotitle: Use the Kotlin client library
list_title: Kotlin
description: Use the InfluxDB Kotlin client library to interact with InfluxDB.
external_url: https://github.com/influxdata/influxdb-client-java/tree/master/client-kotlin
menu:
  influxdb_cloud_dedicated:
    name: Kotlin
    parent: v2 client libraries
weight: 201
prepend:
  block: warn
  content: |
    ### Use InfluxDB v3 clients

    The `/api/v2/query` API endpoint and associated tooling, such as InfluxDB v2 client libraries and the `influx` CLI, **can't** query an {{% product-name omit=" Clustered" %}} cluster.

    [InfluxDB v3 client libraries](/influxdb/cloud-dedicated/reference/client-libraries/v3/) and [Flight SQL clients](/influxdb/cloud-dedicated/reference/client-libraries/) are available that integrate with your code to write and query data stored in {{% product-name %}}.

    InfluxDB v3 supports many different tools for [**writing**](/influxdb/cloud-dedicated/write-data/) and [**querying**](/influxdb/cloud-dedicated/query-data/) data.
    [**Compare tools you can use**](/influxdb/cloud-dedicated/get-started/#tools-to-use) to interact with {{% product-name %}}.
---

Kotlin is an open-source programming language that runs on the Java Virtual Machine (JVM). 

The documentation for this client library is available on GitHub.  

<a href="https://github.com/influxdata/influxdb-client-java/tree/master/client-kotlin" target="_blank" class="btn github">Kotlin InfluxDB client</a>