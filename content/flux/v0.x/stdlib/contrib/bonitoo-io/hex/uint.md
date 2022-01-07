---
title: hex.uint() function
description: >
  `hex.uint()` converts a hexadecimal string representation of a number to an unsigned integer.
menu:
  flux_0_x_ref:
    name: hex.uint
    parent: hex
weight: 302
related:
  - /flux/v0.x/data-types/basic/uint/
flux/v0.x/tags: [type-conversions]
---

`hex.uint()` converts a hexadecimal string representation of a number to an unsigned integer.

```js
import "contrib/bonitoo-io/hex"

hex.uint(v: "4d2")

// Returns 1234
```

## Parameters

### v {data-type="string"}
Value to convert.

## Examples

- [Convert a hexadecimal string to an unsigned integer](#convert-a-hexadecimal-string-to-an-unsigned-integer)
- [Convert all hexadecimal string values in a column to unsigned integers](#convert-all-hexadecimal-string-values-in-a-column-to-unsigned-integers)

#### Convert a hexadecimal string to an unsigned integer
```js
import "contrib/bonitoo-io/hex"

hex.uint(v: "-d431")

// Returns -54321
```

#### Convert all hexadecimal string values in a column to unsigned integers

1. Use [`map()`](/flux/v0.x/stdlib/universe/map/) to iterate over and update all input rows.
2. Use `hex.uint()` to update the value of a column.

_The following example uses data provided by the [`sampledata` package](/flux/v0.x/stdlib/sampledata/)._

```js
import "sampledata"

data = sampledata.uint()
  |> map(fn: (r) => ({ r with _value: hex.string(v: r._value) }))

data
  |> map(fn:(r) => ({ r with _value: hex.uint(v: r._value) }))
```

{{< expand-wrapper >}}
{{% expand "View input and output" %}}
{{< flex >}}
{{% flex-content %}}
##### Input data
| _time                | tag | _value _<span style="opacity:.5;">(string)</span>_ |
| :------------------- | :-- | -------------------------------------------------: |
| 2021-01-01T00:00:00Z | t1  |                                   fffffffffffffffe |
| 2021-01-01T00:00:10Z | t1  |                                                  a |
| 2021-01-01T00:00:20Z | t1  |                                                  7 |
| 2021-01-01T00:00:30Z | t1  |                                                 11 |
| 2021-01-01T00:00:40Z | t1  |                                                  f |
| 2021-01-01T00:00:50Z | t1  |                                                  4 |

| _time                | tag | _value _<span style="opacity:.5;">(string)</span>_ |
| :------------------- | :-- | -------------------------------------------------: |
| 2021-01-01T00:00:00Z | t2  |                                                 13 |
| 2021-01-01T00:00:10Z | t2  |                                                  4 |
| 2021-01-01T00:00:20Z | t2  |                                   fffffffffffffffd |
| 2021-01-01T00:00:30Z | t2  |                                                 13 |
| 2021-01-01T00:00:40Z | t2  |                                                  d |
| 2021-01-01T00:00:50Z | t2  |                                                  1 |

{{% /flex-content %}}
{{% flex-content %}}
##### Output data
| tag | _time                | _value _<span style="opacity:.5;">(uint)</span>_ |
| :-- | :------------------- | -----------------------------------------------: |
| t1  | 2021-01-01T00:00:00Z |                             18446744073709551614 |
| t1  | 2021-01-01T00:00:10Z |                                               10 |
| t1  | 2021-01-01T00:00:20Z |                                                7 |
| t1  | 2021-01-01T00:00:30Z |                                               17 |
| t1  | 2021-01-01T00:00:40Z |                                               15 |
| t1  | 2021-01-01T00:00:50Z |                                                4 |

| tag | _time                | _value _<span style="opacity:.5;">(uint)</span>_ |
| :-- | :------------------- | -----------------------------------------------: |
| t2  | 2021-01-01T00:00:00Z |                                               19 |
| t2  | 2021-01-01T00:00:10Z |                                                4 |
| t2  | 2021-01-01T00:00:20Z |                             18446744073709551613 |
| t2  | 2021-01-01T00:00:30Z |                                               19 |
| t2  | 2021-01-01T00:00:40Z |                                               13 |
| t2  | 2021-01-01T00:00:50Z |                                                1 |

{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
{{< /expand-wrapper >}}


