---
title: Write data with the InfluxDB v2 JavaScript client library
list_title: Write data
description: >
  The InfluxDB v2 JavaScript client library integrates with Node.js applications to write data to the InfluxDB v2 API.
menu:
  influxdb3_core:
    name: Write
    parent: Node.js
influxdb3/core/tags: [client libraries, JavaScript]
weight: 101
aliases:
  - /influxdb3/core/reference/api/client-libraries/nodejs/write
related:
  - /influxdb3/core/write-data/troubleshoot/
prepend: |
  > [!WARNING]
  > #### Use InfluxDB 3 clients to query
  > 
  > InfluxDB 3 supports [compatibility endpoints for _writing data_](/influxdb3/{{% product-key %}}/write-data/compatibility-apis/) using InfluxDB v2 and v1 tools. However, the `/api/v2/query` API endpoint and associated tooling, such as InfluxDB v2 client libraries and the `influx` CLI, _can't query_ data stored in {{% product-name %}}.
  > 
  > [InfluxDB 3 client libraries](/influxdb3/{{% product-key %}}/reference/client-libraries/v3/) are available that integrate with your code to write and query data stored in {{% product-name %}}.
  > 
  > [**Compare tools you can use**](/influxdb3/core/get-started/#tools-to-use) to interact with {{% product-name %}}.
source: /shared/influxdb-client-libraries-reference/v2/javascript/nodejs/write.md
---

<!-- The content for this page is at
// SOURCE content/shared/influxdb-client-libraries-reference/v2/javascript/nodejs/write.md
-->