---
title: InfluxDB v2 API client libraries
description: >
  InfluxDB v2 client libraries use InfluxDB `/api/v2` endpoints and work with [InfluxDB 2.0 API compatibility endpoints](/influxdb/v1/tools/api/#influxdb-20-api-compatibility-endpoints).
  View the list of available client libraries.
weight: 101
menu:
  influxdb_clustered:
    name: v2 client libraries
    parent: Client libraries
influxdb/clustered/tags: [client libraries, API, developer tools]
prepend:
  block: warn
  content: |
    ### Use InfluxDB v3 clients

    The `/api/v2/query` API endpoint and associated tooling, such as InfluxDB v2 client libraries and the `influx` CLI, **can't** query an {{% product-name omit=" Clustered" %}} cluster.

    [InfluxDB v3 client libraries](/influxdb/clustered/reference/client-libraries/v3/) and [Flight SQL clients](/influxdb/clustered/reference/client-libraries/) are available that integrate with your code to write and query data stored in {{% product-name %}}.

    InfluxDB v3 supports many different tools for [**writing**](/influxdb/clustered/write-data/) and [**querying**](/influxdb/clustered/query-data/) data.
    [**Compare tools you can use**](/influxdb/clustered/get-started/#tools-to-use) to interact with {{% product-name %}}.
---

## Client libraries for InfluxDB 2.x and 1.8+

InfluxDB client libraries are language-specific tools that integrate with InfluxDB APIs.
InfluxDB v2 client libraries use InfluxDB `/api/v2` endpoints and work with [InfluxDB 2.0 API compatibility endpoints](/influxdb/v1/tools/api/#influxdb-20-api-compatibility-endpoints).

Functionality varies among client libraries.
InfluxDB client libraries are maintained by the InfluxDB community.
For specifics about a client library, see the library's GitHub repository.

{{< children type="list" depth="999" >}}
