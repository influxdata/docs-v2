---
title: Work with floats
list_title: Float
description: >
  Learn how to work with float types in Flux.
menu:
  flux_0_x:
    name: Float
    parent: Basic types
weight: 202
flux/v0.x/tags: ["basic types", "numeric types", "data types"]
---

A **float** type represents all [IEEE-754](https://standards.ieee.org/standard/754-2019.html)
64-bit floating-point numbers.

**Type name:** `float`

###### On this page:
- [Float syntax](#float-syntax)
- [Convert data types to floats](#convert-data-types-to-floats)
- [Operate on floats](#operate-on-floats)

## Float syntax
A decimal floating-point value literal contains a decimal integer, a decimal point,
and a decimal fraction. 

```js
0.0
123.4
-123.456
```

- [Scientific notation](#scientific-notation)
- [Infinity](#infinity)
- [Not a Number (NaN)](#not-a-number)

### Scientific notation
Flux does not support scientific notation float literal syntax.
However you can use [`float()`]((/flux/v0.x/stdlib/universe/float/)) to convert
a **scientific notation string** into a float type.

```js
1.23456e+78
// Error: error @1:8-1:9: undefined identifier e

float(v: "1.23456e+78")
// Returns 1.23456e+78 (float)
```

### Infinity
Flux does not support infinite float literal syntax (`+Inf` and `-Inf`).
However you can use [`float()`]((/flux/v0.x/stdlib/universe/float/)) to convert
a **infinite string** into a float type.

```js
+Inf
// Error: error @1:2-1:5: undefined identifier Inf

float(v: "+Inf")
// Returns +Inf (float)
```

### Not a Number
Flux does not support Not a Number (NaN) float literal syntax.
However you can use [`float()`]((/flux/v0.x/stdlib/universe/float/)) to convert
a **NaN string** into a float type.

```js
NaN
// Error: error @1:2-1:5: undefined identifier NaN

float(v: "NaN")
// Returns NaN (float)
```

## Convert data types to floats
Use the [`float()` function](/flux/v0.x/stdlib/universe/float/) to convert
the following [basic types](/flux/v0.x/data-types/basic/) to floats:

- **string**: must be a numeric string or [scientific notation](#scientific-notation)
- **bool**: `true` converts to `1.0`, `false` converts to `0.0`
- **int**
- **uint**

```js
float(v: "1.23")
// 1.23

float(v: true)
// Returns 1.0

float(v: 123)
// Returns 123.0
```

### Convert columns to floats

#### Convert the \_value column to floats
Use the [`toFloat()` function](/flux/v0.x/stdlib/universe/tofloat/) to convert
the `_value` column to floats.

```js
data
  |> toFloat()
```

{{< flex >}}
{{% flex-content %}}
##### Given the following input:
| \_time               | \_value _<span style="opacity:.5">(int)</span>_ |
| :------------------- | ----------------------------------------------: |
| 2021-01-01T00:00:00Z |                                              10 |
| 2021-01-01T02:00:00Z |                                              20 |
| 2021-01-01T03:00:00Z |                                              30 |
| 2021-01-01T04:00:00Z |                                              40 |
{{% /flex-content %}}

{{% flex-content %}}
##### The example above returns:
| \_time               | \_value _<span style="opacity:.5">(float)</span>_ |
| :------------------- | ------------------------------------------------: |
| 2021-01-01T00:00:00Z |                                              10.0 |
| 2021-01-01T02:00:00Z |                                              20.0 |
| 2021-01-01T03:00:00Z |                                              30.0 |
| 2021-01-01T04:00:00Z |                                              40.0 |
{{% /flex-content %}}
{{< /flex >}}

#### Convert other columns to floats
To convert columns other than `_value` to floats:

1. Use [`map()`](/flux/v0.x/stdlib/universe/map/) to iterate over and rewrite rows.
2. Use [`float()`](/flux/v0.x/stdlib/universe/float/) to convert columns values to floats.

```js
data
  |> map(fn: (r) => ({ r with index: float(v: r.index) }))
```

{{< flex >}}
{{% flex-content %}}
##### Given the following input:
| \_time               | index _<span style="opacity:.5">(int)</span>_ |
| :------------------- | --------------------------------------------: |
| 2021-01-01T00:00:00Z |                                             1 |
| 2021-01-01T02:00:00Z |                                             2 |
| 2021-01-01T03:00:00Z |                                             3 |
| 2021-01-01T04:00:00Z |                                             4 |
{{% /flex-content %}}

{{% flex-content %}}
##### The example above returns:
| \_time               | index _<span style="opacity:.5">(float)</span>_ |
| :------------------- | ----------------------------------------------: |
| 2021-01-01T00:00:00Z |                                             1.0 |
| 2021-01-01T02:00:00Z |                                             2.0 |
| 2021-01-01T03:00:00Z |                                             3.0 |
| 2021-01-01T04:00:00Z |                                             4.0 |
{{% /flex-content %}}
{{< /flex >}}

## Operate on floats

- [Perform arithmetic operations on floats](#perform-arithmetic-operations-on-floats)
- [Compare float values](#compare-float-values)
- [Round float values](#round-float-values)
- [Flux math package](#flux-math-package)

### Perform arithmetic operations on floats
To perform operations like adding, subtracting, multiplying, or dividing float values,
use [Flux arithmetic operators](/flux/v0.x/spec/operators/#arithmetic-operators).
Operands must be the same type.

```js
1.23 + 45.67
// Returns 46.9

1.23 - 45.67
// Returns -44.440000000000005

float(v: "12345e+67") * 100.0
// Returns 1.2345000000000001e+73

144.0 / 12.0
// Returns 12.0

10.0 ^ 2.0
// Returns 100.0
```

{{% note %}}
#### Inherent rounding errors in floating-point arithmetic
To fit an infinite number of real values into a finite number of bits,
computer systems must round floating-point values in arithmetic operations.
This results in small rounding errors in some operations.
{{% /note %}}

### Compare float values
Use [Flux comparison operators](/flux/v0.x/spec/operators/#comparison-operators)
to compare float values.
Operands must be the same type.

```js
12345600.0 == float(v: "1.23456e+07")
// Returns true

1.2 > -2.1
// Returns true
```

### Round float values
1. Import the [`math` package](/flux/v0.x/stdlib/math/).
2. Use [`math.round()`](/flux/v0.x/stdlib/math/round/) to round to the nearest whole number.

```js
import "math"

math.round(x: 1.54)
// Returns 2.0
```

### Flux math package
Use the [`math` package](/flux/v0.x/stdlib/math/) to perform a number of
operations on float values.
