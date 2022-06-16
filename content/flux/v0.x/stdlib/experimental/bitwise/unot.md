---
title: bitwise.unot() function
description: >
  `bitwise.unot()` inverts every bit in `a`, an unsigned integer.
menu:
  flux_0_x_ref:
    name: bitwise.unot
    parent: experimental/bitwise
    identifier: experimental/bitwise/unot
weight: 201
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/experimental/bitwise/bitwise.flux#L93-L93

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`bitwise.unot()` inverts every bit in `a`, an unsigned integer.



##### Function type signature

```js
bitwise.unot = (a: uint) => uint
```

## Parameters

### a

({{< req >}})
Unsigned integer to invert.


## Examples


### Invert bits in an unsigned integer

```js
import "experimental/bitwise"

bitwise.unot(a: uint(v: 1234))// Returns 18446744073709550381 (uint)

```


### Invert bits in unsigned integers in a stream of tables

```js
import "experimental/bitwise"
import "sampledata"

sampledata.uint()
    |> map(fn: (r) => ({r with _value: bitwise.unot(a: r._value)}))
```

#### Input data

| _time                | _value               | *tag |
| -------------------- | -------------------- | ---- |
| 2021-01-01T00:00:00Z | 18446744073709551614 | t1   |
| 2021-01-01T00:00:10Z | 10                   | t1   |
| 2021-01-01T00:00:20Z | 7                    | t1   |
| 2021-01-01T00:00:30Z | 17                   | t1   |
| 2021-01-01T00:00:40Z | 15                   | t1   |
| 2021-01-01T00:00:50Z | 4                    | t1   |

| _time                | _value               | *tag |
| -------------------- | -------------------- | ---- |
| 2021-01-01T00:00:00Z | 19                   | t2   |
| 2021-01-01T00:00:10Z | 4                    | t2   |
| 2021-01-01T00:00:20Z | 18446744073709551613 | t2   |
| 2021-01-01T00:00:30Z | 19                   | t2   |
| 2021-01-01T00:00:40Z | 13                   | t2   |
| 2021-01-01T00:00:50Z | 1                    | t2   |


#### Output data

| _time                | _value               | *tag |
| -------------------- | -------------------- | ---- |
| 2021-01-01T00:00:00Z | 1                    | t1   |
| 2021-01-01T00:00:10Z | 18446744073709551605 | t1   |
| 2021-01-01T00:00:20Z | 18446744073709551608 | t1   |
| 2021-01-01T00:00:30Z | 18446744073709551598 | t1   |
| 2021-01-01T00:00:40Z | 18446744073709551600 | t1   |
| 2021-01-01T00:00:50Z | 18446744073709551611 | t1   |

| _time                | _value               | *tag |
| -------------------- | -------------------- | ---- |
| 2021-01-01T00:00:00Z | 18446744073709551596 | t2   |
| 2021-01-01T00:00:10Z | 18446744073709551611 | t2   |
| 2021-01-01T00:00:20Z | 2                    | t2   |
| 2021-01-01T00:00:30Z | 18446744073709551596 | t2   |
| 2021-01-01T00:00:40Z | 18446744073709551602 | t2   |
| 2021-01-01T00:00:50Z | 18446744073709551614 | t2   |

