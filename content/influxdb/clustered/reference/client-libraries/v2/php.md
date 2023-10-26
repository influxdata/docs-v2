---
title: PHP client library
seotitle: Use the InfluxDB PHP client library
list_title: PHP
description: Use the InfluxDB PHP client library to interact with InfluxDB.
external_url: https://github.com/influxdata/influxdb-client-php
menu:
  influxdb_clustered:
    name: PHP
    parent: v2 client libraries
weight: 201
prepend:
  block: warn
  content: |
    ### Use InfluxDB v3 clients

    The `/api/v2/query` API endpoint and associated tooling, such as InfluxDB v2 client libraries and the `influx` CLI, **can't** query an {{% product-name omit=" Clustered" %}} cluster.

    [InfluxDB v3 client libraries](/influxdb/clustered/reference/client-libraries/v3/) and [Flight SQL clients](/influxdb/clustered/reference/client-libraries/) are available that integrate with your code to write and query data stored in {{% product-name %}}.

    InfluxDB v3 supports many different tools for [**writing**](/influxdb/clustered/write-data/) and [**querying**](/influxdb/clustered/query-data/) data.
    [**Compare tools you can use**](/influxdb/clustered/get-started/#tools-to-use) to interact with {{% product-name %}}.
---

PHP is a popular general-purpose scripting language primarily used for web development. 

The documentation for this client library is available on GitHub.  

<a href="https://github.com/influxdata/influxdb-client-php" target="_blank" class="btn github">PHP InfluxDB client</a>