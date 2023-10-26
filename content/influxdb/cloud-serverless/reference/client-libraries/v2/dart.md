---
title: Dart client library
list_title: Dart
seotitle: Use the InfluxDB Dart client library
description: Use the InfluxDB Dart client library to interact with InfluxDB.
external_url: https://github.com/influxdata/influxdb-client-dart
menu:
  influxdb_cloud_serverless:
    name: Dart
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

Dart is a programming language created for quick application development for both web and mobile apps.

The documentation for this client library is available on GitHub.  

<a href="https://github.com/influxdata/influxdb-client-dart" target="_blank" class="btn github">Dart InfluxDB client</a>