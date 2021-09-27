---
title: hex.string() function
description: >
  `hex.string()` converts a [Flux basic type](/flux/v0.x/data-types/basic/) to a hexadecimal string.
menu:
  flux_0_x_ref:
    name: hex.string
    parent: hex
weight: 302
related:
  - /flux/v0.x/stdlib/universe/string/
flux/v0.x/tags: [type-conversions]
---

`hex.string()` converts a [Flux basic type](/flux/v0.x/data-types/basic/) to a hexadecimal string.
The function is similar to [string()](/flux/v0.x/stdlib/universe/string/),
but encodes **int, uint, and bytes types** to hexadecimal lowercase characters.

```js
import "contrib/bonitoo-io/hex"

hex.string(v: 1234)

// Returns 4d2
```

## Parameters

### v {data-type="bool, int, uint, float, duration, time, bytes"}
Value to convert.

## Examples

- [Convert a boolean to a hexadecimal string value](#convert-a-boolean-to-a-hexadecimal-string-value)
- [Convert a duration to a hexadecimal string value](#convert-a-duration-to-a-hexadecimal-string-value)
- [Convert a time to a hexadecimal string value](#convert-a-time-to-a-hexadecimal-string-value)
- [Convert an integer to a hexadecimal string value](#convert-an-integer-to-a-hexadecimal-string-value)
- [Convert a uinteger to a hexadecimal string value](#convert-a-uinteger-to-a-hexadecimal-string-value)
- [Convert a float to a hexadecimal string value](#convert-a-float-to-a-hexadecimal-string-value)
- [Convert bytes to a hexadecimal string value](#convert-bytes-to-a-hexadecimal-string-value)
- [Convert all values in a column to hexadecimal string values](#convert-all-values-in-a-column-to-hexadecimal-string-values)

#### Convert a boolean to a hexadecimal string value
```js
import "contrib/bonitoo-io/hex"

hex.string(v: true)

// Returns "true"
```

#### Convert a duration to a hexadecimal string value
```js
import "contrib/bonitoo-io/hex"

hex.string(v: 1m)

// Returns "1m"
```

#### Convert a time to a hexadecimal string value
```js
import "contrib/bonitoo-io/hex"

hex.string(v: 2021-01-01T00:00:00Z)

// Returns "2021-01-01T00:00:00Z"
```

#### Convert an integer to a hexadecimal string value
```js
import "contrib/bonitoo-io/hex"

hex.string(v: 1234)

// Returns "4d2"
```

#### Convert a uinteger to a hexadecimal string value
```js
import "contrib/bonitoo-io/hex"

hex.string(v: uint(v: 5678))

// Returns "162e"
```

#### Convert a float to a hexadecimal string value
```js
import "contrib/bonitoo-io/hex"

hex.string(v: 10.12)

// Returns "10.12"
```

#### Convert bytes to a hexadecimal string value
```js
import "contrib/bonitoo-io/hex"

hex.string(v: bytes(v: "Hello world!"))

// Returns "48656c6c6f20776f726c6421"
```

#### Convert all values in a column to hexadecimal string values

1. Use [`map()`](/flux/v0.x/stdlib/universe/map/) to iterate over and update all input rows.
2. Use `hex.string()` to update the value of a column.

_The following example uses data provided by the [`sampledata` package](/flux/v0.x/stdlib/sampledata/)._

```js
import "sampledata"
import "contrib/bonitoo-io/hex"

data = sampledata.int()
  |> map(fn: (r) => ({ r with _value: r._value * 1000 }))

data
  |> map(fn:(r) => ({ r with _value: hex.string(v: r.foo) }))
```

{{< expand-wrapper >}}
{{% expand "View input and output" %}}
{{< flex >}}
{{% flex-content %}}
##### Input data
| tag | _time                | _value _<span style="opacity:.5;">(int)</span>_ |
| :-- | :------------------- | -------------------------------------------: |
| t1  | 2021-01-01T00:00:00Z |                                        -2000 |
| t1  | 2021-01-01T00:00:10Z |                                        10000 |
| t1  | 2021-01-01T00:00:20Z |                                         7000 |
| t1  | 2021-01-01T00:00:30Z |                                        17000 |
| t1  | 2021-01-01T00:00:40Z |                                        15000 |
| t1  | 2021-01-01T00:00:50Z |                                         4000 |

| tag | _time                | _value _<span style="opacity:.5;">(int)</span>_ |
| :-- | :------------------- | -------------------------------------------: |
| t2  | 2021-01-01T00:00:00Z |                                        19000 |
| t2  | 2021-01-01T00:00:10Z |                                         4000 |
| t2  | 2021-01-01T00:00:20Z |                                        -3000 |
| t2  | 2021-01-01T00:00:30Z |                                        19000 |
| t2  | 2021-01-01T00:00:40Z |                                        13000 |
| t2  | 2021-01-01T00:00:50Z |                                         1000 |

{{% /flex-content %}}
{{% flex-content %}}
##### Output data
| _time                | tag | _value _<span style="opacity:.5;">(string)</span>_ |
| :------------------- | :-- | ----------------------------------------------: |
| 2021-01-01T00:00:00Z | t1  |                                            -7d0 |
| 2021-01-01T00:00:10Z | t1  |                                            2710 |
| 2021-01-01T00:00:20Z | t1  |                                            1b58 |
| 2021-01-01T00:00:30Z | t1  |                                            4268 |
| 2021-01-01T00:00:40Z | t1  |                                            3a98 |
| 2021-01-01T00:00:50Z | t1  |                                             fa0 |

| _time                | tag | _value _<span style="opacity:.5;">(string)</span>_ |
| :------------------- | :-- | ----------------------------------------------: |
| 2021-01-01T00:00:00Z | t2  |                                            4a38 |
| 2021-01-01T00:00:10Z | t2  |                                             fa0 |
| 2021-01-01T00:00:20Z | t2  |                                            -bb8 |
| 2021-01-01T00:00:30Z | t2  |                                            4a38 |
| 2021-01-01T00:00:40Z | t2  |                                            32c8 |
| 2021-01-01T00:00:50Z | t2  |                                             3e8 |
{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
{{< /expand-wrapper >}}
