---
title: sample.alignToNow() function
description: >
  `sample.alignToNow()` shifts time values in input data to align the chronological last point to _now_.
menu:
  flux_0_x_ref:
    name: sample.alignToNow
    parent: sample-pkg
weight: 301
related:
  - /influxdb/v2.0/reference/sample-data/
introduced: 0.132.0
---

`sample.alignToNow()` shifts time values in input data to align the chronological last point to _now_.
Input data must have a `_time` column.

{{% note %}}
When writing static historical sample datasets to **InfluxDB Cloud**,
use `sample.alignToNow()` to avoid losing sample data with timestamps outside
of the retention period associated with your InfluxDB Cloud account.
{{% /note %}}

## Examples

#### Align sample data timestamps to the current time
```js
import "influxdata/influxdb/sample"

option now = () => 2021-01-01T00:00:00Z

data = sample.data(set: "birdMigration")
  |> filter(fn: (r) =>
    r._field == "lon" and
    r.s2_cell_id == "471ed2c" and
    r.id == "91916A"
  )
  |> tail(n: 3)

data
  |> sample.alignToNow()
```

{{% expand "View input and output" %}}
#### Input data
| _time                | _measurement | id     | s2_cell_id | _field |   _value |
| :------------------- | :----------- | :----- | :--------- | :----- | -------: |
| 2019-09-19T15:00:00Z | migration    | 91916A | 471ed2c    | lon    | 21.10333 |
| 2019-09-22T09:00:00Z | migration    | 91916A | 471ed2c    | lon    |   21.084 |
| 2019-09-22T15:00:00Z | migration    | 91916A | 471ed2c    | lon    | 21.10317 |

#### Output data
| _time                | _measurement | id     | s2_cell_id | _field |   _value |
| :------------------- | :----------- | :----- | :--------- | :----- | -------: |
| 2020-12-29T00:00:00Z | migration    | 91916A | 471ed2c    | lon    | 21.10333 |
| 2020-12-31T18:00:00Z | migration    | 91916A | 471ed2c    | lon    |   21.084 |
| 2021-01-01T00:00:00Z | migration    | 91916A | 471ed2c    | lon    | 21.10317 |
{{% /expand %}}