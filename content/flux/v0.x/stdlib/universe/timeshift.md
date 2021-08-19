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
flux/v0.x/tags: [transformations, date/time]
introduced: 0.7.0
---

The `timeShift()` function adds a fixed duration to time columns.
The output table schema is the same as the input table.
If the time is `null`, the time will continue to be `null`.

```js
timeShift(duration: 10h, columns: ["_start", "_stop", "_time"])
```

## Parameters

### duration {data-type="duration"}
({{< req >}})
The amount of time to add to each time value.
May be a negative duration.

### columns {data-type="array of strings"}
The list of all columns to be shifted.
Default is `["_start", "_stop", "_time"]`.

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

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
