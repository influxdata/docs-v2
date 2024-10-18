---
title: Flux data scripting language
description: >
   Flux is a functional data scripting language designed for querying, analyzing, and acting on time series data.
menu:
  influxdb_v1:
    name: Flux
    weight: 80
v2: /influxdb/v2/query-data/get-started/
---

Flux is a functional data scripting language designed for querying, analyzing, and acting on time series data.
It takes the power of [InfluxQL](/influxdb/v1/query_language/spec/) and the functionality of [TICKscript](/kapacitor/v1/reference/tick/introduction/) and combines them into a single, unified syntax.

> Flux is production-ready and included with [InfluxDB v1.8+](/influxdb/v1/).

## Flux design principles
Flux is designed to be usable, readable, flexible, composable, testable, contributable, and shareable.
Its syntax is largely inspired by [2018's most popular scripting language](https://insights.stackoverflow.com/survey/2018#technology),
JavaScript, and takes a functional approach to data exploration and processing.

The following example illustrates pulling data from a bucket (similar to an InfluxQL database) for the last five minutes,
filtering that data by the `cpu` measurement and the `cpu=cpu-total` tag, windowing the data in 1 minute intervals,
and calculating the average of each window:

```js
from(bucket:"telegraf/autogen")
  |> range(start:-1h)
  |> filter(fn:(r) =>
    r._measurement == "cpu" and
    r.cpu == "cpu-total"
  )
  |> aggregateWindow(every: 1m, fn: mean)
```

{{< children >}}