---
title: hourSelection() function
description: >
  The `hourSelection()` function retains all rows with time values in a specified hour range.
  Hours are specified in military time.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/hourselection
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/hourselection/
menu:
  influxdb_2_0_ref:
    name: hourSelection
    parent: built-in-transformations
weight: 402
---

The `hourSelection()` function retains all rows with time values in a specified hour range.

_**Function type:** Transformation_  

```js
hourSelection(
  start: 9,
  stop: 17,
  timeColumn: "_time"
)
```

## Parameters

### start
The first hour of the hour range (inclusive).
Hours range from `[0-23]`.

_**Data type:** Integer_

### stop
The last hour of the hour range (inclusive).
Hours range from `[0-23]`.

_**Data type:** Integer_

### timeColumn
The column that contains the time value.
Default is `"_time"`.

_**Data type:** String_

## Examples

##### Use only data from 9am to 5pm
```js
from(bucket:"example-bucket")
  |> range(start:-90d)
  |> filter(fn: (r) => r._measurement == "foot-traffic" )
  |> hourSelection(start: 9, stop: 17)
```
