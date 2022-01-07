---
title: hex.int() function
description: >
  `hex.int()` converts a hexadecimal string representation of a number to an integer.
menu:
  flux_0_x_ref:
    name: hex.int
    parent: hex
weight: 302
related:
  - /flux/v0.x/data-types/basic/int/
flux/v0.x/tags: [type-conversions]
---

`hex.int()` converts a hexadecimal string representation of a number to an integer.

```js
import "contrib/bonitoo-io/hex"

hex.int(v: "4d2")

// Returns 1234
```

## Parameters

### v {data-type="string"}
Value to convert.

## Examples

- [Convert a hexadecimal string to an integer](#convert-a-hexadecimal-string-to-an-integer)
- [Convert all hexadecimal string values in a column to integers](#convert-all-hexadecimal-string-values-in-a-column-to-integers)

#### Convert a hexadecimal string to an integer
```js
import "contrib/bonitoo-io/hex"

hex.int(v: "-d431")

// Returns -54321
```

#### Convert all hexadecimal string values in a column to integers

1. Use [`map()`](/flux/v0.x/stdlib/universe/map/) to iterate over and update all input rows.
2. Use `hex.int()` to update the value of a column.

_The following example uses data provided by the [`sampledata` package](/flux/v0.x/stdlib/sampledata/)._

```js
import "sampledata"

data = sampledata.int()
  |> map(fn: (r) => ({ r with _value: hex.string(v: r._value) }))

data
  |> map(fn:(r) => ({ r with _value: hex.int(v: r._value) }))
```

{{< expand-wrapper >}}
{{% expand "View input and output" %}}
{{< flex >}}
{{% flex-content %}}
##### Input data
| _time                | tag | _value _<span style="opacity:.5;">(string)</span>_ |
| :------------------- | :-- | -------------------------------------------------: |
| 2021-01-01T00:00:00Z | t1  |                                                 -2 |
| 2021-01-01T00:00:10Z | t1  |                                                  a |
| 2021-01-01T00:00:20Z | t1  |                                                  7 |
| 2021-01-01T00:00:30Z | t1  |                                                 11 |
| 2021-01-01T00:00:40Z | t1  |                                                  f |
| 2021-01-01T00:00:50Z | t1  |                                                  4 |

| _time                | tag | _value _<span style="opacity:.5;">(string)</span>_ |
| :------------------- | :-- | -------------------------------------------------: |
| 2021-01-01T00:00:00Z | t2  |                                                 13 |
| 2021-01-01T00:00:10Z | t2  |                                                  4 |
| 2021-01-01T00:00:20Z | t2  |                                                 -3 |
| 2021-01-01T00:00:30Z | t2  |                                                 13 |
| 2021-01-01T00:00:40Z | t2  |                                                  d |
| 2021-01-01T00:00:50Z | t2  |                                                  1 |

{{% /flex-content %}}
{{% flex-content %}}
##### Output data
| tag | _time                | _value _<span style="opacity:.5;">(int)</span>_ |
| :-- | :------------------- | ----------------------------------------------: |
| t1  | 2021-01-01T00:00:00Z |                                              -2 |
| t1  | 2021-01-01T00:00:10Z |                                              10 |
| t1  | 2021-01-01T00:00:20Z |                                               7 |
| t1  | 2021-01-01T00:00:30Z |                                              17 |
| t1  | 2021-01-01T00:00:40Z |                                              15 |
| t1  | 2021-01-01T00:00:50Z |                                               4 |

| tag | _time                | _value _<span style="opacity:.5;">(int)</span>_ |
| :-- | :------------------- | ----------------------------------------------: |
| t2  | 2021-01-01T00:00:00Z |                                              19 |
| t2  | 2021-01-01T00:00:10Z |                                               4 |
| t2  | 2021-01-01T00:00:20Z |                                              -3 |
| t2  | 2021-01-01T00:00:30Z |                                              19 |
| t2  | 2021-01-01T00:00:40Z |                                              13 |
| t2  | 2021-01-01T00:00:50Z |                                               1 |

{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
{{< /expand-wrapper >}}
