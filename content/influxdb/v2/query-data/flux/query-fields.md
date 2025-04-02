---
title: Query fields and tags
seotitle: Query fields and tags in InfluxDB using Flux
description: >
    Use `filter()` to query data based on fields, tags, or any other column value.
    `filter()` performs operations similar to the `SELECT` statement and the `WHERE`
    clause in InfluxQL and other SQL-like query languages.
weight: 201
menu:
  influxdb_v2:
    parent: Query with Flux
influxdb/v2/tags: [query, select, where]
related:
  - /flux/v0/stdlib/universe/filter/
  - /influxdb/v2/query-data/flux/conditional-logic/
  - /influxdb/v2/query-data/flux/regular-expressions/
list_code_example: |
  ```js
  from(bucket: "example-bucket")
      |> range(start: -1h)
      |> filter(fn: (r) => r._measurement == "example-measurement" and r.tag == "example-tag")
      |> filter(fn: (r) => r._field == "example-field")
  ```
source: /shared/influxdb-v2/query-data/flux/query-fields.md
---

<!-- The content for this file is located at
// SOURCE content/shared/influxdb-v2/query-data/flux/query-fields.md -->
