---
title: C# client library
list_title: C#
seotitle: Use the InfluxDB C# client library
description: Use the InfluxDB C# client library to interact with InfluxDB.
external_url: https://github.com/influxdata/influxdb-client-csharp
menu:
  influxdb3_cloud_serverless:
    name: C#
    parent: v2 client libraries
weight: 201
prepend: |
  > [!WARNING]
  > ### Use InfluxDB 3 clients
  > 
  > The `/api/v2/query` API endpoint and associated tooling, such as InfluxDB v2 client libraries and the `influx` CLI, **can't** query an {{% product-name omit=" Clustered" %}} cluster.
  > 
  > [InfluxDB 3 client libraries](/influxdb3/cloud-serverless/reference/client-libraries/v3/) and [Flight SQL clients](/influxdb3/cloud-serverless/reference/client-libraries/) are available that integrate with your code to write and query data stored in {{% product-name %}}.
  > 
  > InfluxDB 3 supports many different tools for [**writing**](/influxdb3/cloud-serverless/write-data/) and [**querying**](/influxdb3/cloud-serverless/query-data/) data.
  > [**Compare tools you can use**](/influxdb3/cloud-serverless/get-started/#tools-to-use) to interact with {{% product-name %}}.
---

C# is a general-purpose object-oriented programming language.

The documentation for this client library is available on GitHub.  

<a href="https://github.com/influxdata/influxdb-client-csharp" target="_blank" class="btn github">C# InfluxDB client</a>