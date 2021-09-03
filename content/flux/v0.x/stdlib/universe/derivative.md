---
title: derivative() function
description: The `derivative()` function computes the rate of change per unit of time between subsequent non-null records.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/aggregates/derivative
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/aggregates/derivative/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/derivative/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/derivative/
menu:
  flux_0_x_ref:
    name: derivative
    parent: universe
weight: 102
flux/v0.x/tags: [transformations]
related:
  - /{{< latest "influxdb" >}}/query-data/flux/rate/
  - /{{< latest "influxdb" "v1" >}}/query_language/functions/#derivative, InfluxQL – DERIVATIVE()
introduced: 0.7.0
---

The `derivative()` function computes the rate of change per [`unit`](#unit) of time between subsequent non-null records.
It assumes rows are ordered by the `_time` column.
The output table schema is the same as the input table.
 
_**Output data type:** Float_

```js
derivative(
  unit: 1s,
  nonNegative: true,
  columns: ["_value"],
  timeColumn: "_time"
)
```

## Parameters

### unit {data-type="duration"}
The time duration used when creating the derivative.
Default is `1s`.

### nonNegative {data-type="bool"}
Indicates if the derivative is allowed to be negative. Default is `true`.
When `true`, if a value is less than the previous value, it is assumed the
previous value should have been a zero.

### columns {data-type="string"}
The columns to use to compute the derivative.
Default is `["_value"]`.

### timeColumn {data-type="string"}
The column containing time values.
Default is `"_time"`.

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

## Output tables
For each input table with `n` rows, `derivative()` outputs a table with `n - 1` rows.

## Examples
{{% flux/sample-example-intro plural=true %}}

- [Calculate the rate of change per second](#calculate-the-rate-of-change-per-second)
- [Calculate the non-negative rate of change per second](#calculate-the-non-negative-rate-of-change-per-second)
- [Calculate the rate of change per second with null values](#calculate-the-rate-of-change-per-second-with-null-values)

#### Calculate the rate of change per second
```js
import "sampledata"

sampledata.int()
  |> derivative()
```

{{< expand-wrapper >}}
{{% expand "View input and output" %}}
{{< flex >}}
{{% flex-content %}}

##### Input data
{{% flux/sample set="int" %}}

{{% /flex-content %}}
{{% flex-content %}}

##### Output data
| _time                | tag | _value |
| :------------------- | :-- | -----: |
| 2021-01-01T00:00:10Z | t1  |    1.2 |
| 2021-01-01T00:00:20Z | t1  |   -0.3 |
| 2021-01-01T00:00:30Z | t1  |      1 |
| 2021-01-01T00:00:40Z | t1  |   -0.2 |
| 2021-01-01T00:00:50Z | t1  |   -1.1 |

| _time                | tag | _value |
| :------------------- | :-- | -----: |
| 2021-01-01T00:00:10Z | t2  |   -1.5 |
| 2021-01-01T00:00:20Z | t2  |   -0.7 |
| 2021-01-01T00:00:30Z | t2  |    2.2 |
| 2021-01-01T00:00:40Z | t2  |   -0.6 |
| 2021-01-01T00:00:50Z | t2  |   -1.2 |

{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
{{< /expand-wrapper >}}

#### Calculate the non-negative rate of change per second
```js
import "sampledata"

sampledata.int()
  |> derivative(nonNegative: true)
```

{{< expand-wrapper >}}
{{% expand "View input and output" %}}
{{< flex >}}
{{% flex-content %}}

##### Input data
{{% flux/sample set="int" %}}

{{% /flex-content %}}
{{% flex-content %}}

##### Output data
| _time                | tag | _value |
| :------------------- | :-- | -----: |
| 2021-01-01T00:00:10Z | t1  |    1.2 |
| 2021-01-01T00:00:20Z | t1  |        |
| 2021-01-01T00:00:30Z | t1  |      1 |
| 2021-01-01T00:00:40Z | t1  |        |
| 2021-01-01T00:00:50Z | t1  |        |

| _time                | tag | _value |
| :------------------- | :-- | -----: |
| 2021-01-01T00:00:10Z | t2  |        |
| 2021-01-01T00:00:20Z | t2  |        |
| 2021-01-01T00:00:30Z | t2  |    2.2 |
| 2021-01-01T00:00:40Z | t2  |        |
| 2021-01-01T00:00:50Z | t2  |        |

{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
{{< /expand-wrapper >}}

#### Calculate the rate of change per second with null values
```js
import "sampledata"

sampledata.int(includeNull: true)
  |> derivative()
```
{{% expand "View input and output" %}}
{{< flex >}}
{{% flex-content %}}

##### Input data
{{% flux/sample "int" true %}}

{{% /flex-content %}}
{{% flex-content %}}

##### Output data
| _time                | tag | _value |
| :------------------- | :-- | -----: |
| 2021-01-01T00:00:10Z | t1  |        |
| 2021-01-01T00:00:20Z | t1  |   0.45 |
| 2021-01-01T00:00:30Z | t1  |        |
| 2021-01-01T00:00:40Z | t1  |        |
| 2021-01-01T00:00:50Z | t1  |   -0.1 |

| _time                | tag | _value |
| :------------------- | :-- | -----: |
| 2021-01-01T00:00:10Z | t2  |        |
| 2021-01-01T00:00:20Z | t2  |   -0.7 |
| 2021-01-01T00:00:30Z | t2  |    2.2 |
| 2021-01-01T00:00:40Z | t2  |        |
| 2021-01-01T00:00:50Z | t2  |   -0.9 |

{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
