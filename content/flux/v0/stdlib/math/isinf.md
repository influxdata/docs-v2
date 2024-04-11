---
title: math.isInf() function
description: >
  `math.isInf()` reports whether `f` is an infinity, according to `sign`.
menu:
  flux_v0_ref:
    name: math.isInf
    parent: math
    identifier: math/isInf
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/math/math.flux#L1131-L1131

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`math.isInf()` reports whether `f` is an infinity, according to `sign`.

If `sign > 0`, math.isInf reports whether `f` is positive infinity.
If `sign < 0`, math.isInf reports whether `f` is negative infinity.
If `sign  == 0`, math.isInf reports whether `f` is either infinity.

##### Function type signature

```js
(f: float, sign: int) => bool
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### f
({{< req >}})
is the value used in the evaluation.



### sign
({{< req >}})
is the sign used in the evaluation.




## Examples

- [Test if a value is an infinity value](#test-if-a-value-is-an-infinity-value)
- [Use math.isInf in map](#use-mathisinf-in-map)

### Test if a value is an infinity value

```js
import "math"

math.isInf(f: 2.12, sign: 3)// false


```


### Use math.isInf in map

```js
import "math"

data
    |> map(fn: (r) => ({r with _value: math.isInf(f: r._value, sign: 1)}))

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| _time                | *tag | _value  |
| -------------------- | ---- | ------- |
| 2021-01-01T00:00:00Z | t1   | -2.18   |
| 2021-01-01T00:00:10Z | t1   | +Inf    |
| 2021-01-01T00:00:20Z | t1   | 7.35    |
| 2021-01-01T00:00:30Z | t1   | +Inf    |
| 2021-01-01T00:00:40Z | t1   | +Inf    |
| 2021-01-01T00:00:50Z | t1   | 4.43    |

| _time                | *tag | _value  |
| -------------------- | ---- | ------- |
| 2021-01-01T00:00:00Z | t2   | +Inf    |
| 2021-01-01T00:00:10Z | t2   | 4.97    |
| 2021-01-01T00:00:20Z | t2   | -3.75   |
| 2021-01-01T00:00:30Z | t2   | 19.77   |
| 2021-01-01T00:00:40Z | t2   | +Inf    |
| 2021-01-01T00:00:50Z | t2   | 1.86    |


#### Output data

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | false   | t1   |
| 2021-01-01T00:00:10Z | true    | t1   |
| 2021-01-01T00:00:20Z | false   | t1   |
| 2021-01-01T00:00:30Z | true    | t1   |
| 2021-01-01T00:00:40Z | true    | t1   |
| 2021-01-01T00:00:50Z | false   | t1   |

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | true    | t2   |
| 2021-01-01T00:00:10Z | false   | t2   |
| 2021-01-01T00:00:20Z | false   | t2   |
| 2021-01-01T00:00:30Z | false   | t2   |
| 2021-01-01T00:00:40Z | true    | t2   |
| 2021-01-01T00:00:50Z | false   | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}
