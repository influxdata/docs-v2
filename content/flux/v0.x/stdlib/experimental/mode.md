---
title: experimental.mode() function
description: >
  The `experimental.mode()` function computes the mode or value that occurs most
  often in the `_value` column in each input table.
menu:
  flux_0_x_ref:
    name: experimental.mode
    parent: experimental
weight: 302
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/experimental/mode/
  - /influxdb/cloud/reference/flux/stdlib/experimental/mode/
related:
  - /flux/v0.x/stdlib/universe/mode/
  - /{{< latest "influxdb" "v1" >}}/query_language/functions/#mode, InfluxQL – MODE()
flux/v0.x/tags: [transformations, aggregates]
introduced: 0.107.0
---

The `experimental.mode()` function computes the mode or value that occurs most
often in the `_value` column in each input table.
_`experimental.mode()` is an [aggregate function](/flux/v0.x/function-types/#aggregates)._

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

## Parameters

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data (`<-`).

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
