---
title: experimental.integral() function
description: >
  `experimental.integral()` computes the area under the curve per unit of time of subsequent non-null records.
menu:
  flux_v0_ref:
    name: experimental.integral
    parent: experimental
    identifier: experimental/integral
weight: 101
flux/v0/tags: [transformations, aggregates]
introduced: 0.106.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/experimental/experimental.flux#L648-L652

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`experimental.integral()` computes the area under the curve per unit of time of subsequent non-null records.

The curve is defined using `_time` as the domain and record values as the range.

Input tables must have `_start`, _stop`, `_time`, and `_value` columns.
`_start` and `_stop` must be part of the group key.

##### Function type signature

```js
(<-tables: stream[{A with _value: B, _time: time}], ?interpolate: string, ?unit: duration) => stream[{A with _value: B}]
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### unit

Time duration used to compute the integral.



### interpolate

Type of interpolation to use. Default is `""` (no interpolation).

Use one of the following interpolation options:
- empty string (`""`) for no interpolation
- linear

### tables

Input data. Default is piped-forward data (`<-`).




## Examples

- [Calculate the integral](#calculate-the-integral)
- [Calculate the integral with linear interpolation](#calculate-the-integral-with-linear-interpolation)

### Calculate the integral

```js
import "experimental"
import "sampledata"

data =
    sampledata.int()
        |> range(start: sampledata.start, stop: sampledata.stop)

data
    |> experimental.integral(unit: 20s)

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| *_start              | *_stop               | _time                | _value  | *tag |
| -------------------- | -------------------- | -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:00Z | -2      | t1   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:10Z | 10      | t1   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:20Z | 7       | t1   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:30Z | 17      | t1   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:40Z | 15      | t1   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:50Z | 4       | t1   |

| *_start              | *_stop               | _time                | _value  | *tag |
| -------------------- | -------------------- | -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:00Z | 19      | t2   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:10Z | 4       | t2   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:20Z | -3      | t2   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:30Z | 19      | t2   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:40Z | 13      | t2   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:50Z | 1       | t2   |


#### Output data

| *_start              | *_stop               | *tag | _value  |
| -------------------- | -------------------- | ---- | ------- |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | t1   | 25      |

| *_start              | *_stop               | *tag | _value  |
| -------------------- | -------------------- | ---- | ------- |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | t2   | 21.5    |

{{% /expand %}}
{{< /expand-wrapper >}}

### Calculate the integral with linear interpolation

```js
import "experimental"
import "sampledata"

data =
    sampledata.int()
        |> range(start: sampledata.start, stop: sampledata.stop)

data
    |> experimental.integral(unit: 20s, interpolate: "linear")

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| *_start              | *_stop               | _time                | _value  | *tag |
| -------------------- | -------------------- | -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:00Z | -2      | t1   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:10Z | 10      | t1   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:20Z | 7       | t1   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:30Z | 17      | t1   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:40Z | 15      | t1   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:50Z | 4       | t1   |

| *_start              | *_stop               | _time                | _value  | *tag |
| -------------------- | -------------------- | -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:00Z | 19      | t2   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:10Z | 4       | t2   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:20Z | -3      | t2   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:30Z | 19      | t2   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:40Z | 13      | t2   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:50Z | 1       | t2   |


#### Output data

| *_start              | *_stop               | *tag | _value  |
| -------------------- | -------------------- | ---- | ------- |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | t1   | 24.25   |

| *_start              | *_stop               | *tag | _value  |
| -------------------- | -------------------- | ---- | ------- |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | t2   | 19      |

{{% /expand %}}
{{< /expand-wrapper >}}
