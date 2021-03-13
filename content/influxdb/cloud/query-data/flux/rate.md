---
title: Calculate the rate of change
seotitle: Calculate the rate of change in Flux
list_title: Rate
description: >
  Use the [`derivative()` function](/influxdb/cloud/reference/flux/stdlib/built-in/transformations/derivative/)
  to calculate the rate of change between subsequent values or the
  [`aggregate.rate()` function](/influxdb/cloud/reference/flux/stdlib/experimental/aggregate/rate/)
  to calculate the average rate of change per window of time.
  If time between points varies, these functions normalize points to a common time interval
  making values easily comparable.
weight: 210
menu:
  influxdb_cloud:
    parent: Query with Flux
    name: Rate
influxdb/cloud/tags: [query, rate]
related:
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/derivative/
  - /influxdb/cloud/reference/flux/stdlib/experimental/aggregate/rate/
list_query_example: rate_of_change
---

{{< duplicate-oss >}}