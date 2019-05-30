---
title: sum() function
description: The `sum()` function computes the sum of non-null records in a specified column.
aliases:
  - /v2.0/reference/flux/functions/transformations/aggregates/sum
menu:
  v2_0_ref:
    name: sum
    parent: built-in-aggregates
weight: 501
---

The `sum()` function computes the sum of non-null records in a specified column.

_**Function type:** Aggregate_  
_**Output data type:** Integer, UInteger, or Float (inherited from column type)_

```js
sum(column: "_value")
```

## Parameters

### column
The column on which to operate.
Defaults to `"_value"`.

_**Data type:** String_

## Examples
```js
from(bucket: "example-bucket")
  |> range(start: -5m)
  |> filter(fn: (r) =>
    r._measurement == "cpu" and
    r._field == "usage_system"
  )
  |> sum()
```

<hr style="margin-top:4rem"/>

##### Related InfluxQL functions and statements:
[SUM()](https://docs.influxdata.com/influxdb/latest/query_language/functions/#sum)  
