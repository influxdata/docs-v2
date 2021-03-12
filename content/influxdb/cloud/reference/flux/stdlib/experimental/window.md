---
title: experimental.window() function
description: >
  The `experimental.window()` function groups records based on a time value.
  Input tables must have `_start`, `_stop`, and `_time` columns.
menu:
  influxdb_cloud_ref:
    name: experimental.window
    parent: Experimental
weight: 302
related:
  - /influxdb/cloud/query-data/flux/window-aggregate/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/window/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/aggregates/aggregatewindow/
  - /{{< latest "influxdb" "v1" >}}/query_language/explore-data/#the-group-by-clause, InfluxQL – GROUP BY time()
---

{{< duplicate-oss >}}
