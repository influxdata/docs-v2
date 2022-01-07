---
title: string() function
description: The `string()` function converts a single value to a string.
aliases:
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/type-conversions/string/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/type-conversions/string/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/type-conversions/string/
menu:
  flux_0_x_ref:
    name: string
    parent: universe
weight: 102
related:
  - /flux/v0.x/stdlib/universe/tostring/
flux/v0.x/tags: [type-conversions]
introduced: 0.7.0
---

The `string()` function converts a single value to a string.

_**Output data type:** String_

```js
string(v: 123456789)
```

## Parameters

### v {data-type="bool, int, uint, float, duration, time, bytes"}
Value to convert.

## Examples

- [Convert a boolean to a string value](#convert-a-boolean-to-a-string-value)
- [Convert a duration to a string value](#convert-a-duration-to-a-string-value)
- [Convert a time to a string value](#convert-a-time-to-a-string-value)
- [Convert a float to a string value](#convert-a-float-to-a-string-value)
- [Convert all values in a column to string values](#convert-all-values-in-a-column-to-string-values)

#### Convert a boolean to a string value
```js
string(v: true)

// Returns "true"
```

#### Convert a duration to a string value
```js
string(v: 1m)

// Returns "1m"
```

#### Convert a time to a string value
```js
string(v: 2021-01-01T00:00:00Z)

// Returns "2021-01-01T00:00:00Z"
```

#### Convert a float to a string value
```js
string(v: 10.12)

// Returns "10.12"
```

#### Convert all values in a column to string values
If updating values in the `_value` column, use [`toString()`](/flux/v0.x/stdlib/universe/tostring/).
To update values in columns other than `_value`:

1. Use [`map()`](/flux/v0.x/stdlib/universe/map/) to iterate over and update all input rows.
2. Use `string()` to update the value of a column.

_The following example uses data provided by the [`sampledata` package](/flux/v0.x/stdlib/sampledata/)._

```js
import "sampledata"

data = sampledata.int()
  |> rename(columns: {_value: "foo"})

data
  |> map(fn:(r) => ({ r with foo: string(v: r.foo) }))
```

{{% expand "View input and output" %}}
{{< flex >}}
{{% flex-content %}}
##### Input data
| tag | _time                | foo _<span style="opacity:.5;">(int)</span>_ |
| :-- | :------------------- | -------------------------------------------: |
| t1  | 2021-01-01T00:00:00Z |                                           -2 |
| t1  | 2021-01-01T00:00:10Z |                                           10 |
| t1  | 2021-01-01T00:00:20Z |                                            7 |
| t1  | 2021-01-01T00:00:30Z |                                           17 |
| t1  | 2021-01-01T00:00:40Z |                                           15 |
| t1  | 2021-01-01T00:00:50Z |                                            4 |

| tag | _time                | foo _<span style="opacity:.5;">(int)</span>_ |
| :-- | :------------------- | -------------------------------------------: |
| t2  | 2021-01-01T00:00:00Z |                                           19 |
| t2  | 2021-01-01T00:00:10Z |                                            4 |
| t2  | 2021-01-01T00:00:20Z |                                           -3 |
| t2  | 2021-01-01T00:00:30Z |                                           19 |
| t2  | 2021-01-01T00:00:40Z |                                           13 |
| t2  | 2021-01-01T00:00:50Z |                                            1 |

{{% /flex-content %}}
{{% flex-content %}}
##### Output data
| _time                | tag | foo _<span style="opacity:.5;">(string)</span>_ |
| :------------------- | :-- | ----------------------------------------------: |
| 2021-01-01T00:00:00Z | t1  |                                              -2 |
| 2021-01-01T00:00:10Z | t1  |                                              10 |
| 2021-01-01T00:00:20Z | t1  |                                               7 |
| 2021-01-01T00:00:30Z | t1  |                                              17 |
| 2021-01-01T00:00:40Z | t1  |                                              15 |
| 2021-01-01T00:00:50Z | t1  |                                               4 |

| _time                | tag | foo _<span style="opacity:.5;">(string)</span>_ |
| :------------------- | :-- | ----------------------------------------------: |
| 2021-01-01T00:00:00Z | t2  |                                              19 |
| 2021-01-01T00:00:10Z | t2  |                                               4 |
| 2021-01-01T00:00:20Z | t2  |                                              -3 |
| 2021-01-01T00:00:30Z | t2  |                                              19 |
| 2021-01-01T00:00:40Z | t2  |                                              13 |
| 2021-01-01T00:00:50Z | t2  |                                               1 |
{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
