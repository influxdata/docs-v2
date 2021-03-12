---
title: elapsed() function
description: The `elapsed()` function returns the time between subsequent records.
aliases:
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/elapsed/
menu:
  influxdb_2_0_ref:
    name: elapsed
    parent: built-in-transformations
weight: 402
related:
  - /influxdb/v2.0/reference/flux/stdlib/contrib/events/duration/
---

The `elapsed()` function returns the time between subsequent records.
Given an input table, `elapsed()` returns the same table without the first record
(as elapsed time is not defined) and an additional column containing the elapsed time.

_**Function type:** Transformation_  

```js
elapsed(
  unit: 1s,
  timeColumn: "_time",
  columnName: "elapsed"
)
```

_`elapsed()` returns an errors if the `timeColumn` is not present in the input table._

## Parameters

### unit
The unit time to returned.
_Defaults to `1s`._

_**Data type:** Duration_

### timeColumn
The column to use to compute the elapsed time.
_Defaults to `"_time"`._

_**Data type:** String_

### columnName
The column to store elapsed times.
_Defaults to `"elapsed"`._

_**Data type:** String_

## Examples

##### Calculate the time between points in seconds
```js
from(bucket: "example-bucket")
	|> range(start: -5m)
	|> elapsed(unit: 1s)
```
