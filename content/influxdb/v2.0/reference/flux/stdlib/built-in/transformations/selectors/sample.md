---
title: sample() function
description: The `sample()` function selects a subset of the records from the input table.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/selectors/sample
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/selectors/sample/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/selectors/sample/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/selectors/sample/
menu:
  influxdb_2_0_ref:
    name: sample
    parent: built-in-selectors
weight: 501
related:
  - /{{< latest "influxdb" "v1" >}}/query_language/functions/#sample, InfluxQL – SAMPLE()
introduced: 0.7.0
---

The `sample()` function selects a subset of the records from the input table.

_**Function type:** Selector_  
_**Output data type:** Record_

```js
sample(n:5, pos: -1)
```

{{% warn %}}
#### Empty tables
`sample()` drops empty tables.
{{% /warn %}}

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
