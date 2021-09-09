---
title: int() function
description: The `int()` function converts a single value to an integer.
aliases:
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/type-conversions/int/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/type-conversions/int/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/type-conversions/int/
menu:
  flux_0_x_ref:
    name: int
    parent: universe
weight: 102
flux/v0.x/tags: [type-conversions]
related:
  - /flux/v0.x/data-types/basic/integer/
  - /flux/v0.x/stdlib/universe/toint/
introduced: 0.7.0
---

The `int()` function converts a single value to an integer.

_**Output data type:** Integer_

```js
int(v: "4")
```

## Parameters

### v {data-type="string, bool, uint, float, time, duration"}
Value to convert.

`int()` behavior depends on the input data type:

| Input type | Returned value                                  |
| :--------- | :---------------------------------------------- |
| string     | Integer equivalent of the numeric string        |
| bool       | 1 (true) or 0 (false)                           |
| duration   | Number of nanoseconds in the specified duration |
| time       | Equivalent nanosecond epoch timestamp           |
| float      | Value truncated at the decimal                  |
| uint       | Integer equivalent of the unsigned integer      |

## Examples

- [Convert a string to an integer value](#convert-a-string-to-an-integer-value)
- [Convert a boolean to an integer value](#convert-a-boolean-to-an-integer-value)
- [Convert a duration to an integer value](#convert-a-duration-to-an-integer-value)
- [Convert a time to an integer value](#convert-a-time-to-an-integer-value)
- [Convert a float to an integer value](#convert-a-float-to-an-integer-value)
- [Convert all values in a column to integer values](#convert-all-values-in-a-column-to-integer-values)

#### Convert a string to an integer value
```js
int(v: "3")

// Returns 3 (int)
```

#### Convert a boolean to an integer value
```js
int(v: true)

// Returns 1
```

#### Convert a duration to an integer value
```js
int(v: 1m)

// Returns 160000000000
```

#### Convert a time to an integer value
```js
int(v: 2021-01-01T00:00:00Z)

// Returns 1609459200000000000
```

#### Convert a float to an integer value
```js
int(v: 10.12)

// Returns 10
```

#### Convert all values in a column to integer values
If updating values in the `_value` column, use [`toInt()`](/flux/v0.x/stdlib/universe/toint/).
To update values in columns other than `_value`:

1. Use [`map()`](/flux/v0.x/stdlib/universe/map/) to iterate over and update all input rows.
2. Use `int()` to update the value of a column.

_The following example uses data provided by the [`sampledata` package](/flux/v0.x/stdlib/sampledata/)._

```js
import "sampledata"

data = sampledata.float()
  |> rename(columns: {_value: "foo"})

data
  |> map(fn:(r) => ({ r with foo: int(v: r.foo) }))
```

{{% expand "View input and output" %}}
{{< flex >}}
{{% flex-content %}}
##### Input data
| tag | _time                |   foo |
| :-- | :------------------- | ----: |
| t1  | 2021-01-01T00:00:00Z | -2.18 |
| t1  | 2021-01-01T00:00:10Z | 10.92 |
| t1  | 2021-01-01T00:00:20Z |  7.35 |
| t1  | 2021-01-01T00:00:30Z | 17.53 |
| t1  | 2021-01-01T00:00:40Z | 15.23 |
| t1  | 2021-01-01T00:00:50Z |  4.43 |

| tag | _time                |   foo |
| :-- | :------------------- | ----: |
| t2  | 2021-01-01T00:00:00Z | 19.85 |
| t2  | 2021-01-01T00:00:10Z |  4.97 |
| t2  | 2021-01-01T00:00:20Z | -3.75 |
| t2  | 2021-01-01T00:00:30Z | 19.77 |
| t2  | 2021-01-01T00:00:40Z | 13.86 |
| t2  | 2021-01-01T00:00:50Z |  1.86 |

{{% /flex-content %}}
{{% flex-content %}}
##### Output data
| _time                | tag |  foo |
| :------------------- | :-- | ---: |
| 2021-01-01T00:00:00Z | t1  | -2 |
| 2021-01-01T00:00:10Z | t1  | 10 |
| 2021-01-01T00:00:20Z | t1  |  7 |
| 2021-01-01T00:00:30Z | t1  | 17 |
| 2021-01-01T00:00:40Z | t1  | 15 |
| 2021-01-01T00:00:50Z | t1  |  4 |

| _time                | tag |  foo |
| :------------------- | :-- | ---: |
| 2021-01-01T00:00:00Z | t2  | 19 |
| 2021-01-01T00:00:10Z | t2  |  4 |
| 2021-01-01T00:00:20Z | t2  | -3 |
| 2021-01-01T00:00:30Z | t2  | 19 |
| 2021-01-01T00:00:40Z | t2  | 13 |
| 2021-01-01T00:00:50Z | t2  |  1 |
{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
