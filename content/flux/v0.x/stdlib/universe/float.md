---
title: float() function
description: The `float()` function converts a single value to a float.
aliases:
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/type-conversions/float/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/type-conversions/float/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/type-conversions/float/
menu:
  flux_0_x_ref:
    name: float
    parent: universe
weight: 102
flux/v0.x/tags: [type-conversions]
related:
  - /flux/v0.x/data-types/basic/float/
  - /flux/v0.x/stdlib/universe/tofloat/
introduced: 0.7.0
---

The `float()` function converts a single value to a float.

_**Output data type:** Float_

```js
float(v: "3.14")
```

## Parameters

### v {data-type="string, bool, int, uint"}
The value to convert.

## Examples

- [Convert a string to a float value](#convert-a-string-to-a-float-value)
- [Convert a scientific notation string to a float value](#convert-a-scientific-notation-string-to-a-float-value)
- [Convert an integer to a float value](#convert-an-integer-to-a-float-value)
- [Convert all values in a column to float values](#convert-all-values-in-a-column-to-float-values)

#### Convert a string to a float value
```js
float(v: "3.14")

// Returns 3.14 (float)
```

#### Convert a scientific notation string to a float value
```js
float(v: "1.23e+20")

// Returns 1.23e+20 (float)
```

#### Convert an integer to a float value
```js
float(v: "10")

// Returns 10.0
```

#### Convert all values in a column to float values
If updating values in the `_value` column, use [`toFloat()`](/flux/v0.x/stdlib/universe/tofloat/).
To update values in columns other than `_value`:

1. Use [`map()`](/flux/v0.x/stdlib/universe/map/) to iterate over and update all input rows.
2. Use `float()` to update the value of a column.

_The following example uses data provided by the [`sampledata` package](/flux/v0.x/stdlib/sampledata/)._

```js
import "sampledata"

data = sampledata.int()
  |> rename(columns: {_value: "foo"})

data
  |> map(fn:(r) => ({ r with foo: float(v: r.foo) }))
```

{{% expand "View input and output" %}}
{{< flex >}}
{{% flex-content %}}
##### Input data
| _time                | tag | foo |
| :------------------- | :-- | --: |
| 2021-01-01T00:00:00Z | t1  |  -2 |
| 2021-01-01T00:00:10Z | t1  |  10 |
| 2021-01-01T00:00:20Z | t1  |   7 |
| 2021-01-01T00:00:30Z | t1  |  17 |
| 2021-01-01T00:00:40Z | t1  |  15 |
| 2021-01-01T00:00:50Z | t1  |   4 |

| _time                | tag | foo |
| :------------------- | :-- | --: |
| 2021-01-01T00:00:00Z | t2  |  19 |
| 2021-01-01T00:00:10Z | t2  |   4 |
| 2021-01-01T00:00:20Z | t2  |  -3 |
| 2021-01-01T00:00:30Z | t2  |  19 |
| 2021-01-01T00:00:40Z | t2  |  13 |
| 2021-01-01T00:00:50Z | t2  |   1 |
{{% /flex-content %}}
{{% flex-content %}}
##### Output data
| _time                | tag |  foo |
| :------------------- | :-- | ---: |
| 2021-01-01T00:00:00Z | t1  | -2.0 |
| 2021-01-01T00:00:10Z | t1  | 10.0 |
| 2021-01-01T00:00:20Z | t1  |  7.0 |
| 2021-01-01T00:00:30Z | t1  | 17.0 |
| 2021-01-01T00:00:40Z | t1  | 15.0 |
| 2021-01-01T00:00:50Z | t1  |  4.0 |

| _time                | tag |  foo |
| :------------------- | :-- | ---: |
| 2021-01-01T00:00:00Z | t2  | 19.0 |
| 2021-01-01T00:00:10Z | t2  |  4.0 |
| 2021-01-01T00:00:20Z | t2  | -3.0 |
| 2021-01-01T00:00:30Z | t2  | 19.0 |
| 2021-01-01T00:00:40Z | t2  | 13.0 |
| 2021-01-01T00:00:50Z | t2  |  1.0 |
{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}