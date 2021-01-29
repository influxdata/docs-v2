---
title: timeShift() function
description: The `timeShift()` function adds a fixed duration to time columns.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/shift
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/shift
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/timeshift/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/timeshift/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/timeshift/
menu:
  flux_0_x_ref:
    name: timeShift
    parent: universe
weight: 102
introduced: 0.7.0
---

The `timeShift()` function adds a fixed duration to time columns.
The output table schema is the same as the input table.
If the time is `null`, the time will continue to be `null`.

_**Function type:** Transformation_

```js
timeShift(duration: 10h, columns: ["_start", "_stop", "_time"])
```

## Parameters

### duration
The amount of time to add to each time value.
May be a negative duration.

_**Data type:** Duration_

### columns
The list of all columns to be shifted.
Defaults to `["_start", "_stop", "_time"]`.

_**Data type:** Array of strings_

## Examples

###### Shift forward in time
```js
from(bucket: "example-bucket")
	|> range(start: -5m)
	|> timeShift(duration: 12h)
```

###### Shift backward in time
```js
from(bucket: "example-bucket")
	|> range(start: -5m)
	|> timeShift(duration: -12h)
```
