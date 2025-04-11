---
title: PHP client library
seotitle: Use the InfluxDB PHP client library
list_title: PHP
description: Use the InfluxDB PHP client library to interact with InfluxDB.
external_url: https://github.com/influxdata/influxdb-client-php
menu:
  influxdb3_clustered:
    name: PHP
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
  > InfluxDB 3 supports many different tools for [**writing**](/influxdb3/clustered/write-data/) and [**querying**](/influxdb3/clustered/query-data/) data.
  > [**Compare tools you can use**](/influxdb3/clustered/get-started/#tools-to-use) to interact with {{% product-name %}}.
---

PHP is a popular general-purpose scripting language primarily used for web development. 

The documentation for this client library is available on GitHub.  

<a href="https://github.com/influxdata/influxdb-client-php" target="_blank" class="btn github">PHP InfluxDB client</a>