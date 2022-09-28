---
title: Sort and limit data with Flux
seotitle: Sort and limit data in InfluxDB with Flux
list_title: Sort and limit
description: >
  Use the [`sort()`function](/influxdb/cloud/reference/flux/stdlib/built-in/transformations/sort)
  to order records within each table by specific columns and the
  [`limit()` function](/influxdb/cloud/reference/flux/stdlib/built-in/transformations/limit)
  to limit the number of records in output tables to a fixed number, `n`.
influxdb/cloud/tags: [sort, limit]
menu:
  influxdb_cloud:
    name: Sort and limit
    parent: Query with Flux
weight: 203
related:
  - /{{< latest "flux" >}}/stdlib/universe/sort
  - /{{< latest "flux" >}}/stdlib/universe/limit
list_query_example: sort_limit
---

{{< duplicate-oss >}}