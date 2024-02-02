---
title: math package
description: >
  The `math` package provides basic constants and mathematical functions.
menu:
  flux_v0_ref:
    name: math 
    parent: stdlib
    identifier: math
weight: 11
cascade:

  introduced: 0.22.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the comments above the package
declaration in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/math/math.flux

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

The `math` package provides basic constants and mathematical functions.
Import the `math` package:

```js
import "math"
```

## Constants

```js
math.e
math.ln10
math.ln2
math.log10e
math.log2e
math.maxfloat
math.maxint
math.maxuint
math.minint
math.phi
math.pi
math.smallestNonzeroFloat
math.sqrt2
math.sqrte
math.sqrtphi
math.sqrtpi
```

- **math.e** represents the base of the natural logarithm, also known as Euler's number.
- **math.ln10** represents the natural logarithm of 10.
- **math.ln2** represents the natural logarithm of 2.
- **math.log10e** represents the base 10 logarithm of **e** (`math.e`).
- **math.log2e** represents the base 2 logarithm of **e** (`math.e`).
- **math.maxfloat** represents the maximum float value.
- **math.maxint** represents the maximum integer value (`2^63 - 1`).
- **math.maxuint** represents the maximum unsigned integer value  (`2^64 - 1`).
- **math.minint** represents the minimum integer value (`-2^63`).
- **math.phi** represents the [Golden Ratio](https://www.britannica.com/science/golden-ratio).
- **math.pi** represents pi (π).
- **math.smallestNonzeroFloat** represents the smallest nonzero float value.
- **math.sqrt2** represents the square root of 2.
- **math.sqrte** represents the square root of **e** (`math.e`).
- **math.sqrtphi** represents the square root of phi (`math.phi`), the Golden Ratio.
- **math.sqrtpi** represents the square root of pi (π).


## Functions

{{< children type="functions" show="pages" >}}
