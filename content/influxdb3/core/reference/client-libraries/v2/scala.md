---
title: Scala client library
seotitle: Use the InfluxDB Scala client library
list_title: Scala
description: Use the InfluxDB Scala client library to interact with InfluxDB.
external_url: https://github.com/influxdata/influxdb-client-java/tree/master/client-scala
menu:
  influxdb3_core:
    name: Scala
    parent: v2 client libraries
weight: 201
prepend: |
  > [!WARNING]
  > #### Use InfluxDB 3 clients to query
  > 
  > InfluxDB 3 supports [compatibility endpoints for _writing data_](/influxdb3/{{% product-key %}}/write-data/compatibility-apis/) using InfluxDB v2 and v1 tools. However, the `/api/v2/query` API endpoint and associated tooling, such as InfluxDB v2 client libraries and the `influx` CLI, _can't query_ data stored in {{% product-name %}}.
  > 
  > [InfluxDB 3 client libraries](/influxdb3/{{% product-key %}}/reference/client-libraries/v3/) are available that integrate with your code to write and query data stored in {{% product-name %}}.
  > 
  > [**Compare tools you can use**](/influxdb3/core/get-started/#tools-to-use) to interact with {{% product-name %}}.
source: /shared/influxdb-client-libraries-reference/v2/scala.md
---

<!-- The content for this page is at
// SOURCE content/shared/influxdb-client-libraries-reference/v2/scala.md
-->