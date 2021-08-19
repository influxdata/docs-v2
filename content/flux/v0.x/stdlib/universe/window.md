---
title: window() function
description: The `window()` function groups records based on a time value.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/window
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/window/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/window/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/window/
menu:
  flux_0_x_ref:
    name: window
    parent: universe
weight: 102
flux/v0.x/tags: [transformations]
related:
  - /{{< latest "influxdb" >}}/query-data/flux/window-aggregate/
  - /flux/v0.x/stdlib/built-in/universe/aggregatewindow/
  - /{{< latest "influxdb" "v1" >}}/query_language/explore-data/#the-group-by-clause, InfluxQL – GROUP BY time()
introduced: 0.7.0
---

The `window()` function groups records based on a time value.
New columns are added to uniquely identify each window.
Those columns are added to the group key of the output tables.

A single input record will be placed into zero or more output tables, depending on the specific windowing function.

By default the start boundary of a window will align with the Unix epoch (zero time)
modified by the offset of the `location` option.

```js
window(
  every: 5m,
  period: 5m,
  offset: 12h,
  timeColumn: "_time",
  startColumn: "_start",
  stopColumn: "_stop",
  createEmpty: false
)
```

## Parameters

{{% note %}}
#### Calendar months and years
`every`, `period`, and `offset` support all [valid duration units](/flux/v0.x/spec/types/#duration-types),
including **calendar months (`1mo`)** and **years (`1y`)**.
{{% /note %}}

### every {data-type="duration"}
Duration of time between windows.
Defaults to `period` value.

### period {data-type="duration"}
Duration of the window.
Period is the length of each interval.
It can be negative, indicating the start and stop boundaries are reversed.
Defaults to `every` value.

### offset {data-type="duration"}
Offset is the duration by which to shift the window boundaries.
It can be negative, indicating that the offset goes backwards in time.
Defaults to 0, which will align window end boundaries with the `every` duration.

### timeColumn {data-type="string"}
The column containing time.
Defaults to `"_time"`.

### startColumn {data-type="string"}
The column containing the window start time.
Defaults to `"_start"`.

### stopColumn {data-type="string"}
The column containing the window stop time.
Defaults to `"_stop"`.

### createEmpty {data-type="bool"}
Specifies whether empty tables should be created.
Defaults to `false`.

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

## Examples

#### Window data into 10 minute intervals
```js
from(bucket:"example-bucket")
  |> range(start: -12h)
  |> window(every: 10m)
  // ...
```

#### Window by calendar month
```js
from(bucket:"example-bucket")
  |> range(start: -1y)
  |> window(every: 1mo)
  // ...
```
