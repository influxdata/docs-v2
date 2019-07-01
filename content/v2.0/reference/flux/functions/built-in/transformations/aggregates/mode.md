---
title: mode() function
description: >
  The `mode()` function computes the mode or value that occurs most often in a
  specified column in the input table.
menu:
  v2_0_ref:
    name: mode
    parent: built-in-aggregates
weight: 501
---

The `mode()` function computes the mode or value that occurs most often in a
specified column in the input table.

_**Function type:** Aggregate_  

```js
mode(column: "_value")
```

## Parameters

### column
The column to use to compute the mode.
Defaults to `"_value"`.

_**Data type:** String_

## Examples

###### Mode as an aggregate
```js
from(bucket: "example-bucket")
  |> filter(fn: (r) =>
    r._measurement == "errors" and
    r._field == "count_per_minute"
  )
  |> range(start:-12h)
  |> window(every:10m)
  |> mode()
```

<hr style="margin-top:4rem"/>

##### Related InfluxQL functions and statements:
[MODE()](https://docs.influxdata.com/influxdb/latest/query_language/functions/#mode)  
