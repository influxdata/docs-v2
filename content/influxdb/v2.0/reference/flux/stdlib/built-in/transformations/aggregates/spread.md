---
title: spread() function
description: The `spread()` function outputs the difference between the minimum and maximum values in a specified column.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/aggregates/spread
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/aggregates/spread/
menu:
  influxdb_2_0_ref:
    name: spread
    parent: built-in-aggregates
weight: 501
related:
  - /{{< latest "influxdb" "v1" >}}/query_language/functions/#spread, InfluxQL – SPREAD()
---

The `spread()` function outputs the difference between the minimum and maximum values in a specified column.
Only `uint`, `int`, and `float` column types can be used.
The type of the output column depends on the type of input column:

- For columns with type `uint` or `int`, the output is an `int`
- For columns with type `float`, the output is a float.

_**Function type:** Aggregate_  
_**Output data type:** Integer or Float (inherited from input column type)_

```js
spread(column: "_value")
```

## Parameters

### column
The column on which to operate. Defaults to `"_value"`.

_**Data type:** String_

## Examples
```js
from(bucket: "example-bucket")
  |> range(start: -5m)
  |> filter(fn: (r) =>
    r._measurement == "cpu" and
    r._field == "usage_system"
  )
  |> spread()
```
