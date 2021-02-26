---
title: experimental.window() function
description: >
  The `experimental.window()` function groups records based on a time value.
  Input tables must have `_start`, `_stop`, and `_time` columns.
menu:
  flux_0_x_ref:
    name: experimental.window
    parent: experimental
weight: 302
related:
  - /influxdb/v2.0/query-data/flux/window-aggregate/
  - /flux/v0.x/stdlib/universe/window/
  - /flux/v0.x/stdlib/universe/aggregatewindow/
  - /{{< latest "influxdb" "v1" >}}/query_language/explore-data/#the-group-by-clause, InfluxQL – GROUP BY time()
flux/v0.x/tags: [transformations]
introduced: 0.106.0
---

The `window()` function groups records based on a time value.
New columns are added to uniquely identify each window.
Those columns are added to the group key of the output tables.
**Input tables must have `_start`, `_stop`, and `_time` columns.**

A single input record will be placed into zero or more output tables, depending on the specific windowing function.

By default the start boundary of a window will align with the Unix epoch (zero time)
modified by the offset of the `location` option.

```js
window(
  every: 5m,
  period: 5m,
  offset: 12h,
  createEmpty: false
)
```

## Parameters

{{% note %}}
#### Calendar months and years
`every`, `period`, and `offset` support all [valid duration units](/influxdb/v2.0/reference/flux/language/types/#duration-types),
including **calendar months (`1mo`)** and **years (`1y`)**.
{{% /note %}}

### every
({{< req >}})
Duration of time between windows.
Defaults to `period` value.

_**Data type:** Duration_

### period
Duration of the window.
Period is the length of each interval.
It can be negative, indicating the start and stop boundaries are reversed.
Defaults to `every` value.

_**Data type:** Duration_

### offset
Offset is the duration by which to shift the window boundaries.
It can be negative, indicating that the offset goes backwards in time.
Defaults to 0, which will align window end boundaries with the `every` duration.

_**Data type:** Duration_


### createEmpty
Specifies whether empty tables should be created.
Defaults to `false`.

_**Data type:** Boolean_

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
