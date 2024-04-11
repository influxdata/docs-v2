---
title: math.signbit() function
description: >
  `math.signbit()` reports whether `x` is negative or negative zero.
menu:
  flux_v0_ref:
    name: math.signbit
    parent: math
    identifier: math/signbit
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/math/math.flux#L1961-L1961

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`math.signbit()` reports whether `x` is negative or negative zero.



##### Function type signature

```js
(x: float) => bool
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### x
({{< req >}})
Value to evaluate.




## Examples

- [Test if a value is negative](#test-if-a-value-is-negative)
- [Use math.signbit in map](#use-mathsignbit-in-map)

### Test if a value is negative

```js
import "math"

math.signbit(x: -1.2)// true


```


### Use math.signbit in map

```js
import "math"

data
    |> map(fn: (r) => ({r with _value: math.signbit(x: r._value)}))

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| _time                | *tag | _value  |
| -------------------- | ---- | ------- |
| 2021-01-01T00:00:00Z | t1   | -2.18   |
| 2021-01-01T00:00:10Z | t1   | -0      |
| 2021-01-01T00:00:20Z | t1   | 7.35    |
| 2021-01-01T00:00:30Z | t1   | -0      |
| 2021-01-01T00:00:40Z | t1   | -0      |
| 2021-01-01T00:00:50Z | t1   | 4.43    |

| _time                | *tag | _value  |
| -------------------- | ---- | ------- |
| 2021-01-01T00:00:00Z | t2   | -0      |
| 2021-01-01T00:00:10Z | t2   | 4.97    |
| 2021-01-01T00:00:20Z | t2   | -3.75   |
| 2021-01-01T00:00:30Z | t2   | 19.77   |
| 2021-01-01T00:00:40Z | t2   | -0      |
| 2021-01-01T00:00:50Z | t2   | 1.86    |


#### Output data

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | true    | t1   |
| 2021-01-01T00:00:10Z | true    | t1   |
| 2021-01-01T00:00:20Z | false   | t1   |
| 2021-01-01T00:00:30Z | true    | t1   |
| 2021-01-01T00:00:40Z | true    | t1   |
| 2021-01-01T00:00:50Z | false   | t1   |

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | true    | t2   |
| 2021-01-01T00:00:10Z | false   | t2   |
| 2021-01-01T00:00:20Z | true    | t2   |
| 2021-01-01T00:00:30Z | false   | t2   |
| 2021-01-01T00:00:40Z | true    | t2   |
| 2021-01-01T00:00:50Z | false   | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}
