---
title: sample() function
description: The `sample()` function selects a subset of the records from the input table.
aliases:
  - /v2.0/reference/flux/functions/transformations/selectors/sample
  - /v2.0/reference/flux/functions/built-in/transformations/selectors/sample/
menu:
  v2_0_ref:
    name: sample
    parent: built-in-selectors
weight: 501
---

The `sample()` function selects a subset of the records from the input table.

_**Function type:** Selector_  
_**Output data type:** Object_

```js
sample(n:5, pos: -1)
```

## Parameters

### n
Sample every Nth element.

_**Data type:** Integer_

### pos
The position offset from the start of results where sampling begins.
`pos` must be less than `n`.
If `pos` is less than 0, a random offset is used.
Defaults to `-1` (random offset).

_**Data type:** Integer_

## Examples
```js
from(bucket:"example-bucket")
  |> range(start:-1d)
  |> filter(fn: (r) =>
    r._measurement == "cpu" and
    r._field == "usage_system"
  )
  |> sample(n: 5, pos: 1)
```

<hr style="margin-top:4rem"/>

##### Related InfluxQL functions and statements:
[SAMPLE()](https://docs.influxdata.com/influxdb/latest/query_language/functions/#sample)
