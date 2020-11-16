---
title: movingAverage() function
description: >
  The `movingAverage()` function calculates the mean of values grouped into `n` number of points.
aliases:
  - /influxdb/cloud/reference/flux/functions/built-in/transformations/aggregates/movingaverage/
  - /influxdb/cloud/reference/flux/functions/built-in/transformations/movingaverage/
menu:
  influxdb_cloud_ref:
    name: movingAverage
    parent: built-in-transformations
weight: 402
related:
  - /influxdb/cloud/query-data/flux/moving-average/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/timedmovingaverage/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/exponentialmovingaverage/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/doubleema/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/tripleema/
  - /{{< latest "influxdb" "v1" >}}/query_language/functions/#moving-average, InfluxQL MOVING_AVERAGE()
---

The `movingAverage()` function calculates the mean of values in the `_values` column
grouped into `n` number of points.

_**Function type:** Transformation_  

```js
movingAverage(n: 5)
```

##### Moving average rules
- The average over a period populated by `n` values is equal to their algebraic mean.
- The average over a period populated by only `null` values is `null`.
- Moving averages skip `null` values.
- If `n` is less than the number of records in a table, `movingAverage` returns
  the average of the available values.

## Parameters

### n
The number of points to average.

_**Data type:** Integer_

## Examples

#### Calculate a five point moving average
```js
from(bucket: "example-bucket"):
  |> range(start: -12h)
  |> movingAverage(n: 5)
```

#### Table transformation with a two point moving average

###### Input table:
| _time | tag | _value |
|:-----:|:---:|:------:|
| 0001  | tv  | null   |
| 0002  | tv  | 6      |
| 0003  | tv  | 4      |

###### Query:
```js
// ...
  |> movingAverage(n: 2 )
```

###### Output table:
| _time | tag | _value |
|:-----:|:---:|:------:|
| 0002  | tv  | 6      |
| 0003  | tv  | 5      |
