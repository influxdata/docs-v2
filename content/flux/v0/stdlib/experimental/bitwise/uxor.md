---
title: bitwise.uxor() function
description: >
  `bitwise.uxor()` performs the bitwise operation, `a XOR b`, with unsigned integers.
menu:
  flux_v0_ref:
    name: bitwise.uxor
    parent: experimental/bitwise
    identifier: experimental/bitwise/uxor
weight: 201
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/experimental/bitwise/bitwise.flux#L137-L137

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`bitwise.uxor()` performs the bitwise operation, `a XOR b`, with unsigned integers.

{{% warn %}}
#### Deprecated
Experimental `bitwise.uxor` is deprecated in favor of
[`bitwise.uxor`](/flux/v0/stdlib/bitwise/uxor/).
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

- [Perform a bitwise XOR operation](#perform-a-bitwise-xor-operation)
- [Perform a bitwise XOR operation on a stream of tables](#perform-a-bitwise-xor-operation-on-a-stream-of-tables)

### Perform a bitwise XOR operation

```js
import "experimental/bitwise"

bitwise.uxor(a: uint(v: 1234), b: uint(v: 4567))// Returns 5381 (uint)


```


### Perform a bitwise XOR operation on a stream of tables

```js
import "experimental/bitwise"
import "sampledata"

sampledata.uint()
    |> map(fn: (r) => ({r with _value: bitwise.uxor(a: r._value, b: uint(v: 3))}))

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
| 2021-01-01T00:00:00Z | 18446744073709551613 | t1   |
| 2021-01-01T00:00:10Z | 9                    | t1   |
| 2021-01-01T00:00:20Z | 4                    | t1   |
| 2021-01-01T00:00:30Z | 18                   | t1   |
| 2021-01-01T00:00:40Z | 12                   | t1   |
| 2021-01-01T00:00:50Z | 7                    | t1   |

| _time                | _value               | *tag |
| -------------------- | -------------------- | ---- |
| 2021-01-01T00:00:00Z | 16                   | t2   |
| 2021-01-01T00:00:10Z | 7                    | t2   |
| 2021-01-01T00:00:20Z | 18446744073709551614 | t2   |
| 2021-01-01T00:00:30Z | 16                   | t2   |
| 2021-01-01T00:00:40Z | 14                   | t2   |
| 2021-01-01T00:00:50Z | 2                    | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}
