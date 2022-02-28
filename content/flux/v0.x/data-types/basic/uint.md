---
title: Work with unsigned integers
list_title: UIntegers
description: >
  An **unsigned integer** (uinteger) type represents a unsigned 64-bit integer.
  Learn how to work with unsigned integer types in Flux.
menu:
  flux_0_x:
    name: UIntegers
    parent: Basic types
weight: 202
flux/v0.x/tags: ["basic types", "numeric types", "data types"]
related:
  - /flux/v0.x/stdlib/universe/uint/
  - /flux/v0.x/stdlib/universe/touint/
  - /flux/v0.x/stdlib/contrib/bonitoo-io/hex/uint/
  - /flux/v0.x/stdlib/experimental/bitwise/
list_code_example: |
  ```js
  uint(v: 123)
  ```
---

An **unsigned integer** (uinteger) type represents a unsigned 64-bit integer.

**Type name**: `uint`  
**Min value**: `0`  
**Max value**: `18446744073709551615`

- [UInteger syntax](#uinteger-syntax)
- [Convert data types to uintegers](#convert-data-types-to-uintegers)
- [Operate on uintegers](#operate-on-uintegers)

## UInteger syntax
Flux does not provide a uinteger literal syntax.
However, you can use [`uint()`](/flux/v0.x/stdlib/universe/uint/) to [convert
basic data types into a uinteger](#convert-data-types-to-uintegers).

```js
uint(v: 123)
// Returns 123 (uint)
```

## Convert data types to uintegers
Use the [`uint()` function](/flux/v0.x/stdlib/universe/uint/) to convert
the following [basic types](/flux/v0.x/data-types/basic/) to uintegers:

- **string**: returns the uinteger equivalent of the numeric string (`[0-9]`)
- **bool**: returns `1` for `true` or `0` for `false`
- **duration**: returns the number of nanoseconds in the duration
- **time**: returns the equivalent [nanosecond epoch timestamp](/influxdb/cloud/reference/glossary/#unix-timestamp)
- **float**: truncates the float value at the decimal and returns the uinteger equivalent
- **int**: returns the uinteger equivalent of the integer

```js
uint(v: "123")
// 123

uint(v: true)
// Returns 1

uint(v: 1d3h24m)
// Returns 98640000000000

uint(v: 2021-01-01T00:00:00Z)
// Returns 1609459200000000000

uint(v: 12.54)
// Returns 12

uint(v: -54321)
// Returns 18446744073709497295
```

{{% note %}}
#### Round float values before converting to uintegers
When converting [floats](/flux/v0.x/data-types/basic/float/) to integers,
`uint()` _truncates_ the float value at the decimal (for example `12.54` to `12`). 
You may want to round float values to the nearest whole number (`12.54` to `13`) before converting.
To do this:

1. Import the [`math` package](/flux/v0.x/stdlib/math/).
2. Use [`math.round()`](/flux/v0.x/stdlib/math/round/) to round the float value
   before converting it to a uinteger.

```js
import "math"

uint(v: math.round(x: 12.54))
// Returns 13
```
{{% /note %}}

### Convert a hexadecimal string to a uinteger
To convert a hexadecimal string representation of a number to a uinteger:

1. Import the [`contrib/bonitoo-io/hex` package](/flux/v0.x/stdlib/contrib/bonitoo-io/hex/).
2. Use [`hex.uint()`](/flux/v0.x/stdlib/contrib/bonitoo-io/hex/uint/) to convert
   the hexadecimal string to a uinteger.

```js
import "contrib/bonitoo-io/hex"

hex.uint(v: "-1e240")
// Returns 123456
```

### Convert columns to uintegers
Flux lets you iterate over rows in a [stream of tables](/flux/v0.x/get-started/data-model/#stream-of-tables)
and convert columns to uintegers.

**To convert the `_value` column to uintegers**, use the [`toUInt()` function](/flux/v0.x/stdlib/universe/touint/).

{{% note %}}
`toUInt()` only operates on the `_value` column.
{{% /note %}}

```js
data
    |> toUInt()
```

{{< flex >}}
{{% flex-content %}}
##### Given the following input data:
| \_time               | \_value _<span style="opacity:.5">(float)</span>_ |
| :------------------- | ------------------------------------------------: |
| 2021-01-01T00:00:00Z |                                              1.23 |
| 2021-01-01T02:00:00Z |                                              4.56 |
| 2021-01-01T03:00:00Z |                                             -7.89 |
| 2021-01-01T04:00:00Z |                                             10.11 |
{{% /flex-content %}}

{{% flex-content %}}
##### The example above returns:
| \_time               | \_value _<span style="opacity:.5">(uint)</span>_ |
| :------------------- | -----------------------------------------------: |
| 2021-01-01T00:00:00Z |                                                1 |
| 2021-01-01T02:00:00Z |                                                4 |
| 2021-01-01T03:00:00Z |                             18446744073709551609 |
| 2021-01-01T04:00:00Z |                                               10 |
{{% /flex-content %}}
{{< /flex >}}

**To convert any column to uintegers**:

1. Use [`map()`](/flux/v0.x/stdlib/universe/map/) to iterate over and rewrite rows.
2. Use [`uint()`](/flux/v0.x/stdlib/universe/uint/) to convert columns values to uintegers.

```js
data
    |> map(fn: (r) => ({ r with uid: uint(v: r.uid) }))
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
| \_time               | index _<span style="opacity:.5">(uint)</span>_ |
| :------------------- | ---------------------------------------------: |
| 2021-01-01T00:00:00Z |                                      100010024 |
| 2021-01-01T02:00:00Z |                                      100050213 |
| 2021-01-01T03:00:00Z |                                      200130763 |
| 2021-01-01T04:00:00Z |                                      101420099 |
{{% /flex-content %}}
{{< /flex >}}

## Operate on uintegers

- [Perform arithmetic operations on uintegers](#perform-arithmetic-operations-on-uintegers)
- [Perform bitwise operations on uintegers](#perform-bitwise-operations-on-uintegers)
- [Compare uintegers](#compare-uintegers)

### Perform arithmetic operations on uintegers
To perform operations like adding, subtracting, multiplying, or dividing uintegers,
use [Flux arithmetic operators](/flux/v0.x/spec/operators/#arithmetic-operators).
Operands must be the same type.
The operation returns an uinteger.

{{% note %}}
When operating with uinteger operands, fractional results are truncated at the decimal.
{{% /note %}}

```js
uint(v: 1) + uint(v: 45)
// Returns 46

uint(v: 1) - uint(v: 45)
// Returns 18446744073709551572

uint(v: 12) * uint(v: 100)
// Returns 1200

uint(v: 100) / uint(v: 200)
// Returns 0

uint(v: 10) ^ uint(v: 2)
// Returns 100
```

### Perform bitwise operations on uintegers
Use the [`experimental/bitwise` package](/flux/v0.x/stdlib/experimental/bitwise/)
to perform bitwise operations on uintegers.

```js
import "experimental/bitwise"

bitwise.uand(a: uint(v: 12), b: uint(v: 21))
// Returns 4

bitwise.uor(a: uint(v: 12), b: uint(v: 21))
// Returns 29

bitwise.uxor(a: uint(v: 12), b: uint(v: 21))
// Returns 25

bitwise.uclear(a: uint(v: 12), b: uint(v: 21))
// Returns 8

bitwise.unot(a: uint(v: 12))
// Returns 18446744073709551603

bitwise.ulshift(a: uint(v: 12), b: uint(v: 21))
// Returns 25165824

bitwise.urshift(a: uint(v: 21), b: uint(v: 4))
// Returns 1
```

### Compare uintegers
Use [Flux comparison operators](/flux/v0.x/spec/operators/#comparison-operators)
to compare uintegers.
Operands must be the same type.
The operation returns a boolean.

```js
uint(v: 12345600) == uint(v: 12345601)
// Returns false

uint(v: 2) > uint(v: -2)
// Returns false
```
