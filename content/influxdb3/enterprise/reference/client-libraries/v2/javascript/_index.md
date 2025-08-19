---
title: JavaScript client library for the InfluxDB v2 API
seotitle: InfluxDB v2 JavaScript client library for the InfluxDB v2 API
list_title: JavaScript
description: >
  The [InfluxDB v2 JavaScript client library](https://github.com/influxdata/influxdb-client-js)
  for Node.js and browsers integrates with the InfluxDB v2 API to write data to an InfluxDB Core cluster.
menu:
  influxdb3_enterprise:
    name: JavaScript
    parent: v2 client libraries
influxdb3/enterprise/tags: [client libraries, JavaScript, NodeJS]
weight: 201
aliases:
  - /influxdb3/enterprise/reference/api/client-libraries/js/
prepend: |
  > [!WARNING]
  > #### Use InfluxDB 3 clients to query
  > 
  > InfluxDB 3 supports [compatibility endpoints for _writing data_](/influxdb3/{{% product-key %}}/write-data/compatibility-apis/) using InfluxDB v2 and v1 tools. However, the `/api/v2/query` API endpoint and associated tooling, such as InfluxDB v2 client libraries and the `influx` CLI, _can't query_ data stored in {{% product-name %}}.
  > 
  > [InfluxDB 3 client libraries](/influxdb3/{{% product-key %}}/reference/client-libraries/v3/) are available that integrate with your code to write and query data stored in {{% product-name %}}.
  > 
  > [**Compare tools you can use**](/influxdb3/enterprise/get-started/#tools-to-use) to interact with {{% product-name %}}.
source: /shared/influxdb-client-libraries-reference/v2/javascript/_index.md
---

<!-- The content for this page is at
// SOURCE content/shared/influxdb-client-libraries-reference/v2/javascript/_index.md
-->