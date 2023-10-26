---
title: Swift client library
seotitle: Use the InfluxDB Swift client library
list_title: Swift
description: Use the InfluxDB Swift client library to interact with InfluxDB.
external_url: https://github.com/influxdata/influxdb-client-swift
menu:
  influxdb_cloud_dedicated:
    name: Swift
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

Swift is a programming language created by Apple for building applications across multiple Apple platforms.

The documentation for this client library is available on GitHub.  

<a href="https://github.com/influxdata/influxdb-client-swift" target="_blank" class="btn github">Swift InfluxDB client</a>