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
    parent: universe
weight: 102
flux/v0.x/tags: [transformations]
related:
  - /flux/v0.x/stdlib/universe/movingaverage/
  - /flux/v0.x/stdlib/universe/timedmovingaverage/
  - /flux/v0.x/stdlib/universe/exponentialmovingaverage/
  - /{{< latest "influxdb" "v1" >}}/query_language/functions/#relative-strength-index, InfluxQL RELATIVE_STRENGTH_INDEX()
introduced: 0.38.0
---

The `relativeStrengthIndex()` function measures the relative speed and change of
values in an input table.

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

### n {data-type="int"}
({{< req >}})
The number of values to use to calculate the RSI.

### columns {data-type="array of strings"}
Columns to operate on.
Default is `["_value"]`.

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

## Output tables
For each input table with `x` rows, `relativeStrengthIndex()` outputs a table
with `x - n` rows.

## Examples
{{% flux/sample-example-intro %}}

#### Calculate a three point relative strength index
```js
import "sampledata"

sampledata.int()
  |> relativeStrengthIndex(n: 3)
```

{{< expand-wrapper >}}
{{% expand "View input and output" %}}
{{< flex >}}
{{% flex-content %}}

##### Input data
{{% flux/sample "int" %}}

{{% /flex-content %}}
{{% flex-content %}}

##### Output data
| _time                | tag |             _value |
| :------------------- | :-- | -----------------: |
| 2021-01-01T00:00:30Z | t1  |             84.375 |
| 2021-01-01T00:00:40Z | t1  |  73.97260273972603 |
| 2021-01-01T00:00:50Z | t1  | 36.672325976230894 |

| _time                | tag |            _value |
| :------------------- | :-- | ----------------: |
| 2021-01-01T00:00:30Z | t2  | 70.27027027027026 |
| 2021-01-01T00:00:40Z | t2  | 59.42857142857142 |
| 2021-01-01T00:00:50Z | t2  |            40.625 |
{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
{{< /expand-wrapper >}}
