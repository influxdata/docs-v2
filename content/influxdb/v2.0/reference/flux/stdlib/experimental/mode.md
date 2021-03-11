---
title: experimental.mode() function
description: >
  The `experimental.mode()` function computes the mode or value that occurs most
  often in the `_value` column in each input table.
menu:
  influxdb_2_0_ref:
    name: experimental.mode
    parent: Experimental
weight: 302
related:
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/mode/
  - /{{< latest "influxdb" "v1" >}}/query_language/functions/#mode, InfluxQL – MODE()
---

The `experimental.mode()` function computes the mode or value that occurs most
often in the `_value` column in each input table.

_**Function type:** Aggregate_  

```js
import "experimental"

experimental.mode()
```

If there are multiple modes, it returns all of them in a sorted table.
Mode only considers non-null values.
If there is no mode, `experimental.mode()` returns `null`.

{{% warn %}}
#### Empty tables
`experimental.mode()` drops empty tables.
{{% /warn %}}

##### Supported data types

- String
- Float
- Integer
- UInteger
- Boolean
- Time

## Examples

###### Return the mode of windowed data
```js
import "experimental"

from(bucket: "example-bucket")
  |> filter(fn: (r) =>
    r._measurement == "example-measurement" and
    r._field == "example-field"
  )
  |> range(start:-12h)
  |> window(every:10m)
  |> experimental.mode()
```
