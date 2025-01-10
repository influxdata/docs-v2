---
title: R package client library
list_title: R
seotitle: Use the InfluxDB client R package
description: Use the InfluxDB client R package to interact with InfluxDB.
external_url: https://github.com/influxdata/influxdb-client-r
menu:
  influxdb3_clustered:
    name: R
    parent: v2 client libraries
weight: 201
prepend:
  block: warn
  content: |
    ### Use InfluxDB v3 clients

    The `/api/v2/query` API endpoint and associated tooling, such as InfluxDB v2 client libraries and the `influx` CLI, **can't** query an {{% product-name omit=" Clustered" %}} cluster.

    [InfluxDB v3 client libraries](/influxdb3/clustered/reference/client-libraries/v3/) and [Flight SQL clients](/influxdb3/clustered/reference/client-libraries/) are available that integrate with your code to write and query data stored in {{% product-name %}}.

    InfluxDB v3 supports many different tools for [**writing**](/influxdb3/clustered/write-data/) and [**querying**](/influxdb3/clustered/query-data/) data.
    [**Compare tools you can use**](/influxdb3/clustered/get-started/#tools-to-use) to interact with {{% product-name %}}.
---

R is a programming language and software environment for statistical analysis, reporting, and graphical representation primarily used in data science. 

The documentation for this client library is available on GitHub.  

<a href="https://github.com/influxdata/influxdb-client-r" target="_blank" class="btn github">R InfluxDB client</a>