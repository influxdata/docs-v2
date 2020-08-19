---
title: window() function
description: The `window()` function groups records based on a time value.
aliases:
  - /v2.0/reference/flux/functions/transformations/window
  - /v2.0/reference/flux/functions/built-in/transformations/window/
menu:
  influxdb_2_0_ref:
    name: window
    parent: built-in-transformations
weight: 402
related:
  - /influxdb/v2.0/query-data/flux/window-aggregate/
  - /v2.0/reference/flux/stdlib/built-in/transformations/aggregates/aggregatewindow/
  - /{{< latest "influxdb" "v1" >}}/query_language/data_exploration/#the-group-by-clause, InfluxQL – GROUP BY time()
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
`every`, `period`, and `offset` support all [valid duration units](/v2.0/reference/flux/language/types/#duration-types),
including **calendar months (`1mo`)** and **years (`1y`)**.

Calendar duration units (`1y` and `1mo`) cannot be mixed with normal duration units (`1m`, `1h`, etc).
{{% /note %}}

### every
Duration of time between windows.
Defaults to `period` value.
Must be a positive, nonzero duration value.

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

## Troubleshooting

### Missing time column

The `window()` transformation requires a time column to divide rows into windows (time-based groups).
The default time column is `_time`.

**Common cause:** using an aggregate function without creating a new time column.
[Aggregate functions](/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/) drop columns not included in the group key.
Time columns are typically not part of the group key.

```js
from(bucket: "telegraf")
    |> range(start: -5m)
    |> window(every: 1m)
    |> mean()
    |> window(every: inf) // error, no _time column because mean removed it
```

**Solution:** use `duplicate()` to create a `_time` column from existing `_start` or `_stop` columns.

```js
from(bucket: "telegraf")
    |> range(start: -5m)
    |> window(every: 1m)
    |> mean()
    |> duplicate(column: "_stop", as: "_time")
    |> window(every: inf)
```

### Nil bounds passed to window

**Common cause:** using `window()` with a non-InfluxDB data source.
`window()` requires time bounds set by `range()` and `range()` is only required when querying InfluxDB.

**Solution:** call `range()` before `window()` to set the window range.

```js
import "experimental/array"

array.from(rows: [
    {_time: 2020-08-25T09:00:00Z, _value: 2.0},
    {_time: 2020-08-25T09:30:00Z, _value: 3.0},
    {_time: 2020-08-25T10:00:00Z, _value: 4.0},
    {_time: 2020-08-25T10:30:00Z, _value: 5.0},
])
    |> range(start: 2020-08-25T09:00:00Z, stop: 2020-08-25T11:00:00Z) // required
    |> window(every: 1h)
```
