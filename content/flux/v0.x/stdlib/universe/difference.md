---
title: difference() function
description: The `difference()` function computes the difference between subsequent non-null records.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/aggregates/difference
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/aggregates/difference/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/difference/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/difference/
menu:
  flux_0_x_ref:
    name: difference
    parent: universe
weight: 102
flux/v0.x/tags: [transformations]
related:
  - /{{< latest "influxdb" "v1" >}}/query_language/functions/#difference, InfluxQL – DIFFERENCE()
introduced: 0.7.1
---

The `difference()` function computes the difference between subsequent records.  
The user-specified columns of numeric type are subtracted while others are kept intact.

_**Output data type:** Float_

```js
difference(
  nonNegative: false,
  columns: ["_value"],
  keepFirst: false
)
```

## Parameters

### nonNegative {data-type="bool"}
Indicates if the difference is allowed to be negative.
When set to `true`, if a value is less than the previous value, it is assumed the previous value should have been a zero.
Default is `false`.

### columns {data-type="array of strings"}
The columns to use to compute the difference.
Default is `["_value"]`.

### keepFirst {data-type="bool"}
Indicates the first row should be kept.
If `true`, the difference will be `null`.
Default is `false`.

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

## Subtraction rules for numeric types
- The difference between two non-null values is their algebraic difference;
  or `null`, if the result is negative and `nonNegative: true`;
- `null` minus some value is always `null`;
- Some value `v` minus `null` is `v` minus the last non-null value seen before `v`;
  or `null` if `v` is the first non-null value seen.

## Output tables
For each input table with `n` rows, `difference()` outputs a table with `n - 1` rows.

## Examples
{{% flux/sample-example-intro plural=true %}}

- [Calculate the difference between subsequent values](#calculate-the-difference-between-subsequent-values)
- [Calculate the non-negative difference between subsequent values](#calculate-the-non-negative-difference-between-subsequent-values)
- [Calculate the difference between subsequent values with null values](#calculate-the-difference-between-subsequent-values-with-null-values)
- [Keep the first value when calculating the difference between values](#keep-the-first-value-when-calculating-the-difference-between-values)

#### Calculate the difference between subsequent values

```js
import "sample"

data = sample.int()

data
  |> difference()
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
| 2021-01-01T00:00:10Z | t1  |     12 |
| 2021-01-01T00:00:20Z | t1  |     -3 |
| 2021-01-01T00:00:30Z | t1  |     10 |
| 2021-01-01T00:00:40Z | t1  |     -2 |
| 2021-01-01T00:00:50Z | t1  |    -11 |

| _time                | tag | _value |
| :------------------- | :-- | -----: |
| 2021-01-01T00:00:10Z | t2  |   -15 |
| 2021-01-01T00:00:20Z | t2  |    -7 |
| 2021-01-01T00:00:30Z | t2  |    22 |
| 2021-01-01T00:00:40Z | t2  |    -6 |
| 2021-01-01T00:00:50Z | t2  |   -12 |

{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
{{< /expand-wrapper >}}

#### Calculate the non-negative difference between subsequent values
```js
import "sampledata"

data = sampledata.int()

data
  |> difference(nonNegative: true):
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
| 2021-01-01T00:00:10Z | t1  |     12 |
| 2021-01-01T00:00:20Z | t1  |        |
| 2021-01-01T00:00:30Z | t1  |     10 |
| 2021-01-01T00:00:40Z | t1  |        |
| 2021-01-01T00:00:50Z | t1  |        |

| _time                | tag | _value |
| :------------------- | :-- | -----: |
| 2021-01-01T00:00:10Z | t2  |        |
| 2021-01-01T00:00:20Z | t2  |        |
| 2021-01-01T00:00:30Z | t2  |     22 |
| 2021-01-01T00:00:40Z | t2  |        |
| 2021-01-01T00:00:50Z | t2  |        |

{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
{{< /expand-wrapper >}}


#### Calculate the difference between subsequent values with null values
```js
import "sampledata"

data = sampledata.int(includeNull: true)

data
  |> difference()
```

{{< expand-wrapper >}}
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
| 2021-01-01T00:00:20Z | t1  |      9 |
| 2021-01-01T00:00:30Z | t1  |        |
| 2021-01-01T00:00:40Z | t1  |        |
| 2021-01-01T00:00:50Z | t1  |     -3 |

| _time                | tag | _value |
| :------------------- | :-- | -----: |
| 2021-01-01T00:00:10Z | t2  |        |
| 2021-01-01T00:00:20Z | t2  |     -7 |
| 2021-01-01T00:00:30Z | t2  |     22 |
| 2021-01-01T00:00:40Z | t2  |        |
| 2021-01-01T00:00:50Z | t2  |    -18 |

{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
{{< /expand-wrapper >}}

#### Keep the first value when calculating the difference between values
```js
import "sampledata"

sampledata.int()
  |> difference(keepFirst: true)
```

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
| 2021-01-01T00:00:00Z | t1  |        |
| 2021-01-01T00:00:10Z | t1  |     12 |
| 2021-01-01T00:00:20Z | t1  |     -3 |
| 2021-01-01T00:00:30Z | t1  |     10 |
| 2021-01-01T00:00:40Z | t1  |     -2 |
| 2021-01-01T00:00:50Z | t1  |    -11 |

| _time                | tag | _value |
| :------------------- | :-- | -----: |
| 2021-01-01T00:00:00Z | tw  |        |
| 2021-01-01T00:00:10Z | t2  |    -15 |
| 2021-01-01T00:00:20Z | t2  |     -7 |
| 2021-01-01T00:00:30Z | t2  |     22 |
| 2021-01-01T00:00:40Z | t2  |     -6 |
| 2021-01-01T00:00:50Z | t2  |    -12 |

{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}

