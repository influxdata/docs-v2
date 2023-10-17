---
title: bitwise.unot() function
description: >
  `bitwise.unot()` inverts every bit in `a`, an unsigned integer.
menu:
  flux_v0_ref:
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

https://github.com/influxdata/flux/blob/master/stdlib/experimental/bitwise/bitwise.flux#L107-L107

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`bitwise.unot()` inverts every bit in `a`, an unsigned integer.

{{% warn %}}
#### Deprecated
Experimental `bitwise.unot` is deprecated in favor of
[`bitwise.unot`](/flux/v0/stdlib/bitwise/unot/).
{{% /warn %}}

##### Function type signature

```js
(a: uint) => uint
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### a
({{< req >}})
Unsigned integer to invert.




## Examples

- [Invert bits in an unsigned integer](#invert-bits-in-an-unsigned-integer)
- [Invert bits in unsigned integers in a stream of tables](#invert-bits-in-unsigned-integers-in-a-stream-of-tables)

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

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

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

{{% /expand %}}
{{< /expand-wrapper >}}
