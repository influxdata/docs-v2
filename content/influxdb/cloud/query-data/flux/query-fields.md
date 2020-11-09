---
title: Query fields and tags
seotitle: Query fields and tags in InfluxDB using Flux
description: >
    Use the [`filter()` function](/influxdb/cloud/reference/flux/stdlib/built-in/transformations/filter/) to query data based on fields, tags, or any other column value.
    `filter()` performs operations similar to the `SELECT` statement and the `WHERE`
    clause in InfluxQL and other SQL-like query languages.
weight: 201
menu:
  influxdb_cloud:
    parent: Query with Flux
influxdb/cloud/tags: [query, select, where]
related:
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/filter/
  - /influxdb/cloud/query-data/flux/conditional-logic/
  - /influxdb/cloud/query-data/flux/regular-expressions/
list_code_example: |
  ```js
  from(bucket: "example-bucket")
    |> range(start: -1h)
    |> filter(fn: (r) =>
        r._measurement == "example-measurement" and
        r._field == "example-field" and
        r.tag == "example-tag"
    )
  ```
---

{{< duplicate-oss >}}