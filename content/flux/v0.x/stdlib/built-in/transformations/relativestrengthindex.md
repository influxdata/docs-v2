---
title: relativeStrengthIndex() function
description: >
  The `relativeStrengthIndex()` function measures the relative speed and change of
  values in an input table.
aliases:
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/aggregates/relativestrengthindex/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/relativestrengthindex/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/relativestrengthindex/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/relativestrengthindex/
menu:
  flux_0_x_ref:
    name: relativeStrengthIndex
    parent: built-in-transformations
weight: 402
related:
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/movingaverage/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/timedmovingaverage/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/exponentialmovingaverage/
  - /{{< latest "influxdb" "v1" >}}/query_language/functions/#relative-strength-index, InfluxQL RELATIVE_STRENGTH_INDEX()
introduced: 0.38.0
---

The `relativeStrengthIndex()` function measures the relative speed and change of
values in an input table.

_**Function type:** Transformation_  

```js
relativeStrengthIndex(
  n: 5,
  columns: ["_value"]
)
```

##### Relative strength index rules
- The general equation for calculating a relative strength index (RSI) is
  `RSI = 100 - (100 / (1 + (AVG GAIN / AVG LOSS)))`.
- For the first value of the RSI, `AVG GAIN` and `AVG LOSS` are averages of the `n` period.
- For subsequent calculations:
  - `AVG GAIN` = `((PREVIOUS AVG GAIN) * (n - 1)) / n`
  - `AVG LOSS` = `((PREVIOUS AVG LOSS) * (n - 1)) / n`
- `relativeStrengthIndex()` ignores `null` values.

## Parameters

### n
The number of values to use to calculate the RSI.

_**Data type:** Integer_

### columns
Columns to operate on. _Defaults to `["_value"]`_.

_**Data type:** Array of Strings_

## Output tables
For each input table with `x` rows, `relativeStrengthIndex()` outputs a table
with `x - n` rows.

## Examples

#### Calculate a five point relative strength index
```js
from(bucket: "example-bucket"):
  |> range(start: -12h)
  |> relativeStrengthIndex(n: 5)
```

#### Table transformation with a ten point RSI

{{< flex >}}
{{% flex-content %}}
###### Input table:
| _time | A    | B    | tag |
|:-----:|:----:|:----:|:---:|
| 0001  | 1    | 1    | tv  |
| 0002  | 2    | 2    | tv  |
| 0003  | 3    | 3    | tv  |
| 0004  | 4    | 4    | tv  |
| 0005  | 5    | 5    | tv  |
| 0006  | 6    | 6    | tv  |
| 0007  | 7    | 7    | tv  |
| 0008  | 8    | 8    | tv  |
| 0009  | 9    | 9    | tv  |
| 0010  | 10   | 10   | tv  |
| 0011  | 11   | 11   | tv  |
| 0012  | 12   | 12   | tv  |
| 0013  | 13   | 13   | tv  |
| 0014  | 14   | 14   | tv  |
| 0015  | 15   | 15   | tv  |
| 0016  | 16   | 16   | tv  |
| 0017  | 17   | null | tv  |
| 0018  | 18   | 17   | tv  |
{{% /flex-content %}}
{{% flex-content %}}
###### Query:
```js
// ...
  |> relativeStrengthIndex(
    n: 10,
    columns: ["A", "B"]
  )
```

###### Output table:
| _time |   A  |   B  | tag |
|:-----:|:----:|:----:|:---:|
|  0011 | 100  | 100  |  tv |
|  0012 | 100  | 100  |  tv |
|  0013 | 100  | 100  |  tv |
|  0014 | 100  | 100  |  tv |
|  0015 | 100  | 100  |  tv |
|  0016 |  90  |  90  |  tv |
|  0017 |  81  |  90  |  tv |
|  0018 | 72.9 |  81  |  tv |
{{% flex-content %}}
{{< /flex >}}
