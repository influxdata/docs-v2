---
title: bitwise.uclear() function
description: >
  `bitwise.uclear()` performs the bitwise operation `a AND NOT b`, with unsigned integers.
menu:
  flux_0_x_ref:
    name: bitwise.uclear
    parent: experimental/bitwise
    identifier: experimental/bitwise/uclear
weight: 201
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/experimental/bitwise/bitwise.flux#L147-L147

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`bitwise.uclear()` performs the bitwise operation `a AND NOT b`, with unsigned integers.



##### Function type signature

```js
bitwise.uclear = (a: uint, b: uint) => uint
```

## Parameters

### a

({{< req >}})
Left hand operand.

### b

({{< req >}})
Bits to clear.


## Examples


### Perform a bitwise AND NOT operation

```js
import "experimental/bitwise"

bitwise.uclear(a: uint(v: 1234), b: uint(v: 4567))// Returns 1024 (uint)

```


### Perform a bitwise AND NOT operation on a stream of tables

```js
import "experimental/bitwise"
import "sampledata"

sampledata.uint()
    |> map(fn: (r) => ({r with _value: bitwise.uclear(a: r._value, b: uint(v: 3))}))
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
| 2021-01-01T00:00:00Z | 18446744073709551612 | t1   |
| 2021-01-01T00:00:10Z | 8                    | t1   |
| 2021-01-01T00:00:20Z | 4                    | t1   |
| 2021-01-01T00:00:30Z | 16                   | t1   |
| 2021-01-01T00:00:40Z | 12                   | t1   |
| 2021-01-01T00:00:50Z | 4                    | t1   |

| _time                | _value               | *tag |
| -------------------- | -------------------- | ---- |
| 2021-01-01T00:00:00Z | 16                   | t2   |
| 2021-01-01T00:00:10Z | 4                    | t2   |
| 2021-01-01T00:00:20Z | 18446744073709551612 | t2   |
| 2021-01-01T00:00:30Z | 16                   | t2   |
| 2021-01-01T00:00:40Z | 12                   | t2   |
| 2021-01-01T00:00:50Z | 0                    | t2   |

