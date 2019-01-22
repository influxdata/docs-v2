---
title: Introduction to Flux
description: >
  Flux is InfluxData's functional data scripting language designed for querying,
  analyzing, and acting on data.
menu:
  v2_0:
    parent: Query data
    name: Flux
    weight: 1
---

Flux is InfluxData's functional data scripting language designed for querying, analyzing, and acting on data.

## Flux design principles
Flux is designed to be usable, readable, flexible, composable, testable, contributable, and shareable.
Its syntax is largely inspired by [2018's most popular scripting language](https://insights.stackoverflow.com/survey/2018#technology),
Javascript, and takes a functional approach to data exploration and processing.

The following example illustrates querying data stored from the last five minutes,
filtering by the `cpu` measurement and the `cpu=cpu-usage` tag, windowing the data in 1 minute intervals,
and calculating the average of each window:

```js
from(bucket:"example-bucket")
  |> range(start:-1h)
  |> filter(fn:(r) =>
    r._measurement == "cpu" and
    r.cpu == "cpu-total"
  )
  |> aggregateWindow(every: 1m, fn: mean)
```

## Get started with Flux
The best way to familiarize yourself with Flux is to walk through creating a simple Flux query.

[Get Started with Flux](/v2.0/query-data/flux/get-started)
