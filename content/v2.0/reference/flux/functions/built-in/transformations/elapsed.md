---
title: elapsed() function
description: The `elapsed()` function .returns the elapsed time between subsequent records.
menu:
  v2_0_ref:
    name: elapsed
    parent: built-in-transformations
weight: 401
---

The `elapsed()` function returns the elapsed time between subsequent records.
Given an input table, `elapsed` will return the same table with an additional
`elapsed` column and without the first record as elapsed time is not defined.

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
The unit in which the elapsed time is returned.
_Defaults to `1s`._

_**Data type:** Duration_

### timeColumn
Name of the column to use to compute the elapsed time.
_Defaults to `"_time"`._

_**Data type:** String_

### columnName
Name of the column in which to store elapsed times.
_Defaults to `"elapsed"`._

_**Data type:** String_

## Examples

##### Calculate the time between points in seconds
```js
from(bucket: "example-bucket")
	|> range(start: -5m)
	|> elapsed(unit: 1s)
```
