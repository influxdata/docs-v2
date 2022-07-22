---
title: Join data sets
seotitle: Join data sets with Flux
description: >
  Flux supports inner, full outer, left outer, and right outer joins.
  Learn how to use the `join` package to join two data sets with common values.
menu:
  flux_0_x:
    name: Join data
weight: 8
---

- Introduction to the `join` package

## Join types


## How join functions work

The `join` package provides functions for each of the different join types:

- `join.inner()` - Inner join
- `join.full()` - Full outer join
- `join.left()` - Left outer join
- `join.right()` - Right outer join

All functions in the `join` package join _two_ streams of tables together based 
on common values in each input stream.
Each input stream is assigned to the `left` or `right` parameter.
The input streams assigned to these parameters are used in functions assigned to
the `on` and `as` parameters.


- Join types
  - Inner join
  - Full outer join
  - Left outer join
  - Right outer join
- Special cases
  - Join exclusively on time join.time

- Note on joining vs union + pivot
  - If the schemas of the two datasets are mostly different, use join.
  - If the schemas of the two datasets are identical, use `union() |> pivot()`.

- Full outer join

## Join examples

### Enrich time series data with relational data

```js
import "join"
import "influxdata/influxdb/sample"
import "sql"

timeSeries = sample.data(set: "airSensor")
  |> range(start: -5m)
  |> filter(fn: (r) => r._field == "temp")
```