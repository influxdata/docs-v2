---
title: Java client library
seotitle: Use the InfluxDB Java client library
list_title: Java
description: Use the Java client library to interact with InfluxDB.
external_url: https://github.com/influxdata/influxdb-client-java
menu:
  influxdb3_cloud_serverless:
    name: Java
    parent: v2 client libraries
weight: 201
prepend: |
  > [!WARNING]
  > ### Use InfluxDB 3 clients
  > 
  > The `/api/v2/query` API endpoint and associated tooling, such as InfluxDB v2 client libraries and the `influx` CLI, **can't** query an {{% product-name omit=" Clustered" %}} cluster.
  > 
  > [InfluxDB 3 client libraries](/influxdb3/{{% product-key %}}/client-libraries/v3/) are available that integrate with your code to write and query data stored in {{% product-name %}}.
  > 
  > InfluxDB 3 supports many different tools for [**writing**](/influxdb3/cloud-serverless/write-data/) and [**querying**](/influxdb3/cloud-serverless/query-data/) data.
  > [**Compare tools you can use**](/influxdb3/cloud-serverless/get-started/#tools-to-use) to interact with {{% product-name %}}.
---

Java is one of the oldest and most popular class-based, object-oriented programming languages.

The documentation for this client library is available on GitHub.  

<a href="https://github.com/influxdata/influxdb-client-java" target="_blank" class="btn github">Java InfluxDB client</a>