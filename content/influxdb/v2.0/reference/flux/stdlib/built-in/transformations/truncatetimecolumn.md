---
title: truncateTimeColumn() function
description: >
  The `truncateTimeColumn()` function truncates all input table `_time` values to a specified unit.
aliases:
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/truncatetimecolumn/
menu:
  influxdb_2_0_ref:
    name: truncateTimeColumn
    parent: built-in-transformations
weight: 402
related:
  - /influxdb/v2.0/reference/flux/stdlib/date/truncate/
---

The `truncateTimeColumn()` function truncates all input table `_time` values to a specified unit.

_**Function type:** Transformation_

```js
truncateTimeColumn(unit: 1s)
```

## Parameters

### unit
The unit of time to truncate to.

_**Data type:** Duration_

{{% note %}}
Only use `1` and the unit of time to specify the `unit`.
For example: `1s`, `1m`, `1h`.
{{% /note %}}

## Examples

##### Truncate all time values to seconds
```js
from(bucket:"example-bucket")
  |> range(start:-1h)
  |> truncateTimeColumn(unit: 1s)
```

## Function definition
```js
import "date"

truncateTimeColumn = (unit, tables=<-) =>
  tables
    |> map(fn: (r) => ({
        r with _time: date.truncate(t: r._time, unit:unit)
      })
    )
```
