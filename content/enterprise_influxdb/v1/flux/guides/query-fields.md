---
title: Query fields and tags
seotitle: Query fields and tags in InfluxDB using Flux
description: >
    Use the `filter()` function to query data based on fields, tags, or any other column value.
    `filter()` performs operations similar to the `SELECT` statement and the `WHERE`
    clause in InfluxQL and other SQL-like query languages.
weight: 1
menu:
  enterprise_influxdb_v1:
    parent: Query with Flux
canonical: /influxdb/v2/query-data/flux/query-fields/
list_code_example: |
  ```js
  from(bucket: "db/rp")
    |> range(start: -1h)
    |> filter(fn: (r) =>
        r._measurement == "example-measurement" and
        r._field == "example-field" and
        r.tag == "example-tag"
    )
  ```
source: /shared/influxdb-v1/flux/guides/query-fields.md
---

<!-- The content for this file is located at
// SOURCE content/shared/influxdb-v1/flux/guides/query-fields.md -->
