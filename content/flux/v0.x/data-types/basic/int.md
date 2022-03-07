---
title: Work with integers
list_title: Integer
description: >
  An **integer** type represents a signed 64-bit integer.
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
  - /flux/v0.x/stdlib/contrib/bonitoo-io/hex/int/
  - /flux/v0.x/stdlib/experimental/bitwise/
list_code_example: |
  ```js
  0
  2
  1254
  -1254
  ```
---

An **integer** type represents a signed 64-bit integer.

**Type name**: `int`  
**Min value**: `-9223372036854775808`  
**Max value**: `9223372036854775807`

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
- **duration**: returns the number of nanoseconds in the duration
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
When converting [floats](/flux/v0.x/data-types/basic/float/) to integers,
`int()` _truncates_ the float value at the decimal (for example `12.54` to `12`). 
You may want to round float values to the nearest whole number (`12.54` to `13`) before converting.
To do this:

1. Import the [`math` package](/flux/v0.x/stdlib/math/).
2. Use [`math.round()`](/flux/v0.x/stdlib/math/round/) to round the float value
   before converting it to an integer.

```js
import "math"

int(v: math.round(x: 12.54))
// Returns 13
```
{{% /note %}}

### Convert a hexadecimal string to an integer
To convert a hexadecimal string representation of a number to an integer:

1. Import the [`contrib/bonitoo-io/hex` package](/flux/v0.x/stdlib/contrib/bonitoo-io/hex/).
2. Use [`hex.int()`](/flux/v0.x/stdlib/contrib/bonitoo-io/hex/int/) to convert
   the hexadecimal string to an integer.

```js
import "contrib/bonitoo-io/hex"

hex.int(v: "1e240")
// Returns 123456
```

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
- [Perform bitwise operations on integers](#perform-bitwise-operations-on-integers)
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

### Perform bitwise operations on integers
Use the [`experimental/bitwise` package](/flux/v0.x/stdlib/experimental/bitwise/)
to perform bitwise operations on integers.

```js
import "experimental/bitwise"

bitwise.sand(a: 12, b: 21)
// Returns 4

bitwise.sor(a: 12, b: 21)
// Returns 29

bitwise.sxor(a: 12, b: 21)
// Returns 25

bitwise.sclear(a: 12, b: 21)
// Returns 8

bitwise.snot(a: 12)
// Returns -13

bitwise.slshift(a: 12, b: 21)
// Returns 25165824

bitwise.srshift(a: 21, b: 4)
// Returns 1
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
