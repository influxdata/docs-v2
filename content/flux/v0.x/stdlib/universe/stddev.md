---
title: stddev() function
description: The `stddev()` function computes the standard deviation of non-null records in a specified column.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/aggregates/stddev
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/aggregates/stddev/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/stddev/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/aggregates/stddev/
menu:
  flux_0_x_ref:
    name: stddev
    parent: universe
weight: 102
flux/v0.x/tags: [aggregates, transformations]
related:
  - /{{< latest "influxdb" "v1" >}}/query_language/functions/#stddev, InfluxQL – STDDEV()
introduced: 0.7.0
---

The `stddev()` function computes the standard deviation of non-null records in a specified column.

_**Function type:** Aggregate_  
_**Output data type:** Float_

```js
stddev(
  column: "_value",
  mode: "sample"
)
```

## Parameters

### column
The column on which to operate.
Defaults to `"_value"`.

_**Data type:** String_

### mode
The standard deviation mode or type of standard deviation to calculate.
Defaults to `"sample"`.

_**Data type:** String_

The available options are:

##### sample
Calculates the sample standard deviation where the data is considered to be part of a larger population.

##### population
Calculates the population standard deviation where the data is considered a population of its own.

## Examples
```js
from(bucket: "example-bucket")
  |> range(start: -5m)
  |> filter(fn: (r) =>
    r._measurement == "cpu" and
    r._field == "usage_system"
  )
  |> stddev()
```
