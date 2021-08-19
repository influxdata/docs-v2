---
title: truncateTimeColumn() function
description: >
  The `truncateTimeColumn()` function truncates all input table `_time` values to a specified unit.
aliases:
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/truncatetimecolumn/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/truncatetimecolumn/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/truncatetimecolumn/
menu:
  flux_0_x_ref:
    name: truncateTimeColumn
    parent: universe
weight: 102
flux/v0.x/tags: [transformations, date/time]
related:
  - /flux/v0.x/stdlib/date/truncate/
introduced: 0.37.0
---

The `truncateTimeColumn()` function truncates all input table `_time` values to a specified unit.

```js
truncateTimeColumn(unit: 1s)
```

{{% note %}}
#### Truncate to weeks
When truncating a time value to the week (`1w`), weeks are determined using the 
**Unix epoch (1970-01-01T00:00:00Z UTC)**. The Unix epoch was on a Thursday, so
all calculated weeks begin on Thursday.
{{% /note %}}

## Parameters

### unit {data-type="duration"}
The unit of time to truncate to.

{{% note %}}
Only use `1` and the unit of time to specify the `unit`.
For example: `1s`, `1m`, `1h`.
{{% /note %}}

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

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
