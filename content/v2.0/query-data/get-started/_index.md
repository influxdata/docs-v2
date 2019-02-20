---
title: Get started with Flux
description: >
  Get started with Flux, InfluxData's functional data scripting language.
  This step-by-step guide through the basics of writing a Flux query.
weight: 101
v2.0/tags: [query, flux, get-started]
menu:
  v2_0:
    name: Get started with Flux
    parent: Query data
---

Flux is InfluxData's functional data scripting language designed for querying,
analyzing, and acting on data.

This multi-part getting started guide walks through important concepts related to Flux,
how to query time series data from InfluxDB using Flux, and introduces Flux syntax and functions.

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

## Key concepts
Flux introduces important new concepts you should understand as you get started.

### Pipe-forward operator
Flux uses pipe-forward operators (`|>`) extensively to chain operations together.
After each function or operation, Flux returns a table or collection of tables containing data.
The pipe-forward operator pipes those tables into the next function or operation where
they are further processed or manipulated.

### Tables
Flux structures all data in tables.
When data is streamed from data sources, Flux formats it as annotated
comma-separated values (CSV), representing tables.
Functions then manipulate or process them and output new tables.

#### Group keys
Every table has a **group key** which describes the contents of the table.
It's a list of columns for which every row in the table will have the same value.
Columns with unique values in each row are **not** part of the group key.

As functions process and transform data, each modifies the group keys of output tables.
Understanding how tables and group keys are modified by functions is key to properly
shaping your data for the desired output.

###### Example group key
```js
[_start, _stop, _field, _measurement, host]
```

Note that `_time` and `_value` are excluded from the example group key because they
are unique to each row.

## Tools for working with Flux

The [Execute queries](/v2.0/query-data/execute-queries) guide walks through
the different tools available for querying InfluxDB with Flux.

<div class="page-nav-btns">
  <a class="btn prev" href="/v2.0/query-data/">Introduction to Flux</a>
  <a class="btn next" href="/v2.0/query-data/get-started/query-influxdb/">Query InfluxDB with Flux</a>
</div>
