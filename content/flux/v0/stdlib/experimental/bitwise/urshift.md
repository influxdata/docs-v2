---
title: bitwise.urshift() function
description: >
  `bitwise.urshift()` shifts the bits in `a` right by `b` bits.
  Both `a` and `b` are unsigned integers.
menu:
  flux_v0_ref:
    name: bitwise.urshift
    parent: experimental/bitwise
    identifier: experimental/bitwise/urshift
weight: 201
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/experimental/bitwise/bitwise.flux#L229-L229

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`bitwise.urshift()` shifts the bits in `a` right by `b` bits.
Both `a` and `b` are unsigned integers.

{{% warn %}}
#### Deprecated
Experimental `bitwise.urshift` is deprecated in favor of
[`bitwise.urshift`](/flux/v0/stdlib/bitwise/urshift/).
{{% /warn %}}

##### Function type signature

```js
(a: uint, b: uint) => uint
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### a
({{< req >}})
Left hand operand.



### b
({{< req >}})
Number of bits to shift.




## Examples

- [Shift bits right in an unsigned integer](#shift-bits-right-in-an-unsigned-integer)
- [Shift bits right in unsigned integers in a stream of tables](#shift-bits-right-in-unsigned-integers-in-a-stream-of-tables)

### Shift bits right in an unsigned integer

```js
import "experimental/bitwise"

bitwise.urshift(a: uint(v: 1234), b: uint(v: 2))// Returns 308 (uint)


```


### Shift bits right in unsigned integers in a stream of tables

```js
import "experimental/bitwise"
import "sampledata"

sampledata.uint()
    |> map(fn: (r) => ({r with _value: bitwise.urshift(a: r._value, b: uint(v: 3))}))

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

| _time                | _value              | *tag |
| -------------------- | ------------------- | ---- |
| 2021-01-01T00:00:00Z | 2305843009213693951 | t1   |
| 2021-01-01T00:00:10Z | 1                   | t1   |
| 2021-01-01T00:00:20Z | 0                   | t1   |
| 2021-01-01T00:00:30Z | 2                   | t1   |
| 2021-01-01T00:00:40Z | 1                   | t1   |
| 2021-01-01T00:00:50Z | 0                   | t1   |

| _time                | _value              | *tag |
| -------------------- | ------------------- | ---- |
| 2021-01-01T00:00:00Z | 2                   | t2   |
| 2021-01-01T00:00:10Z | 0                   | t2   |
| 2021-01-01T00:00:20Z | 2305843009213693951 | t2   |
| 2021-01-01T00:00:30Z | 2                   | t2   |
| 2021-01-01T00:00:40Z | 1                   | t2   |
| 2021-01-01T00:00:50Z | 0                   | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}
