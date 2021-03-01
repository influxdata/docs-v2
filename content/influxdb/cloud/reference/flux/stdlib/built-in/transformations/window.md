---
title: window() function
description: The `window()` function groups records based on a time value.
aliases:
  - /influxdb/cloud/reference/flux/functions/transformations/window
  - /influxdb/cloud/reference/flux/functions/built-in/transformations/window/
menu:
  influxdb_cloud_ref:
    name: window
    parent: built-in-transformations
weight: 402
related:
  - /influxdb/cloud/query-data/flux/window-aggregate/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/aggregates/aggregatewindow/
  - /{{< latest "influxdb" "v1" >}}/query_language/explore-data/#the-group-by-clause, InfluxQL – GROUP BY time()
---

The `window()` function groups records based on a time value.
New columns are added to uniquely identify each window.
Those columns are added to the group key of the output tables.

A single input record will be placed into zero or more output tables, depending on the specific windowing function.

By default the start boundary of a window will align with the Unix epoch (zero time)
modified by the offset of the `location` option.

_**Function type:** Transformation_  
_**Output data type:** Record_

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
`every`, `period`, and `offset` support all [valid duration units](/influxdb/cloud/reference/flux/language/types/#duration-types),
including **calendar months (`1mo`)** and **years (`1y`)**.
{{% /note %}}

### every
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

### timeColumn
The column containing time.
Defaults to `"_time"`.

_**Data type:** String_

### startColumn
The column containing the window start time.
Defaults to `"_start"`.

_**Data type:** String_

### stopColumn
The column containing the window stop time.
Defaults to `"_stop"`.

_**Data type:** String_

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
