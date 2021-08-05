---
title: Work with integers
list_title: Integer
description: >
  Learn how to work with integer types in Flux.
menu:
  flux_0_x:
    name: Integer
    parent: Basic types
weight: 202
flux/v0.x/tags: ["basic types", "numeric types", "data types"]
related:
  - /flux/v0.x/stdlib/universe/int/
  - /flux/v0.x/stdlib/universe/toint/
---

An **integer** type represents a signed 64-bit integer.

**Type name**: `int`  
**Min value**: `-9223372036854775808`  
**Max value**: `9223372036854775807`

###### On this page:
- [Integer syntax](#integer-syntax)
- [Convert data types to integers](#convert-data-types-to-integers)
- [Operate on integers](#operate-on-integers)

## Integer syntax
An integer literal contains one or more digits (0-9) optionally preceded by
`-` to indicate a negative number.
`-0` is equivalent to `0` and is not a negative number.

```js
0
2
1254
-1254
```

## Convert data types to integers
Use the [`int()` function](/flux/v0.x/stdlib/universe/int/) to convert
the following [basic types](/flux/v0.x/data-types/basic/) to integers:

- **string**: returns the integer equivalent of the numeric string (`[0-9]`)
- **bool**: returns `1` for `true` or `0` for `false`
- **duration**: returns to the number of nanoseconds in the duration
- **time**: returns the equivalent [nanosecond epoch timestamp](/influxdb/cloud/reference/glossary/#unix-timestamp)
- **float**: truncates the float value at the decimal
- **uint**: returns the integer equivalent of the unsigned integer

```js
int(v: "123")
// 123

int(v: true)
// Returns 1

int(v: 1d3h24m)
// Returns 98640000000000

int(v: 2021-01-01T00:00:00Z)
// Returns 1609459200000000000

int(v: 12.54)
// Returns 12
```

{{% note %}}
#### Round float values before converting to integers
When converting a [float](/flux/v0.x/data-types/basic/float/) value to an integer,
Flux _truncates_ the float value at the decimal.
To round float values to the nearest whole number:

1. Import the [`math` package](/flux/v0.x/stdlib/math/).
2. Use [`math.round()`](/flux/v0.x/stdlib/math/round/) to round the the float value
   before converting it to an integer.

```js
import "math"

int(v: math.round(x: 12.54))
// Returns 13
```
{{% /note %}}

### Convert columns to integers
Flux lets you iterate over rows in a [stream of tables](/flux/v0.x/get-started/data-model/#stream-of-tables)
and convert columns to integers.

**To convert the `_value` column to integers**, use the [`toInt()` function](/flux/v0.x/stdlib/universe/toint/).

{{% note %}}
`toInt()` only operates on the `_value` column.
{{% /note %}}

```js
data
  |> toInt()
```

{{< flex >}}
{{% flex-content %}}
##### Given the following input data:
| \_time               | \_value _<span style="opacity:.5">(float)</span>_ |
| :------------------- | ------------------------------------------------: |
| 2021-01-01T00:00:00Z |                                              1.23 |
| 2021-01-01T02:00:00Z |                                              4.56 |
| 2021-01-01T03:00:00Z |                                              7.89 |
| 2021-01-01T04:00:00Z |                                             10.11 |
{{% /flex-content %}}

{{% flex-content %}}
##### The example above returns:
| \_time               | \_value _<span style="opacity:.5">(int)</span>_ |
| :------------------- | ----------------------------------------------: |
| 2021-01-01T00:00:00Z |                                               1 |
| 2021-01-01T02:00:00Z |                                               4 |
| 2021-01-01T03:00:00Z |                                               7 |
| 2021-01-01T04:00:00Z |                                              10 |
{{% /flex-content %}}
{{< /flex >}}

**To convert any column to integers**:

1. Use [`map()`](/flux/v0.x/stdlib/universe/map/) to iterate over and rewrite rows.
2. Use [`int()`](/flux/v0.x/stdlib/universe/int/) to convert columns values to integers.

```js
data
  |> map(fn: (r) => ({ r with uid: int(v: r.uid) }))
```

{{< flex >}}
{{% flex-content %}}
##### Given the following input data:
| \_time               | index _<span style="opacity:.5">(string)</span>_ |
| :------------------- | -----------------------------------------------: |
| 2021-01-01T00:00:00Z |                                        100010024 |
| 2021-01-01T02:00:00Z |                                        100050213 |
| 2021-01-01T03:00:00Z |                                        200130763 |
| 2021-01-01T04:00:00Z |                                        101420099 |
{{% /flex-content %}}

{{% flex-content %}}
##### The example above returns:
| \_time               | index _<span style="opacity:.5">(int)</span>_ |
| :------------------- | --------------------------------------------: |
| 2021-01-01T00:00:00Z |                                     100010024 |
| 2021-01-01T02:00:00Z |                                     100050213 |
| 2021-01-01T03:00:00Z |                                     200130763 |
| 2021-01-01T04:00:00Z |                                     101420099 |
{{% /flex-content %}}
{{< /flex >}}

## Operate on integers

- [Perform arithmetic operations on integers](#perform-arithmetic-operations-on-integers)
- [Compare integers](#compare-integers)

### Perform arithmetic operations on integers
To perform operations like adding, subtracting, multiplying, or dividing integers,
use [Flux arithmetic operators](/flux/v0.x/spec/operators/#arithmetic-operators).
Operands must be the same type.
The operation returns an integer.

{{% note %}}
When operating with integer operands, fractional results are truncated at the decimal.
{{% /note %}}

```js
1 + 45
// Returns 46

1 - 45
// Returns -44

12 * 100
// Returns 1200

100 / 200
// Returns 0

10 ^ 2
// Returns 100
```

### Compare integers
Use [Flux comparison operators](/flux/v0.x/spec/operators/#comparison-operators)
to compare integers.
Operands must be the same type.
The operation returns a boolean.

```js
12345600 == 12345601
// Returns false

2 > -2
// Returns true
```
