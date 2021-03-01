---
title: limit() function
description: The `limit()` function limits each output table to the first `n` records.
aliases:
  - /influxdb/cloud/reference/flux/functions/transformations/limit
  - /influxdb/cloud/reference/flux/functions/built-in/transformations/limit/
menu:
  influxdb_cloud_ref:
    name: limit
    parent: built-in-transformations
weight: 402
related:
  - /influxdb/cloud/query-data/flux/sort-limit/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/tail/
  - /{{< latest "influxdb" "v1" >}}/query_language/explore-data/#the-limit-and-slimit-clauses, InfluxQL LIMIT
---

The `limit()` function limits each output table to the first [`n`](#n) records.
The function produces one output table for each input table.
Each output table contains the first `n` records after the [`offset`](#offset).
If the input table has less than `offset + n` records, `limit()` outputs all records after the `offset`.

_**Function type:** Filter_

```js
limit(
  n:10,
  offset: 0
)
```

## Parameters

### n
The maximum number of records to output.

_**Data type:** Integer_

### offset
The number of records to skip per table before limiting to `n`.
Defaults to `0`.

_**Data type:** Integer_

## Examples

##### Output the first ten records in each table
```js
from(bucket:"example-bucket")
  |> range(start:-1h)
  |> limit(n:10)
```
