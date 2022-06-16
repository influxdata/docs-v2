---
title: math package
description: >
  The `math` package provides basic constants and mathematical functions
menu:
  flux_0_x_ref:
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

The `math` package provides basic constants and mathematical functions
Import the `math` package:

```js
import "math"
```
## Constants

```js
math.builtin e // e represents the base of the natural logarithm, also known as Euler's number.
math.builtin ln10 // ln10 represents the natural logarithm of 10.
math.builtin ln2 // ln2 represents the natural logarithm of 2.
math.builtin log10e // log10e represents the base 10 logarithm of **e** (`math.e`).
math.builtin log2e // log2e represents the base 2 logarithm of **e** (`math.e`).
math.builtin maxfloat // maxfloat represents the maximum float value.
math.builtin maxint // maxint represents the maximum integer value (`2^63 - 1`).
math.builtin maxuint // maxuint representes the maximum unsigned integer value  (`2^64 - 1`).
math.builtin minint // minint represents the minimum integer value (`-2^63`).
math.builtin phi // phi represents the [Golden Ratio](https://www.britannica.com/science/golden-ratio).
math.builtin pi // pi represents pi (π).
math.builtin smallestNonzeroFloat // smallestNonzeroFloat represents the smallest nonzero float value.
math.builtin sqrt2 // sqrt2 represents the square root of 2.
math.builtin sqrte // sqrte represents the square root of **e** (`math.e`).
math.builtin sqrtphi // sqrtphi represents the square root of phi (`math.phi`), the Golden Ratio.
math.builtin sqrtpi // sqrtpi represents the square root of pi (π).
```
## Functions

{{< children type="functions" show="pages" >}}
