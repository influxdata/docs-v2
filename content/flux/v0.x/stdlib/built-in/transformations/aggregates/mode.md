---
title: mode() function
description: >
  The `mode()` function computes the mode or value that occurs most often in a
  specified column in the input table.
aliases:
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/aggregates/mode/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/mode/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/aggregates/mode/
menu:
  flux_0_x_ref:
    name: mode
    parent: built-in-aggregates
weight: 501
related:
  - /{{< latest "influxdb" "v1" >}}/query_language/functions/#mode, InfluxQL – MODE()
introduced: 0.36.0
---

The `mode()` function computes the mode or value that occurs most often in a
specified column in the input table.

_**Function type:** Aggregate_  

```js
mode(column: "_value")
```

If there are multiple modes, it returns all of them in a sorted table.
Mode only considers non-null values.
If there is no mode, `mode()` returns `null`.

{{% warn %}}
#### Empty tables
`mode()` drops empty tables.
{{% /warn %}}

##### Supported data types

- String
- Float
- Integer
- UInteger
- Boolean
- Time

## Parameters

### column
The column to use to compute the mode.
Defaults to `"_value"`.

_**Data type:** String_

## Examples

###### Return the mode of windowed data
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
