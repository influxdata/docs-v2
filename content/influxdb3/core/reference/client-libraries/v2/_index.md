---
title: InfluxDB v2 API client libraries
description: >
  InfluxDB v2 client libraries use InfluxDB `/api/v2` endpoints and work with [InfluxDB 2.x API compatibility endpoints](/influxdb/v1/tools/api/#influxdb-2x-api-compatibility-endpoints).
  View the list of available client libraries.
weight: 101
menu:
  influxdb3_core:
    name: v2 client libraries
    parent: Client libraries
influxdb3/core/tags: [client libraries, API, developer tools]
prepend: |
  > [!WARNING]
  > #### Use InfluxDB 3 clients to query
  >
  > InfluxDB 3 supports [compatibility endpoints for _writing data_](/influxdb3/{{% product-key %}}/write-data/compatibility-apis/) using InfluxDB v2 and v1 tools. However, the `/api/v2/query` API endpoint and associated tooling, such as InfluxDB v2 client libraries and the `influx` CLI, _can't query_
  > stored in {{% product-name %}}.
  >
  > [InfluxDB 3 client libraries](/influxdb3/{{% product-key %}}/reference/client-libraries/v3/)
  > are available that integrate with your code to write and query data stored
  > in {{% product-name %}}.
  >
  > InfluxDB 3 supports many different tools for [**writing**](/influxdb3/core/write-data/)
  > and [**querying**](/influxdb3/core/query-data/) data.
  > [**Compare tools you can use**](/influxdb3/core/get-started/#tools-to-use)
  > to interact with {{% product-name %}}.
  >
source: /shared/influxdb-client-libraries-reference/v2/_index.md
---

<!-- The content for this page is at
// SOURCE content/shared/influxdb-client-libraries-reference/v2/_index.md
-->