---
title: bitwise.slshift() function
description: >
  `bitwise.slshift()` shifts the bits in `a` left by `b` bits.
  Both `a` and `b` are integers.
menu:
  flux_v0_ref:
    name: bitwise.slshift
    parent: bitwise
    identifier: bitwise/slshift
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/bitwise/bitwise.flux#L366-L366

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`bitwise.slshift()` shifts the bits in `a` left by `b` bits.
Both `a` and `b` are integers.



##### Function type signature

```js
(a: int, b: int) => int
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### a
({{< req >}})
Left hand operand.



### b
({{< req >}})
Number of bits to shift.




## Examples

- [Shift bits left in an integer](#shift-bits-left-in-an-integer)
- [Shift bits left in integers in a stream of tables](#shift-bits-left-in-integers-in-a-stream-of-tables)

### Shift bits left in an integer

```js
import "bitwise"

bitwise.slshift(a: 1234, b: 2)// Returns 4936


```


### Shift bits left in integers in a stream of tables

```js
import "bitwise"
import "sampledata"

sampledata.int()
    |> map(fn: (r) => ({r with _value: bitwise.slshift(a: r._value, b: 3)}))

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | -2      | t1   |
| 2021-01-01T00:00:10Z | 10      | t1   |
| 2021-01-01T00:00:20Z | 7       | t1   |
| 2021-01-01T00:00:30Z | 17      | t1   |
| 2021-01-01T00:00:40Z | 15      | t1   |
| 2021-01-01T00:00:50Z | 4       | t1   |

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | 19      | t2   |
| 2021-01-01T00:00:10Z | 4       | t2   |
| 2021-01-01T00:00:20Z | -3      | t2   |
| 2021-01-01T00:00:30Z | 19      | t2   |
| 2021-01-01T00:00:40Z | 13      | t2   |
| 2021-01-01T00:00:50Z | 1       | t2   |


#### Output data

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | -16     | t1   |
| 2021-01-01T00:00:10Z | 80      | t1   |
| 2021-01-01T00:00:20Z | 56      | t1   |
| 2021-01-01T00:00:30Z | 136     | t1   |
| 2021-01-01T00:00:40Z | 120     | t1   |
| 2021-01-01T00:00:50Z | 32      | t1   |

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | 152     | t2   |
| 2021-01-01T00:00:10Z | 32      | t2   |
| 2021-01-01T00:00:20Z | -24     | t2   |
| 2021-01-01T00:00:30Z | 152     | t2   |
| 2021-01-01T00:00:40Z | 104     | t2   |
| 2021-01-01T00:00:50Z | 8       | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}
