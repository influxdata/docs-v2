---
title: bitwise.uand() function
description: >
  `bitwise.uand()` performs the bitwise operation, `a AND b`, with unsigned integers.
menu:
  flux_v0_ref:
    name: bitwise.uand
    parent: experimental/bitwise
    identifier: experimental/bitwise/uand
weight: 201
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/experimental/bitwise/bitwise.flux#L48-L48

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`bitwise.uand()` performs the bitwise operation, `a AND b`, with unsigned integers.

{{% warn %}}
#### Deprecated
Experimental `bitwise.uand` is deprecated in favor of
[`bitwise.uand`](/flux/v0/stdlib/bitwise/uand/).
{{% /warn %}}

##### Function type signature

```js
(a: uint, b: uint) => uint
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
Right hand operand.




## Examples

- [Perform a bitwise AND operation](#perform-a-bitwise-and-operation)
- [Perform a bitwise AND operation on a stream of tables](#perform-a-bitwise-and-operation-on-a-stream-of-tables)

### Perform a bitwise AND operation

```js
import "experimental/bitwise"

bitwise.uand(a: uint(v: 1234), b: uint(v: 4567))// Returns 210 (uint)


```


### Perform a bitwise AND operation on a stream of tables

```js
import "experimental/bitwise"
import "sampledata"

sampledata.uint()
    |> map(fn: (r) => ({r with _value: bitwise.uand(a: r._value, b: uint(v: 3))}))

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

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | 2       | t1   |
| 2021-01-01T00:00:10Z | 2       | t1   |
| 2021-01-01T00:00:20Z | 3       | t1   |
| 2021-01-01T00:00:30Z | 1       | t1   |
| 2021-01-01T00:00:40Z | 3       | t1   |
| 2021-01-01T00:00:50Z | 0       | t1   |

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | 3       | t2   |
| 2021-01-01T00:00:10Z | 0       | t2   |
| 2021-01-01T00:00:20Z | 1       | t2   |
| 2021-01-01T00:00:30Z | 3       | t2   |
| 2021-01-01T00:00:40Z | 1       | t2   |
| 2021-01-01T00:00:50Z | 1       | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}
