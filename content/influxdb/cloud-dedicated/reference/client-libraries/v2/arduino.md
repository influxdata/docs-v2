---
title: Arduino client library
seotitle: Use the InfluxDB Arduino client library
list_title: Arduino
description: Use the InfluxDB Arduino client library to interact with InfluxDB.
external_url: https://github.com/tobiasschuerg/InfluxDB-Client-for-Arduino
list_note: _– contributed by [tobiasschuerg](https://github.com/tobiasschuerg)_
menu:
  influxdb_cloud_dedicated:
    name: Arduino
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

Arduino is an open-source hardware and software platform used for building electronics projects.

The documentation for this client library is available on GitHub.  

<a href="https://github.com/tobiasschuerg/InfluxDB-Client-for-Arduino" target="_blank" class="btn github">Arduino InfluxDB client</a>