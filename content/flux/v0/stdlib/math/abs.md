---
title: math.abs() function
description: >
  `math.abs()` returns the absolute value of `x`.
menu:
  flux_v0_ref:
    name: math.abs
    parent: math
    identifier: math/abs
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/math/math.flux#L86-L86

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`math.abs()` returns the absolute value of `x`.



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

- [Return the absolute value](#return-the-absolute-value)
- [Use math.abs in map](#use-mathabs-in-map)

### Return the absolute value

```js
math.abs(x: -1.22)// 1.22


```


### Use math.abs in map

```js
sampledata.float()
    |> map(fn: (r) => ({r with _value: math.abs(x: r._value)}))

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
| 2021-01-01T00:00:00Z | 2.18    | t1   |
| 2021-01-01T00:00:10Z | 10.92   | t1   |
| 2021-01-01T00:00:20Z | 7.35    | t1   |
| 2021-01-01T00:00:30Z | 17.53   | t1   |
| 2021-01-01T00:00:40Z | 15.23   | t1   |
| 2021-01-01T00:00:50Z | 4.43    | t1   |

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | 19.85   | t2   |
| 2021-01-01T00:00:10Z | 4.97    | t2   |
| 2021-01-01T00:00:20Z | 3.75    | t2   |
| 2021-01-01T00:00:30Z | 19.77   | t2   |
| 2021-01-01T00:00:40Z | 13.86   | t2   |
| 2021-01-01T00:00:50Z | 1.86    | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}
