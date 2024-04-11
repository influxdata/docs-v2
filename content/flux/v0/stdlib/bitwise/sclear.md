---
title: bitwise.sclear() function
description: >
  `bitwise.sclear()` performs the bitwise operation `a AND NOT b`.
  Both `a` and `b` are integers.
menu:
  flux_v0_ref:
    name: bitwise.sclear
    parent: bitwise
    identifier: bitwise/sclear
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/bitwise/bitwise.flux#L338-L338

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`bitwise.sclear()` performs the bitwise operation `a AND NOT b`.
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
Bits to clear.




## Examples

- [Perform a bitwise AND NOT operation](#perform-a-bitwise-and-not-operation)
- [Perform a bitwise AND NOT operation on a stream of tables](#perform-a-bitwise-and-not-operation-on-a-stream-of-tables)

### Perform a bitwise AND NOT operation

```js
import "bitwise"

bitwise.sclear(a: 1234, b: 4567)// Returns 1024


```


### Perform a bitwise AND NOT operation on a stream of tables

```js
import "bitwise"
import "sampledata"

sampledata.int()
    |> map(fn: (r) => ({r with _value: bitwise.sclear(a: r._value, b: 3)}))

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
| 2021-01-01T00:00:00Z | -4      | t1   |
| 2021-01-01T00:00:10Z | 8       | t1   |
| 2021-01-01T00:00:20Z | 4       | t1   |
| 2021-01-01T00:00:30Z | 16      | t1   |
| 2021-01-01T00:00:40Z | 12      | t1   |
| 2021-01-01T00:00:50Z | 4       | t1   |

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | 16      | t2   |
| 2021-01-01T00:00:10Z | 4       | t2   |
| 2021-01-01T00:00:20Z | -4      | t2   |
| 2021-01-01T00:00:30Z | 16      | t2   |
| 2021-01-01T00:00:40Z | 12      | t2   |
| 2021-01-01T00:00:50Z | 0       | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}
