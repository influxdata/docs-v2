---
title: C# client library
list_title: C#
seotitle: Use the InfluxDB C# client library
description: Use the InfluxDB C# client library to interact with InfluxDB.
external_url: https://github.com/influxdata/influxdb-client-csharp
menu:
  influxdb3_enterprise:
    name: C#
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
  > [**Compare tools you can use**](/influxdb3/enterprise/get-started/#tools-to-use) to interact with {{% product-name %}}.
source: /shared/influxdb-client-libraries-reference/v2/csharp.md
---

<!-- The content for this page is at
// SOURCE content/shared/influxdb-client-libraries-reference/v2/csharp.md
-->