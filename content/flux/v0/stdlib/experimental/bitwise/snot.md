---
title: bitwise.snot() function
description: >
  `bitwise.snot()` inverts every bit in `a`, an integer.
menu:
  flux_v0_ref:
    name: bitwise.snot
    parent: experimental/bitwise
    identifier: experimental/bitwise/snot
weight: 201
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/experimental/bitwise/bitwise.flux#L318-L318

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`bitwise.snot()` inverts every bit in `a`, an integer.

{{% warn %}}
#### Deprecated
Experimental `bitwise.snot` is deprecated in favor of
[`bitwise.snot`](/flux/v0/stdlib/bitwise/snot/).
{{% /warn %}}

##### Function type signature

```js
(a: int) => int
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### a
({{< req >}})
Integer to invert.




## Examples

- [Invert bits in an integer](#invert-bits-in-an-integer)
- [Invert bits in integers in a stream of tables](#invert-bits-in-integers-in-a-stream-of-tables)

### Invert bits in an integer

```js
import "experimental/bitwise"

bitwise.snot(a: 1234)// Returns -1235


```


### Invert bits in integers in a stream of tables

```js
import "experimental/bitwise"
import "sampledata"

sampledata.int()
    |> map(fn: (r) => ({r with _value: bitwise.snot(a: r._value)}))

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
| 2021-01-01T00:00:00Z | 1       | t1   |
| 2021-01-01T00:00:10Z | -11     | t1   |
| 2021-01-01T00:00:20Z | -8      | t1   |
| 2021-01-01T00:00:30Z | -18     | t1   |
| 2021-01-01T00:00:40Z | -16     | t1   |
| 2021-01-01T00:00:50Z | -5      | t1   |

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | -20     | t2   |
| 2021-01-01T00:00:10Z | -5      | t2   |
| 2021-01-01T00:00:20Z | 2       | t2   |
| 2021-01-01T00:00:30Z | -20     | t2   |
| 2021-01-01T00:00:40Z | -14     | t2   |
| 2021-01-01T00:00:50Z | -2      | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}
