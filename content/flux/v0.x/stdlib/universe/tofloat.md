---
title: toFloat() function
description: The `toFloat()` function converts all values in the `_value` column to floats.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/type-conversions/tofloat
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/type-conversions/tofloat/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/type-conversions/tofloat/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/type-conversions/tofloat/
menu:
  flux_0_x_ref:
    name: toFloat
    parent: universe
weight: 102
flux/v0.x/tags: [type-conversions, transformations]
related:
  - /flux/v0.x/data-types/basic/float/
  - /flux/v0.x/stdlib/universe/float/
introduced: 0.7.0
---

The `toFloat()` function converts all values in the `_value` column to floats.

```js
toFloat()
```

{{% note %}}
To convert values in a column other than `_value`, define a custom function
patterned after the [function definition](#function-definition),
but replace `_value` with your desired column.
{{% /note %}}

##### Supported data types

- string (numeric, [scientific notation](/flux/v0.x/data-types/basic/float/#scientific-notation),
  [infinity](/flux/v0.x/data-types/basic/float/#infinity), or [NaN](/flux/v0.x/data-types/basic/float/#not-a-number))
- boolean
- int
- uint

## Parameters

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

## Examples
{{% flux/sample-example-intro plural=true %}}

- [Convert an integer value column to a float column](#convert-an-integer-value-column-to-a-float-column)
- [Convert a boolean value column to a float column](#convert-a-boolean-value-column-to-a-float-column)

#### Convert an integer value column to a float column
```js
import "sampledata"

sampledata.int()
  |> toFloat()
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
| _time                | tag | _value |
| :------------------- | :-- | -----: |
| 2021-01-01T00:00:00Z | t1  |   -2.0 |
| 2021-01-01T00:00:10Z | t1  |   10.0 |
| 2021-01-01T00:00:20Z | t1  |    7.0 |
| 2021-01-01T00:00:30Z | t1  |   17.0 |
| 2021-01-01T00:00:40Z | t1  |   15.0 |
| 2021-01-01T00:00:50Z | t1  |    4.0 |

| _time                | tag | _value |
| :------------------- | :-- | -----: |
| 2021-01-01T00:00:00Z | t2  |   19.0 |
| 2021-01-01T00:00:10Z | t2  |    4.0 |
| 2021-01-01T00:00:20Z | t2  |   -3.0 |
| 2021-01-01T00:00:30Z | t2  |   19.0 |
| 2021-01-01T00:00:40Z | t2  |   13.0 |
| 2021-01-01T00:00:50Z | t2  |    1.0 |
{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
{{< /expand-wrapper >}}

#### Convert a boolean value column to a float column
```js
import "sampledata"

sampledata.bool()
  |> toFloat()
```

{{< expand-wrapper >}}
{{% expand "View input and output" %}}
{{< flex >}}
{{% flex-content %}}

##### Input data
{{% flux/sample "bool" %}}

{{% /flex-content %}}
{{% flex-content %}}

##### Output data
| _time                | tag | _value |
| :------------------- | :-- | -----: |
| 2021-01-01T00:00:00Z | t1  |    1.0 |
| 2021-01-01T00:00:10Z | t1  |    1.0 |
| 2021-01-01T00:00:20Z | t1  |    0.0 |
| 2021-01-01T00:00:30Z | t1  |    1.0 |
| 2021-01-01T00:00:40Z | t1  |    0.0 |
| 2021-01-01T00:00:50Z | t1  |    0.0 |

| _time                | tag | _value |
| :------------------- | :-- | -----: |
| 2021-01-01T00:00:00Z | t2  |    0.0 |
| 2021-01-01T00:00:10Z | t2  |    1.0 |
| 2021-01-01T00:00:20Z | t2  |    0.0 |
| 2021-01-01T00:00:30Z | t2  |    1.0 |
| 2021-01-01T00:00:40Z | t2  |    1.0 |
| 2021-01-01T00:00:50Z | t2  |    0.0 |
{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
{{< /expand-wrapper >}}

## Function definition
```js
toFloat = (tables=<-) =>
  tables
    |> map(fn:(r) => ({ r with _value: float(v: r._value) }))
```
