---
title: integral() function
description: >
  `integral()` computes the area under the curve per unit of time of subsequent non-null records.
menu:
  flux_v0_ref:
    name: integral
    parent: universe
    identifier: universe/integral
weight: 101
flux/v0/tags: [transformations, aggregates]
introduced: 0.7.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/universe/universe.flux#L1101-L1110

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`integral()` computes the area under the curve per unit of time of subsequent non-null records.

`integral()` requires `_start` and `_stop` columns that are part of the group key.
The curve is defined using `_time` as the domain and record values as the range.

##### Function type signature

```js
(
    <-tables: stream[A],
    ?column: string,
    ?interpolate: string,
    ?timeColumn: string,
    ?unit: duration,
) => stream[B] where A: Record, B: Record
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### unit

Unit of time to use to compute the integral.



### column

Column to operate on. Default is `_value`.



### timeColumn

Column that contains time values to use in the operation.
Default is `_time`.



### interpolate

Type of interpolation to use. Default is `""`.

**Available interplation types**:
- linear
- _empty string for no interpolation_

### tables

Input data. Default is piped-forward data (`<-`).




## Examples

- [Calculate the integral](#calculate-the-integral)
- [Calculate the integral with linear interpolation](#calculate-the-integral-with-linear-interpolation)

### Calculate the integral

```js
data
    |> integral(unit: 10s)

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
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | t1   | 50      |

| *_start              | *_stop               | *tag | _value  |
| -------------------- | -------------------- | ---- | ------- |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | t2   | 43      |

{{% /expand %}}
{{< /expand-wrapper >}}

### Calculate the integral with linear interpolation

```js
data
    |> integral(unit: 10s, interpolate: "linear")

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| *_start              | *_stop               | _time                | _value  | *tag |
| -------------------- | -------------------- | -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:00Z | -2      | t1   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:10Z |         | t1   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:20Z | 7       | t1   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:30Z |         | t1   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:40Z |         | t1   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:50Z | 4       | t1   |

| *_start              | *_stop               | _time                | _value  | *tag |
| -------------------- | -------------------- | -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:00Z |         | t2   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:10Z | 4       | t2   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:20Z | -3      | t2   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:30Z | 19      | t2   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:40Z |         | t2   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:50Z | 1       | t2   |


#### Output data

| *_start              | *_stop               | *tag | _value  |
| -------------------- | -------------------- | ---- | ------- |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | t1   | 25      |

| *_start              | *_stop               | *tag | _value  |
| -------------------- | -------------------- | ---- | ------- |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | t2   | 32.5    |

{{% /expand %}}
{{< /expand-wrapper >}}
