---
title: math.ceil() function
description: >
  `math.ceil()` returns the least integer value greater than or equal to `x`.
menu:
  flux_v0_ref:
    name: math.ceil
    parent: math
    identifier: math/ceil
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/math/math.flux#L429-L429

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`math.ceil()` returns the least integer value greater than or equal to `x`.



##### Function type signature

```js
(x: float) => float
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### x
({{< req >}})
Value to operate on.




## Examples

- [Round a value up to the nearest integer](#round-a-value-up-to-the-nearest-integer)
- [Use math.ceil in map](#use-mathceil-in-map)

### Round a value up to the nearest integer

```js
import "math"

math.ceil(x: 3.14)// 4.0


```


### Use math.ceil in map

```js
import "math"
import "sampledata"

sampledata.float()
    |> map(fn: (r) => ({r with _value: math.ceil(x: r._value)}))

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| _time                | *tag | _value  |
| -------------------- | ---- | ------- |
| 2021-01-01T00:00:00Z | t1   | -2.18   |
| 2021-01-01T00:00:10Z | t1   | 10.92   |
| 2021-01-01T00:00:20Z | t1   | 7.35    |
| 2021-01-01T00:00:30Z | t1   | 17.53   |
| 2021-01-01T00:00:40Z | t1   | 15.23   |
| 2021-01-01T00:00:50Z | t1   | 4.43    |

| _time                | *tag | _value  |
| -------------------- | ---- | ------- |
| 2021-01-01T00:00:00Z | t2   | 19.85   |
| 2021-01-01T00:00:10Z | t2   | 4.97    |
| 2021-01-01T00:00:20Z | t2   | -3.75   |
| 2021-01-01T00:00:30Z | t2   | 19.77   |
| 2021-01-01T00:00:40Z | t2   | 13.86   |
| 2021-01-01T00:00:50Z | t2   | 1.86    |


#### Output data

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | -2      | t1   |
| 2021-01-01T00:00:10Z | 11      | t1   |
| 2021-01-01T00:00:20Z | 8       | t1   |
| 2021-01-01T00:00:30Z | 18      | t1   |
| 2021-01-01T00:00:40Z | 16      | t1   |
| 2021-01-01T00:00:50Z | 5       | t1   |

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | 20      | t2   |
| 2021-01-01T00:00:10Z | 5       | t2   |
| 2021-01-01T00:00:20Z | -3      | t2   |
| 2021-01-01T00:00:30Z | 20      | t2   |
| 2021-01-01T00:00:40Z | 14      | t2   |
| 2021-01-01T00:00:50Z | 2       | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}
