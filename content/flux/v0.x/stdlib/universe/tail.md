---
title: tail() function
description: The `tail()` function limits each output table to the last `n` records.
aliases:
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/tail/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/tail/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/tail/
menu:
  flux_0_x_ref:
    name: tail
    parent: universe
weight: 102
flux/v0.x/tags: [transformations]
related:
  - /flux/v0.x/stdlib/universe/limit/
introduced: 0.39.0
---

The `tail()` function limits each output table to the last [`n`](#n) records.
The function produces one output table for each input table.
Each output table contains the last `n` records before the [`offset`](#offset).
If the input table has less than `offset + n` records, `tail()` outputs all records before the `offset`.

_**Function type:** Filter_

```js
tail(
  n:10,
  offset: 0
)
```

## Parameters

### n {data-type="int"}
({{< req >}})
The maximum number of records to output.

### offset {data-type="int"}
The number of records to skip at the end of a table table before limiting to `n`.
Default is `0`.

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

## Examples

##### Output the last ten records in each table
```js
from(bucket:"example-bucket")
  |> range(start:-1h)
  |> tail(n:10)
```
