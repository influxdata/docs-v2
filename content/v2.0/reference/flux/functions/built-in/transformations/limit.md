---
title: limit() function
description: The `limit()` function limits the number of records in output tables to a fixed number (n).
aliases:
  - /v2.0/reference/flux/functions/transformations/limit
menu:
  v2_0_ref:
    name: limit
    parent: built-in-transformations
weight: 401
---

The `limit()` function limits the number of records in output tables to a fixed number ([`n`](#n)).
One output table is produced for each input table.
Each output table contains the first `n` records after the first `offset` records of the input table.
If the input table has less than `offset + n` records, all records except the first `offset` ones are output.

_**Function type:** Filter_  
_**Output data type:** Object_

```js
limit(n:10, offset: 0)
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
```js
from(bucket:"example-bucket")
  |> range(start:-1h)
  |> limit(n:10, offset: 1)
```

<hr style="margin-top:4rem"/>

##### Related InfluxQL functions and statements:
[LIMIT](https://docs.influxdata.com/influxdb/latest/query_language/data_exploration/#the-limit-and-slimit-clauses)  
