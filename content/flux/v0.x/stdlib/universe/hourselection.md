---
title: hourSelection() function
description: >
  The `hourSelection()` function retains all rows with time values in a specified hour range.
  Hours are specified in military time.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/hourselection
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/hourselection/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/hourselection/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/hourselection/
menu:
  flux_0_x_ref:
    name: hourSelection
    parent: universe
weight: 102
flux/v0.x/tags: [transformations, date/time]
introduced: 0.39.0
---

The `hourSelection()` function retains all rows with time values in a specified hour range.

```js
hourSelection(
  start: 9,
  stop: 17,
  timeColumn: "_time"
)
```

## Parameters

### start {data-type="int"}
({{< req >}})
The first hour of the hour range (inclusive).
Hours range from `[0-23]`.

### stop {data-type="int"}
({{< req >}})
The last hour of the hour range (inclusive).
Hours range from `[0-23]`.

### timeColumn {data-type="string"}
The column that contains the time value.
Default is `"_time"`.

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

## Examples

##### Use only data from 9am to 5pm
```js
from(bucket:"example-bucket")
  |> range(start:-90d)
  |> filter(fn: (r) => r._measurement == "foot-traffic" )
  |> hourSelection(start: 9, stop: 17)
```
