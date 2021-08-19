---
title: limit() function
description: The `limit()` function limits each output table to the first `n` records.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/limit
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/limit/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/limit/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/limit/
menu:
  flux_0_x_ref:
    name: limit
    parent: universe
weight: 102
flux/v0.x/tags: [transformations]
related:
  - /{{< latest "influxdb" >}}/query-data/flux/sort-limit/
  - /flux/v0.x/stdlib/universe/tail/
  - /{{< latest "influxdb" "v1" >}}/query_language/explore-data/#the-limit-and-slimit-clauses, InfluxQL LIMIT
introduced: 0.7.0
---

The `limit()` function limits each output table to the first [`n`](#n) records.
The function produces one output table for each input table.
Each output table contains the first `n` records after the [`offset`](#offset).
If the input table has less than `offset + n` records, `limit()` outputs all records after the `offset`.

```js
limit(
  n:10,
  offset: 0
)
```

## Parameters

### n {data-type="int"}
({{< req >}})
Maximum number of records to output.

### offset {data-type="int"}
Number of records to skip per table before limiting to `n`.
Default is `0`.

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

## Examples

##### Output the first ten records in each table
```js
from(bucket:"example-bucket")
  |> range(start:-1h)
  |> limit(n:10)
```
