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

The `experimental.window()` function groups records based on a time value.
New columns are added to uniquely identify each window.
Those columns are added to the group key of the output tables.
**Input tables must have `_start`, `_stop`, and `_time` columns.**

A single input record will be placed into zero or more output tables, depending on the specific windowing function.

By default the start boundary of a window will align with the Unix epoch (zero time)
modified by the offset of the `location` option.

```js
import "experimental"

experimental.window(
    every: 5m,
    period: 5m,
    offset: 12h,
    location: "UTC",
    createEmpty: false,
)
```

## Parameters

{{% note %}}
#### Calendar months and years
`every`, `period`, and `offset` support all [valid duration units](/flux/v0.x/spec/types/#duration-types),
including **calendar months (`1mo`)** and **years (`1y`)**.
{{% /note %}}

### every {data-type="duration"}
({{< req >}})
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

### location {data-type="string"}
Location used to determine timezone.
Default is the [`location` option](/flux/v0.x/stdlib/universe/#location).

_Flux uses the timezone database (commonly referred to as "tz" or "zoneinfo")
provided by the operating system._

### createEmpty {data-type="bool"}
Specifies whether empty tables should be created.
Defaults to `false`.

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data (`<-`).

## Examples

#### Window data into 10 minute intervals
```js
import "experimental"

from(bucket:"example-bucket")
  |> range(start: -12h)
  |> experimental.window(every: 10m)
  // ...
```

#### Window by calendar month
```js
import "experimental"

from(bucket:"example-bucket")
  |> range(start: -1y)
  |> experimental.window(every: 1mo)
  // ...
```
