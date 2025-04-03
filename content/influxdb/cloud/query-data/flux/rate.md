---
title: Calculate the rate of change
seotitle: Calculate the rate of change in Flux
list_title: Rate
description: >
  Use the [`derivative()` function](/flux/v0/stdlib/universe/derivative/)
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
  - /flux/v0/stdlib/universe/derivative/
  - /flux/v0/stdlib/experimental/aggregate/rate/
list_query_example: rate_of_change
source: /shared/influxdb-v2/query-data/flux/rate.md
---

<!-- The content of this file is at 
// SOURCE content/shared/influxdb-v2/query-data/flux/rate.md-->