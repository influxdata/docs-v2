---
title: experimental.stddev() function
description: >
  The `experimental.stddev()` function computes the standard deviation of non-null
  values in the `_value` column for each input table.
menu:
  influxdb_2_0_ref:
    name: experimental.stddev
    parent: Experimental
weight: 302
related:
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/stddev/
  - /{{< latest "influxdb" "v1" >}}/query_language/functions/#stddev, InfluxQL – STDDEV()
---

The `experimental.stddev()` function computes the standard deviation of non-null
values in the `_value` column for each input table.

_**Function type:** Aggregate_  
_**Output data type:** Float_

```js
import "experimental"

experimental.stddev(mode: "sample")
```

## Parameters

### mode
The standard deviation mode or type of standard deviation to calculate.
Defaults to `"sample"`.

_**Data type:** String_

**Available options:**

- [sample](#sample)
- [population](#population)

##### sample
Calculate the sample standard deviation where the data is considered to be part of a larger population.

##### population
Calculate the population standard deviation where the data is considered a population of its own.

## Examples
```js
import "experimental"

from(bucket: "example-bucket")
  |> range(start: -5m)
  |> filter(fn: (r) =>
    r._measurement == "cpu" and
    r._field == "usage_system"
  )
  |> experimental.stddev()
```
